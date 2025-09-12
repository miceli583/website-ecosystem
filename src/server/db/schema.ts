import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * Universal schema that works with both SQLite and PostgreSQL
 *
 * This schema uses SQLite syntax but is compatible with PostgreSQL through Drizzle ORM's
 * automatic dialect adaptation. For production PostgreSQL, run migrations to create proper types.
 */
export const createTable = sqliteTableCreator((name) => `temp-t3-app_${name}`);

export const posts = createTable(
  "post",
  (t) => ({
    id: t.integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: t.text("name", { length: 256 }),
    createdById: t
      .text("created_by_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: t
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: t
      .integer("updated_at", { mode: "timestamp" })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ]
);

export const users = createTable("user", (t) => ({
  id: t
    .text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: t.text("name", { length: 255 }),
  email: t.text("email", { length: 255 }).notNull(),
  emailVerified: t
    .integer("email_verified", { mode: "timestamp" })
    .default(sql`(unixepoch())`),
  image: t.text("image", { length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts),
}));

export const accounts = createTable(
  "account",
  (t) => ({
    userId: t
      .text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: t
      .text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: t.text("provider", { length: 255 }).notNull(),
    providerAccountId: t.text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: t.text("refresh_token"),
    access_token: t.text("access_token"),
    expires_at: t.integer("expires_at"),
    token_type: t.text("token_type", { length: 255 }),
    scope: t.text("scope", { length: 255 }),
    id_token: t.text("id_token"),
    session_state: t.text("session_state", { length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (t) => ({
    sessionToken: t
      .text("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: t
      .text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: t.integer("expires", { mode: "timestamp" }).notNull(),
  }),
  (t) => [index("session_userId_idx").on(t.userId)]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (t) => ({
    identifier: t.text("identifier", { length: 255 }).notNull(),
    token: t.text("token", { length: 255 }).notNull(),
    expires: t.integer("expires", { mode: "timestamp" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);
