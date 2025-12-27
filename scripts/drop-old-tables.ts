// @ts-nocheck
import { config } from "dotenv";
config();

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function dropOldTables() {
  console.log("🗑️  Dropping old prefixed tables...\n");

  try {
    await sql`DROP TABLE IF EXISTS "website-ecosystem_quote_posts" CASCADE`;
    console.log("✅ Dropped website-ecosystem_quote_posts");

    await sql`DROP TABLE IF EXISTS "website-ecosystem_core_value_quotes" CASCADE`;
    console.log("✅ Dropped website-ecosystem_core_value_quotes");

    await sql`DROP TABLE IF EXISTS "website-ecosystem_core_value_supporting_values" CASCADE`;
    console.log("✅ Dropped website-ecosystem_core_value_supporting_values");

    await sql`DROP TABLE IF EXISTS "website-ecosystem_quotes" CASCADE`;
    console.log("✅ Dropped website-ecosystem_quotes");

    await sql`DROP TABLE IF EXISTS "website-ecosystem_authors" CASCADE`;
    console.log("✅ Dropped website-ecosystem_authors");

    await sql`DROP TABLE IF EXISTS "website-ecosystem_supporting_values" CASCADE`;
    console.log("✅ Dropped website-ecosystem_supporting_values");

    await sql`DROP TABLE IF EXISTS "website-ecosystem_core_values" CASCADE`;
    console.log("✅ Dropped website-ecosystem_core_values");

    console.log("\n🎉 All old tables dropped successfully!");
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await sql.end();
    process.exit(1);
  }
}

dropOldTables();
