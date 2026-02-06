"use client";

import {
  Inbox,
  Leaf,
  Mail,
  MailOpen,
  Clock,
  ExternalLink,
  Activity,
  Gauge,
  AlertCircle,
} from "lucide-react";
import { api } from "~/trpc/react";

function MetricSkeleton() {
  return (
    <div
      className="animate-pulse rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="mt-3 h-8 w-20 rounded bg-white/10" />
      <div className="mt-2 h-3 w-32 rounded bg-white/5" />
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 flex-1 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } =
    api.analytics.getOverview.useQuery();
  const { data: growth, isLoading: growthLoading } =
    api.analytics.getSubmissionGrowth.useQuery();
  const { data: activity, isLoading: activityLoading } =
    api.analytics.getRecentActivity.useQuery();

  type Submission = { id: number; name: string; email: string; message: string; read: boolean; createdAt: Date };
  type Signup = { id: number; name: string; email: string; role: string | null; createdAt: Date };

  // Merge recent activity into a unified feed sorted by date
  const recentFeed = activity
    ? [
        ...activity.mmSubmissions.map((s: Submission) => ({
          ...s,
          source: "miraclemind.dev" as const,
          type: "submission" as const,
        })),
        ...activity.personalSubmissions.map((s: Submission) => ({
          ...s,
          source: "matthewmiceli.com" as const,
          type: "submission" as const,
        })),
        ...activity.banyanSignups.map((s: Signup) => ({
          ...s,
          source: "Banyan" as const,
          type: "signup" as const,
          read: true,
          message: s.role ?? "Early access signup",
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400">
          Site submissions, signups, and domain activity
        </p>
      </div>

      {/* Row 1: Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Inbox className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Total Submissions
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.totalSubmissions ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                All contact forms, all time
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" style={{ color: "#D4AF37" }} />
                This Month
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.submissionsThisMonth ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Submissions (last 30 days)
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Leaf className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Banyan Signups
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.banyanSignups ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {overview?.banyanSignupsRecent ?? 0} in last 30 days
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MailOpen className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Unread
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.unreadSubmissions ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Submissions awaiting review
              </p>
            </div>
          </>
        )}
      </div>

      {/* Row 2: Domain Activity */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Domain Activity</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#D4AF37" }}
              />
              <span className="text-sm font-medium text-white">
                matthewmiceli.com
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-white">
              {overview?.personalSubmissions ?? 0}
            </p>
            <p className="text-xs text-gray-500">Contact submissions</p>
          </div>
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#D4AF37" }}
              />
              <span className="text-sm font-medium text-white">
                miraclemind.dev
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-white">
              {overview?.miracleMindSubmissions ?? 0}
            </p>
            <p className="text-xs text-gray-500">Contact submissions</p>
          </div>
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#D4AF37" }}
              />
              <span className="text-sm font-medium text-white">
                Banyan LifeOS
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-white">
              {overview?.banyanSignups ?? 0}
            </p>
            <p className="text-xs text-gray-500">Early access signups</p>
          </div>
        </div>
      </div>

      {/* Row 3: Submission Growth + Recent Submissions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Submission Growth */}
        <div>
          <h2 className="mb-3 font-semibold text-white">Submission Growth</h2>
          <div
            className="rounded-lg border bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {growthLoading ? (
              <TableSkeleton rows={6} />
            ) : !growth?.length ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No data yet
              </div>
            ) : (
              <div
                className="divide-y"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                {growth.map((month) => {
                  const maxTotal = Math.max(...growth.map((m) => m.total));
                  const pct = maxTotal > 0 ? (month.total / maxTotal) * 100 : 0;
                  const label = new Date(
                    month.month + "-01"
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <div
                      key={month.month}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span className="text-sm text-gray-400">{label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${pct}%`,
                              background:
                                "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-sm font-medium text-white">
                          {month.total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div>
          <h2 className="mb-3 font-semibold text-white">Recent Submissions</h2>
          <div
            className="rounded-lg border bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {activityLoading ? (
              <TableSkeleton rows={6} />
            ) : !recentFeed.length ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No submissions yet
              </div>
            ) : (
              <div
                className="divide-y"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                {recentFeed.map((item) => (
                  <div key={`${item.source}-${item.id}`} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-white">
                            {item.name}
                          </p>
                          {!item.read && (
                            <span
                              className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: "#D4AF37" }}
                            />
                          )}
                        </div>
                        <p className="truncate text-xs text-gray-500">
                          {item.email}
                        </p>
                      </div>
                      <div className="ml-3 flex flex-shrink-0 items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {item.source}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 4: External Tools */}
      <div>
        <h2 className="mb-3 font-semibold text-white">External Tools</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white"
            style={{
              borderColor: "rgba(212, 175, 55, 0.2)",
              color: "#D4AF37",
            }}
          >
            PostHog
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white"
            style={{
              borderColor: "rgba(212, 175, 55, 0.2)",
              color: "#D4AF37",
            }}
          >
            Vercel Analytics
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://sentry.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white"
            style={{
              borderColor: "rgba(212, 175, 55, 0.2)",
              color: "#D4AF37",
            }}
          >
            Sentry
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Row 5: Coming Soon */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Coming Soon</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div
            className="rounded-lg border border-dashed p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              Page Views & Sessions
            </div>
            <p className="mt-2 text-xs text-gray-600">
              PostHog integration for traffic analytics
            </p>
          </div>
          <div
            className="rounded-lg border border-dashed p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Gauge className="h-4 w-4" />
              Web Vitals
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Vercel Analytics for Core Web Vitals
            </p>
          </div>
          <div
            className="rounded-lg border border-dashed p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              Error Tracking
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Sentry integration for error monitoring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
