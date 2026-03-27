"use client";

import { useState, useRef } from "react";
import { GripVertical, Pencil } from "lucide-react";
import type { TaskWithMeta } from "./types";
import { PriorityBadge } from "./status-badges";

interface TaskKanbanProps {
  tasks: TaskWithMeta[];
  mode: "admin" | "portal";
  onMoveStatus: (id: number, status: string) => void;
  onEdit?: (task: TaskWithMeta) => void;
  isPending?: boolean;
}

const COLUMNS = [
  { key: "todo", label: "Todo", color: "#9ca3af" },
  { key: "in-progress", label: "In Progress", color: "#60a5fa" },
  { key: "done", label: "Done", color: "#4ade80" },
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
  isPending,
}: TaskKanbanProps) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const byStatus = (status: string) => tasks.filter((t) => t.status === status);

  const handleDragStart = (e: React.DragEvent, task: TaskWithMeta) => {
    setDraggedId(task.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(task.id));
    if (dragNodeRef.current) {
      e.dataTransfer.setDragImage(dragNodeRef.current, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTarget !== status) setDropTarget(status);
  };

  const handleDragLeave = (e: React.DragEvent, status: string) => {
    const related = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    if (!related || !currentTarget.contains(related)) {
      if (dropTarget === status) setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDropTarget(null);

    if (!draggedId || isPending) return;

    const task = tasks.find((t) => t.id === draggedId);
    if (!task || task.status === targetStatus) {
      setDraggedId(null);
      return;
    }

    onMoveStatus(task.id, targetStatus);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTarget(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const items = byStatus(col.key);
        const isOver = dropTarget === col.key;
        const draggedTask = draggedId
          ? tasks.find((t) => t.id === draggedId)
          : null;
        const isValidDrop = draggedTask && draggedTask.status !== col.key;

        return (
          <div
            key={col.key}
            className="flex flex-col rounded-lg border bg-white/[0.02] p-3"
            style={{
              borderColor:
                isOver && isValidDrop ? col.color : "rgba(212, 175, 55, 0.15)",
              backgroundColor:
                isOver && isValidDrop ? `${col.color}10` : undefined,
            }}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={(e) => handleDragLeave(e, col.key)}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-400">{col.label}</h3>
              <span className="text-xs text-gray-600">{items.length}</span>
            </div>

            {/* Drop zone */}
            <div
              className={`flex min-h-[80px] flex-col gap-2 rounded-lg border-2 border-dashed p-1 transition-colors ${
                isOver && isValidDrop
                  ? "border-opacity-60"
                  : "border-transparent"
              }`}
              style={{
                borderColor: isOver && isValidDrop ? col.color : "transparent",
                backgroundColor:
                  isOver && isValidDrop ? `${col.color}08` : undefined,
              }}
            >
              {items.length === 0 && !isOver && (
                <div
                  className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-gray-600"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  No tasks
                </div>
              )}
              {items.length === 0 && isOver && isValidDrop && (
                <div
                  className="rounded-lg border border-dashed px-3 py-6 text-center text-xs"
                  style={{ borderColor: col.color, color: col.color }}
                >
                  Drop here
                </div>
              )}
              {items.map((task) => {
                const isDragging = draggedId === task.id;
                return (
                  <div
                    key={task.id}
                    ref={isDragging ? dragNodeRef : undefined}
                    draggable={mode === "admin"}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className={`group rounded-lg border bg-white/5 p-3 transition-all ${
                      mode === "admin"
                        ? "cursor-grab active:cursor-grabbing"
                        : ""
                    } ${
                      isDragging
                        ? "scale-[0.97] opacity-40"
                        : "hover:bg-white/10"
                    }`}
                    style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                  >
                    <div className="flex items-start gap-2">
                      {mode === "admin" && (
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                      <div className="min-w-0 flex-1">
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
                            {mode === "admin" && task.owner && (
                              <span>{task.owner.name}</span>
                            )}
                            {task.project && (
                              <span className="text-gray-600">
                                {task.project.name}
                              </span>
                            )}
                          </div>
                          <DueDateBadge dueDate={task.dueDate} />
                        </div>
                        {/* Edit button */}
                        {onEdit && mode === "admin" && (
                          <div className="mt-2">
                            <button
                              onClick={() => onEdit(task)}
                              className="rounded p-1 text-gray-600 transition-colors hover:text-[#D4AF37]"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
