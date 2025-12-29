/**
 * Verify pending_posts table structure
 * Run with: node scripts/verify-table.js
 */

import pg from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const sql = pg(process.env.DATABASE_URL);

async function verifyTable() {
  try {
    console.log("🔍 Checking pending_posts table structure...\n");

    const columns = await sql`
      SELECT
        column_name,
        data_type,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pending_posts'
      ORDER BY ordinal_position;
    `;

    console.log("📋 Table structure:");
    columns.forEach((col) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} ${col.column_default ? `(default: ${col.column_default})` : ""} ${col.is_nullable === "NO" ? "[NOT NULL]" : "[NULL]"}`
      );
    });

    console.log("\n✅ Table is ready to use!");

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await sql.end();
    process.exit(1);
  }
}

verifyTable();
