# Supabase pg_cron Setup Guide

This guide will help you set up Supabase pg_cron to automatically process pending Instagram posts.

## Overview

The queue system now uses a database-backed buffer that ensures reliability:

1. When you click "Pop and Post" or "Rotate and Post", images are uploaded to Supabase Storage
2. The payload is saved to the `pending_posts` table with a 2-minute delay
3. Supabase pg_cron checks every 30 seconds and triggers your Next.js API when the time comes
4. The API sends the post to Zapier

## Prerequisites

- Supabase project with the `pending_posts` table created
- Your Next.js app deployed (e.g., on Vercel)
- `pending_posts` table in your database (run `npm run db:push` and confirm "Yes")

## Step 1: Confirm Database Schema

First, make sure the `pending_posts` table exists:

```bash
npm run db:push
```

When prompted, select "Yes" to execute the statements. This will create the table with the following structure:

```sql
CREATE TABLE "pending_posts" (
  "id" text PRIMARY KEY NOT NULL,
  "zapier_payload" text NOT NULL,
  "scheduled_for" timestamp with time zone NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "sent_at" timestamp with time zone
);
```

## Step 2: Enable pg_cron in Supabase

pg_cron is **already enabled** in Supabase by default (free tier included)!

No action needed - just verify it's available by running this in the Supabase SQL Editor:

```sql
SELECT cron.schedule('test-job', '* * * * *', 'SELECT 1');
SELECT cron.unschedule('test-job');
```

If this runs without errors, pg_cron is ready.

## Step 3: Create the Cron Job

Go to your Supabase Dashboard → SQL Editor and run this:

```sql
-- Create a cron job that runs every 30 seconds
SELECT cron.schedule(
  'process-pending-instagram-posts',  -- Job name
  '*/30 * * * * *',                   -- Every 30 seconds (supports seconds!)
  $$
    SELECT
      net.http_post(
        url := 'https://YOUR_DEPLOYMENT_URL/api/process-pending-post',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb
      ) AS request_id;
  $$
);
```

**Important:** Replace `YOUR_DEPLOYMENT_URL` with your actual deployment URL (e.g., `https://your-app.vercel.app`)

### Cron Schedule Explanation

- `*/30 * * * * *` means "every 30 seconds"
- Format: `seconds minutes hours day month day_of_week`
- You can adjust this:
  - Every 15 seconds: `*/15 * * * * *`
  - Every minute: `0 * * * * *`
  - Every 2 minutes: `0 */2 * * * *`

## Step 4: (Optional) Add Authentication

For security, you can add a secret token to prevent unauthorized access:

### 4.1: Add Secret to Environment Variables

Add to your `.env` file:

```bash
CRON_SECRET=your_random_secret_here_generate_a_long_string
```

Redeploy your app.

### 4.2: Update the Cron Job

```sql
-- First, unschedule the old job
SELECT cron.unschedule('process-pending-instagram-posts');

-- Create new job with Authorization header
SELECT cron.schedule(
  'process-pending-instagram-posts',
  '*/30 * * * * *',
  $$
    SELECT
      net.http_post(
        url := 'https://YOUR_DEPLOYMENT_URL/api/process-pending-post',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer your_random_secret_here_generate_a_long_string'
        ),
        body := '{}'::jsonb
      ) AS request_id;
  $$
);
```

### 4.3: Uncomment Auth Check in API Route

In `src/app/api/process-pending-post/route.ts`, uncomment these lines:

```typescript
const authHeader = request.headers.get("authorization");
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Step 5: Verify It's Working

### Check Cron Job Status

```sql
SELECT * FROM cron.job;
```

You should see your job listed.

### View Cron Job Execution History

```sql
SELECT
  jobid,
  runid,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'process-pending-instagram-posts')
ORDER BY start_time DESC
LIMIT 10;
```

### Manual Test

1. Click "Pop and Post" or "Rotate and Post" in your admin panel
2. Watch the buffer countdown
3. Check the database:

```sql
SELECT * FROM pending_posts WHERE id = 'current';
```

4. After 2 minutes, the status should change from `pending` to `sent`

### Debug API Endpoint Manually

Visit in your browser: `https://YOUR_DEPLOYMENT_URL/api/process-pending-post`

This GET endpoint will show you the current pending post status.

## Step 6: Managing the Cron Job

### Pause the Job

```sql
SELECT cron.unschedule('process-pending-instagram-posts');
```

### Restart the Job

Just run the CREATE statement from Step 3 again.

### View All Jobs

```sql
SELECT * FROM cron.job;
```

### Delete the Job Permanently

```sql
SELECT cron.unschedule('process-pending-instagram-posts');
```

## Troubleshooting

### Job not running

1. Check job exists: `SELECT * FROM cron.job;`
2. Check execution history: `SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;`
3. Verify your deployment URL is correct (https, not http)

### API returns 404

- Make sure your app is deployed and the `/api/process-pending-post` route exists
- Test the URL manually in a browser

### Posts not sending

1. Check pending post status: `SELECT * FROM pending_posts WHERE id = 'current';`
2. Manually trigger the API: `curl https://YOUR_URL/api/process-pending-post -X POST`
3. Check Vercel/deployment logs for errors

### Buffer shows but doesn't clear

- The frontend polls the database every second
- If `status = 'sent'` but buffer still shows, refresh the page
- Check browser console for errors

## Cost

✅ **100% FREE** - Supabase pg_cron is included in the free tier with no limits!

## Flow Diagram

```
User clicks "Pop and Post"
    ↓
Images uploaded to Supabase Storage
    ↓
Payload saved to pending_posts table (status='pending', scheduledFor=now+2min)
    ↓
Queue updates immediately (pop mutation)
    ↓
Buffer station displays (polling database every 1 second)
    ↓
[Wait 2 minutes...]
    ↓
pg_cron runs (every 30 seconds)
    ↓
Finds pending_post where scheduledFor <= now
    ↓
Calls /api/process-pending-post
    ↓
API sends to Zapier webhook
    ↓
Updates pending_posts status='sent', sentAt=now
    ↓
Frontend polls database, sees status='sent'
    ↓
Buffer clears ✅
```

## Next Steps

After setup, test the full flow:

1. Add items to your queue
2. Click "Pop and Post"
3. Watch the buffer countdown
4. Verify the post is sent to Instagram after 2 minutes
5. Check Supabase logs and your Zapier history

You're all set! 🎉
