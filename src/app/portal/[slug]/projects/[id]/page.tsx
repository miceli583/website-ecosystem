"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Plus, Pencil } from "lucide-react";
import { api } from "~/trpc/react";
import {
  TaskList,
  TaskKanban,
  TaskFormModal,
  ProjectFormModal,
  FilterBar,
  ViewToggle,
  ProjectStatusBadge,
} from "~/components/projects";
import type {
  FilterState,
  TaskWithMeta,
  ProjectWithMeta,
} from "~/components/projects";
import type { SortLevel } from "~/components/crm/sort-header";

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

export default function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id: idStr } = use(params);
  const projectId = Number(idStr);
  const router = useRouter();
  const utils = api.useUtils();

  // Auth & client data
  const {
    data: client,
    isLoading: clientLoading,
    error: clientError,
  } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  // View state
  const [view, setView] = useState<"list" | "kanban">("list");
  const [filters, setFilters] = useState<FilterState>({});
  const [sorts, setSorts] = useState<SortLevel[]>([
    { field: "createdAt", order: "desc" },
  ]);

  // Modal state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithMeta | undefined>();
  const [showProjectEdit, setShowProjectEdit] = useState(false);

  // Project data — fetch all portal projects and find the one we need
  const { data: projects, isLoading: projectsLoading } =
    api.projects.portalProjects.useQuery({ slug }, { enabled: !!client });

  const project = (projects ?? []).find(
    (p: { id: number }) => p.id === projectId
  ) as ProjectWithMeta | undefined;

  // Tasks for this project
  const { data: tasks, isLoading: tasksLoading } =
    api.projects.portalTasks.useQuery(
      {
        slug,
        projectId,
        status: filters.status as "todo" | "in-progress" | "done" | undefined,
        priority: filters.priority as
          | "low"
          | "medium"
          | "high"
          | "urgent"
          | undefined,
        search: filters.search,
      },
      { enabled: !!client }
    );

  // Team data for forms (admin only)
  const { data: team } = api.crm.getCompanyTeam.useQuery(undefined, {
    enabled: isAdmin,
  });

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

  // Mutations
  const updateProject = api.projects.update.useMutation({
    onSuccess: () => {
      void utils.projects.portalProjects.invalidate({ slug });
      setShowProjectEdit(false);
    },
  });

  const createTask = api.projects.createTask.useMutation({
    onSuccess: () => {
      void utils.projects.portalTasks.invalidate({ slug });
      void utils.projects.portalProjects.invalidate({ slug });
      setShowTaskForm(false);
    },
  });

  const updateTask = api.projects.updateTask.useMutation({
    onSuccess: () => {
      void utils.projects.portalTasks.invalidate({ slug });
      void utils.projects.portalProjects.invalidate({ slug });
      setEditingTask(undefined);
      setShowTaskForm(false);
    },
  });

  const deleteTask = api.projects.deleteTask.useMutation({
    onSuccess: () => {
      void utils.projects.portalTasks.invalidate({ slug });
      void utils.projects.portalProjects.invalidate({ slug });
    },
  });

  const moveTaskStatus = api.projects.portalUpdateTaskStatus.useMutation({
    onSuccess: () => {
      void utils.projects.portalTasks.invalidate({ slug });
      void utils.projects.portalProjects.invalidate({ slug });
    },
  });

  // Sort handler
  const handleSort = (field: string) => {
    setSorts((prev) => {
      const idx = prev.findIndex((s) => s.field === field);
      if (idx === -1) return [...prev, { field, order: "asc" as const }];
      if (prev[idx]!.order === "asc")
        return prev.map((s, i) =>
          i === idx ? { ...s, order: "desc" as const } : s
        );
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Loading state
  if (clientLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  // Error state
  if (clientError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold text-white">Access Denied</h1>
        <p className="text-gray-400">{clientError.message}</p>
      </div>
    );
  }

  // Not found states
  if (!client) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Portal not found
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p>Project not found</p>
        <button
          onClick={() => router.push(`/portal/${slug}/projects`)}
          className="mt-4 text-sm text-[#D4AF37] hover:underline"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  // Task stats
  const allTasks = (tasks ?? []) as TaskWithMeta[];
  const todoCount = allTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = allTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const doneCount = allTasks.filter((t) => t.status === "done").length;

  // Build project meta for edit modal
  const projectMeta: ProjectWithMeta = {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    isArchived: project.isArchived ?? false,
    clientId: project.clientId,
    accountManagerId: project.accountManagerId,
    assignedDeveloperId: project.assignedDeveloperId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    client: project.client,
    accountManager: project.accountManager,
    assignedDeveloper: project.assignedDeveloper,
    _count: { tasks: allTasks.length, doneTasks: doneCount },
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push(`/portal/${slug}/projects`)}
        className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#D4AF37]"
      >
        <ArrowLeft className="h-4 w-4" />
        All Projects
      </button>

      {/* Project header */}
      <div className="rounded-lg border bg-white/5 p-6" style={borderStyle}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            {project.description && (
              <p className="mt-1 text-sm text-gray-400">
                {project.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              {project.accountManager && (
                <span>
                  AM:{" "}
                  <span className="text-gray-300">
                    {project.accountManager.name}
                  </span>
                </span>
              )}
              {project.assignedDeveloper && (
                <span>
                  Dev:{" "}
                  <span className="text-gray-300">
                    {project.assignedDeveloper.name}
                  </span>
                </span>
              )}
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowProjectEdit(true)}
              className="rounded-lg border p-2 text-gray-500 transition-colors hover:text-[#D4AF37]"
              style={borderStyle}
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: allTasks.length, color: "#D4AF37" },
            { label: "Todo", value: todoCount, color: "#9ca3af" },
            { label: "In Progress", value: inProgressCount, color: "#60a5fa" },
            { label: "Done", value: doneCount, color: "#4ade80" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border bg-white/[0.02] p-3 text-center"
              style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
            >
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks section */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Tasks</h2>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onViewChange={setView} />
          {isAdmin && (
            <button
              onClick={() => {
                setEditingTask(undefined);
                setShowTaskForm(true);
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          )}
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        mode="portal"
        showPriority
      />

      {tasksLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : view === "list" ? (
        <TaskList
          tasks={allTasks}
          mode="portal"
          showProject={false}
          sorts={sorts}
          onSort={handleSort}
          onEdit={
            isAdmin
              ? (t) => {
                  setEditingTask(t);
                  setShowTaskForm(true);
                }
              : undefined
          }
          onDelete={
            isAdmin
              ? (id) => {
                  if (confirm("Delete this task?")) {
                    deleteTask.mutate({ id });
                  }
                }
              : undefined
          }
          onMoveStatus={(id, status) =>
            moveTaskStatus.mutate({
              slug,
              taskId: id,
              status: status as "todo" | "in-progress" | "done",
            })
          }
        />
      ) : (
        <TaskKanban
          tasks={allTasks}
          mode={isAdmin ? "admin" : "portal"}
          onMoveStatus={(id, status) =>
            moveTaskStatus.mutate({
              slug,
              taskId: id,
              status: status as "todo" | "in-progress" | "done",
            })
          }
          onEdit={
            isAdmin
              ? (t) => {
                  setEditingTask(t);
                  setShowTaskForm(true);
                }
              : undefined
          }
        />
      )}

      {/* Admin-only modals */}
      {isAdmin && (
        <>
          <ProjectFormModal
            open={showProjectEdit}
            onClose={() => setShowProjectEdit(false)}
            mode="portal"
            project={projectMeta}
            clients={[{ id: client.id, name: client.name, slug: client.slug }]}
            team={teamMembers}
            onSubmit={(data) =>
              updateProject.mutate({
                id: projectId,
                name: data.name,
                description: data.description,
                status: data.status,
                accountManagerId: data.accountManagerId,
                assignedDeveloperId: data.assignedDeveloperId,
              })
            }
            isPending={updateProject.isPending}
            defaultClientId={client.id}
          />

          <TaskFormModal
            open={showTaskForm}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(undefined);
            }}
            mode="portal"
            task={editingTask}
            projects={[{ id: project.id, name: project.name }]}
            clients={[{ id: client.id, name: client.name, slug: client.slug }]}
            team={teamMembers}
            onSubmit={(data) => {
              if (editingTask) {
                updateTask.mutate({ id: editingTask.id, ...data });
              } else {
                createTask.mutate({
                  ...data,
                  projectId,
                  clientId: client.id,
                });
              }
            }}
            isPending={createTask.isPending || updateTask.isPending}
            defaultProjectId={projectId}
            defaultClientId={client.id}
          />
        </>
      )}
    </div>
  );
}
