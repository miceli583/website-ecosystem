"use client";

import { useState, useMemo } from "react";
import {
  Map,
  Globe,
  Lock,
  Shield,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Input } from "~/components/ui/input";

/**
 * Route information derived from the app structure
 */
interface RouteInfo {
  path: string;
  domain: "all" | "matthew" | "dev" | "live";
  access: "public" | "auth" | "admin";
  status: "live" | "dev" | "deprecated" | "redirect";
  description?: string;
  redirectTo?: string;
}

/**
 * Complete route inventory for the ecosystem.
 * Last audited: 2026-02-10
 */
const ECOSYSTEM_ROUTES: RouteInfo[] = [
  // ── Public Routes - All Domains ──────────────────────────────────
  { path: "/", domain: "all", access: "public", status: "live", description: "Domain-specific homepage" },
  { path: "/privacy", domain: "all", access: "public", status: "live", description: "Privacy policy" },
  { path: "/terms", domain: "all", access: "public", status: "live", description: "Terms of service" },

  // ── matthewmiceli.com ────────────────────────────────────────────
  { path: "/about", domain: "matthew", access: "public", status: "live", description: "About page" },
  { path: "/resume", domain: "matthew", access: "public", status: "live", description: "Interactive resume" },

  // ── miraclemind.dev ──────────────────────────────────────────────
  { path: "/services", domain: "dev", access: "public", status: "live", description: "Service offerings" },
  { path: "/stewardship", domain: "dev", access: "public", status: "live", description: "Stewardship program" },
  { path: "/contact", domain: "dev", access: "public", status: "live", description: "Contact form" },
  { path: "/blog", domain: "dev", access: "public", status: "live", description: "Blog listing" },
  { path: "/blog/[slug]", domain: "dev", access: "public", status: "live", description: "Blog post" },
  { path: "/banyan", domain: "dev", access: "public", status: "live", description: "BANYAN waitlist" },

  // ── Templates (public, matthewmiceli.com) ────────────────────────
  { path: "/templates", domain: "matthew", access: "public", status: "live", description: "Template gallery" },
  { path: "/templates/developer-profile", domain: "matthew", access: "public", status: "live" },
  { path: "/templates/portfolio", domain: "matthew", access: "public", status: "live" },
  { path: "/templates/saas-business", domain: "matthew", access: "public", status: "live" },
  { path: "/templates/startup", domain: "matthew", access: "public", status: "live" },

  // ── Playground (public, matthewmiceli.com) ───────────────────────
  { path: "/playground", domain: "matthew", access: "public", status: "live", description: "UI playground gallery" },
  { path: "/playground/geometric-shapes", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/golden-sunrays", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/gradient-waves", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/liquid-morph", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/meteor-effect", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/morphing-buttons", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/particle-field", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/quantum-orbital", domain: "matthew", access: "public", status: "live" },
  { path: "/playground/text-shimmer", domain: "matthew", access: "public", status: "live" },

  // ── Shaders (public, all domains) ────────────────────────────────
  { path: "/shaders", domain: "all", access: "public", status: "live", description: "Shader gallery" },
  { path: "/shaders/orbit-star", domain: "all", access: "public", status: "live" },
  { path: "/shaders/orbit-star/embed", domain: "all", access: "public", status: "live", description: "Embeddable iframe" },
  { path: "/shaders/flower-of-life", domain: "all", access: "public", status: "live" },
  { path: "/shaders/flower-of-life/embed", domain: "all", access: "public", status: "live", description: "Embeddable iframe" },
  { path: "/shaders/neural-net", domain: "all", access: "public", status: "live" },
  { path: "/shaders/neural-net/embed", domain: "all", access: "public", status: "live", description: "Embeddable iframe" },
  { path: "/shaders/fractal-noise", domain: "all", access: "public", status: "live" },
  { path: "/shaders/fractal-pyramid", domain: "all", access: "public", status: "live" },
  { path: "/shaders/icosahedron", domain: "all", access: "public", status: "live" },
  { path: "/shaders/metatrons-cube", domain: "all", access: "public", status: "live" },
  { path: "/shaders/north-star", domain: "all", access: "public", status: "live" },
  { path: "/shaders/the-way", domain: "all", access: "public", status: "live" },

  // ── Public Share Links ───────────────────────────────────────────
  { path: "/s/[token]/[[...path]]", domain: "all", access: "public", status: "live", description: "Public demo share links" },

  // ── Auth ─────────────────────────────────────────────────────────
  { path: "/auth/callback", domain: "all", access: "public", status: "live", description: "OAuth callback handler" },
  { path: "/auth/auth-code-error", domain: "all", access: "public", status: "live", description: "Auth error page" },

  // ── Portal (miraclemind.live, auth required) ─────────────────────
  { path: "/portal", domain: "live", access: "auth", status: "live", description: "Client portal hub" },
  { path: "/portal/set-password", domain: "live", access: "public", status: "live", description: "Set password flow" },
  { path: "/portal/profile", domain: "live", access: "auth", status: "live", description: "User profile" },
  { path: "/portal/[slug]", domain: "live", access: "auth", status: "live", description: "Client dashboard" },
  { path: "/portal/[slug]/demos", domain: "live", access: "auth", status: "live", description: "Client demos hub" },
  { path: "/portal/[slug]/proposals", domain: "live", access: "auth", status: "live", description: "Proposals" },
  { path: "/portal/[slug]/notes", domain: "live", access: "auth", status: "live", description: "Shared notes" },
  { path: "/portal/[slug]/tooling", domain: "live", access: "auth", status: "live", description: "Dev resources" },
  { path: "/portal/[slug]/billing", domain: "live", access: "auth", status: "live", description: "Billing history" },
  { path: "/portal/[slug]/profile", domain: "live", access: "auth", status: "live", description: "Client profile" },

  // ── Portal Demos (sub-routes under /portal/[slug]/demos) ─────────
  { path: "/portal/[slug]/demos/mockup", domain: "live", access: "auth", status: "live", description: "Mockup hub" },
  { path: "/portal/[slug]/demos/mockup/assets", domain: "live", access: "auth", status: "live", description: "Mockup assets" },
  { path: "/portal/[slug]/demos/mockup/frontend", domain: "live", access: "auth", status: "live", description: "Mockup frontend" },
  { path: "/portal/[slug]/demos/slides", domain: "live", access: "auth", status: "live", description: "Slides hub" },
  { path: "/portal/[slug]/demos/slides/gamma", domain: "live", access: "auth", status: "live", description: "Gamma export" },
  { path: "/portal/[slug]/demos/slides/inputs", domain: "live", access: "auth", status: "live", description: "Slide inputs" },
  { path: "/portal/[slug]/demos/slides/presentation", domain: "live", access: "auth", status: "live", description: "Presentation view" },
  { path: "/portal/[slug]/demos/slides/talking-tracks", domain: "live", access: "auth", status: "live", description: "Talking tracks" },
  { path: "/portal/[slug]/demos/tapchw", domain: "live", access: "auth", status: "live", description: "TAPCHW demo" },
  { path: "/portal/[slug]/demos/website", domain: "live", access: "auth", status: "live", description: "Website demo hub" },
  { path: "/portal/[slug]/demos/website/admin", domain: "live", access: "auth", status: "live", description: "Website admin demo" },
  { path: "/portal/[slug]/demos/website/frontend", domain: "live", access: "auth", status: "live", description: "Website frontend demo" },

  // ── Admin Core (miraclemind.dev) ─────────────────────────────────
  { path: "/admin", domain: "all", access: "admin", status: "live", description: "Admin dashboard" },
  { path: "/admin/login", domain: "all", access: "public", status: "live", description: "Admin login" },
  { path: "/admin/clients", domain: "all", access: "admin", status: "live", description: "Client management" },
  { path: "/admin/clients/[id]", domain: "all", access: "admin", status: "live", description: "Client details" },
  { path: "/admin/clients/[id]/push-update", domain: "all", access: "admin", status: "live", description: "Push client update" },
  { path: "/admin/crm", domain: "all", access: "admin", status: "live", description: "CRM dashboard" },
  { path: "/admin/crm/contacts", domain: "all", access: "admin", status: "live", description: "CRM contacts list" },
  { path: "/admin/crm/contacts/[id]", domain: "all", access: "admin", status: "live", description: "CRM contact detail" },
  { path: "/admin/crm/leads", domain: "all", access: "admin", status: "live", description: "Lead pipeline" },
  { path: "/admin/organization", domain: "all", access: "admin", status: "live", description: "Team & roles management" },
  { path: "/admin/daily-values", domain: "all", access: "admin", status: "live", description: "Daily values CMS" },
  { path: "/admin/blog", domain: "all", access: "admin", status: "live", description: "Blog CMS" },
  { path: "/admin/brand", domain: "all", access: "admin", status: "live", description: "Brand assets" },
  { path: "/admin/web-design", domain: "all", access: "admin", status: "live", description: "Web design gallery" },
  { path: "/admin/ecosystem", domain: "all", access: "admin", status: "live", description: "Route map (this page)" },
  { path: "/admin/tooling", domain: "all", access: "admin", status: "live", description: "Service inventory" },
  { path: "/admin/tooling/database", domain: "all", access: "admin", status: "live", description: "Database health" },
  { path: "/admin/analytics", domain: "all", access: "admin", status: "live", description: "Site analytics" },
  { path: "/admin/finance", domain: "all", access: "admin", status: "live", description: "Finance overview" },
  { path: "/admin/finance/revenue", domain: "all", access: "admin", status: "live", description: "Revenue tracking" },
  { path: "/admin/finance/expenses", domain: "all", access: "admin", status: "live", description: "Expense tracking" },
  { path: "/admin/finance/tax", domain: "all", access: "admin", status: "live", description: "Tax & deductions" },
  { path: "/admin/finance/yearly", domain: "all", access: "admin", status: "live", description: "Yearly P&L" },

  // ── Admin Shaders ────────────────────────────────────────────────
  { path: "/admin/shaders", domain: "all", access: "admin", status: "live", description: "Shader gallery" },
  { path: "/admin/shaders/flower-of-life", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/flower-of-life/embed", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/fractal-noise", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/fractal-pyramid", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/icosahedron", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/metatrons-cube", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/neural-net", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/neural-net/embed", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/north-star", domain: "all", access: "admin", status: "live" },
  { path: "/admin/shaders/the-way", domain: "all", access: "admin", status: "live" },

  // ── Admin Playground ─────────────────────────────────────────────
  { path: "/admin/playground", domain: "all", access: "admin", status: "live", description: "UI playground" },
  { path: "/admin/playground/geometric-shapes", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/golden-sunrays", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/gradient-waves", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/liquid-morph", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/meteor-effect", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/morphing-buttons", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/particle-field", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/quantum-orbital", domain: "all", access: "admin", status: "live" },
  { path: "/admin/playground/text-shimmer", domain: "all", access: "admin", status: "live" },

  // ── Admin Templates (redirects to /admin/web-design) ─────────────
  { path: "/admin/templates", domain: "all", access: "admin", status: "redirect", description: "Redirects to web-design", redirectTo: "/admin/web-design" },
  { path: "/admin/templates/developer-profile", domain: "all", access: "admin", status: "live" },
  { path: "/admin/templates/portfolio", domain: "all", access: "admin", status: "live" },
  { path: "/admin/templates/saas-business", domain: "all", access: "admin", status: "live" },
  { path: "/admin/templates/startup", domain: "all", access: "admin", status: "live" },

  // ── Landing Pages (admin, with color variants) ───────────────────
  { path: "/admin/dope-ass-landing", domain: "all", access: "admin", status: "live", description: "Countdown landing" },
  { path: "/admin/dope-ass-landing/blue-cyan", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/dope-ass-landing/cosmic-blue", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/dope-ass-landing/deep-ocean", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/dope-ass-landing/earth-sky", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/dope-ass-landing/emerald", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/dope-ass-landing/emerald-teal", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/dope-ass-landing/forest-green", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/dope-ass-landing/teal", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1", domain: "all", access: "admin", status: "live", description: "Waitlist landing" },
  { path: "/admin/join-community-1/blue-cyan", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1/cosmic-blue", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1/deep-ocean", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1/earth-sky", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1/emerald", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1/emerald-teal", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1/forest-green", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/join-community-1/teal", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1", domain: "all", access: "admin", status: "live", description: "Launch landing" },
  { path: "/admin/launch-landing-1/blue-cyan", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1/cosmic-blue", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1/deep-ocean", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1/earth-sky", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1/emerald", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1/emerald-teal", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1/forest-green", domain: "all", access: "admin", status: "live", description: "Color variant" },
  { path: "/admin/launch-landing-1/teal", domain: "all", access: "admin", status: "live", description: "Color variant" },

  // ── API Routes ───────────────────────────────────────────────────
  { path: "/api/trpc/[trpc]", domain: "all", access: "auth", status: "live", description: "tRPC handler" },
  { path: "/api/webhooks/stripe", domain: "all", access: "public", status: "live", description: "Stripe webhook" },
  { path: "/api/banyan/early-access", domain: "dev", access: "public", status: "live", description: "BANYAN signup" },
  { path: "/api/auto-rotate-and-post", domain: "all", access: "admin", status: "live", description: "Auto-post rotation" },
  { path: "/api/post-to-instagram", domain: "all", access: "admin", status: "live", description: "Instagram posting" },
  { path: "/api/process-pending-post", domain: "all", access: "admin", status: "live", description: "Process pending post" },
  { path: "/api/send-to-zapier", domain: "all", access: "admin", status: "live", description: "Zapier integration" },

  // ── Legacy Redirects (middleware) ────────────────────────────────
  { path: "/client/[slug]", domain: "live", access: "auth", status: "redirect", description: "Legacy client route", redirectTo: "/portal/[slug]" },
  { path: "/client/[slug]/billing", domain: "live", access: "auth", status: "redirect", redirectTo: "/portal/[slug]/billing" },
  { path: "/client/[slug]/demos", domain: "live", access: "auth", status: "redirect", redirectTo: "/portal/[slug]/demos" },
  { path: "/client/[slug]/proposals", domain: "live", access: "auth", status: "redirect", redirectTo: "/portal/[slug]/proposals" },
];

const DOMAIN_LABELS: Record<RouteInfo["domain"], string> = {
  all: "All Domains",
  matthew: "matthewmiceli.com",
  dev: "miraclemind.dev",
  live: "miraclemind.live",
};

const ACCESS_COLORS: Record<RouteInfo["access"], string> = {
  public: "bg-green-900/50 text-green-400",
  auth: "bg-[#D4AF37]/15 text-[#D4AF37]",
  admin: "bg-red-900/50 text-red-400",
};

const STATUS_COLORS: Record<RouteInfo["status"], string> = {
  live: "bg-green-900/50 text-green-400",
  dev: "bg-[#D4AF37]/15 text-[#D4AF37]",
  deprecated: "bg-gray-800 text-gray-400",
  redirect: "bg-blue-900/50 text-blue-400",
};

export default function EcosystemPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<RouteInfo["domain"] | "all">("all");
  const [accessFilter, setAccessFilter] = useState<RouteInfo["access"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<RouteInfo["status"] | "all">("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Admin", "Portal", "Public"]));

  const filteredRoutes = useMemo(() => {
    return ECOSYSTEM_ROUTES.filter((route) => {
      if (searchQuery && !route.path.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (domainFilter !== "all" && route.domain !== domainFilter && route.domain !== "all") {
        return false;
      }
      if (accessFilter !== "all" && route.access !== accessFilter) {
        return false;
      }
      if (statusFilter !== "all" && route.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [searchQuery, domainFilter, accessFilter, statusFilter]);

  // Group routes by category
  const groupedRoutes = useMemo(() => {
    const groups: Record<string, RouteInfo[]> = {
      Admin: [],
      Portal: [],
      "Landing Pages": [],
      Shaders: [],
      Playground: [],
      Templates: [],
      API: [],
      Public: [],
    };

    for (const route of filteredRoutes) {
      if (route.path.startsWith("/admin/dope-ass") || route.path.startsWith("/admin/join-") || route.path.startsWith("/admin/launch-")) {
        groups["Landing Pages"]!.push(route);
      } else if (route.path.startsWith("/admin")) {
        groups["Admin"]!.push(route);
      } else if (route.path.startsWith("/portal") || route.path.startsWith("/client")) {
        groups["Portal"]!.push(route);
      } else if (route.path.startsWith("/shaders")) {
        groups["Shaders"]!.push(route);
      } else if (route.path.startsWith("/playground")) {
        groups["Playground"]!.push(route);
      } else if (route.path.startsWith("/templates")) {
        groups["Templates"]!.push(route);
      } else if (route.path.startsWith("/api")) {
        groups["API"]!.push(route);
      } else {
        groups["Public"]!.push(route);
      }
    }

    return Object.entries(groups).filter(([, routes]) => routes.length > 0);
  }, [filteredRoutes]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const stats = useMemo(() => ({
    total: ECOSYSTEM_ROUTES.length,
    live: ECOSYSTEM_ROUTES.filter((r) => r.status === "live").length,
    dev: ECOSYSTEM_ROUTES.filter((r) => r.status === "dev").length,
    redirect: ECOSYSTEM_ROUTES.filter((r) => r.status === "redirect").length,
    public: ECOSYSTEM_ROUTES.filter((r) => r.access === "public").length,
    auth: ECOSYSTEM_ROUTES.filter((r) => r.access === "auth").length,
    admin: ECOSYSTEM_ROUTES.filter((r) => r.access === "admin").length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Ecosystem Map</h1>
        <p className="text-sm text-gray-400">
          All routes across the Miracle Mind ecosystem
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Routes</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-green-400">{stats.live}</p>
          <p className="text-xs text-gray-500">Live</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>{stats.dev}</p>
          <p className="text-xs text-gray-500">In Development</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-blue-400">{stats.redirect}</p>
          <p className="text-xs text-gray-500">Redirects</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-green-400">{stats.public}</p>
          <p className="text-xs text-gray-500">Public</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>{stats.auth}</p>
          <p className="text-xs text-gray-500">Auth Required</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <p className="text-2xl font-bold text-red-400">{stats.admin}</p>
          <p className="text-xs text-gray-500">Admin Only</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search routes..."
            className="border-gray-700 bg-black/50 pl-10 text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value as RouteInfo["domain"] | "all")}
          className="rounded-md border border-gray-700 bg-black/50 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Domains</option>
          <option value="matthew">matthewmiceli.com</option>
          <option value="dev">miraclemind.dev</option>
          <option value="live">miraclemind.live</option>
        </select>
        <select
          value={accessFilter}
          onChange={(e) => setAccessFilter(e.target.value as RouteInfo["access"] | "all")}
          className="rounded-md border border-gray-700 bg-black/50 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Access</option>
          <option value="public">Public</option>
          <option value="auth">Auth Required</option>
          <option value="admin">Admin Only</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RouteInfo["status"] | "all")}
          className="rounded-md border border-gray-700 bg-black/50 px-3 py-2 text-sm text-white"
        >
          <option value="all">All Status</option>
          <option value="live">Live</option>
          <option value="dev">Development</option>
          <option value="redirect">Redirect</option>
          <option value="deprecated">Deprecated</option>
        </select>
      </div>

      {/* Route List */}
      <div className="space-y-4">
        {groupedRoutes.map(([group, routes]) => (
          <div
            key={group}
            className="rounded-lg border bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <button
              onClick={() => toggleGroup(group)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                {expandedGroups.has(group) ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span className="font-medium text-white">{group}</span>
                <span className="text-sm text-gray-500">{routes.length} routes</span>
              </div>
            </button>

            {expandedGroups.has(group) && (
              <div className="border-t" style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500" style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}>
                      <th className="px-4 py-2">Path</th>
                      <th className="hidden px-4 py-2 sm:table-cell">Domain</th>
                      <th className="px-4 py-2">Access</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="hidden px-4 py-2 lg:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route) => (
                      <tr
                        key={route.path}
                        className="border-b last:border-b-0 hover:bg-white/5"
                        style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                      >
                        <td className="px-4 py-2">
                          <code className="text-gray-300">{route.path}</code>
                        </td>
                        <td className="hidden px-4 py-2 sm:table-cell">
                          <span className="flex items-center gap-1 text-gray-400">
                            <Globe className="h-3 w-3" />
                            {DOMAIN_LABELS[route.domain]}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${ACCESS_COLORS[route.access]}`}>
                            {route.access === "public" && <Globe className="h-3 w-3" />}
                            {route.access === "auth" && <Lock className="h-3 w-3" />}
                            {route.access === "admin" && <Shield className="h-3 w-3" />}
                            {route.access}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[route.status]}`}>
                            {route.status}
                          </span>
                        </td>
                        <td className="hidden px-4 py-2 lg:table-cell">
                          {route.redirectTo ? (
                            <span className="flex items-center gap-1 text-blue-400">
                              <ArrowRight className="h-3 w-3" />
                              <code className="text-xs">{route.redirectTo}</code>
                            </span>
                          ) : (
                            <span className="text-gray-500">{route.description ?? "—"}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Map className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-400">No routes match your filters</p>
        </div>
      )}
    </div>
  );
}
