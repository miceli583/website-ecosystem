"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type ClientAgreement = ClientBySlug["agreements"][number];
type Proposal = RouterOutputs["portal"]["getProposals"][number];
type Resource = RouterOutputs["portal"]["getResources"][number];

import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  SearchFilterBar,
  StatusTabs,
  AdminActionMenu,
  ProjectAssignDialog,
  ConfirmDialog,
  ProposalModal,
  type FilterOption,
  type AdminAction,
  type ProposalMetadata,
  useTabFilters,
} from "~/components/portal";
import { SortHeader, type SortLevel } from "~/components/crm/sort-header";
import {
  FileText,
  Loader2,
  AlertCircle,
  Check,
  Clock,
  X,
  Archive,
  ArchiveRestore,
  FolderOpen,
  Trash2,
  Construction,
  Eye,
  Lock,
  Unlock,
} from "lucide-react";

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

function getStatusIcon(status: string) {
  switch (status) {
    case "accepted":
      return <Check className="h-3.5 w-3.5 text-green-400" />;
    case "sent":
      return <Clock className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />;
    case "declined":
      return <X className="h-3.5 w-3.5 text-red-400" />;
    default:
      return <FileText className="h-3.5 w-3.5 text-gray-400" />;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "sent":
      return "Pending";
    case "declined":
      return "Declined";
    default:
      return "Draft";
  }
}

function getStatusBgColor(status: string) {
  switch (status) {
    case "accepted":
      return "rgba(74, 222, 128, 0.15)";
    case "sent":
      return "rgba(212, 175, 55, 0.15)";
    case "declined":
      return "rgba(248, 113, 113, 0.15)";
    default:
      return "rgba(255, 255, 255, 0.08)";
  }
}

function getStatusTextColor(status: string) {
  switch (status) {
    case "accepted":
      return "#4ade80";
    case "sent":
      return "#D4AF37";
    case "declined":
      return "#f87171";
    default:
      return "#9ca3af";
  }
}

interface NormalizedProposal {
  id: string;
  resourceId: number | null;
  title: string;
  description: string | null;
  status: string;
  projectId: number | null;
  projectName: string;
  createdAt: Date | string;
  isActive: boolean;
  isPrivate: boolean;
  underDevelopment: boolean;
  isLegacy: boolean;
  metadata: ProposalMetadata | null;
  originalId: number; // for modal lookup
}

export default function PortalProposalsPage({
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
      { slug, section: "proposals", ...(isAdmin ? {} : { isActive: true }) },
      { staleTime: 5 * 60 * 1000 }
    );
  const { data: proposals } = api.portal.getProposals.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin, staleTime: 5 * 60 * 1000 }
  );

  // Mutations
  const updateResource = api.portal.updateResource.useMutation({
    onSuccess: (_, variables) => {
      if (variables.isActive === false) toast.success("Proposal archived");
      else if (variables.isActive === true) toast.success("Proposal restored");
      else if (variables.isPrivate === true)
        toast.success("Proposal is now private");
      else if (variables.isPrivate === false)
        toast.success("Proposal is now public");
      else if (variables.underDevelopment === true)
        toast.success("Proposal marked as under development");
      else if (variables.underDevelopment === false)
        toast.success("Removed under development status");
      else if (variables.projectId !== undefined)
        toast.success("Project assigned");
      void utils.portal.getResources.invalidate();
      void utils.portal.getProposals.invalidate();
    },
  });
  const deleteResource = api.portal.deleteResource.useMutation({
    onSuccess: () => {
      toast.success("Proposal deleted");
      void utils.portal.getResources.invalidate();
      void utils.portal.getProposals.invalidate();
    },
  });
  const createProject = api.portal.createProject.useMutation({
    onSuccess: () => {
      toast.success("Project created");
      void utils.portal.getProjects.invalidate();
    },
  });

  // Persisted filter state
  const { getState, setState: persistState } = useTabFilters("proposals");
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
    saved.sorts ?? [{ field: "createdAt", order: "desc" }]
  );
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
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
    proposal: NormalizedProposal | null;
  }>({
    open: false,
    proposal: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    proposal: NormalizedProposal | null;
  }>({
    open: false,
    proposal: null,
  });

  // Check for Stripe redirect
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const checkoutSuccess = searchParams?.get("success") === "true";
  const checkoutCanceled = searchParams?.get("canceled") === "true";

  // Legacy proposals
  const legacyProposals = useMemo(() => {
    if (!client) return [];
    return client.projects.flatMap((p: ClientProject) =>
      p.updates
        .filter((u: ClientUpdate) => u.type === "proposal")
        .map((u: ClientUpdate) => ({
          ...u,
          projectName: p.name,
          projectId: p.id,
        }))
    );
  }, [client]);

  // Combine and normalize all proposals
  const allProposals: NormalizedProposal[] = useMemo(() => {
    const items: NormalizedProposal[] = [];

    resources?.forEach((r: Resource) => {
      const metadata = r.metadata as ProposalMetadata | null;
      items.push({
        id: `r-${r.id}`,
        resourceId: r.id,
        title: r.title,
        description: r.description,
        status: metadata?.status ?? "draft",
        projectId: r.project?.id ?? null,
        projectName: r.project?.name ?? "",
        createdAt: r.createdAt,
        isActive: r.isActive ?? true,
        isPrivate: (r as any).isPrivate ?? false,
        underDevelopment: r.underDevelopment ?? false,
        isLegacy: false,
        metadata,
        originalId: r.id,
      });
    });

    legacyProposals.forEach(
      (d: ClientUpdate & { projectName: string; projectId: number }) => {
        items.push({
          id: `d-${d.id}`,
          resourceId: null,
          title: d.title,
          description: d.content,
          status: "sent",
          projectId: d.projectId,
          projectName: d.projectName,
          createdAt: d.createdAt,
          isActive: true,
          isPrivate: false,
          underDevelopment: false,
          isLegacy: true,
          metadata: null,
          originalId: d.id,
        });
      }
    );

    return items;
  }, [resources, legacyProposals]);

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
    if (allProposals.some((p) => p.projectId === null)) {
      filters.push({ id: "unassigned", name: "Unassigned" });
    }
    return filters;
  }, [client, resources, projects, allProposals]);

  // Split by active/archived
  const activeProposals = useMemo(
    () => allProposals.filter((p) => p.isActive),
    [allProposals]
  );
  const archivedProposals = useMemo(
    () => allProposals.filter((p) => !p.isActive),
    [allProposals]
  );
  const currentProposals =
    activeTab === "active" ? activeProposals : archivedProposals;

  // Filter
  const filteredProposals = useMemo(() => {
    return currentProposals.filter((proposal) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = proposal.title.toLowerCase().includes(query);
        const matchesDesc = proposal.description?.toLowerCase().includes(query);
        const matchesProject = proposal.projectName
          .toLowerCase()
          .includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }
      if (selectedProject === "unassigned") return proposal.projectId === null;
      if (selectedProject !== "all" && proposal.projectId !== selectedProject)
        return false;
      return true;
    });
  }, [currentProposals, searchQuery, selectedProject]);

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

  const sortedProposals = useMemo(() => {
    if (!sorts.length) return filteredProposals;
    return [...filteredProposals].sort((a, b) => {
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
          case "status":
            cmp = a.status.localeCompare(b.status);
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
  }, [filteredProposals, sorts]);

  // Admin actions
  const handleArchive = useCallback(
    (proposal: NormalizedProposal) => {
      if (!proposal.resourceId) return;
      updateResource.mutate({
        id: proposal.resourceId,
        isActive: !proposal.isActive,
      });
    },
    [updateResource]
  );

  const handleDelete = useCallback(
    (proposal: NormalizedProposal) => {
      if (!proposal.resourceId) return;
      deleteResource.mutate({ id: proposal.resourceId });
      setDeleteDialog({ open: false, proposal: null });
    },
    [deleteResource]
  );

  const handleAssign = useCallback(
    (projectId: number | null) => {
      if (!assignDialog.proposal?.resourceId) return;
      updateResource.mutate({
        id: assignDialog.proposal.resourceId,
        projectId,
      });
    },
    [assignDialog.proposal, updateResource]
  );

  const handleCreateProject = useCallback(
    (name: string) => {
      return createProject.mutateAsync({ slug, name });
    },
    [createProject, slug]
  );

  const handleToggleUnderDevelopment = useCallback(
    (proposal: NormalizedProposal) => {
      if (!proposal.resourceId) return;
      updateResource.mutate({
        id: proposal.resourceId,
        underDevelopment: !proposal.underDevelopment,
      });
    },
    [updateResource]
  );

  const handleTogglePrivate = useCallback(
    (proposal: NormalizedProposal) => {
      if (!proposal.resourceId) return;
      updateResource.mutate({
        id: proposal.resourceId,
        isPrivate: !proposal.isPrivate,
      });
    },
    [updateResource]
  );

  const getAdminActions = useCallback(
    (proposal: NormalizedProposal): AdminAction[] => {
      if (proposal.isLegacy) return [];
      return [
        {
          label: proposal.underDevelopment
            ? "Remove Under Development"
            : "Mark Under Development",
          icon: proposal.underDevelopment ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Construction className="h-4 w-4" />
          ),
          onClick: () => handleToggleUnderDevelopment(proposal),
        },
        {
          label: proposal.isPrivate ? "Make Public" : "Make Private",
          icon: proposal.isPrivate ? (
            <Unlock className="h-4 w-4" />
          ) : (
            <Lock className="h-4 w-4" />
          ),
          onClick: () => handleTogglePrivate(proposal),
        },
        {
          label: proposal.isActive ? "Archive" : "Unarchive",
          icon: proposal.isActive ? (
            <Archive className="h-4 w-4" />
          ) : (
            <ArchiveRestore className="h-4 w-4" />
          ),
          onClick: () => handleArchive(proposal),
        },
        {
          label: "Assign to Project",
          icon: <FolderOpen className="h-4 w-4" />,
          onClick: () => setAssignDialog({ open: true, proposal }),
        },
        {
          label: "Delete",
          icon: <Trash2 className="h-4 w-4" />,
          onClick: () => setDeleteDialog({ open: true, proposal }),
          variant: "danger" as const,
        },
      ];
    },
    [handleArchive, handleToggleUnderDevelopment]
  );

  // Handle proposal click for modal
  const handleProposalClick = useCallback(
    (proposal: NormalizedProposal) => {
      if (proposal.isLegacy) return;
      const found = proposals?.find(
        (p: Proposal) => p.id === proposal.originalId
      );
      if (found) setSelectedProposal(found);
    },
    [proposals]
  );

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

  const hasContent = allProposals.length > 0;
  const hasAgreements = client.agreements.length > 0;
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all";

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Proposals & Agreements</h1>
        <p className="text-gray-400">
          Project proposals, scope documents, and agreements.
        </p>
      </div>

      {/* Checkout status messages */}
      {checkoutSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-md bg-green-900/30 p-4 text-green-400">
          <Check className="h-5 w-5" />
          <div>
            <p className="font-medium">Payment successful!</p>
            <p className="text-sm text-green-400/80">
              Thank you for your payment. You&apos;ll receive a confirmation
              email shortly.
            </p>
          </div>
        </div>
      )}

      {checkoutCanceled && (
        <div
          className="mb-6 flex items-center gap-3 rounded-md p-4"
          style={{
            backgroundColor: "rgba(212, 175, 55, 0.1)",
            color: "#D4AF37",
          }}
        >
          <AlertCircle className="h-5 w-5" />
          <p>
            Checkout was canceled. You can try again when you&apos;re ready.
          </p>
        </div>
      )}

      {/* Admin tabs */}
      {isAdmin && hasContent && (
        <StatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeProposals.length}
          archivedCount={archivedProposals.length}
        />
      )}

      {/* Search/Filter Bar — no sort dropdown, columns handle sorting */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search proposals..."
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
      ) : !hasContent && !hasAgreements ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No proposals yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            Project proposals and agreements will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Proposals table */}
          {hasContent && (
            <div>
              {hasAgreements && (
                <h2 className="mb-4 text-lg font-semibold text-gray-300">
                  Proposals
                </h2>
              )}

              {!sortedProposals.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText className="mb-3 h-10 w-10 text-gray-600" />
                  <p className="text-gray-500">
                    {activeTab === "archived"
                      ? "No archived proposals."
                      : "No proposals match your search."}
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
                        <SortHeader
                          field="status"
                          label="Status"
                          sorts={sorts}
                          onSort={handleSort}
                        />
                        {isAdmin && (
                          <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                            Flags
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
                      {sortedProposals.map((proposal) => (
                        <tr
                          key={proposal.id}
                          className={`border-b transition-colors hover:bg-white/5 ${
                            !proposal.isLegacy ? "cursor-pointer" : ""
                          }`}
                          style={{
                            borderColor: "rgba(212, 175, 55, 0.05)",
                          }}
                          onClick={() => handleProposalClick(proposal)}
                        >
                          {/* Title */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <FileText
                                className="h-4 w-4 flex-shrink-0"
                                style={{ color: "#D4AF37" }}
                              />
                              <p className="font-medium text-white">
                                {proposal.title}
                              </p>
                            </div>
                          </td>

                          {/* Project */}
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <span className="text-xs text-gray-500">
                              {proposal.projectName || "Unassigned"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor: getStatusBgColor(
                                  proposal.status
                                ),
                                color: getStatusTextColor(proposal.status),
                              }}
                            >
                              {getStatusIcon(proposal.status)}
                              {getStatusLabel(proposal.status)}
                            </span>
                          </td>

                          {/* Flags (admin only) */}
                          {isAdmin && (
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                {proposal.underDevelopment && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                                    <Construction className="h-3 w-3" />
                                    WIP
                                  </span>
                                )}
                                {proposal.isPrivate && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                                    <Lock className="h-3 w-3" />
                                    Private
                                  </span>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Created */}
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <span className="text-xs text-gray-500">
                              {formatDate(proposal.createdAt)}
                            </span>
                          </td>

                          {/* Actions (admin only) */}
                          {isAdmin && (
                            <td
                              className="px-2 py-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {!proposal.isLegacy && (
                                <AdminActionMenu
                                  actions={getAdminActions(proposal)}
                                />
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Agreements section (unchanged) */}
          {client.agreements.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-300">
                Agreements
              </h2>
              <div className="space-y-2">
                {client.agreements.map((agreement: ClientAgreement) => (
                  <Card
                    key={agreement.id}
                    className="bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <FileText
                          className="h-5 w-5"
                          style={{ color: "#D4AF37" }}
                        />
                        <div>
                          <h3 className="font-medium text-white">
                            {agreement.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(agreement.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          agreement.status === "signed"
                            ? "bg-green-900/50 text-green-400"
                            : agreement.status === "sent"
                              ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                              : "bg-white/10 text-gray-400"
                        }
                      >
                        {agreement.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proposal Modal */}
      {selectedProposal && (
        <ProposalModal
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposal(null)}
          proposal={{
            id: selectedProposal.id,
            title: selectedProposal.title,
            description: selectedProposal.description,
            createdAt: selectedProposal.createdAt,
            metadata: selectedProposal.metadata as ProposalMetadata | null,
            project: selectedProposal.project,
          }}
          slug={slug}
          isAdmin={isAdmin}
        />
      )}

      {/* Project Assignment Dialog */}
      <ProjectAssignDialog
        open={assignDialog.open}
        onOpenChange={(open) =>
          setAssignDialog({
            open,
            proposal: open ? assignDialog.proposal : null,
          })
        }
        currentProjectId={assignDialog.proposal?.projectId ?? null}
        projects={projects ?? []}
        onAssign={handleAssign}
        onCreateProject={handleCreateProject}
        isLoading={updateResource.isPending || createProject.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({
            open,
            proposal: open ? deleteDialog.proposal : null,
          })
        }
        title="Delete Proposal"
        description={`Are you sure you want to permanently delete "${deleteDialog.proposal?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() =>
          deleteDialog.proposal && handleDelete(deleteDialog.proposal)
        }
        isLoading={deleteResource.isPending}
      />
    </>
  );
}
