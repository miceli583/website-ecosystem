import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique, serial, boolean } from "drizzle-orm/pg-core";

// ============================================================================
// DAILY VALUE POST AUTOMATION TABLES
// ============================================================================

/**
 * Supporting Values - Database of all possible values
 * Core Values are a subset of these values
 */
export const supportingValues = pgTable("supporting_values", {
  id: text("id").primaryKey(),
  value: text("value").notNull().unique(), // Enforces uniqueness
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Core Values - Selected values with rich descriptions for posts
 * Each Core Value must exist in Supporting Values
 */
export const coreValues = pgTable("core_values", {
  id: text("id").primaryKey(),
  value: text("value").notNull().unique(), // Must match a Supporting Value
  description: text("description").notNull(), // Rich description for Instagram posts
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Authors - Quote authors
 */
export const authors = pgTable("authors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Quotes - Inspirational quotes linked to authors
 */
export const quotes = pgTable("quotes", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  authorId: text("author_id").references(() => authors.id),
  source: text("source"),
  category: text("category"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Core Value <-> Quote Relationships
 * Many-to-many relationship between core values and quotes
 */
export const coreValueQuotes = pgTable("core_value_quotes", {
  id: text("id").primaryKey(),
  coreValueId: text("core_value_id")
    .notNull()
    .references(() => coreValues.id, { onDelete: "cascade" }),
  quoteId: text("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Quote Posts - Generated posts for automation
 * Combines core value + quote into a post
 */
export const quotePosts = pgTable("quote_posts", {
  id: text("id").primaryKey(),
  coreValueId: text("core_value_id")
    .notNull()
    .references(() => coreValues.id, { onDelete: "cascade" }),
  quoteId: text("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  isPublished: text("is_published").notNull().default("false"), // "false" | "true" | "scheduled"
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  metaPostId: text("meta_post_id"),
  imageUrl: text("image_url"),
  caption: text("caption"),
  queuePosition: text("queue_position"), // For maintaining post queue order
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Pending Posts - Buffer station for scheduled Instagram posts
 * Holds single payload temporarily before sending to Zapier
 * Always uses id='current' as singleton pattern
 */
export const pendingPosts = pgTable("pending_posts", {
  id: text("id").primaryKey(), // Always 'current'
  zapierPayload: text("zapier_payload").notNull(), // JSON stringified
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "sent"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

// ============================================================================
// BANYAN EARLY ACCESS
// ============================================================================

/**
 * Banyan Early Access - Beta signup waitlist
 * Stores early access requests for Banyan LifeOS platform
 */
export const banyanEarlyAccess = pgTable("banyan_early_access", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role"), // Founder/Creator/Developer/Coach/Other
  message: text("message"), // Optional "What brings you to Banyan?"
  contacted: boolean("contacted").notNull().default(false),
  notes: text("notes"), // Admin notes
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================================
// STRIPE CUSTOMERS
// ============================================================================

/**
 * Customers - Stripe customer records
 * Links Stripe customer IDs to emails for payment tracking
 */
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const supportingValuesRelations = relations(
  supportingValues,
  ({ many }) => ({
    // No direct relations - this is just a value pool
  })
);

export const coreValuesRelations = relations(coreValues, ({ many }) => ({
  quoteRelations: many(coreValueQuotes),
  quotePosts: many(quotePosts),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  quotes: many(quotes),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  author: one(authors, {
    fields: [quotes.authorId],
    references: [authors.id],
  }),
  coreValueRelations: many(coreValueQuotes),
  quotePosts: many(quotePosts),
}));

export const coreValueQuotesRelations = relations(
  coreValueQuotes,
  ({ one }) => ({
    coreValue: one(coreValues, {
      fields: [coreValueQuotes.coreValueId],
      references: [coreValues.id],
    }),
    quote: one(quotes, {
      fields: [coreValueQuotes.quoteId],
      references: [quotes.id],
    }),
  })
);

export const quotePostsRelations = relations(quotePosts, ({ one }) => ({
  coreValue: one(coreValues, {
    fields: [quotePosts.coreValueId],
    references: [coreValues.id],
  }),
  quote: one(quotes, {
    fields: [quotePosts.quoteId],
    references: [quotes.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SupportingValue = typeof supportingValues.$inferSelect;
export type NewSupportingValue = typeof supportingValues.$inferInsert;

export type CoreValue = typeof coreValues.$inferSelect;
export type NewCoreValue = typeof coreValues.$inferInsert;

export type Author = typeof authors.$inferSelect;
export type NewAuthor = typeof authors.$inferInsert;

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;

export type CoreValueQuote = typeof coreValueQuotes.$inferSelect;
export type NewCoreValueQuote = typeof coreValueQuotes.$inferInsert;

export type QuotePost = typeof quotePosts.$inferSelect;
export type NewQuotePost = typeof quotePosts.$inferInsert;

export type PendingPost = typeof pendingPosts.$inferSelect;
export type NewPendingPost = typeof pendingPosts.$inferInsert;

export type BanyanEarlyAccess = typeof banyanEarlyAccess.$inferSelect;
export type NewBanyanEarlyAccess = typeof banyanEarlyAccess.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
