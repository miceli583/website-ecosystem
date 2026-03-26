"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone as PhoneIcon,
  Clock,
  ExternalLink,
  FileText,
  DollarSign,
  ChevronDown,
  X,
  Pencil,
  Check,
  PhoneCall,
  StickyNote,
  Building2,
  Users,
  ArrowUpDown,
  Calendar,
  UserCheck,
  Briefcase,
} from "lucide-react";
import { api, type RouterOutputs } from "~/trpc/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  TeamMemberPicker,
  TagPicker,
  ReferralPicker,
  inputClass,
  borderStyle,
  STATUS_CONFIG,
} from "~/components/crm";
import { SOURCE_OPTIONS } from "~/lib/source-labels";

// ── Types ─────────────────────────────────────────────────────────
type ClientDetail = NonNullable<RouterOutputs["clients"]["getBySlugAdmin"]>;

// ── Client status config ──────────────────────────────────────────
const CLIENT_STATUS_CONFIG: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  active: { bg: "rgba(74, 222, 128, 0.1)", color: "#4ade80", label: "Active" },
  inactive: {
    bg: "rgba(156, 163, 175, 0.1)",
    color: "#9ca3af",
    label: "Inactive",
  },
};

// ── Activity icon map ─────────────────────────────────────────────
const ACTIVITY_ICONS: Record<string, typeof PhoneCall> = {
  call: PhoneCall,
  email: Mail,
  meeting: Calendar,
  note: StickyNote,
  status_change: ArrowUpDown,
  assignment: UserCheck,
};

// ── Source badge colours (submission timeline) ────────────────────
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

// ── Skeleton ──────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-black p-6 text-white sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-10 w-64 animate-pulse rounded bg-white/10" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-white/5"
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  );
}

// ── Sidebar card wrapper ──────────────────────────────────────────
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

// ── Main page ─────────────────────────────────────────────────────
export default function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const utils = api.useUtils();

  // ── Queries ──────────────────────────────────────────────────────
  const { data: client, isLoading } = api.clients.getBySlugAdmin.useQuery({
    slug,
  });

  // Linked CRM contact (only if client has crmId)
  const { data: crmContact } = api.crm.getContact.useQuery(
    { id: client?.crmId ?? "" },
    { enabled: !!client?.crmId }
  );

  // Activities from CRM
  const { data: activities = [] } = api.crm.getActivities.useQuery(
    { crmId: client?.crmId ?? "" },
    { enabled: !!client?.crmId }
  );

  // Related contacts at same company
  const { data: relatedContacts = [] } = api.crm.getRelatedContacts.useQuery(
    { crmId: client?.crmId ?? "", company: client?.company ?? "" },
    { enabled: !!client?.crmId && !!client?.company }
  );

  // Permission checks
  const { data: myRoles } = api.portal.getMyRoles.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // ── Mutations ────────────────────────────────────────────────────
  // CRM fields (name, email, company, phone, accountManagerId, connectorId, etc.)
  const updateCrmContact = api.crm.updateContact.useMutation({
    onSuccess: () => {
      void utils.clients.getBySlugAdmin.invalidate({ slug });
      if (client?.crmId) {
        void utils.crm.getContact.invalidate({ id: client.crmId });
      }
    },
  });

  // Client-only fields (status, assignedDeveloperId, slug)
  const updateClient = api.clients.update.useMutation({
    onSuccess: () => {
      void utils.clients.getBySlugAdmin.invalidate({ slug });
    },
  });

  // Activity logging
  const createActivity = api.crm.createActivity.useMutation({
    onSuccess: () => {
      if (client?.crmId) {
        void utils.crm.getActivities.invalidate({ crmId: client.crmId });
      }
      setShowLogCall(false);
      setLogCallTitle("");
      setLogCallDesc("");
    },
  });

  // ── Local state ──────────────────────────────────────────────────
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const [showLogCall, setShowLogCall] = useState(false);
  const [logCallTitle, setLogCallTitle] = useState("");
  const [logCallDesc, setLogCallDesc] = useState("");

  const notesRef = useRef<HTMLDivElement>(null);

  const canAssign = myRoles?.isFullAccess ?? false;
  const crmId = client?.crmId ?? null;

  // ── Helpers ──────────────────────────────────────────────────────
  function startEdit(field: string, currentValue: string) {
    setEditingField(field);
    setEditValue(currentValue);
  }

  /** Save a CRM field (routes through crm.updateContact for auto-sync) */
  function saveCrmField(field: string, value: string | null) {
    if (!crmId) return;
    updateCrmContact.mutate(
      { id: crmId, [field]: value },
      { onSuccess: () => setEditingField(null) }
    );
  }

  function saveNotes() {
    if (!crmId) return;
    updateCrmContact.mutate(
      { id: crmId, notes: editNotes || null },
      { onSuccess: () => setEditingField(null) }
    );
  }

  // ── Loading / not-found ──────────────────────────────────────────
  if (isLoading) return <PageSkeleton />;

  if (!client) {
    return (
      <div className="min-h-screen bg-black p-6 text-white sm:p-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Clients
          </Link>
          <div className="flex flex-col items-center justify-center py-20">
            <Briefcase className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">Client not found</p>
          </div>
        </div>
      </div>
    );
  }

  const clientStatus =
    CLIENT_STATUS_CONFIG[client.status] ?? CLIENT_STATUS_CONFIG.active!;

  // ── Submission timeline (from linked CRM contact) ────────────────
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

  const timeline: TimelineItem[] = crmContact
    ? [
        ...crmContact.submissions.miracleMind.map(
          (s: {
            id: number;
            name: string;
            email: string;
            message: string;
            read: boolean;
            createdAt: Date;
            services: string[] | null;
            role: string | null;
            stewardshipInterest: boolean | null;
          }) => ({
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
          })
        ),
        ...crmContact.submissions.personal.map(
          (s: {
            id: number;
            name: string;
            email: string;
            message: string;
            read: boolean;
            createdAt: Date;
          }) => ({
            id: `personal-${s.id}`,
            source: "personal" as const,
            name: s.name,
            email: s.email,
            message: s.message,
            read: s.read,
            createdAt: s.createdAt,
          })
        ),
        ...crmContact.submissions.banyan.map(
          (s: {
            id: number;
            fullName: string;
            email: string;
            message: string | null;
            contacted: boolean;
            createdAt: Date;
            role: string | null;
          }) => ({
            id: `banyan-${s.id}`,
            source: "banyan" as const,
            name: s.fullName,
            email: s.email,
            message: s.message ?? "",
            read: s.contacted,
            createdAt: s.createdAt,
            extra: { role: s.role },
          })
        ),
      ].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  // Communication preferences (from CRM contact)
  const commPrefs = (crmContact?.communicationPreferences as {
    email?: boolean;
    sms?: boolean;
    phone?: boolean;
  }) ?? { email: true, sms: false, phone: false };

  return (
    <div className="min-h-screen bg-black p-6 text-white sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ── 1. Back link ───────────────────────────────────────── */}
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All Clients
        </Link>

        {/* ── 2. Header ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Name (editable — routes through CRM) */}
            {editingField === "name" ? (
              <div className="flex items-center gap-2">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="rounded border bg-white/5 px-2 py-1 text-2xl font-bold text-white focus:border-[#D4AF37]/50 focus:outline-none"
                  style={borderStyle}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveCrmField("name", editValue);
                    if (e.key === "Escape") setEditingField(null);
                  }}
                />
                <button
                  onClick={() => saveCrmField("name", editValue)}
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
                {client.name}
                {crmId && (
                  <button
                    onClick={() => startEdit("name", client.name)}
                    className="text-gray-700 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-300"
                    title="Edit name"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
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
                      if (e.key === "Enter") saveCrmField("email", editValue);
                      if (e.key === "Escape") setEditingField(null);
                    }}
                  />
                  <button
                    onClick={() => saveCrmField("email", editValue)}
                    className="text-[#D4AF37]"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </span>
              ) : (
                <span
                  className={`group flex items-center gap-1 ${crmId ? "cursor-pointer" : ""}`}
                  onClick={() => crmId && startEdit("email", client.email)}
                  title={crmId ? "Click to edit" : undefined}
                >
                  <Mail className="h-3.5 w-3.5" />
                  {client.email}
                  {crmId && (
                    <Pencil className="h-2.5 w-2.5 text-gray-700 opacity-0 group-hover:opacity-100" />
                  )}
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
                        saveCrmField("phone", editValue || null);
                      if (e.key === "Escape") setEditingField(null);
                    }}
                  />
                  <button
                    onClick={() => saveCrmField("phone", editValue || null)}
                    className="text-[#D4AF37]"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </span>
              ) : crmId ? (
                <span
                  className="group flex cursor-pointer items-center gap-1"
                  onClick={() => startEdit("phone", crmContact?.phone ?? "")}
                  title="Click to edit"
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                  {crmContact?.phone || "Add phone"}
                  <Pencil className="h-2.5 w-2.5 text-gray-700 opacity-0 group-hover:opacity-100" />
                </span>
              ) : null}

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
                        saveCrmField("company", editValue || null);
                      if (e.key === "Escape") setEditingField(null);
                    }}
                  />
                  <button
                    onClick={() => saveCrmField("company", editValue || null)}
                    className="text-[#D4AF37]"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                </span>
              ) : (
                <span
                  className={`group flex items-center gap-1 ${crmId ? "cursor-pointer" : ""}`}
                  onClick={() =>
                    crmId && startEdit("company", client.company ?? "")
                  }
                  title={crmId ? "Click to edit" : undefined}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  {client.company || (crmId ? "Add company" : "No company")}
                  {crmId && (
                    <Pencil className="h-2.5 w-2.5 text-gray-700 opacity-0 group-hover:opacity-100" />
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Status dropdown pill (client statuses: active/inactive) */}
          <div className="relative">
            <select
              value={client.status}
              onChange={(e) => {
                const newStatus = e.target.value as "active" | "inactive";
                updateClient.mutate({ id: client.id, status: newStatus });
              }}
              className="appearance-none rounded-full border-0 px-3 py-1 text-sm font-medium focus:outline-none"
              style={{
                backgroundColor: clientStatus.bg,
                color: clientStatus.color,
              }}
            >
              {Object.entries(CLIENT_STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-1 h-3 w-3 -translate-y-1/2"
              style={{ color: clientStatus.color }}
            />
          </div>
        </div>

        {/* ── 3. Quick Actions Bar ───────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {crmId && (
            <button
              onClick={() => setShowLogCall(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              style={borderStyle}
            >
              <PhoneCall className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
              Log Call
            </button>
          )}
          <Link
            href={`/portal/${client.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            style={borderStyle}
          >
            <ExternalLink
              className="h-3.5 w-3.5"
              style={{ color: "#D4AF37" }}
            />
            Open Portal
          </Link>
          {crmId && (
            <button
              onClick={() => {
                notesRef.current?.scrollIntoView({ behavior: "smooth" });
                setEditingField("notes");
                setEditNotes(crmContact?.notes ?? "");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              style={borderStyle}
            >
              <StickyNote
                className="h-3.5 w-3.5"
                style={{ color: "#D4AF37" }}
              />
              Add Note
            </button>
          )}
        </div>

        {/* Log Call inline form */}
        {showLogCall && crmId && (
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
                  if (e.key === "Enter" && logCallTitle.trim()) {
                    createActivity.mutate({
                      crmId,
                      type: "call",
                      title: logCallTitle.trim(),
                      description: logCallDesc.trim() || undefined,
                    });
                  }
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
                      crmId,
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

        {/* ── 4. Two-column layout ───────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column (2/3): Tabbed content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects">
              <TabsList className="mb-4 bg-white/5">
                <TabsTrigger
                  value="projects"
                  className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Projects ({client.projects.length})
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Activity ({activities.length})
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  Submissions ({timeline.length})
                </TabsTrigger>
              </TabsList>

              {/* ── Projects tab ────────────────────────────────── */}
              <TabsContent value="projects">
                {client.projects.length === 0 ? (
                  <div
                    className="rounded-lg border bg-white/5 p-8 text-center"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <Briefcase className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-500">
                      No projects yet. Create one from the portal.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {client.projects.map(
                      (project: ClientDetail["projects"][number]) => {
                        const projStatus =
                          project.status === "active"
                            ? "bg-green-900/50 text-green-400"
                            : project.status === "completed"
                              ? "bg-[rgba(212,175,55,0.15)] text-[#D4AF37]"
                              : "bg-white/10 text-gray-400";
                        return (
                          <Link
                            key={project.id}
                            href={`/admin/projects/${project.id}`}
                            className="block rounded-lg border bg-white/5 p-4 transition-colors hover:bg-white/10"
                            style={{
                              borderColor: "rgba(212, 175, 55, 0.15)",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white">
                                  {project.name}
                                </p>
                                {project.description && (
                                  <p className="mt-0.5 truncate text-xs text-gray-500">
                                    {project.description}
                                  </p>
                                )}
                              </div>
                              <span
                                className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${projStatus}`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
              </TabsContent>

              {/* ── Activity tab ────────────────────────────────── */}
              <TabsContent value="activity">
                {!crmId ? (
                  <div
                    className="rounded-lg border bg-white/5 p-8 text-center"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <FileText className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-500">
                      No linked CRM contact. Activity tracking requires a CRM
                      link.
                    </p>
                  </div>
                ) : activities.length === 0 ? (
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
                                    {new Date(
                                      activity.createdAt
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
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
              </TabsContent>

              {/* ── Submissions tab ─────────────────────────────── */}
              <TabsContent value="submissions">
                {!crmId ? (
                  <div
                    className="rounded-lg border bg-white/5 p-8 text-center"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <FileText className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-500">
                      No linked CRM contact. Submissions require a CRM link.
                    </p>
                  </div>
                ) : timeline.length === 0 ? (
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
                          style={{
                            borderColor: "rgba(212, 175, 55, 0.15)",
                          }}
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
                          <p className="text-sm text-gray-300">
                            {item.message}
                          </p>
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
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Right column (1/3): Sidebar cards ──────────────── */}
          <div className="space-y-4">
            {/* Assigned Developer (CLIENT-ONLY field) */}
            <SidebarCard title="Assigned Developer">
              <TeamMemberPicker
                value={client.assignedDeveloperId}
                placeholder="Select developer..."
                onChange={(assignedDeveloperId) =>
                  updateClient.mutate({
                    id: client.id,
                    assignedDeveloperId,
                  })
                }
              />
            </SidebarCard>

            {/* Portal */}
            <SidebarCard title="Portal">
              <Link
                href={`/portal/${client.slug}`}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: "#D4AF37" }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                /portal/{client.slug}
              </Link>
            </SidebarCard>

            {/* Stripe Lifetime Spend */}
            {client.stripeLifetimeSpend && (
              <SidebarCard title="Stripe Lifetime Spend">
                <p className="flex items-center gap-2 text-2xl font-bold text-white">
                  <DollarSign
                    className="h-5 w-5"
                    style={{ color: "#D4AF37" }}
                  />
                  {(client.stripeLifetimeSpend.totalCents / 100).toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                    }
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {client.stripeLifetimeSpend.chargeCount} successful charge
                  {client.stripeLifetimeSpend.chargeCount !== 1 ? "s" : ""}
                </p>
              </SidebarCard>
            )}

            {/* ── CRM-linked sidebar fields ─────────────────────── */}
            {crmId && crmContact && (
              <>
                {/* Source */}
                <SidebarCard title="Source">
                  <select
                    value={crmContact.source}
                    onChange={(e) =>
                      updateCrmContact.mutate({
                        id: crmId,
                        source: e.target.value,
                      })
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

                {/* Referred By */}
                <SidebarCard title="Referred By">
                  <ReferralPicker
                    contactId={crmContact.id}
                    referredBy={crmContact.referredBy}
                    referredByExternal={crmContact.referredByExternal}
                    onChange={(referredBy, referredByExternal) =>
                      updateCrmContact.mutate({
                        id: crmId,
                        referredBy,
                        referredByExternal,
                      })
                    }
                  />
                </SidebarCard>

                {/* Created By */}
                <SidebarCard title="Created By">
                  <TeamMemberPicker
                    value={null}
                    placeholder={crmContact.createdBy ?? "Select creator..."}
                    onChange={(memberId) => {
                      if (!memberId) {
                        updateCrmContact.mutate({ id: crmId, createdBy: null });
                        return;
                      }
                      const teamQuery = utils.crm.getCompanyTeam.getData();
                      const member = (
                        teamQuery as { id: string; name: string }[] | undefined
                      )?.find((m) => m.id === memberId);
                      updateCrmContact.mutate({
                        id: crmId,
                        createdBy: member?.name ?? memberId,
                      });
                    }}
                  />
                </SidebarCard>

                {/* Connector */}
                <SidebarCard title="Connector">
                  <TeamMemberPicker
                    value={crmContact.connectorId}
                    placeholder="Select connector..."
                    onChange={(connectorId) =>
                      updateCrmContact.mutate({ id: crmId, connectorId })
                    }
                  />
                </SidebarCard>

                {/* Account Manager */}
                <SidebarCard title="Account Manager">
                  {canAssign ? (
                    <TeamMemberPicker
                      value={crmContact.accountManagerId}
                      placeholder="Select account manager..."
                      onChange={(accountManagerId) =>
                        updateCrmContact.mutate({
                          id: crmId,
                          accountManagerId,
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm text-white">
                      {crmContact.accountManager?.name ?? (
                        <span className="text-gray-600">Unassigned</span>
                      )}
                    </p>
                  )}
                </SidebarCard>

                {/* Communication Preferences */}
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
                            : channel.charAt(0).toUpperCase() +
                              channel.slice(1)}
                        </span>
                        <button
                          role="switch"
                          aria-checked={commPrefs[channel] ?? false}
                          onClick={() => {
                            const updated = {
                              ...commPrefs,
                              [channel]: !(commPrefs[channel] ?? false),
                            };
                            updateCrmContact.mutate({
                              id: crmId,
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

                {/* Tags */}
                <SidebarCard title="Tags">
                  <TagPicker
                    selected={crmContact.tags ?? []}
                    onChange={(tags) =>
                      updateCrmContact.mutate({ id: crmId, tags })
                    }
                  />
                </SidebarCard>

                {/* Notes */}
                <SidebarCard title="Notes" id="notes-section">
                  <div ref={notesRef}>
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
                      <div className="group">
                        <p className="text-sm whitespace-pre-wrap text-gray-400">
                          {crmContact.notes ?? "No notes"}
                        </p>
                        <button
                          onClick={() => {
                            setEditingField("notes");
                            setEditNotes(crmContact.notes ?? "");
                          }}
                          className="mt-1 text-gray-600 transition-colors group-hover:visible hover:text-gray-300"
                          title="Edit notes"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </SidebarCard>

                {/* Dates */}
                <SidebarCard title="Dates">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">First contact</span>
                      <span className="text-gray-300">
                        {new Date(crmContact.firstContactAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last contact</span>
                      <span className="text-gray-300">
                        {new Date(crmContact.lastContactAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client since</span>
                      <span className="text-gray-300">
                        {new Date(client.createdAt).toLocaleDateString(
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
                </SidebarCard>

                {/* Related Contacts */}
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
              </>
            )}
          </div>
        </div>

        {/* ── 5. Portal Link Banner ──────────────────────────────── */}
        <Link
          href={`/portal/${client.slug}`}
          className="flex items-center gap-3 rounded-lg border p-4 transition-all hover:bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
            }}
          >
            <ExternalLink className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Client Portal</p>
            <p className="text-xs text-gray-500">/portal/{client.slug}</p>
          </div>
          <span className="text-xs text-gray-500">Open portal &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
