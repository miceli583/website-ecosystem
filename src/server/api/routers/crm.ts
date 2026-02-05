import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  masterCrm,
  banyanEarlyAccess,
  contactSubmissions,
  personalContactSubmissions,
} from "~/server/db/schema";
import { count, desc, eq, sql, ilike, or } from "drizzle-orm";

/**
 * CRM Router
 *
 * Admin-only procedures for the master CRM dashboard.
 * Manages contacts across all sources: personal site, miracle mind, banyan waitlist.
 */
export const crmRouter = createTRPCRouter({
  /**
   * Get pipeline stats by status
   */
  getPipelineStats: adminProcedure.query(async () => {
    const statuses = await db
      .select({
        status: masterCrm.status,
        count: count(),
      })
      .from(masterCrm)
      .groupBy(masterCrm.status);

    const pipeline: Record<string, number> = {
      lead: 0,
      prospect: 0,
      client: 0,
      inactive: 0,
      churned: 0,
    };

    for (const row of statuses) {
      pipeline[row.status] = row.count;
    }

    const total = Object.values(pipeline).reduce((sum, n) => sum + n, 0);

    return { ...pipeline, total };
  }),

  /**
   * List all master CRM contacts with optional search/filter
   */
  getContacts: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.string().optional(),
        source: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(
          or(
            ilike(masterCrm.name, `%${input.search}%`),
            ilike(masterCrm.email, `%${input.search}%`)
          )
        );
      }
      if (input.status) {
        conditions.push(eq(masterCrm.status, input.status));
      }
      if (input.source) {
        conditions.push(eq(masterCrm.source, input.source));
      }

      const where =
        conditions.length > 0
          ? sql`${sql.join(
              conditions.map((c) => sql`(${c})`),
              sql` AND `
            )}`
          : undefined;

      const [contacts, totalResult] = await Promise.all([
        db
          .select()
          .from(masterCrm)
          .where(where)
          .orderBy(desc(masterCrm.lastContactAt))
          .limit(input.limit)
          .offset(input.offset),
        db.select({ count: count() }).from(masterCrm).where(where),
      ]);

      return {
        contacts,
        total: totalResult[0]?.count ?? 0,
        hasMore: input.offset + input.limit < (totalResult[0]?.count ?? 0),
      };
    }),

  /**
   * Get single contact with related submissions
   */
  getContact: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const contact = await db
        .select()
        .from(masterCrm)
        .where(eq(masterCrm.id, input.id))
        .limit(1);

      if (!contact[0]) return null;

      const [mmSubmissions, personalSubmissions, banyanSignups] =
        await Promise.all([
          db
            .select()
            .from(contactSubmissions)
            .where(eq(contactSubmissions.crmId, input.id))
            .orderBy(desc(contactSubmissions.createdAt)),
          db
            .select()
            .from(personalContactSubmissions)
            .where(eq(personalContactSubmissions.crmId, input.id))
            .orderBy(desc(personalContactSubmissions.createdAt)),
          db
            .select()
            .from(banyanEarlyAccess)
            .where(eq(banyanEarlyAccess.crmId, input.id))
            .orderBy(desc(banyanEarlyAccess.createdAt)),
        ]);

      return {
        ...contact[0],
        submissions: {
          miracleMind: mmSubmissions,
          personal: personalSubmissions,
          banyan: banyanSignups,
        },
      };
    }),

  /**
   * Update a master CRM contact
   */
  updateContact: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z
          .enum(["lead", "prospect", "client", "inactive", "churned"])
          .optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().nullable().optional(),
        name: z.string().min(1).optional(),
        phone: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db
        .update(masterCrm)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(masterCrm.id, id))
        .returning();
      return updated;
    }),

  /**
   * Get leads: Banyan early access signups + contact form submissions
   */
  getLeads: adminProcedure.query(async () => {
    const [banyanLeads, mmLeads, personalLeads] = await Promise.all([
      db
        .select()
        .from(banyanEarlyAccess)
        .orderBy(desc(banyanEarlyAccess.createdAt))
        .limit(50),
      db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(50),
      db
        .select()
        .from(personalContactSubmissions)
        .orderBy(desc(personalContactSubmissions.createdAt))
        .limit(50),
    ]);

    return {
      banyan: banyanLeads,
      miracleMind: mmLeads,
      personal: personalLeads,
    };
  }),

  /**
   * Get source breakdown
   */
  getSourceBreakdown: adminProcedure.query(async () => {
    const sources = await db
      .select({
        source: masterCrm.source,
        count: count(),
      })
      .from(masterCrm)
      .groupBy(masterCrm.source)
      .orderBy(desc(count()));

    return sources;
  }),

  /**
   * Mark a Banyan early access lead as contacted
   */
  markBanyanContacted: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const [updated] = await db
        .update(banyanEarlyAccess)
        .set({ contacted: true, updatedAt: new Date() })
        .where(eq(banyanEarlyAccess.id, input.id))
        .returning();
      return updated;
    }),

  /**
   * Mark a contact submission as read
   */
  markSubmissionRead: adminProcedure
    .input(
      z.object({
        id: z.number(),
        type: z.enum(["miracleMind", "personal"]),
      })
    )
    .mutation(async ({ input }) => {
      if (input.type === "miracleMind") {
        const [updated] = await db
          .update(contactSubmissions)
          .set({ read: true })
          .where(eq(contactSubmissions.id, input.id))
          .returning();
        return updated;
      } else {
        const [updated] = await db
          .update(personalContactSubmissions)
          .set({ read: true })
          .where(eq(personalContactSubmissions.id, input.id))
          .returning();
        return updated;
      }
    }),
});
