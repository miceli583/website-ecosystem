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

import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  SearchFilterBar,
  ListItem,
  ListContainer,
  StatusTabs,
  AdminActionMenu,
  ProjectGroupHeader,
  ProjectAssignDialog,
  ConfirmDialog,
  ProposalModal,
  ListItemSkeletonGroup,
  type SortOrder,
  type ViewMode,
  type FilterOption,
  type AdminAction,
  type ProposalMetadata,
  useTabFilters,
} from "~/components/portal";
import {
  FileText,
  Loader2,
  AlertCircle,
  Search,
  Check,
  Clock,
  X,
  Archive,
  ArchiveRestore,
  FolderOpen,
  Trash2,
  Construction,
  Eye,
} from "lucide-react";

function getStatusIcon(status: string) {
  switch (status) {
    case "accepted":
      return <Check className="h-4 w-4 text-green-400" />;
    case "sent":
      return <Clock className="h-4 w-4" style={{ color: "#D4AF37" }} />;
    case "declined":
      return <X className="h-4 w-4 text-red-400" />;
    default:
      return <FileText className="h-4 w-4 text-gray-400" />;
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
      else if (variables.underDevelopment === true) toast.success("Proposal marked as under development");
      else if (variables.underDevelopment === false) toast.success("Proposal is now visible to clients");
      else if (variables.projectId !== undefined) toast.success("Project assigned");
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
  const [activeTab, setActiveTab] = useState<"active" | "archived">(saved.activeTab ?? "active");
  const [searchQuery, setSearchQuery] = useState(saved.searchQuery);
  const [selectedProject, setSelectedProject] = useState<number | "all" | "unassigned">(
    saved.selectedProject as number | "all" | "unassigned",
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(saved.sortOrder);
  const [viewMode, setViewMode] = useState<ViewMode>(saved.viewMode);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

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
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; proposal: NormalizedProposal | null }>({
    open: false,
    proposal: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; proposal: NormalizedProposal | null }>({
    open: false,
    proposal: null,
  });

  // Check for Stripe redirect
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const checkoutSuccess = searchParams?.get("success") === "true";
  const checkoutCanceled = searchParams?.get("canceled") === "true";

  // Legacy proposals
  const legacyProposals = useMemo(() => {
    if (!client) return [];
    return client.projects.flatMap((p: ClientProject) =>
      p.updates
        .filter((u: ClientUpdate) => u.type === "proposal")
        .map((u: ClientUpdate) => ({ ...u, projectName: p.name, projectId: p.id }))
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
        underDevelopment: r.underDevelopment ?? false,
        isLegacy: false,
        metadata,
        originalId: r.id,
      });
    });

    legacyProposals.forEach((d: ClientUpdate & { projectName: string; projectId: number }) => {
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
        underDevelopment: false,
        isLegacy: true,
        metadata: null,
        originalId: d.id,
      });
    });

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

    const filters: FilterOption[] = Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
    if (allProposals.some((p) => p.projectId === null)) {
      filters.push({ id: "unassigned", name: "Unassigned" });
    }
    return filters;
  }, [client, resources, projects, allProposals]);

  // Split by active/archived
  const activeProposals = useMemo(() => allProposals.filter((p) => p.isActive), [allProposals]);
  const archivedProposals = useMemo(() => allProposals.filter((p) => !p.isActive), [allProposals]);
  const currentProposals = activeTab === "active" ? activeProposals : archivedProposals;

  // Filter
  const filteredProposals = useMemo(() => {
    return currentProposals.filter((proposal) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = proposal.title.toLowerCase().includes(query);
        const matchesDesc = proposal.description?.toLowerCase().includes(query);
        const matchesProject = proposal.projectName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }
      if (selectedProject === "unassigned") return proposal.projectId === null;
      if (selectedProject !== "all" && proposal.projectId !== selectedProject) return false;
      return true;
    });
  }, [currentProposals, searchQuery, selectedProject]);

  // Sort
  const sortedProposals = useMemo(() => {
    return [...filteredProposals].sort((a, b) => {
      if (sortOrder === "name") {
        return a.title.localeCompare(b.title);
      }
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredProposals, sortOrder]);

  // Group by project
  const groupedProposals = useMemo(() => {
    const groups = new Map<string, NormalizedProposal[]>();
    for (const proposal of sortedProposals) {
      const key = proposal.projectName || "Unassigned";
      const group = groups.get(key) ?? [];
      group.push(proposal);
      groups.set(key, group);
    }
    const sorted = Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });
    return sorted;
  }, [sortedProposals]);

  // Admin actions
  const handleArchive = useCallback(
    (proposal: NormalizedProposal) => {
      if (!proposal.resourceId) return;
      updateResource.mutate({ id: proposal.resourceId, isActive: !proposal.isActive });
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
      updateResource.mutate({ id: assignDialog.proposal.resourceId, projectId });
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
      updateResource.mutate({ id: proposal.resourceId, underDevelopment: !proposal.underDevelopment });
    },
    [updateResource]
  );

  const getAdminActions = useCallback(
    (proposal: NormalizedProposal): AdminAction[] => {
      if (proposal.isLegacy) return [];
      return [
        {
          label: proposal.underDevelopment ? "Make Visible to Client" : "Mark Under Development",
          icon: proposal.underDevelopment ? <Eye className="h-4 w-4" /> : <Construction className="h-4 w-4" />,
          onClick: () => handleToggleUnderDevelopment(proposal),
        },
        {
          label: proposal.isActive ? "Archive" : "Unarchive",
          icon: proposal.isActive ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />,
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
      const found = proposals?.find((p: Proposal) => p.id === proposal.originalId);
      if (found) setSelectedProposal(found);
    },
    [proposals]
  );

  // Expand/collapse all
  const handleExpandAll = useCallback(() => setCollapsedGroups(new Set()), []);
  const handleCollapseAll = useCallback(() => {
    setCollapsedGroups(new Set(groupedProposals.map(([name]) => name)));
  }, [groupedProposals]);

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

  const hasContent = allProposals.length > 0;
  const hasAgreements = client.agreements.length > 0;
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all" || sortOrder !== "newest";
  const showGrouping =
    viewMode === "grouped" &&
    selectedProject === "all" &&
    (groupedProposals.length > 1 ||
      (groupedProposals.length === 1 && groupedProposals[0]![0] !== "Unassigned"));

  // Render a proposal row
  const renderProposal = (proposal: NormalizedProposal) => (
    <div
      key={proposal.id}
      onClick={() => handleProposalClick(proposal)}
      className={!proposal.isLegacy ? "cursor-pointer" : ""}
    >
      <ListItem
        icon={<FileText className="h-5 w-5" />}
        title={proposal.title}
        description={proposal.projectName || "Unassigned"}
        date={proposal.createdAt}
        badge={
          <span className="flex items-center gap-2 text-xs">
            {isAdmin && proposal.underDevelopment && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 font-medium text-amber-400">
                <Construction className="h-3 w-3" />
                WIP
              </span>
            )}
            <span className="flex items-center gap-1">
              {getStatusIcon(proposal.status)}
              <span className="text-gray-500">{getStatusLabel(proposal.status)}</span>
            </span>
          </span>
        }
        actions={
          isAdmin && !proposal.isLegacy ? (
            <div onClick={(e) => e.stopPropagation()}>
              <AdminActionMenu actions={getAdminActions(proposal)} />
            </div>
          ) : undefined
        }
      />
    </div>
  );

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
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
              Thank you for your payment. You&apos;ll receive a confirmation email shortly.
            </p>
          </div>
        </div>
      )}

      {checkoutCanceled && (
        <div className="mb-6 flex items-center gap-3 rounded-md p-4" style={{ backgroundColor: "rgba(212, 175, 55, 0.1)", color: "#D4AF37" }}>
          <AlertCircle className="h-5 w-5" />
          <p>Checkout was canceled. You can try again when you&apos;re ready.</p>
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

      {/* Search/Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search proposals..."
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
            : collapsedGroups.size >= groupedProposals.length
              ? "all-collapsed"
              : "mixed"
        }
      />

      {resourcesLoading ? (
        <ListItemSkeletonGroup count={5} />
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
          {/* Proposals section */}
          {hasContent && (
            <div>
              {hasAgreements && (
                <h2 className="mb-4 text-lg font-semibold text-gray-300">Proposals</h2>
              )}

              <ListContainer
                emptyIcon={<Search className="h-12 w-12" />}
                emptyMessage={
                  activeTab === "archived"
                    ? "No archived proposals."
                    : "No proposals match your search."
                }
                onClearFilters={clearFilters}
                showClearFilters={hasActiveFilters}
              >
                {showGrouping
                  ? groupedProposals.map(([groupName, proposalGroup]) => (
                      <div key={groupName}>
                        <ProjectGroupHeader
                          projectName={groupName}
                          itemCount={proposalGroup.length}
                          collapsed={collapsedGroups.has(groupName)}
                          onToggle={() => toggleGroup(groupName)}
                        />
                        {!collapsedGroups.has(groupName) &&
                          proposalGroup.map((proposal) => (
                            <div key={proposal.id} className="mb-3">
                              {renderProposal(proposal)}
                            </div>
                          ))}
                      </div>
                    ))
                  : sortedProposals.map((proposal) => renderProposal(proposal))}
              </ListContainer>
            </div>
          )}

          {/* Agreements section */}
          {client.agreements.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-300">Agreements</h2>
              <div className="space-y-2">
                {client.agreements.map((agreement: ClientAgreement) => (
                  <Card
                    key={agreement.id}
                    className="bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" style={{ color: "#D4AF37" }} />
                        <div>
                          <h3 className="font-medium text-white">{agreement.title}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(agreement.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
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
            isActive: allProposals.find((p) => p.originalId === selectedProposal.id && !p.isLegacy)?.isActive ?? true,
          }}
          slug={slug}
          isAdmin={isAdmin}
          underDevelopment={allProposals.find((p) => p.originalId === selectedProposal.id && !p.isLegacy)?.underDevelopment ?? false}
        />
      )}

      {/* Project Assignment Dialog */}
      <ProjectAssignDialog
        open={assignDialog.open}
        onOpenChange={(open) => setAssignDialog({ open, proposal: open ? assignDialog.proposal : null })}
        currentProjectId={assignDialog.proposal?.projectId ?? null}
        projects={projects ?? []}
        onAssign={handleAssign}
        onCreateProject={handleCreateProject}
        isLoading={updateResource.isPending || createProject.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, proposal: open ? deleteDialog.proposal : null })}
        title="Delete Proposal"
        description={`Are you sure you want to permanently delete "${deleteDialog.proposal?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteDialog.proposal && handleDelete(deleteDialog.proposal)}
        isLoading={deleteResource.isPending}
      />
    </ClientPortalLayout>
  );
}
