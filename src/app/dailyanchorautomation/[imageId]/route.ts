/**
 * API route to serve daily anchor images
 * Routes: /dailyanchorautomation/image1, /dailyanchorautomation/image2, /dailyanchorautomation/image3
 */

import { NextRequest, NextResponse } from "next/server";
import { getImage } from "~/lib/image-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params;

  // Validate imageId
  if (!["image1", "image2", "image3"].includes(imageId)) {
    return NextResponse.json(
      { error: "Invalid image ID. Must be image1, image2, or image3" },
      { status: 400 }
    );
  }

  // Get the image from storage
  const imageBlob = getImage(imageId as "image1" | "image2" | "image3");

  if (!imageBlob) {
    return NextResponse.json(
      { error: "Image not found. Please generate a post first." },
      { status: 404 }
    );
  }

  // Convert blob to buffer
  const buffer = Buffer.from(await imageBlob.arrayBuffer());

  // Return the image as JPG
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
