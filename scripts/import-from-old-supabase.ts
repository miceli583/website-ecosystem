// @ts-nocheck
/**
 * Import Data from Old Supabase
 * Pulls live data from old miracle-mind-tooling Supabase and imports to new Supabase
 */

// Load environment variables
import { config } from "dotenv";
config();

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { db as newDb } from "../src/server/db";
import {
  coreValues,
  supportingValues,
  authors,
  quotes,
  coreValueSupportingValues,
  coreValueQuotes,
  quotePosts,
} from "../src/server/db/schema";

// Old Supabase connection
const OLD_DATABASE_URL =
  "postgresql://postgres:acim_mind_0101@db.wugmzxbetiddzqcqguus.supabase.co:5432/postgres";

async function importFromOldSupabase() {
  console.log("🚀 Starting data import from old Supabase...\n");

  // Connect to old database
  const oldConnection = postgres(OLD_DATABASE_URL);
  const oldDb = drizzle(oldConnection);

  try {
    // Query data from old database
    console.log("📖 Fetching data from old Supabase...");

    // Note: Old database uses different table names (no prefix)
    // We'll query using raw SQL to handle different schemas

    // Core Values
    console.log("📥 Importing Core Values...");
    const oldCoreValues = await oldConnection`
      SELECT * FROM core_values ORDER BY created_at
    `;
    if (oldCoreValues.length > 0) {
      await newDb.insert(coreValues).values(
        oldCoreValues.map((item: any) => ({
          id: item.id,
          value: item.value,
          description: item.description,
          isActive: item.is_active,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      );
      console.log(`✅ Imported ${oldCoreValues.length} core values\n`);
    }

    // Supporting Values
    console.log("📥 Importing Supporting Values...");
    const oldSupportingValues = await oldConnection`
      SELECT * FROM supporting_values ORDER BY created_at
    `;
    if (oldSupportingValues.length > 0) {
      await newDb.insert(supportingValues).values(
        oldSupportingValues.map((item: any) => ({
          id: item.id,
          value: item.value,
          description: item.description,
          isActive: item.is_active,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      );
      console.log(
        `✅ Imported ${oldSupportingValues.length} supporting values\n`
      );
    }

    // Authors
    console.log("📥 Importing Authors...");
    const oldAuthors = await oldConnection`
      SELECT * FROM authors ORDER BY created_at
    `;
    if (oldAuthors.length > 0) {
      await newDb.insert(authors).values(
        oldAuthors.map((item: any) => ({
          id: item.id,
          name: item.name,
          isActive: item.is_active,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      );
      console.log(`✅ Imported ${oldAuthors.length} authors\n`);
    }

    // Quotes
    console.log("📥 Importing Quotes...");
    const oldQuotes = await oldConnection`
      SELECT * FROM quotes ORDER BY created_at
    `;
    if (oldQuotes.length > 0) {
      await newDb.insert(quotes).values(
        oldQuotes.map((item: any) => ({
          id: item.id,
          text: item.text,
          authorId: item.author_id,
          source: item.source,
          category: item.category,
          tags: item.tags,
          isActive: item.is_active,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      );
      console.log(`✅ Imported ${oldQuotes.length} quotes\n`);
    }

    // Core Value <-> Supporting Value Relationships
    console.log("📥 Importing Core Value - Supporting Value Relationships...");
    const oldCVSV = await oldConnection`
      SELECT * FROM core_value_supporting_values ORDER BY created_at
    `;
    if (oldCVSV.length > 0) {
      await newDb.insert(coreValueSupportingValues).values(
        oldCVSV.map((item: any) => ({
          id: item.id,
          coreValueId: item.core_value_id,
          supportingValueId: item.supporting_value_id,
          createdAt: item.created_at,
        }))
      );
      console.log(`✅ Imported ${oldCVSV.length} relationships\n`);
    }

    // Core Value <-> Quote Relationships
    console.log("📥 Importing Core Value - Quote Relationships...");
    const oldCVQ = await oldConnection`
      SELECT * FROM core_value_quotes ORDER BY created_at
    `;
    if (oldCVQ.length > 0) {
      await newDb.insert(coreValueQuotes).values(
        oldCVQ.map((item: any) => ({
          id: item.id,
          coreValueId: item.core_value_id,
          quoteId: item.quote_id,
          createdAt: item.created_at,
        }))
      );
      console.log(`✅ Imported ${oldCVQ.length} relationships\n`);
    }

    // Quote Posts
    console.log("📥 Importing Quote Posts...");
    const oldQuotePosts = await oldConnection`
      SELECT * FROM quote_posts ORDER BY created_at
    `;
    if (oldQuotePosts.length > 0) {
      await newDb.insert(quotePosts).values(
        oldQuotePosts.map((item: any) => ({
          id: item.id,
          coreValueId: item.core_value_id,
          supportingValueId: item.supporting_value_id,
          quoteId: item.quote_id,
          isPublished: item.is_published,
          publishedAt: item.published_at,
          scheduledFor: item.scheduled_for,
          metaPostId: item.meta_post_id,
          imageUrl: item.image_url,
          caption: null, // Old schema might not have this
          queuePosition: null, // Old schema might not have this
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      );
      console.log(`✅ Imported ${oldQuotePosts.length} quote posts\n`);
    }

    console.log("🎉 Data import completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Core Values: ${oldCoreValues.length}`);
    console.log(`   - Supporting Values: ${oldSupportingValues.length}`);
    console.log(`   - Authors: ${oldAuthors.length}`);
    console.log(`   - Quotes: ${oldQuotes.length}`);
    console.log(`   - CV-SV Relationships: ${oldCVSV.length}`);
    console.log(`   - CV-Quote Relationships: ${oldCVQ.length}`);
    console.log(`   - Quote Posts: ${oldQuotePosts.length}\n`);

    await oldConnection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    await oldConnection.end();
    process.exit(1);
  }
}

// Run the import
importFromOldSupabase();
