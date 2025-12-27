// @ts-nocheck
/**
 * Data Migration: Ensure all Core Values exist in Supporting Values
 *
 * This script ensures that Core Values are a proper subset of Supporting Values
 * by adding any Core Value that doesn't exist in Supporting Values.
 */

// Load environment variables
import { config } from "dotenv";
config();

// Skip env validation for scripts
process.env.SKIP_ENV_VALIDATION = "1";

import { db } from "~/server/db";
import { coreValues, supportingValues } from "~/server/db/schema";

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
      });

      console.log(`   ✓ Added: ${coreValue.value}`);
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
