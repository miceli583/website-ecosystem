/**
 * Debug pending post status
 * Run with: node scripts/debug-pending-post.js
 */

import pg from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const sql = pg(process.env.DATABASE_URL);

async function debug() {
  try {
    console.log("🔍 Debugging pending post...\n");

    // 1. Check current pending post
    console.log("1️⃣ Current pending post:");
    const pending = await sql`
      SELECT
        id,
        status,
        scheduled_for,
        created_at,
        sent_at,
        EXTRACT(EPOCH FROM (NOW() - scheduled_for)) as seconds_overdue
      FROM pending_posts
      WHERE id = 'current';
    `;

    if (pending.length === 0) {
      console.log("   ❌ No pending post found\n");
    } else {
      const post = pending[0];
      console.log(`   Status: ${post.status}`);
      console.log(`   Scheduled for: ${post.scheduled_for}`);
      console.log(`   Created at: ${post.created_at}`);
      console.log(`   Sent at: ${post.sent_at || "Not sent"}`);
      console.log(
        `   Time status: ${post.seconds_overdue > 0 ? `⏰ OVERDUE by ${Math.floor(post.seconds_overdue)}s` : `⏳ Due in ${Math.abs(Math.floor(post.seconds_overdue))}s`}\n`
      );
    }

    // 2. Check if cron job exists
    console.log("2️⃣ Checking cron job:");
    const jobs = await sql`
      SELECT
        jobid,
        jobname,
        schedule,
        command,
        active
      FROM cron.job
      WHERE jobname = 'process-pending-instagram-posts';
    `;

    if (jobs.length === 0) {
      console.log(
        "   ❌ Cron job NOT found! You need to create it in Supabase.\n"
      );
    } else {
      const job = jobs[0];
      console.log(`   ✅ Job found: ${job.jobname}`);
      console.log(`   Schedule: ${job.schedule}`);
      console.log(`   Active: ${job.active}\n`);
    }

    // 3. Check cron execution history
    console.log("3️⃣ Recent cron executions:");
    const executions = await sql`
      SELECT
        runid,
        status,
        return_message,
        start_time,
        end_time
      FROM cron.job_run_details
      WHERE jobid = (
        SELECT jobid
        FROM cron.job
        WHERE jobname = 'process-pending-instagram-posts'
      )
      ORDER BY start_time DESC
      LIMIT 5;
    `;

    if (executions.length === 0) {
      console.log("   ⚠️  No executions found (cron may not be running yet)\n");
    } else {
      executions.forEach((ex, i) => {
        console.log(
          `   ${i + 1}. ${ex.start_time} - ${ex.status} ${ex.return_message ? `(${ex.return_message})` : ""}`
        );
      });
      console.log();
    }

    // 4. Test API endpoint availability
    console.log("4️⃣ Testing API endpoint:");
    try {
      const response = await fetch(
        "https://admin.miraclemind.dev/api/process-pending-post"
      );
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(`   ❌ Error calling API:`, error.message);
    }

    await sql.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    await sql.end();
    process.exit(1);
  }
}

debug();
