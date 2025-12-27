// @ts-nocheck
/**
 * Data Migration: Ensure all Core Values exist in Supporting Values
 * Direct database connection version
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { coreValues, supportingValues } from "../src/server/db/schema";

// Load .env file
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  console.error("Make sure you have a .env file with DATABASE_URL set");
  process.exit(1);
}

console.log("🔌 Connecting to database...");

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function syncCoreToSupporting() {
  console.log("🔄 Starting Core Values → Supporting Values sync...\n");

  try {
    // Get all core values
    const allCoreValues = await db.select().from(coreValues);
    console.log(`📊 Found ${allCoreValues.length} Core Values`);

    // Get all supporting values
    const allSupportingValues = await db.select().from(supportingValues);
    console.log(`📊 Found ${allSupportingValues.length} Supporting Values\n`);

    // Create a Set of existing supporting value names for quick lookup
    const supportingValueNames = new Set(
      allSupportingValues.map((sv) => sv.value)
    );

    // Find Core Values that don't exist in Supporting Values
    const missingInSupporting = allCoreValues.filter(
      (cv) => !supportingValueNames.has(cv.value)
    );

    if (missingInSupporting.length === 0) {
      console.log("✅ All Core Values already exist in Supporting Values!");
      console.log("✅ No sync needed.\n");
      return;
    }

    console.log(
      `⚠️  Found ${missingInSupporting.length} Core Values missing from Supporting Values:\n`
    );
    missingInSupporting.forEach((cv) => {
      console.log(`   - ${cv.value}`);
    });
    console.log();

    // Add missing values to Supporting Values
    console.log("➕ Adding missing values to Supporting Values...\n");

    for (const coreValue of missingInSupporting) {
      const id = `sv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await db.insert(supportingValues).values({
        id,
        value: coreValue.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`   ✓ Added: ${coreValue.value}`);

      // Small delay to ensure unique IDs
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    console.log(
      `\n✅ Successfully synced ${missingInSupporting.length} values!`
    );
    console.log(
      "✅ Core Values are now a proper subset of Supporting Values.\n"
    );
  } catch (error) {
    console.error("❌ Error during sync:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migration
syncCoreToSupporting()
  .then(() => {
    console.log("🎉 Migration complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration failed:", error);
    process.exit(1);
  });
