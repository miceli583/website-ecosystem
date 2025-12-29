# Daily Automation Setup Guide

Automate your daily Instagram posts to run every day at 6 AM EST.

## Overview

The automated system will:
1. Generate carousel images server-side (using Puppeteer)
2. Upload to Supabase Storage
3. Create a pending post with 2-minute buffer
4. Rotate the queue (remove posted item, add new random item)
5. Existing cron sends to Zapier after buffer expires

## Manual Testing First

Before setting up the daily cron, test the endpoint manually:

### Test 1: Check Endpoint Status

```bash
curl https://admin.miraclemind.dev/api/auto-rotate-and-post
```

**Expected:** JSON response explaining the endpoint usage

### Test 2: Trigger Manual Rotation

```bash
curl -X POST https://admin.miraclemind.dev/api/auto-rotate-and-post
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully rotated queue and created pending post",
  "data": {
    "value": "Authenticity",
    "quote": "Be yourself; everyone else is already taken...",
    "author": "Oscar Wilde",
    "scheduledFor": "2025-12-28T18:32:00.000Z",
    "imagesUploaded": true,
    "queueRotated": true
  }
}
```

### Test 3: Verify in Database

```sql
-- Check pending post was created
SELECT * FROM pending_posts WHERE id = 'current';

-- Check queue was rotated
SELECT * FROM quote_posts ORDER BY queue_position;
```

### Test 4: Wait 2 Minutes

After the buffer expires, verify:
- Status changed to 'sent' in `pending_posts`
- Post was sent to Zapier/Instagram

## Set Up Daily Cron (After Testing)

Once manual testing succeeds, set up the daily automation:

### 1. Calculate UTC Time

**6 AM EST = 11 AM UTC** (standard time)
**6 AM EDT = 10 AM UTC** (daylight saving)

For simplicity, use **10 AM UTC** year-round (6 AM EDT / 7 AM EST).

### 2. Create Cron Job in Supabase

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
SELECT cron.schedule(
  'daily-rotate-and-post',
  '0 10 * * *',  -- Every day at 10 AM UTC (6 AM EDT)
  $$
    SELECT
      net.http_post(
        url := 'https://admin.miraclemind.dev/api/auto-rotate-and-post',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb
      ) AS request_id;
  $$
);
```

### 3. Verify Cron Job Created

```sql
SELECT * FROM cron.job WHERE jobname = 'daily-rotate-and-post';
```

Should show:
- `jobname`: daily-rotate-and-post
- `schedule`: 0 10 * * *
- `active`: true

## Monitor Execution

### View Recent Runs

```sql
SELECT
  r.start_time,
  r.status,
  r.return_message
FROM cron.job_run_details r
WHERE r.jobid = (
  SELECT jobid FROM cron.job
  WHERE jobname = 'daily-rotate-and-post'
)
ORDER BY r.start_time DESC
LIMIT 10;
```

### Check Today's Post

```sql
-- See if today's post is scheduled
SELECT
  *,
  EXTRACT(EPOCH FROM (scheduled_for - NOW())) / 60 as minutes_until_send
FROM pending_posts
WHERE id = 'current';
```

## Cron Schedule Reference

```
0 10 * * *
│ │  │ │ │
│ │  │ │ └─── Day of week (0-7, Sunday = 0 or 7)
│ │  │ └───── Month (1-12)
│ │  └─────── Day of month (1-31)
│ └─────────── Hour (0-23 UTC)
└───────────── Minute (0-59)
```

**Common schedules:**
- `0 10 * * *` - Every day at 10 AM UTC
- `0 10 * * 1-5` - Weekdays only at 10 AM UTC
- `0 10,18 * * *` - Twice daily: 10 AM and 6 PM UTC

## Manage Cron Jobs

### Pause Daily Automation

```sql
SELECT cron.unschedule('daily-rotate-and-post');
```

### Resume Daily Automation

Just run the CREATE statement from step 2 again.

### Delete Permanently

```sql
SELECT cron.unschedule('daily-rotate-and-post');
```

## Complete Automation Flow

```
Daily at 6 AM EST:
    ↓
Supabase cron triggers
    ↓
Calls /api/auto-rotate-and-post
    ↓
Server generates images with Puppeteer
    ↓
Uploads to Supabase Storage
    ↓
Creates pending_posts entry (scheduled_for = NOW + 2 min)
    ↓
Rotates queue (pops first, adds random to end)
    ↓
Returns success ✅
    ↓
[2 minute buffer...]
    ↓
Existing process-pending-post cron checks every minute
    ↓
Finds pending post, scheduledFor has passed
    ↓
Sends to Zapier → Posts to Instagram ✅
    ↓
Updates status = 'sent'
    ↓
Done! 🎉
```

## Troubleshooting

### Cron Not Running

```sql
-- Check if cron exists and is active
SELECT * FROM cron.job WHERE jobname = 'daily-rotate-and-post';
```

### Check for Errors

```sql
-- See error messages
SELECT
  status,
  return_message,
  start_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'daily-rotate-and-post')
ORDER BY start_time DESC
LIMIT 5;
```

### Manual Trigger for Testing

```bash
# Test anytime (don't wait for 6 AM)
curl -X POST https://admin.miraclemind.dev/api/auto-rotate-and-post
```

### Images Look Wrong

The server-side Puppeteer rendering should produce identical images to the client-side version. If they look different:
- Check browser console for font loading issues
- Verify logo path is accessible from server
- Check theme colors match

## Cost

✅ **100% FREE**
- Supabase cron: Free tier
- Puppeteer on Vercel: Free tier (executes quickly)
- Storage: Free tier (3 images overwritten daily)

## Next Steps

1. Test manually first (see above)
2. Verify images look correct
3. Set up daily cron (6 AM EST)
4. Monitor for a few days
5. Enjoy automated daily posts! 🚀

---

**Need to adjust the time?** Just unschedule and reschedule with a different UTC hour.

**Want to stop automation?** Simply unschedule the cron job.
