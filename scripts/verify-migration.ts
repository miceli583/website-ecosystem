// @ts-nocheck
import { config } from "dotenv";
config();

import postgres from "postgres";

const newDb = postgres(process.env.DATABASE_URL!);

async function verifyMigration() {
  console.log("🔍 Verifying migration in new Supabase...\n");

  try {
    // Check each table
    const coreValues = await newDb`SELECT COUNT(*) as count FROM core_values`;
    console.log(`✅ Core Values: ${coreValues[0].count}`);

    const supportingValues =
      await newDb`SELECT COUNT(*) as count FROM supporting_values`;
    console.log(`✅ Supporting Values: ${supportingValues[0].count}`);

    const authors = await newDb`SELECT COUNT(*) as count FROM authors`;
    console.log(`✅ Authors: ${authors[0].count}`);

    const quotes = await newDb`SELECT COUNT(*) as count FROM quotes`;
    console.log(`✅ Quotes: ${quotes[0].count}`);

    const cvSv =
      await newDb`SELECT COUNT(*) as count FROM core_value_supporting_values`;
    console.log(`✅ CV-SV Relationships: ${cvSv[0].count}`);

    const cvQ = await newDb`SELECT COUNT(*) as count FROM core_value_quotes`;
    console.log(`✅ CV-Quote Relationships: ${cvQ[0].count}`);

    const quotePosts = await newDb`SELECT COUNT(*) as count FROM quote_posts`;
    console.log(`✅ Quote Posts: ${quotePosts[0].count}`);

    console.log("\n🎉 All data verified successfully!");

    // Show sample data
    console.log("\n📋 Sample Core Values:");
    const sampleCoreValues =
      await newDb`SELECT id, value, description FROM core_values LIMIT 5`;
    sampleCoreValues.forEach((cv: any) => {
      console.log(`   - ${cv.value}: ${cv.description}`);
    });

    console.log("\n📋 Sample Quotes:");
    const sampleQuotes = await newDb`
      SELECT q.text, a.name as author
      FROM quotes q
      LEFT JOIN authors a ON q.author_id = a.id
      LIMIT 3
    `;
    sampleQuotes.forEach((q: any) => {
      console.log(
        `   - "${q.text.substring(0, 80)}..." - ${q.author || "Unknown"}`
      );
    });

    await newDb.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Verification failed:", error);
    await newDb.end();
    process.exit(1);
  }
}

verifyMigration();
