"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  AlertTriangle,
  Trash2,
  Archive,
  ArchiveRestore,
  ExternalLink,
} from "lucide-react";
import { api } from "~/trpc/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  ProjectList,
  ProjectKanban,
  TaskList,
  TaskKanban,
  ProjectFormModal,
  TaskFormModal,
  FilterBar,
  ViewToggle,
} from "~/components/projects";
import type {
  FilterState,
  ProjectWithMeta,
  TaskWithMeta,
} from "~/components/projects";
import type { SortLevel } from "~/components/crm/sort-header";

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

export default function AdminProjectsPage() {
  const router = useRouter();
  const utils = api.useUtils();

  // View state
  const [activeTab, setActiveTab] = useState("projects");
  const [projectView, setProjectView] = useState<"list" | "kanban">("list");
  const [taskView, setTaskView] = useState<"list" | "kanban">("list");

  // Filter state
  const [projectFilters, setProjectFilters] = useState<FilterState>({});
  const [taskFilters, setTaskFilters] = useState<FilterState>({});
  const [showArchived, setShowArchived] = useState(false);

  // Sort state (SortLevel[] for multi-column, first level drives server sort)
  const [projectSorts, setProjectSorts] = useState<SortLevel[]>([
    { field: "createdAt", order: "desc" },
  ]);
  const [taskSorts, setTaskSorts] = useState<SortLevel[]>([
    { field: "createdAt", order: "desc" },
  ]);

  // Pagination
  const [projectPage, setProjectPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const pageSize = 20;

  // Modal state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<
    ProjectWithMeta | undefined
  >();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithMeta | undefined>();
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(
    null
  );
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

  // Server-valid sort fields — other columns sort client-side only via SortHeader UI
  const PROJECT_SORT_FIELDS = [
    "name",
    "createdAt",
    "updatedAt",
    "status",
  ] as const;
  const TASK_SORT_FIELDS = [
    "title",
    "priority",
    "dueDate",
    "createdAt",
    "status",
  ] as const;

  const projectServerSort = projectSorts.find((s) =>
    (PROJECT_SORT_FIELDS as readonly string[]).includes(s.field)
  );
  const taskServerSort = taskSorts.find((s) =>
    (TASK_SORT_FIELDS as readonly string[]).includes(s.field)
  );

  // Data queries
  const { data: projectsData, isLoading: projectsLoading } =
    api.projects.list.useQuery({
      clientId: projectFilters.clientId,
      accountManagerId: projectFilters.accountManagerId,
      developerId: projectFilters.developerId,
      status: projectFilters.status as
        | "active"
        | "completed"
        | "on-hold"
        | "paused"
        | undefined,
      search: projectFilters.search,
      includeArchived: showArchived,
      sortBy: (projectServerSort?.field ?? "createdAt") as
        | "name"
        | "createdAt"
        | "updatedAt"
        | "status",
      sortOrder: projectServerSort?.order ?? "desc",
      page: projectPage,
      pageSize,
    });

  const { data: tasksData, isLoading: tasksLoading } =
    api.projects.listTasks.useQuery({
      clientId: taskFilters.clientId,
      accountManagerId: taskFilters.accountManagerId,
      developerId: taskFilters.developerId,
      ownerId: taskFilters.ownerId,
      status: taskFilters.status as "todo" | "in-progress" | "done" | undefined,
      priority: taskFilters.priority as
        | "low"
        | "medium"
        | "high"
        | "urgent"
        | undefined,
      search: taskFilters.search,
      sortBy: (taskServerSort?.field ?? "createdAt") as
        | "title"
        | "priority"
        | "dueDate"
        | "createdAt"
        | "status",
      sortOrder: taskServerSort?.order ?? "desc",
      page: taskPage,
      pageSize,
    });

  // Support data for filters and forms
  const { data: clientsList } = api.clients.list.useQuery({ pageSize: 100 });
  const { data: team } = api.crm.getCompanyTeam.useQuery();

  const clientOptions = (clientsList?.items ?? []).map(
    (c: { id: number; name: string; slug: string }) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })
  );

  const teamMembers = (team ?? []).map(
    (m: {
      id: string;
      name: string;
      email: string;
      companyRoles: string[] | null;
    }) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      companyRoles: m.companyRoles,
    })
  );

  // Project options for task form
  const projectOptions = (projectsData?.items ?? []).map(
    (p: { id: number; name: string }) => ({
      id: p.id,
      name: p.name,
    })
  );

  // Mutations
  const createProject = api.projects.create.useMutation({
    onSuccess: () => {
      void utils.projects.list.invalidate();
      setShowProjectForm(false);
    },
  });

  const updateProject = api.projects.update.useMutation({
    onSuccess: () => {
      void utils.projects.list.invalidate();
      setEditingProject(undefined);
      setShowProjectForm(false);
    },
  });

  const deleteProject = api.projects.delete.useMutation({
    onSuccess: () => void utils.projects.list.invalidate(),
  });

  const moveProjectStatus = api.projects.update.useMutation({
    onSuccess: () => void utils.projects.list.invalidate(),
  });

  const toggleArchive = api.projects.toggleArchive.useMutation({
    onSuccess: () => void utils.projects.list.invalidate(),
  });

  const createTask = api.projects.createTask.useMutation({
    onSuccess: () => {
      void utils.projects.listTasks.invalidate();
      void utils.projects.list.invalidate();
      setShowTaskForm(false);
    },
  });

  const updateTask = api.projects.updateTask.useMutation({
    onSuccess: () => {
      void utils.projects.listTasks.invalidate();
      void utils.projects.list.invalidate();
      setEditingTask(undefined);
      setShowTaskForm(false);
    },
  });

  const deleteTask = api.projects.deleteTask.useMutation({
    onSuccess: () => {
      void utils.projects.listTasks.invalidate();
      void utils.projects.list.invalidate();
    },
  });

  const moveTaskStatus = api.projects.moveTaskStatus.useMutation({
    onSuccess: () => {
      void utils.projects.listTasks.invalidate();
      void utils.projects.list.invalidate();
    },
  });

  // Handlers
  const handleProjectSort = (field: string) => {
    setProjectSorts((prev) => {
      const idx = prev.findIndex((s) => s.field === field);
      if (idx === -1) return [...prev, { field, order: "asc" as const }];
      if (prev[idx]!.order === "asc")
        return prev.map((s, i) =>
          i === idx ? { ...s, order: "desc" as const } : s
        );
      return prev.filter((_, i) => i !== idx);
    });
    setProjectPage(1);
  };

  const handleTaskSort = (field: string) => {
    setTaskSorts((prev) => {
      const idx = prev.findIndex((s) => s.field === field);
      if (idx === -1) return [...prev, { field, order: "asc" as const }];
      if (prev[idx]!.order === "asc")
        return prev.map((s, i) =>
          i === idx ? { ...s, order: "desc" as const } : s
        );
      return prev.filter((_, i) => i !== idx);
    });
    setTaskPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-gray-400">
            Manage projects and tasks across all clients
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingTask(undefined);
              setShowTaskForm(true);
            }}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white"
            style={borderStyle}
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
          <button
            onClick={() => {
              setEditingProject(undefined);
              setShowProjectForm(true);
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="border bg-white/5" style={borderStyle}>
            <TabsTrigger
              value="projects"
              className="text-gray-400 data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]"
            >
              Projects
              {projectsData && (
                <span className="ml-1.5 text-xs text-gray-600">
                  {projectsData.total}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="text-gray-400 data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]"
            >
              Tasks
              {tasksData && (
                <span className="ml-1.5 text-xs text-gray-600">
                  {tasksData.total}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <ViewToggle
            view={activeTab === "projects" ? projectView : taskView}
            onViewChange={(v) =>
              activeTab === "projects" ? setProjectView(v) : setTaskView(v)
            }
          />
        </div>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FilterBar
                filters={projectFilters}
                onFiltersChange={(f) => {
                  setProjectFilters(f);
                  setProjectPage(1);
                }}
                clients={clientOptions}
                team={teamMembers}
                mode="admin"
              />
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  showArchived
                    ? "border-[rgba(212,175,55,0.3)] text-[#D4AF37]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                style={showArchived ? undefined : borderStyle}
                title={showArchived ? "Hide archived" : "Show archived"}
              >
                <Archive className="h-3.5 w-3.5" />
                Archived
              </button>
            </div>

            {projectsLoading ? (
              <LoadingSkeleton />
            ) : projectView === "list" ? (
              <ProjectList
                projects={(projectsData?.items ?? []) as ProjectWithMeta[]}
                mode="admin"
                sorts={projectSorts}
                onSort={handleProjectSort}
                onViewDetail={(id) => router.push(`/admin/projects/${id}`)}
                onEdit={(p) => {
                  setEditingProject(p);
                  setShowProjectForm(true);
                }}
                onDelete={(id) => setDeletingProjectId(id)}
                onToggleArchive={(id, isArchived) =>
                  toggleArchive.mutate({ id, isArchived })
                }
                showPortalLink
              />
            ) : (
              <ProjectKanban
                projects={(projectsData?.items ?? []) as ProjectWithMeta[]}
                mode="admin"
                onMoveStatus={(id, status) =>
                  moveProjectStatus.mutate({
                    id,
                    status: status as
                      | "active"
                      | "completed"
                      | "on-hold"
                      | "paused",
                  })
                }
                onViewDetail={(id) => router.push(`/admin/projects/${id}`)}
              />
            )}

            {/* Pagination */}
            {projectsData && projectsData.total > 0 && (
              <Pagination
                page={projectPage}
                total={projectsData.total}
                pageSize={pageSize}
                hasMore={projectsData.hasMore}
                onPageChange={setProjectPage}
              />
            )}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="space-y-4">
            <FilterBar
              filters={taskFilters}
              onFiltersChange={(f) => {
                setTaskFilters(f);
                setTaskPage(1);
              }}
              clients={clientOptions}
              team={teamMembers}
              mode="admin"
              showPriority
              showOwner
            />

            {tasksLoading ? (
              <LoadingSkeleton />
            ) : taskView === "list" ? (
              <TaskList
                tasks={(tasksData?.items ?? []) as TaskWithMeta[]}
                mode="admin"
                showProject
                showClient
                sorts={taskSorts}
                onSort={handleTaskSort}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowTaskForm(true);
                }}
                onDelete={(id) => setDeletingTaskId(id)}
                onMoveStatus={(id, status) =>
                  moveTaskStatus.mutate({
                    id,
                    status: status as "todo" | "in-progress" | "done",
                  })
                }
              />
            ) : (
              <TaskKanban
                tasks={(tasksData?.items ?? []) as TaskWithMeta[]}
                mode="admin"
                onMoveStatus={(id, status) =>
                  moveTaskStatus.mutate({
                    id,
                    status: status as "todo" | "in-progress" | "done",
                  })
                }
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowTaskForm(true);
                }}
              />
            )}

            {/* Pagination */}
            {tasksData && tasksData.total > 0 && (
              <Pagination
                page={taskPage}
                total={tasksData.total}
                pageSize={pageSize}
                hasMore={tasksData.hasMore}
                onPageChange={setTaskPage}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProjectFormModal
        open={showProjectForm}
        onClose={() => {
          setShowProjectForm(false);
          setEditingProject(undefined);
        }}
        mode="admin"
        project={editingProject}
        clients={clientOptions}
        team={teamMembers}
        onSubmit={(data) => {
          if (editingProject) {
            updateProject.mutate({ id: editingProject.id, ...data });
          } else {
            createProject.mutate(data);
          }
        }}
        isPending={createProject.isPending || updateProject.isPending}
      />

      <TaskFormModal
        open={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(undefined);
        }}
        mode="admin"
        task={editingTask}
        projects={projectOptions}
        clients={clientOptions}
        team={teamMembers}
        onSubmit={(data) => {
          if (editingTask) {
            updateTask.mutate({ id: editingTask.id, ...data });
          } else {
            createTask.mutate(data);
          }
        }}
        isPending={createTask.isPending || updateTask.isPending}
      />

      {/* Delete Project Confirmation */}
      {deletingProjectId !== null && (
        <DeleteProjectDialog
          projectId={deletingProjectId}
          onConfirm={() => {
            deleteProject.mutate(
              { id: deletingProjectId },
              { onSettled: () => setDeletingProjectId(null) }
            );
          }}
          onCancel={() => setDeletingProjectId(null)}
          isPending={deleteProject.isPending}
        />
      )}

      {/* Delete Task Confirmation */}
      {deletingTaskId !== null && (
        <DeleteConfirmDialog
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => {
            deleteTask.mutate(
              { id: deletingTaskId },
              { onSettled: () => setDeletingTaskId(null) }
            );
          }}
          onCancel={() => setDeletingTaskId(null)}
          isPending={deleteTask.isPending}
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

function Pagination({
  page,
  total,
  pageSize,
  hasMore,
  onPageChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {(page - 1) * pageSize + 1}&ndash;
        {Math.min(page * pageSize, total)} of {total}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
            style={borderStyle}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (i) => i === 1 || i === totalPages || Math.abs(i - page) <= 1
            )
            .map((i, idx, arr) => (
              <span key={i} className="flex items-center">
                {idx > 0 && arr[idx - 1] !== i - 1 && (
                  <span className="px-1 text-xs text-gray-600">&hellip;</span>
                )}
                <button
                  onClick={() => onPageChange(i)}
                  className={`rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                    i === page
                      ? "font-medium text-[#D4AF37]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {i}
                </button>
              </span>
            ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasMore}
            className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
            style={borderStyle}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function DeleteProjectDialog({
  projectId,
  onConfirm,
  onCancel,
  isPending,
}: {
  projectId: number;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const { data: impact, isLoading } = api.projects.getDeleteImpact.useQuery({
    id: projectId,
  });

  const willDelete: string[] = [];
  const willUnlink: string[] = [];

  if (impact) {
    if (impact.tasks > 0)
      willDelete.push(`${impact.tasks} task${impact.tasks !== 1 ? "s" : ""}`);
    if (impact.updates > 0)
      willDelete.push(
        `${impact.updates} update${impact.updates !== 1 ? "s" : ""}`
      );
    if (impact.notes > 0)
      willUnlink.push(`${impact.notes} note${impact.notes !== 1 ? "s" : ""}`);
    if (impact.resources > 0)
      willUnlink.push(
        `${impact.resources} resource${impact.resources !== 1 ? "s" : ""}`
      );
    if (impact.agreements > 0)
      willUnlink.push(
        `${impact.agreements} agreement${impact.agreements !== 1 ? "s" : ""}`
      );
  }

  const hasImpact = willDelete.length > 0 || willUnlink.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border bg-[#0a0a0a] p-6"
        style={borderStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Delete Project</h2>
            <p className="text-sm text-gray-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-4">
            <div className="h-4 w-48 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
          </div>
        ) : hasImpact ? (
          <div className="mb-4 space-y-3">
            {willDelete.length > 0 && (
              <div
                className="rounded-lg border bg-red-500/5 px-4 py-3"
                style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}
              >
                <p className="mb-1 text-xs font-medium tracking-wider text-red-400 uppercase">
                  Will be permanently deleted
                </p>
                <p className="text-sm text-gray-300">{willDelete.join(", ")}</p>
              </div>
            )}
            {willUnlink.length > 0 && (
              <div
                className="rounded-lg border bg-white/5 px-4 py-3"
                style={borderStyle}
              >
                <p className="mb-1 text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Will be unlinked (kept)
                </p>
                <p className="text-sm text-gray-300">{willUnlink.join(", ")}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="mb-4 text-sm text-gray-400">
            This project has no linked data.
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
            style={borderStyle}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending || isLoading}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isPending ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  isPending,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border bg-[#0a0a0a] p-6"
        style={borderStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <p className="mb-4 text-sm text-gray-400">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
            style={borderStyle}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
