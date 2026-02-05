"use client";

import { useState, useMemo } from "react";
import {
  Wrench,
  Database,
  Mail,
  CreditCard,
  Cloud,
  Workflow,
  BarChart3,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
} from "lucide-react";
import { Input } from "~/components/ui/input";

interface ServiceInfo {
  name: string;
  category: "database" | "email" | "payments" | "hosting" | "automation" | "analytics" | "api" | "security";
  purpose: string;
  envVars: string[];
  docsUrl?: string;
  status: "active" | "configured" | "pending";
  notes?: string;
}

const CATEGORY_ICONS: Record<ServiceInfo["category"], React.ReactNode> = {
  database: <Database className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  payments: <CreditCard className="h-4 w-4" />,
  hosting: <Cloud className="h-4 w-4" />,
  automation: <Workflow className="h-4 w-4" />,
  analytics: <BarChart3 className="h-4 w-4" />,
  api: <Wrench className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<ServiceInfo["category"], string> = {
  database: "Database",
  email: "Email",
  payments: "Payments",
  hosting: "Hosting",
  automation: "Automation",
  analytics: "Analytics",
  api: "API Layer",
  security: "Security",
};

const STATUS_BADGES: Record<ServiceInfo["status"], { className: string; icon: React.ReactNode }> = {
  active: {
    className: "bg-green-900/50 text-green-400",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  configured: {
    className: "bg-[#D4AF37]/15 text-[#D4AF37]",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  pending: {
    className: "bg-gray-800 text-gray-400",
    icon: <Clock className="h-3 w-3" />,
  },
};

/**
 * Service inventory for the ecosystem
 */
const SERVICES: ServiceInfo[] = [
  // Database
  {
    name: "Supabase",
    category: "database",
    purpose: "PostgreSQL database, Auth, Storage, Realtime",
    envVars: ["DATABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    docsUrl: "https://supabase.com/docs",
    status: "active",
    notes: "Primary database and auth provider",
  },
  {
    name: "Drizzle ORM",
    category: "database",
    purpose: "Type-safe SQL query builder",
    envVars: [],
    docsUrl: "https://orm.drizzle.team/docs",
    status: "active",
    notes: "Schema at src/server/db/schema.ts",
  },

  // API
  {
    name: "tRPC",
    category: "api",
    purpose: "End-to-end type-safe API layer",
    envVars: [],
    docsUrl: "https://trpc.io/docs",
    status: "active",
    notes: "Routers at src/server/api/routers/",
  },

  // Email
  {
    name: "Resend",
    category: "email",
    purpose: "Transactional email delivery",
    envVars: ["RESEND_API_KEY"],
    docsUrl: "https://resend.com/docs",
    status: "active",
    notes: "Used for BANYAN, portal invites, admin alerts",
  },

  // Payments
  {
    name: "Stripe",
    category: "payments",
    purpose: "Payment processing, subscriptions, invoicing",
    envVars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    docsUrl: "https://stripe.com/docs",
    status: "active",
    notes: "Webhook at /api/stripe/webhook",
  },

  // Hosting
  {
    name: "Vercel",
    category: "hosting",
    purpose: "Deployment, Edge Functions, Analytics",
    envVars: [],
    docsUrl: "https://vercel.com/docs",
    status: "active",
    notes: "Auto-deploys from main branch",
  },

  // Automation
  {
    name: "Make.com",
    category: "automation",
    purpose: "Webhook workflows for Instagram automation",
    envVars: ["MAKE_WEBHOOK_SECRET"],
    docsUrl: "https://www.make.com/en/help",
    status: "active",
    notes: "Triggers daily value posts",
  },

  // Analytics (Planned)
  {
    name: "PostHog",
    category: "analytics",
    purpose: "Product analytics, session replays, feature flags",
    envVars: ["NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST"],
    docsUrl: "https://posthog.com/docs",
    status: "pending",
    notes: "Recommended for portal usage tracking",
  },
  {
    name: "Sentry",
    category: "analytics",
    purpose: "Error tracking, performance monitoring",
    envVars: ["SENTRY_DSN"],
    docsUrl: "https://docs.sentry.io",
    status: "pending",
    notes: "Recommended for production error capture",
  },

  // Security
  {
    name: "Supabase RLS",
    category: "security",
    purpose: "Row-level security policies",
    envVars: [],
    docsUrl: "https://supabase.com/docs/guides/auth/row-level-security",
    status: "active",
    notes: "All tables have RLS enabled",
  },
];

export default function ToolingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ServiceInfo["category"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ServiceInfo["status"] | "all">("all");

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !service.name.toLowerCase().includes(query) &&
          !service.purpose.toLowerCase().includes(query) &&
          !service.envVars.some((v) => v.toLowerCase().includes(query))
        ) {
          return false;
        }
      }
      if (categoryFilter !== "all" && service.category !== categoryFilter) {
        return false;
      }
      if (statusFilter !== "all" && service.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [searchQuery, categoryFilter, statusFilter]);

  // Group by category
  const groupedServices = useMemo(() => {
    const groups = new Map<ServiceInfo["category"], ServiceInfo[]>();
    for (const service of filteredServices) {
      const existing = groups.get(service.category) ?? [];
      existing.push(service);
      groups.set(service.category, existing);
    }
    return Array.from(groups.entries());
  }, [filteredServices]);

  const stats = useMemo(() => ({
    total: SERVICES.length,
    active: SERVICES.filter((s) => s.status === "active").length,
    configured: SERVICES.filter((s) => s.status === "configured").length,
    pending: SERVICES.filter((s) => s.status === "pending").length,
    envVarCount: new Set(SERVICES.flatMap((s) => s.envVars)).size,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Service Inventory</h1>
        <p className="text-sm text-gray-400">
          All tools and services used across the ecosystem
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Services</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-green-400">{stats.active}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>{stats.configured}</p>
          <p className="text-xs text-gray-500">Configured</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-gray-400">{stats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-white">{stats.envVarCount}</p>
          <p className="text-xs text-gray-500">Env Variables</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services or env vars..."
            className="border-gray-700 bg-black/50 pl-10 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ServiceInfo["category"] | "all")}
          className="rounded-md border border-gray-700 bg-black/50 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Categories</option>
          <option value="database">Database</option>
          <option value="api">API Layer</option>
          <option value="email">Email</option>
          <option value="payments">Payments</option>
          <option value="hosting">Hosting</option>
          <option value="automation">Automation</option>
          <option value="analytics">Analytics</option>
          <option value="security">Security</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ServiceInfo["status"] | "all")}
          className="rounded-md border border-gray-700 bg-black/50 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="configured">Configured</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Service List */}
      <div className="space-y-6">
        {groupedServices.map(([category, services]) => (
          <div key={category}>
            <div className="mb-3 flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)", color: "#D4AF37" }}
              >
                {CATEGORY_ICONS[category]}
              </div>
              <h2 className="font-semibold text-white">{CATEGORY_LABELS[category]}</h2>
              <span className="text-sm text-gray-500">{services.length}</span>
            </div>

            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="rounded-lg border bg-white/5 p-4"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{service.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${STATUS_BADGES[service.status].className}`}>
                          {STATUS_BADGES[service.status].icon}
                          {service.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400">{service.purpose}</p>
                      {service.notes && (
                        <p className="mt-1 text-xs text-gray-500">{service.notes}</p>
                      )}
                      {service.envVars.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {service.envVars.map((envVar) => (
                            <code
                              key={envVar}
                              className="rounded bg-black/50 px-1.5 py-0.5 text-xs text-gray-400"
                            >
                              {envVar}
                            </code>
                          ))}
                        </div>
                      )}
                    </div>
                    {service.docsUrl && (
                      <a
                        href={service.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 rounded p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                        title="Documentation"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wrench className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">No services match your filters</p>
        </div>
      )}
    </div>
  );
}
