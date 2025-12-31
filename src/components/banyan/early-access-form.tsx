"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export function BanyanEarlyAccessForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/banyan/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
      setFormData({ fullName: "", email: "", role: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit. Please try again."
      );
    }
  };

  if (status === "success") {
    return (
      <Card
        className="bg-white/5 backdrop-blur-md"
        style={{
          borderColor: "rgba(212, 175, 55, 0.4)",
          borderWidth: "2px",
        }}
      >
        <CardContent className="p-12 text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <CheckCircle className="h-16 w-16" style={{ color: "#D4AF37" }} />
          </div>
          <h3
            className="mb-4 text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-quattrocento-sans)" }}
          >
            You're on the List!
          </h3>
          <p className="mb-6 text-lg text-gray-300" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Thank you for your interest in Banyan. We'll reach out within 48 hours
            to get you started.
          </p>
          <Button
            variant="outline"
            onClick={() => setStatus("idle")}
            className="border-2 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            style={{
              borderColor: "rgba(212, 175, 55, 0.5)",
              color: "#D4AF37",
            }}
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      id="signup"
      className="bg-white/5 backdrop-blur-md"
      style={{
        borderColor: "rgba(212, 175, 55, 0.4)",
        borderWidth: "2px",
      }}
    >
      <CardContent className="p-12">
        <h3
          className="mb-6 text-3xl font-bold text-white"
          style={{
            fontFamily: "var(--font-quattrocento-sans)",
            letterSpacing: "0.02em",
          }}
        >
          Join the Beta
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-gray-200"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Full Name <span style={{ color: "#D4AF37" }}>*</span>
            </label>
            <input
              type="text"
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full rounded-lg border bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
              }}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-200"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Email <span style={{ color: "#D4AF37" }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg border bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
              }}
              placeholder="you@example.com"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-gray-200"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Primary Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full rounded-lg border bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
              }}
            >
              <option value="" className="bg-black">
                Select your role
              </option>
              <option value="Founder" className="bg-black">
                Founder
              </option>
              <option value="Creator" className="bg-black">
                Creator
              </option>
              <option value="Developer" className="bg-black">
                Developer
              </option>
              <option value="Coach" className="bg-black">
                Coach
              </option>
              <option value="Other" className="bg-black">
                Other
              </option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-200"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              What brings you to Banyan?
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full rounded-lg border bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
              }}
              placeholder="Tell us about your goals, challenges, or what you're hoping to achieve..."
            />
          </div>

          {/* Error Message */}
          {status === "error" && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={status === "loading"}
            size="lg"
            className="w-full px-8 text-black shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Request Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-gray-400">
            Limited spots available. We'll reach out within 48 hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
