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
  MoreVertical,
  Pencil,
  Archive,
  Trash2,
  Tag,
  AlertTriangle,
  Info,
} from "lucide-react";

/* ── Shared styles ─────────────────────────────────────────────── */

const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

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
          style={borderStyle}
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
          style={borderStyle}
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

/* ── Account Manager Picker ────────────────────────────────────── */

function AccountManagerPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const { data: team = [] } = api.crm.getCompanyTeam.useQuery();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? team.find((m: { id: string }) => m.id === value) : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border bg-white/5 px-3 py-2 text-left text-sm text-white"
        style={borderStyle}
      >
        <span className={selected ? "text-white" : "text-gray-500"}>
          {selected ? selected.name : "Select account manager..."}
        </span>
        {value ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange(null);
              }
            }}
            className="text-gray-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>
      {open && (
        <div
          className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={borderStyle}
        >
          {team.map((member: { id: string; name: string; email: string }) => (
            <button
              key={member.id}
              onClick={() => {
                onChange(member.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Users className="h-3 w-3 text-gray-500" />
              <span>{member.name}</span>
              <span className="ml-auto text-xs text-gray-600">{member.email}</span>
            </button>
          ))}
          {team.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-500">No team members found</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Tag Picker ────────────────────────────────────────────────── */

function TagPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const { data: suggestions = [] } = api.crm.getTagOptions.useQuery();
  const [input, setInput] = useState("");
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
    (t) =>
      !selected.includes(t) &&
      t.toLowerCase().includes(input.toLowerCase()),
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter((t) => t !== tag));
  };

  return (
    <div ref={ref} className="relative">
      <div
        className="flex min-h-[38px] flex-wrap gap-1.5 rounded-lg border bg-white/5 px-2 py-1.5"
        style={borderStyle}
        onClick={() => setOpen(true)}
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              color: "#D4AF37",
            }}
          >
            <Tag className="h-2.5 w-2.5" />
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-0.5 hover:text-white"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          className="min-w-[80px] flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
          placeholder={selected.length === 0 ? "Search or add tags..." : "Add..."}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              addTag(input);
            }
            if (e.key === "Backspace" && !input && selected.length > 0) {
              removeTag(selected[selected.length - 1]!);
            }
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (filtered.length > 0 || input.trim()) && (
        <div
          className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={borderStyle}
        >
          {filtered.map((tag) => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Tag className="h-3 w-3 text-gray-500" />
              {tag}
            </button>
          ))}
          {input.trim() && !suggestions.includes(input.trim()) && (
            <button
              onClick={() => addTag(input)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
              style={{ color: "#D4AF37" }}
            >
              <Plus className="h-3 w-3" />
              Create &ldquo;{input.trim()}&rdquo;
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
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                style={borderStyle}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                style={borderStyle}
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>URL Slug</label>
              <input
                className={inputClass}
                style={borderStyle}
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
              <label className={labelClass}>Company</label>
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
            style={borderStyle}
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

/* ── Edit Client Modal ─────────────────────────────────────────── */

function EditClientModal({
  client,
  onClose,
}: {
  client: ClientListItem;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const hasCrm = !!client.crmContact;

  const updateClient = api.clients.update.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate();
      onClose();
    },
  });

  const updateContact = api.crm.updateContact.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate();
    },
  });

  // CRM-synced fields
  const [name, setName] = useState(client.crmContact?.name ?? client.name);
  const [email, setEmail] = useState(client.crmContact?.email ?? client.email);
  const [phone, setPhone] = useState(client.crmContact?.phone ?? "");
  const [company, setCompany] = useState(client.crmContact?.company ?? client.company ?? "");
  const [accountManagerId, setAccountManagerId] = useState<string | null>(
    client.crmContact?.accountManagerId ?? client.accountManagerId ?? null,
  );
  const [tags, setTags] = useState<string[]>(client.crmContact?.tags ?? []);

  // Portal-only fields
  const [slug, setSlug] = useState(client.slug);
  const [status, setStatus] = useState(client.status);
  const [notes, setNotes] = useState(client.notes ?? "");

  const isSaving = updateClient.isPending || updateContact.isPending;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    if (!name || !email || !slug) return;

    if (hasCrm && client.crmContact) {
      // CRM fields → crm.updateContact (sync-on-save pushes to client automatically)
      // Portal-only fields → clients.update
      await Promise.all([
        updateContact.mutateAsync({
          id: client.crmContact.id,
          name,
          email,
          phone: phone || null,
          company: company || null,
          accountManagerId,
          tags,
        }),
        updateClient.mutateAsync({
          id: client.id,
          slug,
          status: status as "active" | "inactive",
          notes: notes || null,
        }),
      ]);
    } else {
      // No CRM link — all fields go to clients.update
      await updateClient.mutateAsync({
        id: client.id,
        name,
        email,
        company: company || null,
        accountManagerId,
        slug,
        status: status as "active" | "inactive",
        notes: notes || null,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative mx-4 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Client</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contact Details Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Contact Details
            </h3>
            {hasCrm ? (
              <span className="text-xs text-gray-500">Synced from CRM</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Info className="h-3 w-3" />
                No linked CRM contact
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                style={borderStyle}
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                style={borderStyle}
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                style={borderStyle}
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!hasCrm}
              />
              {!hasCrm && (
                <p className="mt-1 text-xs text-gray-600">Requires CRM link</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <CompanyPicker
                value={company}
                onChange={setCompany}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Account Manager</label>
            <AccountManagerPicker
              value={accountManagerId}
              onChange={setAccountManagerId}
            />
          </div>

          {hasCrm && (
            <div>
              <label className={labelClass}>Tags</label>
              <TagPicker selected={tags} onChange={setTags} />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }} />

        {/* Portal Settings Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Portal Settings
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>URL Slug</label>
              <input
                className={inputClass}
                style={borderStyle}
                placeholder="acme-corp"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  )
                }
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none rounded-lg border bg-white/5 px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50"
                  style={borderStyle}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Client Notes</label>
            <textarea
              className={inputClass}
              style={borderStyle}
              rows={3}
              placeholder="Internal notes about this client..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={borderStyle}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name || !email || !slug}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Archive Confirm Modal ─────────────────────────────────────── */

function ArchiveConfirmModal({
  client,
  onClose,
}: {
  client: ClientListItem;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const archiveClient = api.clients.archive.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate();
      onClose();
    },
  });

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
        className="relative mx-4 w-full max-w-md rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
          >
            <Archive className="h-5 w-5" style={{ color: "#D4AF37" }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Archive Client</h2>
            <p className="text-sm text-gray-400">
              {client.name}
            </p>
          </div>
        </div>

        <p className="mb-5 text-sm text-gray-400">
          This will set the client portal to <strong className="text-white">inactive</strong>.
          All data (projects, updates, agreements) will be preserved, but the
          portal will no longer be accessible to the client.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={borderStyle}
          >
            Cancel
          </button>
          <button
            onClick={() => archiveClient.mutate({ id: client.id })}
            disabled={archiveClient.isPending}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {archiveClient.isPending ? "Archiving..." : "Archive Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ──────────────────────────────────────── */

function DeleteConfirmModal({
  client,
  onClose,
}: {
  client: ClientListItem;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const deleteClient = api.clients.delete.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate();
      onClose();
    },
  });

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
        className="relative mx-4 w-full max-w-md rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(248, 113, 113, 0.3)" }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(248, 113, 113, 0.1)" }}
          >
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Delete Client</h2>
            <p className="text-sm text-gray-400">
              {client.name}
            </p>
          </div>
        </div>

        <p className="mb-2 text-sm text-gray-400">
          This will <strong className="text-red-400">permanently delete</strong> this
          client and all associated data:
        </p>
        <ul className="mb-4 space-y-1 text-sm text-gray-500">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-red-400" />
            All projects and updates
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-red-400" />
            Agreements and resources
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-red-400" />
            Client notes
          </li>
        </ul>
        <p className="mb-5 text-sm text-gray-500">
          The CRM contact record will <strong className="text-gray-300">not</strong> be
          deleted.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={borderStyle}
          >
            Cancel
          </button>
          <button
            onClick={() => deleteClient.mutate({ id: client.id })}
            disabled={deleteClient.isPending}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            {deleteClient.isPending ? "Deleting..." : "Delete Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Action Menu ───────────────────────────────────────────────── */

function ActionMenu({
  client,
  onEdit,
  onArchive,
  onDelete,
}: {
  client: ClientListItem;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 z-10 mt-1 w-36 rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={borderStyle}
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          {client.status === "active" && (
            <button
              onClick={() => {
                setOpen(false);
                onArchive();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Archive className="h-3 w-3" />
              Archive
            </button>
          )}
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */

export default function AdminClientsPage() {
  const { data: clients, isLoading } = api.clients.list.useQuery();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientListItem | null>(null);
  const [archivingClient, setArchivingClient] = useState<ClientListItem | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientListItem | null>(null);

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
            style={borderStyle}
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border bg-white/5 py-2 pl-3 pr-8 text-sm text-white focus:outline-none"
            style={borderStyle}
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
        style={borderStyle}
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
                <th className="w-10 px-2 py-3" />
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
                    {client.accountManager && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-600">
                        <Users className="h-3 w-3" />
                        {client.accountManager.name}
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

                  {/* Actions */}
                  <td className="px-2 py-3">
                    <ActionMenu
                      client={client}
                      onEdit={() => setEditingClient(client)}
                      onArchive={() => setArchivingClient(client)}
                      onDelete={() => setDeletingClient(client)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateClientModal onClose={() => setShowCreate(false)} />
      )}
      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
        />
      )}
      {archivingClient && (
        <ArchiveConfirmModal
          client={archivingClient}
          onClose={() => setArchivingClient(null)}
        />
      )}
      {deletingClient && (
        <DeleteConfirmModal
          client={deletingClient}
          onClose={() => setDeletingClient(null)}
        />
      )}
    </div>
  );
}
