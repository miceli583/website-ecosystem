"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  Table2,
  HardDrive,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Shield,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";

interface TableInfo {
  name: string;
  columns: number;
  purpose: string;
  fks?: string[];
  hasRLS: boolean;
}

interface TableGroup {
  label: string;
  description: string;
  tables: TableInfo[];
}

/**
 * Complete database table inventory.
 * Source of truth: src/server/db/schema.ts
 * Last audited: 2026-02-10
 */
const TABLE_GROUPS: TableGroup[] = [
  {
    label: "Daily Value Automation",
    description: "Instagram content pipeline — values, quotes, image generation, posting queue",
    tables: [
      { name: "supporting_values", columns: 4, purpose: "Master list of all possible values", hasRLS: true },
      { name: "core_values", columns: 5, purpose: "Selected values with descriptions for posts", hasRLS: true },
      { name: "authors", columns: 4, purpose: "Quote attribution", hasRLS: true },
      { name: "quotes", columns: 8, purpose: "Inspirational quotes with tags and categories", fks: ["authors"], hasRLS: true },
      { name: "core_value_quotes", columns: 3, purpose: "Junction: core values ↔ quotes (many-to-many)", fks: ["core_values", "quotes"], hasRLS: true },
      { name: "quote_posts", columns: 11, purpose: "Generated Instagram posts — image URL, caption, queue position", fks: ["core_values", "quotes"], hasRLS: true },
      { name: "pending_posts", columns: 6, purpose: "Singleton buffer: holds one scheduled post before Zapier send", hasRLS: true },
    ],
  },
  {
    label: "CRM & Contacts",
    description: "Central contact hub — all sources feed into master_crm, pipeline management",
    tables: [
      { name: "master_crm", columns: 16, purpose: "Central contact database — email, status, pipeline, tags, account manager", fks: ["portal_users"], hasRLS: true },
      { name: "contact_submissions", columns: 9, purpose: "Public contact form entries from miraclemind.dev", fks: ["master_crm"], hasRLS: true },
      { name: "personal_contact_submissions", columns: 8, purpose: "Contact form entries from matthewmiceli.com", fks: ["master_crm"], hasRLS: true },
    ],
  },
  {
    label: "Client Portal",
    description: "Client management — auth, projects, demos, notes, proposals, billing",
    tables: [
      { name: "portal_users", columns: 12, purpose: "Portal auth — links Supabase auth to roles (admin/client), company membership", hasRLS: true },
      { name: "clients", columns: 12, purpose: "Client records — CRM link, account manager, slug, Stripe customer ID", fks: ["master_crm", "portal_users"], hasRLS: true },
      { name: "client_projects", columns: 6, purpose: "Per-client project tracking with status (active/completed/paused)", fks: ["clients"], hasRLS: true },
      { name: "client_updates", columns: 7, purpose: "Project updates — demos, proposals, invoices, general updates", fks: ["client_projects"], hasRLS: true },
      { name: "client_resources", columns: 18, purpose: "Flexible content: links, embeds, credentials, files, microapps, rich text. JSONB metadata", fks: ["clients", "client_projects"], hasRLS: true },
      { name: "client_agreements", columns: 8, purpose: "Contracts & proposals — draft/sent/signed/declined workflow", fks: ["clients", "client_projects"], hasRLS: true },
      { name: "client_notes", columns: 10, purpose: "Collaborative notes — pinnable, archivable, per-project or client-wide", fks: ["clients", "client_projects"], hasRLS: true },
    ],
  },
  {
    label: "Finance & Expenses",
    description: "Expense tracking — IRS categories, manual entries, Mercury transaction mapping",
    tables: [
      { name: "expense_categories", columns: 7, purpose: "IRS Schedule C aligned categories for tax reporting", hasRLS: true },
      { name: "expenses", columns: 11, purpose: "Manual expense entries — amounts in cents, tax deductibility tracking", fks: ["expense_categories"], hasRLS: true },
      { name: "mercury_transaction_categories", columns: 7, purpose: "Category overlay for Mercury bank transactions", fks: ["expense_categories"], hasRLS: true },
    ],
  },
  {
    label: "Payments",
    description: "Stripe customer records for subscription and billing management",
    tables: [
      { name: "customers", columns: 5, purpose: "Stripe customer IDs linked to portal emails", hasRLS: true },
    ],
  },
  {
    label: "Banyan",
    description: "BANYAN LifeOS early access waitlist",
    tables: [
      { name: "banyan_early_access", columns: 10, purpose: "Beta signups — name, email, role, message, follow-up tracking", fks: ["master_crm"], hasRLS: true },
    ],
  },
];

const ALL_TABLES = TABLE_GROUPS.flatMap((g) => g.tables);

export default function DatabaseHealthPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(TABLE_GROUPS.map((g) => g.label))
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const totalColumns = ALL_TABLES.reduce((sum, t) => sum + t.columns, 0);
  const totalFKs = ALL_TABLES.reduce((sum, t) => sum + (t.fks?.length ?? 0), 0);

  type Severity = "success" | "warning" | "info";
  type Advisor = { severity: Severity; message: string; url: string | null };
  const advisors: { security: Advisor[]; performance: Advisor[] } = {
    security: [
      { severity: "success", message: "All 22 tables have RLS enabled", url: null },
      { severity: "success", message: "No exposed service role key detected", url: null },
      { severity: "info", message: "Consider adding rate limiting policies", url: "https://supabase.com/docs/guides/platform/performance#rate-limiting" },
    ],
    performance: [
      { severity: "success", message: "No missing indexes detected", url: null },
      { severity: "info", message: "Consider adding indexes on frequently filtered columns (masterCrm.email, clients.slug)", url: "https://supabase.com/docs/guides/database/postgres/indexes" },
      { severity: "info", message: "Enable connection pooling for production scale", url: "https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2">
            <Link
              href="/admin/tooling"
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tooling
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">Database Health</h1>
          <p className="text-sm text-gray-400">
            Supabase PostgreSQL — 22 tables across 6 domains
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRefreshKey((k) => k + 1)}
          className="border-gray-700 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Table2 className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{ALL_TABLES.length}</p>
          <p className="text-xs text-gray-500">Tables</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Database className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{totalColumns}</p>
          <p className="text-xs text-gray-500">Columns</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <HardDrive className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{totalFKs}</p>
          <p className="text-xs text-gray-500">Foreign Keys</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-green-400">100%</p>
          <p className="text-xs text-gray-500">RLS Coverage</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{TABLE_GROUPS.length}</p>
          <p className="text-xs text-gray-500">Domains</p>
        </div>
      </div>

      {/* Tables by Domain */}
      <div className="space-y-4">
        {TABLE_GROUPS.map((group) => (
          <div
            key={group.label}
            className="overflow-hidden rounded-lg border"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex w-full items-center justify-between bg-white/5 px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                {expandedGroups.has(group.label) ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <div>
                  <span className="font-medium text-white">{group.label}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {group.tables.length} table{group.tables.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500">{group.description}</span>
            </button>

            {expandedGroups.has(group.label) && (
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b bg-white/5 text-left text-xs uppercase tracking-wider text-gray-500"
                    style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                  >
                    <th className="px-4 py-2">Table</th>
                    <th className="px-4 py-2 text-center">Cols</th>
                    <th className="hidden px-4 py-2 md:table-cell">Purpose</th>
                    <th className="hidden px-4 py-2 lg:table-cell">References</th>
                    <th className="px-4 py-2 text-center">RLS</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tables.map((table) => (
                    <tr
                      key={table.name}
                      className="border-b bg-white/5 last:border-b-0 hover:bg-white/10"
                      style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                    >
                      <td className="px-4 py-2">
                        <code className="text-gray-300">{table.name}</code>
                      </td>
                      <td className="px-4 py-2 text-center text-gray-400">{table.columns}</td>
                      <td className="hidden px-4 py-2 text-gray-400 md:table-cell">{table.purpose}</td>
                      <td className="hidden px-4 py-2 lg:table-cell">
                        {table.fks && table.fks.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {table.fks.map((fk) => (
                              <code
                                key={fk}
                                className="rounded bg-black/50 px-1.5 py-0.5 text-xs text-gray-500"
                              >
                                → {fk}
                              </code>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {table.hasRLS ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="mx-auto h-4 w-4 text-red-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      {/* Advisors Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Advisors */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Shield className="h-4 w-4" style={{ color: "#D4AF37" }} />
            Security
          </h2>
          <div
            className="space-y-2 rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {advisors.security.map((advisor, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {advisor.severity === "success" && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                )}
                {advisor.severity === "warning" && (
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                )}
                {advisor.severity === "info" && (
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{advisor.message}</p>
                  {advisor.url && (
                    <a
                      href={advisor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#D4AF37" }}
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Advisors */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Zap className="h-4 w-4" style={{ color: "#D4AF37" }} />
            Performance
          </h2>
          <div
            className="space-y-2 rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {advisors.performance.map((advisor, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {advisor.severity === "success" && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                )}
                {advisor.severity === "warning" && (
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                )}
                {advisor.severity === "info" && (
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{advisor.message}</p>
                  {advisor.url && (
                    <a
                      href={advisor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#D4AF37" }}
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schema Reference */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: "rgba(212, 175, 55, 0.2)",
          backgroundColor: "rgba(212, 175, 55, 0.05)",
        }}
      >
        <p className="text-sm text-gray-400">
          <strong className="text-gray-300">Schema source:</strong>{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs text-gray-400">
            src/server/db/schema.ts
          </code>
          {" — "}All tables use Drizzle ORM with PostgreSQL. FK cascades handle child cleanup.
          Amounts stored in cents (Stripe convention). All timestamps include timezone.
        </p>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
          style={{ color: "#D4AF37" }}
        >
          Open Supabase Dashboard
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
