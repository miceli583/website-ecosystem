"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Tag,
  ExternalLink,
  Globe,
  Leaf,
  User,
  FileText,
  ChevronDown,
  UserCheck,
  DollarSign,
  Shield,
  X,
  Pencil,
  Check,
  Code2,
} from "lucide-react";
import { api } from "~/trpc/react";

const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };
const selectClass =
  "w-full appearance-none rounded-lg border bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  companyRoles: string[] | null;
};

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

const SOURCE_COLORS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  miraclemind: {
    bg: "rgba(139, 92, 246, 0.1)",
    color: "#a78bfa",
    label: "miraclemind.dev",
  },
  personal: {
    bg: "rgba(59, 130, 246, 0.1)",
    color: "#60a5fa",
    label: "matthewmiceli.com",
  },
  banyan: {
    bg: "rgba(16, 185, 129, 0.1)",
    color: "#34d399",
    label: "Banyan",
  },
};

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
      <div className="h-10 w-64 animate-pulse rounded bg-white/10" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const utils = api.useUtils();
  const { data: contact, isLoading } = api.crm.getContact.useQuery({ id });
  const updateContact = api.crm.updateContact.useMutation();
  const promote = api.crm.promoteToClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContact.invalidate({ id });
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
      setShowPromote(false);
    },
  });

  const { data: myRoles } = api.portal.getMyRoles.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const { data: teamMembers } = api.crm.getCompanyTeam.useQuery();

  const [showPromote, setShowPromote] = useState(false);
  const [promoteSlug, setPromoteSlug] = useState("");
  const [promoteError, setPromoteError] = useState("");

  // Inline editing state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const canAssign = myRoles?.isFullAccess ?? false;

  function startEdit(field: string, currentValue: string) {
    setEditingField(field);
    setEditValue(currentValue);
  }

  function saveField(field: string, value: string | null) {
    updateContact.mutate(
      { id, [field]: value },
      {
        onSuccess: () => {
          void utils.crm.getContact.invalidate({ id });
          setEditingField(null);
        },
      }
    );
  }

  function saveNotes() {
    updateContact.mutate(
      { id, notes: editNotes || null },
      {
        onSuccess: () => {
          void utils.crm.getContact.invalidate({ id });
          setEditingField(null);
        },
      }
    );
  }

  if (isLoading) return <PageSkeleton />;

  if (!contact) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/crm/contacts"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contacts
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <User className="mb-3 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">Contact not found</p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[contact.status] ?? STATUS_CONFIG.lead!;

  // Build unified submission timeline
  type TimelineItem = {
    id: string;
    source: "miraclemind" | "personal" | "banyan";
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: Date;
    extra?: Record<string, string | string[] | boolean | null>;
  };

  type MmSubmission = {
    id: number;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: Date;
    services: string[] | null;
    role: string | null;
    stewardshipInterest: boolean | null;
  };
  type PersonalSubmission = {
    id: number;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: Date;
  };
  type BanyanSignup = {
    id: number;
    fullName: string;
    email: string;
    message: string | null;
    contacted: boolean;
    createdAt: Date;
    role: string | null;
  };

  const timeline: TimelineItem[] = [
    ...contact.submissions.miracleMind.map((s: MmSubmission) => ({
      id: `mm-${s.id}`,
      source: "miraclemind" as const,
      name: s.name,
      email: s.email,
      message: s.message,
      read: s.read,
      createdAt: s.createdAt,
      extra: {
        services: s.services,
        role: s.role,
        stewardshipInterest: s.stewardshipInterest,
      },
    })),
    ...contact.submissions.personal.map((s: PersonalSubmission) => ({
      id: `personal-${s.id}`,
      source: "personal" as const,
      name: s.name,
      email: s.email,
      message: s.message,
      read: s.read,
      createdAt: s.createdAt,
    })),
    ...contact.submissions.banyan.map((s: BanyanSignup) => ({
      id: `banyan-${s.id}`,
      source: "banyan" as const,
      name: s.fullName,
      email: s.email,
      message: s.message ?? "",
      read: s.contacted,
      createdAt: s.createdAt,
      extra: { role: s.role },
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Derive which sources this contact has submissions in
  const activeSources: string[] = [];
  if (contact.submissions.miracleMind.length > 0)
    activeSources.push("miraclemind.dev");
  if (contact.submissions.personal.length > 0)
    activeSources.push("matthewmiceli.com");
  if (contact.submissions.banyan.length > 0) activeSources.push("Banyan");

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/crm/contacts"
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contacts
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {editingField === "name" ? (
            <div className="flex items-center gap-2">
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="rounded border bg-white/5 px-2 py-1 text-2xl font-bold text-white focus:border-[#D4AF37]/50 focus:outline-none"
                style={borderStyle}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveField("name", editValue);
                  if (e.key === "Escape") setEditingField(null);
                }}
              />
              <button
                onClick={() => saveField("name", editValue)}
                className="rounded p-1 text-[#D4AF37] hover:bg-white/5"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="rounded p-1 text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <h1 className="group flex items-center gap-2 text-2xl font-bold text-white">
              {contact.name}
              <button
                onClick={() => startEdit("name", contact.name)}
                className="text-gray-700 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-300"
                title="Edit name"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </h1>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {editingField === "email" ? (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="rounded border bg-white/5 px-1.5 py-0.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  style={borderStyle}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveField("email", editValue);
                    if (e.key === "Escape") setEditingField(null);
                  }}
                />
                <button
                  onClick={() => saveField("email", editValue)}
                  className="text-[#D4AF37]"
                >
                  <Check className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <span
                className="group flex cursor-pointer items-center gap-1"
                onClick={() => startEdit("email", contact.email)}
                title="Click to edit"
              >
                <Mail className="h-3.5 w-3.5" />
                {contact.email}
                <Pencil className="h-2.5 w-2.5 text-gray-700 opacity-0 group-hover:opacity-100" />
              </span>
            )}
            {editingField === "phone" ? (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="rounded border bg-white/5 px-1.5 py-0.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  style={borderStyle}
                  autoFocus
                  placeholder="(555) 000-0000"
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      saveField("phone", editValue || null);
                    if (e.key === "Escape") setEditingField(null);
                  }}
                />
                <button
                  onClick={() => saveField("phone", editValue || null)}
                  className="text-[#D4AF37]"
                >
                  <Check className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <span
                className="group flex cursor-pointer items-center gap-1"
                onClick={() => startEdit("phone", contact.phone ?? "")}
                title="Click to edit"
              >
                <Phone className="h-3.5 w-3.5" />
                {contact.phone || "Add phone"}
                <Pencil className="h-2.5 w-2.5 text-gray-700 opacity-0 group-hover:opacity-100" />
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <select
            value={contact.status}
            onChange={(e) => {
              const newStatus = e.target.value as
                | "lead"
                | "prospect"
                | "client"
                | "inactive"
                | "churned";
              // Intercept promotion to client
              if (
                newStatus === "client" &&
                contact.status !== "client" &&
                !contact.portalClient
              ) {
                setPromoteSlug(
                  contact.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")
                );
                setPromoteError("");
                setShowPromote(true);
                return;
              }
              updateContact.mutate({ id: contact.id, status: newStatus });
            }}
            className="appearance-none rounded-full border-0 px-3 py-1 text-sm font-medium focus:outline-none"
            style={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
            }}
          >
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-1 h-3 w-3 -translate-y-1/2"
            style={{ color: statusConfig.color }}
          />
        </div>
      </div>

      {/* Portal Client Banner */}
      {contact.portalClient && (
        <Link
          href={`/admin/clients/${contact.portalClient.slug}`}
          className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:bg-white/5"
          style={{
            borderColor: "rgba(74, 222, 128, 0.3)",
            backgroundColor: "rgba(74, 222, 128, 0.05)",
          }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(74, 222, 128, 0.15)" }}
          >
            <ExternalLink className="h-4 w-4" style={{ color: "#4ade80" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              Portal Client: {contact.portalClient.name}
            </p>
            <p className="text-xs text-gray-500">
              Slug: {contact.portalClient.slug}
            </p>
          </div>
          <span className="text-xs text-gray-500">View client →</span>
        </Link>
      )}

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Submission Timeline */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-semibold text-white">
            Submission Timeline ({timeline.length})
          </h2>
          {timeline.length === 0 ? (
            <div
              className="rounded-lg border bg-white/5 p-8 text-center"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <FileText className="mx-auto mb-2 h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-500">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {timeline.map((item) => {
                const src = SOURCE_COLORS[item.source]!;
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border bg-white/5 p-4"
                    style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: src.bg,
                            color: src.color,
                          }}
                        >
                          {src.label}
                        </span>
                        {!item.read && (
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: "#D4AF37" }}
                            title="Unread"
                          />
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{item.message}</p>
                    {item.extra?.services && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(item.extra.services as string[]).map((svc) => (
                          <span
                            key={svc}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.extra?.role && (
                      <p className="mt-1 text-xs text-gray-500">
                        Role: {item.extra.role as string}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Contact Details */}
        <div className="space-y-4">
          {/* Sources */}
          <div
            className="rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Submission Sources
            </h3>
            {activeSources.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeSources.map((src) => (
                  <span
                    key={src}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      color: "#D4AF37",
                    }}
                  >
                    {src === "Banyan" ? (
                      <Leaf className="h-3 w-3" />
                    ) : (
                      <Globe className="h-3 w-3" />
                    )}
                    {src}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No form submissions</p>
            )}
          </div>

          {/* Assignments */}
          <div
            className="rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <h3 className="mb-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Assignments
            </h3>
            <div className="space-y-3">
              {/* Account Manager */}
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <UserCheck className="h-3 w-3" style={{ color: "#D4AF37" }} />
                  Account Manager
                </label>
                {canAssign ? (
                  <select
                    value={contact.accountManagerId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value || null;
                      updateContact.mutate(
                        { id, accountManagerId: val },
                        {
                          onSuccess: () =>
                            void utils.crm.getContact.invalidate({ id }),
                        }
                      );
                    }}
                    className={selectClass}
                    style={borderStyle}
                  >
                    <option value="">Unassigned</option>
                    {(teamMembers as TeamMember[] | undefined)
                      ?.filter((m: TeamMember) =>
                        m.companyRoles?.some((r: string) =>
                          ["founder", "admin", "account_manager"].includes(r)
                        )
                      )
                      .map((m: TeamMember) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  <p className="text-sm text-white">
                    {contact.accountManager?.name ?? (
                      <span className="text-gray-600">Unassigned</span>
                    )}
                  </p>
                )}
              </div>

              {/* Assigned Developer */}
              {contact.portalClient && (
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                    <Code2 className="h-3 w-3" style={{ color: "#60a5fa" }} />
                    Assigned Developer
                  </label>
                  {canAssign ? (
                    <select
                      value={contact.portalClient.assignedDeveloperId ?? ""}
                      onChange={(e) => {
                        // Developer assignment happens on the client record,
                        // not CRM contact — would need a separate mutation.
                        // For now, display-only until client update supports it.
                      }}
                      className={selectClass + " cursor-not-allowed opacity-60"}
                      style={borderStyle}
                      disabled
                      title="Developer assignment coming soon"
                    >
                      <option value="">Unassigned</option>
                      {(teamMembers as TeamMember[] | undefined)
                        ?.filter((m: TeamMember) =>
                          m.companyRoles?.some((r: string) =>
                            ["founder", "admin", "developer"].includes(r)
                          )
                        )
                        .map((m: TeamMember) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm text-white">
                      <span className="text-gray-600">Unassigned</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stripe Lifetime Spend */}
          {contact.stripeLifetimeSpend && (
            <div
              className="rounded-lg border bg-white/5 p-4"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Stripe Lifetime Spend
              </h3>
              <p className="flex items-center gap-2 text-2xl font-bold text-white">
                <DollarSign className="h-5 w-5" style={{ color: "#D4AF37" }} />
                {(contact.stripeLifetimeSpend.totalCents / 100).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  }
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {contact.stripeLifetimeSpend.chargeCount} successful charge
                {contact.stripeLifetimeSpend.chargeCount !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Tags */}
          <div
            className="rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Tags
            </h3>
            {contact.tags?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs"
                    style={{
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      color: "#D4AF37",
                    }}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No tags</p>
            )}
          </div>

          {/* Notes (inline editable) */}
          <div
            className="rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Notes
              </h3>
              {editingField !== "notes" && (
                <button
                  onClick={() => {
                    setEditingField("notes");
                    setEditNotes(contact.notes ?? "");
                  }}
                  className="text-gray-600 transition-colors hover:text-gray-300"
                  title="Edit notes"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {editingField === "notes" ? (
              <div>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  className={inputClass + " resize-none"}
                  style={borderStyle}
                  autoFocus
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={saveNotes}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-black"
                    style={{
                      background:
                        "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    }}
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="rounded px-2 py-1 text-xs text-gray-500 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap text-gray-400">
                {contact.notes ?? "No notes"}
              </p>
            )}
          </div>

          {/* Dates */}
          <div
            className="rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Dates
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">First contact</span>
                <span className="text-gray-300">
                  {new Date(contact.firstContactAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last contact</span>
                <span className="text-gray-300">
                  {new Date(contact.lastContactAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-300">
                  {new Date(contact.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promote to Client Modal */}
      {showPromote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPromote(false);
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
                onClick={() => setShowPromote(false)}
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
                /portal/{promoteSlug}
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
                  value={promoteSlug}
                  onChange={(e) =>
                    setPromoteSlug(
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
                onClick={() => setShowPromote(false)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                style={borderStyle}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!promoteSlug) return;
                  setPromoteError("");
                  promote.mutate(
                    {
                      crmId: contact.id,
                      slug: promoteSlug,
                      company: contact.company ?? undefined,
                      accountManagerId: contact.accountManagerId,
                    },
                    { onError: (err) => setPromoteError(err.message) }
                  );
                }}
                disabled={promote.isPending || !promoteSlug}
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
        </div>
      )}
    </div>
  );
}
