// @ts-nocheck
/**
 * Script to refine and polish core value descriptions
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/refine-core-values.ts
 */

import { db } from "~/server/db";
import { coreValues } from "~/server/db/schema";
import { eq } from "drizzle-orm";

const refinedDescriptions: Record<string, string> = {
  Contribution:
    "Making meaningful impact through service to others and the world. Living contribution means using your gifts and resources to uplift, support, and create positive change in the lives around you and beyond.",

  Freedom:
    "Living with autonomy and the power to shape your own destiny. Embracing freedom means breaking free from limiting beliefs and external constraints, while responsibly exercising your right to choose your path and express your truth.",

  Growth:
    "Embracing continuous evolution and expanding your potential. Living growth means staying curious, learning from every experience, and courageously stepping beyond your comfort zone to become the fullest expression of yourself.",

  Authenticity:
    "Expressing your true self with courage and integrity. Embracing authenticity means honoring your genuine feelings, values, and desires, while showing up in the world as you truly are rather than who you think you should be.",

  Balance:
    "Maintaining equilibrium across all dimensions of your life. Living balance means recognizing when to give and when to receive, when to push forward and when to rest, creating sustainable rhythms that honor both your ambitions and your wellbeing.",
};

async function refineDescriptions() {
  console.log("✨ Refining core value descriptions...\n");

  for (const [valueName, newDescription] of Object.entries(
    refinedDescriptions
  )) {
    try {
      // Find the core value
      const coreValue = await db.query.coreValues.findFirst({
        where: (cv, { eq }) => eq(cv.value, valueName),
      });

      if (!coreValue) {
        console.log(`⚠ Core value "${valueName}" not found, skipping`);
        continue;
      }

      // Update the description
      await db
        .update(coreValues)
        .set({
          description: newDescription,
          updatedAt: new Date(),
        })
        .where(eq(coreValues.id, coreValue.id));

      console.log(`✓ Updated "${valueName}"`);
      console.log(`  Old: ${coreValue.description}`);
      console.log(`  New: ${newDescription}\n`);
    } catch (error) {
      console.error(`❌ Error updating "${valueName}":`, error);
    }
  }

  console.log("🎯 All core values have been refined and polished!");
  console.log("\nYour complete set now includes:");
  console.log("• Contribution - Service and meaningful impact");
  console.log("• Freedom - Autonomy and self-determination");
  console.log("• Growth - Evolution and expanding potential");
  console.log("• Authenticity - True self-expression");
  console.log("• Balance - Sustainable equilibrium");
  console.log("• Sovereignty - Self-governance and personal authority");
  console.log("• Cultivation - Patient, intentional development");
  console.log("• Integration - Wholeness and coherence");
  console.log("• Harmony - Flow between opposing forces");
}

refineDescriptions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
