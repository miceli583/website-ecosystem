import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { banyanEarlyAccess } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "~/lib/rate-limit";
import { sendEmail, sendAdminNotification } from "~/lib/email";
import { BanyanConfirmationEmail } from "~/lib/email-templates/banyan-confirmation";
import { AdminNotificationEmail } from "~/lib/email-templates/admin-notification";

/**
 * POST /api/banyan/early-access
 * Submit early access request for Banyan LifeOS
 */
export async function POST(request: NextRequest) {
  // Rate limit: 5 requests per 15 minutes per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success: withinLimit } = rateLimit(
    `early-access:${ip}`,
    5,
    15 * 60 * 1000
  );
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    // Parse request body
    const body = (await request.json()) as {
      fullName: string;
      email: string;
      role?: string;
      message?: string;
    };

    // Validate required fields
    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await db
      .select()
      .from(banyanEarlyAccess)
      .where(eq(banyanEarlyAccess.email, body.email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This email has already been registered for early access" },
        { status: 409 }
      );
    }

    // Insert into database
    const [newSignup] = await db
      .insert(banyanEarlyAccess)
      .values({
        fullName: body.fullName,
        email: body.email,
        role: body.role ?? null,
        message: body.message ?? null,
        contacted: false,
      })
      .returning();

    // Send emails (non-blocking)
    void sendEmail({
      to: body.email,
      subject: "Welcome to BANYAN Early Access",
      react: BanyanConfirmationEmail({ fullName: body.fullName }),
    });

    void sendAdminNotification({
      subject: "New BANYAN Early Access Signup",
      react: AdminNotificationEmail({
        subject: "New BANYAN Early Access Signup",
        fullName: body.fullName,
        email: body.email,
        role: body.role,
        message: body.message,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your interest! We'll be in touch soon.",
        data: {
          id: newSignup!.id,
          email: newSignup!.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing early access signup:", error);

    return NextResponse.json(
      {
        error: "An error occurred while processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
