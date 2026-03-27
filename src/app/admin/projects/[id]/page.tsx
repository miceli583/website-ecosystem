"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, ExternalLink } from "lucide-react";
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

export default function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = use(params);
  const projectId = Number(idStr);
  const router = useRouter();
  const utils = api.useUtils();

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

  // Data
  const { data: project, isLoading } = api.projects.getById.useQuery({
    id: projectId,
  });
  const { data: team } = api.crm.getCompanyTeam.useQuery();
  const { data: clientsList } = api.clients.list.useQuery({ pageSize: 100 });

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

  const clientOptions = (clientsList?.items ?? []).map(
    (c: { id: number; name: string; slug: string }) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })
  );

  // Mutations
  const updateProject = api.projects.update.useMutation({
    onSuccess: () => {
      void utils.projects.getById.invalidate({ id: projectId });
      void utils.projects.list.invalidate();
      setShowProjectEdit(false);
    },
  });

  const createTask = api.projects.createTask.useMutation({
    onSuccess: () => {
      void utils.projects.getById.invalidate({ id: projectId });
      setShowTaskForm(false);
    },
  });

  const updateTask = api.projects.updateTask.useMutation({
    onSuccess: () => {
      void utils.projects.getById.invalidate({ id: projectId });
      setEditingTask(undefined);
      setShowTaskForm(false);
    },
  });

  const deleteTask = api.projects.deleteTask.useMutation({
    onSuccess: () => void utils.projects.getById.invalidate({ id: projectId }),
  });

  const moveTaskStatus = api.projects.moveTaskStatus.useMutation({
    onSuccess: () => void utils.projects.getById.invalidate({ id: projectId }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-white/5" />
        <div className="h-32 animate-pulse rounded-lg bg-white/5" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p>Project not found</p>
        <button
          onClick={() => router.push("/admin/projects")}
          className="mt-4 text-sm text-[#D4AF37] hover:underline"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  // Filter tasks from the project data
  const allTasks = (project.tasks ?? []) as TaskWithMeta[];
  let filteredTasks = allTasks;
  if (filters.status) {
    filteredTasks = filteredTasks.filter((t) => t.status === filters.status);
  }
  if (filters.priority) {
    filteredTasks = filteredTasks.filter(
      (t) => t.priority === filters.priority
    );
  }
  if (filters.ownerId) {
    filteredTasks = filteredTasks.filter((t) => t.ownerId === filters.ownerId);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s)
    );
  }

  // Task stats
  const todoCount = allTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = allTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const doneCount = allTasks.filter((t) => t.status === "done").length;

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
        onClick={() => router.push("/admin/projects")}
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
              <span>
                Client:{" "}
                <span className="text-gray-300">{project.client.name}</span>
              </span>
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
          <div className="flex items-center gap-2">
            <Link
              href={`/portal/${project.client.slug}?domain=live`}
              className="rounded-lg border p-2 text-gray-500 transition-colors hover:text-[#D4AF37]"
              style={borderStyle}
              title={`Open ${project.client.name} portal`}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setShowProjectEdit(true)}
              className="rounded-lg border p-2 text-gray-500 transition-colors hover:text-[#D4AF37]"
              style={borderStyle}
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
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
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        team={teamMembers}
        mode="admin"
        showPriority
        showOwner
      />

      {view === "list" ? (
        <TaskList
          tasks={filteredTasks}
          mode="admin"
          showProject={false}
          sorts={sorts}
          onSort={handleSort}
          onEdit={(t) => {
            setEditingTask(t);
            setShowTaskForm(true);
          }}
          onDelete={(id) => {
            if (confirm("Delete this task?")) {
              deleteTask.mutate({ id });
            }
          }}
          onMoveStatus={(id, status) =>
            moveTaskStatus.mutate({
              id,
              status: status as "todo" | "in-progress" | "done",
            })
          }
        />
      ) : (
        <TaskKanban
          tasks={filteredTasks}
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

      {/* Modals */}
      <ProjectFormModal
        open={showProjectEdit}
        onClose={() => setShowProjectEdit(false)}
        mode="admin"
        project={projectMeta}
        clients={clientOptions}
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
        defaultClientId={project.clientId}
      />

      <TaskFormModal
        open={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(undefined);
        }}
        mode="admin"
        task={editingTask}
        projects={[{ id: project.id, name: project.name }]}
        clients={clientOptions}
        team={teamMembers}
        onSubmit={(data) => {
          if (editingTask) {
            updateTask.mutate({ id: editingTask.id, ...data });
          } else {
            createTask.mutate({ ...data, projectId });
          }
        }}
        isPending={createTask.isPending || updateTask.isPending}
        defaultProjectId={projectId}
        defaultClientId={project.clientId}
      />
    </div>
  );
}
