import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  portalUsers,
  clients,
  clientProjects,
  clientUpdates,
  clientAgreements,
  clientResources,
} from "~/server/db/schema";
import { eq, desc, isNull, and, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { stripe } from "~/lib/stripe";

export const portalRouter = createTRPCRouter({
  /**
   * Get current user's portal profile
   * Returns null if user doesn't have a portal account
   */
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await db.query.portalUsers.findFirst({
      where: eq(portalUsers.authUserId, ctx.user.id),
    });
    return profile ?? null;
  }),

  /**
   * Get portal user profile for a specific client slug
   * Admins can view any client's profile, clients can only view their own
   */
  getClientPortalUser: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get the current user's portal profile
      const myProfile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!myProfile || !myProfile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Authorization check
      if (myProfile.role === "client" && myProfile.clientSlug !== input.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own portal",
        });
      }

      // If client is viewing their own profile, return their profile
      if (myProfile.role === "client" && myProfile.clientSlug === input.slug) {
        return myProfile;
      }

      // Admin viewing a client's profile - get the client's portal user
      const clientProfile = await db.query.portalUsers.findFirst({
        where: and(
          eq(portalUsers.clientSlug, input.slug),
          eq(portalUsers.role, "client")
        ),
      });

      return clientProfile ?? null;
    }),

  /**
   * Get client data by slug - with authorization check
   * Admins can access any client, clients can only access their own
   */
  getClientBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Authorization check: admins can access any, clients only their own
      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own portal",
        });
      }

      // Fetch client with full data
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
        with: {
          projects: {
            with: {
              updates: {
                orderBy: [desc(clientUpdates.createdAt)],
              },
            },
          },
          agreements: {
            orderBy: [desc(clientAgreements.createdAt)],
          },
        },
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      return client;
    }),

  /**
   * List all clients - admin only
   */
  listClients: protectedProcedure.query(async ({ ctx }) => {
    // Get the current user's portal profile
    const profile = await db.query.portalUsers.findFirst({
      where: eq(portalUsers.authUserId, ctx.user.id),
    });

    if (!profile || profile.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    return db.query.clients.findMany({
      orderBy: [desc(clients.createdAt)],
      with: {
        projects: true,
      },
    });
  }),

  /**
   * Check if email has an unclaimed portal account
   * Used for claim account flow - returns claim status, not sensitive data
   */
  checkEmailForClaim: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const account = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.email, input.email.toLowerCase()),
      });

      if (!account) {
        return { exists: false, canClaim: false };
      }

      // If authUserId is null, the account is unclaimed
      const canClaim = account.authUserId === null;

      return { exists: true, canClaim, name: account.name };
    }),

  /**
   * Link authenticated user to their portal account
   * Called after magic link claim or password set
   */
  linkAuthUser: protectedProcedure.mutation(async ({ ctx }) => {
    // Find unclaimed account by email
    const account = await db.query.portalUsers.findFirst({
      where: and(
        eq(portalUsers.email, ctx.user.email!.toLowerCase()),
        isNull(portalUsers.authUserId)
      ),
    });

    if (!account) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No unclaimed account found for this email",
      });
    }

    // Link the auth user
    const [updated] = await db
      .update(portalUsers)
      .set({
        authUserId: ctx.user.id,
        updatedAt: new Date(),
      })
      .where(eq(portalUsers.id, account.id))
      .returning();

    return updated;
  }),

  /**
   * Create a new portal user (admin only)
   * Used to invite new clients to the portal
   */
  createPortalUser: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        role: z.enum(["admin", "client"]).default("client"),
        clientSlug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check admin access
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      // Validate: clients must have a clientSlug
      if (input.role === "client" && !input.clientSlug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Client slug is required for client role",
        });
      }

      // Validate: clientSlug must exist in clients table
      if (input.clientSlug) {
        const client = await db.query.clients.findFirst({
          where: eq(clients.slug, input.clientSlug),
        });

        if (!client) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid client slug - client does not exist",
          });
        }
      }

      const [newUser] = await db
        .insert(portalUsers)
        .values({
          email: input.email.toLowerCase(),
          name: input.name,
          role: input.role,
          clientSlug: input.clientSlug ?? null,
        })
        .returning();

      return newUser;
    }),

  /**
   * Get client resources by section
   * Authorized: admins can access any client, clients only their own
   */
  getResources: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        section: z.string().optional(), // filter by section (demos, tooling, etc.)
      })
    )
    .query(async ({ ctx, input }) => {
      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Authorization check
      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own resources",
        });
      }

      // Get the client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // Build query conditions
      const conditions = [
        eq(clientResources.clientId, client.id),
        eq(clientResources.isActive, true),
      ];

      if (input.section) {
        conditions.push(eq(clientResources.section, input.section));
      }

      // Fetch resources
      const resources = await db.query.clientResources.findMany({
        where: and(...conditions),
        orderBy: [asc(clientResources.sortOrder), desc(clientResources.createdAt)],
        with: {
          project: true,
        },
      });

      // Check subscription status for resources that require it
      let activeProductIds = new Set<string>();
      if (stripe && client.stripeCustomerId) {
        try {
          const [activeSubscriptions, trialingSubscriptions] = await Promise.all([
            stripe.subscriptions.list({
              customer: client.stripeCustomerId,
              status: "active",
            }),
            stripe.subscriptions.list({
              customer: client.stripeCustomerId,
              status: "trialing",
            }),
          ]);

          for (const sub of [...activeSubscriptions.data, ...trialingSubscriptions.data]) {
            if (sub.cancel_at_period_end) continue;
            for (const item of sub.items.data) {
              const productId =
                typeof item.price.product === "string"
                  ? item.price.product
                  : item.price.product?.id;
              if (productId) activeProductIds.add(productId);
            }
          }
        } catch (error) {
          console.error("Stripe subscription check failed:", error);
          // Continue without subscription filtering
        }
      }

      // Add subscription status to each resource
      return resources.map((resource: typeof resources[number]) => ({
        ...resource,
        subscriptionActive: resource.stripeProductId
          ? activeProductIds.has(resource.stripeProductId)
          : true, // Resources without stripeProductId are always accessible
      }));
    }),

  /**
   * Update current user's profile (self-service)
   */
  updateMyProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      // Update portal user fields
      const { company, ...profileFields } = input;
      const [updated] = await db
        .update(portalUsers)
        .set({
          ...profileFields,
          updatedAt: new Date(),
        })
        .where(eq(portalUsers.id, profile.id))
        .returning();

      // Update client company if provided and user has a client association
      if (company !== undefined && profile.clientSlug) {
        await db
          .update(clients)
          .set({ company })
          .where(eq(clients.slug, profile.clientSlug));
      }

      return updated;
    }),

  /**
   * Create a client resource (admin only)
   */
  createResource: protectedProcedure
    .input(
      z.object({
        clientSlug: z.string(),
        projectId: z.number().optional(),
        section: z.string().default("tooling"),
        type: z.string().default("link"),
        title: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().optional(),
        isFeatured: z.boolean().optional(),
        url: z.string().optional(),
        embedCode: z.string().optional(),
        content: z.string().optional(),
        metadata: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check admin access
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      // Get the client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.clientSlug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      const [resource] = await db
        .insert(clientResources)
        .values({
          clientId: client.id,
          projectId: input.projectId,
          section: input.section,
          type: input.type,
          title: input.title,
          description: input.description ?? null,
          icon: input.icon ?? null,
          sortOrder: input.sortOrder ?? 0,
          isFeatured: input.isFeatured ?? false,
          url: input.url ?? null,
          embedCode: input.embedCode ?? null,
          content: input.content ?? null,
          metadata: input.metadata ?? {},
        })
        .returning();

      return resource;
    }),

  /**
   * Get billing information for a client
   * Returns Stripe invoices and subscriptions
   */
  getBillingInfo: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Authorization check
      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own billing",
        });
      }

      // Get the client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // If no Stripe customer or Stripe not configured, return empty
      if (!stripe || !client.stripeCustomerId) {
        return {
          hasStripeCustomer: false,
          invoices: [],
          payments: [],
          subscriptions: [],
          balance: null,
        };
      }

      try {
        // Verify customer exists in current Stripe environment (handles test/live key mismatch)
        let validCustomerId = client.stripeCustomerId;
        try {
          await stripe.customers.retrieve(validCustomerId);
        } catch {
          // Customer doesn't exist in current Stripe environment (test/live key mismatch)
          // Don't clear the ID — it may be valid in the production environment
          console.warn(
            `Stripe customer ${validCustomerId} not found for ${client.slug} (likely test/live key mismatch)`
          );
          return {
            hasStripeCustomer: false,
            invoices: [],
            payments: [],
            subscriptions: [],
            balance: null,
          };
        }

        // Fetch Stripe data and proposals in parallel
        const [invoices, subscriptions, paymentIntents, proposals] = await Promise.all([
          stripe.invoices.list({
            customer: validCustomerId,
            limit: 20,
          }),
          stripe.subscriptions.list({
            customer: validCustomerId,
            status: "all",
            limit: 10,
          }),
          stripe.paymentIntents.list({
            customer: validCustomerId,
            limit: 20,
          }),
          db.query.clientResources.findMany({
            where: and(
              eq(clientResources.clientId, client.id),
              eq(clientResources.section, "proposals"),
            ),
          }),
        ]);

        // Get balance (already verified customer above)
        const customer = await stripe.customers.retrieve(validCustomerId);

        // Get balance from customer object
        const balance = "balance" in customer ? customer.balance : null;

        // Build dual lookup maps from proposals
        const piToProposal = new Map<string, string>();
        const subToProposal = new Map<string, string>();
        for (const p of proposals) {
          const meta = p.metadata as Record<string, unknown> | null;
          const piId = meta?.stripePaymentIntentId as string | undefined;
          if (piId) piToProposal.set(piId, p.title);
          const subId = meta?.stripeSubscriptionId as string | undefined;
          if (subId) subToProposal.set(subId, p.title);
        }

        // Collect unique product IDs from subscriptions to fetch names
        const productIds = new Set<string>();
        for (const sub of subscriptions.data) {
          for (const item of sub.items.data) {
            const productId =
              typeof item.price.product === "string"
                ? item.price.product
                : item.price.product?.id;
            if (productId) productIds.add(productId);
          }
        }

        // Fetch product names in parallel
        const productMap = new Map<string, string>();
        if (productIds.size > 0) {
          const products = await Promise.all(
            Array.from(productIds).map((id) => stripe!.products.retrieve(id))
          );
          for (const product of products) {
            if (!("deleted" in product)) {
              productMap.set(product.id, product.name);
            }
          }
        }

        return {
          hasStripeCustomer: true,
          invoices: invoices.data.map((inv) => {
            const lineItemDescriptions = inv.lines?.data
              ?.map((line) => line.description)
              .filter(Boolean)
              .slice(0, 3);

            // Resolve proposal name via subscription link
            const invSubDetails = inv.parent?.subscription_details;
            const invSubscriptionId = invSubDetails
              ? typeof invSubDetails.subscription === "string"
                ? invSubDetails.subscription
                : invSubDetails.subscription?.id ?? null
              : null;
            const proposalName = invSubscriptionId
              ? subToProposal.get(invSubscriptionId) ?? null
              : null;

            const derivedDescription =
              proposalName ??
              inv.description ??
              (lineItemDescriptions?.length
                ? lineItemDescriptions.join(", ")
                : null);

            return {
              id: inv.id,
              number: inv.number,
              status: inv.status,
              amountDue: inv.amount_due,
              amountPaid: inv.amount_paid,
              currency: inv.currency,
              dueDate: inv.due_date,
              paidAt: inv.status_transitions?.paid_at,
              hostedInvoiceUrl: inv.hosted_invoice_url,
              invoicePdf: inv.invoice_pdf,
              created: inv.created,
              description: derivedDescription,
              proposalName,
            };
          }),
          // One-time payments (from Checkout) - exclude subscription-related charges
          payments: (() => {
            const filteredPayments = paymentIntents.data
              .filter((pi) => pi.status === "succeeded")
              .filter((pi) => {
                const desc = pi.description?.toLowerCase() ?? "";
                return !desc.includes("subscription") && !desc.includes("invoice");
              });

            return filteredPayments.map((pi) => ({
              id: pi.id,
              amount: pi.amount,
              currency: pi.currency,
              status: pi.status,
              created: pi.created,
              description: piToProposal.get(pi.id) ?? pi.description ?? "Payment",
              receiptUrl: pi.latest_charge && typeof pi.latest_charge !== "string"
                ? pi.latest_charge.receipt_url ?? null
                : null,
            }));
          })(),
          subscriptions: subscriptions.data.map((sub) => ({
            id: sub.id,
            status: sub.status,
            startDate: sub.start_date,
            billingCycleAnchor: sub.billing_cycle_anchor,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            canceledAt: sub.canceled_at,
            trialEnd: sub.trial_end,
            proposalName: subToProposal.get(sub.id) ?? null,
            items: sub.items.data.map((item) => {
              const productId =
                typeof item.price.product === "string"
                  ? item.price.product
                  : item.price.product?.id;

              return {
                id: item.id,
                priceId: item.price.id,
                productId,
                productName: productId ? productMap.get(productId) : null,
                unitAmount: item.price.unit_amount,
                currency: item.price.currency,
                interval: item.price.recurring?.interval,
                intervalCount: item.price.recurring?.interval_count,
                nickname: item.price.nickname,
              };
            }),
          })),
          balance,
        };
      } catch (error) {
        console.error("Stripe billing error for client:", client.slug, error);
        return {
          hasStripeCustomer: true,
          invoices: [],
          payments: [],
          subscriptions: [],
          balance: null,
        };
      }
    }),

  /**
   * Get proposals for a client
   * Uses clientResources with section="proposals"
   */
  getProposals: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Authorization check
      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own proposals",
        });
      }

      // Get the client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // Fetch proposals from resources
      const proposals = await db.query.clientResources.findMany({
        where: and(
          eq(clientResources.clientId, client.id),
          eq(clientResources.section, "proposals"),
          eq(clientResources.isActive, true)
        ),
        orderBy: [desc(clientResources.createdAt)],
        with: {
          project: true,
        },
      });

      return proposals;
    }),

  /**
   * Create a proposal (admin only)
   */
  createProposal: protectedProcedure
    .input(
      z.object({
        clientSlug: z.string(),
        projectId: z.number().optional(),
        title: z.string().min(1),
        description: z.string().optional(),
        lineItems: z.array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            unitPrice: z.number(),
            quantity: z.number().default(1),
            type: z.enum(["one-time", "subscription"]).default("one-time"),
          })
        ),
        currency: z.string().default("usd"),
        paymentType: z.enum(["one-time", "subscription", "payment-plan"]).default("one-time"),
        subscriptionInterval: z.enum(["month", "year"]).optional(),
        installments: z.number().optional(),
        status: z.enum(["draft", "sent", "accepted", "declined"]).default("draft"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check admin access
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      // Get the client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.clientSlug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // Calculate total
      const total = input.lineItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      const [proposal] = await db
        .insert(clientResources)
        .values({
          clientId: client.id,
          projectId: input.projectId,
          section: "proposals",
          type: "proposal",
          title: input.title,
          description: input.description ?? null,
          metadata: {
            status: input.status,
            lineItems: input.lineItems,
            total,
            currency: input.currency,
            paymentType: input.paymentType,
            subscriptionInterval: input.subscriptionInterval,
            installments: input.installments,
          },
        })
        .returning();

      return proposal;
    }),

  /**
   * Create Stripe checkout session for a proposal
   * Supports dynamic package selection - only selected packages are included
   */
  createProposalCheckout: protectedProcedure
    .input(
      z.object({
        proposalId: z.number(),
        selectedPackageIds: z.array(z.string()).optional(), // If provided, only these packages
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Stripe is not configured",
        });
      }

      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Get the proposal
      const proposal = await db.query.clientResources.findFirst({
        where: eq(clientResources.id, input.proposalId),
        with: {
          client: true,
        },
      });

      if (!proposal || proposal.section !== "proposals") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proposal not found",
        });
      }

      // Authorization check
      if (profile.role === "client" && profile.clientSlug !== proposal.client.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only checkout your own proposals",
        });
      }

      const metadata = proposal.metadata as {
        // New package-based structure
        packages?: Array<{
          id: string;
          name: string;
          description?: string;
          price: number;
          type: "one-time" | "subscription";
          interval?: "month" | "year";
          required?: boolean;
          lineItems?: Array<{
            name: string;
            description?: string;
            quantity: number;
            unitPrice: number;
          }>;
        }>;
        // Legacy structure
        lineItems?: Array<{
          name: string;
          description?: string;
          unitPrice: number;
          quantity: number;
          type: string;
        }>;
        currency: string;
        paymentType?: string;
        subscriptionInterval?: string;
        installments?: number;
      };

      // Ensure client has valid Stripe customer (handles test/live mode mismatch)
      let customerId = proposal.client.stripeCustomerId;
      let needsNewCustomer = !customerId;

      // Verify existing customer exists in current Stripe environment
      if (customerId) {
        try {
          await stripe.customers.retrieve(customerId);
        } catch (err) {
          // Customer doesn't exist in this Stripe environment (test vs live mismatch)
          console.warn(
            `Stripe customer ${customerId} not found for client ${proposal.client.slug}, creating new one`
          );
          needsNewCustomer = true;
        }
      }

      if (needsNewCustomer) {
        const customer = await stripe.customers.create({
          email: proposal.client.email,
          name: proposal.client.name,
          metadata: {
            clientId: String(proposal.client.id),
            clientSlug: proposal.client.slug,
          },
        });
        customerId = customer.id;

        await db
          .update(clients)
          .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
          .where(eq(clients.id, proposal.client.id));
      }

      // Determine checkout mode and build line items
      let checkoutMode: "payment" | "subscription" = "payment";
      let stripeLineItems: Array<{
        price_data: {
          currency: string;
          product_data: { name: string; description?: string };
          unit_amount: number;
          recurring?: { interval: "month" | "year" };
        };
        quantity: number;
      }> = [];

      // New package-based structure
      if (metadata.packages && metadata.packages.length > 0) {
        // Filter to selected packages if provided
        let selectedPackages = metadata.packages;
        if (input.selectedPackageIds && input.selectedPackageIds.length > 0) {
          selectedPackages = metadata.packages.filter(
            (pkg) => input.selectedPackageIds!.includes(pkg.id)
          );
        }

        if (selectedPackages.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No packages selected for checkout",
          });
        }

        // Check if any selected package is a subscription
        const hasSubscription = selectedPackages.some((pkg) => pkg.type === "subscription");
        checkoutMode = hasSubscription ? "subscription" : "payment";

        // Build line items from packages
        stripeLineItems = selectedPackages.map((pkg) => ({
          price_data: {
            currency: metadata.currency,
            product_data: {
              name: pkg.name,
              description: pkg.description,
            },
            unit_amount: Math.round(pkg.price * 100), // Convert to cents
            ...(pkg.type === "subscription" && pkg.interval
              ? { recurring: { interval: pkg.interval } }
              : {}),
          },
          quantity: 1,
        }));
      }
      // Legacy lineItems structure
      else if (metadata.lineItems && metadata.lineItems.length > 0) {
        checkoutMode = metadata.paymentType === "subscription" ? "subscription" : "payment";

        stripeLineItems = metadata.lineItems.map((item) => ({
          price_data: {
            currency: metadata.currency,
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: Math.round(item.unitPrice * 100),
            ...(metadata.paymentType === "subscription" && metadata.subscriptionInterval
              ? { recurring: { interval: metadata.subscriptionInterval as "month" | "year" } }
              : {}),
          },
          quantity: item.quantity,
        }));
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Proposal has no packages or line items",
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: checkoutMode,
        line_items: stripeLineItems,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: {
          proposalId: String(proposal.id),
          clientSlug: proposal.client.slug,
          selectedPackageIds: input.selectedPackageIds?.join(",") ?? "",
        },
      });

      return { checkoutUrl: session.url };
    }),

  /**
   * Create or ensure Stripe customer for a client (admin only)
   */
  ensureStripeCustomer: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check admin access
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      if (!stripe) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Stripe is not configured",
        });
      }

      // Get the client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // Already has Stripe customer
      if (client.stripeCustomerId) {
        return { stripeCustomerId: client.stripeCustomerId, created: false };
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: client.email,
        name: client.name,
        metadata: {
          clientId: String(client.id),
          clientSlug: client.slug,
        },
      });

      // Update client with Stripe customer ID
      await db
        .update(clients)
        .set({
          stripeCustomerId: customer.id,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, client.id));

      return { stripeCustomerId: customer.id, created: true };
    }),

  /**
   * Cancel a subscription (sets cancel_at_period_end)
   * Client can cancel their own subscriptions, admin can cancel any
   */
  cancelSubscription: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.string(),
        immediate: z.boolean().default(false), // If true, cancel immediately
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Stripe is not configured",
        });
      }

      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Get the subscription to verify ownership
      const subscription = await stripe.subscriptions.retrieve(
        input.subscriptionId
      );

      // Find the client by Stripe customer ID
      const client = await db.query.clients.findFirst({
        where: eq(clients.stripeCustomerId, subscription.customer as string),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found for this subscription",
        });
      }

      // Authorization: clients can only cancel their own, admins can cancel any
      if (profile.role === "client" && profile.clientSlug !== client.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only cancel your own subscriptions",
        });
      }

      // Cancel the subscription
      if (input.immediate) {
        await stripe.subscriptions.cancel(input.subscriptionId);
      } else {
        await stripe.subscriptions.update(input.subscriptionId, {
          cancel_at_period_end: true,
        });
      }

      return { success: true, immediate: input.immediate };
    }),

  /**
   * Resubscribe to a canceled subscription (creates new checkout session)
   * Used when a subscription has fully ended and user wants to restart
   */
  resubscribe: protectedProcedure
    .input(
      z.object({
        productId: z.string(), // Stripe product ID to resubscribe to
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Stripe is not configured",
        });
      }

      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive || !profile.clientSlug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Get the client
      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, profile.clientSlug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      // Ensure client has Stripe customer
      let customerId = client.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: client.email,
          name: client.name,
          metadata: {
            clientId: String(client.id),
            clientSlug: client.slug,
          },
        });
        customerId = customer.id;

        await db
          .update(clients)
          .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
          .where(eq(clients.id, client.id));
      }

      // Get the product's default price
      const product = await stripe.products.retrieve(input.productId);
      if (!product.default_price) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product has no default price configured",
        });
      }

      const priceId =
        typeof product.default_price === "string"
          ? product.default_price
          : product.default_price.id;

      // Create checkout session for the subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: {
          clientSlug: client.slug,
          resubscribe: "true",
        },
      });

      return { checkoutUrl: session.url };
    }),

  /**
   * Reactivate a subscription that was set to cancel at period end
   */
  reactivateSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Stripe is not configured",
        });
      }

      // Get the current user's portal profile
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Get the subscription to verify ownership
      const subscription = await stripe.subscriptions.retrieve(
        input.subscriptionId
      );

      // Find the client by Stripe customer ID
      const client = await db.query.clients.findFirst({
        where: eq(clients.stripeCustomerId, subscription.customer as string),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found for this subscription",
        });
      }

      // Authorization
      if (profile.role === "client" && profile.clientSlug !== client.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only manage your own subscriptions",
        });
      }

      // Reactivate by removing cancel_at_period_end
      await stripe.subscriptions.update(input.subscriptionId, {
        cancel_at_period_end: false,
      });

      return { success: true };
    }),
});
