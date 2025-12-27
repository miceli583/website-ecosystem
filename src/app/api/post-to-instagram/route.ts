/**
 * API Route to post daily value carousel to Instagram via Zapier
 * Stores images at public URLs and sends URLs to Zapier
 */

import { NextRequest, NextResponse } from "next/server";
import { storeImages } from "~/lib/image-store";

const ZAPIER_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/25829205/ua7aaz9/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract images and convert base64 to Blobs
    const { images, caption, metadata } = body;

    // Convert data URLs to Blobs
    const base64ToBlob = (dataUrl: string): Blob => {
      const arr = dataUrl.split(",");
      const mime = arr[0]?.match(/:(.*?);/)?.[1] ?? "image/jpeg";
      const bstr = atob(arr[1] ?? "");
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };

    const image1Blob = base64ToBlob(images.page1);
    const image2Blob = base64ToBlob(images.page2);
    const image3Blob = base64ToBlob(images.page3);

    // Store images in memory
    storeImages(image1Blob, image2Blob, image3Blob);

    // Always use production domain for Zapier (even in dev)
    // Zapier can't access localhost, so we need publicly accessible URLs
    const productionDomain = "miraclemind.dev";
    const baseUrl = `https://${productionDomain}`;

    // Create public URLs for the images
    const imageUrls = {
      image1: `${baseUrl}/dailyanchorautomation/image1`,
      image2: `${baseUrl}/dailyanchorautomation/image2`,
      image3: `${baseUrl}/dailyanchorautomation/image3`,
    };

    // ========================================================================
    // CRITICAL: Verify images are accessible before sending to Zapier
    // In serverless, in-memory storage can be unreliable across function instances
    // ========================================================================

    const verifyImageAccessible = async (
      url: string,
      maxRetries = 3
    ): Promise<boolean> => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await fetch(url, { method: "HEAD" });
          if (response.ok) return true;
          // If not found, wait a bit and retry (serverless cold start)
          await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
        } catch (error) {
          console.error(
            `Verification attempt ${i + 1} failed for ${url}:`,
            error
          );
          if (i < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
          }
        }
      }
      return false;
    };

    console.log("📸 Verifying images are accessible...");
    const [image1Ok, image2Ok, image3Ok] = await Promise.all([
      verifyImageAccessible(imageUrls.image1),
      verifyImageAccessible(imageUrls.image2),
      verifyImageAccessible(imageUrls.image3),
    ]);

    if (!image1Ok || !image2Ok || !image3Ok) {
      const missing = [];
      if (!image1Ok) missing.push("image1");
      if (!image2Ok) missing.push("image2");
      if (!image3Ok) missing.push("image3");

      console.error("❌ Images not accessible:", missing);
      return NextResponse.json(
        {
          error: "Images not accessible",
          details: `Failed to verify images: ${missing.join(", ")}`,
          hint: "This is likely due to serverless function instance mismatch. Consider using persistent storage (Supabase Storage).",
        },
        { status: 500 }
      );
    }

    console.log("✅ All images verified accessible");

    // Add a small buffer to ensure images are fully ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Send URLs to Zapier instead of base64 data
    const zapierPayload = {
      image1: imageUrls.image1,
      image2: imageUrls.image2,
      image3: imageUrls.image3,
      caption,
      metadata,
    };

    console.log("📤 Sending to Zapier...");
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
      imageUrls, // Return the URLs for debugging
    });
  } catch (error) {
    console.error("Error posting to Zapier:", error);
    return NextResponse.json(
      {
        error: "Failed to post to Zapier",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
