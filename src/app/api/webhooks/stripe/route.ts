import { NextRequest, NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import { customers, clientResources, clients } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { sendEmail } from "~/lib/email";
import { ProposalReceiptEmail } from "~/components/emails/proposal-receipt";

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
        const proposal = await db.query.clientResources.findFirst({
          where: eq(clientResources.id, parseInt(proposalId)),
          with: { client: true },
        });

        if (proposal) {
          // Update proposal status to accepted
          const metadata = proposal.metadata as Record<string, unknown> | null;
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
                    : session.subscription?.id ?? null,
              },
              updatedAt: new Date(),
            })
            .where(eq(clientResources.id, proposal.id));

          // Send receipt email
          const customerEmail = session.customer_email ?? proposal.client.email;
          if (customerEmail) {
            const selectedPackageIds = session.metadata?.selectedPackageIds?.split(",") ?? [];
            const packages = (metadata?.packages as Array<{
              id: string;
              name: string;
              price: number;
              type: string;
              interval?: string;
            }>) ?? [];

            const selectedPackages = packages.filter(pkg =>
              selectedPackageIds.includes(pkg.id)
            );

            await sendEmail({
              to: customerEmail,
              subject: `Receipt: ${proposal.title}`,
              react: ProposalReceiptEmail({
                clientName: proposal.client.name,
                proposalTitle: proposal.title,
                packages: selectedPackages.map(pkg => ({
                  name: pkg.name,
                  price: pkg.price,
                  type: pkg.type as "one-time" | "subscription",
                  interval: pkg.interval,
                })),
                totalAmount: session.amount_total ? session.amount_total / 100 : 0,
                currency: session.currency ?? "usd",
                paidAt: new Date(),
              }),
            });
          }
        }
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subDetails = invoice.parent?.subscription_details;
      const subscriptionId = subDetails
        ? typeof subDetails.subscription === "string"
          ? subDetails.subscription
          : subDetails.subscription?.id ?? null
        : null;
      console.log(
        `[Stripe Webhook] Invoice ${invoice.id} paid — subscription: ${subscriptionId ?? "none"}, amount: ${invoice.amount_paid}`
      );
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(
        `[Stripe Webhook] Subscription ${subscription.id} updated — status: ${subscription.status}, cancel_at_period_end: ${subscription.cancel_at_period_end}`
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(
        `[Stripe Webhook] Subscription ${subscription.id} deleted/canceled`
      );

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
          console.log(
            `[Stripe Webhook] Marked proposal ${proposal.id} subscription as canceled`
          );
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
