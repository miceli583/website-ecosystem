import Stripe from "stripe";
import { env } from "~/env";

/**
 * Stripe client for LIVE read-only access
 * Used exclusively for admin finance dashboard queries
 *
 * This uses a restricted API key with read-only permissions:
 * - customers.read
 * - subscriptions.read
 * - invoices.read
 * - charges.read
 * - products.read
 * - prices.read
 * - balance.read
 */
export const stripeLive = env.STRIPE_LIVE_READ_KEY
  ? new Stripe(env.STRIPE_LIVE_READ_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    })
  : null;
