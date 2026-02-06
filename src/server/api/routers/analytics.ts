import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  banyanEarlyAccess,
  contactSubmissions,
  personalContactSubmissions,
} from "~/server/db/schema";
import { count, desc, sql, eq, gte } from "drizzle-orm";

/**
 * Analytics Router
 *
 * Admin-only procedures for site metrics: form submissions, signups, domain activity.
 * Revenue/finance data lives in the finance router; CRM pipeline in the crm router.
 */
export const analyticsRouter = createTRPCRouter({
  /**
   * Site submission & signup metrics
   */
  getOverview: adminProcedure.query(async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      mmTotal,
      mmRecent,
      mmUnread,
      personalTotal,
      personalRecent,
      personalUnread,
      banyanTotal,
      banyanRecent,
    ] = await Promise.all([
      db.select({ count: count() }).from(contactSubmissions),
      db
        .select({ count: count() })
        .from(contactSubmissions)
        .where(gte(contactSubmissions.createdAt, thirtyDaysAgo)),
      db
        .select({ count: count() })
        .from(contactSubmissions)
        .where(eq(contactSubmissions.read, false)),
      db.select({ count: count() }).from(personalContactSubmissions),
      db
        .select({ count: count() })
        .from(personalContactSubmissions)
        .where(gte(personalContactSubmissions.createdAt, thirtyDaysAgo)),
      db
        .select({ count: count() })
        .from(personalContactSubmissions)
        .where(eq(personalContactSubmissions.read, false)),
      db.select({ count: count() }).from(banyanEarlyAccess),
      db
        .select({ count: count() })
        .from(banyanEarlyAccess)
        .where(gte(banyanEarlyAccess.createdAt, thirtyDaysAgo)),
    ]);

    const totalSubmissions =
      (mmTotal[0]?.count ?? 0) + (personalTotal[0]?.count ?? 0);
    const recentSubmissions =
      (mmRecent[0]?.count ?? 0) + (personalRecent[0]?.count ?? 0);
    const unreadSubmissions =
      (mmUnread[0]?.count ?? 0) + (personalUnread[0]?.count ?? 0);

    return {
      totalSubmissions,
      submissionsThisMonth: recentSubmissions,
      unreadSubmissions,
      banyanSignups: banyanTotal[0]?.count ?? 0,
      banyanSignupsRecent: banyanRecent[0]?.count ?? 0,
      miracleMindSubmissions: mmTotal[0]?.count ?? 0,
      personalSubmissions: personalTotal[0]?.count ?? 0,
    };
  }),

  /**
   * Recent form submissions + Banyan signups
   */
  getRecentActivity: adminProcedure.query(async () => {
    const [mmSubmissions, personalSubmissions, banyanSignups] =
      await Promise.all([
        db
          .select({
            id: contactSubmissions.id,
            name: contactSubmissions.name,
            email: contactSubmissions.email,
            message: contactSubmissions.message,
            read: contactSubmissions.read,
            createdAt: contactSubmissions.createdAt,
          })
          .from(contactSubmissions)
          .orderBy(desc(contactSubmissions.createdAt))
          .limit(10),
        db
          .select({
            id: personalContactSubmissions.id,
            name: personalContactSubmissions.name,
            email: personalContactSubmissions.email,
            message: personalContactSubmissions.message,
            read: personalContactSubmissions.read,
            createdAt: personalContactSubmissions.createdAt,
          })
          .from(personalContactSubmissions)
          .orderBy(desc(personalContactSubmissions.createdAt))
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
      ]);

    return { mmSubmissions, personalSubmissions, banyanSignups };
  }),

  /**
   * Monthly submission volume by source (last 6 months)
   */
  getSubmissionGrowth: adminProcedure.query(async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [mmMonthly, personalMonthly, banyanMonthly] = await Promise.all([
      db
        .select({
          month: sql<string>`to_char(${contactSubmissions.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(contactSubmissions)
        .where(gte(contactSubmissions.createdAt, sixMonthsAgo))
        .groupBy(sql`to_char(${contactSubmissions.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`to_char(${contactSubmissions.createdAt}, 'YYYY-MM')`),
      db
        .select({
          month: sql<string>`to_char(${personalContactSubmissions.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(personalContactSubmissions)
        .where(gte(personalContactSubmissions.createdAt, sixMonthsAgo))
        .groupBy(
          sql`to_char(${personalContactSubmissions.createdAt}, 'YYYY-MM')`
        )
        .orderBy(
          sql`to_char(${personalContactSubmissions.createdAt}, 'YYYY-MM')`
        ),
      db
        .select({
          month: sql<string>`to_char(${banyanEarlyAccess.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(banyanEarlyAccess)
        .where(gte(banyanEarlyAccess.createdAt, sixMonthsAgo))
        .groupBy(sql`to_char(${banyanEarlyAccess.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`to_char(${banyanEarlyAccess.createdAt}, 'YYYY-MM')`),
    ]);

    // Merge into unified monthly view
    const monthMap = new Map<
      string,
      { miracleMind: number; personal: number; banyan: number }
    >();

    for (const row of mmMonthly) {
      const entry = monthMap.get(row.month) ?? {
        miracleMind: 0,
        personal: 0,
        banyan: 0,
      };
      entry.miracleMind = row.count;
      monthMap.set(row.month, entry);
    }
    for (const row of personalMonthly) {
      const entry = monthMap.get(row.month) ?? {
        miracleMind: 0,
        personal: 0,
        banyan: 0,
      };
      entry.personal = row.count;
      monthMap.set(row.month, entry);
    }
    for (const row of banyanMonthly) {
      const entry = monthMap.get(row.month) ?? {
        miracleMind: 0,
        personal: 0,
        banyan: 0,
      };
      entry.banyan = row.count;
      monthMap.set(row.month, entry);
    }

    return Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, counts]) => ({
        month,
        ...counts,
        total: counts.miracleMind + counts.personal + counts.banyan,
      }));
  }),
});
