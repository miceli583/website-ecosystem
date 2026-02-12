import { createClient } from "~/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const domain = searchParams.get("domain"); // Get domain from callback URL
  const next = searchParams.get("next") ?? "/admin";
  const errorDescription = searchParams.get("error_description");

  // Log for debugging auth issues
  if (process.env.NODE_ENV === "development") {
    console.log("[Auth Callback] URL:", request.url);
    console.log("[Auth Callback] code:", code ? "present" : "missing");
    console.log("[Auth Callback] next:", next);
    console.log("[Auth Callback] error_description:", errorDescription);
  }

  // Handle Supabase error responses (e.g., expired link)
  if (errorDescription) {
    console.error("[Auth Callback] Supabase error:", errorDescription);
    const errorUrl = new URL(`${origin}/auth/auth-code-error`);
    errorUrl.searchParams.set("error", errorDescription);
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[Auth Callback] Code exchange failed:", error.message);
    }

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      // Build redirect URL with proper domain parameter for localhost
      let redirectUrl: string;

      if (isLocalEnv && domain) {
        // Local development - preserve domain parameter
        redirectUrl = `${origin}${next}?domain=${domain}`;
      } else if (forwardedHost) {
        // Production with forwarded host
        redirectUrl = `https://${forwardedHost}${next}`;
      } else {
        // Fallback to origin
        redirectUrl = `${origin}${next}`;
      }

      if (process.env.NODE_ENV === "development") {
        console.log("[Auth Callback] Success, redirecting to:", redirectUrl);
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Return the user to an error page with instructions
  console.error("[Auth Callback] Failed - no code or exchange error");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
