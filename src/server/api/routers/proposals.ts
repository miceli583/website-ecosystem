import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  accountManagerProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  portalUsers,
  clients,
  clientResources,
  proposalAgreementTemplates,
  proposalCheckouts,
  expenses,
  expenseCategories,
} from "~/server/db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { stripe } from "~/lib/stripe";
import {
  createMercuryInvoice,
  getMercuryAccounts,
  getMercuryTransactions,
  getMercuryInvoice,
} from "~/lib/mercury";
import { stripeLive } from "~/lib/stripe-live";
import { nanoid } from "nanoid";

// ============================================================================
// V2 PROPOSAL METADATA TYPES
// ============================================================================

interface ProposalLineItem {
  name: string;
  description?: string;
  qty: number;
  unitPrice: number; // cents
}

interface ProposalOption {
  id: string;
  name: string;
  description?: string;
  lineItems: ProposalLineItem[];
  paymentType: "one-time" | "recurring";
  recurringInterval?: "month" | "year";
  enabledPaymentMethods: ("credit" | "bank")[];
  totalPrice: number; // cents, computed from line items
}

interface CheckoutGroup {
  id: string;
  name: string;
  required: boolean;
  options: ProposalOption[];
}

export interface ProposalMetadataV2 {
  version: 2;
  status: "draft" | "sent" | "accepted" | "declined" | "partial";
  customerInfo?: {
    name?: string;
    email?: string;
    company?: string;
  };
  currency: string;
  checkoutGroups: CheckoutGroup[];
  richContent?: string; // TipTap HTML
  agreementTemplateIds?: number[];
  customTerms?: string; // freeform markdown
  validUntil?: string;
  notes?: string;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const lineItemSchema = z.object({
  name: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  qty: z.number().min(1).default(1),
  unitPrice: z.number().min(0), // cents
});

const optionSchema = z.object({
  id: z.string().default(() => nanoid(10)),
  name: z.string().min(1).max(300),
  description: z.string().max(5000).optional(),
  lineItems: z.array(lineItemSchema).min(1),
  paymentType: z.enum(["one-time", "recurring"]),
  recurringInterval: z.enum(["month", "year"]).optional(),
  enabledPaymentMethods: z.array(z.enum(["credit", "bank"])).min(1),
  totalPrice: z.number().min(0),
});

const checkoutGroupSchema = z.object({
  id: z.string().default(() => nanoid(10)),
  name: z.string().min(1).max(300),
  required: z.boolean().default(true),
  options: z.array(optionSchema).min(1),
});

// ============================================================================
// ROUTER
// ============================================================================

export const proposalsRouter = createTRPCRouter({
  // --------------------------------------------------------------------------
  // PROPOSAL CRUD
  // --------------------------------------------------------------------------

  /**
   * Create a v2 proposal (admin/AM only)
   */
  create: accountManagerProcedure
    .input(
      z.object({
        clientSlug: z.string().max(100),
        projectId: z.number().optional(),
        title: z.string().min(1).max(500),
        description: z.string().max(5000).optional(),
        checkoutGroups: z.array(checkoutGroupSchema).min(1),
        richContent: z.string().max(50000).optional(),
        agreementTemplateIds: z.array(z.number()).optional(),
        customTerms: z
          .string()
          .max(20000)
          .refine((s) => !/<[a-z/]/i.test(s), "HTML tags not allowed in terms")
          .optional(),
        currency: z.string().max(10).default("usd"),
        validUntil: z.string().optional(),
        status: z.enum(["draft", "sent"]).default("draft"),
        customerInfo: z
          .object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            company: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.clientSlug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      const metadata: ProposalMetadataV2 = {
        version: 2,
        status: input.status,
        currency: input.currency,
        checkoutGroups: input.checkoutGroups,
        richContent: input.richContent,
        agreementTemplateIds: input.agreementTemplateIds,
        customTerms: input.customTerms,
        validUntil: input.validUntil,
        customerInfo: input.customerInfo ?? {
          name: client.name,
          email: client.email,
          company: client.company ?? undefined,
        },
      };

      const [proposal] = await db
        .insert(clientResources)
        .values({
          clientId: client.id,
          projectId: input.projectId,
          section: "proposals",
          type: "proposal",
          title: input.title,
          description: input.description ?? null,
          metadata: metadata as unknown as Record<string, unknown>,
        })
        .returning();

      return proposal;
    }),

  /**
   * Update a v2 proposal (admin/AM only)
   */
  update: accountManagerProcedure
    .input(
      z.object({
        proposalId: z.number(),
        title: z.string().min(1).max(500).optional(),
        description: z.string().max(5000).optional(),
        projectId: z.number().nullable().optional(),
        checkoutGroups: z.array(checkoutGroupSchema).optional(),
        richContent: z.string().max(50000).optional(),
        agreementTemplateIds: z.array(z.number()).optional(),
        customTerms: z
          .string()
          .max(20000)
          .refine((s) => !/<[a-z/]/i.test(s), "HTML tags not allowed in terms")
          .optional(),
        currency: z.string().max(10).optional(),
        validUntil: z.string().nullable().optional(),
        customerInfo: z
          .object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            company: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const proposal = await db.query.clientResources.findFirst({
        where: and(
          eq(clientResources.id, input.proposalId),
          eq(clientResources.section, "proposals")
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      const existingMeta =
        proposal.metadata as unknown as ProposalMetadataV2 | null;

      // Check if there are paid checkouts — don't allow removing groups with paid checkouts
      if (input.checkoutGroups) {
        const paidCheckouts = await db.query.proposalCheckouts.findMany({
          where: and(
            eq(proposalCheckouts.proposalId, input.proposalId),
            eq(proposalCheckouts.status, "paid")
          ),
        });

        const newGroupIds = new Set(input.checkoutGroups.map((g) => g.id));
        const orphanedPaid = paidCheckouts.filter(
          (c) => !newGroupIds.has(c.checkoutGroupId)
        );

        if (orphanedPaid.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot remove checkout groups that have paid checkouts",
          });
        }
      }

      const updatedMeta: ProposalMetadataV2 = {
        version: 2,
        status: existingMeta?.status ?? "draft",
        currency: input.currency ?? existingMeta?.currency ?? "usd",
        checkoutGroups:
          input.checkoutGroups ?? existingMeta?.checkoutGroups ?? [],
        richContent: input.richContent ?? existingMeta?.richContent,
        agreementTemplateIds:
          input.agreementTemplateIds ?? existingMeta?.agreementTemplateIds,
        customTerms: input.customTerms ?? existingMeta?.customTerms,
        validUntil:
          input.validUntil === null
            ? undefined
            : (input.validUntil ?? existingMeta?.validUntil),
        customerInfo: input.customerInfo ?? existingMeta?.customerInfo,
      };

      const [updated] = await db
        .update(clientResources)
        .set({
          title: input.title ?? proposal.title,
          description:
            input.description !== undefined
              ? input.description
              : proposal.description,
          projectId:
            input.projectId !== undefined
              ? input.projectId
              : proposal.projectId,
          metadata: updatedMeta as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .where(eq(clientResources.id, input.proposalId))
        .returning();

      return updated;
    }),

  /**
   * Get a proposal by ID with checkout history
   */
  getById: protectedProcedure
    .input(z.object({ proposalId: z.number() }))
    .query(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      const proposal = await db.query.clientResources.findFirst({
        where: and(
          eq(clientResources.id, input.proposalId),
          eq(clientResources.section, "proposals")
        ),
        with: {
          client: true,
          project: true,
          checkouts: true,
        },
      });

      if (!proposal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      // Authorization: client can only see their own proposals
      if (
        profile.role === "client" &&
        profile.clientSlug !== proposal.client.slug
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      // For clients, hide draft proposals (both v1 and v2)
      const meta = proposal.metadata as unknown as ProposalMetadataV2 | null;
      const metaRaw = proposal.metadata as Record<string, unknown> | null;
      if (
        profile.role === "client" &&
        (metaRaw?.status === "draft" ||
          proposal.underDevelopment === true ||
          proposal.isPrivate === true)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      // Fetch agreement templates if referenced
      let agreementTemplates: Array<{
        id: number;
        name: string;
        content: string;
      }> = [];
      if (meta?.agreementTemplateIds && meta.agreementTemplateIds.length > 0) {
        agreementTemplates = await db.query.proposalAgreementTemplates.findMany(
          {
            where: and(
              inArray(proposalAgreementTemplates.id, meta.agreementTemplateIds),
              eq(proposalAgreementTemplates.isActive, true)
            ),
            columns: { id: true, name: true, content: true },
          }
        );
      }

      return {
        ...proposal,
        agreementTemplates,
        isAdmin: profile.role === "admin",
      };
    }),

  /**
   * Update proposal status (admin/AM only)
   */
  updateStatus: accountManagerProcedure
    .input(
      z.object({
        proposalId: z.number(),
        status: z.enum(["draft", "sent", "accepted", "declined"]),
      })
    )
    .mutation(async ({ input }) => {
      const proposal = await db.query.clientResources.findFirst({
        where: and(
          eq(clientResources.id, input.proposalId),
          eq(clientResources.section, "proposals")
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      const existingMeta = proposal.metadata as Record<string, unknown>;

      await db
        .update(clientResources)
        .set({
          metadata: { ...existingMeta, status: input.status },
          updatedAt: new Date(),
        })
        .where(eq(clientResources.id, input.proposalId));

      return { success: true };
    }),

  // --------------------------------------------------------------------------
  // AGREEMENT TEMPLATES
  // --------------------------------------------------------------------------

  listTemplates: adminProcedure.query(async () => {
    return db.query.proposalAgreementTemplates.findMany({
      where: eq(proposalAgreementTemplates.isActive, true),
      orderBy: [desc(proposalAgreementTemplates.updatedAt)],
    });
  }),

  createTemplate: accountManagerProcedure
    .input(
      z.object({
        name: z.string().min(1).max(300),
        content: z.string().min(1).max(50000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [template] = await db
        .insert(proposalAgreementTemplates)
        .values({
          name: input.name,
          content: input.content,
          createdByAuthId: ctx.user!.id,
        })
        .returning();
      return template;
    }),

  updateTemplate: accountManagerProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(300).optional(),
        content: z.string().min(1).max(50000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(proposalAgreementTemplates)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.content !== undefined && { content: input.content }),
          updatedAt: new Date(),
        })
        .where(eq(proposalAgreementTemplates.id, input.id))
        .returning();
      return updated;
    }),

  deleteTemplate: accountManagerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .update(proposalAgreementTemplates)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(proposalAgreementTemplates.id, input.id));
      return { success: true };
    }),

  // --------------------------------------------------------------------------
  // CHECKOUT
  // --------------------------------------------------------------------------

  /**
   * Create a checkout for a specific checkout group option.
   * - credit → Stripe checkout session
   * - ach/wire → Mercury invoice creation → returns invoice link
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        proposalId: z.number(),
        checkoutGroupId: z.string(),
        optionId: z.string(),
        paymentMethod: z.enum(["credit", "bank"]),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Auth check
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Get proposal with client
      const proposal = await db.query.clientResources.findFirst({
        where: and(
          eq(clientResources.id, input.proposalId),
          eq(clientResources.section, "proposals")
        ),
        with: { client: true },
      });

      if (!proposal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      // Authorization: client can only checkout their own
      if (
        profile.role === "client" &&
        profile.clientSlug !== proposal.client.slug
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      const meta = proposal.metadata as unknown as ProposalMetadataV2;
      if (meta.version !== 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Use the legacy checkout for v1 proposals",
        });
      }

      if (
        meta.status !== "sent" &&
        meta.status !== "partial" &&
        meta.status !== "accepted"
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Proposal is not available for checkout",
        });
      }

      // Find the checkout group and option
      const group = meta.checkoutGroups.find(
        (g) => g.id === input.checkoutGroupId
      );
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Checkout group not found",
        });
      }

      const option = group.options.find((o) => o.id === input.optionId);
      if (!option) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Option not found in checkout group",
        });
      }

      // Validate payment method is enabled for this option
      if (!option.enabledPaymentMethods.includes(input.paymentMethod)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Payment method "${input.paymentMethod}" is not available for this option`,
        });
      }

      // Check for existing pending/paid checkout for this group
      const existingCheckout = await db.query.proposalCheckouts.findFirst({
        where: and(
          eq(proposalCheckouts.proposalId, input.proposalId),
          eq(proposalCheckouts.checkoutGroupId, input.checkoutGroupId),
          inArray(proposalCheckouts.status, ["pending", "paid"])
        ),
      });

      if (existingCheckout?.status === "paid") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This checkout group has already been paid",
        });
      }

      const paymentMethodDb =
        input.paymentMethod === "credit" ? "stripe_credit" : "mercury_bank";

      // ---- STRIPE CREDIT CHECKOUT ----
      if (input.paymentMethod === "credit") {
        if (!stripe) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Stripe is not configured",
          });
        }

        // Ensure client has Stripe customer
        let stripeCustomerId = proposal.client.stripeCustomerId;
        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: proposal.client.email,
            name: proposal.client.name,
            metadata: {
              clientId: String(proposal.client.id),
              clientSlug: proposal.client.slug,
            },
          });
          stripeCustomerId = customer.id;
          await db
            .update(clients)
            .set({ stripeCustomerId: customer.id })
            .where(eq(clients.id, proposal.client.id));
        }

        // Build Stripe line items
        const stripeLineItems = option.lineItems.map((item) => ({
          price_data: {
            currency: meta.currency,
            product_data: {
              name: item.name,
              description: item.description ?? undefined,
            },
            unit_amount: item.unitPrice,
            ...(option.paymentType === "recurring" && option.recurringInterval
              ? {
                  recurring: {
                    interval: option.recurringInterval,
                  },
                }
              : {}),
          },
          quantity: item.qty,
        }));

        const mode =
          option.paymentType === "recurring" ? "subscription" : "payment";

        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          line_items: stripeLineItems,
          mode,
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          metadata: {
            proposalId: String(input.proposalId),
            checkoutGroupId: input.checkoutGroupId,
            optionId: input.optionId,
            clientSlug: proposal.client.slug,
            version: "2",
          },
        });

        // Cancel existing pending checkout if any
        if (existingCheckout) {
          await db
            .update(proposalCheckouts)
            .set({ status: "canceled", updatedAt: new Date() })
            .where(eq(proposalCheckouts.id, existingCheckout.id));
        }

        // Insert checkout record
        await db.insert(proposalCheckouts).values({
          proposalId: input.proposalId,
          checkoutGroupId: input.checkoutGroupId,
          optionId: input.optionId,
          paymentMethod: paymentMethodDb,
          status: "pending",
          amount: option.totalPrice,
          currency: meta.currency,
          stripeSessionId: session.id,
        });

        return { type: "stripe" as const, checkoutUrl: session.url };
      }

      // ---- MERCURY ACH/WIRE CHECKOUT ----
      const accounts = await getMercuryAccounts();
      const checkingAccount =
        accounts.find(
          (a) =>
            a.kind === "checking" &&
            a.status === "active" &&
            a.nickname === "Miracle Mind Checking"
        ) ??
        accounts.find((a) => a.kind === "checking" && a.status === "active");

      if (!checkingAccount) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No active Mercury checking account found",
        });
      }

      // Mercury uses dollars, not cents
      const lineItemsDollars = option.lineItems.map((item) => ({
        name: item.name + (item.description ? ` — ${item.description}` : ""),
        unitPrice: item.unitPrice / 100,
        quantity: item.qty,
      }));

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // Net 30

      const invoice = await createMercuryInvoice({
        recipientEmail: proposal.client.email,
        recipientName: proposal.client.name,
        description: `${proposal.title} - ${option.name}`,
        lineItems: lineItemsDollars,
        dueDate: dueDate.toISOString().split("T")[0]!,
        accountId: checkingAccount.id,
      });

      if (!invoice) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create Mercury invoice",
        });
      }

      // Cancel existing pending checkout if any
      if (existingCheckout) {
        await db
          .update(proposalCheckouts)
          .set({ status: "canceled", updatedAt: new Date() })
          .where(eq(proposalCheckouts.id, existingCheckout.id));
      }

      // Insert checkout record
      await db.insert(proposalCheckouts).values({
        proposalId: input.proposalId,
        checkoutGroupId: input.checkoutGroupId,
        optionId: input.optionId,
        paymentMethod: paymentMethodDb,
        status: "pending",
        amount: option.totalPrice,
        currency: meta.currency,
        mercuryInvoiceId: invoice.id,
        mercuryInvoiceLink: invoice.link,
      });

      // Update proposal status to partial if first checkout
      if (meta.status === "sent") {
        await db
          .update(clientResources)
          .set({
            metadata: {
              ...(proposal.metadata as Record<string, unknown>),
              status: "partial",
            },
            updatedAt: new Date(),
          })
          .where(eq(clientResources.id, input.proposalId));
      }

      return {
        type: "mercury" as const,
        invoiceLink: invoice.link,
        invoiceId: invoice.id,
      };
    }),

  /**
   * Get checkout status for all groups in a proposal
   */
  getCheckoutStatus: protectedProcedure
    .input(z.object({ proposalId: z.number() }))
    .query(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      const allCheckouts = await db.query.proposalCheckouts.findMany({
        where: eq(proposalCheckouts.proposalId, input.proposalId),
        orderBy: [desc(proposalCheckouts.createdAt)],
      });

      // Group by checkout group
      const grouped: Record<string, typeof allCheckouts> = {};
      for (const checkout of allCheckouts) {
        const key = checkout.checkoutGroupId;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(checkout);
      }

      return grouped;
    }),

  // --------------------------------------------------------------------------
  // BILLING / PAYMENT LOGGING
  // --------------------------------------------------------------------------

  /**
   * Log a retroactive payment (admin only)
   * For payments that already happened outside the proposal system
   */
  logPayment: accountManagerProcedure
    .input(
      z.object({
        proposalId: z.number(),
        checkoutGroupId: z.string().optional(),
        optionId: z.string().optional(),
        paymentMethod: z.enum(["stripe_credit", "mercury_ach", "mercury_wire"]),
        amount: z.number().min(1), // cents
        currency: z.string().max(10).default("usd"),
        paidAt: z.string(), // ISO date
        stripePaymentIntentId: z.string().optional(),
        mercuryTransactionId: z.string().optional(),
        stripeFeeAmount: z.number().optional(), // cents
        notes: z.string().max(5000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Verify the proposal exists
      const proposal = await db.query.clientResources.findFirst({
        where: and(
          eq(clientResources.id, input.proposalId),
          eq(clientResources.section, "proposals")
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      const [checkout] = await db
        .insert(proposalCheckouts)
        .values({
          proposalId: input.proposalId,
          checkoutGroupId: input.checkoutGroupId ?? "manual",
          optionId: input.optionId ?? "manual",
          paymentMethod: input.paymentMethod,
          status: "paid",
          amount: input.amount,
          currency: input.currency,
          paidAt: new Date(input.paidAt),
          stripePaymentIntentId: input.stripePaymentIntentId,
          mercuryTransactionId: input.mercuryTransactionId,
          stripeFeeAmount: input.stripeFeeAmount,
        })
        .returning();

      await recalculateProposalStatus(input.proposalId);

      return checkout;
    }),

  /**
   * Search Stripe charges and Mercury transactions for payment linking.
   * Used by AMs to find existing payments and link them to proposals.
   */
  searchPayments: accountManagerProcedure
    .input(
      z.object({
        clientSlug: z.string(),
        query: z.string().max(200).optional(), // customer name search
        startDate: z.string().optional(), // YYYY-MM-DD
        endDate: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.clientSlug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // Already-linked payment IDs to mark in results
      const linkedCheckouts = await db.query.proposalCheckouts.findMany({
        where: inArray(proposalCheckouts.status, ["paid", "pending"]),
        columns: {
          stripePaymentIntentId: true,
          mercuryTransactionId: true,
        },
      });
      const linkedStripeIds = new Set(
        linkedCheckouts
          .map((c) => c.stripePaymentIntentId)
          .filter(Boolean) as string[]
      );
      const linkedMercuryIds = new Set(
        linkedCheckouts
          .map((c) => c.mercuryTransactionId)
          .filter(Boolean) as string[]
      );

      // --- STRIPE SEARCH ---
      type StripeResult = {
        id: string;
        source: "stripe";
        amount: number; // cents
        fee: number | null; // cents
        currency: string;
        status: string;
        date: number; // unix timestamp
        description: string | null;
        customerName: string | null;
        customerEmail: string | null;
        receiptUrl: string | null;
        alreadyLinked: boolean;
      };

      const stripeResults: StripeResult[] = [];

      // Use the checkout Stripe client (test mode in dev), fall back to live read-only
      const stripeClient = stripe ?? stripeLive;
      if (stripeClient && client.stripeCustomerId) {
        try {
          const params: Record<string, unknown> = {
            customer: client.stripeCustomerId,
            limit: input.limit,
          };
          if (input.startDate) {
            // Start of day local time — subtract 24h buffer for timezone safety
            const start = new Date(input.startDate + "T00:00:00");
            params.created = {
              ...(typeof params.created === "object" ? params.created : {}),
              gte: Math.floor(start.getTime() / 1000),
            } as Record<string, number>;
          }
          if (input.endDate) {
            // End of day local time + buffer
            const end = new Date(input.endDate + "T23:59:59");
            const created = (params.created ?? {}) as Record<string, number>;
            created.lte = Math.floor(end.getTime() / 1000);
            params.created = created;
          }

          const charges = await stripeClient.charges.list(
            params as Parameters<typeof stripeClient.charges.list>[0]
          );

          for (const charge of charges.data) {
            if (charge.status !== "succeeded") continue;

            let fee: number | null = null;
            const bt = charge.balance_transaction;
            if (bt && typeof bt !== "string") {
              fee = bt.fee;
            }

            stripeResults.push({
              id: charge.payment_intent
                ? typeof charge.payment_intent === "string"
                  ? charge.payment_intent
                  : charge.payment_intent.id
                : charge.id,
              source: "stripe",
              amount: charge.amount,
              fee,
              currency: charge.currency,
              status: charge.status,
              date: charge.created,
              description: charge.description,
              customerName:
                typeof charge.customer === "object" && charge.customer
                  ? ((charge.customer as { name?: string }).name ?? null)
                  : null,
              customerEmail:
                charge.receipt_email ?? charge.billing_details?.email ?? null,
              receiptUrl: charge.receipt_url,
              alreadyLinked: linkedStripeIds.has(
                typeof charge.payment_intent === "string"
                  ? charge.payment_intent
                  : (charge.payment_intent?.id ?? "")
              ),
            });
          }
        } catch {
          // Stripe search is best-effort
        }
      }

      // --- MERCURY SEARCH ---
      type MercuryResult = {
        id: string;
        source: "mercury";
        amount: number; // cents (converted from dollars)
        fee: null;
        currency: string;
        status: string;
        date: number; // unix timestamp
        description: string | null;
        counterpartyName: string | null;
        alreadyLinked: boolean;
      };

      const mercuryResults: MercuryResult[] = [];

      const accounts = await getMercuryAccounts();
      for (const account of accounts) {
        if (account.kind !== "checking" || account.status !== "active")
          continue;

        const transactions = await getMercuryTransactions(
          account.id,
          input.limit,
          0,
          input.startDate,
          input.endDate
        );

        for (const tx of transactions) {
          // Only show incoming transactions (positive amounts)
          if (tx.amount <= 0) continue;
          // Filter by client name if we can match counterparty
          if (
            input.query &&
            tx.counterpartyName &&
            !tx.counterpartyName
              .toLowerCase()
              .includes(input.query.toLowerCase())
          ) {
            continue;
          }

          mercuryResults.push({
            id: tx.id,
            source: "mercury",
            amount: Math.round(tx.amount * 100), // dollars → cents
            fee: null,
            currency: "usd",
            status: tx.status,
            date: Math.floor(new Date(tx.createdAt).getTime() / 1000),
            description: tx.externalMemo ?? tx.bankDescription,
            counterpartyName: tx.counterpartyName,
            alreadyLinked: linkedMercuryIds.has(tx.id),
          });
        }
      }

      return {
        stripe: stripeResults,
        mercury: mercuryResults,
        client: {
          name: client.name,
          email: client.email,
          stripeCustomerId: client.stripeCustomerId,
        },
      };
    }),

  /**
   * Link an existing Stripe/Mercury payment to a proposal.
   * Creates a proposalCheckouts entry and logs Stripe fees as expenses.
   */
  linkPayment: accountManagerProcedure
    .input(
      z.object({
        proposalId: z.number(),
        checkoutGroupId: z.string().default("manual"),
        optionId: z.string().default("manual"),
        source: z.enum(["stripe", "mercury"]),
        externalId: z.string(), // Stripe PI ID or Mercury TX ID
        amount: z.number().min(1), // cents
        fee: z.number().optional(), // cents (Stripe only)
        currency: z.string().max(10).default("usd"),
        paidAt: z.string(), // ISO date
      })
    )
    .mutation(async ({ input }) => {
      // Verify proposal exists
      const proposal = await db.query.clientResources.findFirst({
        where: and(
          eq(clientResources.id, input.proposalId),
          eq(clientResources.section, "proposals")
        ),
      });

      if (!proposal) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      // Check not already linked
      const existing = await db.query.proposalCheckouts.findFirst({
        where:
          input.source === "stripe"
            ? eq(proposalCheckouts.stripePaymentIntentId, input.externalId)
            : eq(proposalCheckouts.mercuryTransactionId, input.externalId),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This payment is already linked to a proposal",
        });
      }

      const paymentMethod =
        input.source === "stripe" ? "stripe_credit" : "mercury_ach";

      const [checkout] = await db
        .insert(proposalCheckouts)
        .values({
          proposalId: input.proposalId,
          checkoutGroupId: input.checkoutGroupId,
          optionId: input.optionId,
          paymentMethod,
          status: "paid",
          amount: input.amount,
          currency: input.currency,
          paidAt: new Date(input.paidAt),
          stripePaymentIntentId:
            input.source === "stripe" ? input.externalId : undefined,
          mercuryTransactionId:
            input.source === "mercury" ? input.externalId : undefined,
          stripeFeeAmount: input.fee ?? undefined,
        })
        .returning();

      // Log Stripe fee as expense
      if (input.source === "stripe" && input.fee && input.fee > 0) {
        try {
          const feeCategory = await db.query.expenseCategories.findFirst({
            where: eq(expenseCategories.name, "Commissions & Fees"),
          });
          if (feeCategory) {
            await db.insert(expenses).values({
              categoryId: feeCategory.id,
              amount: input.fee,
              vendor: "Stripe",
              description: `Processing fee — linked payment ${input.externalId}`,
              date: new Date(input.paidAt).toISOString().split("T")[0]!,
              type: "expense",
              isTaxDeductible: true,
              createdByAuthId: "00000000-0000-0000-0000-000000000000",
            });
          }
        } catch {
          // Best-effort
        }
      }

      // Recalculate proposal status
      await recalculateProposalStatus(input.proposalId);

      return checkout;
    }),

  /**
   * Detect potential duplicate payments (Stripe gross vs Mercury amount)
   * within a 3-day window for a given client
   */
  detectDuplicates: adminProcedure
    .input(
      z.object({
        clientSlug: z.string(),
        lookbackDays: z.number().min(1).max(365).default(90),
      })
    )
    .query(async ({ input }) => {
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.clientSlug),
      });

      if (!client) return { duplicates: [] };

      // Single query with subquery instead of N+1
      const checkouts = await db.query.proposalCheckouts.findMany({
        where: and(
          inArray(
            proposalCheckouts.proposalId,
            db
              .select({ id: clientResources.id })
              .from(clientResources)
              .where(
                and(
                  eq(clientResources.clientId, client.id),
                  eq(clientResources.section, "proposals")
                )
              )
          ),
          eq(proposalCheckouts.status, "paid")
        ),
      });

      // Find potential duplicates: Stripe + Mercury payments with same amount within 3 days
      const stripeCheckouts = checkouts.filter(
        (c) => c.paymentMethod === "stripe_credit"
      );
      const mercuryCheckouts = checkouts.filter((c) =>
        c.paymentMethod.startsWith("mercury_")
      );

      const duplicates: Array<{
        stripeCheckout: (typeof checkouts)[number];
        mercuryCheckout: (typeof checkouts)[number];
        confidence: "high" | "medium" | "low";
      }> = [];

      for (const sc of stripeCheckouts) {
        if (!sc.paidAt) continue;
        const scDate = new Date(sc.paidAt).getTime();

        for (const mc of mercuryCheckouts) {
          if (!mc.paidAt) continue;
          const mcDate = new Date(mc.paidAt).getTime();
          const daysDiff = Math.abs(scDate - mcDate) / (1000 * 60 * 60 * 24);

          if (daysDiff > 3) continue;

          // Compare amounts: Stripe amount includes fee, Mercury amount is net
          // Use gross (amount before fees) for Stripe comparison
          const stripeGross = sc.stripeFeeAmount
            ? sc.amount + sc.stripeFeeAmount
            : sc.amount;

          const amountMatch =
            sc.amount === mc.amount || stripeGross === mc.amount;
          const closeAmount = Math.abs(sc.amount - mc.amount) < 100; // within $1

          if (amountMatch) {
            duplicates.push({
              stripeCheckout: sc,
              mercuryCheckout: mc,
              confidence: daysDiff < 1 ? "high" : "medium",
            });
          } else if (closeAmount) {
            duplicates.push({
              stripeCheckout: sc,
              mercuryCheckout: mc,
              confidence: "low",
            });
          }
        }
      }

      return { duplicates };
    }),

  /**
   * Resolve a duplicate — mark one as duplicate or confirm both are separate
   */
  resolveDuplicate: adminProcedure
    .input(
      z.object({
        checkoutId: z.number(),
        resolution: z.enum(["duplicate", "separate"]),
      })
    )
    .mutation(async ({ input }) => {
      if (input.resolution === "duplicate") {
        await db
          .update(proposalCheckouts)
          .set({ status: "canceled", updatedAt: new Date() })
          .where(eq(proposalCheckouts.id, input.checkoutId));
      }
      // "separate" = no action needed, just acknowledge
      return { success: true };
    }),

  /**
   * Check Mercury invoice payment status for a single checkout.
   * Called manually by the user after paying via Mercury.
   */
  checkMercuryPayment: protectedProcedure
    .input(z.object({ proposalId: z.number(), checkoutGroupId: z.string() }))
    .mutation(async ({ input }) => {
      const checkout = await db.query.proposalCheckouts.findFirst({
        where: and(
          eq(proposalCheckouts.proposalId, input.proposalId),
          eq(proposalCheckouts.checkoutGroupId, input.checkoutGroupId),
          eq(proposalCheckouts.status, "pending"),
          eq(proposalCheckouts.paymentMethod, "mercury_bank")
        ),
      });

      if (!checkout?.mercuryInvoiceId) {
        return { status: "no_pending" as const };
      }

      const invoice = await getMercuryInvoice(checkout.mercuryInvoiceId);
      if (!invoice) {
        return { status: "error" as const };
      }

      if (invoice.status === "Paid") {
        await db
          .update(proposalCheckouts)
          .set({
            status: "paid",
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(proposalCheckouts.id, checkout.id));

        await recalculateProposalStatus(input.proposalId);
        return { status: "paid" as const };
      }

      if (invoice.status === "Cancelled") {
        await db
          .update(proposalCheckouts)
          .set({ status: "canceled", updatedAt: new Date() })
          .where(eq(proposalCheckouts.id, checkout.id));
        return { status: "canceled" as const };
      }

      return { status: "pending" as const };
    }),
});

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Recalculate proposal status from all checkout rows.
 * Called after checkout completion (webhook, poll, or manual log).
 */
export async function recalculateProposalStatus(
  proposalId: number
): Promise<void> {
  const proposal = await db.query.clientResources.findFirst({
    where: eq(clientResources.id, proposalId),
  });

  if (!proposal) return;

  const meta = proposal.metadata as unknown as ProposalMetadataV2 | null;
  if (!meta || meta.version !== 2) return;

  const checkouts = await db.query.proposalCheckouts.findMany({
    where: eq(proposalCheckouts.proposalId, proposalId),
  });

  const paidGroupIds = new Set(
    checkouts.filter((c) => c.status === "paid").map((c) => c.checkoutGroupId)
  );

  const requiredGroups = meta.checkoutGroups.filter((g) => g.required);

  const allRequiredPaid = requiredGroups.every((g) => paidGroupIds.has(g.id));

  let newStatus: ProposalMetadataV2["status"];
  if (paidGroupIds.size === 0) {
    newStatus = meta.status; // no change
  } else if (allRequiredPaid) {
    newStatus = "accepted";
  } else {
    newStatus = "partial";
  }

  if (newStatus !== meta.status) {
    await db
      .update(clientResources)
      .set({
        metadata: {
          ...(proposal.metadata as Record<string, unknown>),
          status: newStatus,
          ...(newStatus === "accepted"
            ? { paidAt: new Date().toISOString() }
            : {}),
        },
        updatedAt: new Date(),
      })
      .where(eq(clientResources.id, proposalId));
  }
}
