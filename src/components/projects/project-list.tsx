"use client";

import Link from "next/link";
import {
  Pencil,
  Trash2,
  Archive,
  ArchiveRestore,
  ExternalLink,
} from "lucide-react";
import type { ProjectWithMeta } from "./types";
import { ProjectStatusBadge } from "./status-badges";
import { SortHeader, type SortLevel } from "~/components/crm/sort-header";

interface ProjectListProps {
  projects: ProjectWithMeta[];
  mode: "admin" | "portal";
  sorts: SortLevel[];
  onSort: (field: string) => void;
  onViewDetail: (id: number) => void;
  onEdit?: (project: ProjectWithMeta) => void;
  onDelete?: (id: number) => void;
  onToggleArchive?: (id: number, isArchived: boolean) => void;
  showPortalLink?: boolean;
}

const thStatic =
  "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500";

export function ProjectList({
  projects,
  mode,
  sorts,
  onSort,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleArchive,
  showPortalLink,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-sm">No projects found</p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            className="border-b text-left text-xs tracking-wider text-gray-500 uppercase"
            style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
          >
            <SortHeader
              field="name"
              label="Name"
              sorts={sorts}
              onSort={onSort}
            />
            {mode === "admin" && (
              <SortHeader
                field="client"
                label="Client"
                sorts={sorts}
                onSort={onSort}
              />
            )}
            <SortHeader
              field="status"
              label="Status"
              sorts={sorts}
              onSort={onSort}
            />
            {mode === "admin" && (
              <SortHeader
                field="accountManager"
                label="AM"
                sorts={sorts}
                onSort={onSort}
              />
            )}
            {mode === "admin" && (
              <SortHeader
                field="developer"
                label="Dev"
                sorts={sorts}
                onSort={onSort}
              />
            )}
            <SortHeader
              field="tasks"
              label="Tasks"
              sorts={sorts}
              onSort={onSort}
            />
            <SortHeader
              field="createdAt"
              label="Created"
              sorts={sorts}
              onSort={onSort}
            />
            {showPortalLink && <th className={thStatic}>Portal</th>}
            {mode === "admin" && <th className={thStatic}>Actions</th>}
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
                  {project.client?.name ?? "—"}
                </td>
              )}
              <td className="px-4 py-3">
                <ProjectStatusBadge status={project.status} />
              </td>
              {mode === "admin" && (
                <td className="px-4 py-3 text-sm text-gray-400">
                  {project.accountManager?.name ?? "—"}
                </td>
              )}
              {mode === "admin" && (
                <td className="px-4 py-3 text-sm text-gray-400">
                  {project.assignedDeveloper?.name ?? "—"}
                </td>
              )}
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
              {showPortalLink && project.client && (
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/portal/${project.client.slug}?domain=live`}
                    className="text-gray-500 transition-colors hover:text-[#D4AF37]"
                    title={`Open ${project.client.name} portal`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </td>
              )}
              {showPortalLink && !project.client && (
                <td className="px-4 py-3" />
              )}
              {mode === "admin" && (
                <td className="px-4 py-3">
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onEdit && (
                      <button
                        onClick={() => onEdit(project)}
                        className="rounded p-1 text-gray-500 transition-colors hover:text-[#D4AF37]"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onToggleArchive && (
                      <button
                        onClick={() =>
                          onToggleArchive(project.id, !project.isArchived)
                        }
                        className="rounded p-1 text-gray-500 transition-colors hover:text-[#D4AF37]"
                        title={project.isArchived ? "Unarchive" : "Archive"}
                      >
                        {project.isArchived ? (
                          <ArchiveRestore className="h-3.5 w-3.5" />
                        ) : (
                          <Archive className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(project.id)}
                        className="rounded p-1 text-gray-500 transition-colors hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
