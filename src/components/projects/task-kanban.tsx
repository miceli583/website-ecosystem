"use client";

import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import type { TaskWithMeta } from "./types";
import { PriorityBadge } from "./status-badges";

interface TaskKanbanProps {
  tasks: TaskWithMeta[];
  mode: "admin" | "portal";
  onMoveStatus: (id: number, status: string) => void;
  onEdit?: (task: TaskWithMeta) => void;
}

const COLUMNS = [
  { key: "todo", label: "Todo" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
] as const;

function DueDateBadge({ dueDate }: { dueDate: string | null }) {
  if (!dueDate) return null;
  const date = new Date(dueDate + "T00:00:00");
  const isOverdue =
    date < new Date() && date.toDateString() !== new Date().toDateString();
  return (
    <span className={`text-xs ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
      {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
    </span>
  );
}

export function TaskKanban({
  tasks,
  mode,
  onMoveStatus,
  onEdit,
}: TaskKanbanProps) {
  const byStatus = (status: string) => tasks.filter((t) => t.status === status);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const items = byStatus(col.key);
        return (
          <div
            key={col.key}
            className="flex flex-col rounded-lg border bg-white/[0.02] p-3"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400">{col.label}</h3>
              <span className="text-xs text-gray-600">{items.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border bg-white/5 p-3 transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <p className="text-sm leading-tight font-medium text-white">
                      {task.title}
                    </p>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  {task.description && (
                    <p className="mb-2 line-clamp-2 text-xs text-gray-500">
                      {task.description}
                    </p>
                  )}
                  {/* Meta row */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      {task.owner && <span>{task.owner.name}</span>}
                      {task.project && (
                        <span className="text-gray-600">
                          {task.project.name}
                        </span>
                      )}
                    </div>
                    <DueDateBadge dueDate={task.dueDate} />
                  </div>
                  {/* Actions row */}
                  <div className="mt-2 flex items-center justify-between">
                    {onEdit && mode === "admin" ? (
                      <button
                        onClick={() => onEdit(task)}
                        className="rounded p-1 text-gray-600 transition-colors hover:text-[#D4AF37]"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    ) : (
                      <div />
                    )}
                    <div className="flex gap-1">
                      {col.key !== "todo" && (
                        <button
                          onClick={() => {
                            const prev =
                              COLUMNS[
                                COLUMNS.findIndex((c) => c.key === col.key) - 1
                              ];
                            if (prev) onMoveStatus(task.id, prev.key);
                          }}
                          className="rounded p-1 text-gray-600 transition-colors hover:text-[#D4AF37]"
                          title={`Move to ${COLUMNS[COLUMNS.findIndex((c) => c.key === col.key) - 1]?.label}`}
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </button>
                      )}
                      {col.key !== "done" && (
                        <button
                          onClick={() => {
                            const next =
                              COLUMNS[
                                COLUMNS.findIndex((c) => c.key === col.key) + 1
                              ];
                            if (next) onMoveStatus(task.id, next.key);
                          }}
                          className="rounded p-1 text-gray-600 transition-colors hover:text-[#D4AF37]"
                          title={`Move to ${COLUMNS[COLUMNS.findIndex((c) => c.key === col.key) + 1]?.label}`}
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="py-8 text-center text-xs text-gray-600">
                  No tasks
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
