"use client";

import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { ProjectWithMeta } from "./types";
import { ProjectStatusBadge } from "./status-badges";

interface ProjectListProps {
  projects: ProjectWithMeta[];
  mode: "admin" | "portal";
  sortBy: string;
  sortOrder: string;
  onSort: (field: string) => void;
  onViewDetail: (id: number) => void;
  onEdit?: (project: ProjectWithMeta) => void;
  onDelete?: (id: number) => void;
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

export function ProjectList({
  projects,
  mode,
  sortBy,
  sortOrder,
  onSort,
  onViewDetail,
  onEdit,
  onDelete,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-sm">No projects found</p>
      </div>
    );
  }

  const thClass =
    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 cursor-pointer select-none hover:text-gray-300 transition-colors";

  return (
    <div
      className="overflow-x-auto rounded-lg border"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            <th className={thClass} onClick={() => onSort("name")}>
              <span className="flex items-center gap-1">
                Name{" "}
                <SortIcon field="name" sortBy={sortBy} sortOrder={sortOrder} />
              </span>
            </th>
            {mode === "admin" && <th className={thClass}>Client</th>}
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
            <th className={thClass}>AM</th>
            <th className={thClass}>Dev</th>
            <th className={thClass}>Tasks</th>
            <th className={thClass} onClick={() => onSort("createdAt")}>
              <span className="flex items-center gap-1">
                Created{" "}
                <SortIcon
                  field="createdAt"
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </span>
            </th>
            {mode === "admin" && <th className={thClass}>Actions</th>}
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
        >
          {projects.map((project) => (
            <tr
              key={project.id}
              className="cursor-pointer transition-colors hover:bg-white/5"
              onClick={() => onViewDetail(project.id)}
            >
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {project.name}
                  </p>
                  {project.description && (
                    <p className="max-w-xs truncate text-xs text-gray-500">
                      {project.description}
                    </p>
                  )}
                </div>
              </td>
              {mode === "admin" && (
                <td className="px-4 py-3 text-sm text-gray-400">
                  {project.client.name}
                </td>
              )}
              <td className="px-4 py-3">
                <ProjectStatusBadge status={project.status} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {project.accountManager?.name ?? "—"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {project.assignedDeveloper?.name ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-400">
                  {project._count.doneTasks}/{project._count.tasks}
                </span>
                {project._count.tasks > 0 && (
                  <div className="mt-1 h-1 w-16 rounded-full bg-white/10">
                    <div
                      className="h-1 rounded-full bg-[#D4AF37]"
                      style={{
                        width: `${(project._count.doneTasks / project._count.tasks) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(project.createdAt).toLocaleDateString()}
              </td>
              {mode === "admin" && (
                <td className="px-4 py-3">
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onEdit && (
                      <button
                        onClick={() => onEdit(project)}
                        className="rounded p-1 text-gray-500 transition-colors hover:text-[#D4AF37]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(project.id)}
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
