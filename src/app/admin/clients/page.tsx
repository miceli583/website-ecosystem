"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientListItem = RouterOutputs["clients"]["list"]["items"][number];

import {
  Plus,
  Users,
  Building2,
  ArrowLeft,
  Search,
  Mail,
  ChevronDown,
  ExternalLink,
  FolderKanban,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  Tag,
  AlertTriangle,
  Info,
  UserPlus,
  UserCheck,
  Code2,
  Shield,
  Download,
  CheckSquare,
  Link2,
} from "lucide-react";
import {
  SortHeader,
  type SortLevel,
  inputClass,
  borderStyle,
} from "~/components/crm";

/* ── Shared styles ─────────────────────────────────────────────── */

const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";

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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter(
    (c) => c.toLowerCase().includes(value.toLowerCase()) && c !== value
  );

  const showCreate =
    value.trim() &&
    !suggestions.some((c) => c.toLowerCase() === value.trim().toLowerCase());

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Building2 className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
        <input
          aria-label="Search companies"
          className="w-full rounded-lg border bg-white/5 py-2 pr-3 pl-9 text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37]/50 focus:outline-none"
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

  const selected = value
    ? team.find((m: { id: string }) => m.id === value)
    : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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
              <span className="ml-auto text-xs text-gray-600">
                {member.email}
              </span>
            </button>
          ))}
          {team.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-500">
              No team members found
            </p>
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter(
    (t) =>
      !selected.includes(t) && t.toLowerCase().includes(input.toLowerCase())
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
          aria-label="Search tags"
          className="min-w-[80px] flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
          placeholder={
            selected.length === 0 ? "Search or add tags..." : "Add..."
          }
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
        role="dialog"
        aria-modal="true"
        aria-label="Create new client"
        className="relative mx-4 w-full max-w-lg rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">New Client</h2>
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
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
            disabled={
              createClient.isPending || !form.name || !form.email || !form.slug
            }
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

/* ── Add from Contact Modal ────────────────────────────────────── */

function AddFromContactModal({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils();
  const { data: contacts = [] } = api.crm.getContactOptions.useQuery();
  const { data: existingClients } = api.clients.list.useQuery({
    pageSize: 100,
  });
  const { data: team = [] } = api.crm.getCompanyTeam.useQuery();
  const promote = api.crm.promoteToClient.useMutation({
    onSuccess: () => {
      void utils.clients.list.invalidate();
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      onClose();
    },
  });

  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [form, setForm] = useState({
    slug: "",
    company: "",
    accountManagerId: null as string | null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedContact) setSelectedContact(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, selectedContact]);

  const existingEmails = new Set(
    existingClients?.items?.map((c: ClientListItem) => c.email.toLowerCase()) ??
      []
  );
  const available = contacts.filter(
    (c: { id: string; name: string; email: string }) =>
      !existingEmails.has(c.email.toLowerCase()) &&
      (search
        ? c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
        : true)
  );

  const handleSelect = (contact: {
    id: string;
    name: string;
    email: string;
  }) => {
    setSelectedContact(contact);
    setForm({
      slug: contact.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      company: "",
      accountManagerId: null,
    });
    setError("");
  };

  const handlePromote = () => {
    if (!selectedContact || !form.slug) return;
    setError("");
    promote.mutate(
      {
        crmId: selectedContact.id,
        slug: form.slug,
        company: form.company || undefined,
        accountManagerId: form.accountManagerId,
      },
      { onError: (err) => setError(err.message) }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add client from contact"
        className="relative mx-4 w-full max-w-lg rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
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
              <UserPlus className="h-4 w-4" style={{ color: "#D4AF37" }} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {selectedContact ? "Create Client Portal" : "Add from Contacts"}
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

        {!selectedContact ? (
          <>
            <div className="relative mb-4">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search contacts by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={inputClass + " pl-10"}
                style={borderStyle}
                autoFocus
              />
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {available.length === 0 ? (
                <div className="py-8 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                  <p className="text-sm text-gray-500">
                    {search ? "No matching contacts" : "No available contacts"}
                  </p>
                </div>
              ) : (
                available.map(
                  (c: { id: string; name: string; email: string }) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/10"
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: "rgba(212, 175, 55, 0.15)",
                          color: "#D4AF37",
                        }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {c.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {c.email}
                        </p>
                      </div>
                    </button>
                  )
                )
              )}
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-400">
              Promoting{" "}
              <span className="font-medium text-white">
                {selectedContact.name}
              </span>{" "}
              to client. This will create a portal at{" "}
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
                    value={selectedContact.name}
                    readOnly
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    className={inputClass + " cursor-not-allowed opacity-60"}
                    style={borderStyle}
                    value={selectedContact.email}
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
                  onChange={(id) =>
                    setForm((f) => ({ ...f, accountManagerId: id }))
                  }
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setSelectedContact(null)}
                className="text-sm text-gray-500 transition-colors hover:text-white"
              >
                &larr; Back to search
              </button>
              <div className="flex items-center gap-3">
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
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  {promote.isPending ? "Creating..." : "Create Client Portal"}
                </button>
              </div>
            </div>
          </>
        )}
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

  const [name, setName] = useState(client.crmContact?.name ?? client.name);
  const [email, setEmail] = useState(client.crmContact?.email ?? client.email);
  const [phone, setPhone] = useState(client.crmContact?.phone ?? "");
  const [company, setCompany] = useState(
    client.crmContact?.company ?? client.company ?? ""
  );
  const [accountManagerId, setAccountManagerId] = useState<string | null>(
    client.crmContact?.accountManagerId ?? client.accountManagerId ?? null
  );
  const [tags, setTags] = useState<string[]>(client.crmContact?.tags ?? []);
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
        role="dialog"
        aria-modal="true"
        aria-label="Edit client"
        className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Client</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium tracking-wider text-gray-400 uppercase">
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
              <CompanyPicker value={company} onChange={setCompany} />
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

        <div
          className="my-5 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
          }}
        />

        <div className="space-y-4">
          <h3 className="text-xs font-medium tracking-wider text-gray-400 uppercase">
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
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
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
                  className="w-full appearance-none rounded-lg border bg-white/5 px-3 py-2 pr-8 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  style={borderStyle}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
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
        role="dialog"
        aria-modal="true"
        aria-label="Confirm delete"
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
            <h2 className="text-lg font-semibold text-white">Delete Portal</h2>
            <p className="text-sm text-gray-400">{client.name}</p>
          </div>
        </div>

        <p className="mb-2 text-sm text-gray-400">
          This will <strong className="text-red-400">permanently delete</strong>{" "}
          the client portal and all associated data:
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
            Portal notes
          </li>
        </ul>
        <p className="mb-5 text-sm text-gray-500">
          The CRM contact, CRM notes, and activity history will{" "}
          <strong className="text-gray-300">not</strong> be deleted.
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
            {deleteClient.isPending ? "Deleting..." : "Delete Portal"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Action Menu ───────────────────────────────────────────────── */

function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Client actions"
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
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-3 w-3" />
            Delete Portal
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [amFilter, setAmFilter] = useState<string | undefined>();
  const [devFilter, setDevFilter] = useState<string | undefined>();
  const [connectorFilter, setConnectorFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sorts, setSorts] = useState<SortLevel[]>([
    { field: "name", order: "asc" },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddFromContact, setShowAddFromContact] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientListItem | null>(
    null
  );
  const [deletingClient, setDeletingClient] = useState<ClientListItem | null>(
    null
  );

  const utils = api.useUtils();
  const { data, isLoading } = api.clients.list.useQuery({
    search: search || undefined,
    accountManagerId: amFilter,
    assignedDeveloperId: devFilter,
    connectorId: connectorFilter,
    page,
    pageSize,
  });
  const { data: myRoles } = api.portal.getMyRoles.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const { data: teamMembers } = api.crm.getCompanyTeam.useQuery();
  const updateClient = api.clients.update.useMutation({
    onSuccess: () => void utils.clients.list.invalidate(),
  });

  const canAssign = myRoles?.isFullAccess ?? false;
  const items = data?.items ?? [];

  const accountManagers = (teamMembers ?? []).filter(
    (m: { companyRoles: string[] | null }) =>
      (m.companyRoles ?? []).some((r: string) =>
        ["founder", "admin", "account_manager"].includes(r)
      )
  );
  const developers = (teamMembers ?? []).filter(
    (m: { companyRoles: string[] | null }) =>
      (m.companyRoles ?? []).some((r: string) =>
        ["founder", "admin", "developer"].includes(r)
      )
  );
  const connectors = (teamMembers ?? []).filter(
    (m: { companyRoles: string[] | null }) =>
      (m.companyRoles ?? []).some((r: string) =>
        ["founder", "admin", "connector"].includes(r)
      )
  );

  /* ── Client-side multi-column sort ──────────────────────────── */
  const handleSort = (field: string) => {
    setSorts((prev) => {
      const idx = prev.findIndex((s) => s.field === field);
      if (idx === -1) return [...prev, { field, order: "asc" as const }];
      if (prev[idx]!.order === "asc")
        return prev.map((s, i) =>
          i === idx ? { ...s, order: "desc" as const } : s
        );
      return prev.filter((_, i) => i !== idx);
    });
  };

  const sortedClients = useMemo((): ClientListItem[] => {
    if (!items.length || !sorts.length) return items;
    return [...items].sort((a: ClientListItem, b: ClientListItem) => {
      for (const { field, order } of sorts) {
        let cmp = 0;
        const dir = order === "asc" ? 1 : -1;
        switch (field) {
          case "name":
            cmp = (a.name ?? "").localeCompare(b.name ?? "");
            break;
          case "email":
            cmp = (a.email ?? "").localeCompare(b.email ?? "");
            break;
          case "company":
            cmp = (a.company ?? "").localeCompare(b.company ?? "");
            break;
          case "projects":
            cmp = (a.projects?.length ?? 0) - (b.projects?.length ?? 0);
            break;
          case "am":
            cmp = (a.accountManager?.name ?? "").localeCompare(
              b.accountManager?.name ?? ""
            );
            break;
          case "dev":
            cmp = (
              (
                a as ClientListItem & {
                  assignedDeveloper?: { name: string } | null;
                }
              ).assignedDeveloper?.name ?? ""
            ).localeCompare(
              (
                b as ClientListItem & {
                  assignedDeveloper?: { name: string } | null;
                }
              ).assignedDeveloper?.name ?? ""
            );
            break;
          case "connector":
            cmp = (
              (a as ClientListItem & { connector?: { name: string } | null })
                .connector?.name ?? ""
            ).localeCompare(
              (b as ClientListItem & { connector?: { name: string } | null })
                .connector?.name ?? ""
            );
            break;
        }
        if (cmp !== 0) return cmp * dir;
      }
      return 0;
    });
  }, [items, sorts]);

  /* ── CSV Export ──────────────────────────────────────────────── */
  const handleExport = () => {
    if (!items.length) return;
    const exportItems =
      selectionMode && selectedIds.size > 0
        ? sortedClients.filter((c) => selectedIds.has(c.id))
        : sortedClients;
    if (!exportItems.length) return;

    const header = [
      "Name",
      "Email",
      "Company",
      "Projects",
      "Connector",
      "Account Manager",
      "Developer",
      "Portal Slug",
    ];
    const rows = exportItems.map((c: ClientListItem) => [
      c.name,
      c.email,
      c.company ?? "",
      String(c.projects?.length ?? 0),
      (c as ClientListItem & { connector?: { name: string } | null }).connector
        ?.name ?? "",
      c.accountManager?.name ?? "",
      (c as ClientListItem & { assignedDeveloper?: { name: string } | null })
        .assignedDeveloper?.name ?? "",
      c.slug,
    ]);

    const csv = [header, ...rows]
      .map((r) =>
        r.map((v: string) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Pagination helpers ─────────────────────────────────────── */
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const limit = pageSize;

  return (
    <div className="space-y-6">
      {/* ── Header Row ─────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4">
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
          <p className="text-sm text-gray-400">Client portal management</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Page size */}
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="appearance-none rounded-lg border bg-white/5 py-2 pr-8 pl-3 text-sm text-gray-400 focus:outline-none"
              style={borderStyle}
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Selection toggle */}
          <button
            onClick={() => {
              setSelectionMode((v) => !v);
              if (selectionMode) setSelectedIds(new Set());
            }}
            className={`rounded-lg border p-2 text-sm transition-colors ${
              selectionMode
                ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                : "text-gray-500 hover:bg-white/5 hover:text-white"
            }`}
            style={
              selectionMode
                ? undefined
                : { borderColor: "rgba(212, 175, 55, 0.2)" }
            }
            title={selectionMode ? "Exit selection mode" : "Select clients"}
          >
            <CheckSquare className="h-4 w-4" />
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={!items.length}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
            style={borderStyle}
          >
            <Download className="h-4 w-4" />
            {selectionMode && selectedIds.size > 0
              ? `Export (${selectedIds.size})`
              : "Export"}
          </button>

          {/* Add from Contacts */}
          <button
            onClick={() => setShowAddFromContact(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(212, 175, 55, 0.3)", color: "#D4AF37" }}
          >
            <UserPlus className="h-4 w-4" />
            Add from Contacts
          </button>

          {/* New Client */}
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            <Plus className="h-4 w-4" />
            New Client
          </button>
        </div>
      </div>

      {/* ── Selection Bar ──────────────────────────────────────── */}
      {selectionMode && selectedIds.size > 0 && (
        <div
          className="flex items-center gap-3 rounded-lg border px-4 py-2"
          style={{
            borderColor: "rgba(212, 175, 55, 0.3)",
            background: "rgba(212, 175, 55, 0.05)",
          }}
        >
          <span className="text-sm font-medium text-white">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-gray-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Filter Bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div
          className="relative flex-1"
          style={{ minWidth: "200px", maxWidth: "320px" }}
        >
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border bg-white/5 py-2 pr-3 pl-10 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            style={borderStyle}
          />
        </div>

        {/* AM filter */}
        <div className="relative">
          <select
            value={amFilter ?? ""}
            onChange={(e) => {
              setAmFilter(e.target.value || undefined);
              setPage(1);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
            style={borderStyle}
          >
            <option value="">All AMs</option>
            {accountManagers.map((m: { id: string; name: string }) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Dev filter */}
        <div className="relative">
          <select
            value={devFilter ?? ""}
            onChange={(e) => {
              setDevFilter(e.target.value || undefined);
              setPage(1);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
            style={borderStyle}
          >
            <option value="">All Devs</option>
            {developers.map((m: { id: string; name: string }) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Connector filter */}
        <div className="relative">
          <select
            value={connectorFilter ?? ""}
            onChange={(e) => {
              setConnectorFilter(e.target.value || undefined);
              setPage(1);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
            style={borderStyle}
          >
            <option value="">All Connectors</option>
            {connectors.map((m: { id: string; name: string }) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Count */}
        <div className="ml-auto">
          {data && (
            <span className="text-sm text-gray-500">
              {data.total} client{data.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── Client Table ───────────────────────────────────────── */}
      <div
        className="overflow-x-auto rounded-lg border bg-white/5"
        style={borderStyle}
      >
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : !sortedClients.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">
              {search || amFilter || devFilter || connectorFilter
                ? "No clients match your filters"
                : "No clients yet"}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead>
              <tr
                className="border-b text-xs font-medium tracking-wider text-gray-500 uppercase"
                style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
              >
                {selectionMode && (
                  <th className="w-10 px-2 py-3">
                    <input
                      type="checkbox"
                      checked={
                        sortedClients.length > 0 &&
                        sortedClients.every((c) => selectedIds.has(c.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(
                            new Set(sortedClients.map((c) => c.id))
                          );
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                      className="h-3.5 w-3.5 rounded border-gray-600 bg-transparent accent-[#D4AF37]"
                    />
                  </th>
                )}
                <SortHeader
                  field="name"
                  label="Name"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="projects"
                  label="Projects"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="connector"
                  label="Connector"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="am"
                  label="AM"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="dev"
                  label="Dev"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <th className="px-4 py-3">Portal</th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {sortedClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                >
                  {selectionMode && (
                    <td className="px-2 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(client.id)}
                        onChange={(e) => {
                          const next = new Set(selectedIds);
                          if (e.target.checked) {
                            next.add(client.id);
                          } else {
                            next.delete(client.id);
                          }
                          setSelectedIds(next);
                        }}
                        className="h-3.5 w-3.5 rounded border-gray-600 bg-transparent accent-[#D4AF37]"
                      />
                    </td>
                  )}

                  {/* Name + company + email */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${client.slug}`}
                      className="text-sm font-medium text-white transition-colors hover:text-[#D4AF37]"
                    >
                      {client.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {client.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {client.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </span>
                    </div>
                  </td>

                  {/* Projects */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <FolderKanban className="h-3 w-3" />
                      {client.projects.length}
                    </span>
                  </td>

                  {/* Connector */}
                  <td className="px-4 py-3" style={{ minWidth: "120px" }}>
                    <div className="flex items-center gap-1 text-xs">
                      <Link2 className="h-3 w-3 flex-shrink-0 text-purple-400" />
                      {canAssign ? (
                        <select
                          value={
                            (
                              client as ClientListItem & {
                                connectorId?: string | null;
                              }
                            ).connectorId ?? ""
                          }
                          onChange={(e) =>
                            updateClient.mutate({
                              id: client.id,
                              connectorId: e.target.value || null,
                            })
                          }
                          className="w-full appearance-none truncate border-0 bg-transparent py-0 text-xs text-gray-400 focus:text-white focus:outline-none"
                        >
                          <option value="">—</option>
                          {connectors.map((m: { id: string; name: string }) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="truncate text-gray-500">
                          {(
                            client as ClientListItem & {
                              connector?: { name: string } | null;
                            }
                          ).connector?.name ?? "—"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Account Manager */}
                  <td className="px-4 py-3" style={{ minWidth: "120px" }}>
                    <div className="flex items-center gap-1 text-xs">
                      <UserCheck
                        className="h-3 w-3 flex-shrink-0"
                        style={{ color: "#D4AF37" }}
                      />
                      {canAssign ? (
                        <select
                          value={client.accountManagerId ?? ""}
                          onChange={(e) =>
                            updateClient.mutate({
                              id: client.id,
                              accountManagerId: e.target.value || null,
                            })
                          }
                          className="w-full appearance-none truncate border-0 bg-transparent py-0 text-xs text-gray-400 focus:text-white focus:outline-none"
                        >
                          <option value="">—</option>
                          {accountManagers.map(
                            (m: { id: string; name: string }) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <span className="truncate text-gray-500">
                          {client.accountManager?.name ?? "—"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Developer */}
                  <td className="px-4 py-3" style={{ minWidth: "120px" }}>
                    <div className="flex items-center gap-1 text-xs">
                      <Code2 className="h-3 w-3 flex-shrink-0 text-blue-400" />
                      {canAssign ? (
                        <select
                          value={
                            (
                              client as ClientListItem & {
                                assignedDeveloperId?: string | null;
                              }
                            ).assignedDeveloperId ?? ""
                          }
                          onChange={(e) =>
                            updateClient.mutate({
                              id: client.id,
                              assignedDeveloperId: e.target.value || null,
                            })
                          }
                          className="w-full appearance-none truncate border-0 bg-transparent py-0 text-xs text-gray-400 focus:text-white focus:outline-none"
                        >
                          <option value="">—</option>
                          {developers.map((m: { id: string; name: string }) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="truncate text-gray-500">
                          {(
                            client as ClientListItem & {
                              assignedDeveloper?: { name: string } | null;
                            }
                          ).assignedDeveloper?.name ?? "—"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Portal link */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/portal/${client.slug}`}
                      className="inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#D4AF37" }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>

                  {/* Actions */}
                  <td className="px-2 py-3">
                    <ActionMenu
                      onEdit={() => setEditingClient(client)}
                      onDelete={() => setDeletingClient(client)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ─────────────────────────────────────────── */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {data.total > 0 ? (
              <>
                Showing {(page - 1) * limit + 1}&ndash;
                {Math.min(page * limit, data.total)} of {data.total}
              </>
            ) : (
              "0 clients"
            )}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                style={borderStyle}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((i) => {
                  return i === 1 || i === totalPages || Math.abs(i - page) <= 1;
                })
                .map((i, idx, arr) => (
                  <span key={i} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== i - 1 && (
                      <span className="px-1 text-xs text-gray-600">
                        &hellip;
                      </span>
                    )}
                    <button
                      onClick={() => setPage(i)}
                      className={`rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                        i === page
                          ? "font-medium text-[#D4AF37]"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {i}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.hasMore}
                className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                style={borderStyle}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────── */}
      {showCreate && <CreateClientModal onClose={() => setShowCreate(false)} />}
      {showAddFromContact && (
        <AddFromContactModal onClose={() => setShowAddFromContact(false)} />
      )}
      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
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
