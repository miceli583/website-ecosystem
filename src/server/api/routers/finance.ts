import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";
import { stripeLive } from "~/lib/stripe-live";
import {
  getMercuryAccounts,
  getMercuryTotalBalance,
  getMercuryTransactions,
  type MercuryTransaction,
} from "~/lib/mercury";

/**
 * Finance Router
 *
 * Admin-only procedures for finance dashboard data
 * Uses:
 * - Stripe Live (read-only) for revenue data
 * - Mercury API for bank account data
 */
export const financeRouter = createTRPCRouter({
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
      })
    )
    .query(async ({ input }) => {
      try {
        const accounts = await getMercuryAccounts();

        if (accounts.length === 0) {
          return { connected: false, transactions: [] };
        }

        // Use specified account or first account
        const accountId = input.accountId ?? accounts[0]?.id;

        if (!accountId) {
          return { connected: false, transactions: [] };
        }

        const transactions = await getMercuryTransactions(accountId, input.limit);

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

        return { connected: true, transactions: formatted };
      } catch (error) {
        console.error("Mercury transactions error:", error);
        return {
          connected: false,
          transactions: [],
          error: error instanceof Error ? error.message : "Unknown error",
        };
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
});
