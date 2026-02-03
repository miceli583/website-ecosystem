"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "~/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Login successful! Redirecting...");
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div
        className="w-full max-w-md rounded-xl border bg-gray-900 p-8 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        {/* Header */}
        <div className="mb-8 space-y-3 text-center">
          <Image
            src="/brand/miracle-mind-logo-no-slogan.svg"
            alt="Miracle Mind"
            width={180}
            height={40}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm text-gray-500">
            Sign in to access the admin panel
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-950/30 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-950/30 p-3 text-sm text-green-400">
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 pl-10 text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 pl-10 text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-md text-sm font-medium text-black transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "#D4AF37" }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Authorized personnel only. All access is logged and monitored.
        </p>
      </div>
    </div>
  );
}
