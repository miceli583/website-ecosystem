"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { api } from "~/trpc/react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

export default function PortalProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const utils = api.useUtils();

  // Auth & client data
  const {
    data: client,
    isLoading,
    error,
  } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  // View state
  const [activeTab, setActiveTab] = useState("projects");
  const [projectView, setProjectView] = useState<"list" | "kanban">("list");
  const [taskView, setTaskView] = useState<"list" | "kanban">("list");
  const [projectFilters, setProjectFilters] = useState<FilterState>({});
  const [taskFilters, setTaskFilters] = useState<FilterState>({});
  const [projectSorts, setProjectSorts] = useState<SortLevel[]>([
    { field: "createdAt", order: "desc" },
  ]);
  const [taskSorts, setTaskSorts] = useState<SortLevel[]>([
    { field: "createdAt", order: "desc" },
  ]);

  // Modal state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<
    ProjectWithMeta | undefined
  >();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithMeta | undefined>();

  // Data queries
  const { data: projects, isLoading: projectsLoading } =
    api.projects.portalProjects.useQuery(
      {
        slug,
        status: projectFilters.status as
          | "active"
          | "completed"
          | "on-hold"
          | "paused"
          | undefined,
        search: projectFilters.search,
      },
      { enabled: !!client }
    );

  const { data: tasks, isLoading: tasksLoading } =
    api.projects.portalTasks.useQuery(
      {
        slug,
        status: taskFilters.status as
          | "todo"
          | "in-progress"
          | "done"
          | undefined,
        priority: taskFilters.priority as
          | "low"
          | "medium"
          | "high"
          | "urgent"
          | undefined,
        search: taskFilters.search,
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

  const projectOptions = (projects ?? []).map(
    (p: { id: number; name: string }) => ({
      id: p.id,
      name: p.name,
    })
  );

  // Mutations
  const createProject = api.projects.create.useMutation({
    onSuccess: () => {
      void utils.projects.portalProjects.invalidate({ slug });
      void utils.projects.portalTasks.invalidate({ slug });
      setShowProjectForm(false);
    },
  });

  const updateProject = api.projects.update.useMutation({
    onSuccess: () => {
      void utils.projects.portalProjects.invalidate({ slug });
      setEditingProject(undefined);
      setShowProjectForm(false);
    },
  });

  const deleteProject = api.projects.delete.useMutation({
    onSuccess: () => {
      void utils.projects.portalProjects.invalidate({ slug });
      void utils.projects.portalTasks.invalidate({ slug });
    },
  });

  const moveProjectStatus = api.projects.update.useMutation({
    onSuccess: () => void utils.projects.portalProjects.invalidate({ slug }),
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

  // Sort handlers
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
  };

  // Loading states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold text-white">Access Denied</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Portal not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-gray-400">
            {isAdmin
              ? `Manage projects and tasks for ${client.name}`
              : `View projects and tasks`}
          </p>
        </div>
        {isAdmin && (
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
        )}
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
              {projects && (
                <span className="ml-1.5 text-xs text-gray-600">
                  {projects.length}
                </span>
              )}
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="tasks"
                className="text-gray-400 data-[state=active]:bg-[#D4AF37]/10 data-[state=active]:text-[#D4AF37]"
              >
                Tasks
                {tasks && (
                  <span className="ml-1.5 text-xs text-gray-600">
                    {tasks.length}
                  </span>
                )}
              </TabsTrigger>
            )}
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
              onFiltersChange={setProjectFilters}
              mode="portal"
            />

            {projectsLoading ? (
              <LoadingSkeleton />
            ) : projectView === "list" ? (
              <ProjectList
                projects={(projects ?? []) as ProjectWithMeta[]}
                mode="portal"
                sorts={projectSorts}
                onSort={handleProjectSort}
                onViewDetail={(id) =>
                  router.push(`/portal/${slug}/projects/${id}?domain=live`)
                }
                onEdit={
                  isAdmin
                    ? (p) => {
                        setEditingProject(p);
                        setShowProjectForm(true);
                      }
                    : undefined
                }
                onDelete={
                  isAdmin
                    ? (id) => {
                        if (confirm("Delete this project and all its tasks?")) {
                          deleteProject.mutate({ id });
                        }
                      }
                    : undefined
                }
              />
            ) : (
              <ProjectKanban
                projects={(projects ?? []) as ProjectWithMeta[]}
                mode={isAdmin ? "admin" : "portal"}
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
                onViewDetail={(id) =>
                  router.push(`/portal/${slug}/projects/${id}?domain=live`)
                }
              />
            )}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="space-y-4">
            <FilterBar
              filters={taskFilters}
              onFiltersChange={setTaskFilters}
              mode="portal"
              showPriority
            />

            {tasksLoading ? (
              <LoadingSkeleton />
            ) : taskView === "list" ? (
              <TaskList
                tasks={(tasks ?? []) as TaskWithMeta[]}
                mode="portal"
                showProject
                sorts={taskSorts}
                onSort={handleTaskSort}
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
                tasks={(tasks ?? []) as TaskWithMeta[]}
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
          </div>
        </TabsContent>
      </Tabs>

      {/* Admin-only modals */}
      {isAdmin && (
        <>
          <ProjectFormModal
            open={showProjectForm}
            onClose={() => {
              setShowProjectForm(false);
              setEditingProject(undefined);
            }}
            mode="portal"
            project={editingProject}
            clients={[{ id: client.id, name: client.name, slug: client.slug }]}
            team={teamMembers}
            onSubmit={(data) => {
              if (editingProject) {
                updateProject.mutate({ id: editingProject.id, ...data });
              } else {
                createProject.mutate({ ...data, clientId: client.id });
              }
            }}
            isPending={createProject.isPending || updateProject.isPending}
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
            projects={projectOptions}
            clients={[{ id: client.id, name: client.name, slug: client.slug }]}
            team={teamMembers}
            onSubmit={(data) => {
              if (editingTask) {
                updateTask.mutate({ id: editingTask.id, ...data });
              } else {
                createTask.mutate({ ...data, clientId: client.id });
              }
            }}
            isPending={createTask.isPending || updateTask.isPending}
            defaultClientId={client.id}
          />
        </>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
      ))}
    </div>
  );
}
