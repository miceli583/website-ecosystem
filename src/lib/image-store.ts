/**
 * In-memory store for temporary daily anchor images
 * Images are stored when generating a post and served via public URLs
 */

interface StoredImages {
  image1: Blob;
  image2: Blob;
  image3: Blob;
  timestamp: Date;
}

// In-memory storage (will be lost on server restart, but that's okay for temporary images)
let currentImages: StoredImages | null = null;

export function storeImages(image1: Blob, image2: Blob, image3: Blob) {
  currentImages = {
    image1,
    image2,
    image3,
    timestamp: new Date(),
  };
}

export function getImage(imageId: "image1" | "image2" | "image3"): Blob | null {
  if (!currentImages) return null;
  return currentImages[imageId];
}

export function hasImages(): boolean {
  return currentImages !== null;
}

export function clearImages() {
  currentImages = null;
}
