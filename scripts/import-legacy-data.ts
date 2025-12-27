// @ts-nocheck
/**
 * Import Legacy Data Script
 * Imports data from the old miracle-mind-tooling project into the new database
 */

// Load environment variables first
import { config } from "dotenv";
config();

import { readFileSync } from "fs";
import { join } from "path";
import { db } from "../src/server/db";
import {
  coreValues,
  supportingValues,
  authors,
  quotes,
  coreValueSupportingValues,
  coreValueQuotes,
  quotePosts,
} from "../src/server/db/schema";

// Path to the old project's data file
const OLD_PROJECT_PATH =
  "/Volumes/LIVE/Projects/MiracleMind/Dev/Projects/miracle-mind-tooling";
const DATA_FILE = join(OLD_PROJECT_PATH, "data/database-relational.json");

async function importData() {
  console.log("🚀 Starting data import...\n");

  try {
    // Read the JSON file
    console.log("📖 Reading legacy data file...");
    const jsonData = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
    console.log("✅ Data file loaded successfully\n");

    // Import Core Values
    console.log("📥 Importing Core Values...");
    if (jsonData.coreValues && jsonData.coreValues.length > 0) {
      await db.insert(coreValues).values(
        jsonData.coreValues.map((item: any) => ({
          id: item.id,
          value: item.value,
          description: item.description,
          isActive: item.isActive,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
      );
      console.log(`✅ Imported ${jsonData.coreValues.length} core values\n`);
    }

    // Import Supporting Values
    console.log("📥 Importing Supporting Values...");
    if (jsonData.supportingValues && jsonData.supportingValues.length > 0) {
      await db.insert(supportingValues).values(
        jsonData.supportingValues.map((item: any) => ({
          id: item.id,
          value: item.value,
          description: item.description,
          isActive: item.isActive,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
      );
      console.log(
        `✅ Imported ${jsonData.supportingValues.length} supporting values\n`
      );
    }

    // Import Authors
    console.log("📥 Importing Authors...");
    if (jsonData.authors && jsonData.authors.length > 0) {
      await db.insert(authors).values(
        jsonData.authors.map((item: any) => ({
          id: item.id,
          name: item.name,
          isActive: item.isActive,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
      );
      console.log(`✅ Imported ${jsonData.authors.length} authors\n`);
    }

    // Import Quotes
    console.log("📥 Importing Quotes...");
    if (jsonData.quotes && jsonData.quotes.length > 0) {
      await db.insert(quotes).values(
        jsonData.quotes.map((item: any) => ({
          id: item.id,
          text: item.text,
          authorId: item.authorId,
          source: item.source,
          category: item.category,
          tags: item.tags,
          isActive: item.isActive,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
      );
      console.log(`✅ Imported ${jsonData.quotes.length} quotes\n`);
    }

    // Import Core Value <-> Supporting Value Relationships
    console.log("📥 Importing Core Value - Supporting Value Relationships...");
    if (
      jsonData.coreValueSupportingValues &&
      jsonData.coreValueSupportingValues.length > 0
    ) {
      await db.insert(coreValueSupportingValues).values(
        jsonData.coreValueSupportingValues.map((item: any) => ({
          id: item.id,
          coreValueId: item.coreValueId,
          supportingValueId: item.supportingValueId,
          createdAt: new Date(item.createdAt),
        }))
      );
      console.log(
        `✅ Imported ${jsonData.coreValueSupportingValues.length} relationships\n`
      );
    }

    // Import Core Value <-> Quote Relationships
    console.log("📥 Importing Core Value - Quote Relationships...");
    if (jsonData.coreValueQuotes && jsonData.coreValueQuotes.length > 0) {
      await db.insert(coreValueQuotes).values(
        jsonData.coreValueQuotes.map((item: any) => ({
          id: item.id,
          coreValueId: item.coreValueId,
          quoteId: item.quoteId,
          createdAt: new Date(item.createdAt),
        }))
      );
      console.log(
        `✅ Imported ${jsonData.coreValueQuotes.length} relationships\n`
      );
    }

    // Import Quote Posts
    console.log("📥 Importing Quote Posts...");
    if (jsonData.quotePosts && jsonData.quotePosts.length > 0) {
      await db.insert(quotePosts).values(
        jsonData.quotePosts.map((item: any) => ({
          id: item.id,
          coreValueId: item.coreValueId,
          supportingValueId: item.supportingValueId,
          quoteId: item.quoteId,
          isPublished: item.isPublished,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
          scheduledFor: item.scheduledFor ? new Date(item.scheduledFor) : null,
          metaPostId: item.metaPostId,
          imageUrl: item.imageUrl,
          caption: item.caption || null,
          queuePosition: item.queuePosition || null,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
      );
      console.log(`✅ Imported ${jsonData.quotePosts.length} quote posts\n`);
    }

    console.log("🎉 Data import completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Core Values: ${jsonData.coreValues?.length || 0}`);
    console.log(
      `   - Supporting Values: ${jsonData.supportingValues?.length || 0}`
    );
    console.log(`   - Authors: ${jsonData.authors?.length || 0}`);
    console.log(`   - Quotes: ${jsonData.quotes?.length || 0}`);
    console.log(
      `   - Relationships: ${(jsonData.coreValueSupportingValues?.length || 0) + (jsonData.coreValueQuotes?.length || 0)}`
    );
    console.log(`   - Quote Posts: ${jsonData.quotePosts?.length || 0}\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
}

// Run the import
importData();
