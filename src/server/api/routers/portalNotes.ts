import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { portalUsers, clients, clientNotes } from "~/server/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Shared portal access check — returns profile + client for a given slug.
 * Admins can access any client, clients can only access their own.
 */
async function getPortalAccess(userId: string, slug: string) {
  const profile = await db.query.portalUsers.findFirst({
    where: eq(portalUsers.authUserId, userId),
  });

  if (!profile || !profile.isActive) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Portal access denied",
    });
  }

  if (profile.role === "client" && profile.clientSlug !== slug) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You can only access your own portal",
    });
  }

  const client = await db.query.clients.findFirst({
    where: eq(clients.slug, slug),
  });

  if (!client) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Client not found",
    });
  }

  return { profile, client };
}

export const portalNotesRouter = createTRPCRouter({
  /**
   * List notes for a client, ordered by pinned first then updatedAt desc
   */
  getNotes: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { client } = await getPortalAccess(ctx.user.id, input.slug);

      const notes = await db.query.clientNotes.findMany({
        where: eq(clientNotes.clientId, client.id),
        orderBy: [desc(clientNotes.isPinned), desc(clientNotes.updatedAt)],
      });

      return notes;
    }),

  /**
   * Create a new note — both admin and client can create
   */
  createNote: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string().min(1).max(200),
        content: z.string().default(""),
        projectId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { profile, client } = await getPortalAccess(
        ctx.user.id,
        input.slug,
      );

      const [note] = await db
        .insert(clientNotes)
        .values({
          clientId: client.id,
          projectId: input.projectId,
          createdByAuthId: ctx.user.id,
          createdByName: profile.name,
          title: input.title,
          content: input.content,
        })
        .returning();

      return note;
    }),

  /**
   * Update a note — both admin and client can edit any note on their portal
   */
  updateNote: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        noteId: z.number(),
        title: z.string().min(1).max(200).optional(),
        content: z.string().optional(),
        isPinned: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { client } = await getPortalAccess(ctx.user.id, input.slug);

      // Verify note belongs to this client
      const existing = await db.query.clientNotes.findFirst({
        where: and(
          eq(clientNotes.id, input.noteId),
          eq(clientNotes.clientId, client.id),
        ),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };
      if (input.title !== undefined) updateData.title = input.title;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.isPinned !== undefined) updateData.isPinned = input.isPinned;

      const [updated] = await db
        .update(clientNotes)
        .set(updateData)
        .where(eq(clientNotes.id, input.noteId))
        .returning();

      return updated;
    }),

  /**
   * Delete a note — admin can delete any, client can only delete their own
   */
  deleteNote: protectedProcedure
    .input(z.object({ slug: z.string(), noteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { profile, client } = await getPortalAccess(
        ctx.user.id,
        input.slug,
      );

      const existing = await db.query.clientNotes.findFirst({
        where: and(
          eq(clientNotes.id, input.noteId),
          eq(clientNotes.clientId, client.id),
        ),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      // Clients can only delete their own notes
      if (
        profile.role === "client" &&
        existing.createdByAuthId !== ctx.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own notes",
        });
      }

      await db.delete(clientNotes).where(eq(clientNotes.id, input.noteId));

      return { success: true };
    }),
});
