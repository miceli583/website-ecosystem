/**
 * API Route to process pending posts
 * Called by Supabase pg_cron to check and send scheduled posts to Zapier
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { pendingPosts } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";

const ZAPIER_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/25829205/ua7aaz9/";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current pending post
    const pendingPost = await db
      .select()
      .from(pendingPosts)
      .where(eq(pendingPosts.id, "current"))
      .limit(1);

    if (!pendingPost[0]) {
      return NextResponse.json({
        message: "No pending post found",
        processed: false,
      });
    }

    const post = pendingPost[0];

    // Check if status is not pending (already sent)
    if (post.status !== "pending") {
      return NextResponse.json({
        message: "Post already processed",
        status: post.status,
        processed: false,
      });
    }

    // Check if scheduled time has passed
    const now = new Date();
    if (post.scheduledFor > now) {
      const remainingSeconds = Math.floor(
        (post.scheduledFor.getTime() - now.getTime()) / 1000
      );
      return NextResponse.json({
        message: "Post not yet due",
        remainingSeconds,
        scheduledFor: post.scheduledFor,
        processed: false,
      });
    }

    // Time to send! Parse the payload and send to Zapier
    const zapierPayload = JSON.parse(post.zapierPayload);

    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zapierPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Zapier webhook error:", errorText);

      // Keep as pending so it can be retried
      return NextResponse.json(
        {
          error: "Zapier webhook failed",
          details: errorText,
          processed: false,
        },
        { status: 500 }
      );
    }

    // Success! Update status to sent
    await db
      .update(pendingPosts)
      .set({
        status: "sent",
        sentAt: new Date(),
      })
      .where(eq(pendingPosts.id, "current"));

    const zapierResult = await response.json();

    return NextResponse.json({
      success: true,
      processed: true,
      message: "Post sent to Zapier successfully",
      data: zapierResult,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing pending post:", error);
    return NextResponse.json(
      {
        error: "Failed to process pending post",
        details: error instanceof Error ? error.message : "Unknown error",
        processed: false,
      },
      { status: 500 }
    );
  }
}

// Also support GET for manual testing/debugging
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pendingPost = await db
      .select()
      .from(pendingPosts)
      .where(eq(pendingPosts.id, "current"))
      .limit(1);

    if (!pendingPost[0]) {
      return NextResponse.json({
        message: "No pending post found",
        currentTime: new Date().toISOString(),
      });
    }

    const post = pendingPost[0];
    const now = new Date();
    const isPending = post.status === "pending";
    const isDue = post.scheduledFor <= now;
    const remainingSeconds = Math.floor(
      (post.scheduledFor.getTime() - now.getTime()) / 1000
    );

    return NextResponse.json({
      post: {
        id: post.id,
        status: post.status,
        scheduledFor: post.scheduledFor,
        createdAt: post.createdAt,
        sentAt: post.sentAt,
      },
      currentTime: now.toISOString(),
      isPending,
      isDue,
      remainingSeconds: remainingSeconds > 0 ? remainingSeconds : 0,
      willProcess: isPending && isDue,
    });
  } catch (error) {
    console.error("Error checking pending post:", error);
    return NextResponse.json(
      {
        error: "Failed to check pending post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
