// @ts-nocheck
import postgres from "postgres";

// Connection pooler (correct region)
const oldDb = postgres(
  "postgresql://postgres.wugmzxbetiddzqcqguus:acim_mind_0101@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
);

async function test() {
  try {
    console.log("Testing old database connection...");
    const result = await oldDb`SELECT COUNT(*) as count FROM core_values`;
    console.log(
      "✅ Old database connected! Core values count:",
      result[0].count
    );
    await oldDb.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Old database connection failed:", error.message);
    await oldDb.end();
    process.exit(1);
  }
}

test();
