"use client";

import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Globe,
  Inbox,
  FolderOpen,
  Send,
  Leaf,
  UserPlus,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import { api } from "~/trpc/react";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

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

const SOURCE_LABELS: Record<string, string> = {
  personal_site: "matthewmiceli.com",
  miracle_mind: "miraclemind.dev",
  banyan_waitlist: "Banyan Waitlist",
  referral: "Referral",
};

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } =
    api.analytics.getOverview.useQuery();
  const { data: sources, isLoading: sourcesLoading } =
    api.analytics.getContactSources.useQuery();
  const { data: revenue, isLoading: revenueLoading } =
    api.analytics.getRevenueSummary.useQuery();
  const { data: growth, isLoading: growthLoading } =
    api.analytics.getContactGrowth.useQuery();
  const { data: activity, isLoading: activityLoading } =
    api.analytics.getRecentActivity.useQuery();

  const revenueChange =
    revenue?.lastMonthRevenue && revenue.lastMonthRevenue > 0
      ? ((revenue.thisMonthRevenue - revenue.lastMonthRevenue) /
          revenue.lastMonthRevenue) *
        100
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400">
          Business metrics, contact growth, and revenue tracking
        </p>
      </div>

      {/* Key Metrics */}
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
                <Users className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Total Contacts
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.totalContacts ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Across all sources
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
                Early access waitlist
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FolderOpen className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Active Clients
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.activeClients ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {overview?.totalProjects ?? 0} project{(overview?.totalProjects ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Send className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Updates Sent
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.totalUpdates ?? 0}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Demos, proposals, invoices
              </p>
            </div>
          </>
        )}
      </div>

      {/* Revenue Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {revenueLoading ? (
          <>
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
                <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
                MRR
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {revenue?.connected
                  ? `$${formatCents(revenue.mrr)}`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {revenue?.connected ? "Monthly recurring" : "Stripe not connected"}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <DollarSign className="h-4 w-4" style={{ color: "#D4AF37" }} />
                This Month
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {revenue?.connected
                  ? `$${formatCents(revenue.thisMonthRevenue)}`
                  : "—"}
              </p>
              {revenueChange !== null && (
                <p
                  className="mt-1 flex items-center gap-1 text-xs"
                  style={{
                    color: revenueChange >= 0 ? "#4ade80" : "#f87171",
                  }}
                >
                  {revenueChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(revenueChange).toFixed(0)}% vs last month
                </p>
              )}
              {revenueChange === null && revenue?.connected && (
                <p className="mt-1 text-xs text-gray-500">vs last month</p>
              )}
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <BarChart3 className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Total Revenue
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {revenue?.connected
                  ? `$${formatCents(revenue.totalRevenue)}`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {revenue?.connected ? "All-time" : "Stripe not connected"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Contact Sources + Monthly Growth */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Contact Sources */}
        <div>
          <h2 className="mb-3 font-semibold text-white">Contact Sources</h2>
          <div
            className="rounded-lg border bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {sourcesLoading ? (
              <TableSkeleton rows={4} />
            ) : !sources?.length ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No contacts yet
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                {sources.map((source: { source: string; count: number }) => {
                  const total = sources.reduce((sum: number, s: { source: string; count: number }) => sum + s.count, 0);
                  const pct = total > 0 ? (source.count / total) * 100 : 0;
                  return (
                    <div
                      key={source.source}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-300">
                          {SOURCE_LABELS[source.source] ?? source.source}
                        </span>
                      </div>
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
                          {source.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Growth */}
        <div>
          <h2 className="mb-3 font-semibold text-white">Contact Growth</h2>
          <div
            className="rounded-lg border bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {growthLoading ? (
              <TableSkeleton rows={4} />
            ) : !growth?.length ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No data yet
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                {growth.map((month: { month: string; count: number }) => {
                  const maxCount = Math.max(...growth.map((m: { month: string; count: number }) => m.count));
                  const pct = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
                  const label = new Date(month.month + "-01").toLocaleDateString(
                    "en-US",
                    { month: "short", year: "numeric" }
                  );
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
                          {month.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Domain Breakdown */}
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
              {overview?.personalContacts ?? 0}
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
              {overview?.miracleMindContacts ?? 0}
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

      {/* Recent Activity */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Recent Contacts</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {activityLoading ? (
            <TableSkeleton />
          ) : !activity?.recentContacts?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No contacts yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {activity.recentContacts.map((contact: { id: string; name: string; email: string; source: string; status: string; createdAt: Date }) => (
                  <tr
                    key={contact.id}
                    className="border-b"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-2.5 text-gray-300">
                      {contact.name}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {contact.email}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {SOURCE_LABELS[contact.source] ?? contact.source}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor:
                            contact.status === "client"
                              ? "rgba(74, 222, 128, 0.1)"
                              : contact.status === "lead"
                                ? "rgba(250, 204, 21, 0.1)"
                                : contact.status === "prospect"
                                  ? "rgba(96, 165, 250, 0.1)"
                                  : "rgba(156, 163, 175, 0.1)",
                          color:
                            contact.status === "client"
                              ? "#4ade80"
                              : contact.status === "lead"
                                ? "#facc15"
                                : contact.status === "prospect"
                                  ? "#60a5fa"
                                  : "#9ca3af",
                        }}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(contact.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* External Links */}
      <div className="flex flex-wrap gap-3">
        <a
          href="https://posthog.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37" }}
        >
          PostHog
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a
          href="https://vercel.com/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37" }}
        >
          Vercel Analytics
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a
          href="https://sentry.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37" }}
        >
          Sentry
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
