"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientListItem = RouterOutputs["clients"]["list"][number];

import {
  Plus,
  Users,
  Building2,
  ArrowLeft,
  Search,
  Clock,
  Mail,
  ChevronDown,
  ExternalLink,
  FolderKanban,
  X,
} from "lucide-react";

/* ── Skeleton ──────────────────────────────────────────────────── */

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

/* ── Company Picker ────────────────────────────────────────────── */

function CompanyPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { data: suggestions = [] } = api.clients.getCompanyOptions.useQuery();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter(
    (c) => c.toLowerCase().includes(value.toLowerCase()) && c !== value,
  );

  const showCreate = value.trim() && !suggestions.some(
    (c) => c.toLowerCase() === value.trim().toLowerCase(),
  );

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
        <input
          className="w-full rounded-lg border bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          placeholder="Search or create company..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (filtered.length > 0 || showCreate) && (
        <div
          className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {filtered.map((company) => (
            <button
              key={company}
              onClick={() => {
                onChange(company);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Building2 className="h-3 w-3 text-gray-500" />
              {company}
            </button>
          ))}
          {showCreate && (
            <button
              onClick={() => {
                onChange(value.trim());
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
              style={{ color: "#D4AF37" }}
            >
              <Plus className="h-3 w-3" />
              Create &ldquo;{value.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Create Modal ──────────────────────────────────────────────── */

function CreateClientModal({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils();
  const createClient = api.clients.create.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate();
      onClose();
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    slug: "",
    company: "",
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCreate = () => {
    if (!form.name || !form.email || !form.slug) return;
    createClient.mutate({
      name: form.name,
      email: form.email,
      slug: form.slug,
      company: form.company || undefined,
    });
  };

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
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New Client</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </label>
              <input
                className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </label>
              <input
                className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                URL Slug
              </label>
              <input
                className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                placeholder="acme-corp"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500">
                Company
              </label>
              <CompanyPicker
                value={form.company}
                onChange={(v) => setForm((f) => ({ ...f, company: v }))}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={createClient.isPending || !form.name || !form.email || !form.slug}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {createClient.isPending ? "Creating..." : "Create Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */

export default function AdminClientsPage() {
  const { data: clients, isLoading } = api.clients.list.useQuery();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    if (!clients) return [];
    let list = clients;

    if (statusFilter !== "all") {
      list = list.filter((c: ClientListItem) => c.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c: ClientListItem) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [clients, search, statusFilter]);

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
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-sm text-gray-400">
          Active client management
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="relative flex-1"
          style={{ minWidth: "200px", maxWidth: "320px" }}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-white/5 py-2 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border bg-white/5 py-2 pl-3 pr-8 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
        </div>

        {!isLoading && (
          <span className="text-sm text-gray-500">
            {filtered.length} client{filtered.length !== 1 ? "s" : ""}
          </span>
        )}

        <button
          onClick={() => setShowCreate(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
          }}
        >
          <Plus className="h-4 w-4" />
          New Client
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-lg border bg-white/5"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        {isLoading ? (
          <TableSkeleton />
        ) : !filtered.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">
              {search || statusFilter !== "all"
                ? "No clients match your filters"
                : "No clients yet"}
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
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Portal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client: ClientListItem) => (
                <tr
                  key={client.id}
                  className="border-b transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="font-medium text-white transition-colors hover:text-[#D4AF37]"
                    >
                      {client.name}
                    </Link>
                    {client.company && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <Building2 className="h-3 w-3" />
                        {client.company}
                      </p>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1 text-gray-400">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor:
                          client.status === "active"
                            ? "rgba(74, 222, 128, 0.1)"
                            : "rgba(156, 163, 175, 0.1)",
                        color:
                          client.status === "active" ? "#4ade80" : "#9ca3af",
                      }}
                    >
                      {client.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Projects */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <FolderKanban className="h-3 w-3" />
                      {client.projects.length} project
                      {client.projects.length !== 1 ? "s" : ""}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 text-gray-400">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {new Date(client.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Portal link */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/portal/${client.slug}`}
                      className="inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#D4AF37" }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      /{client.slug}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateClientModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
