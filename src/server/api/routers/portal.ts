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
import { eq, desc, isNull, and, asc, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { stripe } from "~/lib/stripe";
import { nanoid } from "nanoid";

// In-memory Stripe product name cache (24hr TTL)
const stripeProductCache = new Map<
  string,
  { name: string; expiresAt: number }
>();
const PRODUCT_CACHE_TTL = 24 * 60 * 60 * 1000;

function getCachedProductName(id: string): string | undefined {
  const entry = stripeProductCache.get(id);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    stripeProductCache.delete(id);
    return undefined;
  }
  return entry.name;
}

function cacheProductName(id: string, name: string): void {
  stripeProductCache.set(id, {
    name,
    expiresAt: Date.now() + PRODUCT_CACHE_TTL,
  });
}

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
          accountManager: {
            columns: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
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
   * Get a public demo by its share token (no auth required)
   */
  getPublicDemo: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const resource = await db.query.clientResources.findFirst({
        where: and(
          or(
            eq(clientResources.publicToken, input.token),
            eq(clientResources.publicSlug, input.token),
          ),
          eq(clientResources.isPublic, true),
          eq(clientResources.isActive, true),
        ),
        with: {
          client: {
            columns: { name: true },
          },
        },
      });

      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Demo not found or no longer public",
        });
      }

      return {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        url: resource.url,
        embedCode: resource.embedCode,
        content: resource.content,
        icon: resource.icon,
        metadata: resource.metadata,
        clientName: resource.client.name,
        publicSlug: resource.publicSlug,
      };
    }),

  /**
   * Toggle a demo's public sharing status
   * Admin can toggle any; client can only toggle their own client's resources
   */
  toggleDemoPublic: protectedProcedure
    .input(z.object({ resourceId: z.number(), isPublic: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || !profile.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Portal access denied",
        });
      }

      // Get the resource with client info
      const resource = await db.query.clientResources.findFirst({
        where: eq(clientResources.id, input.resourceId),
        with: { client: true },
      });

      if (!resource) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resource not found",
        });
      }

      // Authorization: admin can toggle any; client only their own
      if (profile.role === "client" && profile.clientSlug !== resource.client.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only share your own demos",
        });
      }

      // Generate token on first toggle-to-public; reuse existing token
      const publicToken = resource.publicToken ?? (input.isPublic ? nanoid(12) : null);

      const [updated] = await db
        .update(clientResources)
        .set({
          isPublic: input.isPublic,
          publicToken,
          updatedAt: new Date(),
        })
        .where(eq(clientResources.id, input.resourceId))
        .returning();

      return updated!;
    }),

  /**
   * Set or clear a custom public slug for a demo (admin only)
   */
  setPublicSlug: protectedProcedure
    .input(
      z.object({
        resourceId: z.number(),
        slug: z
          .string()
          .min(3)
          .max(60)
          .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug must be lowercase alphanumeric with hyphens, and cannot start or end with a hyphen")
          .nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      // Check uniqueness if setting a slug
      if (input.slug) {
        const existing = await db.query.clientResources.findFirst({
          where: and(
            eq(clientResources.publicSlug, input.slug),
          ),
        });

        if (existing && existing.id !== input.resourceId) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This slug is already in use",
          });
        }
      }

      const [updated] = await db
        .update(clientResources)
        .set({
          publicSlug: input.slug,
          updatedAt: new Date(),
        })
        .where(eq(clientResources.id, input.resourceId))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resource not found",
        });
      }

      return updated;
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
        isActive: z.boolean().optional(), // undefined = admin sees all, true/false = filter
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
      ];

      // Clients always see only active resources; admins can filter or see all
      const activeFilter = input.isActive ?? (profile.role === "client" ? true : undefined);
      if (activeFilter !== undefined) {
        conditions.push(eq(clientResources.isActive, activeFilter));
      }

      // Clients cannot see resources under development; admins see all
      if (profile.role === "client") {
        conditions.push(eq(clientResources.underDevelopment, false));
      }

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
        // Verify customer exists and get balance in one call
        let validCustomerId = client.stripeCustomerId;
        let customer;
        try {
          customer = await stripe.customers.retrieve(validCustomerId);
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

        // Get balance from customer object (already fetched above)
        const balance = "balance" in customer ? customer.balance : null;

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
            with: { project: true },
          }),
        ]);

        // Build dual lookup maps from proposals
        interface ProposalLink {
          proposalId: number;
          proposalTitle: string;
          projectId: number | null;
          projectName: string | null;
        }
        const piToProposal = new Map<string, ProposalLink>();
        const subToProposal = new Map<string, ProposalLink>();
        const invToProposal = new Map<string, ProposalLink>();
        for (const p of proposals) {
          const meta = p.metadata as Record<string, unknown> | null;
          const link: ProposalLink = {
            proposalId: p.id,
            proposalTitle: p.title,
            projectId: p.project?.id ?? null,
            projectName: p.project?.name ?? null,
          };
          const piId = meta?.stripePaymentIntentId as string | undefined;
          if (piId) piToProposal.set(piId, link);
          const subId = meta?.stripeSubscriptionId as string | undefined;
          if (subId) subToProposal.set(subId, link);
          const invId = meta?.stripeInvoiceId as string | undefined;
          if (invId) invToProposal.set(invId, link);
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

        // Fetch product names (with 24hr in-memory cache)
        const productMap = new Map<string, string>();
        if (productIds.size > 0) {
          const uncachedIds: string[] = [];
          for (const id of productIds) {
            const cached = getCachedProductName(id);
            if (cached) {
              productMap.set(id, cached);
            } else {
              uncachedIds.push(id);
            }
          }
          if (uncachedIds.length > 0) {
            const products = await Promise.all(
              uncachedIds.map((id) => stripe!.products.retrieve(id)),
            );
            for (const product of products) {
              if (!("deleted" in product)) {
                productMap.set(product.id, product.name);
                cacheProductName(product.id, product.name);
              }
            }
          }
        }

        // Build a set of subscription IDs that are linked to proposals
        const linkedSubIds = new Set(subToProposal.keys());

        return {
          hasStripeCustomer: true,
          invoices: invoices.data
            .map((inv) => {
              const lineItemDescriptions = inv.lines?.data
                ?.map((line) => line.description)
                .filter(Boolean)
                .slice(0, 3);

              // Resolve proposal link via invoice ID, subscription, or payment intent
              const invSubDetails = inv.parent?.subscription_details;
              const invSubscriptionId = invSubDetails
                ? typeof invSubDetails.subscription === "string"
                  ? invSubDetails.subscription
                  : invSubDetails.subscription?.id ?? null
                : null;
              const proposalLink =
                invToProposal.get(inv.id) ??
                (invSubscriptionId ? subToProposal.get(invSubscriptionId) ?? null : null);

              const proposalName = proposalLink?.proposalTitle ?? null;

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
                proposalId: proposalLink?.proposalId ?? null,
                projectId: proposalLink?.projectId ?? null,
                projectName: proposalLink?.projectName ?? null,
                _hasProposalLink: !!proposalLink,
                _parentSubscriptionLinked: invSubscriptionId
                  ? linkedSubIds.has(invSubscriptionId)
                  : false,
              };
            })
            // Only show invoices linked to a proposal (directly or via subscription)
            .filter((inv) => inv._hasProposalLink || inv._parentSubscriptionLinked)
            .map(({ _hasProposalLink, _parentSubscriptionLinked, ...inv }) => inv),
          // One-time payments (from Checkout) - only show proposal-linked payments
          payments: (() => {
            const filteredPayments = paymentIntents.data
              .filter((pi) => pi.status === "succeeded")
              .filter((pi) => {
                const desc = pi.description?.toLowerCase() ?? "";
                return !desc.includes("subscription") && !desc.includes("invoice");
              })
              // Only include payments linked to a proposal
              .filter((pi) => piToProposal.has(pi.id));

            return filteredPayments.map((pi) => {
              const piLink = piToProposal.get(pi.id) ?? null;
              return {
                id: pi.id,
                amount: pi.amount,
                currency: pi.currency,
                status: pi.status,
                created: pi.created,
                description: piLink?.proposalTitle ?? pi.description ?? "Payment",
                receiptUrl: pi.latest_charge && typeof pi.latest_charge !== "string"
                  ? pi.latest_charge.receipt_url ?? null
                  : null,
                proposalId: piLink?.proposalId ?? null,
                projectId: piLink?.projectId ?? null,
                projectName: piLink?.projectName ?? null,
              };
            });
          })(),
          // Only show subscriptions linked to a proposal
          subscriptions: subscriptions.data
            .filter((sub) => subToProposal.has(sub.id))
            .map((sub) => {
              const subLink = subToProposal.get(sub.id) ?? null;
              return {
                id: sub.id,
                status: sub.status,
                startDate: sub.start_date,
                currentPeriodEnd: sub.items.data[0]?.current_period_end ?? null,
                billingCycleAnchor: sub.billing_cycle_anchor,
                cancelAtPeriodEnd: sub.cancel_at_period_end,
                canceledAt: sub.canceled_at,
                trialEnd: sub.trial_end,
                proposalName: subLink?.proposalTitle ?? null,
                proposalId: subLink?.proposalId ?? null,
                projectId: subLink?.projectId ?? null,
                projectName: subLink?.projectName ?? null,
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
              };
            }),
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

      // Build conditions - clients cannot see proposals under development
      const conditions = [
        eq(clientResources.clientId, client.id),
        eq(clientResources.section, "proposals"),
        eq(clientResources.isActive, true),
      ];

      if (profile.role === "client") {
        conditions.push(eq(clientResources.underDevelopment, false));
      }

      // Fetch proposals from resources
      const proposals = await db.query.clientResources.findMany({
        where: and(...conditions),
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

  /**
   * Update a client resource (admin only)
   * Supports toggling active/archived, reassigning project, editing fields
   */
  updateResource: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        projectId: z.number().nullable().optional(),
        title: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        isActive: z.boolean().optional(),
        underDevelopment: z.boolean().optional(), // Hide from clients when true
        sortOrder: z.number().optional(),
        isFeatured: z.boolean().optional(),
        url: z.string().nullable().optional(),
        metadata: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const { id, ...updates } = input;

      // Filter out undefined values
      const setValues: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          setValues[key] = value;
        }
      }

      if (Object.keys(setValues).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No fields to update",
        });
      }

      setValues.updatedAt = new Date();

      const [updated] = await db
        .update(clientResources)
        .set(setValues)
        .where(eq(clientResources.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resource not found",
        });
      }

      return updated;
    }),

  /**
   * Delete a client resource (admin only)
   */
  deleteResource: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const [deleted] = await db
        .delete(clientResources)
        .where(eq(clientResources.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resource not found",
        });
      }

      return { success: true };
    }),

  /**
   * Get all projects for a client
   */
  getProjects: protectedProcedure
    .input(z.object({ slug: z.string() }))
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

      if (profile.role === "client" && profile.clientSlug !== input.slug) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only access your own projects",
        });
      }

      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      return db.query.clientProjects.findMany({
        where: eq(clientProjects.clientId, client.id),
        orderBy: [desc(clientProjects.createdAt)],
      });
    }),

  /**
   * Create a project for a client (admin only)
   */
  createProject: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const client = await db.query.clients.findFirst({
        where: eq(clients.slug, input.slug),
      });

      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client not found",
        });
      }

      const [project] = await db
        .insert(clientProjects)
        .values({
          clientId: client.id,
          name: input.name,
          description: input.description ?? null,
        })
        .returning();

      return project;
    }),

  /**
   * Update a project (admin only)
   */
  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const { id, ...data } = input;
      const [updated] = await db
        .update(clientProjects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(clientProjects.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return updated;
    }),

  /**
   * Delete a project (admin only)
   */
  deleteProject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await db.query.portalUsers.findFirst({
        where: eq(portalUsers.authUserId, ctx.user.id),
      });

      if (!profile || profile.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const [deleted] = await db
        .delete(clientProjects)
        .where(eq(clientProjects.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return { success: true };
    }),
});
