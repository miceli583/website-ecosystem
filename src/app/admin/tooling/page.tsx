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
  Clock,
  Shield,
  Layers,
  Palette,
  Paintbrush,
  FileText,
  Sparkles,
  Code,
  Ban,
} from "lucide-react";
import { Input } from "~/components/ui/input";

type Category =
  | "framework"
  | "database"
  | "api"
  | "payments"
  | "email"
  | "automation"
  | "hosting"
  | "ui"
  | "styling"
  | "content"
  | "graphics"
  | "analytics"
  | "security"
  | "devtools";

type Status = "active" | "configured" | "pending" | "deprecated";

interface ServiceInfo {
  name: string;
  category: Category;
  purpose: string;
  version?: string;
  envVars: string[];
  docsUrl?: string;
  status: Status;
  notes?: string;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  framework: <Layers className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  api: <Wrench className="h-4 w-4" />,
  payments: <CreditCard className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  automation: <Workflow className="h-4 w-4" />,
  hosting: <Cloud className="h-4 w-4" />,
  ui: <Palette className="h-4 w-4" />,
  styling: <Paintbrush className="h-4 w-4" />,
  content: <FileText className="h-4 w-4" />,
  graphics: <Sparkles className="h-4 w-4" />,
  analytics: <BarChart3 className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  devtools: <Code className="h-4 w-4" />,
};

const CATEGORY_LABELS: Record<Category, string> = {
  framework: "Core Platform",
  database: "Database & ORM",
  api: "API & Data Layer",
  payments: "Payments & Finance",
  email: "Email",
  automation: "Automation & Social",
  hosting: "Hosting & Infrastructure",
  ui: "UI & Components",
  styling: "Styling & Typography",
  content: "Content, Media & Documents",
  graphics: "Shaders & Graphics",
  analytics: "Analytics & Monitoring",
  security: "Security",
  devtools: "Developer Tools",
};

const CATEGORY_ORDER: Category[] = [
  "framework", "database", "api", "payments", "email", "automation",
  "hosting", "ui", "styling", "content", "graphics", "analytics",
  "security", "devtools",
];

const STATUS_BADGES: Record<Status, { className: string; icon: React.ReactNode }> = {
  active: {
    className: "bg-green-900/50 text-green-400",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  configured: {
    className: "bg-[#D4AF37]/15 text-[#D4AF37]",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  pending: {
    className: "bg-blue-900/50 text-blue-400",
    icon: <Clock className="h-3 w-3" />,
  },
  deprecated: {
    className: "bg-gray-800 text-gray-500",
    icon: <Ban className="h-3 w-3" />,
  },
};

/**
 * Complete technology inventory for the ecosystem.
 * Last audited: 2026-02-10
 */
const SERVICES: ServiceInfo[] = [
  // ── Core Platform ──────────────────────────────────────────────────
  {
    name: "Next.js",
    category: "framework",
    version: "16.1.1",
    purpose: "Full-stack React framework — App Router, SSR, ISR, API routes, middleware",
    envVars: [],
    docsUrl: "https://nextjs.org/docs",
    status: "active",
    notes: "Turbopack for dev, multi-domain routing via middleware",
  },
  {
    name: "React",
    category: "framework",
    version: "19.0.0",
    purpose: "UI library — Server Components, Suspense, concurrent features",
    envVars: [],
    docsUrl: "https://react.dev",
    status: "active",
    notes: "React 19 with Server Components throughout",
  },
  {
    name: "TypeScript",
    category: "framework",
    version: "5.8.2",
    purpose: "Type-safe JavaScript — strict mode, path aliases, full coverage",
    envVars: [],
    docsUrl: "https://www.typescriptlang.org/docs",
    status: "active",
    notes: "Strict mode enabled, path alias ~/",
  },

  // ── Database & ORM ─────────────────────────────────────────────────
  {
    name: "Supabase PostgreSQL",
    category: "database",
    purpose: "Primary database — PostgreSQL with auth, storage, realtime, RLS",
    envVars: ["DATABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    docsUrl: "https://supabase.com/docs",
    status: "active",
    notes: "22 tables, all with RLS enabled. See /admin/tooling/database for full inventory",
  },
  {
    name: "Drizzle ORM",
    category: "database",
    version: "0.41.0",
    purpose: "Type-safe SQL query builder — schema-driven, relational queries, migrations",
    envVars: [],
    docsUrl: "https://orm.drizzle.team/docs",
    status: "active",
    notes: "Schema at src/server/db/schema.ts. Drizzle Kit 0.30.5 for migrations",
  },
  {
    name: "Postgres.js",
    category: "database",
    version: "3.4.7",
    purpose: "PostgreSQL wire-protocol driver — powers Drizzle's Supabase connection",
    envVars: ["DATABASE_URL"],
    docsUrl: "https://github.com/porsager/postgres",
    status: "active",
    notes: "Fastest PG driver for Node.js, used by drizzle-orm/postgres-js",
  },
  {
    name: "LibSQL / Turso",
    category: "database",
    version: "0.14.0",
    purpose: "Edge SQLite database — evaluated for demo data isolation",
    envVars: [],
    docsUrl: "https://turso.tech/docs",
    status: "configured",
    notes: "@libsql/client installed, Drizzle config detects SQLite vs PG dynamically",
  },

  // ── API & Data Layer ───────────────────────────────────────────────
  {
    name: "tRPC",
    category: "api",
    version: "11.0.0",
    purpose: "End-to-end type-safe API — procedures auto-infer types from server to client",
    envVars: [],
    docsUrl: "https://trpc.io/docs",
    status: "active",
    notes: "8+ routers: clients, crm, finance, portal, analytics, dailyValues, portalNotes, contact",
  },
  {
    name: "TanStack React Query",
    category: "api",
    version: "5.69.0",
    purpose: "Server state management — caching, optimistic updates, infinite queries",
    envVars: [],
    docsUrl: "https://tanstack.com/query/latest/docs",
    status: "active",
    notes: "Powers tRPC client, provides cache invalidation and refetch logic",
  },
  {
    name: "Zod",
    category: "api",
    version: "3.24.2",
    purpose: "Runtime schema validation — input validation for tRPC procedures, form data, API payloads",
    envVars: [],
    docsUrl: "https://zod.dev",
    status: "active",
    notes: "Used in every tRPC mutation input, env validation, and form schemas",
  },
  {
    name: "SuperJSON",
    category: "api",
    version: "2.2.1",
    purpose: "Rich JSON serialization — preserves Date, Map, Set, BigInt across tRPC boundary",
    envVars: [],
    docsUrl: "https://github.com/blitz-js/superjson",
    status: "active",
    notes: "tRPC transformer for serializing complex types",
  },

  // ── Payments & Finance ─────────────────────────────────────────────
  {
    name: "Stripe",
    category: "payments",
    version: "20.2.0",
    purpose: "Payment processing — subscriptions, invoicing, billing portal, webhooks",
    envVars: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_LIVE_READ_KEY"],
    docsUrl: "https://stripe.com/docs",
    status: "active",
    notes: "Test key for portal checkout, Live read-only key for finance dashboard. API v2025-12-15.clover",
  },
  {
    name: "Mercury API",
    category: "payments",
    purpose: "Business banking data — accounts, transactions, balance history",
    envVars: ["MERCURY_API_KEY"],
    docsUrl: "https://docs.mercury.com",
    status: "active",
    notes: "Bearer token auth, date-filtered queries, amounts in dollars. Custom client at src/lib/mercury.ts",
  },

  // ── Email ──────────────────────────────────────────────────────────
  {
    name: "SMTP2GO",
    category: "email",
    purpose: "SMTP relay for Supabase Auth — magic links, password resets, auth emails",
    envVars: [],
    docsUrl: "https://www.smtp2go.com/docs",
    status: "active",
    notes: "Configured in Supabase dashboard SMTP settings. Sends from noreply@miraclemind.dev. Free tier: 1,000 emails/month. DNS records on Namecheap (DKIM, SPF, tracking)",
  },
  {
    name: "Resend",
    category: "email",
    version: "6.9.1",
    purpose: "Transactional email — portal invites, BANYAN signups, admin alerts",
    envVars: ["RESEND_API_KEY"],
    docsUrl: "https://resend.com/docs",
    status: "active",
    notes: "Primary email provider. Email utility at src/lib/email.ts",
  },
  {
    name: "React Email",
    category: "email",
    version: "1.0.6",
    purpose: "Email templates as React components — type-safe, preview-able, styled",
    envVars: [],
    docsUrl: "https://react.email",
    status: "active",
    notes: "@react-email/components for building email templates in JSX",
  },

  // ── Automation & Social ────────────────────────────────────────────
  {
    name: "Zapier",
    category: "automation",
    purpose: "Webhook workflows — triggers Instagram carousel posts from daily value queue",
    envVars: [],
    docsUrl: "https://zapier.com/help",
    status: "active",
    notes: "Catches webhook at hooks.zapier.com, posts to Instagram Business API",
  },
  {
    name: "Make.com",
    category: "automation",
    purpose: "Visual automation — webhook workflows for Instagram content distribution",
    envVars: ["NEXT_PUBLIC_MAKE_WEBHOOK_URL", "NEXT_PUBLIC_MAKE_API_KEY"],
    docsUrl: "https://www.make.com/en/help",
    status: "active",
    notes: "Formerly Integromat. Triggers daily value posts alongside Zapier",
  },
  {
    name: "Cron Jobs (Vercel)",
    category: "automation",
    purpose: "Scheduled tasks — auto-rotate daily value queue, process pending posts",
    envVars: ["CRON_SECRET"],
    docsUrl: "https://vercel.com/docs/cron-jobs",
    status: "active",
    notes: "Bearer token auth. Endpoints: /api/auto-rotate-and-post, /api/process-pending-post",
  },
  {
    name: "Instagram Business API",
    category: "automation",
    purpose: "Social media posting — carousel images for daily value content",
    envVars: [],
    docsUrl: "https://developers.facebook.com/docs/instagram-platform",
    status: "active",
    notes: "Accessed indirectly via Zapier/Make.com webhooks. Images hosted on Supabase Storage",
  },

  // ── Hosting & Infrastructure ───────────────────────────────────────
  {
    name: "Vercel",
    category: "hosting",
    purpose: "Deployment platform — Edge Network, serverless functions, preview deploys, cron",
    envVars: [],
    docsUrl: "https://vercel.com/docs",
    status: "active",
    notes: "Auto-deploys from main branch. 3 custom domains configured",
  },
  {
    name: "GitHub",
    category: "hosting",
    purpose: "Source control & CI — repository hosting, branch protection, Vercel integration",
    envVars: [],
    docsUrl: "https://docs.github.com",
    status: "active",
    notes: "Private repo at miceli583/website-ecosystem. Pre-push hooks for quality gates",
  },
  {
    name: "Namecheap",
    category: "hosting",
    purpose: "Domain registrar & DNS — miraclemind.dev domain, SMTP2GO DKIM/SPF records, Vercel CNAME",
    envVars: [],
    docsUrl: "https://www.namecheap.com",
    status: "active",
    notes: "Manages DNS for miraclemind.dev: Vercel hosting records, SMTP2GO email auth (DKIM, SPF, tracking CNAME)",
  },
  {
    name: "Neo.space",
    category: "hosting",
    purpose: "Email domain & inbound mail — miraclemind.live mailboxes and aliases",
    envVars: [],
    docsUrl: "https://neo.space",
    status: "active",
    notes: "Receives inbound email: admin@, support@, waitlist@, beta@ miraclemind.live. Domain registrar for miraclemind.live",
  },

  // ── UI & Components ────────────────────────────────────────────────
  {
    name: "Radix UI",
    category: "ui",
    purpose: "Headless primitives — accessible, unstyled components (Tabs, Slot, Collapsible, Dialog)",
    envVars: [],
    docsUrl: "https://www.radix-ui.com/docs",
    status: "active",
    notes: "@radix-ui/react-tabs, @radix-ui/react-slot. Foundation for shadcn/ui components",
  },
  {
    name: "shadcn/ui",
    category: "ui",
    purpose: "Copy-paste component library — Button, Dialog, Sheet, Breadcrumb, Tooltip, Tabs",
    envVars: [],
    docsUrl: "https://ui.shadcn.com",
    status: "active",
    notes: "Configured via components.json. Components in src/components/ui/",
  },
  {
    name: "Lucide React",
    category: "ui",
    version: "0.543.0",
    purpose: "Icon library — 1500+ icons used across admin, portal, and public pages",
    envVars: [],
    docsUrl: "https://lucide.dev",
    status: "active",
    notes: "Tree-shakeable SVG icons. 100+ unique icons imported across the ecosystem",
  },
  {
    name: "Sonner",
    category: "ui",
    version: "2.0.7",
    purpose: "Toast notifications — success/error/info messages across admin and portal",
    envVars: [],
    docsUrl: "https://sonner.emilkowal.ski",
    status: "active",
    notes: "Renders via <Toaster /> in root layout",
  },
  {
    name: "next-themes",
    category: "ui",
    version: "0.4.6",
    purpose: "Theme provider — dark/light mode switching with system preference detection",
    envVars: [],
    docsUrl: "https://github.com/pacocoursey/next-themes",
    status: "configured",
    notes: "Installed and configured. App currently uses dark theme exclusively",
  },

  // ── Styling & Typography ───────────────────────────────────────────
  {
    name: "Tailwind CSS",
    category: "styling",
    version: "4.0.15",
    purpose: "Utility-first CSS — responsive, dark mode, custom design tokens",
    envVars: [],
    docsUrl: "https://tailwindcss.com/docs",
    status: "active",
    notes: "v4 with PostCSS plugin. Extended with CVA 0.7.1, clsx 2.1.1, tailwind-merge 3.3.1, tw-animate-css 1.3.8",
  },
  {
    name: "Google Fonts (next/font)",
    category: "styling",
    purpose: "Self-hosted web fonts — zero layout shift, preloaded, CSS variable-based",
    envVars: [],
    docsUrl: "https://nextjs.org/docs/app/building-your-application/optimizing/fonts",
    status: "active",
    notes: "Geist (body), Quattrocento Sans (headings), Barlow (subtitles), Montserrat (alternative)",
  },

  // ── Content, Media & Documents ─────────────────────────────────────
  {
    name: "TipTap",
    category: "content",
    version: "3.18.0",
    purpose: "Rich text editor — WYSIWYG editing for notes, blog posts, proposals",
    envVars: [],
    docsUrl: "https://tiptap.dev/docs",
    status: "active",
    notes: "@tiptap/react + starter-kit + placeholder extension. ProseMirror-based",
  },
  {
    name: "React Markdown",
    category: "content",
    version: "10.1.0",
    purpose: "Markdown rendering — blog posts, notes display, documentation",
    envVars: [],
    docsUrl: "https://github.com/remarkjs/react-markdown",
    status: "active",
  },
  {
    name: "jsPDF + html2canvas",
    category: "content",
    purpose: "PDF generation pipeline — capture HTML as canvas, export to PDF",
    envVars: [],
    docsUrl: "https://github.com/parallax/jsPDF",
    status: "active",
    notes: "jsPDF 4.0.0 + html2canvas 1.4.1. Used for resume export and report generation",
  },
  {
    name: "Sharp",
    category: "content",
    version: "0.34.5",
    purpose: "Image processing — resize, optimize, format conversion for uploads",
    envVars: [],
    docsUrl: "https://sharp.pixelplumbing.com",
    status: "active",
    notes: "Server-side image optimization. High-performance libvips binding",
  },
  {
    name: "node-canvas",
    category: "content",
    version: "3.2.0",
    purpose: "Server-side Canvas API — generates daily value carousel images programmatically",
    envVars: [],
    docsUrl: "https://github.com/Automattic/node-canvas",
    status: "active",
    notes: "Cairo-based. Creates Instagram-ready images with text overlays and branding",
  },
  {
    name: "Puppeteer + Chromium",
    category: "content",
    version: "24.34.0",
    purpose: "Headless browser automation — screenshots, PDF capture, HTML-to-image rendering",
    envVars: [],
    docsUrl: "https://pptr.dev",
    status: "active",
    notes: "@sparticuz/chromium 143.0.0 for serverless. puppeteer-core for lightweight deploys",
  },
  {
    name: "Supabase Storage",
    category: "content",
    purpose: "File hosting — daily value images, uploaded assets, public URL generation",
    envVars: ["SUPABASE_SERVICE_ROLE_KEY"],
    docsUrl: "https://supabase.com/docs/guides/storage",
    status: "active",
    notes: "Bucket: daily-anchors. Service role for server uploads, anon key for public reads",
  },
  {
    name: "Unsplash",
    category: "content",
    purpose: "Stock photography — remote image source for blog posts and content pages",
    envVars: [],
    docsUrl: "https://unsplash.com/developers",
    status: "active",
    notes: "Configured as allowed remote image hostname in next.config.js (images.unsplash.com)",
  },
  {
    name: "Gamma",
    category: "content",
    purpose: "AI presentation tool — generates slide decks from content for client demos",
    envVars: [],
    docsUrl: "https://gamma.app",
    status: "configured",
    notes: "Demo pages at /portal/[slug]/demos/slides/gamma. Presentations embedded or linked, no direct API integration",
  },

  // ── Shaders & Graphics ────────────────────────────────────────────
  {
    name: "WebGL / GLSL Shaders",
    category: "graphics",
    purpose: "Custom shader engine — real-time fragment shaders with Shadertoy-compatible renderer",
    envVars: [],
    docsUrl: "https://www.khronos.org/webgl",
    status: "active",
    notes: "13 shaders: Orbit Star, Flower of Life, Neural Net, Fractal Noise, Icosahedron, Metatron's Cube, North Star, The Way, and more. Renderer at src/components/shaders/shadertoy-renderer.tsx",
  },

  // ── Analytics & Monitoring ─────────────────────────────────────────
  {
    name: "PostHog",
    category: "analytics",
    purpose: "Product analytics — session replays, event tracking, feature flags, funnels",
    envVars: ["NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST"],
    docsUrl: "https://posthog.com/docs",
    status: "pending",
    notes: "Planned for portal usage tracking, form submissions, domain activity",
  },
  {
    name: "Sentry",
    category: "analytics",
    purpose: "Error tracking — exceptions, performance monitoring, release tracking",
    envVars: ["SENTRY_DSN"],
    docsUrl: "https://docs.sentry.io",
    status: "pending",
    notes: "Planned for production error capture, especially in client portal flows",
  },
  {
    name: "Vercel Analytics",
    category: "analytics",
    purpose: "Web vitals — Core Web Vitals, page views, real user metrics",
    envVars: [],
    docsUrl: "https://vercel.com/docs/analytics",
    status: "pending",
    notes: "Planned alongside PostHog for site-level performance metrics",
  },

  // ── Security ───────────────────────────────────────────────────────
  {
    name: "Supabase RLS",
    category: "security",
    purpose: "Row-level security — PostgreSQL policies enforce access at the database layer",
    envVars: [],
    docsUrl: "https://supabase.com/docs/guides/auth/row-level-security",
    status: "active",
    notes: "100% table coverage. All 22 tables have RLS policies enabled",
  },
  {
    name: "Security Headers (CSP)",
    category: "security",
    purpose: "Content Security Policy — XSS prevention, frame protection, HSTS, referrer policy",
    envVars: [],
    docsUrl: "https://nextjs.org/docs/advanced-features/security-headers",
    status: "active",
    notes: "Configured in next.config.js. CSP, X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options",
  },
  {
    name: "@t3-oss/env-nextjs",
    category: "security",
    version: "0.12.0",
    purpose: "Environment validation — Zod-powered schema for required env vars at build time",
    envVars: [],
    docsUrl: "https://env.t3.gg",
    status: "active",
    notes: "Validates all env vars at startup. Paired with server-only for leaked import protection",
  },

  // ── Developer Tools ────────────────────────────────────────────────
  {
    name: "ESLint",
    category: "devtools",
    version: "8.57.1",
    purpose: "Code linting — TypeScript rules, React hooks, Next.js conventions",
    envVars: [],
    docsUrl: "https://eslint.org/docs",
    status: "active",
    notes: "eslint-config-next + @typescript-eslint. Pre-push hook enforces zero errors",
  },
  {
    name: "Prettier",
    category: "devtools",
    version: "3.4.2",
    purpose: "Code formatting — consistent style, Tailwind class sorting",
    envVars: [],
    docsUrl: "https://prettier.io/docs",
    status: "active",
    notes: "prettier-plugin-tailwindcss for automatic class ordering",
  },
  {
    name: "Drizzle Kit",
    category: "devtools",
    version: "0.30.5",
    purpose: "Schema migrations — push, generate, introspect database schema changes",
    envVars: ["DATABASE_URL"],
    docsUrl: "https://orm.drizzle.team/kit-docs",
    status: "active",
    notes: "npm run db:push to sync schema. Auto-detects PG vs SQLite",
  },
  {
    name: "nanoid",
    category: "devtools",
    version: "5.1.6",
    purpose: "URL-safe unique IDs — compact, collision-resistant identifiers",
    envVars: [],
    docsUrl: "https://github.com/ai/nanoid",
    status: "active",
    notes: "Used for share tokens, resource IDs, and public URLs",
  },
];

export default function ToolingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !service.name.toLowerCase().includes(query) &&
          !service.purpose.toLowerCase().includes(query) &&
          !service.envVars.some((v) => v.toLowerCase().includes(query)) &&
          !(service.notes?.toLowerCase().includes(query))
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

  // Group by category in defined order
  const groupedServices = useMemo(() => {
    const groups = new Map<Category, ServiceInfo[]>();
    for (const service of filteredServices) {
      const existing = groups.get(service.category) ?? [];
      existing.push(service);
      groups.set(service.category, existing);
    }
    return CATEGORY_ORDER
      .filter((cat) => groups.has(cat))
      .map((cat) => [cat, groups.get(cat)!] as const);
  }, [filteredServices]);

  const stats = useMemo(() => ({
    total: SERVICES.length,
    active: SERVICES.filter((s) => s.status === "active").length,
    configured: SERVICES.filter((s) => s.status === "configured").length,
    pending: SERVICES.filter((s) => s.status === "pending").length,
    deprecated: SERVICES.filter((s) => s.status === "deprecated").length,
    categories: new Set(SERVICES.map((s) => s.category)).size,
    envVarCount: new Set(SERVICES.flatMap((s) => s.envVars)).size,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Technology Inventory</h1>
        <p className="text-sm text-gray-400">
          Complete stack across the Miracle Mind ecosystem — active, planned, and historical
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500">Total</p>
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
          <p className="text-2xl font-bold text-blue-400">{stats.pending}</p>
          <p className="text-xs text-gray-500">Planned</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-gray-500">{stats.deprecated}</p>
          <p className="text-xs text-gray-500">Deprecated</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-white">{stats.categories}</p>
          <p className="text-xs text-gray-500">Categories</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-white">{stats.envVarCount}</p>
          <p className="text-xs text-gray-500">Env Vars</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools, env vars, or notes..."
            className="border-gray-700 bg-black/50 pl-10 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | "all")}
          className="rounded-md border border-gray-700 bg-black/50 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Categories</option>
          {CATEGORY_ORDER.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
          className="rounded-md border border-gray-700 bg-black/50 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="configured">Configured</option>
          <option value="pending">Planned</option>
          <option value="deprecated">Deprecated</option>
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
                        {service.version && (
                          <code className="rounded bg-black/50 px-1.5 py-0.5 text-xs text-gray-500">
                            v{service.version}
                          </code>
                        )}
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
