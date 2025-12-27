// @ts-nocheck
/**
 * Script to view all quotes in the database
 * Run with: DATABASE_URL="..." SKIP_ENV_VALIDATION=1 npx tsx scripts/view-all-quotes.ts
 */

import { db } from "~/server/db";

async function viewAllQuotes() {
  console.log("📚 Current Quotes Database:\n");

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

  if (quotes.length === 0) {
    console.log("No quotes found.");
    return;
  }

  quotes.forEach((quote, index) => {
    console.log(`${index + 1}. "${quote.text}"`);
    console.log(`   Author: ${quote.author?.name ?? "Unknown"}`);
    if (quote.source) console.log(`   Source: ${quote.source}`);
    if (quote.category) console.log(`   Category: ${quote.category}`);
    if (quote.tags && quote.tags.length > 0) {
      console.log(`   Tags: ${quote.tags.join(", ")}`);
    }
    if (quote.coreValueRelations.length > 0) {
      const values = quote.coreValueRelations
        .map((rel) => rel.coreValue.value)
        .join(", ");
      console.log(`   Core Values: ${values}`);
    }
    console.log();
  });

  console.log(`Total: ${quotes.length} quotes`);

  // Show author summary
  const authors = await db.query.authors.findMany({
    orderBy: (a, { asc }) => [asc(a.name)],
  });

  console.log(`\n📝 Authors (${authors.length} total):`);
  authors.forEach((author) => {
    console.log(`   • ${author.name}`);
  });
}

viewAllQuotes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
