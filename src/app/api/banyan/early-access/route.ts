import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { banyanEarlyAccess, masterCrm } from "~/server/db/schema";
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
      phone?: string;
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

    // Check for duplicate email in banyan_early_access
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

    // 1. Upsert to master_crm (by email)
    const existingContact = await db
      .select()
      .from(masterCrm)
      .where(eq(masterCrm.email, body.email))
      .limit(1);

    let crmId: string;

    if (existingContact.length > 0) {
      // Update existing contact
      crmId = existingContact[0]!.id;
      await db
        .update(masterCrm)
        .set({
          name: body.fullName,
          phone: body.phone ?? existingContact[0]!.phone,
          lastContactAt: new Date(),
          updatedAt: new Date(),
          // Add banyan_waitlist tag if not already present
          tags: existingContact[0]!.tags?.includes("banyan_waitlist")
            ? existingContact[0]!.tags
            : [...(existingContact[0]!.tags ?? []), "banyan_waitlist"],
        })
        .where(eq(masterCrm.id, crmId));
    } else {
      // Create new contact
      const [newContact] = await db
        .insert(masterCrm)
        .values({
          email: body.email,
          name: body.fullName,
          phone: body.phone,
          source: "banyan_waitlist",
          status: "lead",
          tags: ["banyan_waitlist"],
        })
        .returning({ id: masterCrm.id });
      crmId = newContact!.id;
    }

    // 2. Insert into banyan_early_access with crm reference
    const [newSignup] = await db
      .insert(banyanEarlyAccess)
      .values({
        crmId,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone ?? null,
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
        phone: body.phone,
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
