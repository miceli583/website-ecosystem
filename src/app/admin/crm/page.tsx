"use client";

import Link from "next/link";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  ArrowUpRight,
  Globe,
  Clock,
  Inbox,
  Leaf,
} from "lucide-react";
import { api } from "~/trpc/react";

function MetricSkeleton() {
  return (
    <div
      className="animate-pulse rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="mt-3 h-8 w-16 rounded bg-white/10" />
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

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  lead: { label: "Lead", bg: "rgba(250, 204, 21, 0.1)", color: "#facc15" },
  prospect: {
    label: "Prospect",
    bg: "rgba(96, 165, 250, 0.1)",
    color: "#60a5fa",
  },
  client: {
    label: "Client",
    bg: "rgba(74, 222, 128, 0.1)",
    color: "#4ade80",
  },
  inactive: {
    label: "Inactive",
    bg: "rgba(156, 163, 175, 0.1)",
    color: "#9ca3af",
  },
  churned: {
    label: "Churned",
    bg: "rgba(248, 113, 113, 0.1)",
    color: "#f87171",
  },
};

const SOURCE_LABELS: Record<string, string> = {
  personal_site: "matthewmiceli.com",
  miracle_mind: "miraclemind.dev",
  banyan_waitlist: "Banyan Waitlist",
  referral: "Referral",
};

export default function CrmPage() {
  const { data: pipeline, isLoading: pipelineLoading } =
    api.crm.getPipelineStats.useQuery();
  const { data: sources, isLoading: sourcesLoading } =
    api.crm.getSourceBreakdown.useQuery();
  const { data: growth, isLoading: growthLoading } =
    api.crm.getContactGrowth.useQuery();
  const { data: contactsData, isLoading: contactsLoading } =
    api.crm.getContacts.useQuery({ limit: 10 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM</h1>
          <p className="text-sm text-gray-400">
            Contact pipeline, leads, and client relationships
          </p>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {pipelineLoading ? (
          Array.from({ length: 5 }).map((_, i) => <MetricSkeleton key={i} />)
        ) : (
          <>
            {(["lead", "prospect", "client", "inactive", "churned"] as const).map(
              (status) => {
                const config = STATUS_CONFIG[status]!;
                const value = (pipeline as Record<string, number>)?.[status] ?? 0;
                return (
                  <div
                    key={status}
                    className="rounded-lg border bg-white/5 p-5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        {status === "lead" ? (
                          <UserPlus className="h-3 w-3" />
                        ) : status === "prospect" ? (
                          <Users className="h-3 w-3" />
                        ) : status === "client" ? (
                          <UserCheck className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3" />
                        )}
                      </span>
                      {config.label}s
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">{value}</p>
                  </div>
                );
              }
            )}
          </>
        )}
      </div>

      {/* Pipeline Bar */}
      {!pipelineLoading && pipeline && pipeline.total > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
            <span>Pipeline Distribution</span>
            <span>{pipeline.total} total contacts</span>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-white/5">
            {(["lead", "prospect", "client", "inactive", "churned"] as const).map(
              (status) => {
                const value = (pipeline as Record<string, number>)[status] ?? 0;
                const pct = pipeline.total > 0 ? (value / pipeline.total) * 100 : 0;
                if (pct === 0) return null;
                return (
                  <div
                    key={status}
                    className="transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: STATUS_CONFIG[status]!.color,
                      opacity: 0.7,
                    }}
                    title={`${STATUS_CONFIG[status]!.label}: ${value}`}
                  />
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/crm/contacts"
          className="group rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <Users className="h-5 w-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">All Contacts</h3>
                <p className="text-sm text-gray-400">
                  Master CRM database
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </div>
        </Link>

        <Link
          href="/admin/crm/leads"
          className="group rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <Inbox className="h-5 w-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Leads & Signups</h3>
                <p className="text-sm text-gray-400">
                  Contact forms & Banyan waitlist
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </div>
        </Link>

        <Link
          href="/admin/clients"
          className="group rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <UserCheck className="h-5 w-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Clients</h3>
                <p className="text-sm text-gray-400">
                  Active client management
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </div>
        </Link>
      </div>

      {/* Sources + Contact Growth */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Source Breakdown */}
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
                        <div className="w-20 overflow-hidden rounded-full bg-white/5">
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

        {/* Contact Growth */}
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
                        <div className="w-20 overflow-hidden rounded-full bg-white/5">
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

      {/* Recent Contacts */}
      <div>
        <div>
          <h2 className="mb-3 font-semibold text-white">Recent Contacts</h2>
          <div
            className="rounded-lg border bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {contactsLoading ? (
              <TableSkeleton rows={5} />
            ) : !contactsData?.contacts?.length ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No contacts yet
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                {contactsData.contacts.map((contact: { id: string; email: string; name: string; phone: string | null; status: string; source: string; tags: string[] | null; notes: string | null; firstContactAt: Date; lastContactAt: Date; createdAt: Date; updatedAt: Date; communicationPreferences: { email?: boolean; sms?: boolean; phone?: boolean } | null }) => {
                  const config =
                    STATUS_CONFIG[contact.status] ?? STATUS_CONFIG.lead!;
                  return (
                    <div key={contact.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {contact.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {contact.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: config.bg,
                              color: config.color,
                            }}
                          >
                            {config.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {new Date(contact.lastContactAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
