"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type UpdateWithProject = ClientUpdate & { projectName: string; projectId: number };
type Resource = RouterOutputs["portal"]["getResources"][number];

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
import { Monitor, Loader2, AlertCircle, Search, Archive, ArchiveRestore, FolderOpen, Trash2, Construction, Eye } from "lucide-react";

interface NormalizedDemo {
  id: string;
  resourceId: number | null; // null for legacy demos
  title: string;
  description: string | null;
  url: string | null;
  projectId: number | null;
  projectName: string;
  createdAt: Date | string;
  isActive: boolean;
  underDevelopment: boolean;
  isLegacy: boolean;
}

export default function PortalDemosPage({
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

  // Admin sees all resources (no isActive filter); clients see only active
  const { data: resources, isLoading: resourcesLoading } = api.portal.getResources.useQuery(
    { slug, section: "demos", ...(isAdmin ? {} : { isActive: true }) },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin, staleTime: 5 * 60 * 1000 }
  );

  // Mutations
  const updateResource = api.portal.updateResource.useMutation({
    onSuccess: (_, variables) => {
      if (variables.isActive === false) toast.success("Demo archived");
      else if (variables.isActive === true) toast.success("Demo restored");
      else if (variables.underDevelopment === true) toast.success("Demo marked as under development");
      else if (variables.underDevelopment === false) toast.success("Demo is now visible to clients");
      else if (variables.projectId !== undefined) toast.success("Project assigned");
      void utils.portal.getResources.invalidate();
    },
  });
  const deleteResource = api.portal.deleteResource.useMutation({
    onSuccess: () => {
      toast.success("Demo deleted");
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
  const { getState, setState: persistState } = useTabFilters("demos");
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
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; demo: NormalizedDemo | null }>({
    open: false,
    demo: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; demo: NormalizedDemo | null }>({
    open: false,
    demo: null,
  });

  // Process legacy demos
  const legacyDemos = useMemo(() => {
    if (!client) return [];
    return client.projects.flatMap((p: ClientProject) =>
      p.updates
        .filter((u: ClientUpdate) => u.type === "demo")
        .map((u: ClientUpdate) => ({ ...u, projectName: p.name, projectId: p.id }))
    );
  }, [client]);

  // Combine and normalize all demos
  const allDemos: NormalizedDemo[] = useMemo(() => {
    const demos: NormalizedDemo[] = [];

    resources?.forEach((r: Resource) => {
      demos.push({
        id: `r-${r.id}`,
        resourceId: r.id,
        title: r.title,
        description: r.description,
        url: r.url,
        projectId: r.project?.id ?? null,
        projectName: r.project?.name ?? "",
        createdAt: r.createdAt,
        isActive: r.isActive ?? true,
        underDevelopment: r.underDevelopment ?? false,
        isLegacy: false,
      });
    });

    legacyDemos.forEach((d: UpdateWithProject) => {
      demos.push({
        id: `d-${d.id}`,
        resourceId: null,
        title: d.title,
        description: null,
        url: null,
        projectId: d.projectId,
        projectName: d.projectName,
        createdAt: d.createdAt,
        isActive: true,
        underDevelopment: false,
        isLegacy: true,
      });
    });

    return demos;
  }, [resources, legacyDemos]);

  // Split by active/archived
  const activeDemos = useMemo(() => allDemos.filter((d) => d.isActive), [allDemos]);
  const archivedDemos = useMemo(() => allDemos.filter((d) => !d.isActive), [allDemos]);
  const currentDemos = activeTab === "active" ? activeDemos : archivedDemos;

  // Project filters — include "Unassigned" when there are unassigned items
  const hasUnassigned = currentDemos.some((d) => d.projectId === null);
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
    if (hasUnassigned) {
      filters.push({ id: "unassigned", name: "Unassigned" });
    }
    return filters;
  }, [client, resources, projects, hasUnassigned]);

  // Filter demos
  const filteredDemos = useMemo(() => {
    return currentDemos.filter((demo) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = demo.title.toLowerCase().includes(query);
        const matchesDesc = demo.description?.toLowerCase().includes(query);
        const matchesProject = demo.projectName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }
      if (selectedProject === "unassigned") return demo.projectId === null;
      if (selectedProject !== "all" && demo.projectId !== selectedProject) return false;
      return true;
    });
  }, [currentDemos, searchQuery, selectedProject]);

  // Sort demos
  const sortedDemos = useMemo(() => {
    return [...filteredDemos].sort((a, b) => {
      if (sortOrder === "name") return a.title.localeCompare(b.title);
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredDemos, sortOrder]);

  // Group by project
  const groupedDemos = useMemo(() => {
    const groups = new Map<string, NormalizedDemo[]>();
    for (const demo of sortedDemos) {
      const key = demo.projectName || "Unassigned";
      const group = groups.get(key) ?? [];
      group.push(demo);
      groups.set(key, group);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });
  }, [sortedDemos]);

  // Show grouping: grouped mode + "all" filter + multiple groups (or single named group)
  const showGrouping =
    viewMode === "grouped" &&
    selectedProject === "all" &&
    (groupedDemos.length > 1 ||
      (groupedDemos.length === 1 && groupedDemos[0]![0] !== "Unassigned"));

  // Expand/collapse all
  const handleExpandAll = useCallback(() => setCollapsedGroups(new Set()), []);
  const handleCollapseAll = useCallback(() => {
    setCollapsedGroups(new Set(groupedDemos.map(([name]) => name)));
  }, [groupedDemos]);

  // Admin actions
  const handleArchive = useCallback(
    (demo: NormalizedDemo) => {
      if (!demo.resourceId) return;
      updateResource.mutate({ id: demo.resourceId, isActive: !demo.isActive });
    },
    [updateResource]
  );

  const handleDelete = useCallback(
    (demo: NormalizedDemo) => {
      if (!demo.resourceId) return;
      deleteResource.mutate({ id: demo.resourceId });
      setDeleteDialog({ open: false, demo: null });
    },
    [deleteResource]
  );

  const handleAssign = useCallback(
    (projectId: number | null) => {
      if (!assignDialog.demo?.resourceId) return;
      updateResource.mutate({ id: assignDialog.demo.resourceId, projectId });
    },
    [assignDialog.demo, updateResource]
  );

  const handleCreateProject = useCallback(
    (name: string) => {
      createProject.mutate({ slug, name });
    },
    [createProject, slug]
  );

  const handleToggleUnderDevelopment = useCallback(
    (demo: NormalizedDemo) => {
      if (!demo.resourceId) return;
      updateResource.mutate({ id: demo.resourceId, underDevelopment: !demo.underDevelopment });
    },
    [updateResource]
  );

  const getAdminActions = useCallback(
    (demo: NormalizedDemo): AdminAction[] => {
      if (demo.isLegacy) return [];
      return [
        {
          label: demo.underDevelopment ? "Make Visible to Client" : "Mark Under Development",
          icon: demo.underDevelopment ? <Eye className="h-4 w-4" /> : <Construction className="h-4 w-4" />,
          onClick: () => handleToggleUnderDevelopment(demo),
        },
        {
          label: demo.isActive ? "Archive" : "Unarchive",
          icon: demo.isActive ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />,
          onClick: () => handleArchive(demo),
        },
        {
          label: "Assign to Project",
          icon: <FolderOpen className="h-4 w-4" />,
          onClick: () => setAssignDialog({ open: true, demo }),
        },
        {
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => setDeleteDialog({ open: true, demo }),
          variant: "danger" as const,
        },
      ];
    },
    [handleArchive, handleToggleUnderDevelopment]
  );

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProject("all");
    setSortOrder("newest");
  };

  const hasContent = allDemos.length > 0;
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all" || sortOrder !== "newest";

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

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Demos</h1>
        <p className="text-gray-400">
          Interactive previews and proof-of-concept builds for your projects.
        </p>
      </div>

      {/* Admin tabs */}
      {isAdmin && hasContent && (
        <StatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeDemos.length}
          archivedCount={archivedDemos.length}
        />
      )}

      {/* Search/Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search demos..."
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
            : collapsedGroups.size >= groupedDemos.length
              ? "all-collapsed"
              : "mixed"
        }
      />

      {resourcesLoading ? (
        <ListItemSkeletonGroup count={5} />
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Monitor className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No demos yet. Check back soon!</p>
        </div>
      ) : (
        <ListContainer
          emptyIcon={<Search className="h-12 w-12" />}
          emptyMessage={
            activeTab === "archived"
              ? "No archived demos."
              : "No demos match your search."
          }
          onClearFilters={clearFilters}
          showClearFilters={hasActiveFilters}
        >
          {showGrouping
            ? groupedDemos.map(([groupName, demos]) => (
                <div key={groupName}>
                  <ProjectGroupHeader
                    projectName={groupName}
                    itemCount={demos.length}
                    collapsed={collapsedGroups.has(groupName)}
                    onToggle={() => toggleGroup(groupName)}
                  />
                  {!collapsedGroups.has(groupName) &&
                    demos.map((demo) => (
                      <div key={demo.id} className="mb-3">
                        <ListItem
                          icon={<Monitor className="h-5 w-5" />}
                          title={demo.title}
                          description={demo.description}
                          date={demo.createdAt}
                          secondaryText={demo.projectName || "Unassigned"}
                          href={demo.url}
                          badge={
                            isAdmin && demo.underDevelopment ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                                <Construction className="h-3 w-3" />
                                WIP
                              </span>
                            ) : undefined
                          }
                          actions={
                            isAdmin && !demo.isLegacy ? (
                              <AdminActionMenu actions={getAdminActions(demo)} />
                            ) : undefined
                          }
                        />
                      </div>
                    ))}
                </div>
              ))
            : sortedDemos.map((demo) => (
                <ListItem
                  key={demo.id}
                  icon={<Monitor className="h-5 w-5" />}
                  title={demo.title}
                  description={demo.description}
                  date={demo.createdAt}
                  secondaryText={demo.projectName || "Unassigned"}
                  href={demo.url}
                  badge={
                    isAdmin && demo.underDevelopment ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                        <Construction className="h-3 w-3" />
                        WIP
                      </span>
                    ) : undefined
                  }
                  actions={
                    isAdmin && !demo.isLegacy ? (
                      <AdminActionMenu actions={getAdminActions(demo)} />
                    ) : undefined
                  }
                />
              ))}
        </ListContainer>
      )}

      {/* Project Assignment Dialog */}
      <ProjectAssignDialog
        open={assignDialog.open}
        onOpenChange={(open) => setAssignDialog({ open, demo: open ? assignDialog.demo : null })}
        currentProjectId={assignDialog.demo?.projectId ?? null}
        projects={projects ?? []}
        onAssign={handleAssign}
        onCreateProject={handleCreateProject}
        isLoading={updateResource.isPending || createProject.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, demo: open ? deleteDialog.demo : null })}
        title="Delete Demo"
        description={`Are you sure you want to permanently delete "${deleteDialog.demo?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteDialog.demo && handleDelete(deleteDialog.demo)}
        isLoading={deleteResource.isPending}
      />
    </ClientPortalLayout>
  );
}
