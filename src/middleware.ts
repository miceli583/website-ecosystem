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
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Update Supabase session
  const { supabaseResponse, user } = await updateSession(request);

  // Get current domain
  const currentDomain = getDomainFromHeaders(request.headers);

  if (process.env.NODE_ENV === "development") {
    console.log(
      `🌐 [Middleware] ${hostname}${pathname} → Domain: ${currentDomain} | User: ${user?.email || "None"}`
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

    // Allow admin access on miraclemind.dev or localhost with domain=dev
    const isValidAdminDomain =
      hostname.includes("miraclemind.dev") ||
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

  // Add domain information to headers for server components
  supabaseResponse.headers.set("x-domain", currentDomain);
  supabaseResponse.headers.set("x-hostname", hostname);

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
