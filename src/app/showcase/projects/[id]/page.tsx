"use client";

import { use, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ListTodo,
  Kanban,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { TaskKanban } from "~/components/projects/task-kanban";
import { SortHeader, type SortLevel } from "~/components/crm/sort-header";
import {
  SAMPLE_PROJECTS,
  SAMPLE_TASKS,
} from "~/components/showcase/sample-data";
import type { TaskWithMeta } from "~/components/projects/types";

const TASK_STATUSES = ["todo", "in-progress", "done"] as const;
const PRIORITIES = ["urgent", "high", "medium", "low"] as const;

export default function ShowcaseProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projectId = Number(id);
  const project = SAMPLE_PROJECTS.find((p) => p.id === projectId);

  const [tasks, setTasks] = useState<TaskWithMeta[]>(
    SAMPLE_TASKS.filter((t) => t.projectId === projectId)
  );
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [sorts, setSorts] = useState<SortLevel[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const handleSort = useCallback((field: string) => {
    setSorts((prev) => {
      const existing = prev.find((s) => s.field === field);
      if (!existing) return [...prev, { field, order: "asc" as const }];
      if (existing.order === "asc")
        return prev.map((s) =>
          s.field === field ? { ...s, order: "desc" as const } : s
        );
      return prev.filter((s) => s.field !== field);
    });
  }, []);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (statusFilter) result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter)
      result = result.filter((t) => t.priority === priorityFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false)
      );
    }
    return result;
  }, [tasks, statusFilter, priorityFilter, search]);

  const sortedTasks = useMemo(() => {
    if (sorts.length === 0) return filteredTasks;
    return [...filteredTasks].sort((a, b) => {
      for (const { field, order } of sorts) {
        const dir = order === "asc" ? 1 : -1;
        let va: string | number | null = null;
        let vb: string | number | null = null;
        if (field === "title") {
          va = a.title;
          vb = b.title;
        } else if (field === "status") {
          va = a.status;
          vb = b.status;
        } else if (field === "priority") {
          const pOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          va = pOrder[a.priority as keyof typeof pOrder] ?? 4;
          vb = pOrder[b.priority as keyof typeof pOrder] ?? 4;
        } else if (field === "owner") {
          va = a.owner?.name ?? "";
          vb = b.owner?.name ?? "";
        } else if (field === "developer") {
          va = a.assignedDeveloper?.name ?? "";
          vb = b.assignedDeveloper?.name ?? "";
        } else if (field === "dueDate") {
          va = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          vb = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        }
        if (va === null || vb === null) continue;
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
      }
      return 0;
    });
  }, [filteredTasks, sorts]);

  const handleMoveStatus = useCallback((taskId: number, newStatus: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date() } : t
      )
    );
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { total, todo, inProgress, done };
  }, [tasks]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <p className="mb-4 text-lg">Project not found</p>
          <Link
            href="/showcase/projects"
            className="text-sm text-[#D4AF37] hover:underline"
          >
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const statusColor =
    project.status === "active"
      ? "#4ade80"
      : project.status === "completed"
        ? "#60a5fa"
        : "#facc15";

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <Link
        href="/showcase/projects"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Projects
      </Link>

      <div className="mx-auto mt-14 max-w-6xl">
        {/* Project Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
              style={{
                backgroundColor: `${statusColor}15`,
                color: statusColor,
              }}
            >
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="mb-4 max-w-2xl text-sm text-gray-400">
              {project.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span>
              Client:{" "}
              <span className="text-gray-300">
                {project.client?.name ?? "—"}
              </span>
            </span>
            <span>
              Account Manager:{" "}
              <span className="text-gray-300">
                {project.accountManager?.name ?? "—"}
              </span>
            </span>
            <span>
              Developer:{" "}
              <span className="text-gray-300">
                {project.assignedDeveloper?.name ?? "Unassigned"}
              </span>
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              icon: ListTodo,
              label: "Total Tasks",
              value: stats.total,
              color: "#D4AF37",
            },
            {
              icon: AlertCircle,
              label: "Todo",
              value: stats.todo,
              color: "#9ca3af",
            },
            {
              icon: Loader2,
              label: "In Progress",
              value: stats.inProgress,
              color: "#60a5fa",
            },
            {
              icon: CheckCircle,
              label: "Done",
              value: stats.done,
              color: "#4ade80",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border bg-white/5 p-4"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                <stat.icon
                  className="h-3.5 w-3.5"
                  style={{ color: stat.color }}
                />
                {stat.label}
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
            Tasks
          </h2>
          <div
            className="flex rounded-lg border p-0.5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "kanban"
                  ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "list"
                  ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              List
            </button>
          </div>
        </div>

        {/* Task Display */}
        {tasks.length === 0 ? (
          <div
            className="rounded-lg border bg-white/5 p-12 text-center"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <p className="text-gray-500">No tasks for this project yet.</p>
          </div>
        ) : view === "kanban" ? (
          <div className="overflow-x-auto">
            <TaskKanban
              tasks={tasks}
              mode="admin"
              onMoveStatus={handleMoveStatus}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded border bg-white/5 px-2 py-1 pr-6 text-xs text-gray-300 focus:outline-none"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <option value="">All Statuses</option>
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s === "in-progress"
                        ? "In Progress"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none rounded border bg-white/5 px-2 py-1 pr-6 text-xs text-gray-300 focus:outline-none"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <option value="">All Priorities</option>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p} className="capitalize">
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {(statusFilter || priorityFilter || search) && (
                <button
                  onClick={() => {
                    setStatusFilter("");
                    setPriorityFilter("");
                    setSearch("");
                  }}
                  className="text-xs text-gray-500 transition-colors hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Table */}
            <div
              className="overflow-hidden rounded-lg border bg-white/5"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b text-left text-xs tracking-wider text-gray-500 uppercase"
                    style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                  >
                    <SortHeader
                      field="title"
                      label="Task"
                      sorts={sorts}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="status"
                      label="Status"
                      sorts={sorts}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="priority"
                      label="Priority"
                      sorts={sorts}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="owner"
                      label="Owner"
                      sorts={sorts}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="developer"
                      label="Developer"
                      sorts={sorts}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="dueDate"
                      label="Due Date"
                      sorts={sorts}
                      onSort={handleSort}
                    />
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No tasks match your filters.
                      </td>
                    </tr>
                  ) : (
                    sortedTasks.map((t) => {
                      const sColor =
                        t.status === "done"
                          ? "#4ade80"
                          : t.status === "in-progress"
                            ? "#60a5fa"
                            : "#9ca3af";
                      const pColor =
                        t.priority === "urgent"
                          ? "#f87171"
                          : t.priority === "high"
                            ? "#fb923c"
                            : t.priority === "medium"
                              ? "#facc15"
                              : "#9ca3af";
                      return (
                        <tr
                          key={t.id}
                          className="border-b transition-colors hover:bg-white/5"
                          style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-white">{t.title}</p>
                            {t.description && (
                              <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                                {t.description}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={t.status}
                              onChange={(e) =>
                                handleMoveStatus(t.id, e.target.value)
                              }
                              className="appearance-none rounded border bg-white/5 py-0.5 pr-5 pl-2 text-xs capitalize focus:outline-none"
                              style={{
                                borderColor: "rgba(212, 175, 55, 0.2)",
                                color: sColor,
                              }}
                            >
                              <option value="todo">Todo</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                              style={{
                                backgroundColor: `${pColor}15`,
                                color: pColor,
                              }}
                            >
                              {t.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {t.owner?.name ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {t.assignedDeveloper?.name ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {t.dueDate
                              ? new Date(t.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
