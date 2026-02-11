# Automation

Instagram post automation and scheduled tasks.

## Overview

The automated system:
1. Generates carousel images server-side (Puppeteer)
2. Uploads to Supabase Storage
3. Creates pending post with 2-minute buffer
4. Rotates the queue
5. Cron sends to Zapier/Instagram after buffer expires

---

## Daily Instagram Automation

### Manual Testing

```bash
# Check endpoint status
curl https://admin.miraclemind.dev/api/auto-rotate-and-post

# Trigger manual rotation
curl -X POST https://admin.miraclemind.dev/api/auto-rotate-and-post
```

### Set Up Daily Cron

**Schedule:** 6 AM EST = 10 AM UTC

In Supabase SQL Editor:

```sql
SELECT cron.schedule(
  'daily-rotate-and-post',
  '0 10 * * *',  -- Every day at 10 AM UTC
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

### Verify Cron Job

```sql
SELECT * FROM cron.job WHERE jobname = 'daily-rotate-and-post';
```

### Monitor Execution

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

### Manage Cron Jobs

```sql
-- Pause
SELECT cron.unschedule('daily-rotate-and-post');

-- Resume (run the CREATE statement again)
```

---

## Pending Post Processing

A separate cron job processes pending posts:

### Setup

```sql
SELECT cron.schedule(
  'process-pending-instagram-posts',
  '*/30 * * * * *',  -- Every 30 seconds
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

### Check Status

```sql
SELECT * FROM pending_posts WHERE id = 'current';
```

### Debug Endpoint

Visit: `https://YOUR_DEPLOYMENT_URL/api/process-pending-post`

---

## Cron Schedule Reference

```
0 10 * * *
│ │  │ │ │
│ │  │ │ └─── Day of week (0-7)
│ │  │ └───── Month (1-12)
│ │  └─────── Day of month (1-31)
│ └─────────── Hour (0-23 UTC)
└───────────── Minute (0-59)
```

**Common schedules:**
- `0 10 * * *` - Daily at 10 AM UTC
- `0 10 * * 1-5` - Weekdays only
- `0 10,18 * * *` - Twice daily

---

## Flow Diagram

```
Daily at 6 AM EST:
    ↓
Supabase cron triggers
    ↓
Calls /api/auto-rotate-and-post
    ↓
Server generates images (Puppeteer)
    ↓
Uploads to Supabase Storage
    ↓
Creates pending_posts entry (scheduled_for = NOW + 2 min)
    ↓
Rotates queue
    ↓
[2 minute buffer...]
    ↓
process-pending-post cron checks
    ↓
Finds pending post ready to send
    ↓
Sends to Zapier → Posts to Instagram
    ↓
Updates status = 'sent'
```

---

## Resume PDF Generation

Generate PDF from the `/resume` page using Puppeteer.

### Quick Start

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
npm run generate-resume-pdf
```

Output: `Matthew_Miceli_Resume.pdf` in project root

### Details

- **Format:** US Letter (8.5" x 11")
- **Pages:** 2
- **Margins:** 0.25 inches
- **Script:** `scripts/generate-resume-pdf.ts`

---

## Cost

All free tier:
- Supabase cron: Free
- Puppeteer on Vercel: Free
- Storage: Free (3 images overwritten daily)

---

## Troubleshooting

### Cron Not Running

```sql
SELECT * FROM cron.job WHERE jobname = 'daily-rotate-and-post';
```

### Check Errors

```sql
SELECT status, return_message, start_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'daily-rotate-and-post')
ORDER BY start_time DESC
LIMIT 5;
```

### Manual Trigger

```bash
curl -X POST https://admin.miraclemind.dev/api/auto-rotate-and-post
```
