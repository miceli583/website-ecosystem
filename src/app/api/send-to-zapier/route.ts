/**
 * API Route to send prepared payload to Zapier
 * Used after buffer period in frontend
 */

import { NextRequest, NextResponse } from "next/server";

const ZAPIER_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/25829205/ua7aaz9/";

export async function POST(request: NextRequest) {
  try {
    const zapierPayload = await request.json();

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
      return NextResponse.json(
        { error: "Zapier webhook failed", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error sending to Zapier:", error);
    return NextResponse.json(
      {
        error: "Failed to send to Zapier",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
