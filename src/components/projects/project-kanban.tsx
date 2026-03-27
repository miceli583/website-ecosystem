"use client";

import { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import type { ProjectWithMeta } from "./types";
import { ProjectStatusBadge } from "./status-badges";

interface ProjectKanbanProps {
  projects: ProjectWithMeta[];
  mode: "admin" | "portal";
  onMoveStatus: (id: number, status: string) => void;
  onViewDetail: (id: number) => void;
  isPending?: boolean;
}

const COLUMNS = [
  { key: "active", label: "Active", color: "#4ade80" },
  { key: "on-hold", label: "On Hold", color: "#facc15" },
  { key: "completed", label: "Completed", color: "#60a5fa" },
] as const;

export function ProjectKanban({
  projects,
  mode,
  onMoveStatus,
  onViewDetail,
  isPending,
}: ProjectKanbanProps) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const byStatus = (status: string) =>
    projects.filter((p) => p.status === status);

  // Include paused projects in the on-hold column
  const getProjects = (key: string) =>
    key === "on-hold"
      ? [...byStatus("on-hold"), ...byStatus("paused")]
      : byStatus(key);

  const handleDragStart = (e: React.DragEvent, project: ProjectWithMeta) => {
    setDraggedId(project.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(project.id));
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

    const project = projects.find((p) => p.id === draggedId);
    if (!project || project.status === targetStatus) {
      setDraggedId(null);
      return;
    }

    onMoveStatus(project.id, targetStatus);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTarget(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const items = getProjects(col.key);
        const isOver = dropTarget === col.key;
        const draggedProject = draggedId
          ? projects.find((p) => p.id === draggedId)
          : null;
        const isValidDrop = draggedProject && draggedProject.status !== col.key;

        return (
          <div
            key={col.key}
            className="flex flex-col rounded-lg border bg-white/[0.02] p-3 transition-colors"
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
                  No projects
                </div>
              )}
              {items.length === 0 && isOver && isValidDrop && (
                <div
                  className="rounded-lg border border-dashed px-3 py-6 text-center text-xs"
                  style={{ borderColor: col.color, color: col.color }}
                >
                  Drop to move
                </div>
              )}

              {items.map((project) => {
                const isDragging = draggedId === project.id;
                return (
                  <div
                    key={project.id}
                    ref={isDragging ? dragNodeRef : undefined}
                    draggable={mode === "admin"}
                    onDragStart={(e) => handleDragStart(e, project)}
                    onDragEnd={handleDragEnd}
                    className={`group rounded-lg border bg-white/5 p-3 transition-all ${
                      mode === "admin"
                        ? "cursor-grab active:cursor-grabbing"
                        : "cursor-pointer"
                    } ${
                      isDragging
                        ? "scale-[0.97] opacity-40"
                        : "hover:bg-white/10"
                    }`}
                    style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                    onClick={() => {
                      if (draggedId) return;
                      onViewDetail(project.id);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {mode === "admin" && (
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <p className="text-sm font-medium text-white">
                            {project.name}
                          </p>
                          <ProjectStatusBadge status={project.status} />
                        </div>

                        {mode === "admin" && project.client && (
                          <p className="mb-2 text-xs text-gray-500">
                            {project.client.name}
                          </p>
                        )}

                        {/* Task progress */}
                        {project._count.tasks > 0 && (
                          <div className="mb-2">
                            <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                              <span>Tasks</span>
                              <span>
                                {project._count.doneTasks}/
                                {project._count.tasks}
                              </span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-white/10">
                              <div
                                className="h-1 rounded-full bg-[#D4AF37]"
                                style={{
                                  width: `${(project._count.doneTasks / project._count.tasks) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* People — admin only */}
                        {mode === "admin" && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {project.accountManager && (
                              <span title="Account Manager">
                                AM: {project.accountManager.name}
                              </span>
                            )}
                            {project.assignedDeveloper && (
                              <span title="Developer">
                                Dev: {project.assignedDeveloper.name}
                              </span>
                            )}
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
