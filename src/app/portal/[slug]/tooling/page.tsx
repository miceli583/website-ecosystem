"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import {
  SearchFilterBar,
  ListItem,
  ListContainer,
  StatusTabs,
  AdminActionMenu,
  ProjectGroupHeader,
  ProjectAssignDialog,
  ConfirmDialog,
  ListItemSkeletonGroup,
  type SortOrder,
  type ViewMode,
  type FilterOption,
  type AdminAction,
  useTabFilters,
} from "~/components/portal";
import {
  Wrench,
  Loader2,
  AlertCircle,
  Key,
  Book,
  Code,
  Link as LinkIcon,
  FileText,
  Search,
  Archive,
  ArchiveRestore,
  FolderOpen,
  Trash2,
  Construction,
  Eye,
} from "lucide-react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type Resource = RouterOutputs["portal"]["getResources"][number];

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
    link: <LinkIcon className="h-5 w-5" />,
    key: <Key className="h-5 w-5" />,
    book: <Book className="h-5 w-5" />,
    code: <Code className="h-5 w-5" />,
    file: <FileText className="h-5 w-5" />,
    wrench: <Wrench className="h-5 w-5" />,
  };

  if (tool.icon && iconMap[tool.icon]) {
    return iconMap[tool.icon];
  }

  switch (tool.type) {
    case "credential":
      return <Key className="h-5 w-5" />;
    case "embed":
      return <Code className="h-5 w-5" />;
    case "file":
      return <FileText className="h-5 w-5" />;
    default:
      return <LinkIcon className="h-5 w-5" />;
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
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  // Admin sees all resources; clients see only active
  const { data: resources, isLoading: resourcesLoading } = api.portal.getResources.useQuery(
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
      else if (variables.underDevelopment === true) toast.success("Tool marked as under development");
      else if (variables.underDevelopment === false) toast.success("Tool is now visible to clients");
      else if (variables.projectId !== undefined) toast.success("Project assigned");
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
  const [activeTab, setActiveTab] = useState<"active" | "archived">(saved.activeTab ?? "active");
  const [searchQuery, setSearchQuery] = useState(saved.searchQuery);
  const [selectedProject, setSelectedProject] = useState<number | "all" | "unassigned">(
    saved.selectedProject as number | "all" | "unassigned",
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(saved.sortOrder);
  const [viewMode, setViewMode] = useState<ViewMode>(saved.viewMode);

  // Collapsed project groups
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(saved.collapsedGroups),
  );

  useEffect(() => {
    persistState({
      searchQuery, sortOrder, selectedProject, viewMode,
      collapsedGroups: Array.from(collapsedGroups), activeTab,
    });
  }, [searchQuery, sortOrder, selectedProject, viewMode, collapsedGroups, activeTab, persistState]);
  const toggleGroup = useCallback((groupName: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  }, []);

  // Dialog state
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; tool: NormalizedTool | null }>({
    open: false,
    tool: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; tool: NormalizedTool | null }>({
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

    const filters: FilterOption[] = Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
    if (allTools.some((t) => t.projectId === null)) {
      filters.push({ id: "unassigned", name: "Unassigned" });
    }
    return filters;
  }, [client, resources, projects, allTools]);

  // Split by active/archived
  const activeTools = useMemo(() => allTools.filter((t) => t.isActive), [allTools]);
  const archivedTools = useMemo(() => allTools.filter((t) => !t.isActive), [allTools]);
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
      if (selectedProject !== "all" && tool.projectId !== selectedProject) return false;
      return true;
    });
  }, [currentTools, searchQuery, selectedProject]);

  // Sort
  const sortedTools = useMemo(() => {
    return [...filteredTools].sort((a, b) => {
      if (sortOrder === "name") {
        return a.title.localeCompare(b.title);
      }
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredTools, sortOrder]);

  // Group by project
  const groupedTools = useMemo(() => {
    const groups = new Map<string, NormalizedTool[]>();
    for (const tool of sortedTools) {
      const key = tool.projectName || "Unassigned";
      const group = groups.get(key) ?? [];
      group.push(tool);
      groups.set(key, group);
    }
    const sorted = Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });
    return sorted;
  }, [sortedTools]);

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
      createProject.mutate({ slug, name });
    },
    [createProject, slug]
  );

  const handleToggleUnderDevelopment = useCallback(
    (tool: NormalizedTool) => {
      updateResource.mutate({ id: tool.resourceId, underDevelopment: !tool.underDevelopment });
    },
    [updateResource]
  );

  const getAdminActions = useCallback(
    (tool: NormalizedTool): AdminAction[] => {
      return [
        {
          label: tool.underDevelopment ? "Make Visible to Client" : "Mark Under Development",
          icon: tool.underDevelopment ? <Eye className="h-4 w-4" /> : <Construction className="h-4 w-4" />,
          onClick: () => handleToggleUnderDevelopment(tool),
        },
        {
          label: tool.isActive ? "Archive" : "Unarchive",
          icon: tool.isActive ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />,
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

  // Expand/collapse all
  const handleExpandAll = useCallback(() => setCollapsedGroups(new Set()), []);
  const handleCollapseAll = useCallback(() => {
    setCollapsedGroups(new Set(groupedTools.map(([name]) => name)));
  }, [groupedTools]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProject("all");
    setSortOrder("newest");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
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
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all" || sortOrder !== "newest";
  const showGrouping =
    viewMode === "grouped" &&
    selectedProject === "all" &&
    (groupedTools.length > 1 ||
      (groupedTools.length === 1 && groupedTools[0]![0] !== "Unassigned"));

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
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

      {/* Search/Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tools..."
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        filterOptions={projectFilters}
        selectedFilter={selectedProject}
        onFilterChange={(id) => setSelectedProject(id as number | "all" | "unassigned")}
        filterLabel="Project"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        collapseState={
          collapsedGroups.size === 0
            ? "all-expanded"
            : collapsedGroups.size >= groupedTools.length
              ? "all-collapsed"
              : "mixed"
        }
      />

      {resourcesLoading ? (
        <ListItemSkeletonGroup count={5} />
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Wrench className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No tools configured yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            API keys, documentation, and integrations will appear here.
          </p>
        </div>
      ) : (
        <ListContainer
          emptyIcon={<Search className="h-12 w-12" />}
          emptyMessage={
            activeTab === "archived"
              ? "No archived tools."
              : "No tools match your search."
          }
          onClearFilters={clearFilters}
          showClearFilters={hasActiveFilters}
        >
          {showGrouping
            ? groupedTools.map(([groupName, tools]) => (
                <div key={groupName}>
                  <ProjectGroupHeader
                    projectName={groupName}
                    itemCount={tools.length}
                    collapsed={collapsedGroups.has(groupName)}
                    onToggle={() => toggleGroup(groupName)}
                  />
                  {!collapsedGroups.has(groupName) &&
                    tools.map((tool) => (
                      <div key={tool.id} className="mb-3">
                        <ListItem
                          icon={getResourceIcon(tool)}
                          title={tool.title}
                          description={tool.description}
                          date={tool.createdAt}
                          secondaryText={tool.projectName || "Unassigned"}
                          href={tool.url}
                          badge={
                            isAdmin && tool.underDevelopment ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                                <Construction className="h-3 w-3" />
                                WIP
                              </span>
                            ) : undefined
                          }
                          disabled={!tool.subscriptionActive}
                          disabledMessage="Subscription required"
                          actions={
                            isAdmin ? (
                              <AdminActionMenu actions={getAdminActions(tool)} />
                            ) : undefined
                          }
                        />
                      </div>
                    ))}
                </div>
              ))
            : sortedTools.map((tool) => (
                <ListItem
                  key={tool.id}
                  icon={getResourceIcon(tool)}
                  title={tool.title}
                  description={tool.description}
                  date={tool.createdAt}
                  secondaryText={tool.projectName || "Unassigned"}
                  href={tool.url}
                  badge={
                    isAdmin && tool.underDevelopment ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                        <Construction className="h-3 w-3" />
                        WIP
                      </span>
                    ) : undefined
                  }
                  disabled={!tool.subscriptionActive}
                  disabledMessage="Subscription required"
                  actions={
                    isAdmin ? (
                      <AdminActionMenu actions={getAdminActions(tool)} />
                    ) : undefined
                  }
                />
              ))}
        </ListContainer>
      )}

      {/* Project Assignment Dialog */}
      <ProjectAssignDialog
        open={assignDialog.open}
        onOpenChange={(open) => setAssignDialog({ open, tool: open ? assignDialog.tool : null })}
        currentProjectId={assignDialog.tool?.projectId ?? null}
        projects={projects ?? []}
        onAssign={handleAssign}
        onCreateProject={handleCreateProject}
        isLoading={updateResource.isPending || createProject.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, tool: open ? deleteDialog.tool : null })}
        title="Delete Tool"
        description={`Are you sure you want to permanently delete "${deleteDialog.tool?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteDialog.tool && handleDelete(deleteDialog.tool)}
        isLoading={deleteResource.isPending}
      />
    </ClientPortalLayout>
  );
}
