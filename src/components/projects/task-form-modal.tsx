"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import type { TaskWithMeta, TeamMember, ClientOption } from "./types";

const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const selectClass =
  "w-full appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50";
const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

const chevronIcon = (
  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
);

interface ProjectOption {
  id: number;
  name: string;
}

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "admin" | "portal";
  task?: TaskWithMeta;
  projects: ProjectOption[];
  clients: ClientOption[];
  team: TeamMember[];
  onSubmit: (data: {
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high" | "urgent";
    projectId?: number;
    clientId?: number;
    ownerId?: string;
    accountManagerId?: string;
    assignedDeveloperId?: string;
    dueDate?: string;
  }) => void;
  isPending: boolean;
  defaultProjectId?: number;
  defaultClientId?: number;
}

export function TaskFormModal({
  open,
  onClose,
  mode,
  task,
  projects,
  clients,
  team,
  onSubmit,
  isPending,
  defaultProjectId,
  defaultClientId,
}: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [projectId, setProjectId] = useState<number | "">("");
  const [clientId, setClientId] = useState<number | "">("");
  const [ownerId, setOwnerId] = useState("");
  const [amId, setAmId] = useState("");
  const [devId, setDevId] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setStatus(task?.status ?? "todo");
      setPriority(task?.priority ?? "medium");
      setProjectId(task?.projectId ?? defaultProjectId ?? "");
      setClientId(task?.clientId ?? defaultClientId ?? "");
      setOwnerId(task?.ownerId ?? "");
      setAmId(task?.accountManagerId ?? "");
      setDevId(task?.assignedDeveloperId ?? "");
      setDueDate(task?.dueDate ?? "");
    }
  }, [open, task, defaultProjectId, defaultClientId]);

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
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status: status as "todo" | "in-progress" | "done",
      priority: priority as "low" | "medium" | "high" | "urgent",
      projectId: projectId ? Number(projectId) : undefined,
      clientId: clientId ? Number(clientId) : undefined,
      ownerId: ownerId || undefined,
      accountManagerId: amId || undefined,
      assignedDeveloperId: devId || undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-[#0a0a0a] p-6"
        style={borderStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {task ? "Edit Task" : "New Task"}
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
            <label className={labelClass}>Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              style={borderStyle}
              placeholder="Task title"
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
              placeholder="What needs to be done..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={selectClass}
                  style={borderStyle}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                {chevronIcon}
              </div>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={selectClass}
                  style={borderStyle}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                {chevronIcon}
              </div>
            </div>
          </div>

          {/* Project (optional) */}
          {!defaultProjectId && projects.length > 0 && (
            <div>
              <label className={labelClass}>Project (optional)</label>
              <div className="relative">
                <select
                  value={projectId}
                  onChange={(e) =>
                    setProjectId(e.target.value ? Number(e.target.value) : "")
                  }
                  className={selectClass}
                  style={borderStyle}
                >
                  <option value="">No project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {chevronIcon}
              </div>
            </div>
          )}

          {/* Client (admin only, optional if no project) */}
          {mode === "admin" && !defaultClientId && (
            <div>
              <label className={labelClass}>Client (optional)</label>
              <div className="relative">
                <select
                  value={clientId}
                  onChange={(e) =>
                    setClientId(e.target.value ? Number(e.target.value) : "")
                  }
                  className={selectClass}
                  style={borderStyle}
                >
                  <option value="">No client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {chevronIcon}
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
              style={borderStyle}
            />
          </div>

          <div>
            <label className={labelClass}>Owner</label>
            <div className="relative">
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className={selectClass}
                style={borderStyle}
              >
                <option value="">Unassigned</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {chevronIcon}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Account Manager</label>
              <div className="relative">
                <select
                  value={amId}
                  onChange={(e) => setAmId(e.target.value)}
                  className={selectClass}
                  style={borderStyle}
                >
                  <option value="">Auto / None</option>
                  {accountManagers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {chevronIcon}
              </div>
            </div>
            <div>
              <label className={labelClass}>Developer</label>
              <div className="relative">
                <select
                  value={devId}
                  onChange={(e) => setDevId(e.target.value)}
                  className={selectClass}
                  style={borderStyle}
                >
                  <option value="">Auto / None</option>
                  {developers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {chevronIcon}
              </div>
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
            disabled={isPending || !title.trim()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {isPending ? "Saving..." : task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
