"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  Search,
  Clock,
  Mail,
  Phone,
  Tag,
  ExternalLink,
  MoreVertical,
  X,
  Building2,
  UserPlus,
  ChevronDown,
  Plus,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { api } from "~/trpc/react";

/* ── Shared styles ─────────────────────────────────────────────── */

const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const selectClass =
  "w-full appearance-none rounded-lg border bg-white/5 px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

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
      t.toLowerCase().includes(input.toLowerCase())
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
              aria-label="Remove tag"
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
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
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

/* ── Referral Picker ───────────────────────────────────────────── */

function ReferralPicker({
  contactId,
  referredBy,
  referredByExternal,
  onChange,
}: {
  contactId?: string;
  referredBy: string | null;
  referredByExternal: string | null;
  onChange: (referredBy: string | null, referredByExternal: string | null) => void;
}) {
  const { data: contacts = [] } = api.crm.getContactOptions.useQuery();
  const [search, setSearch] = useState(referredByExternal ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Resolve display name for selected internal contact
  const selectedContact = referredBy
    ? contacts.find((c: { id: string }) => c.id === referredBy)
    : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = contacts.filter(
    (c: { id: string; name: string; email: string }) =>
      c.id !== contactId &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div ref={ref} className="relative">
      {/* Selected display */}
      {(referredBy || referredByExternal) && !open && (
        <div
          className="flex items-center justify-between rounded-lg border bg-white/5 px-3 py-2"
          style={borderStyle}
        >
          <span className="text-sm text-white">
            {selectedContact
              ? `${(selectedContact as { name: string }).name} (contact)`
              : referredByExternal}
          </span>
          <button
            aria-label="Clear referral"
            onClick={() => {
              onChange(null, null);
              setSearch("");
            }}
            className="text-gray-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Search input */}
      {!referredBy && !referredByExternal && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
            <input
              className={inputClass + " pl-9"}
              style={borderStyle}
              placeholder="Search contacts or type external name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  e.preventDefault();
                  onChange(null, search.trim());
                  setOpen(false);
                }
              }}
            />
          </div>
          {open && (filtered.length > 0 || search.trim()) && (
            <div
              className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              {filtered.map((c: { id: string; name: string; email: string }) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onChange(c.id, null);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <UserPlus className="h-3 w-3 text-gray-500" />
                  <span>{c.name}</span>
                  <span className="ml-auto text-xs text-gray-600">{c.email}</span>
                </button>
              ))}
              {search.trim() && (
                <button
                  onClick={() => {
                    onChange(null, search.trim());
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
                  style={{ color: "#D4AF37" }}
                >
                  <Plus className="h-3 w-3" />
                  Add external: &ldquo;{search.trim()}&rdquo;
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Clear button when open with selection */}
      {(referredBy || referredByExternal) && open && (
        <div className="relative">
          <input
            className={inputClass}
            style={borderStyle}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      )}
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
  const { data: suggestions = [] } = api.crm.getCompanyOptions.useQuery();
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
          className={inputClass + " pl-9"}
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
          <button
            type="button"
            aria-label="Clear account manager"
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
          </button>
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>
      {open && (
        <div
          className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
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

/* ── Constants ─────────────────────────────────────────────────── */

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

const SOURCE_OPTIONS = [
  { value: "personal_site", label: "matthewmiceli.com" },
  { value: "miracle_mind", label: "miraclemind.dev" },
  { value: "banyan_waitlist", label: "Banyan Waitlist" },
  { value: "referral", label: "Referral" },
  { value: "portal", label: "Portal" },
];

type ContactRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  company: string | null;
  status: string;
  source: string;
  referredBy: string | null;
  referredByExternal: string | null;
  accountManagerId: string | null;
  accountManagerName: string | null;
  createdBy: string | null;
  tags: string[] | null;
  notes: string | null;
  lastContactAt: Date;
  submissionSources: string[];
  portalClient: {
    id: number;
    slug: string;
    name: string;
    company: string | null;
  } | null;
};

/* ── Promote to Client Modal ───────────────────────────────────── */

function PromoteToClientModal({
  contact,
  onClose,
  onSuccess,
}: {
  contact: ContactRow;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const utils = api.useUtils();
  const { data: team = [] } = api.crm.getCompanyTeam.useQuery();
  const promote = api.crm.promoteToClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
      onSuccess();
    },
  });

  const autoSlug = contact.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const [form, setForm] = useState({
    slug: autoSlug,
    company: contact.company ?? "",
    accountManagerId: contact.accountManagerId as string | null,
  });

  const [error, setError] = useState("");

  const handlePromote = () => {
    setError("");
    promote.mutate(
      {
        crmId: contact.id,
        slug: form.slug,
        company: form.company || undefined,
        accountManagerId: form.accountManagerId,
      },
      {
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
              }}
            >
              <Shield className="h-4 w-4" style={{ color: "#D4AF37" }} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Create Client Portal
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-400">
          Promoting <span className="font-medium text-white">{contact.name}</span> to
          client. This will create a portal at{" "}
          <span className="font-mono text-xs" style={{ color: "#D4AF37" }}>
            /portal/{form.slug}
          </span>
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass + " cursor-not-allowed opacity-60"}
                style={borderStyle}
                value={contact.name}
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass + " cursor-not-allowed opacity-60"}
                style={borderStyle}
                value={contact.email}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Portal Slug</label>
            <input
              className={inputClass}
              style={borderStyle}
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                }))
              }
              placeholder="client-slug"
            />
          </div>

          <div>
            <label className={labelClass}>Company</label>
            <CompanyPicker
              value={form.company}
              onChange={(v) => setForm((f) => ({ ...f, company: v }))}
            />
          </div>

          <div>
            <label className={labelClass}>Account Manager</label>
            <AccountManagerPicker
              value={form.accountManagerId}
              onChange={(id) => setForm((f) => ({ ...f, accountManagerId: id }))}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
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
            onClick={handlePromote}
            disabled={promote.isPending || !form.slug}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {promote.isPending ? "Creating..." : "Create Client Portal"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Demotion Dialog ──────────────────────────────────────────── */

function DemotionDialog({
  contact,
  newStatus,
  clientInfo,
  onClose,
  onSuccess,
}: {
  contact: ContactRow;
  newStatus: string;
  clientInfo: { id: number; slug: string; status: string; name: string };
  onClose: () => void;
  onSuccess: () => void;
}) {
  const utils = api.useUtils();
  const demote = api.crm.demoteClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
      onSuccess();
    },
  });

  const handleAction = (portalAction: "archive" | "remove") => {
    demote.mutate({
      crmId: contact.id,
      newStatus: newStatus as "lead" | "prospect" | "inactive" | "churned",
      portalAction,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-4 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(248, 113, 113, 0.1)" }}
          >
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Client Has Active Portal
          </h2>
        </div>

        <p className="mb-2 text-sm text-gray-400">
          <span className="font-medium text-white">{clientInfo.name}</span> has a
          portal at{" "}
          <span className="font-mono text-xs" style={{ color: "#D4AF37" }}>
            /portal/{clientInfo.slug}
          </span>
          . Changing their status to{" "}
          <span className="font-medium text-white">
            {STATUS_CONFIG[newStatus]?.label ?? newStatus}
          </span>{" "}
          requires handling the portal.
        </p>

        <div className="mt-5 space-y-3">
          <button
            onClick={() => handleAction("archive")}
            disabled={demote.isPending}
            className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <Shield className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-white">Archive Portal</p>
              <p className="text-xs text-gray-500">
                Client becomes inactive — portal preserved but inaccessible
              </p>
            </div>
          </button>

          <button
            onClick={() => handleAction("remove")}
            disabled={demote.isPending}
            className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{ borderColor: "rgba(248, 113, 113, 0.2)" }}
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-white">
                Remove from Portal
              </p>
              <p className="text-xs text-gray-500">
                Client record deleted — portal data removed permanently
              </p>
            </div>
          </button>

          <button
            onClick={onClose}
            disabled={demote.isPending}
            className="w-full rounded-lg border px-4 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            style={borderStyle}
          >
            Cancel — Keep as Client
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Modal ────────────────────────────────────────────────── */

function EditContactModal({
  contact,
  onClose,
}: {
  contact: ContactRow;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const updateContact = api.crm.updateContact.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getTagOptions.invalidate();
      onClose();
    },
  });

  const checkClientStatus = api.crm.checkClientStatus.useQuery(
    { crmId: contact.id },
    { enabled: false }
  );

  const [form, setForm] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone ?? "",
    company: contact.company ?? "",
    status: contact.status,
    source: contact.source,
    referredBy: contact.referredBy,
    referredByExternal: contact.referredByExternal,
    accountManagerId: contact.accountManagerId,
    createdBy: contact.createdBy ?? "",
    tags: contact.tags ?? [],
    notes: contact.notes ?? "",
  });

  const [showPromote, setShowPromote] = useState(false);
  const [demotionInfo, setDemotionInfo] = useState<{
    newStatus: string;
    client: { id: number; slug: string; status: string; name: string };
  } | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    const oldStatus = contact.status;
    const newStatus = form.status;

    // Promoting to client?
    if (oldStatus !== "client" && newStatus === "client") {
      // Check if client already exists by portal link
      if (!contact.portalClient) {
        setShowPromote(true);
        return;
      }
      // Client already exists — just save the CRM status update
    }

    // Demoting from client?
    if (oldStatus === "client" && newStatus !== "client") {
      const result = await checkClientStatus.refetch();
      if (result.data?.hasClient && result.data.client) {
        setDemotionInfo({
          newStatus,
          client: result.data.client,
        });
        return;
      }
      // No client record — save normally
    }

    // Normal save
    updateContact.mutate({
      id: contact.id,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      status: form.status as "lead" | "prospect" | "client" | "inactive" | "churned",
      source: form.source,
      referredBy: form.referredBy,
      referredByExternal: form.referredByExternal,
      accountManagerId: form.accountManagerId,
      createdBy: form.createdBy || null,
      tags: form.tags,
      notes: form.notes || null,
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
        className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Contact</h2>
          <button
            onClick={onClose}
            aria-label="Close"
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
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                style={borderStyle}
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                >
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {form.source === "referral" && (
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1">
                  <UserPlus className="h-3 w-3" />
                  Referred By
                </span>
              </label>
              <ReferralPicker
                contactId={contact.id}
                referredBy={form.referredBy}
                referredByExternal={form.referredByExternal}
                onChange={(rb, rbe) =>
                  setForm((f) => ({ ...f, referredBy: rb, referredByExternal: rbe }))
                }
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Account Manager</label>
            <AccountManagerPicker
              value={form.accountManagerId}
              onChange={(id) => setForm((f) => ({ ...f, accountManagerId: id }))}
            />
          </div>

          <div>
            <label className={labelClass}>Created By</label>
            <input
              className={inputClass}
              style={borderStyle}
              placeholder="Who created this contact"
              value={form.createdBy}
              onChange={(e) => setForm((f) => ({ ...f, createdBy: e.target.value }))}
            />
          </div>

          <div>
            <label className={labelClass}>Tags</label>
            <TagPicker
              selected={form.tags}
              onChange={(tags) => setForm((f) => ({ ...f, tags }))}
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              className={inputClass + " resize-none"}
              style={borderStyle}
              rows={3}
              placeholder="Internal notes about this contact..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
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
            disabled={updateContact.isPending || checkClientStatus.isFetching || !form.name || !form.email}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {updateContact.isPending || checkClientStatus.isFetching
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>

      {showPromote && (
        <PromoteToClientModal
          contact={contact}
          onClose={() => setShowPromote(false)}
          onSuccess={onClose}
        />
      )}

      {demotionInfo && (
        <DemotionDialog
          contact={contact}
          newStatus={demotionInfo.newStatus}
          clientInfo={demotionInfo.client}
          onClose={() => setDemotionInfo(null)}
          onSuccess={onClose}
        />
      )}
    </div>
  );
}

/* ── Create Modal ──────────────────────────────────────────────── */

function CreateContactModal({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils();
  const createContact = api.crm.createContact.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getTagOptions.invalidate();
      onClose();
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
    source: "referral",
    referredBy: null as string | null,
    referredByExternal: null as string | null,
    accountManagerId: null as string | null,
    tags: [] as string[],
    notes: "",
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCreate = () => {
    createContact.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      status: form.status as "lead" | "prospect" | "client" | "inactive" | "churned",
      source: form.source,
      referredBy: form.referredBy,
      referredByExternal: form.referredByExternal,
      accountManagerId: form.accountManagerId,
      tags: form.tags.length > 0 ? form.tags : undefined,
      notes: form.notes || null,
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
        className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New Contact</h2>
          <button
            onClick={onClose}
            aria-label="Close"
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
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                style={borderStyle}
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                >
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {form.source === "referral" && (
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1">
                  <UserPlus className="h-3 w-3" />
                  Referred By
                </span>
              </label>
              <ReferralPicker
                referredBy={form.referredBy}
                referredByExternal={form.referredByExternal}
                onChange={(rb, rbe) =>
                  setForm((f) => ({ ...f, referredBy: rb, referredByExternal: rbe }))
                }
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Account Manager</label>
            <AccountManagerPicker
              value={form.accountManagerId}
              onChange={(id) => setForm((f) => ({ ...f, accountManagerId: id }))}
            />
          </div>

          <div>
            <label className={labelClass}>Tags</label>
            <TagPicker
              selected={form.tags}
              onChange={(tags) => setForm((f) => ({ ...f, tags }))}
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              className={inputClass + " resize-none"}
              style={borderStyle}
              rows={3}
              placeholder="Internal notes about this contact..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
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
            onClick={handleCreate}
            disabled={createContact.isPending || !form.name || !form.email}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {createContact.isPending ? "Creating..." : "Create Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */

export default function CrmContactsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sourceFilter, setSourceFilter] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const [editingContact, setEditingContact] = useState<ContactRow | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const limit = 25;

  const { data, isLoading } = api.crm.getContacts.useQuery({
    search: search || undefined,
    status: statusFilter,
    source: sourceFilter,
    limit,
    offset: page * limit,
  });

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
        <div
          className="relative flex-1"
          style={{ minWidth: "200px", maxWidth: "320px" }}
        >
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

        <div className="relative">
          <select
            value={statusFilter ?? ""}
            onChange={(e) => {
              setStatusFilter(e.target.value || undefined);
              setPage(0);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pl-3 pr-8 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <option value="">All Statuses</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="client">Client</option>
            <option value="inactive">Inactive</option>
            <option value="churned">Churned</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <select
            value={sourceFilter ?? ""}
            onChange={(e) => {
              setSourceFilter(e.target.value || undefined);
              setPage(0);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pl-3 pr-8 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <option value="">All Sources</option>
            <option value="personal_site">matthewmiceli.com</option>
            <option value="miracle_mind">miraclemind.dev</option>
            <option value="banyan_waitlist">Banyan Waitlist</option>
            <option value="referral">Referral</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
        </div>

        {data && (
          <span className="text-sm text-gray-500">
            {data.total} contact{data.total !== 1 ? "s" : ""}
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
          New Contact
        </button>
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
                <th className="px-4 py-3">Sources</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tags</th>
                <th className="px-4 py-3">Last Contact</th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.contacts.map((contact: ContactRow) => {
                const config =
                  STATUS_CONFIG[contact.status] ?? STATUS_CONFIG.lead!;
                return (
                  <tr
                    key={contact.id}
                    className="border-b transition-colors hover:bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/crm/contacts/${contact.id}`}
                        className="font-medium text-white transition-colors hover:text-[#D4AF37]"
                      >
                        {contact.name}
                      </Link>
                      {contact.company && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                          <Building2 className="h-3 w-3" />
                          {contact.company}
                        </p>
                      )}
                      {contact.portalClient && (
                        <Link
                          href={`/admin/clients/${contact.portalClient.slug}`}
                          className="mt-0.5 flex items-center gap-1 text-xs transition-colors hover:text-white"
                          style={{ color: "#4ade80" }}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Portal Client
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1 text-gray-400">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </p>
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                            className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-[#D4AF37]"
                          >
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.submissionSources.length > 0 ? (
                          contact.submissionSources.map((src: string) => (
                            <span
                              key={src}
                              className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{
                                backgroundColor: "rgba(212, 175, 55, 0.1)",
                                color: "#D4AF37",
                              }}
                            >
                              {src}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: config.bg,
                          color: config.color,
                        }}
                      >
                        {config.label}
                      </span>
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
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => setEditingContact(contact)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                        title="Edit contact"
                        aria-label="Edit contact"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
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

      {/* Modals */}
      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onClose={() => setEditingContact(null)}
        />
      )}
      {showCreate && (
        <CreateContactModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
