"use client";

import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { TaskWithMeta } from "./types";
import { TaskStatusBadge, PriorityBadge } from "./status-badges";

interface TaskListProps {
  tasks: TaskWithMeta[];
  mode: "admin" | "portal";
  showProject?: boolean;
  showClient?: boolean;
  sortBy: string;
  sortOrder: string;
  onSort: (field: string) => void;
  onEdit?: (task: TaskWithMeta) => void;
  onDelete?: (id: number) => void;
  onMoveStatus?: (id: number, status: string) => void;
}

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: string;
  sortBy: string;
  sortOrder: string;
}) {
  if (field !== sortBy)
    return <ChevronDown className="h-3 w-3 text-gray-600" />;
  return sortOrder === "asc" ? (
    <ChevronUp className="h-3 w-3 text-[#D4AF37]" />
  ) : (
    <ChevronDown className="h-3 w-3 text-[#D4AF37]" />
  );
}

function DueDateCell({ dueDate }: { dueDate: string | null }) {
  if (!dueDate) return <span className="text-gray-600">—</span>;
  const date = new Date(dueDate + "T00:00:00");
  const isOverdue =
    date < new Date() && date.toDateString() !== new Date().toDateString();
  return (
    <span className={isOverdue ? "text-red-400" : "text-gray-400"}>
      {date.toLocaleDateString()}
    </span>
  );
}

const STATUS_CYCLE: Record<string, string> = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

export function TaskList({
  tasks,
  mode,
  showProject = true,
  showClient = false,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onMoveStatus,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-sm">No tasks found</p>
      </div>
    );
  }

  const thClass =
    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-300 transition-colors";
  const thStatic =
    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500";

  return (
    <div
      className="overflow-x-auto rounded-lg border"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            <th className={thClass} onClick={() => onSort("title")}>
              <span className="flex items-center gap-1">
                Title{" "}
                <SortIcon field="title" sortBy={sortBy} sortOrder={sortOrder} />
              </span>
            </th>
            {showProject && <th className={thStatic}>Project</th>}
            {showClient && <th className={thStatic}>Client</th>}
            <th className={thClass} onClick={() => onSort("status")}>
              <span className="flex items-center gap-1">
                Status{" "}
                <SortIcon
                  field="status"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </span>
            </th>
            <th className={thClass} onClick={() => onSort("priority")}>
              <span className="flex items-center gap-1">
                Priority{" "}
                <SortIcon
                  field="priority"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </span>
            </th>
            <th className={thStatic}>Owner</th>
            <th className={thClass} onClick={() => onSort("dueDate")}>
              <span className="flex items-center gap-1">
                Due Date{" "}
                <SortIcon
                  field="dueDate"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </span>
            </th>
            {(onEdit || onDelete) && <th className={thStatic}>Actions</th>}
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
        >
          {tasks.map((task) => (
            <tr key={task.id} className="transition-colors hover:bg-white/5">
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  {task.description && (
                    <p className="max-w-xs truncate text-xs text-gray-500">
                      {task.description}
                    </p>
                  )}
                </div>
              </td>
              {showProject && (
                <td className="px-4 py-3 text-sm text-gray-400">
                  {task.project?.name ?? (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
              )}
              {showClient && (
                <td className="px-4 py-3 text-sm text-gray-400">
                  {task.client?.name ?? (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
              )}
              <td className="px-4 py-3">
                {onMoveStatus ? (
                  <button
                    onClick={() =>
                      onMoveStatus(task.id, STATUS_CYCLE[task.status] ?? "todo")
                    }
                    title="Click to advance status"
                  >
                    <TaskStatusBadge status={task.status} />
                  </button>
                ) : (
                  <TaskStatusBadge status={task.status} />
                )}
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {task.owner?.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-sm">
                <DueDateCell dueDate={task.dueDate} />
              </td>
              {(onEdit || onDelete) && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(task)}
                        className="rounded p-1 text-gray-500 transition-colors hover:text-[#D4AF37]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(task.id)}
                        className="rounded p-1 text-gray-500 transition-colors hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
