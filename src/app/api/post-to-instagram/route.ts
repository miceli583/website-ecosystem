/**
 * API Route to post daily value carousel to Instagram via Zapier
 * Uploads images to Supabase Storage and sends public URLs to Zapier
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";

function verifyCronAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${env.CRON_SECRET}`;
}

const ZAPIER_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/25829205/ua7aaz9/";

const STORAGE_BUCKET = "daily-anchors";

export async function POST(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Extract images and convert base64 to Blobs
    const { images, caption, metadata, dryRun } = body;

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

    // Initialize Supabase client with service role key (bypasses RLS for server-side uploads)
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Delete old files first to avoid race conditions with upsert
    await Promise.all([
      supabase.storage.from(STORAGE_BUCKET).remove(["image1.jpg"]),
      supabase.storage.from(STORAGE_BUCKET).remove(["image2.jpg"]),
      supabase.storage.from(STORAGE_BUCKET).remove(["image3.jpg"]),
    ]);

    // Upload images sequentially to avoid race conditions
    const upload1 = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload("image1.jpg", image1Blob, {
        contentType: "image/jpeg",
        cacheControl: "0",
      });

    const upload2 = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload("image2.jpg", image2Blob, {
        contentType: "image/jpeg",
        cacheControl: "0",
      });

    const upload3 = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload("image3.jpg", image3Blob, {
        contentType: "image/jpeg",
        cacheControl: "0",
      });

    // Check for upload errors
    if (upload1.error || upload2.error || upload3.error) {
      const errors = [upload1.error, upload2.error, upload3.error].filter(
        Boolean
      );
      return NextResponse.json(
        {
          error: "Failed to upload images to Supabase Storage",
          details: errors.map((e) => e?.message).join(", "),
        },
        { status: 500 }
      );
    }

    // Get public URLs (these never change since we use fixed filenames)
    const {
      data: { publicUrl: url1 },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl("image1.jpg");

    const {
      data: { publicUrl: url2 },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl("image2.jpg");

    const {
      data: { publicUrl: url3 },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl("image3.jpg");

    // Add cache-busting timestamp to ensure Zapier gets fresh images
    const timestamp = Date.now();
    const cacheBust = `?v=${timestamp}&nocache=true`;
    const imageUrls = {
      image1: `${url1}${cacheBust}`,
      image2: `${url2}${cacheBust}`,
      image3: `${url3}${cacheBust}`,
    };

    // Prepare Zapier payload
    const zapierPayload = {
      image1: imageUrls.image1,
      image2: imageUrls.image2,
      image3: imageUrls.image3,
      caption,
      metadata,
    };

    // If dry run mode, skip Zapier and return payload preview
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        imageUrls,
        zapierPayload,
        message:
          "Images uploaded to Supabase. Zapier webhook skipped (dry run mode).",
      });
    }

    // Send URLs to Zapier
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
