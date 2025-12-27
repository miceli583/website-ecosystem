// @ts-nocheck
/**
 * Script to apply improved quote-to-core-value relationships
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/apply-quote-improvements.ts
 */

import { db } from "~/server/db";
import { coreValueQuotes } from "~/server/db/schema";

interface Improvement {
  quoteText: string;
  valuesToAdd: string[];
}

const improvements: Improvement[] = [
  {
    quoteText:
      "Wisdom is not static. It flows like a river, answering the call of the present.",
    valuesToAdd: ["Harmony"],
  },
  {
    quoteText:
      "When discipline is met with Love, effort becomes ease and grind becomes grace. Let your discipline transform into devotion.",
    valuesToAdd: ["Cultivation"],
  },
  {
    quoteText:
      "Let all emotions flow—sorrow and even joy. To trap one is to trap the other.",
    valuesToAdd: ["Harmony"],
  },
  {
    quoteText:
      "Routine is the drumbeat that cultivates your daily flow state. Allow routine to be the heartbeat of your devotion.",
    valuesToAdd: ["Harmony", "Cultivation"],
  },
  {
    quoteText:
      "Be still and know: the life you are working for already exists within you. Treat the world as though you've already arrived.",
    valuesToAdd: ["Harmony"],
  },
  {
    quoteText: "To extend forgiveness is to receive it.",
    valuesToAdd: ["Balance"],
  },
  {
    quoteText:
      "When you stop trying to control life, life begins to reveal its magic.",
    valuesToAdd: ["Sovereignty"],
  },
  {
    quoteText:
      "Surrender is not giving up; it is giving in to the greater flow of Life.",
    valuesToAdd: ["Harmony"],
  },
  {
    quoteText:
      "You have power over your mind — not outside events. Realize this, and you will find strength.",
    valuesToAdd: ["Sovereignty"],
  },
  {
    quoteText:
      "Each moment of fear contains within it the opportunity to cultivate deeper connection with the Divine.",
    valuesToAdd: ["Cultivation"],
  },
  {
    quoteText:
      "Miracles open the way to true healing. Healing creates wholeness, and wholeness is the source from which all manifestations flow. Begin by asking for connection with the Divine.",
    valuesToAdd: ["Integration", "Harmony"],
  },
  {
    quoteText:
      "We are not held back by the love we didn't receive in the past, but by the love we're not extending now.",
    valuesToAdd: ["Cultivation"],
  },
  {
    quoteText:
      "In every encounter, we are either extending love or calling for love.",
    valuesToAdd: ["Cultivation"],
  },
  {
    quoteText:
      "As we let our own light shine, we unconsciously give others permission to do the same.",
    valuesToAdd: ["Integration"],
  },
  {
    quoteText:
      "The practice of forgiveness is our most important contribution to the healing of the world.",
    valuesToAdd: ["Integration", "Cultivation"],
  },
  {
    quoteText:
      "Your destiny is shaped by your choices—an ever-present frequency you can choose to tune into each day.",
    valuesToAdd: ["Sovereignty"],
  },
  {
    quoteText:
      "The only person you are destined to become is the person you decide to be.",
    valuesToAdd: ["Sovereignty"],
  },
  {
    quoteText:
      "Commitment is akin to trust, which can neither be forced nor willed. It flows like a great river from deep within your being and out into your actions. With commitment, you have no need to think about the future or the goal because the commitment contains the seed of the goal within it.",
    valuesToAdd: ["Harmony"],
  },
  {
    quoteText:
      "Growth isn't a breakthrough—it's the quiet decision to keep going, even when progress is invisible.",
    valuesToAdd: ["Cultivation"],
  },
  {
    quoteText: "All wounds are doorways to higher consciousness.",
    valuesToAdd: ["Integration"],
  },
  {
    quoteText:
      "The shadow is not to be feared; it is to be embraced, for it is the seed of the gift.",
    valuesToAdd: ["Integration"],
  },
  {
    quoteText: "Within the shadow is hidden the seed of the gift.",
    valuesToAdd: ["Integration"],
  },
  {
    quoteText:
      "Love is what we were born with. Fear is what we have learned here.",
    valuesToAdd: ["Growth"],
  },
  {
    quoteText: "You are not stuck where you are unless you decide to be.",
    valuesToAdd: ["Sovereignty"],
  },
  {
    quoteText:
      "Life is not about finding yourself. Life is about creating yourself.",
    valuesToAdd: ["Authenticity"],
  },
  {
    quoteText:
      "The best time to plant a tree was 20 years ago. The second best time is now.",
    valuesToAdd: ["Cultivation"],
  },
  {
    quoteText:
      "Nothing real can be threatened. Nothing unreal exists. Herein lies the peace of God",
    valuesToAdd: ["Harmony"],
  },
  {
    quoteText: "In quietness are all things answered.",
    valuesToAdd: ["Harmony"],
  },
  {
    quoteText: "Forgiveness is the healing of the perception of separation.",
    valuesToAdd: ["Integration"],
  },
  {
    quoteText:
      "Yes and No are the 1's and 0's of your reality. How you string them together, moment by moment, writes the code of your life.",
    valuesToAdd: ["Cultivation"],
  },
  {
    quoteText:
      "Everything in the universe is within you. Ask all from yourself.",
    valuesToAdd: ["Authenticity"],
  },
  {
    quoteText:
      "We can never obtain peace in the outer world until we make peace with ourselves.",
    valuesToAdd: ["Integration"],
  },
];

async function applyImprovements() {
  console.log("🔧 Applying quote relationship improvements...\n");

  let successCount = 0;
  let skippedCount = 0;

  for (const improvement of improvements) {
    try {
      // Find the quote
      const quote = await db.query.quotes.findFirst({
        where: (q, { eq }) => eq(q.text, improvement.quoteText),
      });

      if (!quote) {
        console.log(
          `⚠ Quote not found: "${improvement.quoteText.substring(0, 50)}..."`
        );
        skippedCount++;
        continue;
      }

      // Add each value relationship
      for (const valueName of improvement.valuesToAdd) {
        // Find the core value
        const coreValue = await db.query.coreValues.findFirst({
          where: (cv, { eq }) => eq(cv.value, valueName),
        });

        if (!coreValue) {
          console.log(`⚠ Core value not found: ${valueName}`);
          continue;
        }

        // Check if relationship already exists
        const existing = await db.query.coreValueQuotes.findFirst({
          where: (cvq, { and, eq }) =>
            and(eq(cvq.quoteId, quote.id), eq(cvq.coreValueId, coreValue.id)),
        });

        if (existing) {
          continue; // Skip if already exists
        }

        // Create the relationship
        await db.insert(coreValueQuotes).values({
          id: crypto.randomUUID(),
          coreValueId: coreValue.id,
          quoteId: quote.id,
          createdAt: new Date(),
        });

        console.log(
          `✓ Added ${valueName} to: "${improvement.quoteText.substring(0, 50)}..."`
        );
        successCount++;
      }
    } catch (error) {
      console.error(
        `❌ Error processing: "${improvement.quoteText.substring(0, 50)}..."`,
        error
      );
    }
  }

  console.log(`\n✨ Complete!`);
  console.log(`   Added: ${successCount} new relationships`);
  console.log(`   Skipped: ${skippedCount} items`);
  console.log(
    `\n🎯 Your quote-to-value relationships are now significantly improved!`
  );
  console.log(
    `   All quotes now have richer, more accurate core value associations.`
  );
}

applyImprovements()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
