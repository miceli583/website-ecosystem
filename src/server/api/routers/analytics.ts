import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  masterCrm,
  banyanEarlyAccess,
  contactSubmissions,
  personalContactSubmissions,
  clients,
  clientProjects,
  clientUpdates,
} from "~/server/db/schema";
import { count, desc, sql, eq } from "drizzle-orm";
import { stripeLive } from "~/lib/stripe-live";

/**
 * Analytics Router
 *
 * Admin-only procedures for the analytics dashboard.
 * Aggregates internal data from DB tables + Stripe for business metrics.
 */
export const analyticsRouter = createTRPCRouter({
  /**
   * Get overview metrics: contacts, clients, projects, updates, signups
   */
  getOverview: adminProcedure.query(async () => {
    const [
      contactsCount,
      banyanCount,
      mmContactCount,
      personalContactCount,
      clientsCount,
      activeClientsCount,
      projectsCount,
      updatesCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(masterCrm),
      db.select({ count: count() }).from(banyanEarlyAccess),
      db.select({ count: count() }).from(contactSubmissions),
      db.select({ count: count() }).from(personalContactSubmissions),
      db.select({ count: count() }).from(clients),
      db
        .select({ count: count() })
        .from(clients)
        .where(eq(clients.status, "active")),
      db.select({ count: count() }).from(clientProjects),
      db.select({ count: count() }).from(clientUpdates),
    ]);

    return {
      totalContacts: contactsCount[0]?.count ?? 0,
      banyanSignups: banyanCount[0]?.count ?? 0,
      miracleMindContacts: mmContactCount[0]?.count ?? 0,
      personalContacts: personalContactCount[0]?.count ?? 0,
      totalClients: clientsCount[0]?.count ?? 0,
      activeClients: activeClientsCount[0]?.count ?? 0,
      totalProjects: projectsCount[0]?.count ?? 0,
      totalUpdates: updatesCount[0]?.count ?? 0,
    };
  }),

  /**
   * Get contact source breakdown from master CRM
   */
  getContactSources: adminProcedure.query(async () => {
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
   * Get pipeline status breakdown from master CRM
   */
  getPipelineBreakdown: adminProcedure.query(async () => {
    const statuses = await db
      .select({
        status: masterCrm.status,
        count: count(),
      })
      .from(masterCrm)
      .groupBy(masterCrm.status)
      .orderBy(desc(count()));

    return statuses;
  }),

  /**
   * Get recent activity across the platform
   */
  getRecentActivity: adminProcedure.query(async () => {
    const [recentContacts, recentSignups, recentUpdates] = await Promise.all([
      db
        .select({
          id: masterCrm.id,
          name: masterCrm.name,
          email: masterCrm.email,
          source: masterCrm.source,
          status: masterCrm.status,
          createdAt: masterCrm.createdAt,
        })
        .from(masterCrm)
        .orderBy(desc(masterCrm.createdAt))
        .limit(10),
      db
        .select({
          id: banyanEarlyAccess.id,
          name: banyanEarlyAccess.fullName,
          email: banyanEarlyAccess.email,
          role: banyanEarlyAccess.role,
          createdAt: banyanEarlyAccess.createdAt,
        })
        .from(banyanEarlyAccess)
        .orderBy(desc(banyanEarlyAccess.createdAt))
        .limit(10),
      db.query.clientUpdates.findMany({
        orderBy: [desc(clientUpdates.createdAt)],
        limit: 10,
        with: {
          project: {
            with: {
              client: true,
            },
          },
        },
      }),
    ]);

    return { recentContacts, recentSignups, recentUpdates };
  }),

  /**
   * Get Stripe revenue summary for analytics
   */
  getRevenueSummary: adminProcedure.query(async () => {
    if (!stripeLive) {
      return { connected: false, mrr: 0, totalRevenue: 0, thisMonthRevenue: 0, lastMonthRevenue: 0 };
    }

    try {
      const [subscriptions, charges] = await Promise.all([
        stripeLive.subscriptions.list({ status: "active", limit: 100 }),
        stripeLive.charges.list({ limit: 100 }),
      ]);

      let mrr = 0;
      for (const sub of subscriptions.data) {
        for (const item of sub.items.data) {
          const amount = item.price?.unit_amount ?? 0;
          const interval = item.price?.recurring?.interval;
          if (interval === "month") mrr += amount;
          else if (interval === "year") mrr += amount / 12;
        }
      }

      const successfulCharges = charges.data.filter((c) => c.status === "succeeded");
      const totalRevenue = successfulCharges.reduce((sum, c) => sum + c.amount, 0);

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000;
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime() / 1000;

      const thisMonthRevenue = successfulCharges
        .filter((c) => c.created >= startOfMonth)
        .reduce((sum, c) => sum + c.amount, 0);

      const lastMonthRevenue = successfulCharges
        .filter((c) => c.created >= startOfLastMonth && c.created < startOfMonth)
        .reduce((sum, c) => sum + c.amount, 0);

      return {
        connected: true,
        mrr: Math.round(mrr),
        totalRevenue,
        thisMonthRevenue,
        lastMonthRevenue,
      };
    } catch (error) {
      console.error("Analytics revenue error:", error);
      return { connected: false, mrr: 0, totalRevenue: 0, thisMonthRevenue: 0, lastMonthRevenue: 0 };
    }
  }),

  /**
   * Get monthly contact growth (last 6 months)
   */
  getContactGrowth: adminProcedure.query(async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthly = await db
      .select({
        month: sql<string>`to_char(${masterCrm.createdAt}, 'YYYY-MM')`,
        count: count(),
      })
      .from(masterCrm)
      .where(sql`${masterCrm.createdAt} >= ${sixMonthsAgo}`)
      .groupBy(sql`to_char(${masterCrm.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${masterCrm.createdAt}, 'YYYY-MM')`);

    return monthly;
  }),
});
