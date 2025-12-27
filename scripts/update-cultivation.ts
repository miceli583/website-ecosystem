// @ts-nocheck
/**
 * Script to update Cultivation description
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/update-cultivation.ts
 */

import { db } from "~/server/db";
import { coreValues } from "~/server/db/schema";
import { eq } from "drizzle-orm";

async function updateCultivation() {
  const newDescription =
    "Nurturing growth through patient, intentional development. Embracing cultivation means tending to your inner and outer landscape.";

  // Find Cultivation
  const cultivation = await db.query.coreValues.findFirst({
    where: (cv, { eq }) => eq(cv.value, "Cultivation"),
  });

  if (!cultivation) {
    console.log("❌ Cultivation not found");
    return;
  }

  // Update
  await db
    .update(coreValues)
    .set({
      description: newDescription,
      updatedAt: new Date(),
    })
    .where(eq(coreValues.id, cultivation.id));

  console.log("✓ Updated Cultivation");
  console.log(`  Old: ${cultivation.description}`);
  console.log(`  New: ${newDescription}`);
}

updateCultivation()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
