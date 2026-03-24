"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ProjectWithMeta } from "./types";
import { ProjectStatusBadge } from "./status-badges";

interface ProjectKanbanProps {
  projects: ProjectWithMeta[];
  mode: "admin" | "portal";
  onMoveStatus: (id: number, status: string) => void;
  onViewDetail: (id: number) => void;
}

const COLUMNS = [
  { key: "active", label: "Active" },
  { key: "on-hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
] as const;

export function ProjectKanban({
  projects,
  mode,
  onMoveStatus,
  onViewDetail,
}: ProjectKanbanProps) {
  const byStatus = (status: string) =>
    projects.filter((p) => p.status === status);

  // Include paused projects in the on-hold column
  const getProjects = (key: string) =>
    key === "on-hold"
      ? [...byStatus("on-hold"), ...byStatus("paused")]
      : byStatus(key);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const items = getProjects(col.key);
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
              {items.map((project) => (
                <div
                  key={project.id}
                  className="cursor-pointer rounded-lg border bg-white/5 p-3 transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                  onClick={() => onViewDetail(project.id)}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <p className="text-sm font-medium text-white">
                      {project.name}
                    </p>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                  {mode === "admin" && (
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
                          {project._count.doneTasks}/{project._count.tasks}
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
                  {/* People */}
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
                  {/* Move buttons */}
                  {mode === "admin" && (
                    <div
                      className="mt-2 flex justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {col.key !== "active" && (
                        <button
                          onClick={() => {
                            const prev =
                              COLUMNS[
                                COLUMNS.findIndex((c) => c.key === col.key) - 1
                              ];
                            if (prev) onMoveStatus(project.id, prev.key);
                          }}
                          className="rounded p-1 text-gray-600 transition-colors hover:text-[#D4AF37]"
                          title={`Move to ${COLUMNS[COLUMNS.findIndex((c) => c.key === col.key) - 1]?.label}`}
                        >
                          <ArrowLeft className="h-3 w-3" />
                        </button>
                      )}
                      {col.key !== "completed" && (
                        <button
                          onClick={() => {
                            const next =
                              COLUMNS[
                                COLUMNS.findIndex((c) => c.key === col.key) + 1
                              ];
                            if (next) onMoveStatus(project.id, next.key);
                          }}
                          className="rounded p-1 text-gray-600 transition-colors hover:text-[#D4AF37]"
                          title={`Move to ${COLUMNS[COLUMNS.findIndex((c) => c.key === col.key) + 1]?.label}`}
                        >
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <p className="py-8 text-center text-xs text-gray-600">
                  No projects
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
