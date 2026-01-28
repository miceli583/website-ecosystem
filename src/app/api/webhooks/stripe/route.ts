import { NextRequest, NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

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
