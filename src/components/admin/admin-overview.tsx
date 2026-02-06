"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  Landmark,
  Users,
  MailOpen,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Clock,
  UserCheck,
  CalendarClock,
  BookOpen,
  Palette,
  Rocket,
  Zap,
  Code2,
  ExternalLink,
} from "lucide-react";
import { api } from "~/trpc/react";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function KpiSkeleton() {
  return (
    <div
      className="animate-pulse rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="h-4 w-20 rounded bg-white/10" />
      <div className="mt-3 h-8 w-24 rounded bg-white/10" />
      <div className="mt-2 h-3 w-28 rounded bg-white/5" />
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div
      className="animate-pulse rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="h-5 w-32 rounded bg-white/10" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 flex-1 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  lead: "#facc15",
  prospect: "#60a5fa",
  client: "#4ade80",
  inactive: "#9ca3af",
  churned: "#f87171",
};

export function AdminOverview() {
  const { data: analyticsData, isLoading: analyticsLoading } =
    api.analytics.getOverview.useQuery();
  const { data: pipelineData, isLoading: pipelineLoading } =
    api.crm.getPipelineStats.useQuery();
  const { data: financeData, isLoading: financeLoading } =
    api.finance.getOverview.useQuery();
  const { data: recentContacts, isLoading: contactsLoading } =
    api.crm.getContacts.useQuery({ limit: 5 });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12">
          <Image
            src="/brand/miracle-mind-orbit-star-v3.svg"
            alt="Miracle Mind"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">
            Miracle Mind Ecosystem Overview
          </p>
        </div>
      </div>

      {/* Row 1: Headline KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financeLoading ? (
          <KpiSkeleton />
        ) : (
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
              MRR
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {financeData?.stripe.connected
                ? `$${formatCents(financeData.stripe.mrr)}`
                : "—"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {financeData?.stripe.connected
                ? `${financeData.stripe.activeSubscriptions} active sub${financeData.stripe.activeSubscriptions !== 1 ? "s" : ""}`
                : "Stripe not connected"}
            </p>
          </div>
        )}

        {financeLoading ? (
          <KpiSkeleton />
        ) : (
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Landmark className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Bank Balance
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {financeData?.mercury.connected
                ? `$${(financeData.mercury.totalAvailable / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                : "—"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {financeData?.mercury.connected
                ? "Mercury available"
                : "Mercury not connected"}
            </p>
          </div>
        )}

        {pipelineLoading ? (
          <KpiSkeleton />
        ) : (
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="h-4 w-4" style={{ color: "#D4AF37" }} />
              CRM Contacts
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {pipelineData?.total ?? 0}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {(pipelineData as Record<string, number>)?.client ?? 0} clients,{" "}
              {(pipelineData as Record<string, number>)?.lead ?? 0} leads
            </p>
          </div>
        )}

        {analyticsLoading ? (
          <KpiSkeleton />
        ) : (
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MailOpen className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Unread Submissions
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {analyticsData?.unreadSubmissions ?? 0}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {analyticsData?.submissionsThisMonth ?? 0} this month
            </p>
          </div>
        )}
      </div>

      {/* Row 2: Section Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Finance Summary */}
        <Link href="/admin/finance" className="group block">
          <div
            className="h-full rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <DollarSign
                    className="h-4 w-4"
                    style={{ color: "#D4AF37" }}
                  />
                </div>
                <h3 className="font-semibold text-white">Finance</h3>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
            </div>
            {financeLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
              </div>
            ) : (
              <div className="space-y-1 text-sm text-gray-400">
                <p>
                  Revenue this month:{" "}
                  <span className="text-white">
                    {financeData?.stripe.connected
                      ? `$${formatCents(financeData.stripe.thisMonthRevenue)}`
                      : "—"}
                  </span>
                </p>
                <p>
                  Total revenue:{" "}
                  <span className="text-white">
                    {financeData?.stripe.connected
                      ? `$${formatCents(financeData.stripe.totalRevenue)}`
                      : "—"}
                  </span>
                </p>
              </div>
            )}
          </div>
        </Link>

        {/* CRM Summary */}
        <Link href="/admin/crm" className="group block">
          <div
            className="h-full rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <Users
                    className="h-4 w-4"
                    style={{ color: "#D4AF37" }}
                  />
                </div>
                <h3 className="font-semibold text-white">CRM</h3>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
            </div>
            {pipelineLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
              </div>
            ) : (
              <>
                <p className="mb-2 text-sm text-gray-400">
                  {pipelineData?.total ?? 0} contacts across pipeline
                </p>
                {pipelineData && pipelineData.total > 0 && (
                  <div className="flex h-2 overflow-hidden rounded-full bg-white/5">
                    {(
                      ["lead", "prospect", "client", "inactive", "churned"] as const
                    ).map((status) => {
                      const value =
                        (pipelineData as Record<string, number>)[status] ?? 0;
                      const pct =
                        pipelineData.total > 0
                          ? (value / pipelineData.total) * 100
                          : 0;
                      if (pct === 0) return null;
                      return (
                        <div
                          key={status}
                          style={{
                            width: `${pct}%`,
                            backgroundColor: STATUS_COLORS[status],
                            opacity: 0.7,
                          }}
                          title={`${status}: ${value}`}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </Link>

        {/* Analytics Summary */}
        <Link href="/admin/analytics" className="group block">
          <div
            className="h-full rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <BarChart3
                    className="h-4 w-4"
                    style={{ color: "#D4AF37" }}
                  />
                </div>
                <h3 className="font-semibold text-white">Analytics</h3>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
            </div>
            {analyticsLoading ? (
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
              </div>
            ) : (
              <div className="space-y-1 text-sm text-gray-400">
                <p>
                  Total submissions:{" "}
                  <span className="text-white">
                    {analyticsData?.totalSubmissions ?? 0}
                  </span>
                </p>
                <p>
                  Banyan signups:{" "}
                  <span className="text-white">
                    {analyticsData?.banyanSignups ?? 0}
                  </span>
                </p>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Row 3: Recent Activity Feed */}
      <section>
        <h2 className="mb-3 font-semibold text-gray-300">Recent Activity</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {contactsLoading ? (
            <ActivitySkeleton />
          ) : !recentContacts?.contacts?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No recent activity
            </div>
          ) : (
            <div
              className="divide-y"
              style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
            >
              {recentContacts.contacts.map(
                (contact: {
                  id: string;
                  name: string;
                  email: string;
                  source: string;
                  status: string;
                  lastContactAt: Date;
                }) => (
                  <div key={contact.id} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {contact.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {contact.email}
                        </p>
                      </div>
                      <div className="ml-3 flex flex-shrink-0 items-center gap-2">
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${STATUS_COLORS[contact.status] ?? "#9ca3af"}15`,
                            color:
                              STATUS_COLORS[contact.status] ?? "#9ca3af",
                          }}
                        >
                          {contact.status}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          {new Date(contact.lastContactAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Row 4: Quick Links (compact) */}
      <section>
        <h2 className="mb-3 font-semibold text-gray-300">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {[
            {
              title: "Clients",
              href: "/admin/clients",
              icon: UserCheck,
            },
            {
              title: "Daily Values",
              href: "/admin/daily-values",
              icon: CalendarClock,
            },
            { title: "Blog", href: "/admin/blog", icon: BookOpen },
            { title: "Brand", href: "/admin/brand", icon: Palette },
            {
              title: "Templates",
              href: "/admin/templates",
              icon: Rocket,
            },
            { title: "Shaders", href: "/admin/shaders", icon: Zap },
            {
              title: "Playground",
              href: "/admin/playground",
              icon: Code2,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2 rounded-lg border bg-white/5 px-3 py-2.5 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <item.icon
                className="h-4 w-4 flex-shrink-0"
                style={{ color: "#D4AF37" }}
              />
              <span className="truncate text-sm text-gray-300 group-hover:text-white">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Sites */}
      <section>
        <h2 className="mb-3 font-semibold text-gray-300">Live Sites</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "matthewmiceli.com",
              href: "https://matthewmiceli.com",
            },
            {
              title: "miraclemind.dev",
              href: "https://miraclemind.dev",
            },
            {
              title: "miraclemind.live",
              href: "https://miraclemind.live",
            },
          ].map((site) => (
            <a
              key={site.href}
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border bg-white/5 px-4 py-3 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: "#D4AF37" }}
                />
                <span className="text-sm font-medium text-gray-300">
                  {site.title}
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-500 transition-colors group-hover:text-gray-300" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
