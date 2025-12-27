# Supabase Storage Setup for Daily Anchor Images

This guide explains how to set up Supabase Storage for the Instagram posting feature.

## Overview

The `/admin/daily-values` page generates carousel images and uploads them to Supabase Storage before sending to Zapier/Instagram. Using Supabase Storage provides:

- **Persistent storage** (unlike in-memory which doesn't work reliably in serverless)
- **Public URLs** that are immediately accessible
- **Fixed URLs** that stay the same across uploads (we overwrite the same 3 files each time)
- **100% reliability** in production

## Setup Instructions

### 1. Create the Storage Bucket

1. Go to your Supabase project dashboard:
   https://supabase.com/dashboard/project/wuxmtvdfzpjonzupmgsd/storage/buckets

2. Click **"New bucket"**

3. Configure the bucket:

   ```
   Name: daily-anchors
   Public bucket: ✅ YES (important!)
   File size limit: 5 MB
   Allowed MIME types: image/jpeg, image/jpg
   ```

4. Click **"Create bucket"**

### 2. Verify Bucket is Public

1. Go to the bucket settings (click on `daily-anchors` bucket)
2. Ensure **"Public bucket"** toggle is ON
3. This allows anyone to access the image URLs without authentication

### 3. How It Works

The application uploads 3 images with **fixed filenames**:

- `image1.jpg`
- `image2.jpg`
- `image3.jpg`

Each upload **overwrites** the previous file (using `upsert: true`), so:

- URLs never change
- Only 3 images ever stored (no bloat)
- No cleanup needed

### 4. Public URLs

Once set up, images will be accessible at:

```
https://wuxmtvdfzpjonzupmgsd.supabase.co/storage/v1/object/public/daily-anchors/image1.jpg
https://wuxmtvdfzpjonzupmgsd.supabase.co/storage/v1/object/public/daily-anchors/image2.jpg
https://wuxmtvdfzpjonzupmgsd.supabase.co/storage/v1/object/public/daily-anchors/image3.jpg
```

A cache-busting timestamp (`?t=timestamp`) is added when sending to Zapier to ensure fresh images.

## Testing

After creating the bucket:

1. Go to: https://www.miraclemind.dev/admin/daily-values?tab=generate
2. Generate a carousel and click **"Post to Instagram"**
3. Check browser console (F12) for:

   ```
   📤 Uploading images to Supabase Storage...
   ✅ Images uploaded successfully
   📸 Image URLs generated: {...}
   📤 Sending to Zapier...
   ```

4. Verify images are accessible by visiting the URLs directly in your browser

## Troubleshooting

### Error: "Failed to upload images to Supabase Storage"

**Cause**: Bucket doesn't exist or isn't public

**Fix**:

1. Verify bucket `daily-anchors` exists
2. Ensure "Public bucket" is enabled
3. Check Supabase environment variables are set in Vercel

### Error: "Bucket not found"

**Cause**: Bucket name mismatch

**Fix**:

- Ensure bucket is named exactly `daily-anchors` (lowercase, with hyphen)

### Images upload but Zapier can't access them

**Cause**: Bucket isn't public

**Fix**:

1. Go to bucket settings
2. Toggle **"Public bucket"** to ON
3. Try posting again

## Storage Limits

- **Free tier**: 1 GB storage, 2 GB bandwidth/month
- **This app**: Uses ~3-5 MB total (3 images overwritten each time)
- **Bandwidth**: Each Instagram post = ~3 MB download by Zapier
- **Estimate**: Can handle thousands of posts per month on free tier

No cleanup needed since files are overwritten!

## Security Notes

- Images are public (necessary for Zapier to access them)
- No sensitive data should be in the carousel images
- Only the latest 3 images are ever stored
- Old images are automatically overwritten
