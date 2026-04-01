import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  unique,
  serial,
  integer,
  boolean,
  uuid,
  jsonb,
  date,
} from "drizzle-orm/pg-core";

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
  crmId: uuid("crm_id").references(() => masterCrm.id, {
    onDelete: "set null",
  }),
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
// FINANCE / EXPENSE TRACKING
// ============================================================================

/**
 * Expense Categories - IRS Schedule C aligned categories
 * Seeded via admin mutation, used for both manual expenses and Mercury tx categorization
 */
export const expenseCategories = pgTable("expense_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  irsCategory: text("irs_category"), // Schedule C line reference
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Expenses - Manual expense entries
 * Amounts stored in cents for consistency with Stripe
 */
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => expenseCategories.id, { onDelete: "restrict" }),
  amount: integer("amount").notNull(), // cents
  vendor: text("vendor").notNull(),
  description: text("description"),
  date: date("date").notNull(),
  type: text("type").notNull().default("expense"), // "expense" | "revenue"
  isTaxDeductible: boolean("is_tax_deductible").notNull().default(false),
  receiptUrl: text("receipt_url"),
  createdByAuthId: uuid("created_by_auth_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Mercury Transaction Categories - Category overlay for Mercury transactions
 * Links Mercury transaction IDs to expense categories for reporting
 */
export const mercuryTransactionCategories = pgTable(
  "mercury_transaction_categories",
  {
    id: serial("id").primaryKey(),
    mercuryTransactionId: text("mercury_transaction_id").notNull().unique(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => expenseCategories.id, { onDelete: "restrict" }),
    isTaxDeductible: boolean("is_tax_deductible").notNull().default(false),
    counterpartyName: text("counterparty_name"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  }
);

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
  phone: text("phone"), // Optional phone number
  role: text("role").notNull().default("client"), // "admin" | "client"
  isCompanyMember: boolean("is_company_member").notNull().default(false),
  companyRoles: text("company_roles").array(), // e.g. ["admin", "account_manager"]
  clientSlug: text("client_slug"), // NULL for admin, required for clients
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Notifications - In-app notifications for admin users
 */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => portalUsers.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // assignment | status_change | client_update | payment_received | proposal_action
  title: text("title").notNull(),
  message: text("message"),
  linkUrl: text("link_url"), // relative URL for deep linking
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Clients - CRM client records
 */
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  crmId: uuid("crm_id").references(() => masterCrm.id, {
    onDelete: "set null",
  }),
  accountManagerId: uuid("account_manager_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  assignedDeveloperId: uuid("assigned_developer_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  connectorId: uuid("connector_id").references(() => portalUsers.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  slug: text("slug").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
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
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active | completed | on-hold | paused
  isArchived: boolean("is_archived").notNull().default(false),
  accountManagerId: uuid("account_manager_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  assignedDeveloperId: uuid("assigned_developer_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Project Tasks - Track tasks per project or standalone
 */
export const projectTasks = pgTable("project_tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("todo"), // todo | in-progress | done
  priority: text("priority").notNull().default("medium"), // low | medium | high | urgent
  projectId: integer("project_id").references(() => clientProjects.id, {
    onDelete: "cascade",
  }),
  clientId: integer("client_id").references(() => clients.id, {
    onDelete: "set null",
  }),
  ownerId: uuid("owner_id").references(() => portalUsers.id, {
    onDelete: "set null",
  }),
  accountManagerId: uuid("account_manager_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  assignedDeveloperId: uuid("assigned_developer_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  dueDate: date("due_date"),
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
  projectId: integer("project_id")
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
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => clientProjects.id, {
    onDelete: "set null",
  }),

  // Categorization
  section: text("section").notNull().default("tooling"), // demos, tooling, billing, docs
  type: text("type").notNull().default("link"), // link, embed, credential, file, microapp, richtext

  // Display
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"), // lucide icon name or emoji
  sortOrder: integer("sort_order").default(0),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  isPrivate: boolean("is_private").default(false), // Hidden from clients entirely
  underDevelopment: boolean("under_development").default(false), // WIP badge for admin

  // Content (use based on type)
  url: text("url"), // for links, embeds, files, microapps
  embedCode: text("embed_code"), // for custom embed HTML
  content: text("content"), // for richtext

  // Subscription linking - if set, resource requires active subscription
  stripeProductId: text("stripe_product_id"), // Stripe product ID for subscription check

  // Flexible metadata for type-specific data
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),

  // Public sharing
  isPublic: boolean("is_public").default(false),
  publicToken: text("public_token").unique(),
  publicSlug: text("public_slug").unique(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Client Agreements - Contracts and proposals requiring signature
 */
export const clientAgreements = pgTable("client_agreements", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => clientProjects.id, {
    onDelete: "set null",
  }),
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

/**
 * Client Notes - Collaborative notes for admin and client
 * Both admin and client can create and edit notes
 */
export const clientNotes = pgTable("client_notes", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => clientProjects.id, {
    onDelete: "set null",
  }),
  createdByAuthId: uuid("created_by_auth_id").notNull(),
  createdByName: text("created_by_name").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  isPinned: boolean("is_pinned").notNull().default(false),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const crmNotes = pgTable("crm_notes", {
  id: serial("id").primaryKey(),
  crmId: uuid("crm_id")
    .notNull()
    .references(() => masterCrm.id, { onDelete: "cascade" }),
  createdByAuthId: uuid("created_by_auth_id").notNull(),
  createdByName: text("created_by_name").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  isPinned: boolean("is_pinned").notNull().default(false),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================================================
// PROPOSAL SYSTEM V2
// ============================================================================

/**
 * Proposal Agreement Templates - Reusable terms/agreements for proposals
 * Admin-editable via UI, attached to proposals by ID reference
 */
export const proposalAgreementTemplates = pgTable(
  "proposal_agreement_templates",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(), // e.g. "Standard SaaS Terms", "Web Dev Agreement"
    content: text("content").notNull(), // Markdown content
    isActive: boolean("is_active").notNull().default(true),
    createdByAuthId: uuid("created_by_auth_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  }
);

/**
 * Proposal Checkouts - Tracks each independent checkout per proposal
 * A single proposal can have multiple checkout groups, each producing
 * a separate checkout (Stripe session or Mercury invoice).
 * Stripe = credit card payments. Mercury = ACH/debit/wire.
 */
export const proposalCheckouts = pgTable("proposal_checkouts", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id")
    .notNull()
    .references(() => clientResources.id, { onDelete: "cascade" }),
  checkoutGroupId: text("checkout_group_id").notNull(), // matches group ID in proposal metadata
  optionId: text("option_id").notNull(), // which option within the group was selected
  paymentMethod: text("payment_method").notNull(), // "stripe_credit" | "mercury_ach" | "mercury_wire"
  status: text("status").notNull().default("pending"), // "pending" | "paid" | "failed" | "canceled"
  amount: integer("amount").notNull(), // cents
  currency: text("currency").notNull().default("usd"),

  // Stripe fields (populated when paymentMethod = "stripe_credit")
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeFeeAmount: integer("stripe_fee_amount"), // Stripe processing fee in cents

  // Mercury fields (populated when paymentMethod starts with "mercury_")
  mercuryInvoiceId: text("mercury_invoice_id"),
  mercuryInvoiceLink: text("mercury_invoice_link"),
  mercuryTransactionId: text("mercury_transaction_id"),

  paidAt: timestamp("paid_at", { withTimezone: true }),
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
 * Form Registry - Metadata for all contact/signup forms
 * Used to dynamically populate form names and URLs in the leads page
 */
export const formRegistry = pgTable("form_registry", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  url: text("url"),
  submissionTable: text("submission_table").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * CRM Activities - Activity log for contacts (calls, emails, meetings, notes)
 */
export const crmActivities = pgTable("crm_activities", {
  id: serial("id").primaryKey(),
  crmId: uuid("crm_id")
    .notNull()
    .references(() => masterCrm.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // call | email | meeting | note | status_change | assignment
  title: text("title").notNull(),
  description: text("description"),
  createdBy: uuid("created_by").references(() => portalUsers.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Contact Submissions - Public contact form entries (miraclemind.dev)
 * Links to master_crm for unified contact management
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  crmId: uuid("crm_id").references(() => masterCrm.id, {
    onDelete: "set null",
  }),
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
  email: text("email").unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  communicationPreferences: jsonb("communication_preferences")
    .$type<{
      email?: boolean;
      sms?: boolean;
      phone?: boolean;
    }>()
    .default({ email: true }),
  status: text("status").notNull().default("lead"), // lead | prospect | client | inactive | churned
  source: text("source").notNull(), // personal_site | miracle_mind | banyan_waitlist | referral | etc.
  company: text("company"),
  referredBy: uuid("referred_by"),
  referredByExternal: text("referred_by_external"),
  accountManagerId: uuid("account_manager_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  connectorId: uuid("connector_id").references(() => portalUsers.id, {
    onDelete: "set null",
  }),
  assignedDeveloperId: uuid("assigned_developer_id").references(
    () => portalUsers.id,
    { onDelete: "set null" }
  ),
  createdBy: text("created_by"),
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
export const personalContactSubmissions = pgTable(
  "personal_contact_submissions",
  {
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
  }
);

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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(portalUsers, {
    fields: [notifications.recipientId],
    references: [portalUsers.id],
  }),
}));

export const portalUsersRelations = relations(portalUsers, ({ one, many }) => ({
  // Client slug links to clients table
  client: one(clients, {
    fields: [portalUsers.clientSlug],
    references: [clients.slug],
    relationName: "clientPortalUser",
  }),
  managedClients: many(clients, { relationName: "clientAccountManager" }),
  developedClients: many(clients, { relationName: "clientAssignedDeveloper" }),
  connectedClients: many(clients, { relationName: "clientConnector" }),
  managedCrmContacts: many(masterCrm, { relationName: "crmAccountManager" }),
  connectedCrmContacts: many(masterCrm, { relationName: "crmConnector" }),
  notifications: many(notifications),
  // Project/task relations
  managedProjects: many(clientProjects, {
    relationName: "projectAccountManager",
  }),
  developedProjects: many(clientProjects, {
    relationName: "projectAssignedDeveloper",
  }),
  ownedTasks: many(projectTasks, { relationName: "taskOwner" }),
  managedTasks: many(projectTasks, { relationName: "taskAccountManager" }),
  developedTasks: many(projectTasks, {
    relationName: "taskAssignedDeveloper",
  }),
}));

export const clientsRelations = relations(clients, ({ many, one }) => ({
  projects: many(clientProjects),
  tasks: many(projectTasks),
  agreements: many(clientAgreements),
  resources: many(clientResources),
  notes: many(clientNotes),
  portalUser: one(portalUsers, {
    fields: [clients.slug],
    references: [portalUsers.clientSlug],
    relationName: "clientPortalUser",
  }),
  crmContact: one(masterCrm, {
    fields: [clients.crmId],
    references: [masterCrm.id],
  }),
  accountManager: one(portalUsers, {
    fields: [clients.accountManagerId],
    references: [portalUsers.id],
    relationName: "clientAccountManager",
  }),
  assignedDeveloper: one(portalUsers, {
    fields: [clients.assignedDeveloperId],
    references: [portalUsers.id],
    relationName: "clientAssignedDeveloper",
  }),
  connector: one(portalUsers, {
    fields: [clients.connectorId],
    references: [portalUsers.id],
    relationName: "clientConnector",
  }),
}));

export const clientResourcesRelations = relations(
  clientResources,
  ({ one, many }) => ({
    client: one(clients, {
      fields: [clientResources.clientId],
      references: [clients.id],
    }),
    project: one(clientProjects, {
      fields: [clientResources.projectId],
      references: [clientProjects.id],
    }),
    checkouts: many(proposalCheckouts),
  })
);

export const clientProjectsRelations = relations(
  clientProjects,
  ({ one, many }) => ({
    client: one(clients, {
      fields: [clientProjects.clientId],
      references: [clients.id],
    }),
    updates: many(clientUpdates),
    tasks: many(projectTasks),
    accountManager: one(portalUsers, {
      fields: [clientProjects.accountManagerId],
      references: [portalUsers.id],
      relationName: "projectAccountManager",
    }),
    assignedDeveloper: one(portalUsers, {
      fields: [clientProjects.assignedDeveloperId],
      references: [portalUsers.id],
      relationName: "projectAssignedDeveloper",
    }),
  })
);

export const projectTasksRelations = relations(projectTasks, ({ one }) => ({
  project: one(clientProjects, {
    fields: [projectTasks.projectId],
    references: [clientProjects.id],
  }),
  client: one(clients, {
    fields: [projectTasks.clientId],
    references: [clients.id],
  }),
  owner: one(portalUsers, {
    fields: [projectTasks.ownerId],
    references: [portalUsers.id],
    relationName: "taskOwner",
  }),
  accountManager: one(portalUsers, {
    fields: [projectTasks.accountManagerId],
    references: [portalUsers.id],
    relationName: "taskAccountManager",
  }),
  assignedDeveloper: one(portalUsers, {
    fields: [projectTasks.assignedDeveloperId],
    references: [portalUsers.id],
    relationName: "taskAssignedDeveloper",
  }),
}));

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

export const clientNotesRelations = relations(clientNotes, ({ one }) => ({
  client: one(clients, {
    fields: [clientNotes.clientId],
    references: [clients.id],
  }),
  project: one(clientProjects, {
    fields: [clientNotes.projectId],
    references: [clientProjects.id],
  }),
}));

export const crmNotesRelations = relations(crmNotes, ({ one }) => ({
  contact: one(masterCrm, {
    fields: [crmNotes.crmId],
    references: [masterCrm.id],
  }),
}));

export const crmActivitiesRelations = relations(crmActivities, ({ one }) => ({
  contact: one(masterCrm, {
    fields: [crmActivities.crmId],
    references: [masterCrm.id],
  }),
  creator: one(portalUsers, {
    fields: [crmActivities.createdBy],
    references: [portalUsers.id],
    relationName: "activityCreator",
  }),
}));

export const masterCrmRelations = relations(masterCrm, ({ many, one }) => ({
  activities: many(crmActivities),
  notes: many(crmNotes),
  personalContactSubmissions: many(personalContactSubmissions),
  contactSubmissions: many(contactSubmissions),
  banyanEarlyAccessSignups: many(banyanEarlyAccess),
  client: one(clients, {
    fields: [masterCrm.id],
    references: [clients.crmId],
  }),
  accountManager: one(portalUsers, {
    fields: [masterCrm.accountManagerId],
    references: [portalUsers.id],
    relationName: "crmAccountManager",
  }),
  connector: one(portalUsers, {
    fields: [masterCrm.connectorId],
    references: [portalUsers.id],
    relationName: "crmConnector",
  }),
  assignedDeveloper: one(portalUsers, {
    fields: [masterCrm.assignedDeveloperId],
    references: [portalUsers.id],
    relationName: "crmAssignedDeveloper",
  }),
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

export const expenseCategoriesRelations = relations(
  expenseCategories,
  ({ many }) => ({
    expenses: many(expenses),
    mercuryTransactionCategories: many(mercuryTransactionCategories),
  })
);

export const expensesRelations = relations(expenses, ({ one }) => ({
  category: one(expenseCategories, {
    fields: [expenses.categoryId],
    references: [expenseCategories.id],
  }),
}));

export const mercuryTransactionCategoriesRelations = relations(
  mercuryTransactionCategories,
  ({ one }) => ({
    category: one(expenseCategories, {
      fields: [mercuryTransactionCategories.categoryId],
      references: [expenseCategories.id],
    }),
  })
);

export const proposalCheckoutsRelations = relations(
  proposalCheckouts,
  ({ one }) => ({
    proposal: one(clientResources, {
      fields: [proposalCheckouts.proposalId],
      references: [clientResources.id],
    }),
  })
);

export const proposalAgreementTemplatesRelations = relations(
  proposalAgreementTemplates,
  () => ({
    // Standalone — linked to proposals via metadata.agreementTemplateIds
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

export type ProjectTask = typeof projectTasks.$inferSelect;
export type NewProjectTask = typeof projectTasks.$inferInsert;

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

export type PersonalContactSubmission =
  typeof personalContactSubmissions.$inferSelect;
export type NewPersonalContactSubmission =
  typeof personalContactSubmissions.$inferInsert;

export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type NewExpenseCategory = typeof expenseCategories.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

export type MercuryTransactionCategory =
  typeof mercuryTransactionCategories.$inferSelect;
export type NewMercuryTransactionCategory =
  typeof mercuryTransactionCategories.$inferInsert;

export type ProposalAgreementTemplate =
  typeof proposalAgreementTemplates.$inferSelect;
export type NewProposalAgreementTemplate =
  typeof proposalAgreementTemplates.$inferInsert;

export type ProposalCheckout = typeof proposalCheckouts.$inferSelect;
export type NewProposalCheckout = typeof proposalCheckouts.$inferInsert;
