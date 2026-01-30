import { unstable_cache } from "next/cache";
import { stripe } from "./stripe";

/**
 * Cached Stripe API helpers
 * Uses Next.js unstable_cache with short TTL to reduce API calls
 */

// Cache active subscriptions for a customer (5 minute TTL)
export const getCachedActiveSubscriptions = unstable_cache(
  async (customerId: string) => {
    if (!stripe) return { activeProductIds: [] as string[] };

    const [active, trialing] = await Promise.all([
      stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 100,
      }),
      stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 100,
      }),
    ]);

    const activeProductIds = new Set<string>();
    for (const sub of [...active.data, ...trialing.data]) {
      if (sub.cancel_at_period_end) continue;
      for (const item of sub.items.data) {
        const productId =
          typeof item.price.product === "string"
            ? item.price.product
            : item.price.product?.id;
        if (productId) activeProductIds.add(productId);
      }
    }

    return { activeProductIds: Array.from(activeProductIds) };
  },
  ["stripe-active-subscriptions"],
  { revalidate: 300, tags: ["stripe"] } // 5 minute cache
);

// Cache billing info (invoices, subscriptions, balance) - 2 minute TTL
export const getCachedBillingInfo = unstable_cache(
  async (customerId: string) => {
    if (!stripe) {
      return {
        invoices: [],
        subscriptions: [],
        balance: null,
        productNames: {} as Record<string, string>,
      };
    }

    // Fetch invoices, subscriptions, and customer in parallel
    const [invoices, subscriptions, customer] = await Promise.all([
      stripe.invoices.list({
        customer: customerId,
        limit: 20,
      }),
      stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 10,
      }),
      stripe.customers.retrieve(customerId),
    ]);

    const balance = "balance" in customer ? customer.balance : null;

    // Collect unique product IDs
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

    // Fetch all products in parallel
    const productNames: Record<string, string> = {};
    if (productIds.size > 0) {
      const products = await Promise.all(
        Array.from(productIds).map((id) => stripe!.products.retrieve(id))
      );
      for (const product of products) {
        if (!("deleted" in product)) {
          productNames[product.id] = product.name;
        }
      }
    }

    return {
      invoices: invoices.data.map((inv) => {
        const lineItemDescriptions = inv.lines?.data
          ?.map((line) => line.description)
          .filter(Boolean)
          .slice(0, 3);

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
          description:
            inv.description ??
            (lineItemDescriptions?.length
              ? lineItemDescriptions.join(", ")
              : null),
        };
      }),
      subscriptions: subscriptions.data.map((sub) => ({
        id: sub.id,
        status: sub.status,
        startDate: sub.start_date,
        billingCycleAnchor: sub.billing_cycle_anchor,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        canceledAt: sub.canceled_at,
        trialEnd: sub.trial_end,
        items: sub.items.data.map((item) => {
          const productId =
            typeof item.price.product === "string"
              ? item.price.product
              : item.price.product?.id;

          return {
            id: item.id,
            priceId: item.price.id,
            productId,
            productName: productId ? productNames[productId] : null,
            unitAmount: item.price.unit_amount,
            currency: item.price.currency,
            interval: item.price.recurring?.interval,
            intervalCount: item.price.recurring?.interval_count,
            nickname: item.price.nickname,
          };
        }),
      })),
      balance,
      productNames,
    };
  },
  ["stripe-billing-info"],
  { revalidate: 120, tags: ["stripe"] } // 2 minute cache
);
