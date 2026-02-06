"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Inbox,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Circle,
  Eye,
  EyeOff,
  ChevronDown,
  X,
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

type SourceKey = "all" | "banyan" | "miracleMind" | "personal";

type NormalizedLead = {
  id: number;
  source: "banyan" | "miracleMind" | "personal";
  sourceLabel: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  details: string | null;
  detailChips: string[] | null;
  date: Date;
  isActioned: boolean;
};

const SOURCE_LABELS: Record<NormalizedLead["source"], string> = {
  banyan: "Early Access Form · miraclemind.dev/banyan",
  miracleMind: "Contact Form · miraclemind.dev/contact",
  personal: "Contact Form · matthewmiceli.com",
};

const SOURCE_OPTIONS: { value: SourceKey; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "banyan", label: "Early Access Form · miraclemind.dev/banyan" },
  { value: "miracleMind", label: "Contact Form · miraclemind.dev/contact" },
  { value: "personal", label: "Contact Form · matthewmiceli.com" },
];

function normalizeLeads(data: {
  banyan: { id: number; fullName: string; email: string; phone: string | null; role: string | null; message: string | null; contacted: boolean; createdAt: Date }[];
  miracleMind: { id: number; name: string; email: string; phone: string | null; message: string; services: string[] | null; read: boolean; createdAt: Date }[];
  personal: { id: number; name: string; email: string; phone: string | null; message: string; read: boolean; createdAt: Date }[];
}): NormalizedLead[] {
  const leads: NormalizedLead[] = [];

  for (const b of data.banyan) {
    leads.push({
      id: b.id,
      source: "banyan",
      sourceLabel: SOURCE_LABELS.banyan,
      name: b.fullName,
      email: b.email,
      phone: b.phone,
      message: b.message,
      details: b.role ?? null,
      detailChips: null,
      date: new Date(b.createdAt),
      isActioned: b.contacted,
    });
  }

  for (const m of data.miracleMind) {
    leads.push({
      id: m.id,
      source: "miracleMind",
      sourceLabel: SOURCE_LABELS.miracleMind,
      name: m.name,
      email: m.email,
      phone: m.phone,
      message: m.message,
      details: m.services?.length ? m.services.join(", ") : null,
      detailChips: m.services?.length ? m.services : null,
      date: new Date(m.createdAt),
      isActioned: m.read,
    });
  }

  for (const p of data.personal) {
    leads.push({
      id: p.id,
      source: "personal",
      sourceLabel: SOURCE_LABELS.personal,
      name: p.name,
      email: p.email,
      phone: p.phone,
      message: p.message,
      details: null,
      detailChips: null,
      date: new Date(p.createdAt),
      isActioned: p.read,
    });
  }

  leads.sort((a, b) => b.date.getTime() - a.date.getTime());
  return leads;
}

function LeadDetailModal({
  lead,
  onClose,
  onToggle,
}: {
  lead: NormalizedLead;
  onClose: () => void;
  onToggle: (lead: NormalizedLead) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative mx-4 w-full max-w-lg rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{lead.name}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Source + Date */}
          <div className="flex items-center justify-between">
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: "rgba(212, 175, 55, 0.1)",
                color: "#D4AF37",
              }}
            >
              {lead.sourceLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {lead.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Contact info */}
          <div
            className="rounded-lg border p-3"
            style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
          >
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-3.5 w-3.5 text-gray-500" />
                {lead.email}
              </p>
              {lead.phone && (
                <p className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="h-3.5 w-3.5 text-gray-500" />
                  {lead.phone}
                </p>
              )}
            </div>
          </div>

          {/* Details (role / services) */}
          {(lead.details || lead.detailChips) && (
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                {lead.source === "banyan" ? "Role" : "Services"}
              </p>
              {lead.detailChips ? (
                <div className="flex flex-wrap gap-1.5">
                  {lead.detailChips.map((s) => (
                    <span
                      key={s}
                      className="rounded-full px-2.5 py-1 text-xs"
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
                <p className="text-sm text-gray-300">{lead.details}</p>
              )}
            </div>
          )}

          {/* Message */}
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
              Message
            </p>
            {lead.message ? (
              <div
                className="rounded-lg border p-3"
                style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                  {lead.message}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No message provided</p>
            )}
          </div>

          {/* Status toggle */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </p>
            {lead.source === "banyan" ? (
              <button
                onClick={() => onToggle(lead)}
                disabled={lead.isActioned}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: lead.isActioned
                    ? "rgba(74, 222, 128, 0.1)"
                    : "rgba(250, 204, 21, 0.1)",
                  color: lead.isActioned ? "#4ade80" : "#facc15",
                }}
              >
                {lead.isActioned ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Contacted
                  </>
                ) : (
                  <>
                    <Circle className="h-3 w-3" />
                    Mark Contacted
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => onToggle(lead)}
                disabled={lead.isActioned}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: lead.isActioned
                    ? "rgba(74, 222, 128, 0.1)"
                    : "rgba(250, 204, 21, 0.1)",
                  color: lead.isActioned ? "#4ade80" : "#facc15",
                }}
              >
                {lead.isActioned ? (
                  <>
                    <Eye className="h-3 w-3" />
                    Read
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3" />
                    Mark Read
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CrmLeadsPage() {
  const [sourceFilter, setSourceFilter] = useState<SourceKey>("all");
  const [selectedLead, setSelectedLead] = useState<NormalizedLead | null>(null);
  const { data, isLoading } = api.crm.getLeads.useQuery();

  const markContacted = api.crm.markBanyanContacted.useMutation();
  const markRead = api.crm.markSubmissionRead.useMutation();

  const allLeads = useMemo(
    () => (data ? normalizeLeads(data) : []),
    [data],
  );

  const filteredLeads = useMemo(
    () =>
      sourceFilter === "all"
        ? allLeads
        : allLeads.filter((l) => l.source === sourceFilter),
    [allLeads, sourceFilter],
  );

  const handleToggle = (lead: NormalizedLead) => {
    if (lead.source === "banyan") {
      markContacted.mutate({ id: lead.id });
    } else {
      markRead.mutate({ id: lead.id, type: lead.source });
    }
  };

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
          Inbound leads and contact form submissions across all sources
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as SourceKey)}
            className="appearance-none rounded-lg border bg-white/5 py-2 pl-3 pr-8 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
        </div>

        {!isLoading && (
          <span className="text-sm text-gray-500">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-lg border bg-white/5"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : !filteredLeads.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Inbox className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">
              {sourceFilter !== "all"
                ? `No leads from ${SOURCE_OPTIONS.find((o) => o.value === sourceFilter)?.label ?? "this source"}`
                : "No leads found"}
            </p>
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
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={`${lead.source}-${lead.id}`}
                  onClick={() => setSelectedLead(lead)}
                  className="cursor-pointer border-b transition-colors hover:bg-white/5"
                  style={{
                    borderColor: "rgba(212, 175, 55, 0.05)",
                    backgroundColor: lead.isActioned
                      ? undefined
                      : "rgba(212, 175, 55, 0.02)",
                  }}
                >
                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-white">
                    {lead.name}
                  </td>

                  {/* Contact */}
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

                  {/* Source */}
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(212, 175, 55, 0.1)",
                        color: "#D4AF37",
                      }}
                    >
                      {lead.sourceLabel}
                    </span>
                  </td>

                  {/* Details */}
                  <td className="px-4 py-3">
                    {lead.detailChips ? (
                      <div className="flex flex-wrap gap-1">
                        {lead.detailChips.map((s) => (
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
                    ) : lead.details ? (
                      <span className="text-gray-400">{lead.details}</span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>

                  {/* Message */}
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

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-400">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {lead.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {lead.source === "banyan" ? (
                      <button
                        onClick={() => handleToggle(lead)}
                        disabled={lead.isActioned}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: lead.isActioned
                            ? "rgba(74, 222, 128, 0.1)"
                            : "rgba(250, 204, 21, 0.1)",
                          color: lead.isActioned ? "#4ade80" : "#facc15",
                        }}
                      >
                        {lead.isActioned ? (
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
                    ) : (
                      <button
                        onClick={() => handleToggle(lead)}
                        disabled={lead.isActioned}
                        className="inline-flex items-center gap-1 text-xs transition-colors"
                        style={{
                          color: lead.isActioned ? "#4ade80" : "#facc15",
                        }}
                      >
                        {lead.isActioned ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}
