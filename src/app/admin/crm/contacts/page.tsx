"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  Search,
  Clock,
  Mail,
  Phone,
  Tag,
  ChevronDown,
} from "lucide-react";
import { api } from "~/trpc/react";

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
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

export default function CrmContactsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sourceFilter, setSourceFilter] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const limit = 25;

  const { data, isLoading } = api.crm.getContacts.useQuery({
    search: search || undefined,
    status: statusFilter,
    source: sourceFilter,
    limit,
    offset: page * limit,
  });

  const updateContact = api.crm.updateContact.useMutation();

  const handleStatusChange = (id: string, newStatus: string) => {
    updateContact.mutate(
      {
        id,
        status: newStatus as "lead" | "prospect" | "client" | "inactive" | "churned",
      },
    );
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
        <h1 className="text-2xl font-bold text-white">All Contacts</h1>
        <p className="text-sm text-gray-400">
          Master CRM database — all contacts across every source
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1" style={{ minWidth: "200px", maxWidth: "320px" }}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          />
        </div>

        <select
          value={statusFilter ?? ""}
          onChange={(e) => {
            setStatusFilter(e.target.value || undefined);
            setPage(0);
          }}
          className="rounded-lg border bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <option value="">All Statuses</option>
          <option value="lead">Lead</option>
          <option value="prospect">Prospect</option>
          <option value="client">Client</option>
          <option value="inactive">Inactive</option>
          <option value="churned">Churned</option>
        </select>

        <select
          value={sourceFilter ?? ""}
          onChange={(e) => {
            setSourceFilter(e.target.value || undefined);
            setPage(0);
          }}
          className="rounded-lg border bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <option value="">All Sources</option>
          <option value="personal_site">matthewmiceli.com</option>
          <option value="miracle_mind">miraclemind.dev</option>
          <option value="banyan_waitlist">Banyan Waitlist</option>
          <option value="referral">Referral</option>
        </select>

        {data && (
          <span className="text-sm text-gray-500">
            {data.total} contact{data.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Contacts Table */}
      <div
        className="rounded-lg border bg-white/5"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        {isLoading ? (
          <TableSkeleton />
        ) : !data?.contacts?.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">
              {search || statusFilter || sourceFilter
                ? "No contacts match your filters"
                : "No contacts yet"}
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
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {data.contacts.map((contact: { id: string; email: string; name: string; phone: string | null; status: string; source: string; tags: string[] | null; notes: string | null; firstContactAt: Date; lastContactAt: Date; createdAt: Date; updatedAt: Date; communicationPreferences: { email?: boolean; sms?: boolean; phone?: boolean } | null }) => {
                const config =
                  STATUS_CONFIG[contact.status] ?? STATUS_CONFIG.lead!;
                return (
                  <tr
                    key={contact.id}
                    className="border-b transition-colors hover:bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{contact.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-gray-400">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </p>
                        {contact.phone && (
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {SOURCE_LABELS[contact.source] ?? contact.source}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={contact.status}
                          onChange={(e) =>
                            handleStatusChange(contact.id, e.target.value)
                          }
                          className="appearance-none rounded-full border-0 py-0.5 pl-2 pr-6 text-xs font-medium focus:outline-none"
                          style={{
                            backgroundColor: config.bg,
                            color: config.color,
                          }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <option key={key} value={key}>
                              {cfg.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2"
                          style={{ color: config.color }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {contact.tags?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs"
                              style={{
                                backgroundColor: "rgba(212, 175, 55, 0.1)",
                                color: "#D4AF37",
                              }}
                            >
                              <Tag className="h-2.5 w-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(contact.lastContactAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {page * limit + 1}–
            {Math.min((page + 1) * limit, data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.hasMore}
              className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
