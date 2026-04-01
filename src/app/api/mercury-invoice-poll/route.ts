/**
 * Mercury Invoice Polling Endpoint
 *
 * Polls Mercury for payment status on pending invoice checkouts.
 * Called via Vercel cron (every 15 min) or manually.
 *
 * Flow:
 * 1. Query all proposalCheckouts where mercury + pending
 * 2. For each, call Mercury API to check invoice status
 * 3. If paid: update checkout status, recalculate proposal status
 */

import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { proposalCheckouts } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { getMercuryInvoice } from "~/lib/mercury";
import { recalculateProposalStatus } from "~/server/api/routers/proposals";

export async function GET(request: NextRequest) {
  // Auth: require CRON_SECRET
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find all pending Mercury checkouts
  const pendingCheckouts = await db
    .select()
    .from(proposalCheckouts)
    .where(
      and(
        eq(proposalCheckouts.status, "pending"),
        eq(proposalCheckouts.paymentMethod, "mercury_bank")
      )
    );

  if (pendingCheckouts.length === 0) {
    return NextResponse.json({
      message: "No pending Mercury checkouts",
      checked: 0,
      updated: 0,
    });
  }

  let updated = 0;
  const errors: string[] = [];

  for (const checkout of pendingCheckouts) {
    if (!checkout.mercuryInvoiceId) continue;

    try {
      const invoice = await getMercuryInvoice(checkout.mercuryInvoiceId);

      if (!invoice) {
        errors.push(
          `Failed to fetch invoice ${checkout.mercuryInvoiceId} for checkout ${checkout.id}`
        );
        continue;
      }

      if (invoice.status === "Paid") {
        await db
          .update(proposalCheckouts)
          .set({
            status: "paid",
            paidAt: invoice.paidAt ? new Date(invoice.paidAt) : new Date(),
            updatedAt: new Date(),
          })
          .where(eq(proposalCheckouts.id, checkout.id));

        // Recalculate parent proposal status
        await recalculateProposalStatus(checkout.proposalId);
        updated++;
      } else if (invoice.status === "Cancelled") {
        await db
          .update(proposalCheckouts)
          .set({
            status: "canceled",
            updatedAt: new Date(),
          })
          .where(eq(proposalCheckouts.id, checkout.id));
        updated++;
      }
    } catch (error) {
      errors.push(
        `Error polling checkout ${checkout.id}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return NextResponse.json({
    message: "Mercury invoice poll complete",
    checked: pendingCheckouts.length,
    updated,
    errors: errors.length > 0 ? errors : undefined,
  });
}
