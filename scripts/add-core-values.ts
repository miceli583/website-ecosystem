// @ts-nocheck
/**
 * Script to add new core values to the database
 * Run with: SKIP_ENV_VALIDATION=1 npx tsx scripts/add-core-values.ts
 */

import { db } from "~/server/db";
import { coreValues, supportingValues } from "~/server/db/schema";

const newCoreValues = [
  {
    value: "Sovereignty",
    description:
      "Honoring your autonomy, self-governance, and personal authority. Living sovereignty means making choices aligned with your deepest truth and taking full responsibility for your life's direction.",
  },
  {
    value: "Cultivation",
    description:
      "Nurturing growth through patient, intentional development. Embracing cultivation means tending to your inner landscape, skills, and relationships with care and dedication over time.",
  },
  {
    value: "Integration",
    description:
      "Bringing together all aspects of yourself into wholeness. Living integration means bridging the gaps between knowledge and action, shadow and light, creating coherence in your being.",
  },
  {
    value: "Harmony",
    description:
      "Creating balance and flow between opposing forces. Embracing harmony means finding peace within yourself and your environment, orchestrating life's elements into beautiful alignment.",
  },
];

async function addCoreValues() {
  console.log("🌟 Adding new core values...\n");

  for (const coreValue of newCoreValues) {
    try {
      // First, check if the value already exists in supporting values
      const existingSupportingValue = await db.query.supportingValues.findFirst(
        {
          where: (sv, { eq }) => eq(sv.value, coreValue.value),
        }
      );

      let supportingValueId: string;

      if (existingSupportingValue) {
        console.log(`✓ Supporting value "${coreValue.value}" already exists`);
        supportingValueId = existingSupportingValue.id;
      } else {
        // Create supporting value first
        const newSupportingValue = await db
          .insert(supportingValues)
          .values({
            id: crypto.randomUUID(),
            value: coreValue.value,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        supportingValueId = newSupportingValue[0]!.id;
        console.log(`✓ Created supporting value "${coreValue.value}"`);
      }

      // Check if core value already exists
      const existingCoreValue = await db.query.coreValues.findFirst({
        where: (cv, { eq }) => eq(cv.value, coreValue.value),
      });

      if (existingCoreValue) {
        console.log(
          `⚠ Core value "${coreValue.value}" already exists, skipping\n`
        );
        continue;
      }

      // Create core value
      await db.insert(coreValues).values({
        id: crypto.randomUUID(),
        value: coreValue.value,
        description: coreValue.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✓ Created core value "${coreValue.value}"`);
      console.log(`  Description: ${coreValue.description}\n`);
    } catch (error) {
      console.error(`❌ Error adding "${coreValue.value}":`, error);
    }
  }

  console.log("✨ Done! Core values have been added.");
}

// Run the script
addCoreValues()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
