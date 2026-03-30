"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Kanban, Table2, Filter } from "lucide-react";
import { ContactKanban } from "~/components/crm/contact-kanban";
import { SortHeader, type SortLevel } from "~/components/crm/sort-header";
import { STATUS_CONFIG, borderStyle } from "~/components/crm/styles";
import { SAMPLE_CONTACTS } from "~/components/showcase/sample-data";
import type { ContactRow } from "~/components/crm/types";

const STATUSES = ["lead", "prospect", "client", "inactive", "churned"] as const;
const SOURCES = ["website", "referral", "manual"] as const;

function ContactTable({
  contacts,
  onStatusChange,
}: {
  contacts: ContactRow[];
  onStatusChange: (contactId: string, newStatus: string) => void;
}) {
  const [sorts, setSorts] = useState<SortLevel[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const handleSort = useCallback((field: string) => {
    setSorts((prev) => {
      const existing = prev.find((s) => s.field === field);
      if (!existing) return [...prev, { field, order: "asc" as const }];
      if (existing.order === "asc")
        return prev.map((s) =>
          s.field === field ? { ...s, order: "desc" as const } : s
        );
      return prev.filter((s) => s.field !== field);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = contacts;
    if (statusFilter) result = result.filter((c) => c.status === statusFilter);
    if (sourceFilter) result = result.filter((c) => c.source === sourceFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company?.toLowerCase().includes(q) ?? false)
      );
    }
    return result;
  }, [contacts, statusFilter, sourceFilter, search]);

  const sorted = useMemo(() => {
    if (sorts.length === 0) return filtered;
    return [...filtered].sort((a, b) => {
      for (const { field, order } of sorts) {
        const dir = order === "asc" ? 1 : -1;
        let va: string | number | Date | null = null;
        let vb: string | number | Date | null = null;
        if (field === "name") {
          va = a.name;
          vb = b.name;
        } else if (field === "company") {
          va = a.company ?? "";
          vb = b.company ?? "";
        } else if (field === "status") {
          va = a.status;
          vb = b.status;
        } else if (field === "source") {
          va = a.source;
          vb = b.source;
        } else if (field === "lastContactAt") {
          va = a.lastContactAt ? new Date(a.lastContactAt).getTime() : 0;
          vb = b.lastContactAt ? new Date(b.lastContactAt).getTime() : 0;
        }
        if (va === null || vb === null) continue;
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
      }
      return 0;
    });
  }, [filtered, sorts]);

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37]/50 focus:outline-none"
          style={borderStyle}
        />
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded border bg-white/5 px-2 py-1 pr-6 text-xs text-gray-300 focus:outline-none"
            style={borderStyle}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s]?.label ?? s}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="appearance-none rounded border bg-white/5 px-2 py-1 pr-6 text-xs text-gray-300 focus:outline-none"
            style={borderStyle}
          >
            <option value="">All Sources</option>
            {SOURCES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {(statusFilter || sourceFilter || search) && (
          <button
            onClick={() => {
              setStatusFilter("");
              setSourceFilter("");
              setSearch("");
            }}
            className="text-xs text-gray-500 transition-colors hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-lg border bg-white/5"
        style={borderStyle}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left text-xs tracking-wider text-gray-500 uppercase"
              style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
            >
              <SortHeader
                field="name"
                label="Name"
                sorts={sorts}
                onSort={handleSort}
              />
              <SortHeader
                field="company"
                label="Company"
                sorts={sorts}
                onSort={handleSort}
              />
              <SortHeader
                field="status"
                label="Status"
                sorts={sorts}
                onSort={handleSort}
              />
              <SortHeader
                field="source"
                label="Source"
                sorts={sorts}
                onSort={handleSort}
              />
              <th className="px-4 py-3">Tags</th>
              <SortHeader
                field="lastContactAt"
                label="Last Contact"
                sorts={sorts}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No contacts match your filters.
                </td>
              </tr>
            ) : (
              sorted.map((c) => {
                const config = STATUS_CONFIG[c.status];
                return (
                  <tr
                    key={c.id}
                    className="border-b transition-colors hover:bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {c.company ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.status}
                        onChange={(e) => onStatusChange(c.id, e.target.value)}
                        className="appearance-none rounded border bg-white/5 py-0.5 pr-5 pl-2 text-xs focus:outline-none"
                        style={{
                          borderColor: "rgba(212, 175, 55, 0.2)",
                          backgroundColor:
                            config?.bg ?? "rgba(255,255,255,0.05)",
                          color: config?.color ?? "#9ca3af",
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s]?.label ?? s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 capitalize">
                      {c.source}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.lastContactAt
                        ? new Date(c.lastContactAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ShowcaseCrmPage() {
  const [contacts, setContacts] = useState<ContactRow[]>(SAMPLE_CONTACTS);
  const [view, setView] = useState<"kanban" | "table">("kanban");

  const handleContactStatusChange = useCallback(
    (contactId: string, newStatus: string) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
      );
    },
    []
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-950 p-6">
      <Link
        href="/showcase#demos"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>

      <div className="mt-14 w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">CRM Pipeline</h1>
          <div
            className="flex rounded-lg border p-0.5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "kanban"
                  ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "table"
                  ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              Table
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {view === "kanban" ? (
            <ContactKanban
              contacts={contacts}
              onStatusChange={handleContactStatusChange}
            />
          ) : (
            <ContactTable
              contacts={contacts}
              onStatusChange={handleContactStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
