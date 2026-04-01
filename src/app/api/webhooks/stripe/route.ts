import { NextRequest, NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import {
  customers,
  clientResources,
  proposalCheckouts,
  expenses,
  expenseCategories,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import type Stripe from "stripe";
import { sendEmail } from "~/lib/email";
import { ProposalReceiptEmail } from "~/components/emails/proposal-receipt";
import { recalculateProposalStatus } from "~/server/api/routers/proposals";

export async function POST(request: NextRequest) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(
      "[Stripe Webhook] Signature verification failed:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.created": {
      const customer = event.data.object as Stripe.Customer;
      const existing = await db
        .select()
        .from(customers)
        .where(eq(customers.stripeCustomerId, customer.id))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(customers).values({
          stripeCustomerId: customer.id,
          email: customer.email ?? "",
        });
      }
      break;
    }

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Handle customer creation
      if (session.customer && session.customer_email) {
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer.id;

        const existing = await db
          .select()
          .from(customers)
          .where(eq(customers.stripeCustomerId, customerId))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(customers).values({
            stripeCustomerId: customerId,
            email: session.customer_email,
          });
        }
      }

      // Handle proposal payment
      const proposalId = session.metadata?.proposalId;
      if (proposalId) {
        const isV2 = session.metadata?.version === "2";

        // --- V2 PROPOSAL CHECKOUT ---
        if (isV2) {
          // Find and update the proposalCheckouts row by stripeSessionId
          const [checkoutRow] = await db
            .select()
            .from(proposalCheckouts)
            .where(eq(proposalCheckouts.stripeSessionId, session.id))
            .limit(1);

          if (checkoutRow) {
            // Get Stripe fee from the charge's balance transaction
            let stripeFeeAmount: number | null = null;
            const paymentIntentId =
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id;

            if (paymentIntentId && stripe) {
              try {
                const pi =
                  await stripe.paymentIntents.retrieve(paymentIntentId);
                const chargeId =
                  typeof pi.latest_charge === "string"
                    ? pi.latest_charge
                    : pi.latest_charge?.id;
                if (chargeId) {
                  const charge = await stripe.charges.retrieve(chargeId, {
                    expand: ["balance_transaction"],
                  });
                  const bt = charge.balance_transaction;
                  if (bt && typeof bt !== "string") {
                    stripeFeeAmount = bt.fee;
                  }
                }
              } catch {
                // Fee tracking is best-effort
              }
            }

            await db
              .update(proposalCheckouts)
              .set({
                status: "paid",
                paidAt: new Date(),
                stripePaymentIntentId: paymentIntentId ?? null,
                stripeSubscriptionId:
                  typeof session.subscription === "string"
                    ? session.subscription
                    : (session.subscription?.id ?? null),
                stripeFeeAmount,
                updatedAt: new Date(),
              })
              .where(eq(proposalCheckouts.id, checkoutRow.id));

            // Log Stripe fee as an expense in the finance system
            if (stripeFeeAmount && stripeFeeAmount > 0) {
              try {
                const feeCategory = await db.query.expenseCategories.findFirst({
                  where: eq(expenseCategories.name, "Commissions & Fees"),
                });
                if (feeCategory) {
                  await db.insert(expenses).values({
                    categoryId: feeCategory.id,
                    amount: stripeFeeAmount, // already in cents
                    vendor: "Stripe",
                    description: `Processing fee — proposal checkout #${checkoutRow.id}`,
                    date: new Date().toISOString().split("T")[0]!,
                    type: "expense",
                    isTaxDeductible: true,
                    createdByAuthId: "00000000-0000-0000-0000-000000000000", // system-generated
                  });
                }
              } catch {
                // Expense logging is best-effort — don't fail the webhook
              }
            }

            // Recalculate proposal-level status
            await recalculateProposalStatus(parseInt(proposalId));
          }
        } else {
          // --- V1 LEGACY PROPOSAL ---
          const proposal = await db.query.clientResources.findFirst({
            where: eq(clientResources.id, parseInt(proposalId)),
            with: { client: true },
          });

          if (proposal) {
            const metadata = proposal.metadata as Record<
              string,
              unknown
            > | null;
            await db
              .update(clientResources)
              .set({
                metadata: {
                  ...metadata,
                  status: "accepted",
                  paidAt: new Date().toISOString(),
                  stripeSessionId: session.id,
                  stripePaymentIntentId: session.payment_intent,
                  stripeSubscriptionId:
                    typeof session.subscription === "string"
                      ? session.subscription
                      : (session.subscription?.id ?? null),
                },
                updatedAt: new Date(),
              })
              .where(eq(clientResources.id, proposal.id));

            // Send receipt email
            const customerEmail =
              session.customer_email ?? proposal.client.email;
            if (customerEmail) {
              const selectedPackageIds =
                session.metadata?.selectedPackageIds?.split(",") ?? [];
              const packages =
                (metadata?.packages as Array<{
                  id: string;
                  name: string;
                  price: number;
                  type: string;
                  interval?: string;
                }>) ?? [];

              const selectedPackages = packages.filter((pkg) =>
                selectedPackageIds.includes(pkg.id)
              );

              await sendEmail({
                to: customerEmail,
                subject: `Receipt: ${proposal.title}`,
                react: ProposalReceiptEmail({
                  clientName: proposal.client.name,
                  proposalTitle: proposal.title,
                  packages: selectedPackages.map((pkg) => ({
                    name: pkg.name,
                    price: pkg.price,
                    type: pkg.type as "one-time" | "subscription",
                    interval: pkg.interval,
                  })),
                  totalAmount: session.amount_total
                    ? session.amount_total / 100
                    : 0,
                  currency: session.currency ?? "usd",
                  paidAt: new Date(),
                }),
              });
            }
          }
        }
      }
      break;
    }

    case "invoice.payment_succeeded":
    case "customer.subscription.updated":
      break;

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      // Find proposals linked to this subscription and mark them
      const linkedProposals = await db.query.clientResources.findMany({
        where: eq(clientResources.section, "proposals"),
      });

      for (const proposal of linkedProposals) {
        const meta = proposal.metadata as Record<string, unknown> | null;
        if (meta?.stripeSubscriptionId === subscription.id) {
          await db
            .update(clientResources)
            .set({
              metadata: {
                ...meta,
                subscriptionStatus: "canceled",
                subscriptionCanceledAt: new Date().toISOString(),
              },
              updatedAt: new Date(),
            })
            .where(eq(clientResources.id, proposal.id));
        }
      }
      break;
    }

    default:
      // Unhandled event type — log in dev
      if (process.env.NODE_ENV === "development") {
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }
  }

  return NextResponse.json({ received: true });
}
