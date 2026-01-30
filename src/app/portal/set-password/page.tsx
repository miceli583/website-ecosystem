"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, Loader2, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "~/lib/supabase/client";
import { api } from "~/trpc/react";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const linkAuthUserMutation = api.portal.linkAuthUser.useMutation();

  // Check if user has a valid session from the magic link
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // No valid session - redirect to login
        router.push("/?domain=live");
        return;
      }

      setUserEmail(user.email ?? null);
    };

    checkSession();
  }, [router]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      // Link the auth user to their portal_users record
      try {
        await linkAuthUserMutation.mutateAsync();
      } catch (linkError) {
        // If linking fails, it might be because the account is already linked
        // or the user is an admin - not a critical error
        console.warn("Could not link auth user:", linkError);
      }

      setIsSuccess(true);

      // Redirect to portal after brief delay
      setTimeout(() => {
        router.push("/portal?domain=live");
      }, 1500);
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="relative flex h-screen min-h-screen items-center justify-center overflow-hidden bg-black px-4">
        <div className="absolute inset-0 flex items-center justify-center pt-8">
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
                <CheckCircle className="h-8 w-8" style={{ color: "#D4AF37" }} />
              </div>
              <h1
                className="mb-2 text-2xl font-bold text-white"
                style={{ fontFamily: "var(--font-quattrocento-sans)" }}
              >
                Password Set!
              </h1>
              <p className="text-gray-400">Redirecting to your portal...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      {/* Background shader */}
      <div className="absolute inset-0 flex items-center justify-center pt-8">
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
            {/* Header */}
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
            >
              <Lock className="h-8 w-8" style={{ color: "#D4AF37" }} />
            </div>
            <h1
              className="mb-2 text-center text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-quattrocento-sans)" }}
            >
              Set Your Password
            </h1>
            <p className="mb-8 text-center text-sm text-gray-400">
              {userEmail ? (
                <>
                  Create a password for{" "}
                  <span className="text-white">{userEmail}</span>
                </>
              ) : (
                "Create a secure password for your account"
              )}
            </p>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-900/50 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border bg-white/5 px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                    style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border bg-white/5 px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                    style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                    placeholder="Re-enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
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
                Set Password
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
