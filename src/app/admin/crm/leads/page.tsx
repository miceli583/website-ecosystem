"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Leaf,
  Inbox,
  User,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Circle,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "~/trpc/react";

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

type TabKey = "banyan" | "miracleMind" | "personal";

const TABS: { key: TabKey; label: string; icon: typeof Leaf }[] = [
  { key: "banyan", label: "Banyan Waitlist", icon: Leaf },
  { key: "miracleMind", label: "miraclemind.dev", icon: Inbox },
  { key: "personal", label: "matthewmiceli.com", icon: User },
];

export default function CrmLeadsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("banyan");
  const { data, isLoading } = api.crm.getLeads.useQuery();

  const markContacted = api.crm.markBanyanContacted.useMutation();
  const markRead = api.crm.markSubmissionRead.useMutation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2">
          <Link
            href="/admin/crm"
            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CRM
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-white">Leads & Signups</h1>
        <p className="text-sm text-gray-400">
          Banyan early access, contact form submissions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-white/5 p-1" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
        {TABS.map((tab) => {
          const count =
            tab.key === "banyan"
              ? data?.banyan?.length
              : tab.key === "miracleMind"
                ? data?.miracleMind?.length
                : data?.personal?.length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all"
              style={
                activeTab === tab.key
                  ? {
                      backgroundColor: "rgba(212, 175, 55, 0.15)",
                      color: "#D4AF37",
                    }
                  : { color: "#9ca3af" }
              }
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {count !== undefined && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-xs"
                  style={{
                    backgroundColor:
                      activeTab === tab.key
                        ? "rgba(212, 175, 55, 0.2)"
                        : "rgba(255,255,255,0.05)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        className="rounded-lg border bg-white/5"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : activeTab === "banyan" ? (
          /* Banyan Waitlist */
          !data?.banyan?.length ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Leaf className="mb-3 h-12 w-12 text-gray-600" />
              <p className="text-gray-500">No Banyan signups yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.banyan.map((lead: { id: number; fullName: string; email: string; phone: string | null; role: string | null; message: string | null; contacted: boolean; notes: string | null; createdAt: Date; updatedAt: Date; crmId: string | null }) => (
                  <tr
                    key={lead.id}
                    className="border-b transition-colors hover:bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {lead.fullName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-gray-400">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </p>
                        {lead.phone && (
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {lead.role ?? "—"}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-gray-500">
                      {lead.message ? (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{lead.message}</span>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => markContacted.mutate({ id: lead.id })}
                        disabled={lead.contacted}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: lead.contacted
                            ? "rgba(74, 222, 128, 0.1)"
                            : "rgba(250, 204, 21, 0.1)",
                          color: lead.contacted ? "#4ade80" : "#facc15",
                        }}
                      >
                        {lead.contacted ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Contacted
                          </>
                        ) : (
                          <>
                            <Circle className="h-3 w-3" />
                            Pending
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : activeTab === "miracleMind" ? (
          /* miraclemind.dev Contact Forms */
          !data?.miracleMind?.length ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Inbox className="mb-3 h-12 w-12 text-gray-600" />
              <p className="text-gray-500">No contact submissions yet</p>
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
                  <th className="px-4 py-3">Services</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Read</th>
                </tr>
              </thead>
              <tbody>
                {data.miracleMind.map((sub: { id: number; name: string; email: string; phone: string | null; message: string; services: string[] | null; role: string | null; stewardshipInterest: boolean | null; read: boolean; createdAt: Date; crmId: string | null }) => (
                  <tr
                    key={sub.id}
                    className="border-b transition-colors hover:bg-white/5"
                    style={{
                      borderColor: "rgba(212, 175, 55, 0.05)",
                      backgroundColor: sub.read
                        ? undefined
                        : "rgba(212, 175, 55, 0.02)",
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {sub.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{sub.email}</td>
                    <td className="px-4 py-3">
                      {sub.services?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {sub.services.map((s: string) => (
                            <span
                              key={s}
                              className="rounded-full px-2 py-0.5 text-xs"
                              style={{
                                backgroundColor: "rgba(212, 175, 55, 0.1)",
                                color: "#D4AF37",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-gray-500">
                      {sub.message}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          markRead.mutate({
                            id: sub.id,
                            type: "miracleMind",
                          })
                        }
                        disabled={sub.read}
                        className="inline-flex items-center gap-1 text-xs transition-colors"
                        style={{
                          color: sub.read ? "#4ade80" : "#facc15",
                        }}
                      >
                        {sub.read ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          /* Personal Contact Forms */
          !data?.personal?.length ? (
            <div className="flex flex-col items-center justify-center py-12">
              <User className="mb-3 h-12 w-12 text-gray-600" />
              <p className="text-gray-500">No personal contact submissions yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Read</th>
                </tr>
              </thead>
              <tbody>
                {data.personal.map((sub: { id: number; name: string; email: string; phone: string | null; message: string; read: boolean; createdAt: Date; crmId: string }) => (
                  <tr
                    key={sub.id}
                    className="border-b transition-colors hover:bg-white/5"
                    style={{
                      borderColor: "rgba(212, 175, 55, 0.05)",
                      backgroundColor: sub.read
                        ? undefined
                        : "rgba(212, 175, 55, 0.02)",
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {sub.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-gray-400">
                          <Mail className="h-3 w-3" />
                          {sub.email}
                        </p>
                        {sub.phone && (
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {sub.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-gray-500">
                      {sub.message}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          markRead.mutate({
                            id: sub.id,
                            type: "personal",
                          })
                        }
                        disabled={sub.read}
                        className="inline-flex items-center gap-1 text-xs transition-colors"
                        style={{
                          color: sub.read ? "#4ade80" : "#facc15",
                        }}
                      >
                        {sub.read ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
