import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDomainFromHeaders, isAdminPath, DOMAINS } from "~/lib/domains";
import { updateSession } from "~/lib/supabase/middleware";

/**
 * Multi-domain routing middleware
 *
 * Responsibilities:
 * 1. Authentication: Protects all /admin/* routes (except /admin/login)
 * 2. Domain enforcement:
 *    - /admin/* routes → miraclemind.dev only
 *    - /playground/* routes → matthewmiceli.com only
 * 3. Session management: Updates Supabase auth sessions
 *
 * Route Migration History:
 * - /playground → /admin/playground (now requires auth)
 * - /shaders → /admin/shaders (now requires auth)
 * - /templates → /admin/templates (now requires auth)
 */
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  let pathname = request.nextUrl.pathname;
  let searchParams = request.nextUrl.searchParams;

  // Portal domain: miraclemind.live (or ?domain=live in dev)
  const isPortalDomain =
    hostname === "miraclemind.live" ||
    hostname === "www.miraclemind.live" ||
    (hostname.includes("localhost") && searchParams.get("domain") === "live");

  // Only check auth for routes that ACTUALLY need it
  const needsAuth =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/portal') ||
    isPortalDomain;

  // Subdomain routing - handle admin.* subdomains
  // admin.miraclemind.dev/templates → /admin/templates?domain=dev
  const hostParts = hostname.split(".");
  let shouldRewrite = false;
  let rewriteUrl: URL | null = null;

  if (hostParts[0] === "admin") {
    shouldRewrite = true;
    const baseDomain = hostParts.slice(1).join(".");
    let domainParam = "dev"; // default to dev

    if (baseDomain.includes("miraclemind.live")) {
      domainParam = "live";
    } else if (baseDomain.includes("matthewmiceli")) {
      domainParam = "matthew";
    }

    // Build the rewrite URL
    rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    rewriteUrl.searchParams.set("domain", domainParam);

    // Update pathname and searchParams for middleware checks
    pathname = rewriteUrl.pathname;
    searchParams = rewriteUrl.searchParams;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🔀 [Middleware] Subdomain rewrite: ${hostname}${request.nextUrl.pathname} → ${pathname}?domain=${domainParam}`
      );
    }
  }

  // Only update session for routes that need authentication
  let supabaseResponse = NextResponse.next({ request });
  let user = null;

  if (needsAuth) {
    const session = await updateSession(request);
    supabaseResponse = session.supabaseResponse;
    user = session.user;
  }

  // Get current domain
  const currentDomain = getDomainFromHeaders(request.headers);

  if (process.env.NODE_ENV === "development") {
    const authStatus = needsAuth ? `Auth Check: User ${user?.email || "None"}` : "Public Route";
    console.log(
      `🌐 [Middleware] ${hostname}${pathname} → Domain: ${currentDomain} | ${authStatus}`
    );
  }

  // Allow public shader embed routes (used in iframes on landing pages)
  if (pathname.startsWith("/shaders/") && pathname.includes("/embed")) {
    return supabaseResponse;
  }

  // Handle admin routes - only accessible via miraclemind.dev
  if (isAdminPath(pathname)) {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      // If already logged in, redirect to admin
      if (user) {
        const adminUrl = hostname.includes("localhost")
          ? `${request.nextUrl.protocol}//${hostname}/admin?domain=dev`
          : `https://miraclemind.dev/admin`;
        return NextResponse.redirect(new URL(adminUrl));
      }
      // Allow access to login page
      return supabaseResponse;
    }

    // Check authentication for all other admin routes
    if (!user) {
      const loginUrl = hostname.includes("localhost")
        ? `${request.nextUrl.protocol}//${hostname}/admin/login?domain=dev`
        : `https://miraclemind.dev/admin/login`;

      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔒 [Middleware] Auth required, redirecting to: ${loginUrl}`
        );
      }
      return NextResponse.redirect(new URL(loginUrl));
    }

    // Check if user is an admin (only admin@miraclemind.live can access /admin routes)
    const adminEmails = ["admin@miraclemind.live"];
    if (!adminEmails.includes(user.email ?? "")) {
      if (process.env.NODE_ENV === "development") {
        console.log(`🔒 [Middleware] Admin access denied for: ${user.email}`);
      }
      // Redirect non-admins to portal
      const portalUrl = hostname.includes("localhost")
        ? `${request.nextUrl.protocol}//${hostname}/portal?domain=live`
        : `https://miraclemind.live/portal`;
      return NextResponse.redirect(new URL(portalUrl));
    }

    // Allow admin access on miraclemind.dev, admin.* subdomains, or localhost with domain=dev
    const isValidAdminDomain =
      hostname.includes("miraclemind.dev") ||
      hostParts[0] === "admin" ||
      (hostname.includes("localhost") && searchParams.get("domain") === "dev");

    if (!isValidAdminDomain) {
      // Redirect admin attempts from other domains to miraclemind.dev
      const adminUrl = hostname.includes("localhost")
        ? `${request.nextUrl.protocol}//${hostname}/admin?domain=dev`
        : `https://miraclemind.dev${pathname}`;

      if (process.env.NODE_ENV === "development") {
        console.log(`🔒 [Middleware] Admin domain redirect: ${adminUrl}`);
      }
      return NextResponse.redirect(new URL(adminUrl));
    }
  }

  // Miracle Mind routes - only accessible via miraclemind.dev
  const miracleMindRoutes = ["/banyan", "/services", "/contact", "/stewardship"];
  const isMiracleMindRoute = miracleMindRoutes.some(route => pathname.startsWith(route));

  if (isMiracleMindRoute) {
    const isValidMiracleMindDomain =
      hostname.includes("miraclemind.dev") ||
      (hostname.includes("localhost") && searchParams.get("domain") === "dev");

    if (!isValidMiracleMindDomain) {
      // Redirect to miraclemind.dev
      const redirectUrl = hostname.includes("localhost")
        ? `${request.nextUrl.protocol}//${hostname}${pathname}?domain=dev`
        : `https://miraclemind.dev${pathname}`;

      if (process.env.NODE_ENV === "development") {
        console.log(`🌐 [Middleware] Miracle Mind route redirect: ${redirectUrl}`);
      }
      return NextResponse.redirect(new URL(redirectUrl));
    }
  }

  // Handle playground routes - only accessible via matthewmiceli.com (personal site)
  if (pathname.startsWith("/playground")) {
    // Allow playground access on matthewmiceli.com or localhost with domain=matthew
    const isValidPlaygroundDomain =
      hostname.includes("matthewmiceli.com") ||
      (hostname.includes("localhost") &&
        (searchParams.get("domain") === "matthew" ||
          !searchParams.has("domain")));

    if (!isValidPlaygroundDomain) {
      // Redirect playground attempts from other domains to matthewmiceli.com
      const playgroundUrl = hostname.includes("localhost")
        ? `${request.nextUrl.protocol}//${hostname}${pathname}?domain=matthew`
        : `https://matthewmiceli.com${pathname}`;

      if (process.env.NODE_ENV === "development") {
        console.log(`🎮 [Middleware] Playground redirect: ${playgroundUrl}`);
      }
      return NextResponse.redirect(new URL(playgroundUrl));
    }
  }

  // Handle portal routes on miraclemind.live domain
  if (isPortalDomain) {
    // Allow public access to login page (root of portal domain)
    if (pathname === "/" || pathname === "/portal/set-password") {
      return supabaseResponse;
    }

    // Require auth for all other portal routes
    if (pathname.startsWith("/portal") && !user) {
      const loginUrl = hostname.includes("localhost")
        ? `${request.nextUrl.protocol}//${hostname}/?domain=live`
        : `https://miraclemind.live/`;

      if (process.env.NODE_ENV === "development") {
        console.log(`🔒 [Middleware] Portal auth required, redirecting to: ${loginUrl}`);
      }
      return NextResponse.redirect(new URL(loginUrl));
    }
  }

  // Legacy /client/* routes redirect to /portal/*
  if (pathname.startsWith("/client/")) {
    const newPath = pathname.replace("/client/", "/portal/");
    const redirectUrl = hostname.includes("localhost")
      ? `${request.nextUrl.protocol}//${hostname}${newPath}?domain=live`
      : `https://miraclemind.live${newPath}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`🔀 [Middleware] Legacy client redirect: ${redirectUrl}`);
    }
    return NextResponse.redirect(new URL(redirectUrl));
  }

  // Add domain information to headers for server components
  supabaseResponse.headers.set("x-domain", currentDomain);
  supabaseResponse.headers.set("x-hostname", hostname);

  // Apply subdomain rewrite if needed
  if (shouldRewrite && rewriteUrl) {
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);

    // Copy all headers from supabase response (including auth cookies)
    supabaseResponse.headers.forEach((value, key) => {
      rewriteResponse.headers.set(key, value);
    });

    return rewriteResponse;
  }

  return supabaseResponse;
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
