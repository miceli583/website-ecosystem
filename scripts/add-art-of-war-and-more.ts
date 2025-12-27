/**
 * Script to add Art of War and additional aligned quotes
 * Automatically skips duplicates
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/add-art-of-war-and-more.ts
 */
// @ts-nocheck

import { db } from "~/server/db";
import { quotes, authors, coreValueQuotes } from "~/server/db/schema";

interface NewQuote {
  text: string;
  author: string;
  coreValues: string[];
  category?: string;
}

const newQuotes: NewQuote[] = [
  // Art of War
  {
    text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
    author: "Sun Tzu",
    coreValues: ["Sovereignty", "Cultivation"],
    category: "General Wisdom",
  },
  {
    text: "The supreme art of war is to subdue the enemy without fighting.",
    author: "Sun Tzu",
    coreValues: ["Sovereignty", "Harmony"],
    category: "General Wisdom",
  },
  {
    text: "In the midst of chaos, there is also opportunity.",
    author: "Sun Tzu",
    coreValues: ["Growth", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "He will win who knows when to fight and when not to fight.",
    author: "Sun Tzu",
    coreValues: ["Balance", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "The wise warrior avoids the battle.",
    author: "Sun Tzu",
    coreValues: ["Balance", "Harmony"],
    category: "Peace & Presence",
  },
  {
    text: "The greatest victory is that which requires no battle.",
    author: "Sun Tzu",
    coreValues: ["Harmony", "Balance"],
    category: "Peace & Presence",
  },
  {
    text: "Opportunities multiply as they are seized.",
    author: "Sun Tzu",
    coreValues: ["Growth", "Sovereignty"],
    category: "Growth & Transformation",
  },
  {
    text: "If you know the enemy and know yourself, you need not fear the result of a hundred battles.",
    author: "Sun Tzu",
    coreValues: ["Authenticity", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "Know yourself and you will win all battles.",
    author: "Sun Tzu",
    coreValues: ["Authenticity", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.",
    author: "Sun Tzu",
    coreValues: ["Sovereignty", "Balance"],
    category: "General Wisdom",
  },

  // Sovereignty & Personal Power
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl",
    coreValues: ["Sovereignty", "Freedom"],
    category: "General Wisdom",
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    coreValues: ["Sovereignty", "Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "No one can make you feel inferior without your consent.",
    author: "Eleanor Roosevelt",
    coreValues: ["Sovereignty", "Authenticity"],
    category: "General Wisdom",
  },

  // Cultivation & Practice
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    coreValues: ["Cultivation", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    coreValues: ["Cultivation", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "Drop by drop is the water pot filled.",
    author: "Buddha",
    coreValues: ["Cultivation", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "Little by little, one travels far.",
    author: "J.R.R. Tolkien",
    coreValues: ["Cultivation", "Growth"],
    category: "General Wisdom",
  },

  // Integration & Wholeness
  {
    text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
    author: "Carl Jung",
    coreValues: ["Integration", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "The privilege of a lifetime is being who you are.",
    author: "Joseph Campbell",
    coreValues: ["Integration", "Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "Your visions will become clear only when you can look into your own heart. Who looks outside, dreams; who looks inside, awakes.",
    author: "Carl Jung",
    coreValues: ["Integration", "Authenticity"],
    category: "General Wisdom",
  },

  // Harmony & Presence
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
    coreValues: ["Harmony", "Sovereignty"],
    category: "Peace & Presence",
  },
  {
    text: "Wherever you are, be there totally.",
    author: "Eckhart Tolle",
    coreValues: ["Harmony", "Authenticity"],
    category: "Peace & Presence",
  },
  {
    text: "The quieter you become, the more you can hear.",
    author: "Ram Dass",
    coreValues: ["Harmony", "Cultivation"],
    category: "Peace & Presence",
  },
  {
    text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.",
    author: "Wayne Dyer",
    coreValues: ["Harmony", "Growth"],
    category: "Peace & Presence",
  },

  // Authenticity & Truth
  {
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    coreValues: ["Authenticity", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "The privilege of a lifetime is to become who you truly are.",
    author: "Carl Jung",
    coreValues: ["Authenticity", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    coreValues: ["Authenticity", "Growth"],
    category: "General Wisdom",
  },

  // Growth & Transformation
  {
    text: "What you seek is seeking you.",
    author: "Rumi",
    coreValues: ["Growth", "Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    author: "Alan Watts",
    coreValues: ["Growth", "Harmony"],
    category: "General Wisdom",
  },
  {
    text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    author: "Rumi",
    coreValues: ["Growth", "Authenticity"],
    category: "General Wisdom",
  },

  // Contribution & Service
  {
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
    coreValues: ["Contribution", "Authenticity"],
    category: "General Wisdom",
  },
  {
    text: "We make a living by what we get, but we make a life by what we give.",
    author: "Winston Churchill",
    coreValues: ["Contribution", "Balance"],
    category: "General Wisdom",
  },
  {
    text: "Only a life lived for others is a life worthwhile.",
    author: "Albert Einstein",
    coreValues: ["Contribution"],
    category: "General Wisdom",
  },

  // Balance & Wisdom
  {
    text: "The obstacle is the way.",
    author: "Marcus Aurelius",
    coreValues: ["Growth", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    coreValues: ["Sovereignty", "Growth"],
    category: "General Wisdom",
  },
  {
    text: "The master has failed more times than the beginner has even tried.",
    author: "Stephen McCranie",
    coreValues: ["Cultivation", "Growth"],
    category: "General Wisdom",
  },

  // Freedom & Liberation
  {
    text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
    author: "Jean-Paul Sartre",
    coreValues: ["Freedom", "Sovereignty"],
    category: "General Wisdom",
  },
  {
    text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
    author: "Albert Camus",
    coreValues: ["Freedom", "Authenticity"],
    category: "General Wisdom",
  },
];

async function addQuotes() {
  console.log("📚 Adding Art of War and additional aligned quotes...\n");

  let addedCount = 0;
  let skippedCount = 0;

  for (const quote of newQuotes) {
    try {
      // Check if quote already exists
      const existingQuote = await db.query.quotes.findFirst({
        where: (q, { eq }) => eq(q.text, quote.text),
      });

      if (existingQuote) {
        console.log(`⚠ Already exists: "${quote.text.substring(0, 50)}..."`);
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
        console.log(`  ✓ Created new author: ${quote.author}`);
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
      console.log(
        `  Author: ${quote.author} | Values: ${quote.coreValues.join(", ")}`
      );
      addedCount++;
    } catch (error) {
      console.error(
        `❌ Error adding: "${quote.text.substring(0, 50)}..."`,
        error
      );
    }
  }

  console.log(`\n✨ Complete!`);
  console.log(`   Added: ${addedCount} new quotes`);
  console.log(`   Skipped: ${skippedCount} duplicates`);
  console.log(`\n🎯 Your quote library now includes:`);
  console.log(`   • 10 Sun Tzu quotes (Art of War)`);
  console.log(`   • Powerful quotes on Sovereignty (Viktor Frankl, Sartre)`);
  console.log(`   • Deep wisdom on Cultivation (Aristotle, Buddha, Lao Tzu)`);
  console.log(`   • Integration insights (Carl Jung)`);
  console.log(`   • Presence teachings (Thich Nhat Hanh, Eckhart Tolle)`);
  console.log(`   • And much more!`);
}

addQuotes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
