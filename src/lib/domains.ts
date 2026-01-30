/**
 * Multi-domain configuration for the website ecosystem
 *
 * Domain Structure:
 * - matthewmiceli.com: Personal portfolio and professional presence
 * - miraclemind.dev: Main company site (services, values, mission)
 * - miraclemind.dev/banyan: BANYAN product page
 * - miraclemind.live: Redirects to miraclemind.dev (legacy domain)
 *
 * Routing Strategy:
 * - Public routes (/) render different content based on domain
 * - Admin routes (/admin/*) are restricted to miraclemind.dev
 * - Middleware enforces domain restrictions and authentication
 */

export const DOMAINS = {
  MATTHEW_MICELI: "matthewmiceli.com",
  MIRACLE_MIND_LIVE: "miraclemind.live",
  MIRACLE_MIND_DEV: "miraclemind.dev",
  CLIENTS_PORTAL: "clients.miraclemind.dev",
} as const;

export type DomainKey = keyof typeof DOMAINS;
export type DomainValue = (typeof DOMAINS)[DomainKey];

/**
 * Domain configuration with branding and metadata
 */
export const DOMAIN_CONFIG = {
  [DOMAINS.MATTHEW_MICELI]: {
    name: "Matthew Miceli",
    description: "Personal Portfolio & Professional Presence",
    theme: "personal",
    primaryColor: "#3b82f6", // blue
    logo: "MM",
    tagline: "Software Engineer & Digital Architect",
    nav: [
      { name: "About", href: "/about" },
      { name: "Projects", href: "/projects" },
      { name: "Experience", href: "/experience" },
      { name: "Contact", href: "/contact" },
    ],
  },
  [DOMAINS.MIRACLE_MIND_LIVE]: {
    name: "Miracle Mind",
    description: "Client Portal",
    theme: "brand",
    primaryColor: "#D4AF37", // metallic gold
    logo: "/brand/miracle-mind-orbit-star-v3.svg",
    tagline: "Client Portal",
    nav: [
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Stewardship", href: "/stewardship" },
      { name: "Contact", href: "/contact" },
    ],
  },
  [DOMAINS.MIRACLE_MIND_DEV]: {
    name: "Miracle Mind",
    description:
      "AI-driven development empowering human sovereignty, deepening connection, and honoring what makes us most human",
    theme: "brand",
    primaryColor: "#D4AF37", // metallic gold
    logo: "/brand/miracle-mind-orbit-star-v3.svg",
    tagline: "Technology Empowering Human Sovereignty",
    nav: [
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Stewardship", href: "/stewardship" },
      { name: "Contact", href: "/contact" },
    ],
  },
  [DOMAINS.CLIENTS_PORTAL]: {
    name: "Miracle Mind — Client Portal",
    description: "Your project dashboard",
    theme: "brand",
    primaryColor: "#D4AF37",
    logo: "/brand/miracle-mind-orbit-star-v3.svg",
    tagline: "Client Portal",
    nav: [
      { name: "Dashboard", href: "/client" },
      { name: "Demos", href: "/client/demos" },
      { name: "Proposals", href: "/client/proposals" },
      { name: "Billing", href: "/client/billing" },
    ],
  },
} as const;

/**
 * Admin-specific navigation (shown only on /admin/* routes)
 */
export const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin" },
  { name: "Clients", href: "/admin/clients" },
  { name: "Brand", href: "/admin/brand" },
  { name: "Templates", href: "/admin/templates" },
  { name: "Shaders", href: "/admin/shaders" },
  { name: "Playground", href: "/admin/playground" },
] as const;

/**
 * Get domain configuration from hostname
 */
export function getDomainConfig(hostname: string) {
  // Handle localhost development
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    // Use URL parameters to simulate different domains in development
    const searchParams = new URLSearchParams(
      globalThis?.location?.search || ""
    );
    const domain = searchParams.get("domain");

    switch (domain) {
      case "matthew":
        return DOMAIN_CONFIG[DOMAINS.MATTHEW_MICELI];
      case "live":
        return DOMAIN_CONFIG[DOMAINS.MIRACLE_MIND_LIVE];
      case "dev":
        return DOMAIN_CONFIG[DOMAINS.MIRACLE_MIND_DEV];
      case "clients":
        return DOMAIN_CONFIG[DOMAINS.CLIENTS_PORTAL];
      default:
        return DOMAIN_CONFIG[DOMAINS.MATTHEW_MICELI]; // Default for localhost
    }
  }

  // Production domain matching
  const domain = hostname.toLowerCase();

  if (domain.includes("matthewmiceli.com")) {
    return DOMAIN_CONFIG[DOMAINS.MATTHEW_MICELI];
  } else if (domain.includes("miraclemind.live")) {
    return DOMAIN_CONFIG[DOMAINS.MIRACLE_MIND_LIVE];
  } else if (domain.startsWith("clients.miraclemind.dev")) {
    return DOMAIN_CONFIG[DOMAINS.CLIENTS_PORTAL];
  } else if (domain.includes("miraclemind.dev")) {
    return DOMAIN_CONFIG[DOMAINS.MIRACLE_MIND_DEV];
  }

  // Default fallback
  return DOMAIN_CONFIG[DOMAINS.MATTHEW_MICELI];
}

/**
 * Get current domain from request headers (server-side)
 */
export function getDomainFromHeaders(headers: Headers): DomainValue {
  const host = headers.get("host") || "";

  if (host.includes("matthewmiceli.com")) return DOMAINS.MATTHEW_MICELI;
  if (host.includes("miraclemind.live")) return DOMAINS.MIRACLE_MIND_LIVE;
  if (host.startsWith("clients.miraclemind.dev")) return DOMAINS.CLIENTS_PORTAL;
  if (host.includes("miraclemind.dev")) return DOMAINS.MIRACLE_MIND_DEV;

  return DOMAINS.MATTHEW_MICELI; // Default
}

/**
 * Check if current path is admin area
 */
export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/**
 * Development URL helpers for testing different domains
 */
export const DEV_URLS = {
  matthew: "http://localhost:3000?domain=matthew",
  live: "http://localhost:3000?domain=live",
  dev: "http://localhost:3000?domain=dev",
  banyan: "http://localhost:3000/banyan?domain=dev",
  admin: "http://localhost:3000/admin?domain=dev",
  clients: "http://localhost:3000?domain=clients",
} as const;
