"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";
import {
  SearchFilterBar,
  StatusTabs,
  AdminActionMenu,
  ProjectAssignDialog,
  ConfirmDialog,
  type FilterOption,
  type AdminAction,
  useTabFilters,
} from "~/components/portal";
import { SortHeader, type SortLevel } from "~/components/crm/sort-header";
import {
  Wrench,
  Loader2,
  AlertCircle,
  Key,
  Book,
  Code,
  Link as LinkIcon,
  FileText,
  Archive,
  ArchiveRestore,
  FolderOpen,
  Trash2,
  Construction,
  Eye,
  ExternalLink,
} from "lucide-react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type Resource = RouterOutputs["portal"]["getResources"][number];

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

interface NormalizedTool {
  id: string;
  resourceId: number;
  title: string;
  description: string | null;
  url: string | null;
  icon: string | null;
  type: string | null;
  projectId: number | null;
  projectName: string;
  createdAt: Date | string;
  isActive: boolean;
  underDevelopment: boolean;
  subscriptionActive: boolean;
}

function getResourceIcon(tool: NormalizedTool) {
  const iconMap: Record<string, React.ReactNode> = {
    link: <LinkIcon className="h-4 w-4" />,
    key: <Key className="h-4 w-4" />,
    book: <Book className="h-4 w-4" />,
    code: <Code className="h-4 w-4" />,
    file: <FileText className="h-4 w-4" />,
    wrench: <Wrench className="h-4 w-4" />,
  };

  if (tool.icon && iconMap[tool.icon]) {
    return iconMap[tool.icon];
  }

  switch (tool.type) {
    case "credential":
      return <Key className="h-4 w-4" />;
    case "embed":
      return <Code className="h-4 w-4" />;
    case "file":
      return <FileText className="h-4 w-4" />;
    default:
      return <LinkIcon className="h-4 w-4" />;
  }
}

export default function PortalToolingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const utils = api.useUtils();

  // Data queries
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

  // Admin sees all resources; clients see only active
  const { data: resources, isLoading: resourcesLoading } =
    api.portal.getResources.useQuery(
      { slug, section: "tooling", ...(isAdmin ? {} : { isActive: true }) },
      { staleTime: 5 * 60 * 1000 }
    );
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin, staleTime: 5 * 60 * 1000 }
  );

  // Mutations
  const updateResource = api.portal.updateResource.useMutation({
    onSuccess: (_, variables) => {
      if (variables.isActive === false) toast.success("Tool archived");
      else if (variables.isActive === true) toast.success("Tool restored");
      else if (variables.underDevelopment === true)
        toast.success("Tool marked as under development");
      else if (variables.underDevelopment === false)
        toast.success("Tool is now visible to clients");
      else if (variables.projectId !== undefined)
        toast.success("Project assigned");
      void utils.portal.getResources.invalidate();
    },
  });
  const deleteResource = api.portal.deleteResource.useMutation({
    onSuccess: () => {
      toast.success("Tool deleted");
      void utils.portal.getResources.invalidate();
    },
  });
  const createProject = api.portal.createProject.useMutation({
    onSuccess: () => {
      toast.success("Project created");
      void utils.portal.getProjects.invalidate();
    },
  });

  // Persisted filter state
  const { getState, setState: persistState } = useTabFilters("tooling");
  const saved = getState();

  // UI state
  const [activeTab, setActiveTab] = useState<"active" | "archived">(
    saved.activeTab ?? "active"
  );
  const [searchQuery, setSearchQuery] = useState(saved.searchQuery);
  const [selectedProject, setSelectedProject] = useState<
    number | "all" | "unassigned"
  >(saved.selectedProject as number | "all" | "unassigned");
  const [sorts, setSorts] = useState<SortLevel[]>(
    saved.sorts ?? [{ field: "title", order: "asc" }]
  );

  useEffect(() => {
    persistState({
      searchQuery,
      selectedProject,
      activeTab,
      sorts,
    });
  }, [searchQuery, selectedProject, activeTab, sorts, persistState]);

  // Dialog state
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    tool: NormalizedTool | null;
  }>({
    open: false,
    tool: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    tool: NormalizedTool | null;
  }>({
    open: false,
    tool: null,
  });

  // Normalize resources
  const allTools: NormalizedTool[] = useMemo(() => {
    if (!resources) return [];
    return resources.map((r: Resource) => ({
      id: `r-${r.id}`,
      resourceId: r.id,
      title: r.title,
      description: r.description,
      url: r.url,
      icon: r.icon,
      type: r.type,
      projectId: r.project?.id ?? null,
      projectName: r.project?.name ?? "",
      createdAt: r.createdAt,
      isActive: r.isActive ?? true,
      underDevelopment: r.underDevelopment ?? false,
      subscriptionActive: r.subscriptionActive ?? true,
    }));
  }, [resources]);

  // Get project filters
  const projectFilters: FilterOption[] = useMemo(() => {
    if (!client) return [];
    const projectMap = new Map<number, string>();

    resources?.forEach((r: Resource) => {
      if (r.project) projectMap.set(r.project.id, r.project.name);
    });
    client.projects.forEach((p: ClientProject) => {
      projectMap.set(p.id, p.name);
    });
    projects?.forEach((p: { id: number; name: string }) => {
      projectMap.set(p.id, p.name);
    });

    const filters: FilterOption[] = Array.from(projectMap.entries()).map(
      ([id, name]) => ({ id, name })
    );
    if (allTools.some((t) => t.projectId === null)) {
      filters.push({ id: "unassigned", name: "Unassigned" });
    }
    return filters;
  }, [client, resources, projects, allTools]);

  // Split by active/archived
  const activeTools = useMemo(
    () => allTools.filter((t) => t.isActive),
    [allTools]
  );
  const archivedTools = useMemo(
    () => allTools.filter((t) => !t.isActive),
    [allTools]
  );
  const currentTools = activeTab === "active" ? activeTools : archivedTools;

  // Filter
  const filteredTools = useMemo(() => {
    return currentTools.filter((tool) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tool.title.toLowerCase().includes(query);
        const matchesDesc = tool.description?.toLowerCase().includes(query);
        const matchesProject = tool.projectName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }
      if (selectedProject === "unassigned") return tool.projectId === null;
      if (selectedProject !== "all" && tool.projectId !== selectedProject)
        return false;
      return true;
    });
  }, [currentTools, searchQuery, selectedProject]);

  // Multi-column sort
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

  const sortedTools = useMemo(() => {
    if (!sorts.length) return filteredTools;
    return [...filteredTools].sort((a, b) => {
      for (const { field, order } of sorts) {
        let cmp = 0;
        const dir = order === "asc" ? 1 : -1;
        switch (field) {
          case "title":
            cmp = a.title.localeCompare(b.title);
            break;
          case "type":
            cmp = (a.type ?? "").localeCompare(b.type ?? "");
            break;
          case "project":
            cmp = (a.projectName || "zzz").localeCompare(
              b.projectName || "zzz"
            );
            break;
          case "createdAt":
            cmp =
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
        }
        if (cmp !== 0) return cmp * dir;
      }
      return 0;
    });
  }, [filteredTools, sorts]);

  // Admin actions
  const handleArchive = useCallback(
    (tool: NormalizedTool) => {
      updateResource.mutate({ id: tool.resourceId, isActive: !tool.isActive });
    },
    [updateResource]
  );

  const handleDelete = useCallback(
    (tool: NormalizedTool) => {
      deleteResource.mutate({ id: tool.resourceId });
      setDeleteDialog({ open: false, tool: null });
    },
    [deleteResource]
  );

  const handleAssign = useCallback(
    (projectId: number | null) => {
      if (!assignDialog.tool) return;
      updateResource.mutate({ id: assignDialog.tool.resourceId, projectId });
    },
    [assignDialog.tool, updateResource]
  );

  const handleCreateProject = useCallback(
    (name: string) => {
      return createProject.mutateAsync({ slug, name });
    },
    [createProject, slug]
  );

  const handleToggleUnderDevelopment = useCallback(
    (tool: NormalizedTool) => {
      updateResource.mutate({
        id: tool.resourceId,
        underDevelopment: !tool.underDevelopment,
      });
    },
    [updateResource]
  );

  const getAdminActions = useCallback(
    (tool: NormalizedTool): AdminAction[] => {
      return [
        {
          label: tool.underDevelopment
            ? "Make Visible to Client"
            : "Mark Under Development",
          icon: tool.underDevelopment ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Construction className="h-4 w-4" />
          ),
          onClick: () => handleToggleUnderDevelopment(tool),
        },
        {
          label: tool.isActive ? "Archive" : "Unarchive",
          icon: tool.isActive ? (
            <Archive className="h-4 w-4" />
          ) : (
            <ArchiveRestore className="h-4 w-4" />
          ),
          onClick: () => handleArchive(tool),
        },
        {
          label: "Assign to Project",
          icon: <FolderOpen className="h-4 w-4" />,
          onClick: () => setAssignDialog({ open: true, tool }),
        },
        {
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => setDeleteDialog({ open: true, tool }),
          variant: "danger" as const,
        },
      ];
    },
    [handleArchive, handleToggleUnderDevelopment]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold">Access Denied</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Portal not found
      </div>
    );
  }

  const hasContent = allTools.length > 0;
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all";

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Tooling</h1>
        <p className="text-gray-400">
          Resources, integrations, and developer tools for your projects.
        </p>
      </div>

      {/* Admin tabs */}
      {isAdmin && hasContent && (
        <StatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeTools.length}
          archivedCount={archivedTools.length}
        />
      )}

      {/* Search/Filter Bar — no sort dropdown, columns handle sorting */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tools..."
        filterOptions={projectFilters}
        selectedFilter={selectedProject}
        onFilterChange={(id) =>
          setSelectedProject(id as number | "all" | "unassigned")
        }
        filterLabel="Project"
      />

      {resourcesLoading ? (
        <div className="overflow-x-auto rounded-lg border" style={borderStyle}>
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b px-4 py-4"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Wrench className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No tools configured yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            API keys, documentation, and integrations will appear here.
          </p>
        </div>
      ) : !sortedTools.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Wrench className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-gray-500">
            {activeTab === "archived"
              ? "No archived tools."
              : "No tools match your search."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedProject("all");
              }}
              className="mt-3 text-sm text-[#D4AF37] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-lg border bg-white/5"
          style={borderStyle}
        >
          <table className="w-full text-left text-sm text-gray-400">
            <thead>
              <tr
                className="border-b text-xs font-medium tracking-wider text-gray-500 uppercase"
                style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <th className="w-10 px-4 py-3" />
                <SortHeader
                  field="title"
                  label="Title"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="type"
                  label="Type"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="project"
                  label="Project"
                  sorts={sorts}
                  onSort={handleSort}
                />
                {isAdmin && (
                  <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                    Status
                  </th>
                )}
                <SortHeader
                  field="createdAt"
                  label="Created"
                  sorts={sorts}
                  onSort={handleSort}
                />
                {isAdmin && <th className="w-12 px-2 py-3" />}
              </tr>
            </thead>
            <tbody>
              {sortedTools.map((tool) => (
                <tr
                  key={tool.id}
                  className={`border-b transition-colors ${
                    tool.subscriptionActive
                      ? "cursor-pointer hover:bg-white/5"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  onClick={() => {
                    if (tool.url && tool.subscriptionActive) {
                      window.open(tool.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  {/* Icon */}
                  <td className="px-4 py-3">
                    <span
                      style={{
                        color: tool.subscriptionActive ? "#D4AF37" : "#6b7280",
                      }}
                    >
                      {getResourceIcon(tool)}
                    </span>
                  </td>

                  {/* Title + description */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{tool.title}</p>
                    {tool.description && (
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {tool.description}
                      </p>
                    )}
                    {!tool.subscriptionActive && (
                      <p className="mt-0.5 text-xs text-red-400/80">
                        Subscription required
                      </p>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">
                      {tool.type ?? "—"}
                    </span>
                  </td>

                  {/* Project */}
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs text-gray-500">
                      {tool.projectName || "Unassigned"}
                    </span>
                  </td>

                  {/* Status (admin only) */}
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {tool.underDevelopment && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                            <Construction className="h-3 w-3" />
                            WIP
                          </span>
                        )}
                        {!tool.isActive && (
                          <span className="inline-flex rounded-full bg-gray-500/20 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                            Archived
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Created */}
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs text-gray-500">
                      {formatDate(tool.createdAt)}
                    </span>
                  </td>

                  {/* Actions (admin only) */}
                  {isAdmin && (
                    <td
                      className="px-2 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AdminActionMenu actions={getAdminActions(tool)} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* URL hint */}
      {sortedTools.length > 0 && (
        <p className="mt-2 flex items-center gap-1 text-xs text-gray-600">
          <ExternalLink className="h-3 w-3" />
          Click a row to open the tool
        </p>
      )}

      {/* Project Assignment Dialog */}
      <ProjectAssignDialog
        open={assignDialog.open}
        onOpenChange={(open) =>
          setAssignDialog({ open, tool: open ? assignDialog.tool : null })
        }
        currentProjectId={assignDialog.tool?.projectId ?? null}
        projects={projects ?? []}
        onAssign={handleAssign}
        onCreateProject={handleCreateProject}
        isLoading={updateResource.isPending || createProject.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, tool: open ? deleteDialog.tool : null })
        }
        title="Delete Tool"
        description={`Are you sure you want to permanently delete "${deleteDialog.tool?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteDialog.tool && handleDelete(deleteDialog.tool)}
        isLoading={deleteResource.isPending}
      />
    </>
  );
}
