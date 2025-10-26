import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDomainFromHeaders, isAdminPath, DOMAINS } from "~/lib/domains";

/**
 * Multi-domain routing middleware
 * Handles domain-specific routing and admin/playground protection
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Get current domain
  const currentDomain = getDomainFromHeaders(request.headers);

  if (process.env.NODE_ENV === "development") {
    console.log(
      `🌐 [Middleware] ${hostname}${pathname} → Domain: ${currentDomain}`
    );
  }

  // Handle admin routes - only accessible via miraclemind.dev
  if (isAdminPath(pathname)) {
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
        console.log(`🔒 [Middleware] Admin redirect: ${adminUrl}`);
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
  const response = NextResponse.next();
  response.headers.set("x-domain", currentDomain);
  response.headers.set("x-hostname", hostname);

  return response;
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
