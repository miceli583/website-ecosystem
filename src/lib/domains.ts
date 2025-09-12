/**
 * Multi-domain configuration for the website ecosystem
 * Handles domain-specific routing, branding, and content
 */

export const DOMAINS = {
  MATTHEW_MICELI: "matthewmiceli.com",
  MIRACLE_MIND_LIVE: "miraclemind.live",
  MIRACLE_MIND_DEV: "miraclemind.dev",
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
    name: "MiracleMind",
    description: "Transform Your Mind, Transform Your Life",
    theme: "brand",
    primaryColor: "#10b981", // emerald
    logo: "🧠✨",
    tagline: "AI-Powered Personal Development Platform",
    nav: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "About", href: "/about" },
      { name: "Sign In", href: "/auth/signin" },
    ],
  },
  [DOMAINS.MIRACLE_MIND_DEV]: {
    name: "MiracleMind Dev",
    description: "Technical Documentation & Development Resources",
    theme: "tech",
    primaryColor: "#8b5cf6", // violet
    logo: "</MM>",
    tagline: "Building the Future of Personal Development Tech",
    nav: [
      { name: "Docs", href: "/docs" },
      { name: "API", href: "/api" },
      { name: "Blog", href: "/blog" },
      { name: "Admin", href: "/admin" },
    ],
  },
} as const;

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
  admin: "http://localhost:3000/admin?domain=dev",
} as const;
