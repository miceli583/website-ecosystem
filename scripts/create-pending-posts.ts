/**
 * Script to create the pending_posts table
 * Run with: SKIP_ENV_VALIDATION=1 npx tsx scripts/create-pending-posts.ts
 */

import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function createPendingPostsTable() {
  try {
    console.log("Creating pending_posts table...");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "pending_posts" (
        "id" text PRIMARY KEY NOT NULL,
        "zapier_payload" text NOT NULL,
        "scheduled_for" timestamp with time zone NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "sent_at" timestamp with time zone
      );
    `);

    console.log("✅ Table created successfully!");

    // Verify
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name = 'pending_posts';
    `);

    console.log("Verification:", result);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating table:", error);
    process.exit(1);
  }
}

createPendingPostsTable();
