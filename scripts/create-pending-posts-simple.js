/**
 * Simple script to create pending_posts table
 * Run with: node scripts/create-pending-posts-simple.js
 */

import pg from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const sql = pg(process.env.DATABASE_URL);

async function createTable() {
  try {
    console.log("🔌 Connecting to database...");

    const result = await sql`
      CREATE TABLE IF NOT EXISTS "pending_posts" (
        "id" text PRIMARY KEY NOT NULL,
        "zapier_payload" text NOT NULL,
        "scheduled_for" timestamp with time zone NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "sent_at" timestamp with time zone
      );
    `;

    console.log("✅ Table created successfully!");

    // Verify
    const check = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'pending_posts'
      );
    `;

    console.log(
      "📋 Verification:",
      check[0].exists ? "Table exists ✅" : "Table not found ❌"
    );

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await sql.end();
    process.exit(1);
  }
}

createTable();
