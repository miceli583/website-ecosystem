"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight } from "lucide-react";

export function MiracleMindLiveHomePage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="relative flex min-h-[100vh] items-center justify-center bg-black px-4 pt-32 pb-24">
      {/* Background shader - centered and enlarged */}
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
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mb-8 text-center text-sm text-gray-400">
              {mode === "signin"
                ? "Sign in to access your client portal"
                : "Get started with your client portal"}
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                    style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                    placeholder="Your name"
                  />
                </div>
              )}

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
                  className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                  style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  placeholder="you@example.com"
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
                  className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                  style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  placeholder="••••••••"
                />
              </div>

              {mode === "signin" && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm transition-colors hover:underline"
                    style={{ color: "#D4AF37" }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-3 text-black shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                {mode === "signin" ? "Sign In" : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Toggle mode */}
            <div className="mt-6 text-center text-sm text-gray-400">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="font-medium transition-colors hover:underline"
                    style={{ color: "#D4AF37" }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("signin")}
                    className="font-medium transition-colors hover:underline"
                    style={{ color: "#D4AF37" }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
