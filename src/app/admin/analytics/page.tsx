"use client";

import {
  BarChart3,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Globe,
} from "lucide-react";

/**
 * Analytics Dashboard (Placeholder)
 * Will integrate with PostHog/Vercel Analytics
 */
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400">
          Site traffic, user behavior, and performance metrics
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div
        className="flex items-start gap-3 rounded-lg border p-6"
        style={{
          borderColor: "rgba(212, 175, 55, 0.3)",
          backgroundColor: "rgba(212, 175, 55, 0.05)",
        }}
      >
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#D4AF37" }} />
        <div>
          <p className="font-medium text-white">Analytics Dashboard Coming Soon</p>
          <p className="mt-1 text-sm text-gray-400">
            This dashboard will provide insights across all three domains:
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-black/30 p-4" style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-white">matthewmiceli.com</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Portfolio traffic & engagement</p>
            </div>
            <div className="rounded-lg border bg-black/30 p-4" style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-white">miraclemind.dev</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">BANYAN signups & conversions</p>
            </div>
            <div className="rounded-lg border bg-black/30 p-4" style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-white">miraclemind.live</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Client portal usage</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-300">Recommended Stack:</p>
            <ul className="space-y-1 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span style={{ color: "#D4AF37" }}>1.</span>
                <strong>PostHog</strong> — Product analytics, session replays, feature flags (1M events/mo free)
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "#D4AF37" }}>2.</span>
                <strong>Vercel Analytics</strong> — Core Web Vitals, zero-config (2.5K events/mo free)
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "#D4AF37" }}>3.</span>
                <strong>Sentry</strong> — Error tracking, performance monitoring (5K errors/mo free)
              </li>
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
              style={{ color: "#D4AF37" }}
            >
              Vercel Analytics
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://posthog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
              style={{ color: "#D4AF37" }}
            >
              PostHog
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="https://sentry.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
              style={{ color: "#D4AF37" }}
            >
              Sentry
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Placeholder Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Page Views", value: "—", icon: Eye, description: "Last 30 days" },
          { label: "Unique Visitors", value: "—", icon: Users, description: "Last 30 days" },
          { label: "Avg. Session", value: "—", icon: Clock, description: "Duration" },
          { label: "Bounce Rate", value: "—", icon: MousePointerClick, description: "Single page visits" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <stat.icon className="h-4 w-4" style={{ color: "#D4AF37" }} />
              {stat.label}
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-600">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-600">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Top Pages Placeholder */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Top Pages</h2>
        <div
          className="flex flex-col items-center justify-center rounded-lg border bg-white/5 py-12"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <BarChart3 className="mb-3 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">Connect analytics to see top pages</p>
        </div>
      </div>
    </div>
  );
}
