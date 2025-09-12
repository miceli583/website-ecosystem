import { sql } from "drizzle-orm";

// For now, we'll use SQLite schema as the base and let PostgreSQL adapt
// In the future, separate schema files can be created if needed
import {
  sqliteTableCreator,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

/**
 * Database schema for website ecosystem
 *
 * Uses SQLite syntax that is compatible with PostgreSQL through Drizzle ORM.
 * For production PostgreSQL, migrations will handle type conversions.
 */
export const createTable = sqliteTableCreator(
  (name) => `website-ecosystem_${name}`
);

// Example table - can be removed when adding real application tables
export const posts = createTable("post", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title", { length: 256 }).notNull(),
  content: text("content"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});
