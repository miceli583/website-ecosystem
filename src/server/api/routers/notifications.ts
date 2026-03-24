import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { notifications } from "~/server/db/schema";
import { and, count, desc, eq } from "drizzle-orm";

export const notificationsRouter = createTRPCRouter({
  /** Get unread count for the badge */
  getUnreadCount: adminProcedure.query(async ({ ctx }) => {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, ctx.profile.id),
          eq(notifications.isRead, false)
        )
      );
    return result?.count ?? 0;
  }),

  /** Get recent unread notifications (for the dropdown) */
  getUnread: adminProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, ctx.profile.id),
          eq(notifications.isRead, false)
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(10);
  }),

  /** Get all notifications with pagination */
  getAll: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const [items, totalResult] = await Promise.all([
        db
          .select()
          .from(notifications)
          .where(eq(notifications.recipientId, ctx.profile.id))
          .orderBy(desc(notifications.createdAt))
          .limit(input.limit)
          .offset(input.offset),
        db
          .select({ count: count() })
          .from(notifications)
          .where(eq(notifications.recipientId, ctx.profile.id)),
      ]);

      return {
        items,
        total: totalResult[0]?.count ?? 0,
        hasMore: input.offset + input.limit < (totalResult[0]?.count ?? 0),
      };
    }),

  /** Mark a single notification as read */
  markRead: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.recipientId, ctx.profile.id)
          )
        )
        .returning();
      return updated;
    }),

  /** Mark all notifications as read */
  markAllRead: adminProcedure.mutation(async ({ ctx }) => {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.recipientId, ctx.profile.id),
          eq(notifications.isRead, false)
        )
      );
    return { success: true };
  }),
});
