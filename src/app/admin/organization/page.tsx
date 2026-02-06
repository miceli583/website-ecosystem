"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Mail,
  Phone,
  X,
  Plus,
  MoreVertical,
} from "lucide-react";
import { api } from "~/trpc/react";

/* ── Shared styles ─────────────────────────────────────────────── */

const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

/* ── Constants ─────────────────────────────────────────────────── */

const ROLE_OPTIONS = [
  "founder",
  "admin",
  "account_manager",
  "project_manager",
  "developer",
  "designer",
] as const;

const ROLE_LABELS: Record<string, string> = {
  founder: "Founder",
  admin: "Admin",
  account_manager: "Account Manager",
  project_manager: "Project Manager",
  developer: "Developer",
  designer: "Designer",
};

/* ── Types ─────────────────────────────────────────────────────── */

type TeamMember = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  isCompanyMember: boolean;
  companyRoles: string[] | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/* ── Skeleton ──────────────────────────────────────────────────── */

function TableSkeleton({ rows = 6 }: { rows?: number }) {
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

/* ── Role Checkbox Group ───────────────────────────────────────── */

function RoleCheckboxGroup({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (roles: string[]) => void;
}) {
  const toggle = (role: string) => {
    if (selected.includes(role)) {
      onChange(selected.filter((r) => r !== role));
    } else {
      onChange([...selected, role]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ROLE_OPTIONS.map((role) => {
        const isSelected = selected.includes(role);
        return (
          <button
            key={role}
            type="button"
            onClick={() => toggle(role)}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            style={
              isSelected
                ? {
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    borderColor: "rgba(212, 175, 55, 0.4)",
                    color: "#D4AF37",
                  }
                : {
                    borderColor: "rgba(212, 175, 55, 0.2)",
                    color: "#9ca3af",
                  }
            }
          >
            {ROLE_LABELS[role] ?? role}
          </button>
        );
      })}
    </div>
  );
}

/* ── Create Modal ──────────────────────────────────────────────── */

function CreateMemberModal({ onClose }: { onClose: () => void }) {
  const utils = api.useUtils();
  const createMember = api.crm.createTeamMember.useMutation({
    onSuccess: () => {
      void utils.crm.getTeamMembers.invalidate();
      void utils.crm.getCompanyTeam.invalidate();
      onClose();
    },
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyRoles: [] as string[],
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCreate = () => {
    createMember.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      companyRoles: form.companyRoles,
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
          <h2 className="text-lg font-semibold text-white">Add Team Member</h2>
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
                placeholder="email@miraclemind.dev"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
          </div>

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
            <label className={labelClass}>Roles</label>
            <RoleCheckboxGroup
              selected={form.companyRoles}
              onChange={(roles) => setForm((f) => ({ ...f, companyRoles: roles }))}
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
            disabled={createMember.isPending || !form.name || !form.email}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {createMember.isPending ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Modal ────────────────────────────────────────────────── */

function EditMemberModal({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const updateMember = api.crm.updateTeamMember.useMutation({
    onSuccess: () => {
      void utils.crm.getTeamMembers.invalidate();
      void utils.crm.getCompanyTeam.invalidate();
      onClose();
    },
  });

  const [form, setForm] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone ?? "",
    companyRoles: member.companyRoles ?? [],
    isActive: member.isActive,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    updateMember.mutate({
      id: member.id,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      companyRoles: form.companyRoles,
      isActive: form.isActive,
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
          <h2 className="text-lg font-semibold text-white">
            Edit Team Member
          </h2>
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
            <label className={labelClass}>Roles</label>
            <RoleCheckboxGroup
              selected={form.companyRoles}
              onChange={(roles) => setForm((f) => ({ ...f, companyRoles: roles }))}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, isActive: !f.isActive }))
              }
              className="flex items-center gap-3 rounded-lg border px-3 py-2"
              style={borderStyle}
            >
              <div
                className="relative h-5 w-9 rounded-full transition-colors"
                style={{
                  backgroundColor: form.isActive
                    ? "rgba(212, 175, 55, 0.3)"
                    : "rgba(156, 163, 175, 0.2)",
                }}
              >
                <div
                  className="absolute top-0.5 h-4 w-4 rounded-full transition-all"
                  style={{
                    left: form.isActive ? "18px" : "2px",
                    backgroundColor: form.isActive ? "#D4AF37" : "#6b7280",
                  }}
                />
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: form.isActive ? "#D4AF37" : "#9ca3af",
                }}
              >
                {form.isActive ? "Active" : "Inactive"}
              </span>
            </button>
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
            disabled={updateMember.isPending || !form.name || !form.email}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {updateMember.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */

export default function OrganizationPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const limit = 25;

  const { data, isLoading } = api.crm.getTeamMembers.useQuery({
    search: search || undefined,
    limit,
    offset: page * limit,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Organization</h1>
        <p className="text-sm text-gray-400">
          Manage your company team members and roles
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

        {data && (
          <span className="text-sm text-gray-500">
            {data.total} member{data.total !== 1 ? "s" : ""}
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
          Add Member
        </button>
      </div>

      {/* Members Table */}
      <div
        className="rounded-lg border bg-white/5"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        {isLoading ? (
          <TableSkeleton />
        ) : !data?.members?.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Building2 className="mb-3 h-12 w-12 text-gray-600" />
            <p className="text-gray-500">
              {search
                ? "No team members match your search"
                : "No team members yet"}
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
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3">Status</th>
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.members.map((member: TeamMember) => (
                <tr
                  key={member.id}
                  className="border-b transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {member.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {member.phone ? (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {member.companyRoles?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {member.companyRoles.map((role: string) => (
                          <span
                            key={role}
                            className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: "rgba(212, 175, 55, 0.1)",
                              color: "#D4AF37",
                            }}
                          >
                            {ROLE_LABELS[role] ?? role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      style={
                        member.isActive
                          ? {
                              backgroundColor: "rgba(74, 222, 128, 0.1)",
                              color: "#4ade80",
                            }
                          : {
                              backgroundColor: "rgba(156, 163, 175, 0.1)",
                              color: "#9ca3af",
                            }
                      }
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                      title="Edit member"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
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
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}
      {showCreate && (
        <CreateMemberModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
