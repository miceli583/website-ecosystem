"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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

  // Sort state
  const [projectSortBy, setProjectSortBy] = useState("createdAt");
  const [projectSortOrder, setProjectSortOrder] = useState<"asc" | "desc">(
    "desc"
  );
  const [taskSortBy, setTaskSortBy] = useState("createdAt");
  const [taskSortOrder, setTaskSortOrder] = useState<"asc" | "desc">("desc");

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
      sortBy: projectSortBy as "name" | "createdAt" | "updatedAt" | "status",
      sortOrder: projectSortOrder,
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
      sortBy: taskSortBy as
        | "title"
        | "priority"
        | "dueDate"
        | "createdAt"
        | "status",
      sortOrder: taskSortOrder,
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
    if (field === projectSortBy) {
      setProjectSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setProjectSortBy(field);
      setProjectSortOrder("asc");
    }
    setProjectPage(1);
  };

  const handleTaskSort = (field: string) => {
    if (field === taskSortBy) {
      setTaskSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setTaskSortBy(field);
      setTaskSortOrder("asc");
    }
    setTaskPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Quattrocento Sans', serif",
              letterSpacing: "0.08em",
            }}
          >
            Projects
          </h1>
          <p className="mt-1 text-sm text-gray-500">
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

            {projectsLoading ? (
              <LoadingSkeleton />
            ) : projectView === "list" ? (
              <ProjectList
                projects={(projectsData?.items ?? []) as ProjectWithMeta[]}
                mode="admin"
                sortBy={projectSortBy}
                sortOrder={projectSortOrder}
                onSort={handleProjectSort}
                onViewDetail={(id) => router.push(`/admin/projects/${id}`)}
                onEdit={(p) => {
                  setEditingProject(p);
                  setShowProjectForm(true);
                }}
                onDelete={(id) => {
                  if (confirm("Delete this project and all its tasks?")) {
                    deleteProject.mutate({ id });
                  }
                }}
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
            {projectsData && projectsData.total > pageSize && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(projectPage - 1) * pageSize + 1}–
                  {Math.min(projectPage * pageSize, projectsData.total)} of{" "}
                  {projectsData.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProjectPage((p) => Math.max(1, p - 1))}
                    disabled={projectPage === 1}
                    className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                    style={borderStyle}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setProjectPage((p) => p + 1)}
                    disabled={!projectsData.hasMore}
                    className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                    style={borderStyle}
                  >
                    Next
                  </button>
                </div>
              </div>
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
                sortBy={taskSortBy}
                sortOrder={taskSortOrder}
                onSort={handleTaskSort}
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
            {tasksData && tasksData.total > pageSize && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(taskPage - 1) * pageSize + 1}–
                  {Math.min(taskPage * pageSize, tasksData.total)} of{" "}
                  {tasksData.total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTaskPage((p) => Math.max(1, p - 1))}
                    disabled={taskPage === 1}
                    className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                    style={borderStyle}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setTaskPage((p) => p + 1)}
                    disabled={!tasksData.hasMore}
                    className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                    style={borderStyle}
                  >
                    Next
                  </button>
                </div>
              </div>
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
