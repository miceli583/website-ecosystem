"use client";

import { use, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone as PhoneIcon,
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
  PhoneCall,
  StickyNote,
  Calendar,
  ArrowUpDown,
  Building2,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import { api } from "~/trpc/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  TeamMemberPicker,
  TagPicker,
  ReferralPicker,
  CompanyPicker,
  StatusDropdown,
  inputClass,
  labelClass,
  borderStyle,
  STATUS_CONFIG,
} from "~/components/crm";
import { SOURCE_OPTIONS } from "~/lib/source-labels";
import { NoteEditor } from "~/components/portal/note-editor";
import { RichTextPreview } from "~/components/portal/rich-text-preview";

// ── Activity icon map ──────────────────────────────────────────────
const ACTIVITY_ICONS: Record<string, typeof PhoneCall> = {
  call: PhoneCall,
  email: Mail,
  meeting: Calendar,
  note: StickyNote,
  status_change: ArrowUpDown,
  assignment: UserCheck,
};

// ── Source badge colours (submission timeline) ─────────────────────
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

// ── Skeleton ───────────────────────────────────────────────────────
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

// ── Card wrapper ───────────────────────────────────────────────────
function SidebarCard({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="rounded-lg border bg-white/5 p-4"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const utils = api.useUtils();

  // ── Queries ────────────────────────────────────────────────────
  const { data: contact, isLoading } = api.crm.getContact.useQuery({ id });
  const { data: myRoles } = api.portal.getMyRoles.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // Activities & related contacts are loaded lazily after contact loads
  const { data: activities = [] } = api.crm.getActivities.useQuery(
    { crmId: contact?.id ?? "" },
    { enabled: !!contact }
  );
  const { data: relatedContacts = [] } = api.crm.getRelatedContacts.useQuery(
    { crmId: contact?.id ?? "", company: contact?.company ?? "" },
    { enabled: !!contact && !!contact.company }
  );
  const { data: crmNotes = [] } = api.crm.getCrmNotes.useQuery(
    { crmId: contact?.id ?? "" },
    { enabled: !!contact }
  );

  // ── Mutations ──────────────────────────────────────────────────
  const updateContact = api.crm.updateContact.useMutation({
    onSuccess: () => void utils.crm.getContact.invalidate({ id }),
  });
  const createActivity = api.crm.createActivity.useMutation({
    onSuccess: () => {
      void utils.crm.getActivities.invalidate({ crmId: contact?.id ?? "" });
      setShowLogCall(false);
      setLogCallTitle("");
      setLogCallDesc("");
    },
  });
  const promote = api.crm.promoteToClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContact.invalidate({ id });
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
      setShowPromote(false);
    },
  });
  const demote = api.crm.demoteClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContact.invalidate({ id });
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
      setDemotionInfo(null);
    },
  });

  const createNote = api.crm.createCrmNote.useMutation({
    onSuccess: () =>
      void utils.crm.getCrmNotes.invalidate({ crmId: contact?.id ?? "" }),
  });
  const updateNote = api.crm.updateCrmNote.useMutation({
    onSuccess: () =>
      void utils.crm.getCrmNotes.invalidate({ crmId: contact?.id ?? "" }),
  });
  const deleteNote = api.crm.deleteCrmNote.useMutation({
    onSuccess: () =>
      void utils.crm.getCrmNotes.invalidate({ crmId: contact?.id ?? "" }),
  });

  // ── Local state ────────────────────────────────────────────────
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const [showPromote, setShowPromote] = useState(false);
  const [portalOnly, setPortalOnly] = useState(false);
  const [promoteSlug, setPromoteSlug] = useState("");
  const [promoteError, setPromoteError] = useState("");
  const [demotionInfo, setDemotionInfo] = useState<{
    newStatus: string;
    client: { id: number; slug: string; name: string; status: string };
  } | null>(null);

  const [showLogCall, setShowLogCall] = useState(false);
  const [logCallTitle, setLogCallTitle] = useState("");
  const [logCallDesc, setLogCallDesc] = useState("");

  const notesRef = useRef<HTMLDivElement>(null);

  const canAssign = myRoles?.isFullAccess ?? false;

  // ── Helpers ────────────────────────────────────────────────────
  function startEdit(field: string, currentValue: string) {
    setEditingField(field);
    setEditValue(currentValue);
  }

  function saveField(field: string, value: string | null) {
    updateContact.mutate(
      { id, [field]: value },
      { onSuccess: () => setEditingField(null) }
    );
  }

  function saveNotes() {
    updateContact.mutate(
      { id, notes: editNotes || null },
      { onSuccess: () => setEditingField(null) }
    );
  }

  // ── Loading / not-found ────────────────────────────────────────
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

  // ── Submission timeline ────────────────────────────────────────
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

  // Communication preferences
  const commPrefs = (contact.communicationPreferences as {
    email?: boolean;
    sms?: boolean;
    phone?: boolean;
  }) ?? { email: true, sms: false, phone: false };

  return (
    <div className="space-y-6">
      {/* ── 1. Back link ─────────────────────────────────────────── */}
      <Link
        href="/admin/crm/contacts"
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contacts
      </Link>

      {/* ── 2. Header ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Name (editable) */}
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

          {/* Email / Phone / Company (inline editable) */}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {/* Email */}
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

            {/* Phone */}
            {editingField === "phone" ? (
              <span className="flex items-center gap-1">
                <PhoneIcon className="h-3.5 w-3.5" />
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
                <PhoneIcon className="h-3.5 w-3.5" />
                {contact.phone || "Add phone"}
                <Pencil className="h-2.5 w-2.5 text-gray-700 opacity-0 group-hover:opacity-100" />
              </span>
            )}

            {/* Company */}
            {editingField === "company" ? (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="rounded border bg-white/5 px-1.5 py-0.5 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  style={borderStyle}
                  autoFocus
                  placeholder="Company"
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      saveField("company", editValue || null);
                    if (e.key === "Escape") setEditingField(null);
                  }}
                />
                <button
                  onClick={() => saveField("company", editValue || null)}
                  className="text-[#D4AF37]"
                >
                  <Check className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <span
                className="group flex cursor-pointer items-center gap-1"
                onClick={() => startEdit("company", contact.company ?? "")}
                title="Click to edit"
              >
                <Building2 className="h-3.5 w-3.5" />
                {contact.company || "Add company"}
                <Pencil className="h-2.5 w-2.5 text-gray-700 opacity-0 group-hover:opacity-100" />
              </span>
            )}
          </div>
        </div>

        {/* Status dropdown pill */}
        <StatusDropdown
          value={contact.status}
          options={Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
            value: key,
            ...cfg,
          }))}
          onChange={(newStatus) => {
            const oldStatus = contact.status;

            // Promoting to client?
            if (oldStatus !== "client" && newStatus === "client") {
              if (contact.portalClient) {
                // Reactivating — client record exists, just update status
                updateContact.mutate({
                  id: contact.id,
                  status: "client" as const,
                });
              } else {
                // No client record — trigger promote modal
                setPortalOnly(false);
                setPromoteSlug(
                  contact.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")
                );
                setPromoteError("");
                setShowPromote(true);
              }
              return;
            }

            // Demoting from client with portal?
            if (
              oldStatus === "client" &&
              newStatus !== "client" &&
              contact.portalClient
            ) {
              setDemotionInfo({
                newStatus,
                client: contact.portalClient,
              });
              return;
            }

            // Normal status change
            updateContact.mutate({
              id: contact.id,
              status: newStatus as
                | "lead"
                | "prospect"
                | "client"
                | "inactive"
                | "churned",
            });
          }}
          disabled={updateContact.isPending}
        />
      </div>

      {/* ── 3. Quick Actions Bar ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowLogCall(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          style={borderStyle}
        >
          <PhoneCall className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
          Log Call
        </button>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          style={borderStyle}
        >
          <Mail className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
          Send Email
        </a>
        <button
          onClick={() => {
            notesRef.current?.scrollIntoView({ behavior: "smooth" });
            setEditingField("notes");
            setEditNotes(contact.notes ?? "");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          style={borderStyle}
        >
          <StickyNote className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
          Add Note
        </button>
        {!contact.portalClient && (
          <button
            onClick={() => {
              setPortalOnly(contact.status !== "client");
              setPromoteSlug(
                contact.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")
              );
              setPromoteError("");
              setShowPromote(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            style={borderStyle}
          >
            <ExternalLink
              className="h-3.5 w-3.5"
              style={{ color: "#D4AF37" }}
            />
            Create Portal
          </button>
        )}
      </div>

      {/* Log Call inline form */}
      {showLogCall && (
        <div
          className="rounded-lg border bg-white/5 p-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
        >
          <h4 className="mb-3 text-sm font-medium text-white">Log a Call</h4>
          <div className="space-y-2">
            <input
              className={inputClass}
              style={borderStyle}
              placeholder="Call title (e.g. 'Follow-up call')"
              value={logCallTitle}
              onChange={(e) => setLogCallTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowLogCall(false);
              }}
            />
            <textarea
              className={inputClass + " resize-none"}
              style={borderStyle}
              placeholder="Description (optional)"
              rows={2}
              value={logCallDesc}
              onChange={(e) => setLogCallDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!logCallTitle.trim()) return;
                  createActivity.mutate({
                    crmId: contact.id,
                    type: "call",
                    title: logCallTitle.trim(),
                    description: logCallDesc.trim() || undefined,
                  });
                }}
                disabled={createActivity.isPending || !logCallTitle.trim()}
                className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-black transition-opacity disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                <Check className="h-3 w-3" />
                {createActivity.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShowLogCall(false)}
                className="rounded px-3 py-1.5 text-xs text-gray-500 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Three-tab layout ──────────────────────────────────── */}
      <Tabs defaultValue="activity">
        <TabsList className="mb-4 bg-white/5">
          <TabsTrigger
            value="activity"
            className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            Activity ({activities.length + timeline.length})
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            Details &amp; Tags
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            Notes ({crmNotes.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Activity tab ──────────────────────────────────── */}
        <TabsContent value="activity">
          {activities.length === 0 ? (
            <div
              className="rounded-lg border bg-white/5 p-8 text-center"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <FileText className="mx-auto mb-2 h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-500">
                No activity yet. Log a call or add a note to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map(
                (activity: {
                  id: string;
                  type: string;
                  title: string;
                  description: string | null;
                  createdAt: Date;
                  creator: { id: string; name: string } | null;
                }) => {
                  const Icon = ACTIVITY_ICONS[activity.type] ?? FileText;
                  return (
                    <div
                      key={activity.id}
                      className="rounded-lg border bg-white/5 p-4"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.15)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                          }}
                        >
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: "#D4AF37" }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">
                            {activity.title}
                          </p>
                          {activity.description && (
                            <p className="mt-0.5 text-sm text-gray-400">
                              {activity.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            {activity.creator && (
                              <span>by {activity.creator.name}</span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(activity.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* ── Submissions section ─────────────────────────────── */}
          {timeline.length > 0 && (
            <>
              <h3 className="mt-6 mb-3 text-sm font-medium tracking-wider text-gray-400 uppercase">
                Form Submissions
              </h3>
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
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
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
            </>
          )}
        </TabsContent>

        {/* ── Details & Tags tab ─────────────────────────────────── */}
        <TabsContent value="details">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-4">
              <SidebarCard title="Source">
                <select
                  value={contact.source}
                  onChange={(e) =>
                    updateContact.mutate({ id, source: e.target.value })
                  }
                  className="w-full appearance-none rounded-lg border bg-white/5 px-3 py-2 pr-9 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  style={borderStyle}
                >
                  {SOURCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </SidebarCard>

              <SidebarCard title="Referred By">
                <ReferralPicker
                  contactId={contact.id}
                  referredBy={contact.referredBy}
                  referredByExternal={contact.referredByExternal}
                  onChange={(referredBy, referredByExternal) =>
                    updateContact.mutate({ id, referredBy, referredByExternal })
                  }
                />
              </SidebarCard>

              <SidebarCard title="Created By">
                <TeamMemberPicker
                  value={null}
                  placeholder={contact.createdBy ?? "Select creator..."}
                  onChange={(memberId) => {
                    if (!memberId) {
                      updateContact.mutate({ id, createdBy: null });
                      return;
                    }
                    const teamQuery = utils.crm.getCompanyTeam.getData();
                    const member = (
                      teamQuery as { id: string; name: string }[] | undefined
                    )?.find((m) => m.id === memberId);
                    updateContact.mutate({
                      id,
                      createdBy: member?.name ?? memberId,
                    });
                  }}
                />
              </SidebarCard>

              <SidebarCard title="Connector">
                <TeamMemberPicker
                  value={contact.connectorId}
                  placeholder="Select connector..."
                  onChange={(connectorId) =>
                    updateContact.mutate({ id, connectorId })
                  }
                />
              </SidebarCard>

              <SidebarCard title="Account Manager">
                {canAssign ? (
                  <TeamMemberPicker
                    value={contact.accountManagerId}
                    placeholder="Select account manager..."
                    onChange={(accountManagerId) =>
                      updateContact.mutate({ id, accountManagerId })
                    }
                  />
                ) : (
                  <p className="text-sm text-white">
                    {contact.accountManager?.name ?? (
                      <span className="text-gray-600">Unassigned</span>
                    )}
                  </p>
                )}
              </SidebarCard>

              <SidebarCard title="Assigned Developer">
                <TeamMemberPicker
                  value={contact.assignedDeveloperId}
                  placeholder="Select developer..."
                  onChange={(assignedDeveloperId) =>
                    updateContact.mutate({ id, assignedDeveloperId })
                  }
                />
              </SidebarCard>

              <SidebarCard title="Communication Preferences">
                <div className="space-y-2">
                  {(["email", "sms", "phone"] as const).map((channel) => (
                    <label
                      key={channel}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-300 capitalize">
                        {channel === "sms"
                          ? "SMS"
                          : channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </span>
                      <button
                        role="switch"
                        aria-checked={commPrefs[channel] ?? false}
                        onClick={() => {
                          const updated = {
                            ...commPrefs,
                            [channel]: !(commPrefs[channel] ?? false),
                          };
                          updateContact.mutate({
                            id,
                            communicationPreferences: updated,
                          });
                        }}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          commPrefs[channel] ? "bg-[#D4AF37]" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                            commPrefs[channel]
                              ? "translate-x-[18px]"
                              : "translate-x-[3px]"
                          }`}
                        />
                      </button>
                    </label>
                  ))}
                </div>
              </SidebarCard>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <SidebarCard title="Tags">
                <TagPicker
                  selected={contact.tags ?? []}
                  onChange={(tags) => updateContact.mutate({ id, tags })}
                />
              </SidebarCard>

              <SidebarCard title="Dates">
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
                      {new Date(contact.lastContactAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
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
              </SidebarCard>

              {relatedContacts.length > 0 && (
                <SidebarCard title="Related Contacts">
                  <div className="space-y-1.5">
                    {relatedContacts.map(
                      (rc: {
                        id: string;
                        name: string;
                        email: string;
                        status: string;
                      }) => {
                        const rcStatus =
                          STATUS_CONFIG[rc.status] ?? STATUS_CONFIG.lead!;
                        return (
                          <Link
                            key={rc.id}
                            href={`/admin/crm/contacts/${rc.id}`}
                            className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5"
                          >
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-gray-300">{rc.name}</span>
                            </div>
                            <span
                              className="rounded-full px-1.5 py-0.5 text-[10px]"
                              style={{
                                backgroundColor: rcStatus.bg,
                                color: rcStatus.color,
                              }}
                            >
                              {rcStatus.label}
                            </span>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </SidebarCard>
              )}

              {contact.stripeLifetimeSpend && (
                <SidebarCard title="Stripe Lifetime Spend">
                  <p className="flex items-center gap-2 text-2xl font-bold text-white">
                    <DollarSign
                      className="h-5 w-5"
                      style={{ color: "#D4AF37" }}
                    />
                    {(
                      contact.stripeLifetimeSpend.totalCents / 100
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {contact.stripeLifetimeSpend.chargeCount} successful charge
                    {contact.stripeLifetimeSpend.chargeCount !== 1 ? "s" : ""}
                  </p>
                </SidebarCard>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── Notes tab ──────────────────────────────────────────── */}
        <TabsContent value="notes">
          <div className="space-y-4">
            {!showNoteEditor && editingNoteId === null && (
              <button
                onClick={() => setShowNoteEditor(true)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                <StickyNote className="h-4 w-4" />
                Add Note
              </button>
            )}

            {showNoteEditor && (
              <NoteEditor
                onSave={(title, content) => {
                  createNote.mutate(
                    { crmId: contact.id, title, content },
                    { onSuccess: () => setShowNoteEditor(false) }
                  );
                }}
                onCancel={() => setShowNoteEditor(false)}
                saving={createNote.isPending}
              />
            )}

            {crmNotes.length === 0 && !showNoteEditor ? (
              <div
                className="rounded-lg border bg-white/5 p-8 text-center"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <StickyNote className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                <p className="text-sm text-gray-500">
                  No notes yet. Add one to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {crmNotes.map(
                  (note: {
                    id: number;
                    crmId: string;
                    title: string;
                    content: string;
                    createdByName: string;
                    isPinned: boolean;
                    isArchived: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                  }) => {
                    const isEditing = editingNoteId === note.id;
                    return (
                      <div key={note.id}>
                        {isEditing ? (
                          <NoteEditor
                            initialTitle={note.title}
                            initialContent={note.content}
                            compact
                            onSave={(title, content) => {
                              updateNote.mutate(
                                { id: note.id, title, content },
                                { onSuccess: () => setEditingNoteId(null) }
                              );
                            }}
                            onCancel={() => setEditingNoteId(null)}
                            saving={updateNote.isPending}
                          />
                        ) : (
                          <div
                            className="group rounded-lg border bg-white/5 p-4"
                            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="truncate text-sm font-medium text-white">
                                    {note.title}
                                  </h4>
                                  {note.isPinned && (
                                    <span
                                      className="text-[10px]"
                                      style={{ color: "#D4AF37" }}
                                    >
                                      Pinned
                                    </span>
                                  )}
                                </div>
                                {note.content && note.content !== "<p></p>" && (
                                  <div className="mt-1">
                                    <RichTextPreview
                                      html={note.content}
                                      lineClamp={3}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                  {note.createdByName} &middot;{" "}
                                  {new Date(note.updatedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <button
                                  onClick={() =>
                                    updateNote.mutate({
                                      id: note.id,
                                      isPinned: !note.isPinned,
                                    })
                                  }
                                  className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white"
                                  title={note.isPinned ? "Unpin" : "Pin"}
                                >
                                  <ArrowUpDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingNoteId(note.id)}
                                  className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white"
                                  title="Edit"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Delete this note?")) {
                                      deleteNote.mutate({ id: note.id });
                                    }
                                  }}
                                  className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-red-400"
                                  title="Delete"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── 5. Portal Client Banner ──────────────────────────────── */}
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

      {/* ── Promote to Client Modal ──────────────────────────────── */}
      {/* Demotion dialog */}
      {demotionInfo && contact && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDemotionInfo(null);
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
                <Shield className="h-4 w-4 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Client Has Active Portal
              </h2>
            </div>

            <p className="mb-2 text-sm text-gray-400">
              <span className="font-medium text-white">
                {demotionInfo.client.name}
              </span>{" "}
              has a portal at{" "}
              <span className="font-mono text-xs" style={{ color: "#D4AF37" }}>
                /portal/{demotionInfo.client.slug}
              </span>
              . Changing status to{" "}
              <span className="font-medium text-white">
                {STATUS_CONFIG[demotionInfo.newStatus]?.label ??
                  demotionInfo.newStatus}
              </span>{" "}
              requires handling the portal.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={() =>
                  demote.mutate({
                    crmId: contact.id,
                    newStatus: demotionInfo.newStatus as
                      | "lead"
                      | "prospect"
                      | "inactive"
                      | "churned",
                    portalAction: "archive",
                  })
                }
                disabled={demote.isPending}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <Shield className="h-5 w-5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Archive Portal
                  </p>
                  <p className="text-xs text-gray-500">
                    Portal preserved but inaccessible
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  demote.mutate({
                    crmId: contact.id,
                    newStatus: demotionInfo.newStatus as
                      | "lead"
                      | "prospect"
                      | "inactive"
                      | "churned",
                    portalAction: "remove",
                  })
                }
                disabled={demote.isPending}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
                style={{ borderColor: "rgba(248, 113, 113, 0.2)" }}
              >
                <X className="h-5 w-5 shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Remove from Portal
                  </p>
                  <p className="text-xs text-gray-500">
                    Client record deleted permanently
                  </p>
                </div>
              </button>

              <button
                onClick={() => setDemotionInfo(null)}
                disabled={demote.isPending}
                className="w-full rounded-lg border px-4 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                style={borderStyle}
              >
                Cancel — Keep as Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promote modal */}
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
                  {portalOnly ? "Create Portal" : "Create Client Portal"}
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
              {portalOnly ? (
                <>
                  Creating a portal for{" "}
                  <span className="font-medium text-white">{contact.name}</span>
                  . Their CRM status will remain{" "}
                  <span className="font-medium text-white">
                    {contact.status}
                  </span>
                  . Portal at{" "}
                </>
              ) : (
                <>
                  Promoting{" "}
                  <span className="font-medium text-white">{contact.name}</span>{" "}
                  to client. This will create a portal at{" "}
                </>
              )}
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
                      preserveStatus: portalOnly || undefined,
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
                {promote.isPending
                  ? "Creating..."
                  : portalOnly
                    ? "Create Portal"
                    : "Create Client Portal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
