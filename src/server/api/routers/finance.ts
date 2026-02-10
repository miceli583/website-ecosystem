import { z } from "zod";
import { eq, and, gte, lt, sql, desc, asc, inArray, isNotNull } from "drizzle-orm";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { stripeLive } from "~/lib/stripe-live";
import {
  getMercuryAccounts,
  getMercuryTotalBalance,
  getMercuryTransactions,
  type MercuryTransaction,
} from "~/lib/mercury";
import {
  expenseCategories,
  expenses,
  mercuryTransactionCategories,
} from "~/server/db/schema";

const IRS_CATEGORIES = [
  { name: "Advertising & Marketing", irsCategory: "Line 8", sortOrder: 1 },
  { name: "Car & Vehicle", irsCategory: "Line 9", sortOrder: 2 },
  { name: "Commissions & Fees", irsCategory: "Line 10", sortOrder: 3 },
  { name: "Contract Labor", irsCategory: "Line 11", sortOrder: 4 },
  { name: "Insurance", irsCategory: "Line 15", sortOrder: 5 },
  { name: "Legal & Professional", irsCategory: "Line 17", sortOrder: 6 },
  { name: "Office Expenses", irsCategory: "Line 18", sortOrder: 7 },
  { name: "Rent & Lease", irsCategory: "Line 20", sortOrder: 8 },
  { name: "Software & Subscriptions", irsCategory: "Line 27a", sortOrder: 9 },
  { name: "Meals & Entertainment", irsCategory: "Line 24b", sortOrder: 10 },
  { name: "Travel", irsCategory: "Line 24a", sortOrder: 11 },
  { name: "Utilities", irsCategory: "Line 25", sortOrder: 12 },
  { name: "Education & Training", irsCategory: "Line 27a", sortOrder: 13 },
  { name: "Bank & Finance Fees", irsCategory: "Line 27a", sortOrder: 14 },
  { name: "Equipment & Hardware", irsCategory: "Line 13", sortOrder: 15 },
  { name: "Taxes & Licenses", irsCategory: "Line 23", sortOrder: 16 },
  { name: "Other", irsCategory: "Line 27a", sortOrder: 17 },
] as const;

/**
 * Smart categorization rules: map counterparty name patterns to IRS categories.
 * Pattern matching is case-insensitive. First match wins.
 */
const CATEGORIZATION_RULES: Array<{
  pattern: RegExp;
  categoryName: string;
  isTaxDeductible: boolean;
}> = [
  // Software & Subscriptions
  { pattern: /vercel/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /supabase/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /anthropic|claude/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /openai/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /github/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /figma/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /notion/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /slack/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /google\s*(cloud|workspace|domains)/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /aws|amazon web/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /netlify/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /heroku/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /digital\s*ocean/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /make\.com|integromat/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /zapier/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /postmark|resend|sendgrid|mailgun/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /adobe/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /canva/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /1password|lastpass|bitwarden/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },
  { pattern: /linear|jira|asana/i, categoryName: "Software & Subscriptions", isTaxDeductible: true },

  // Advertising & Marketing
  { pattern: /namecheap|godaddy|cloudflare.*domain|porkbun/i, categoryName: "Advertising & Marketing", isTaxDeductible: true },
  { pattern: /google\s*ads|facebook\s*ads|meta\s*ads/i, categoryName: "Advertising & Marketing", isTaxDeductible: true },
  { pattern: /mailchimp|convertkit|beehiiv/i, categoryName: "Advertising & Marketing", isTaxDeductible: true },

  // Commissions & Fees
  { pattern: /stripe/i, categoryName: "Commissions & Fees", isTaxDeductible: true },
  { pattern: /paypal/i, categoryName: "Commissions & Fees", isTaxDeductible: true },
  { pattern: /square/i, categoryName: "Commissions & Fees", isTaxDeductible: true },

  // Equipment & Hardware
  { pattern: /apple|macbook|ipad|iphone/i, categoryName: "Equipment & Hardware", isTaxDeductible: true },
  { pattern: /dell|lenovo|hp\b/i, categoryName: "Equipment & Hardware", isTaxDeductible: true },
  { pattern: /amazon(?!\s*web)/i, categoryName: "Equipment & Hardware", isTaxDeductible: true },

  // Education & Training
  { pattern: /udemy|coursera|skillshare|linkedin\s*learning/i, categoryName: "Education & Training", isTaxDeductible: true },
  { pattern: /conference|summit|workshop/i, categoryName: "Education & Training", isTaxDeductible: true },

  // Bank & Finance Fees
  { pattern: /mercury.*fee|bank\s*fee|wire\s*fee/i, categoryName: "Bank & Finance Fees", isTaxDeductible: true },

  // Meals & Entertainment
  { pattern: /uber\s*eats|doordash|grubhub|postmates/i, categoryName: "Meals & Entertainment", isTaxDeductible: true },
  { pattern: /h-?e-?b\b|heb\b|h\.e\.b/i, categoryName: "Meals & Entertainment", isTaxDeductible: true },
  { pattern: /walmart|target|costco|sam'?s\s*club/i, categoryName: "Meals & Entertainment", isTaxDeductible: true },
  { pattern: /starbucks|dunkin|coffee|cafe|bakery/i, categoryName: "Meals & Entertainment", isTaxDeductible: true },
  { pattern: /restaurant|grill|pizza|burger|taco|sushi|diner|bistro|kitchen/i, categoryName: "Meals & Entertainment", isTaxDeductible: true },
  { pattern: /chipotle|chick-?fil-?a|whataburger|panera|subway/i, categoryName: "Meals & Entertainment", isTaxDeductible: true },
  { pattern: /cabana|bar\s|lounge|pub\b|brewery/i, categoryName: "Meals & Entertainment", isTaxDeductible: true },

  // Car & Vehicle
  { pattern: /shell\b|exxon|chevron|texaco|valero|gas\s*station|fuel|bp\b|citgo/i, categoryName: "Car & Vehicle", isTaxDeductible: true },
  { pattern: /car\s*wash|jiffy\s*lube|autozone|o'?reilly/i, categoryName: "Car & Vehicle", isTaxDeductible: true },
  { pattern: /parking|toll|ez-?pass/i, categoryName: "Car & Vehicle", isTaxDeductible: true },

  // Travel
  { pattern: /uber(?!\s*eats)|lyft/i, categoryName: "Travel", isTaxDeductible: true },
  { pattern: /airbnb|hotel|airline|delta|united|american\s*air|southwest|jetblue/i, categoryName: "Travel", isTaxDeductible: true },

  // Utilities
  { pattern: /comcast|xfinity|verizon|at&t|t-?mobile/i, categoryName: "Utilities", isTaxDeductible: true },

  // Insurance
  { pattern: /insurance|policy/i, categoryName: "Insurance", isTaxDeductible: true },

  // Legal & Professional
  { pattern: /attorney|law\s*firm|legal|accountant|cpa/i, categoryName: "Legal & Professional", isTaxDeductible: true },

  // Contract Labor
  { pattern: /fiverr|upwork|toptal|freelanc/i, categoryName: "Contract Labor", isTaxDeductible: true },

  // Rent & Lease
  { pattern: /wework|co-?working|regus/i, categoryName: "Rent & Lease", isTaxDeductible: true },

  // Taxes & Licenses
  { pattern: /irs|tax\s*payment|state\s*tax|license\s*fee/i, categoryName: "Taxes & Licenses", isTaxDeductible: false },

  // Office Expenses
  { pattern: /office\s*depot|staples|usps|fedex|ups\b/i, categoryName: "Office Expenses", isTaxDeductible: true },
];

/**
 * Filter out failed/cancelled Mercury transactions from all calculations
 */
function filterActiveMercuryTransactions(txs: MercuryTransaction[]): MercuryTransaction[] {
  return txs.filter((t) => t.status !== "failed" && t.status !== "cancelled");
}

function suggestCategory(
  counterparty: string | null,
  description: string | null
): { categoryName: string; isTaxDeductible: boolean } | null {
  const text = [counterparty, description].filter(Boolean).join(" ");
  if (!text) return null;

  for (const rule of CATEGORIZATION_RULES) {
    if (rule.pattern.test(text)) {
      return { categoryName: rule.categoryName, isTaxDeductible: rule.isTaxDeductible };
    }
  }
  return null;
}

/**
 * Suggest category from DB history by matching counterparty name.
 * Uses fuzzy matching: exact match first, then substring/contains match.
 */
function suggestCategoryFromDb(
  counterpartyName: string | null,
  bankDescription: string | null,
  dbMappings: Map<string, { categoryId: number; isTaxDeductible: boolean }>
): { categoryId: number; isTaxDeductible: boolean } | null {
  if (!counterpartyName && !bankDescription) return null;

  const candidates = [counterpartyName, bankDescription].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase().trim();

    // 1. Exact match
    const exact = dbMappings.get(normalized);
    if (exact) return exact;

    // 2. Check if any DB counterparty is contained in this name or vice versa
    for (const [dbName, mapping] of dbMappings) {
      if (normalized.includes(dbName) || dbName.includes(normalized)) {
        return mapping;
      }
    }
  }

  return null;
}

/**
 * Finance Router
 *
 * Admin-only procedures for finance dashboard data
 * Uses:
 * - Stripe Live (read-only) for revenue data
 * - Mercury API for bank account data
 * - Local DB for expense tracking & categorization
 */
export const financeRouter = createTRPCRouter({
  // =========================================================================
  // STRIPE / REVENUE (existing)
  // =========================================================================

  /**
   * Get Stripe revenue overview
   * MRR, total revenue, subscription counts
   */
  getStripeOverview: adminProcedure.query(async () => {
    if (!stripeLive) {
      return {
        connected: false,
        mrr: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        recentPayments: [],
      };
    }

    try {
      // Get active subscriptions for MRR
      const subscriptions = await stripeLive.subscriptions.list({
        status: "active",
        limit: 100,
      });

      // Calculate MRR from active subscriptions
      let mrr = 0;
      for (const sub of subscriptions.data) {
        for (const item of sub.items.data) {
          const amount = item.price?.unit_amount ?? 0;
          const interval = item.price?.recurring?.interval;

          // Normalize to monthly
          if (interval === "year") {
            mrr += amount / 12;
          } else if (interval === "month") {
            mrr += amount;
          } else if (interval === "week") {
            mrr += amount * 4.33;
          } else if (interval === "day") {
            mrr += amount * 30;
          }
        }
      }

      // Get successful charges for total revenue
      const charges = await stripeLive.charges.list({
        limit: 100,
      });

      const successfulCharges = charges.data.filter((c) => c.status === "succeeded");
      const totalRevenue = successfulCharges.reduce((sum, c) => sum + c.amount, 0);

      // Recent payments (last 10)
      const recentPayments = successfulCharges.slice(0, 10).map((c) => ({
        id: c.id,
        amount: c.amount,
        currency: c.currency,
        description: c.description,
        created: c.created,
        customer: typeof c.customer === "string" ? c.customer : c.customer?.id,
      }));

      return {
        connected: true,
        mrr: Math.round(mrr),
        activeSubscriptions: subscriptions.data.length,
        totalRevenue,
        recentPayments,
      };
    } catch (error) {
      console.error("Stripe overview error:", error);
      return {
        connected: false,
        mrr: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        recentPayments: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),

  /**
   * Get Stripe subscriptions breakdown
   */
  getSubscriptions: adminProcedure.query(async () => {
    if (!stripeLive) {
      return { connected: false, subscriptions: [] };
    }

    try {
      const subscriptions = await stripeLive.subscriptions.list({
        status: "all",
        limit: 100,
        expand: ["data.customer", "data.items.data.price.product"],
      });

      const formatted = await Promise.all(
        subscriptions.data.map(async (sub) => {
          const customer =
            typeof sub.customer === "string"
              ? null
              : "deleted" in sub.customer
                ? null
                : { id: sub.customer.id, email: sub.customer.email };

          const items = sub.items.data.map((item) => {
            const product = item.price?.product;
            const productName =
              typeof product === "object" && product !== null && "name" in product
                ? (product as { name: string }).name
                : null;

            return {
              priceId: item.price?.id,
              productName,
              amount: item.price?.unit_amount ?? 0,
              currency: item.price?.currency ?? "usd",
              interval: item.price?.recurring?.interval,
            };
          });

          return {
            id: sub.id,
            status: sub.status,
            customer,
            items,
            currentPeriodEnd: sub.items.data[0]?.current_period_end ?? null,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            created: sub.created,
          };
        })
      );

      return { connected: true, subscriptions: formatted };
    } catch (error) {
      console.error("Stripe subscriptions error:", error);
      return {
        connected: false,
        subscriptions: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),

  // =========================================================================
  // MERCURY / BANKING (existing)
  // =========================================================================

  /**
   * Get Mercury bank account balances
   */
  getMercuryBalances: adminProcedure.query(async () => {
    try {
      const data = await getMercuryTotalBalance();

      if (data.accounts.length === 0) {
        return {
          connected: false,
          totalAvailable: 0,
          accounts: [],
        };
      }

      return {
        connected: true,
        totalAvailable: data.available,
        totalCurrent: data.current,
        accounts: data.accounts,
      };
    } catch (error) {
      console.error("Mercury balances error:", error);
      return {
        connected: false,
        totalAvailable: 0,
        accounts: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),

  /**
   * Get Mercury transactions
   */
  getMercuryTransactions: adminProcedure
    .input(
      z.object({
        accountId: z.string().optional(),
        limit: z.number().min(1).max(500).default(50),
        offset: z.number().min(0).default(0),
        start: z.string().optional(), // YYYY-MM-DD
        end: z.string().optional(), // YYYY-MM-DD
      })
    )
    .query(async ({ input }) => {
      try {
        const accounts = await getMercuryAccounts();

        if (accounts.length === 0) {
          return { connected: false, transactions: [], hasMore: false };
        }

        // Use specified account or first account
        const accountId = input.accountId ?? accounts[0]?.id;

        if (!accountId) {
          return { connected: false, transactions: [], hasMore: false };
        }

        // Fetch one extra to determine hasMore
        const rawTransactions = await getMercuryTransactions(
          accountId,
          input.limit + 1,
          input.offset,
          input.start,
          input.end
        );
        const filtered = filterActiveMercuryTransactions(rawTransactions);
        const hasMore = filtered.length > input.limit;
        const transactions = hasMore ? filtered.slice(0, input.limit) : filtered;

        const formatted = transactions.map((t: MercuryTransaction) => ({
          id: t.id,
          amount: t.amount,
          description: t.bankDescription ?? t.counterpartyName ?? "Transaction",
          counterparty: t.counterpartyName,
          status: t.status,
          postedAt: t.postedAt,
          createdAt: t.createdAt,
          kind: t.kind,
        }));

        return { connected: true, transactions: formatted, hasMore };
      } catch (error) {
        console.error("Mercury transactions error:", error);
        return {
          connected: false,
          transactions: [],
          hasMore: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * Get summary totals for Mercury transactions across the full date range
   * (not paginated — fetches all to compute accurate totals)
   */
  getMercuryTransactionSummary: adminProcedure
    .input(
      z.object({
        start: z.string().optional(),
        end: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const accounts = await getMercuryAccounts();
        if (accounts.length === 0) {
          return { totalIncome: 0, totalExpenses: 0, net: 0, count: 0 };
        }

        const accountId = accounts[0]!.id;
        const rawTxs = await getMercuryTransactions(accountId, 500, 0, input.start, input.end);
        const txs = filterActiveMercuryTransactions(rawTxs);

        let totalIncome = 0;
        let totalExpenses = 0;
        for (const tx of txs) {
          if (tx.amount >= 0) {
            totalIncome += tx.amount;
          } else {
            totalExpenses += Math.abs(tx.amount);
          }
        }

        return {
          totalIncome,
          totalExpenses,
          net: totalIncome - totalExpenses,
          count: txs.length,
        };
      } catch {
        return { totalIncome: 0, totalExpenses: 0, net: 0, count: 0 };
      }
    }),

  /**
   * Get combined finance overview for dashboard
   */
  getOverview: adminProcedure.query(async () => {
    // Fetch both in parallel
    const [stripeData, mercuryData] = await Promise.all([
      (async () => {
        if (!stripeLive) return null;

        try {
          const [subscriptions, charges, balance] = await Promise.all([
            stripeLive.subscriptions.list({ status: "active", limit: 100 }),
            stripeLive.charges.list({ limit: 100 }),
            stripeLive.balance.retrieve(),
          ]);

          // Calculate MRR
          let mrr = 0;
          for (const sub of subscriptions.data) {
            for (const item of sub.items.data) {
              const amount = item.price?.unit_amount ?? 0;
              const interval = item.price?.recurring?.interval;
              if (interval === "month") mrr += amount;
              else if (interval === "year") mrr += amount / 12;
            }
          }

          // Total revenue from successful charges
          const successfulCharges = charges.data.filter((c) => c.status === "succeeded");
          const totalRevenue = successfulCharges.reduce((sum, c) => sum + c.amount, 0);

          // This month's revenue
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000;
          const thisMonthRevenue = successfulCharges
            .filter((c) => c.created >= startOfMonth)
            .reduce((sum, c) => sum + c.amount, 0);

          return {
            connected: true,
            mrr: Math.round(mrr),
            totalRevenue,
            thisMonthRevenue,
            activeSubscriptions: subscriptions.data.length,
            stripeBalance: balance.available.reduce((sum, b) => sum + b.amount, 0),
          };
        } catch (error) {
          console.error("Stripe overview error:", error);
          return null;
        }
      })(),
      getMercuryTotalBalance().catch(() => null),
    ]);

    return {
      stripe: stripeData ?? {
        connected: false,
        mrr: 0,
        totalRevenue: 0,
        thisMonthRevenue: 0,
        activeSubscriptions: 0,
        stripeBalance: 0,
      },
      mercury: mercuryData
        ? {
            connected: true,
            totalAvailable: mercuryData.available,
            accounts: mercuryData.accounts,
          }
        : {
            connected: false,
            totalAvailable: 0,
            accounts: [],
          },
    };
  }),

  // =========================================================================
  // EXPENSE CATEGORIES
  // =========================================================================

  getExpenseCategories: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(expenseCategories)
      .where(eq(expenseCategories.isActive, true))
      .orderBy(asc(expenseCategories.sortOrder));
  }),

  seedExpenseCategories: adminProcedure.mutation(async ({ ctx }) => {
    let upserted = 0;
    for (const cat of IRS_CATEGORIES) {
      await ctx.db
        .insert(expenseCategories)
        .values({
          name: cat.name,
          irsCategory: cat.irsCategory,
          sortOrder: cat.sortOrder,
        })
        .onConflictDoUpdate({
          target: expenseCategories.name,
          set: {
            irsCategory: cat.irsCategory,
            sortOrder: cat.sortOrder,
            updatedAt: new Date(),
          },
        });
      upserted++;
    }
    return { upserted };
  }),

  // =========================================================================
  // MANUAL EXPENSES CRUD
  // =========================================================================

  createExpenseCategory: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        irsCategory: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const maxSort = await ctx.db
        .select({ max: sql<number>`coalesce(max(${expenseCategories.sortOrder}), 0)` })
        .from(expenseCategories);
      const nextSort = (maxSort[0]?.max ?? 0) + 1;

      const [category] = await ctx.db
        .insert(expenseCategories)
        .values({
          name: input.name,
          irsCategory: input.irsCategory ?? null,
          description: input.description,
          sortOrder: nextSort,
        })
        .returning();
      return category;
    }),

  createExpense: adminProcedure
    .input(
      z.object({
        categoryId: z.number(),
        amount: z.number().int().positive(), // cents
        vendor: z.string().min(1),
        description: z.string().optional(),
        date: z.string(), // YYYY-MM-DD
        type: z.enum(["expense", "revenue"]).default("expense"),
        isTaxDeductible: z.boolean().default(false),
        receiptUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [expense] = await ctx.db
        .insert(expenses)
        .values({
          categoryId: input.categoryId,
          amount: input.amount,
          vendor: input.vendor,
          description: input.description,
          date: input.date,
          type: input.type,
          isTaxDeductible: input.isTaxDeductible,
          receiptUrl: input.receiptUrl,
          createdByAuthId: ctx.user.id,
        })
        .returning();
      return expense;
    }),

  updateExpense: adminProcedure
    .input(
      z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        amount: z.number().int().positive().optional(),
        vendor: z.string().min(1).optional(),
        description: z.string().optional(),
        date: z.string().optional(),
        isTaxDeductible: z.boolean().optional(),
        receiptUrl: z.string().url().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      const [expense] = await ctx.db
        .update(expenses)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(expenses.id, id))
        .returning();
      return expense;
    }),

  deleteExpense: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(expenses).where(eq(expenses.id, input.id));
      return { success: true };
    }),

  getExpenses: adminProcedure
    .input(
      z.object({
        year: z.number().optional(),
        month: z.number().min(1).max(12).optional(),
        categoryId: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input.year) {
        const startDate = `${input.year}-01-01`;
        const endDate = `${input.year + 1}-01-01`;
        conditions.push(gte(expenses.date, startDate));
        conditions.push(lt(expenses.date, endDate));
      }

      if (input.month && input.year) {
        const startDate = `${input.year}-${String(input.month).padStart(2, "0")}-01`;
        const endMonth = input.month === 12 ? 1 : input.month + 1;
        const endYear = input.month === 12 ? input.year + 1 : input.year;
        const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;
        // Override the year conditions with more specific month conditions
        conditions.length = 0;
        conditions.push(gte(expenses.date, startDate));
        conditions.push(lt(expenses.date, endDate));
      }

      if (input.categoryId) {
        conditions.push(eq(expenses.categoryId, input.categoryId));
      }

      if (input.search) {
        conditions.push(
          sql`(${expenses.vendor} ILIKE ${"%" + input.search + "%"} OR ${expenses.description} ILIKE ${"%" + input.search + "%"})`
        );
      }

      const rows = await ctx.db
        .select({
          id: expenses.id,
          categoryId: expenses.categoryId,
          categoryName: expenseCategories.name,
          amount: expenses.amount,
          vendor: expenses.vendor,
          description: expenses.description,
          date: expenses.date,
          type: expenses.type,
          isTaxDeductible: expenses.isTaxDeductible,
          receiptUrl: expenses.receiptUrl,
          createdAt: expenses.createdAt,
        })
        .from(expenses)
        .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(expenses.date));

      return rows;
    }),

  // =========================================================================
  // MERCURY TRANSACTION CATEGORIZATION
  // =========================================================================

  categorizeMercuryTransaction: adminProcedure
    .input(
      z.object({
        mercuryTransactionId: z.string(),
        categoryId: z.number(),
        isTaxDeductible: z.boolean().default(false),
        counterpartyName: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(mercuryTransactionCategories)
        .values({
          mercuryTransactionId: input.mercuryTransactionId,
          categoryId: input.categoryId,
          isTaxDeductible: input.isTaxDeductible,
          counterpartyName: input.counterpartyName,
          notes: input.notes,
        })
        .onConflictDoUpdate({
          target: mercuryTransactionCategories.mercuryTransactionId,
          set: {
            categoryId: input.categoryId,
            isTaxDeductible: input.isTaxDeductible,
            counterpartyName: input.counterpartyName,
            notes: input.notes,
            updatedAt: new Date(),
          },
        })
        .returning();
      return result;
    }),

  getMercuryTransactionCategories: adminProcedure
    .input(z.object({ transactionIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      if (input.transactionIds.length === 0) return [];

      return ctx.db
        .select({
          id: mercuryTransactionCategories.id,
          mercuryTransactionId: mercuryTransactionCategories.mercuryTransactionId,
          categoryId: mercuryTransactionCategories.categoryId,
          categoryName: expenseCategories.name,
          isTaxDeductible: mercuryTransactionCategories.isTaxDeductible,
          notes: mercuryTransactionCategories.notes,
        })
        .from(mercuryTransactionCategories)
        .leftJoin(
          expenseCategories,
          eq(mercuryTransactionCategories.categoryId, expenseCategories.id)
        )
        .where(
          inArray(
            mercuryTransactionCategories.mercuryTransactionId,
            input.transactionIds
          )
        );
    }),

  /**
   * Auto-categorize uncategorized Mercury transactions using smart pattern matching.
   * Returns suggestions for review, or applies them directly if confirmed.
   */
  autoCategorizeMercuryTransactions: adminProcedure
    .input(
      z.object({
        accountId: z.string().optional(),
        apply: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const accounts = await getMercuryAccounts();
      if (accounts.length === 0) {
        return { suggestions: [], applied: 0, skipped: 0 };
      }

      const accountId = input.accountId ?? accounts[0]!.id;
      const rawTxs = await getMercuryTransactions(accountId, 500);
      const txs = filterActiveMercuryTransactions(rawTxs);
      const outflows = txs.filter((t) => t.amount < 0);

      // Get existing categorizations
      const txIds = outflows.map((t) => t.id);
      const existing =
        txIds.length > 0
          ? await ctx.db
              .select({
                mercuryTransactionId:
                  mercuryTransactionCategories.mercuryTransactionId,
                counterpartyName: mercuryTransactionCategories.counterpartyName,
              })
              .from(mercuryTransactionCategories)
              .where(
                inArray(
                  mercuryTransactionCategories.mercuryTransactionId,
                  txIds
                )
              )
          : [];
      const alreadyCategorized = new Set(
        existing.map((e: { mercuryTransactionId: string }) => e.mercuryTransactionId)
      );

      // Backfill missing counterparty names on existing categorizations
      const txCounterpartyMap = new Map(
        outflows
          .filter((t) => t.counterpartyName)
          .map((t) => [t.id, t.counterpartyName!])
      );
      for (const ex of existing) {
        if (!ex.counterpartyName) {
          const cp = txCounterpartyMap.get(ex.mercuryTransactionId);
          if (cp) {
            await ctx.db
              .update(mercuryTransactionCategories)
              .set({ counterpartyName: cp, updatedAt: new Date() })
              .where(
                eq(
                  mercuryTransactionCategories.mercuryTransactionId,
                  ex.mercuryTransactionId
                )
              );
          }
        }
      }

      // Get category name → id mapping
      const allCategories = await ctx.db
        .select({ id: expenseCategories.id, name: expenseCategories.name })
        .from(expenseCategories)
        .where(eq(expenseCategories.isActive, true));
      const catNameToId = new Map<string, number>(allCategories.map((c: { name: string; id: number }) => [c.name, c.id]));
      const catIdToName = new Map<number, string>(allCategories.map((c: { name: string; id: number }) => [c.id, c.name]));

      // Batch-load DB counterparty → category mappings (learned from past categorizations)
      const dbMappingRows = await ctx.db
        .select({
          counterpartyName: mercuryTransactionCategories.counterpartyName,
          categoryId: mercuryTransactionCategories.categoryId,
          isTaxDeductible: mercuryTransactionCategories.isTaxDeductible,
        })
        .from(mercuryTransactionCategories)
        .where(sql`${mercuryTransactionCategories.counterpartyName} IS NOT NULL`);

      const dbMappings = new Map<string, { categoryId: number; isTaxDeductible: boolean }>();
      for (const row of dbMappingRows) {
        if (row.counterpartyName) {
          const key = row.counterpartyName.toLowerCase().trim();
          // Keep the most recent mapping (last wins since we iterate in order)
          dbMappings.set(key, { categoryId: row.categoryId, isTaxDeductible: row.isTaxDeductible });
        }
      }

      const suggestions: Array<{
        transactionId: string;
        counterparty: string | null;
        description: string | null;
        amount: number;
        suggestedCategory: string;
        isTaxDeductible: boolean;
        date: string | null;
        source: "db" | "rules";
      }> = [];

      let applied = 0;
      let skipped = 0;

      for (const tx of outflows) {
        if (alreadyCategorized.has(tx.id)) {
          skipped++;
          continue;
        }

        // 1. Check DB history first (learned from past user categorizations)
        const dbSuggestion = suggestCategoryFromDb(tx.counterpartyName, tx.bankDescription, dbMappings);
        if (dbSuggestion) {
          const categoryName = catIdToName.get(dbSuggestion.categoryId);
          if (categoryName) {
            suggestions.push({
              transactionId: tx.id,
              counterparty: tx.counterpartyName,
              description: tx.bankDescription,
              amount: tx.amount,
              suggestedCategory: categoryName,
              isTaxDeductible: dbSuggestion.isTaxDeductible,
              date: tx.postedAt ?? tx.createdAt,
              source: "db",
            });

            if (input.apply) {
              await ctx.db
                .insert(mercuryTransactionCategories)
                .values({
                  mercuryTransactionId: tx.id,
                  categoryId: dbSuggestion.categoryId,
                  isTaxDeductible: dbSuggestion.isTaxDeductible,
                  counterpartyName: tx.counterpartyName,
                  notes: `Auto-categorized (learned): ${tx.counterpartyName ?? "unknown"}`,
                })
                .onConflictDoNothing();
              applied++;
            }
            continue;
          }
        }

        // 2. Fall back to regex rules
        const suggestion = suggestCategory(
          tx.counterpartyName,
          tx.bankDescription
        );
        if (!suggestion) continue;

        const categoryId = catNameToId.get(suggestion.categoryName);
        if (!categoryId) continue;

        suggestions.push({
          transactionId: tx.id,
          counterparty: tx.counterpartyName,
          description: tx.bankDescription,
          amount: tx.amount,
          suggestedCategory: suggestion.categoryName,
          isTaxDeductible: suggestion.isTaxDeductible,
          date: tx.postedAt ?? tx.createdAt,
          source: "rules",
        });

        if (input.apply) {
          await ctx.db
            .insert(mercuryTransactionCategories)
            .values({
              mercuryTransactionId: tx.id,
              categoryId,
              isTaxDeductible: suggestion.isTaxDeductible,
              counterpartyName: tx.counterpartyName,
              notes: `Auto-categorized: ${tx.counterpartyName ?? tx.bankDescription ?? "unknown"}`,
            })
            .onConflictDoNothing();
          applied++;
        }
      }

      return { suggestions, applied, skipped };
    }),

  // =========================================================================
  // YEARLY REVIEW / P&L
  // =========================================================================

  getYearlyRevenue: adminProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ input }) => {
      if (!stripeLive) {
        return { connected: false, months: [], total: 0 };
      }

      try {
        const startTs = Math.floor(new Date(input.year, 0, 1).getTime() / 1000);
        const endTs = Math.floor(new Date(input.year + 1, 0, 1).getTime() / 1000);

        // Fetch all charges for the year (paginate if needed)
        let allCharges: Array<{ amount: number; created: number }> = [];
        let hasMore = true;
        let startingAfter: string | undefined;

        while (hasMore) {
          const params: Record<string, unknown> = {
            limit: 100,
            created: { gte: startTs, lt: endTs },
          };
          if (startingAfter) params.starting_after = startingAfter;

          const charges = await stripeLive.charges.list(
            params as Parameters<typeof stripeLive.charges.list>[0]
          );

          const successful = charges.data
            .filter((c) => c.status === "succeeded")
            .map((c) => ({ amount: c.amount, created: c.created }));

          allCharges = [...allCharges, ...successful];
          hasMore = charges.has_more;
          if (charges.data.length > 0) {
            startingAfter = charges.data[charges.data.length - 1]!.id;
          }
        }

        // Group by month
        const months = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          revenue: 0,
        }));

        for (const charge of allCharges) {
          const d = new Date(charge.created * 1000);
          const monthIdx = d.getMonth();
          months[monthIdx]!.revenue += charge.amount;
        }

        const total = allCharges.reduce((sum, c) => sum + c.amount, 0);

        return { connected: true, months, total };
      } catch (error) {
        console.error("Yearly revenue error:", error);
        return { connected: false, months: [], total: 0 };
      }
    }),

  getYearlyExpenses: adminProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      // Manual expenses from DB
      const startDate = `${input.year}-01-01`;
      const endDate = `${input.year + 1}-01-01`;

      const manualExpenses = await ctx.db
        .select({
          amount: expenses.amount,
          date: expenses.date,
          categoryId: expenses.categoryId,
          categoryName: expenseCategories.name,
        })
        .from(expenses)
        .leftJoin(expenseCategories, eq(expenses.categoryId, expenseCategories.id))
        .where(and(gte(expenses.date, startDate), lt(expenses.date, endDate)));

      // Group manual by month and category
      const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        expenses: 0,
      }));

      const categoryTotals: Record<string, { name: string; total: number }> = {};

      for (const exp of manualExpenses) {
        const d = new Date(exp.date);
        const monthIdx = d.getMonth();
        months[monthIdx]!.expenses += exp.amount;

        const catName = exp.categoryName ?? "Uncategorized";
        if (!categoryTotals[catName]) {
          categoryTotals[catName] = { name: catName, total: 0 };
        }
        categoryTotals[catName].total += exp.amount;
      }

      // Mercury transactions (negative = outflow = expense)
      try {
        const accounts = await getMercuryAccounts();
        if (accounts.length > 0) {
          const accountId = accounts[0]!.id;
          const rawTxs = await getMercuryTransactions(
            accountId,
            500,
            0,
            startDate,
            endDate
          );
          const txs = filterActiveMercuryTransactions(rawTxs);

          // Get categorizations for Mercury transactions
          const txIds = txs.map((t) => t.id);
          const categorizations =
            txIds.length > 0
              ? await ctx.db
                  .select({
                    mercuryTransactionId:
                      mercuryTransactionCategories.mercuryTransactionId,
                    categoryName: expenseCategories.name,
                  })
                  .from(mercuryTransactionCategories)
                  .leftJoin(
                    expenseCategories,
                    eq(
                      mercuryTransactionCategories.categoryId,
                      expenseCategories.id
                    )
                  )
                  .where(
                    inArray(
                      mercuryTransactionCategories.mercuryTransactionId,
                      txIds
                    )
                  )
              : [];

          const catMap = new Map<string, string | null>(
            categorizations.map((c: { mercuryTransactionId: string; categoryName: string | null }) => [c.mercuryTransactionId, c.categoryName])
          );

          for (const tx of txs) {
            if (tx.amount >= 0) continue; // skip inflows
            // Only count officially categorized Mercury transactions
            const catName = catMap.get(tx.id);
            if (!catName) continue;

            const amountCents = Math.round(Math.abs(tx.amount) * 100);
            const posted = tx.postedAt ?? tx.createdAt;
            if (!posted) continue;
            const d = new Date(posted);
            const monthIdx = d.getMonth();
            months[monthIdx]!.expenses += amountCents;

            if (!categoryTotals[catName]) {
              categoryTotals[catName] = { name: catName, total: 0 };
            }
            categoryTotals[catName]!.total += amountCents;
          }
        }
      } catch {
        // Mercury not connected, skip
      }

      const total = months.reduce((sum, m) => sum + m.expenses, 0);
      const byCategory = Object.values(categoryTotals).sort(
        (a, b) => b.total - a.total
      );

      return { months, total, byCategory };
    }),

  getYearlyProfitLoss: adminProcedure
    .input(
      z.object({
        year: z.number(),
        comparisonYear: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Use the caller-accessible procedures via direct logic
      // (can't call self, so we duplicate the fetch logic inline)

      // --- Revenue ---
      let revenueMonths = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        revenue: 0,
      }));
      let totalRevenue = 0;

      if (stripeLive) {
        try {
          const startTs = Math.floor(
            new Date(input.year, 0, 1).getTime() / 1000
          );
          const endTs = Math.floor(
            new Date(input.year + 1, 0, 1).getTime() / 1000
          );

          let allCharges: Array<{ amount: number; created: number }> = [];
          let hasMore = true;
          let startingAfter: string | undefined;

          while (hasMore) {
            const params: Record<string, unknown> = {
              limit: 100,
              created: { gte: startTs, lt: endTs },
            };
            if (startingAfter) params.starting_after = startingAfter;

            const charges = await stripeLive.charges.list(
              params as Parameters<typeof stripeLive.charges.list>[0]
            );

            const successful = charges.data
              .filter((c) => c.status === "succeeded")
              .map((c) => ({ amount: c.amount, created: c.created }));

            allCharges = [...allCharges, ...successful];
            hasMore = charges.has_more;
            if (charges.data.length > 0) {
              startingAfter = charges.data[charges.data.length - 1]!.id;
            }
          }

          for (const charge of allCharges) {
            const d = new Date(charge.created * 1000);
            revenueMonths[d.getMonth()]!.revenue += charge.amount;
          }

          totalRevenue = allCharges.reduce((sum, c) => sum + c.amount, 0);
        } catch {
          // Stripe not available
        }
      }

      // --- Expenses ---
      const startDate = `${input.year}-01-01`;
      const endDate = `${input.year + 1}-01-01`;

      const manualExpenses = await ctx.db
        .select({ amount: expenses.amount, date: expenses.date })
        .from(expenses)
        .where(and(gte(expenses.date, startDate), lt(expenses.date, endDate)));

      const expenseMonths = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        expenses: 0,
      }));

      for (const exp of manualExpenses) {
        const d = new Date(exp.date);
        expenseMonths[d.getMonth()]!.expenses += exp.amount;
      }

      // Mercury expenses — only categorized transactions count as official expenses
      try {
        const accounts = await getMercuryAccounts();
        if (accounts.length > 0) {
          const rawTxs = await getMercuryTransactions(
            accounts[0]!.id,
            500,
            0,
            startDate,
            endDate
          );
          const txs = filterActiveMercuryTransactions(rawTxs);

          // Only include categorized Mercury transactions
          const txIds = txs.filter((t) => t.amount < 0).map((t) => t.id);
          const categorized =
            txIds.length > 0
              ? await ctx.db
                  .select({
                    mercuryTransactionId:
                      mercuryTransactionCategories.mercuryTransactionId,
                  })
                  .from(mercuryTransactionCategories)
                  .where(
                    inArray(
                      mercuryTransactionCategories.mercuryTransactionId,
                      txIds
                    )
                  )
              : [];
          const categorizedIds = new Set(
            categorized.map((c: { mercuryTransactionId: string }) => c.mercuryTransactionId)
          );

          for (const tx of txs) {
            if (tx.amount >= 0) continue;
            if (!categorizedIds.has(tx.id)) continue;
            const posted = tx.postedAt ?? tx.createdAt;
            if (!posted) continue;
            const d = new Date(posted);
            const amountCents = Math.round(Math.abs(tx.amount) * 100);
            expenseMonths[d.getMonth()]!.expenses += amountCents;
          }
        }
      } catch {
        // Mercury not connected
      }

      const totalExpenses = expenseMonths.reduce(
        (sum, m) => sum + m.expenses,
        0
      );

      // --- Deductions (manual + Mercury) ---
      const deductibleExpenses = await ctx.db
        .select({ amount: expenses.amount })
        .from(expenses)
        .where(
          and(
            gte(expenses.date, startDate),
            lt(expenses.date, endDate),
            eq(expenses.isTaxDeductible, true)
          )
        );

      let totalDeductions = deductibleExpenses.reduce(
        (sum: number, e: { amount: number }) => sum + e.amount,
        0
      );

      // Add Mercury deductible amounts — any categorized into an IRS category
      try {
        const deductibleMercuryCats = await ctx.db
          .select({
            mercuryTransactionId: mercuryTransactionCategories.mercuryTransactionId,
          })
          .from(mercuryTransactionCategories)
          .innerJoin(
            expenseCategories,
            eq(mercuryTransactionCategories.categoryId, expenseCategories.id)
          )
          .where(isNotNull(expenseCategories.irsCategory));

        if (deductibleMercuryCats.length > 0) {
          const mercAccounts = await getMercuryAccounts();
          if (mercAccounts.length > 0) {
            const deductibleRawTxs = await getMercuryTransactions(mercAccounts[0]!.id, 500, 0, startDate, endDate);
            const deductibleTxs = filterActiveMercuryTransactions(deductibleRawTxs);
            const deductibleIds = new Set(deductibleMercuryCats.map((c: { mercuryTransactionId: string }) => c.mercuryTransactionId));
            for (const tx of deductibleTxs) {
              if (tx.amount >= 0) continue;
              if (!deductibleIds.has(tx.id)) continue;
              totalDeductions += Math.round(Math.abs(tx.amount) * 100);
            }
          }
        }
      } catch {
        // Mercury not connected
      }

      // Combine into monthly P&L
      const months = Array.from({ length: 12 }, (_, i) => {
        const rev = revenueMonths[i]!.revenue;
        const exp = expenseMonths[i]!.expenses;
        const net = rev - exp;
        return {
          month: i + 1,
          revenue: rev,
          expenses: exp,
          net,
          margin: rev > 0 ? Math.round((net / rev) * 100) : 0,
        };
      });

      // --- Comparison year (optional) ---
      let comparison: {
        revenue: number;
        expenses: number;
        profit: number;
      } | null = null;

      if (input.comparisonYear) {
        let compRevenue = 0;
        let compExpenses = 0;

        if (stripeLive) {
          try {
            const cStartTs = Math.floor(
              new Date(input.comparisonYear, 0, 1).getTime() / 1000
            );
            const cEndTs = Math.floor(
              new Date(input.comparisonYear + 1, 0, 1).getTime() / 1000
            );

            const charges = await stripeLive.charges.list({
              limit: 100,
              created: { gte: cStartTs, lt: cEndTs },
            } as Parameters<typeof stripeLive.charges.list>[0]);

            compRevenue = charges.data
              .filter((c) => c.status === "succeeded")
              .reduce((sum, c) => sum + c.amount, 0);
          } catch {
            // skip
          }
        }

        const cStartDate = `${input.comparisonYear}-01-01`;
        const cEndDate = `${input.comparisonYear + 1}-01-01`;

        const cExpenses = await ctx.db
          .select({ amount: expenses.amount })
          .from(expenses)
          .where(
            and(gte(expenses.date, cStartDate), lt(expenses.date, cEndDate))
          );

        compExpenses = cExpenses.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0);

        comparison = {
          revenue: compRevenue,
          expenses: compExpenses,
          profit: compRevenue - compExpenses,
        };
      }

      return {
        months,
        totalRevenue,
        totalExpenses,
        totalDeductions,
        netProfit: totalRevenue - totalExpenses,
        comparison,
      };
    }),

  // =========================================================================
  // TAX & DEDUCTIONS
  // =========================================================================

  getTaxSummary: adminProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      const startDate = `${input.year}-01-01`;
      const endDate = `${input.year + 1}-01-01`;

      // Gross income from Stripe
      let grossIncome = 0;
      if (stripeLive) {
        try {
          const startTs = Math.floor(
            new Date(input.year, 0, 1).getTime() / 1000
          );
          const endTs = Math.floor(
            new Date(input.year + 1, 0, 1).getTime() / 1000
          );

          let hasMore = true;
          let startingAfter: string | undefined;

          while (hasMore) {
            const params: Record<string, unknown> = {
              limit: 100,
              created: { gte: startTs, lt: endTs },
            };
            if (startingAfter) params.starting_after = startingAfter;

            const charges = await stripeLive.charges.list(
              params as Parameters<typeof stripeLive.charges.list>[0]
            );

            grossIncome += charges.data
              .filter((c) => c.status === "succeeded")
              .reduce((sum, c) => sum + c.amount, 0);

            hasMore = charges.has_more;
            if (charges.data.length > 0) {
              startingAfter = charges.data[charges.data.length - 1]!.id;
            }
          }
        } catch {
          // Stripe not available
        }
      }

      // Deductible expenses by IRS category (manual)
      const deductibleByCategory = await ctx.db
        .select({
          categoryName: expenseCategories.name,
          irsCategory: expenseCategories.irsCategory,
          count: sql<number>`count(*)::int`,
          total: sql<number>`sum(${expenses.amount})::int`,
        })
        .from(expenses)
        .leftJoin(
          expenseCategories,
          eq(expenses.categoryId, expenseCategories.id)
        )
        .where(
          and(
            gte(expenses.date, startDate),
            lt(expenses.date, endDate),
            eq(expenses.isTaxDeductible, true)
          )
        )
        .groupBy(expenseCategories.name, expenseCategories.irsCategory);

      // Deductible Mercury transactions — any categorized into an IRS category is deductible
      const deductibleMercuryCats = await ctx.db
        .select({
          mercuryTransactionId: mercuryTransactionCategories.mercuryTransactionId,
          categoryName: expenseCategories.name,
          irsCategory: expenseCategories.irsCategory,
        })
        .from(mercuryTransactionCategories)
        .innerJoin(
          expenseCategories,
          eq(
            mercuryTransactionCategories.categoryId,
            expenseCategories.id
          )
        )
        .where(isNotNull(expenseCategories.irsCategory));

      // Fetch Mercury transactions for this year to get actual dollar amounts
      let mercuryDeductionTotal = 0;
      const mercuryDeductionsByCategory: Record<string, { name: string; irsCategory: string | null; count: number; total: number }> = {};

      try {
        const accounts = await getMercuryAccounts();
        if (accounts.length > 0 && deductibleMercuryCats.length > 0) {
          const rawTxs = await getMercuryTransactions(accounts[0]!.id, 500, 0, startDate, endDate);
          const txs = filterActiveMercuryTransactions(rawTxs);
          const txAmountMap = new Map(txs.map((t) => [t.id, t.amount]));

          for (const cat of deductibleMercuryCats) {
            const txAmount = txAmountMap.get(cat.mercuryTransactionId);
            if (txAmount === undefined || txAmount >= 0) continue;
            const amountCents = Math.round(Math.abs(txAmount) * 100);
            mercuryDeductionTotal += amountCents;

            const catName = cat.categoryName ?? "Uncategorized";
            if (!mercuryDeductionsByCategory[catName]) {
              mercuryDeductionsByCategory[catName] = { name: catName, irsCategory: cat.irsCategory, count: 0, total: 0 };
            }
            mercuryDeductionsByCategory[catName].count++;
            mercuryDeductionsByCategory[catName].total += amountCents;
          }
        }
      } catch {
        // Mercury not connected
      }

      // Merge manual + Mercury deductions by category
      const mergedDeductions = [...deductibleByCategory];
      for (const mercCat of Object.values(mercuryDeductionsByCategory)) {
        const existing = mergedDeductions.find((d) => d.categoryName === mercCat.name);
        if (existing) {
          existing.count += mercCat.count;
          existing.total = (existing.total ?? 0) + mercCat.total;
        } else {
          mergedDeductions.push({
            categoryName: mercCat.name,
            irsCategory: mercCat.irsCategory,
            count: mercCat.count,
            total: mercCat.total,
          });
        }
      }

      const totalDeductions = mergedDeductions.reduce(
        (sum: number, c: { total: number | null }) => sum + (c.total ?? 0),
        0
      );

      return {
        grossIncome,
        totalDeductions,
        estimatedTaxableIncome: grossIncome - totalDeductions,
        deductibleByCategory: mergedDeductions,
        deductibleMercuryCount: Object.values(mercuryDeductionsByCategory).reduce(
          (sum, c) => sum + c.count,
          0
        ),
      };
    }),

  exportTaxData: adminProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
      const startDate = `${input.year}-01-01`;
      const endDate = `${input.year + 1}-01-01`;

      // All deductible manual expenses
      const manualDeductible = await ctx.db
        .select({
          date: expenses.date,
          vendor: expenses.vendor,
          categoryName: expenseCategories.name,
          amount: expenses.amount,
          description: expenses.description,
        })
        .from(expenses)
        .leftJoin(
          expenseCategories,
          eq(expenses.categoryId, expenseCategories.id)
        )
        .where(
          and(
            gte(expenses.date, startDate),
            lt(expenses.date, endDate),
            eq(expenses.isTaxDeductible, true)
          )
        )
        .orderBy(asc(expenses.date));

      // All deductible Mercury transaction categorizations — IRS category = deductible
      const mercuryCats = await ctx.db
        .select({
          mercuryTransactionId:
            mercuryTransactionCategories.mercuryTransactionId,
          categoryName: expenseCategories.name,
          notes: mercuryTransactionCategories.notes,
        })
        .from(mercuryTransactionCategories)
        .innerJoin(
          expenseCategories,
          eq(
            mercuryTransactionCategories.categoryId,
            expenseCategories.id
          )
        )
        .where(isNotNull(expenseCategories.irsCategory));

      // Build export rows
      interface TaxExportRow {
        date: string;
        vendor: string;
        category: string;
        amount: number;
        description: string;
        source: "Manual" | "Mercury";
        deductible: boolean;
      }

      const rows: TaxExportRow[] = manualDeductible.map((e: { date: string; vendor: string; categoryName: string | null; amount: number; description: string | null }) => ({
        date: e.date,
        vendor: e.vendor,
        category: e.categoryName ?? "Uncategorized",
        amount: e.amount, // cents
        description: e.description ?? "",
        source: "Manual" as const,
        deductible: true,
      }));

      // Get Mercury tx details for categorized transactions
      try {
        const accounts = await getMercuryAccounts();
        if (accounts.length > 0 && mercuryCats.length > 0) {
          const rawTxs = await getMercuryTransactions(accounts[0]!.id, 500);
          const txs = filterActiveMercuryTransactions(rawTxs);
          const catMap = new Map<string, { categoryName: string | null; notes: string | null }>(
            mercuryCats.map((c: { mercuryTransactionId: string; categoryName: string | null; notes: string | null }) => [
              c.mercuryTransactionId,
              { categoryName: c.categoryName, notes: c.notes },
            ])
          );

          for (const tx of txs) {
            const cat = catMap.get(tx.id);
            if (!cat) continue;
            if (tx.amount >= 0) continue;
            const posted = tx.postedAt ?? tx.createdAt;
            if (!posted) continue;
            const d = new Date(posted);
            if (d.getFullYear() !== input.year) continue;

            rows.push({
              date: d.toISOString().split("T")[0]!,
              vendor: tx.counterpartyName ?? tx.bankDescription ?? "Mercury",
              category: cat.categoryName ?? "Uncategorized",
              amount: Math.round(Math.abs(tx.amount) * 100),
              description: cat.notes ?? "",
              source: "Mercury" as const,
              deductible: true,
            });
          }
        }
      } catch {
        // Mercury not connected
      }

      // Sort by date
      rows.sort((a, b) => a.date.localeCompare(b.date));

      return { rows, year: input.year };
    }),
});
