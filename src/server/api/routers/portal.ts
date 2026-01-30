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

      return resources;
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
});
