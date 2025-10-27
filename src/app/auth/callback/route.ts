import { createClient } from "~/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const domain = searchParams.get("domain"); // Get domain from callback URL
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
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

      return NextResponse.redirect(redirectUrl);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
