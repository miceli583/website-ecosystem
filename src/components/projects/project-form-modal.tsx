"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ProjectWithMeta, TeamMember, ClientOption } from "./types";

const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "admin" | "portal";
  project?: ProjectWithMeta;
  clients: ClientOption[];
  team: TeamMember[];
  onSubmit: (data: {
    clientId: number;
    name: string;
    description?: string;
    status: "active" | "completed" | "on-hold" | "paused";
    accountManagerId?: string;
    assignedDeveloperId?: string;
  }) => void;
  isPending: boolean;
  /** Pre-selected clientId for portal or detail context */
  defaultClientId?: number;
}

export function ProjectFormModal({
  open,
  onClose,
  mode,
  project,
  clients,
  team,
  onSubmit,
  isPending,
  defaultClientId,
}: ProjectFormModalProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [clientId, setClientId] = useState<number | "">(
    project?.clientId ?? defaultClientId ?? ""
  );
  const [status, setStatus] = useState(project?.status ?? "active");
  const [amId, setAmId] = useState(project?.accountManagerId ?? "");
  const [devId, setDevId] = useState(project?.assignedDeveloperId ?? "");

  useEffect(() => {
    if (open) {
      setName(project?.name ?? "");
      setDescription(project?.description ?? "");
      setClientId(project?.clientId ?? defaultClientId ?? "");
      setStatus(project?.status ?? "active");
      setAmId(project?.accountManagerId ?? "");
      setDevId(project?.assignedDeveloperId ?? "");
    }
  }, [open, project, defaultClientId]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const accountManagers = team.filter(
    (m) =>
      m.companyRoles?.includes("account_manager") ||
      m.companyRoles?.includes("founder")
  );
  const developers = team.filter(
    (m) =>
      m.companyRoles?.includes("developer") ||
      m.companyRoles?.includes("founder")
  );

  const handleSubmit = () => {
    if (!name.trim() || !clientId) return;
    onSubmit({
      clientId: Number(clientId),
      name: name.trim(),
      description: description.trim() || undefined,
      status: status as "active" | "completed" | "on-hold" | "paused",
      accountManagerId: amId || undefined,
      assignedDeveloperId: devId || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border bg-[#0a0a0a] p-6"
        style={borderStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {project ? "Edit Project" : "New Project"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              style={borderStyle}
              placeholder="Project name"
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              style={borderStyle}
              rows={3}
              placeholder="Brief description..."
            />
          </div>

          {mode === "admin" && !defaultClientId && (
            <div>
              <label className={labelClass}>Client *</label>
              <select
                value={clientId}
                onChange={(e) =>
                  setClientId(e.target.value ? Number(e.target.value) : "")
                }
                className={inputClass}
                style={borderStyle}
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelClass}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
              style={borderStyle}
            >
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Account Manager</label>
              <select
                value={amId}
                onChange={(e) => setAmId(e.target.value)}
                className={inputClass}
                style={borderStyle}
              >
                <option value="">None</option>
                {accountManagers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Developer</label>
              <select
                value={devId}
                onChange={(e) => setDevId(e.target.value)}
                className={inputClass}
                style={borderStyle}
              >
                <option value="">None</option>
                {developers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
            style={borderStyle}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !name.trim() || !clientId}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {isPending
              ? "Saving..."
              : project
                ? "Save Changes"
                : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
