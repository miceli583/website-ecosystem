"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { createClient } from "~/lib/supabase/client";
import { api } from "~/trpc/react";

type Mode = "signin" | "claim-form" | "claim-check" | "claim-sent";

export function MiracleMindLiveHomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [claimName, setClaimName] = useState<string | null>(null);

  const checkEmailQuery = api.portal.checkEmailForClaim.useQuery(
    { email },
    { enabled: false }
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      // Success - redirect to portal
      router.push("/portal?domain=live");
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleClaimAccount = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      // Use current origin so PKCE code_verifier stays on same domain
      const origin = window.location.origin;
      const redirectUrl = `${origin}/auth/callback?domain=live&next=/portal/set-password`;

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (otpError) {
        setError(otpError.message);
        setIsLoading(false);
        return;
      }

      setMode("claim-sent");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      // Use current origin so PKCE code_verifier stays on same domain
      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${origin}/auth/callback?domain=live&next=/portal/set-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setError(null);
        setMode("claim-sent");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Magic link sent confirmation
  if (mode === "claim-sent") {
    return (
      <div className="relative flex h-screen min-h-screen items-center justify-center overflow-hidden bg-black px-4">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pt-8">
          <div className="h-[840px] w-[840px] sm:h-[980px] sm:w-[980px]">
            <iframe
              src="/shaders/orbit-star/embed"
              className="h-full w-full border-0 opacity-30"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card
            className="bg-white/5 backdrop-blur-md"
            style={{
              borderColor: "rgba(212, 175, 55, 0.3)",
              borderWidth: "1px",
            }}
          >
            <CardContent className="p-8 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <Mail className="h-8 w-8" style={{ color: "#D4AF37" }} />
              </div>
              <h1
                className="mb-2 text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-quattrocento-sans)" }}
              >
                Check Your Email
              </h1>
              <p className="mb-6 text-gray-400">
                We sent a link to <span className="text-white">{email}</span>.
                Open the link on this device and browser to complete setup.
              </p>
              <button
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className="text-sm transition-colors hover:underline"
                style={{ color: "#D4AF37" }}
              >
                Back to sign in
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Claim account confirmation
  if (mode === "claim-check") {
    return (
      <div className="relative flex h-screen min-h-screen items-center justify-center overflow-hidden bg-black px-4">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pt-8">
          <div className="h-[840px] w-[840px] sm:h-[980px] sm:w-[980px]">
            <iframe
              src="/shaders/orbit-star/embed"
              className="h-full w-full border-0 opacity-30"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card
            className="bg-white/5 backdrop-blur-md"
            style={{
              borderColor: "rgba(212, 175, 55, 0.3)",
              borderWidth: "1px",
            }}
          >
            <CardContent className="p-8">
              <h1
                className="mb-2 text-center text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-quattrocento-sans)" }}
              >
                Welcome{claimName ? `, ${claimName}` : ""}!
              </h1>
              <p className="mb-6 text-center text-sm text-gray-400">
                Your portal account is ready to be activated. We&apos;ll send
                you a magic link to set up your password.
              </p>

              {error && (
                <div className="mb-4 rounded-md bg-red-900/50 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <Button
                onClick={handleClaimAccount}
                disabled={isLoading}
                className="w-full py-3 text-black shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Send Magic Link
              </Button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className="text-sm text-gray-400 transition-colors hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Claim account form - just email
  if (mode === "claim-form") {
    const handleCheckEmail = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) {
        setError("Please enter your email address");
        return;
      }
      setIsLoading(true);
      setError(null);
      const { data } = await checkEmailQuery.refetch();
      setIsLoading(false);
      if (data?.canClaim) {
        setClaimName(data.name ?? null);
        setMode("claim-check");
      } else if (data?.exists) {
        setError("This account is already active. Please sign in.");
      } else {
        setError("No account found for this email. Contact your account manager.");
      }
    };

    return (
      <div className="relative flex h-screen min-h-screen items-center justify-center overflow-hidden bg-black px-4">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pt-8">
          <div className="h-[840px] w-[840px] sm:h-[980px] sm:w-[980px]">
            <iframe
              src="/shaders/orbit-star/embed"
              className="h-full w-full border-0 opacity-30"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card
            className="bg-white/5 backdrop-blur-md"
            style={{
              borderColor: "rgba(212, 175, 55, 0.3)",
              borderWidth: "1px",
            }}
          >
            <CardContent className="p-8">
              <h1
                className="mb-2 text-center text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-quattrocento-sans)" }}
              >
                Claim Your Account
              </h1>
              <p className="mb-8 text-center text-sm text-gray-400">
                Enter the email address your account was created with
              </p>

              {error && (
                <div className="mb-4 rounded-md bg-red-900/50 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckEmail} className="space-y-4">
                <div>
                  <label
                    htmlFor="claim-email"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="claim-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                    style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-black shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-400">
                Already have a password?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className="font-medium transition-colors hover:underline"
                  style={{ color: "#D4AF37" }}
                >
                  Sign in
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Sign in form
  return (
    <div className="relative flex h-screen min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      {/* Background shader - centered and enlarged */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pt-8">
        <div className="h-[840px] w-[840px] sm:h-[980px] sm:w-[980px]">
          <iframe
            src="/shaders/orbit-star/embed"
            className="h-full w-full border-0 opacity-30"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <Card
          className="bg-white/5 backdrop-blur-md"
          style={{
            borderColor: "rgba(212, 175, 55, 0.3)",
            borderWidth: "1px",
          }}
        >
          <CardContent className="p-8">
            {/* Header */}
            <h1
              className="mb-2 text-center text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-quattrocento-sans)" }}
            >
              Client Portal
            </h1>
            <p className="mb-8 text-center text-sm text-gray-400">
              Sign in to access your portal
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-900/50 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                  style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                  style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm transition-colors hover:underline"
                  style={{ color: "#D4AF37" }}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-black shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Claim account link */}
            <div className="mt-6 text-center text-sm text-gray-400">
              First time here?{" "}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode("claim-form");
                }}
                className="font-medium transition-colors hover:underline"
                style={{ color: "#D4AF37" }}
              >
                Claim your account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
