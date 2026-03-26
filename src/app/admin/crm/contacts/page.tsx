"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  Download,
  Upload,
} from "lucide-react";
import { api } from "~/trpc/react";
import {
  TeamMemberPicker,
  TagPicker,
  ReferralPicker,
  CompanyPicker,
  SortHeader,
  type SortLevel,
  ContactKanban,
  CsvImportModal,
  inputClass,
  selectClass,
  labelClass,
  borderStyle,
  STATUS_CONFIG,
} from "~/components/crm";
import { ViewToggle } from "~/components/projects/view-toggle";
import { SOURCE_OPTIONS } from "~/lib/source-labels";

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
          Promoting{" "}
          <span className="font-medium text-white">{contact.name}</span> to
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
            <TeamMemberPicker
              placeholder="Select account manager..."
              value={form.accountManagerId}
              onChange={(id) =>
                setForm((f) => ({ ...f, accountManagerId: id }))
              }
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
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
          <span className="font-medium text-white">{clientInfo.name}</span> has
          a portal at{" "}
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

  const { data: team = [] } = api.crm.getCompanyTeam.useQuery();

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
    createdById: null as string | null,
    tags: contact.tags ?? [],
    notes: contact.notes ?? "",
  });

  // Resolve createdBy name to team member ID once team data loads
  const [createdByResolved, setCreatedByResolved] = useState(false);
  useEffect(() => {
    if (team.length > 0 && !createdByResolved && contact.createdBy) {
      const match = team.find(
        (m: { name: string }) => m.name === contact.createdBy
      );
      if (match) {
        setForm((f) => ({ ...f, createdById: match.id }));
      }
      setCreatedByResolved(true);
    }
  }, [team, createdByResolved, contact.createdBy]);

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
    // Resolve createdById to name for storage
    const createdByName = form.createdById
      ? (team.find((m: { id: string }) => m.id === form.createdById)?.name ??
        null)
      : null;

    updateContact.mutate({
      id: contact.id,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      status: form.status as
        | "lead"
        | "prospect"
        | "client"
        | "inactive"
        | "churned",
      source: form.source,
      referredBy: form.referredBy,
      referredByExternal: form.referredByExternal,
      accountManagerId: form.accountManagerId,
      createdBy: createdByName,
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
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.source}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, source: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
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
                  setForm((f) => ({
                    ...f,
                    referredBy: rb,
                    referredByExternal: rbe,
                  }))
                }
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Created By</label>
            <TeamMemberPicker
              value={form.createdById}
              onChange={(id) => setForm((f) => ({ ...f, createdById: id }))}
              placeholder="Select who created this contact..."
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
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
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
            disabled={
              updateContact.isPending ||
              checkClientStatus.isFetching ||
              !form.name ||
              !form.email
            }
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
    onSuccess: (data) => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getTagOptions.invalidate();
      // If status is "client", promote the newly created contact
      if (form.status === "client" && data?.id) {
        setCreatedCrmId(data.id);
        return; // Don't close — show promotion step
      }
      onClose();
    },
  });

  const promote = api.crm.promoteToClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
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

  const [createdCrmId, setCreatedCrmId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [promoteError, setPromoteError] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Auto-generate slug when entering promotion step
  useEffect(() => {
    if (createdCrmId && !slug) {
      setSlug(
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [createdCrmId, form.name, slug]);

  const handleCreate = () => {
    createContact.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      status: form.status as
        | "lead"
        | "prospect"
        | "client"
        | "inactive"
        | "churned",
      source: form.source,
      referredBy: form.referredBy,
      referredByExternal: form.referredByExternal,
      accountManagerId: form.accountManagerId,
      tags: form.tags.length > 0 ? form.tags : undefined,
      notes: form.notes || null,
    });
  };

  const handlePromote = () => {
    if (!createdCrmId || !slug) return;
    setPromoteError("");
    promote.mutate(
      {
        crmId: createdCrmId,
        slug,
        company: form.company || undefined,
        accountManagerId: form.accountManagerId,
      },
      { onError: (err) => setPromoteError(err.message) }
    );
  };

  // Promotion step — shown after contact is created with status "client"
  if (createdCrmId) {
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
            Contact created. Now set up the client portal for{" "}
            <span className="font-medium text-white">{form.name}</span> at{" "}
            <span className="font-mono text-xs" style={{ color: "#D4AF37" }}>
              /portal/{slug}
            </span>
          </p>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Portal Slug</label>
              <input
                className={inputClass}
                style={borderStyle}
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                  )
                }
                placeholder="client-slug"
              />
            </div>

            {promoteError && (
              <p className="text-sm text-red-400">{promoteError}</p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              style={borderStyle}
            >
              Skip — Just Save Contact
            </button>
            <button
              onClick={handlePromote}
              disabled={promote.isPending || !slug}
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
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                style={borderStyle}
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <div className="relative">
                <select
                  className={selectClass}
                  style={borderStyle}
                  value={form.source}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, source: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          {form.status === "client" && (
            <div
              className="flex items-start gap-2 rounded-lg border p-3"
              style={{
                borderColor: "rgba(74, 222, 128, 0.3)",
                backgroundColor: "rgba(74, 222, 128, 0.05)",
              }}
            >
              <Shield
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "#4ade80" }}
              />
              <p className="text-xs text-gray-400">
                After creating this contact, you&apos;ll be prompted to set up
                their client portal.
              </p>
            </div>
          )}

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
                  setForm((f) => ({
                    ...f,
                    referredBy: rb,
                    referredByExternal: rbe,
                  }))
                }
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Account Manager</label>
            <TeamMemberPicker
              placeholder="Select account manager..."
              value={form.accountManagerId}
              onChange={(id) =>
                setForm((f) => ({ ...f, accountManagerId: id }))
              }
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
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
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
  const [createdByFilter, setCreatedByFilter] = useState<string | undefined>();
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const [view, setView] = useState<"list" | "kanban">("list");
  const [sorts, setSorts] = useState<SortLevel[]>([
    { field: "name", order: "asc" },
  ]);
  const [page, setPage] = useState(0);
  const [editingContact, setEditingContact] = useState<ContactRow | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const limit = 25;

  const utils = api.useUtils();
  const { data: tagOptions = [] } = api.crm.getTagOptions.useQuery();
  const { data: team = [] } = api.crm.getCompanyTeam.useQuery();

  const { data, isLoading } = api.crm.getContacts.useQuery({
    search: search || undefined,
    status: statusFilter,
    source: sourceFilter,
    createdBy: createdByFilter,
    tag: tagFilter,
    limit: view === "kanban" ? 100 : limit,
    offset: view === "kanban" ? 0 : page * limit,
  });

  const kanbanStatusChange = api.crm.updateContact.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
    },
  });

  const handleExport = () => {
    if (!data?.contacts?.length) return;
    const rows = (data.contacts as ContactRow[]).map((c) => [
      c.name,
      c.email,
      c.phone ?? "",
      c.company ?? "",
      c.status,
      c.source,
      (c.tags ?? []).join("; "),
      c.createdBy ?? "",
      new Date(c.lastContactAt).toISOString().split("T")[0],
    ]);
    const header = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Source",
      "Tags",
      "Created By",
      "Last Contact",
    ];
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: string) => {
    setSorts((prev) => {
      const idx = prev.findIndex((s) => s.field === field);
      if (idx === -1) {
        // Add as new sort level
        return [...prev, { field, order: "asc" as const }];
      }
      if (prev[idx]!.order === "asc") {
        // Toggle to desc
        return prev.map((s, i) =>
          i === idx ? { ...s, order: "desc" as const } : s
        );
      }
      // Third click — remove this sort level
      return prev.filter((_, i) => i !== idx);
    });
  };

  const compareField = (
    a: ContactRow,
    b: ContactRow,
    field: string
  ): number => {
    switch (field) {
      case "name":
        return a.name.localeCompare(b.name);
      case "email":
        return a.email.localeCompare(b.email);
      case "status":
        return a.status.localeCompare(b.status);
      case "lastContact":
        return (
          new Date(a.lastContactAt).getTime() -
          new Date(b.lastContactAt).getTime()
        );
      default:
        return 0;
    }
  };

  const sortedContacts = useMemo(() => {
    if (!data?.contacts) return [];
    if (sorts.length === 0) return data.contacts as ContactRow[];
    const contacts = [...data.contacts] as ContactRow[];
    contacts.sort((a, b) => {
      for (const { field, order } of sorts) {
        const cmp = compareField(a, b, field);
        if (cmp !== 0) return order === "desc" ? -cmp : cmp;
      }
      return 0;
    });
    return contacts;
  }, [data?.contacts, sorts]);

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
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full rounded-lg border bg-white/5 py-2 pr-3 pl-10 text-sm text-white placeholder:text-gray-500 focus:outline-none"
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
            className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <option value="">All Statuses</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="client">Client</option>
            <option value="inactive">Inactive</option>
            <option value="churned">Churned</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <select
            value={sourceFilter ?? ""}
            onChange={(e) => {
              setSourceFilter(e.target.value || undefined);
              setPage(0);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <option value="">All Sources</option>
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <select
            value={createdByFilter ?? ""}
            onChange={(e) => {
              setCreatedByFilter(e.target.value || undefined);
              setPage(0);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <option value="">All Created By</option>
            {team.map((m: { id: string; name: string }) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <select
            value={tagFilter ?? ""}
            onChange={(e) => {
              setTagFilter(e.target.value || undefined);
              setPage(0);
            }}
            className="appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <option value="">All Tags</option>
            {tagOptions.map((tag: string) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        {data && (
          <span className="text-sm text-gray-500">
            {data.total} contact{data.total !== 1 ? "s" : ""}
          </span>
        )}

        <ViewToggle view={view} onViewChange={setView} />

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={!data?.contacts?.length}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            <Plus className="h-4 w-4" />
            New Contact
          </button>
        </div>
      </div>

      {/* Contacts View */}
      {view === "kanban" ? (
        isLoading ? (
          <TableSkeleton />
        ) : !data?.contacts?.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">
              {search ||
              statusFilter ||
              sourceFilter ||
              createdByFilter ||
              tagFilter
                ? "No contacts match your filters"
                : "No contacts yet"}
            </p>
          </div>
        ) : (
          <ContactKanban
            contacts={data.contacts as ContactRow[]}
            onStatusChange={(id, status) =>
              kanbanStatusChange.mutate({
                id,
                status: status as
                  | "lead"
                  | "prospect"
                  | "client"
                  | "inactive"
                  | "churned",
              })
            }
            isPending={kanbanStatusChange.isPending}
          />
        )
      ) : (
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
                {search ||
                statusFilter ||
                sourceFilter ||
                createdByFilter ||
                tagFilter
                  ? "No contacts match your filters"
                  : "No contacts yet"}
              </p>
            </div>
          ) : (
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
                    field="email"
                    label="Contact"
                    sorts={sorts}
                    onSort={handleSort}
                  />
                  <th className="px-4 py-3">Sources</th>
                  <SortHeader
                    field="status"
                    label="Status"
                    sorts={sorts}
                    onSort={handleSort}
                  />
                  <th className="px-4 py-3">Tags</th>
                  <SortHeader
                    field="lastContact"
                    label="Last Contact"
                    sorts={sorts}
                    onSort={handleSort}
                  />
                  <th className="w-10 px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {sortedContacts.map((contact: ContactRow) => {
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
      )}

      {/* Pagination */}
      {view === "list" && data && data.total > limit && (
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
      {showImport && (
        <CsvImportModal
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            void utils.crm.getContacts.invalidate();
            void utils.crm.getPipelineStats.invalidate();
            void utils.crm.getTagOptions.invalidate();
          }}
        />
      )}
    </div>
  );
}
