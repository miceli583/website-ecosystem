// @ts-nocheck
import { config } from "dotenv";
config();

import postgres from "postgres";

// Verify environment loaded
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment!");
  process.exit(1);
}

console.log("✅ Environment loaded");
console.log(
  `📍 Target DB: ${process.env.DATABASE_URL.replace(/:[^@]+@/, ":***@")}\n`
);

// Old and new database connections
const OLD_DB_URL =
  "postgresql://postgres.wugmzxbetiddzqcqguus:acim_mind_0101@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
const NEW_DB_URL = process.env.DATABASE_URL;

const oldDb = postgres(OLD_DB_URL);
const newDb = postgres(NEW_DB_URL);

async function simpleMigrate() {
  console.log("🚀 Starting simple migration from old to new Supabase...\n");

  try {
    // Core Values
    console.log("📥 Migrating Core Values...");
    const coreValues =
      await oldDb`SELECT * FROM core_values ORDER BY created_at`;
    if (coreValues.length > 0) {
      await newDb`INSERT INTO core_values ${newDb(coreValues)}`;
      console.log(`✅ Migrated ${coreValues.length} core values\n`);
    }

    // Supporting Values
    console.log("📥 Migrating Supporting Values...");
    const supportingValues =
      await oldDb`SELECT * FROM supporting_values ORDER BY created_at`;
    if (supportingValues.length > 0) {
      await newDb`INSERT INTO supporting_values ${newDb(supportingValues)}`;
      console.log(`✅ Migrated ${supportingValues.length} supporting values\n`);
    }

    // Authors
    console.log("📥 Migrating Authors...");
    const authors = await oldDb`SELECT * FROM authors ORDER BY created_at`;
    if (authors.length > 0) {
      await newDb`INSERT INTO authors ${newDb(authors)}`;
      console.log(`✅ Migrated ${authors.length} authors\n`);
    }

    // Quotes
    console.log("📥 Migrating Quotes...");
    const quotes = await oldDb`SELECT * FROM quotes ORDER BY created_at`;
    if (quotes.length > 0) {
      await newDb`INSERT INTO quotes ${newDb(quotes)}`;
      console.log(`✅ Migrated ${quotes.length} quotes\n`);
    }

    // Core Value <-> Supporting Value Relationships
    console.log("📥 Migrating Core Value - Supporting Value Relationships...");
    const cvSv =
      await oldDb`SELECT * FROM core_value_supporting_values ORDER BY created_at`;
    if (cvSv.length > 0) {
      await newDb`INSERT INTO core_value_supporting_values ${newDb(cvSv)}`;
      console.log(`✅ Migrated ${cvSv.length} relationships\n`);
    }

    // Core Value <-> Quote Relationships
    console.log("📥 Migrating Core Value - Quote Relationships...");
    const cvQ =
      await oldDb`SELECT * FROM core_value_quotes ORDER BY created_at`;
    if (cvQ.length > 0) {
      await newDb`INSERT INTO core_value_quotes ${newDb(cvQ)}`;
      console.log(`✅ Migrated ${cvQ.length} relationships\n`);
    }

    // Quote Posts
    console.log("📥 Migrating Quote Posts...");
    const quotePosts =
      await oldDb`SELECT * FROM quote_posts ORDER BY created_at`;
    if (quotePosts.length > 0) {
      await newDb`INSERT INTO quote_posts ${newDb(quotePosts)}`;
      console.log(`✅ Migrated ${quotePosts.length} quote posts\n`);
    }

    console.log("🎉 Migration completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Core Values: ${coreValues.length}`);
    console.log(`   - Supporting Values: ${supportingValues.length}`);
    console.log(`   - Authors: ${authors.length}`);
    console.log(`   - Quotes: ${quotes.length}`);
    console.log(`   - CV-SV Relationships: ${cvSv.length}`);
    console.log(`   - CV-Quote Relationships: ${cvQ.length}`);
    console.log(`   - Quote Posts: ${quotePosts.length}\n`);

    await oldDb.end();
    await newDb.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    await oldDb.end();
    await newDb.end();
    process.exit(1);
  }
}

simpleMigrate();
