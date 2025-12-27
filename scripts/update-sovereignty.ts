// @ts-nocheck
/**
 * Script to update Sovereignty description
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/update-sovereignty.ts
 */

import { db } from "~/server/db";
import { coreValues } from "~/server/db/schema";
import { eq } from "drizzle-orm";

async function updateSovereignty() {
  const newDescription =
    "Honoring your autonomy, self-governance, and personal authority. Living sovereignty means focusing your attention, making choices aligned with your deepest truth, dialing in your habits, and taking full responsibility for your life's direction.";

  // Find Sovereignty
  const sovereignty = await db.query.coreValues.findFirst({
    where: (cv, { eq }) => eq(cv.value, "Sovereignty"),
  });

  if (!sovereignty) {
    console.log("❌ Sovereignty not found");
    return;
  }

  // Update
  await db
    .update(coreValues)
    .set({
      description: newDescription,
      updatedAt: new Date(),
    })
    .where(eq(coreValues.id, sovereignty.id));

  console.log("✓ Updated Sovereignty");
  console.log(`  Old: ${sovereignty.description}`);
  console.log(`  New: ${newDescription}`);
}

updateSovereignty()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
