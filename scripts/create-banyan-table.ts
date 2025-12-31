import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function createBanyanTable() {
  try {
    console.log("Creating banyan_early_access table...");

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS banyan_early_access (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT,
        message TEXT,
        contacted BOOLEAN NOT NULL DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    console.log("✓ Table created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating table:", error);
    process.exit(1);
  }
}

createBanyanTable();
