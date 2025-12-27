// @ts-nocheck
/**
 * Script to add new quotes to the database
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/add-new-quotes.ts
 */

import { db } from "~/server/db";
import { quotes, authors, coreValueQuotes } from "~/server/db/schema";

interface NewQuote {
  text: string;
  author: string;
  coreValues: string[];
  category?: string;
}

const newQuotes: NewQuote[] = [
  // Sovereignty
  {
    text: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung",
    coreValues: ["Sovereignty", "Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "To know what you prefer instead of humbly saying Amen to what the world tells you you ought to prefer, is to have kept your soul alive.",
    author: "Robert Louis Stevenson",
    coreValues: ["Sovereignty", "Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    coreValues: ["Sovereignty", "Freedom"],
    category: "General Wisdom",
  },
  {
    text: "Your capacity to receive is measured by your ability to say Yes. Your power to design is measured by your ability to say No.",
    author: "Unknown",
    coreValues: ["Sovereignty", "Freedom"],
    category: "General Wisdom",
  },
  {
    text: "Yes and No are the 1's and 0's of your reality. How you string them together, moment by moment, writes the code of your life.",
    author: "Unknown",
    coreValues: ["Sovereignty"],
    category: "General Wisdom",
  },

  // Cultivation
  {
    text: "What we plant in the soil of contemplation, we shall reap in the harvest of action.",
    author: "Meister Eckhart",
    coreValues: ["Cultivation", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "The creation of a thousand forests is in one acorn.",
    author: "Ralph Waldo Emerson",
    coreValues: ["Cultivation", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "Do not judge me by my successes, judge me by how many times I fell down and got back up again.",
    author: "Nelson Mandela",
    coreValues: ["Cultivation", "Growth"],
    category: "Courage & Strength",
  },

  // Integration
  {
    text: "The privilege of a lifetime is being who you are.",
    author: "Joseph Campbell",
    coreValues: ["Integration", "Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    author: "Carl Jung",
    coreValues: ["Integration", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.",
    author: "Pierre Teilhard de Chardin",
    coreValues: ["Integration", "Authenticity"],
    category: "General Wisdom",
  },

  // Harmony
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    coreValues: ["Harmony", "Balance"],
    category: "Peace & Presence",
  },
  {
    text: "Everything in the universe is within you. Ask all from yourself.",
    author: "Rumi",
    coreValues: ["Harmony", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "The best fighter is never angry.",
    author: "Lao Tzu",
    coreValues: ["Harmony", "Balance"],
    category: "General Wisdom",
  },

  // General additions
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    coreValues: ["Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    coreValues: ["Growth", "Integration"],
    category: "General Wisdom",
  },
  {
    text: "We can never obtain peace in the outer world until we make peace with ourselves.",
    author: "Dalai Lama",
    coreValues: ["Balance", "Harmony"],
    category: "Peace & Presence",
  },
];

async function addNewQuotes() {
  console.log("📚 Adding new quotes to database...\n");

  let addedCount = 0;
  let skippedCount = 0;

  for (const quote of newQuotes) {
    try {
      // Check if quote already exists
      const existingQuote = await db.query.quotes.findFirst({
        where: (q, { eq }) => eq(q.text, quote.text),
      });

      if (existingQuote) {
        console.log(
          `⚠ Quote already exists: "${quote.text.substring(0, 50)}..."`
        );
        skippedCount++;
        continue;
      }

      // Find or create author
      let author = await db.query.authors.findFirst({
        where: (a, { eq }) => eq(a.name, quote.author),
      });

      if (!author) {
        const newAuthor = await db
          .insert(authors)
          .values({
            id: crypto.randomUUID(),
            name: quote.author,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        author = newAuthor[0]!;
        console.log(`✓ Created new author: ${quote.author}`);
      }

      // Create quote
      const newQuote = await db
        .insert(quotes)
        .values({
          id: crypto.randomUUID(),
          text: quote.text,
          authorId: author.id,
          category: quote.category,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Associate with core values
      for (const valueName of quote.coreValues) {
        const coreValue = await db.query.coreValues.findFirst({
          where: (cv, { eq }) => eq(cv.value, valueName),
        });

        if (coreValue) {
          await db.insert(coreValueQuotes).values({
            id: crypto.randomUUID(),
            coreValueId: coreValue.id,
            quoteId: newQuote[0]!.id,
            createdAt: new Date(),
          });
        }
      }

      console.log(`✓ Added: "${quote.text.substring(0, 60)}..."`);
      console.log(`  Author: ${quote.author}`);
      console.log(`  Core Values: ${quote.coreValues.join(", ")}\n`);
      addedCount++;
    } catch (error) {
      console.error(
        `❌ Error adding quote: "${quote.text.substring(0, 50)}..."`,
        error
      );
    }
  }

  console.log(`\n✨ Complete!`);
  console.log(`   Added: ${addedCount} quotes`);
  console.log(`   Skipped: ${skippedCount} quotes (already existed)`);
  console.log(`\n📊 Your database now has strengthened coverage for:`);
  console.log(`   • Sovereignty - 5 new quotes`);
  console.log(`   • Cultivation - 3 new quotes`);
  console.log(`   • Integration - 3 new quotes`);
  console.log(`   • Harmony - 3 new quotes`);
  console.log(`   • Plus 3 general wisdom quotes`);
}

addNewQuotes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
