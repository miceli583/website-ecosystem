import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique, serial, boolean, uuid, jsonb } from "drizzle-orm/pg-core";

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
 * Links to master_crm for unified contact management
 */
export const banyanEarlyAccess = pgTable("banyan_early_access", {
  id: serial("id").primaryKey(),
  crmId: uuid("crm_id").references(() => masterCrm.id, { onDelete: "set null" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
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
// CLIENT PORTAL / CRM
// ============================================================================

/**
 * Portal Users - Authentication & authorization for client portal
 * Links Supabase auth users to their portal role and client assignment
 */
export const portalUsers = pgTable("portal_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  authUserId: uuid("auth_user_id").unique(), // Supabase auth.users.id - NULL for unclaimed accounts
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("client"), // "admin" | "client"
  clientSlug: text("client_slug"), // NULL for admin, required for clients
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Clients - CRM client records
 */
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  slug: text("slug").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status").notNull().default("active"), // active | inactive
  company: text("company"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Client Projects - Track projects per client
 */
export const clientProjects = pgTable("client_projects", {
  id: serial("id").primaryKey(),
  clientId: serial("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active | completed | paused
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Client Updates - Demos, proposals, invoices, general updates
 */
export const clientUpdates = pgTable("client_updates", {
  id: serial("id").primaryKey(),
  projectId: serial("project_id")
    .notNull()
    .references(() => clientProjects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("update"), // demo | proposal | update | invoice
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Client Resources - Flexible client-specific content
 * Supports: links, embeds, credentials, files, microapps, richtext
 */
export const clientResources = pgTable("client_resources", {
  id: serial("id").primaryKey(),
  clientId: serial("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: serial("project_id").references(() => clientProjects.id, { onDelete: "set null" }),

  // Categorization
  section: text("section").notNull().default("tooling"), // demos, tooling, billing, docs
  type: text("type").notNull().default("link"), // link, embed, credential, file, microapp, richtext

  // Display
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"), // lucide icon name or emoji
  sortOrder: serial("sort_order").default(0),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),

  // Content (use based on type)
  url: text("url"), // for links, embeds, files, microapps
  embedCode: text("embed_code"), // for custom embed HTML
  content: text("content"), // for richtext

  // Flexible metadata for type-specific data
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Client Agreements - Contracts and proposals requiring signature
 */
export const clientAgreements = pgTable("client_agreements", {
  id: serial("id").primaryKey(),
  clientId: serial("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: serial("project_id").references(() => clientProjects.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"), // draft | sent | signed | declined
  signedAt: timestamp("signed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================================
// CONTACT SUBMISSIONS (Legacy - miraclemind.dev contact form)
// ============================================================================

/**
 * Contact Submissions - Public contact form entries (miraclemind.dev)
 * Links to master_crm for unified contact management
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  crmId: uuid("crm_id").references(() => masterCrm.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  services: text("services").array(), // Selected services of interest
  role: text("role"), // Organization type (solo_founder, startup_team, smb, enterprise, agency_consultant)
  stewardshipInterest: boolean("stewardship_interest").default(false), // Interest in stewardship program
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================================
// MASTER CRM
// ============================================================================

/**
 * Master CRM - Central contact database
 * All contact sources (personal site, miracle mind, banyan, etc.) feed into this
 */
export const masterCrm = pgTable("master_crm", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  communicationPreferences: jsonb("communication_preferences").$type<{
    email?: boolean;
    sms?: boolean;
    phone?: boolean;
  }>().default({ email: true }),
  status: text("status").notNull().default("lead"), // lead | prospect | client | inactive | churned
  source: text("source").notNull(), // personal_site | miracle_mind | banyan_waitlist | referral | etc.
  tags: text("tags").array(),
  notes: text("notes"),
  firstContactAt: timestamp("first_contact_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastContactAt: timestamp("last_contact_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Personal Contact Submissions - Contact form entries from matthewmiceli.com
 * Links to master_crm for unified contact management
 */
export const personalContactSubmissions = pgTable("personal_contact_submissions", {
  id: serial("id").primaryKey(),
  crmId: uuid("crm_id")
    .notNull()
    .references(() => masterCrm.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
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

export const portalUsersRelations = relations(portalUsers, ({ one }) => ({
  // Client slug links to clients table
  client: one(clients, {
    fields: [portalUsers.clientSlug],
    references: [clients.slug],
  }),
}));

export const clientsRelations = relations(clients, ({ many, one }) => ({
  projects: many(clientProjects),
  agreements: many(clientAgreements),
  resources: many(clientResources),
  portalUser: one(portalUsers, {
    fields: [clients.slug],
    references: [portalUsers.clientSlug],
  }),
}));

export const clientResourcesRelations = relations(clientResources, ({ one }) => ({
  client: one(clients, {
    fields: [clientResources.clientId],
    references: [clients.id],
  }),
  project: one(clientProjects, {
    fields: [clientResources.projectId],
    references: [clientProjects.id],
  }),
}));

export const clientProjectsRelations = relations(
  clientProjects,
  ({ one, many }) => ({
    client: one(clients, {
      fields: [clientProjects.clientId],
      references: [clients.id],
    }),
    updates: many(clientUpdates),
  })
);

export const clientUpdatesRelations = relations(clientUpdates, ({ one }) => ({
  project: one(clientProjects, {
    fields: [clientUpdates.projectId],
    references: [clientProjects.id],
  }),
}));

export const clientAgreementsRelations = relations(
  clientAgreements,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientAgreements.clientId],
      references: [clients.id],
    }),
    project: one(clientProjects, {
      fields: [clientAgreements.projectId],
      references: [clientProjects.id],
    }),
  })
);

export const masterCrmRelations = relations(masterCrm, ({ many }) => ({
  personalContactSubmissions: many(personalContactSubmissions),
  contactSubmissions: many(contactSubmissions),
  banyanEarlyAccessSignups: many(banyanEarlyAccess),
}));

export const banyanEarlyAccessRelations = relations(
  banyanEarlyAccess,
  ({ one }) => ({
    crmContact: one(masterCrm, {
      fields: [banyanEarlyAccess.crmId],
      references: [masterCrm.id],
    }),
  })
);

export const contactSubmissionsRelations = relations(
  contactSubmissions,
  ({ one }) => ({
    crmContact: one(masterCrm, {
      fields: [contactSubmissions.crmId],
      references: [masterCrm.id],
    }),
  })
);

export const personalContactSubmissionsRelations = relations(
  personalContactSubmissions,
  ({ one }) => ({
    crmContact: one(masterCrm, {
      fields: [personalContactSubmissions.crmId],
      references: [masterCrm.id],
    }),
  })
);

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

export type PortalUser = typeof portalUsers.$inferSelect;
export type NewPortalUser = typeof portalUsers.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type ClientProject = typeof clientProjects.$inferSelect;
export type NewClientProject = typeof clientProjects.$inferInsert;

export type ClientUpdate = typeof clientUpdates.$inferSelect;
export type NewClientUpdate = typeof clientUpdates.$inferInsert;

export type ClientAgreement = typeof clientAgreements.$inferSelect;
export type NewClientAgreement = typeof clientAgreements.$inferInsert;

export type ClientResource = typeof clientResources.$inferSelect;
export type NewClientResource = typeof clientResources.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type MasterCrm = typeof masterCrm.$inferSelect;
export type NewMasterCrm = typeof masterCrm.$inferInsert;

export type PersonalContactSubmission = typeof personalContactSubmissions.$inferSelect;
export type NewPersonalContactSubmission = typeof personalContactSubmissions.$inferInsert;
