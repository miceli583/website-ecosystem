// @ts-nocheck
/**
 * Script to analyze and suggest improved quote-to-core-value relationships
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/analyze-quote-relationships.ts
 */

import { db } from "~/server/db";

// Map of core values with keywords/themes to help identify relationships
const coreValueThemes = {
  Contribution: [
    "service",
    "impact",
    "giving",
    "help",
    "others",
    "world",
    "share",
    "extend",
    "healing",
    "love others",
  ],
  Freedom: [
    "choice",
    "liberty",
    "autonomy",
    "decide",
    "control",
    "path",
    "destiny",
    "free",
    "liberation",
  ],
  Growth: [
    "learn",
    "evolve",
    "develop",
    "transform",
    "journey",
    "progress",
    "expand",
    "potential",
    "challenge",
  ],
  Authenticity: [
    "true self",
    "genuine",
    "honest",
    "integrity",
    "real",
    "express",
    "being",
    "nature",
  ],
  Balance: [
    "equilibrium",
    "harmony between",
    "give and receive",
    "rest",
    "rhythm",
    "sustainable",
    "middle",
  ],
  Sovereignty: [
    "authority",
    "power",
    "governance",
    "responsibility",
    "choice",
    "attention",
    "decide",
    "design",
    "yes and no",
  ],
  Cultivation: [
    "nurture",
    "tend",
    "plant",
    "grow",
    "patience",
    "develop over time",
    "practice",
    "discipline",
  ],
  Integration: [
    "wholeness",
    "coherence",
    "together",
    "unconscious conscious",
    "shadow",
    "unite",
    "merge",
  ],
  Harmony: [
    "peace",
    "flow",
    "alignment",
    "balance within",
    "calm",
    "stillness",
    "unity",
    "oneness",
  ],
};

interface QuoteAnalysis {
  id: string;
  text: string;
  author: string;
  currentValues: string[];
  suggestedValues: string[];
  reasoning: string;
}

async function analyzeQuotes() {
  console.log("🔍 Analyzing quote-to-core-value relationships...\n");

  const quotes = await db.query.quotes.findMany({
    with: {
      author: true,
      coreValueRelations: {
        with: {
          coreValue: true,
        },
      },
    },
    orderBy: (q, { asc }) => [asc(q.createdAt)],
  });

  const allCoreValues = await db.query.coreValues.findMany();
  const suggestions: QuoteAnalysis[] = [];

  for (const quote of quotes) {
    const currentValues = quote.coreValueRelations.map(
      (rel) => rel.coreValue.value
    );
    const suggestedValues: string[] = [];
    const reasons: string[] = [];

    const lowerText = quote.text.toLowerCase();

    // Analyze for each core value
    for (const cv of allCoreValues) {
      const alreadyHas = currentValues.includes(cv.value);

      // Skip if already has this value
      if (alreadyHas) continue;

      let shouldAdd = false;
      let reason = "";

      // Check based on content and themes
      switch (cv.value) {
        case "Sovereignty":
          if (
            lowerText.includes("choice") ||
            lowerText.includes("decide") ||
            lowerText.includes("power over") ||
            lowerText.includes("responsibility") ||
            lowerText.includes("authority") ||
            lowerText.includes("yes and no") ||
            lowerText.includes("control") ||
            lowerText.includes("govern")
          ) {
            shouldAdd = true;
            reason = "Related to personal choice/authority/responsibility";
          }
          break;

        case "Cultivation":
          if (
            lowerText.includes("plant") ||
            lowerText.includes("nurture") ||
            lowerText.includes("tend") ||
            lowerText.includes("practice") ||
            lowerText.includes("discipline") ||
            lowerText.includes("routine") ||
            lowerText.includes("habit") ||
            lowerText.includes("patience") ||
            lowerText.includes("over time")
          ) {
            shouldAdd = true;
            reason = "Related to patient development/practice/habits";
          }
          break;

        case "Integration":
          if (
            lowerText.includes("wholeness") ||
            lowerText.includes("unconscious") ||
            lowerText.includes("shadow") ||
            lowerText.includes("coherence") ||
            lowerText.includes("together") ||
            lowerText.includes("unite") ||
            lowerText.includes("merge") ||
            lowerText.includes("wounds") ||
            lowerText.includes("heal")
          ) {
            shouldAdd = true;
            reason = "Related to wholeness/shadow work/integration";
          }
          break;

        case "Harmony":
          if (
            lowerText.includes("peace") ||
            lowerText.includes("stillness") ||
            lowerText.includes("quiet") ||
            lowerText.includes("calm") ||
            lowerText.includes("flow") ||
            lowerText.includes("alignment") ||
            lowerText.includes("unity") ||
            lowerText.includes("oneness") ||
            lowerText.includes("within")
          ) {
            shouldAdd = true;
            reason = "Related to inner peace/flow/harmony";
          }
          break;

        case "Contribution":
          if (
            (lowerText.includes("others") ||
              lowerText.includes("world") ||
              lowerText.includes("giving") ||
              lowerText.includes("service") ||
              lowerText.includes("extend") ||
              lowerText.includes("share") ||
              lowerText.includes("impact") ||
              lowerText.includes("help")) &&
            !lowerText.includes("yourself")
          ) {
            shouldAdd = true;
            reason = "Related to service/impact on others";
          }
          break;

        case "Freedom":
          if (
            lowerText.includes("freedom") ||
            lowerText.includes("liberat") ||
            lowerText.includes("free") ||
            lowerText.includes("path may lead")
          ) {
            shouldAdd = true;
            reason = "Explicitly about freedom/liberation";
          }
          break;

        case "Growth":
          if (
            lowerText.includes("grow") ||
            lowerText.includes("evolve") ||
            lowerText.includes("transform") ||
            lowerText.includes("learn") ||
            lowerText.includes("journey") ||
            lowerText.includes("progress") ||
            lowerText.includes("expand")
          ) {
            shouldAdd = true;
            reason = "Related to growth/evolution/transformation";
          }
          break;

        case "Authenticity":
          if (
            lowerText.includes("true self") ||
            lowerText.includes("authentic") ||
            lowerText.includes("genuine") ||
            lowerText.includes("being who you are") ||
            lowerText.includes("yourself")
          ) {
            shouldAdd = true;
            reason = "Related to authenticity/true self";
          }
          break;

        case "Balance":
          if (
            lowerText.includes("balance") ||
            lowerText.includes("equilibrium") ||
            (lowerText.includes("give") && lowerText.includes("receive"))
          ) {
            shouldAdd = true;
            reason = "Related to balance/equilibrium";
          }
          break;
      }

      if (shouldAdd) {
        suggestedValues.push(cv.value);
        reasons.push(reason);
      }
    }

    if (suggestedValues.length > 0) {
      suggestions.push({
        id: quote.id,
        text: quote.text,
        author: quote.author?.name ?? "Unknown",
        currentValues,
        suggestedValues,
        reasoning: reasons.join("; "),
      });
    }
  }

  // Display results
  console.log(
    `📊 Found ${suggestions.length} quotes with suggested improvements:\n`
  );

  suggestions.forEach((s, index) => {
    console.log(`${index + 1}. "${s.text.substring(0, 70)}..."`);
    console.log(`   Author: ${s.author}`);
    console.log(`   Current: ${s.currentValues.join(", ") || "None"}`);
    console.log(`   Suggested to add: ${s.suggestedValues.join(", ")}`);
    console.log(`   Why: ${s.reasoning}`);
    console.log();
  });

  console.log(`\n💡 Summary:`);
  console.log(
    `   ${suggestions.length} quotes could benefit from additional core value associations`
  );
  console.log(
    `\nNext step: Review these suggestions and run the update script if approved.`
  );

  return suggestions;
}

analyzeQuotes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
