// @ts-nocheck
/**
 * Script to view all core values in the database
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/view-core-values.ts
 */

import { db } from "~/server/db";

async function viewCoreValues() {
  console.log("📋 Current Core Values:\n");

  const values = await db.query.coreValues.findMany({
    orderBy: (cv, { asc }) => [asc(cv.createdAt)],
  });

  if (values.length === 0) {
    console.log("No core values found.");
    return;
  }

  values.forEach((cv, index) => {
    console.log(`${index + 1}. ${cv.value}`);
    console.log(`   ID: ${cv.id}`);
    console.log(`   Description: ${cv.description}`);
    console.log();
  });

  console.log(`Total: ${values.length} core values`);
}

viewCoreValues()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
