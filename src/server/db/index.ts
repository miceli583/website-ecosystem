import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Database client configuration
 *
 * Currently configured for SQLite/LibSQL. For PostgreSQL/Supabase production:
 * 1. Change import to: import { drizzle } from "drizzle-orm/postgres-js";
 * 2. Change import to: import postgres from "postgres";
 * 3. Replace createClient with: postgres(env.DATABASE_URL)
 * 4. Update schema.ts to use pgTableCreator instead of sqliteTableCreator
 * 5. Update drizzle.config.ts dialect to "postgresql"
 */

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof createClient> | undefined;
};

const conn =
  globalForDb.conn ??
  createClient({
    url: env.DATABASE_URL,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
