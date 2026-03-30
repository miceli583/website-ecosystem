"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type UpdateWithProject = ClientUpdate & {
  projectName: string;
  projectId: number;
};
type Resource = RouterOutputs["portal"]["getResources"][number];

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
  Monitor,
  Loader2,
  AlertCircle,
  Archive,
  ArchiveRestore,
  FolderOpen,
  Trash2,
  Construction,
  Eye,
  Share2,
  EyeOff,
  Link2,
  Globe,
  ExternalLink,
  Pencil,
} from "lucide-react";

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

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
  isPublic: boolean;
  publicToken: string | null;
  publicSlug: string | null;
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

function SlugEditDialog({
  demo,
  slugInput,
  onSlugChange,
  onSave,
  onClose,
  isPending,
}: {
  demo: NormalizedDemo;
  slugInput: string;
  onSlugChange: (v: string) => void;
  onSave: (resourceId: number, slug: string | null) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const isValid =
    slugInput === "" ||
    (slugInput.length >= 3 &&
      slugInput.length <= 60 &&
      SLUG_REGEX.test(slugInput));
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border p-6"
        style={{
          backgroundColor: "#111",
          borderColor: "rgba(212, 175, 55, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-1 text-lg font-semibold text-white">
          Custom Share Slug
        </h3>
        <p className="mb-4 text-sm text-gray-400">
          Set a human-readable URL for &ldquo;{demo.title}&rdquo;
        </p>

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-gray-400">
            Slug
          </label>
          <input
            type="text"
            value={slugInput}
            onChange={(e) =>
              onSlugChange(
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
              )
            }
            placeholder="e.g. tapchw-demo"
            className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-1"
            style={{
              borderColor:
                !isValid && slugInput
                  ? "rgba(239, 68, 68, 0.5)"
                  : "rgba(212, 175, 55, 0.2)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(212, 175, 55, 0.5)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor =
                slugInput && !isValid
                  ? "rgba(239, 68, 68, 0.5)"
                  : "rgba(212, 175, 55, 0.2)";
            }}
          />
          {!isValid && slugInput && (
            <p className="mt-1 text-xs text-red-400">
              3-60 chars, lowercase letters, numbers, and hyphens. Cannot start
              or end with a hyphen.
            </p>
          )}
        </div>

        {/* URL preview */}
        <div
          className="mb-4 rounded-lg border px-3 py-2"
          style={{
            borderColor: "rgba(212, 175, 55, 0.1)",
            backgroundColor: "rgba(212, 175, 55, 0.05)",
          }}
        >
          <p className="text-xs text-gray-500">Share URL</p>
          <p
            className="truncate font-mono text-sm"
            style={{ color: "#D4AF37" }}
          >
            {origin}/s/{slugInput || demo.publicToken || "..."}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (!demo.resourceId) return;
              onSave(demo.resourceId, null);
            }}
            disabled={!demo.publicSlug || isPending}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            Clear Slug
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!demo.resourceId || !isValid || !slugInput) return;
                onSave(demo.resourceId, slugInput);
              }}
              disabled={
                !isValid ||
                !slugInput ||
                isPending ||
                slugInput === demo.publicSlug
              }
              className="rounded-lg px-4 py-1.5 text-sm font-medium text-black transition-opacity disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #F6E6C1, #D4AF37)",
              }}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortalDemosPage({
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
      else if (variables.underDevelopment === true)
        toast.success("Demo marked as under development");
      else if (variables.underDevelopment === false)
        toast.success("Demo is now visible to clients");
      else if (variables.projectId !== undefined)
        toast.success("Project assigned");
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
  const togglePublic = api.portal.toggleDemoPublic.useMutation({
    onSuccess: (data) => {
      if (data.isPublic && data.publicToken) {
        const shareUrl = `${window.location.origin}/s/${data.publicSlug ?? data.publicToken}`;
        void navigator.clipboard.writeText(shareUrl);
        toast.success("Demo is now public. Share link copied!");
      } else {
        toast.success("Demo is now private");
      }
      void utils.portal.getResources.invalidate();
    },
  });
  const setPublicSlug = api.portal.setPublicSlug.useMutation({
    onSuccess: (data) => {
      if (data.publicSlug) {
        toast.success(`Custom slug set: /s/${data.publicSlug}`);
      } else {
        toast.success("Custom slug removed");
      }
      void utils.portal.getResources.invalidate();
      setSlugDialog({ open: false, demo: null });
    },
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("This slug is already in use");
      } else {
        toast.error(err.message);
      }
    },
  });

  // Persisted filter state
  const { getState, setState: persistState } = useTabFilters("demos");
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
    demo: NormalizedDemo | null;
  }>({
    open: false,
    demo: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    demo: NormalizedDemo | null;
  }>({
    open: false,
    demo: null,
  });
  const [slugDialog, setSlugDialog] = useState<{
    open: boolean;
    demo: NormalizedDemo | null;
  }>({
    open: false,
    demo: null,
  });
  const [slugInput, setSlugInput] = useState("");

  // Process legacy demos
  const legacyDemos = useMemo(() => {
    if (!client) return [];
    return client.projects.flatMap((p: ClientProject) =>
      p.updates
        .filter((u: ClientUpdate) => u.type === "demo")
        .map((u: ClientUpdate) => ({
          ...u,
          projectName: p.name,
          projectId: p.id,
        }))
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
        isPublic: r.isPublic ?? false,
        publicToken: r.publicToken ?? null,
        publicSlug: r.publicSlug ?? null,
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
        isPublic: false,
        publicToken: null,
        publicSlug: null,
      });
    });

    return demos;
  }, [resources, legacyDemos]);

  // Split by active/archived
  const activeDemos = useMemo(
    () => allDemos.filter((d) => d.isActive),
    [allDemos]
  );
  const archivedDemos = useMemo(
    () => allDemos.filter((d) => !d.isActive),
    [allDemos]
  );
  const currentDemos = activeTab === "active" ? activeDemos : archivedDemos;

  // Project filters
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

    const filters: FilterOption[] = Array.from(projectMap.entries()).map(
      ([id, name]) => ({ id, name })
    );
    if (hasUnassigned) {
      filters.push({ id: "unassigned", name: "Unassigned" });
    }
    return filters;
  }, [client, resources, projects, hasUnassigned]);

  // Filter
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
      if (selectedProject !== "all" && demo.projectId !== selectedProject)
        return false;
      return true;
    });
  }, [currentDemos, searchQuery, selectedProject]);

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

  const sortedDemos = useMemo(() => {
    if (!sorts.length) return filteredDemos;
    return [...filteredDemos].sort((a, b) => {
      for (const { field, order } of sorts) {
        let cmp = 0;
        const dir = order === "asc" ? 1 : -1;
        switch (field) {
          case "title":
            cmp = a.title.localeCompare(b.title);
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
  }, [filteredDemos, sorts]);

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
      return createProject.mutateAsync({ slug, name });
    },
    [createProject, slug]
  );

  const handleToggleUnderDevelopment = useCallback(
    (demo: NormalizedDemo) => {
      if (!demo.resourceId) return;
      updateResource.mutate({
        id: demo.resourceId,
        underDevelopment: !demo.underDevelopment,
      });
    },
    [updateResource]
  );

  const getDemoActions = useCallback(
    (demo: NormalizedDemo): AdminAction[] => {
      if (demo.isLegacy) return [];
      const actions: AdminAction[] = [];

      // Sharing actions — available to both admin and client
      if (demo.resourceId) {
        actions.push({
          label: demo.isPublic ? "Make Private" : "Make Public",
          icon: demo.isPublic ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          ),
          onClick: () =>
            togglePublic.mutate({
              resourceId: demo.resourceId!,
              isPublic: !demo.isPublic,
            }),
        });
        if (demo.isPublic && demo.publicToken) {
          const shareIdentifier = demo.publicSlug ?? demo.publicToken;
          actions.push({
            label: "Copy Share Link",
            icon: <Link2 className="h-4 w-4" />,
            onClick: () => {
              const shareUrl = `${window.location.origin}/s/${shareIdentifier}`;
              void navigator.clipboard.writeText(shareUrl);
              toast.success("Share link copied!");
            },
          });
        }
      }

      // Admin-only actions
      if (isAdmin) {
        if (demo.isPublic && demo.resourceId) {
          actions.push({
            label: demo.publicSlug ? "Edit Custom Slug" : "Set Custom Slug",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => {
              setSlugInput(demo.publicSlug ?? "");
              setSlugDialog({ open: true, demo });
            },
          });
        }
        actions.push(
          {
            label: demo.underDevelopment
              ? "Make Visible to Client"
              : "Mark Under Development",
            icon: demo.underDevelopment ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Construction className="h-4 w-4" />
            ),
            onClick: () => handleToggleUnderDevelopment(demo),
          },
          {
            label: demo.isActive ? "Archive" : "Unarchive",
            icon: demo.isActive ? (
              <Archive className="h-4 w-4" />
            ) : (
              <ArchiveRestore className="h-4 w-4" />
            ),
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
          }
        );
      }

      return actions;
    },
    [handleArchive, handleToggleUnderDevelopment, isAdmin, togglePublic]
  );

  const hasContent = allDemos.length > 0;
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all";

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

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

  return (
    <>
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

      {/* Search/Filter Bar — no sort dropdown, columns handle sorting */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search demos..."
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
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Monitor className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No demos yet. Check back soon!</p>
        </div>
      ) : !sortedDemos.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Monitor className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-gray-500">
            {activeTab === "archived"
              ? "No archived demos."
              : "No demos match your search."}
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
                <SortHeader
                  field="title"
                  label="Title"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="project"
                  label="Project"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                  Badges
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                  Share
                </th>
                <SortHeader
                  field="createdAt"
                  label="Created"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <th className="w-12 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {sortedDemos.map((demo) => (
                <tr
                  key={demo.id}
                  className="cursor-pointer border-b transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  onClick={() => {
                    if (demo.url) {
                      window.open(demo.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  {/* Title + description */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Monitor
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: "#D4AF37" }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-white">{demo.title}</p>
                        {demo.description && (
                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {demo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Project */}
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs text-gray-500">
                      {demo.projectName || "Unassigned"}
                    </span>
                  </td>

                  {/* Badges */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {isAdmin && demo.underDevelopment && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                          <Construction className="h-3 w-3" />
                          WIP
                        </span>
                      )}
                      {demo.isPublic && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: "rgba(212, 175, 55, 0.15)",
                            color: "#D4AF37",
                          }}
                        >
                          <Globe className="h-3 w-3" />
                          Public
                        </span>
                      )}
                      {demo.isLegacy && (
                        <span className="inline-flex rounded-full bg-gray-500/20 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                          Legacy
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Share */}
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {demo.isPublic && demo.publicToken && (
                      <button
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/s/${demo.publicSlug ?? demo.publicToken}`;
                          void navigator.clipboard.writeText(shareUrl);
                          toast.success("Share link copied!");
                        }}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors hover:bg-white/10"
                        style={{
                          borderColor: "rgba(212, 175, 55, 0.3)",
                          color: "#D4AF37",
                        }}
                      >
                        <Share2 className="h-3 w-3" />
                        Copy
                      </button>
                    )}
                  </td>

                  {/* Created */}
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-xs text-gray-500">
                      {formatDate(demo.createdAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td
                    className="px-2 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!demo.isLegacy && (
                      <AdminActionMenu actions={getDemoActions(demo)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* URL hint */}
      {sortedDemos.length > 0 && (
        <p className="mt-2 flex items-center gap-1 text-xs text-gray-600">
          <ExternalLink className="h-3 w-3" />
          Click a row to open the demo
        </p>
      )}

      {/* Project Assignment Dialog */}
      <ProjectAssignDialog
        open={assignDialog.open}
        onOpenChange={(open) =>
          setAssignDialog({ open, demo: open ? assignDialog.demo : null })
        }
        currentProjectId={assignDialog.demo?.projectId ?? null}
        projects={projects ?? []}
        onAssign={handleAssign}
        onCreateProject={handleCreateProject}
        isLoading={updateResource.isPending || createProject.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, demo: open ? deleteDialog.demo : null })
        }
        title="Delete Demo"
        description={`Are you sure you want to permanently delete "${deleteDialog.demo?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteDialog.demo && handleDelete(deleteDialog.demo)}
        isLoading={deleteResource.isPending}
      />

      {/* Custom Slug Dialog */}
      {slugDialog.open && slugDialog.demo && (
        <SlugEditDialog
          demo={slugDialog.demo}
          slugInput={slugInput}
          onSlugChange={setSlugInput}
          onSave={(resourceId, slug) =>
            setPublicSlug.mutate({ resourceId, slug })
          }
          onClose={() => setSlugDialog({ open: false, demo: null })}
          isPending={setPublicSlug.isPending}
        />
      )}
    </>
  );
}
