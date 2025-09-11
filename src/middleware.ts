import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDomainFromHeaders, isAdminPath, DOMAINS } from "~/lib/domains";

/**
 * Multi-domain routing middleware
 * Handles domain-specific routing and admin protection
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Get current domain
  const currentDomain = getDomainFromHeaders(request.headers);
  
  console.log(`🌐 [Middleware] ${hostname}${pathname} → Domain: ${currentDomain}`);

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
      
      console.log(`🔒 [Middleware] Admin redirect: ${adminUrl}`);
      return NextResponse.redirect(new URL(adminUrl));
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