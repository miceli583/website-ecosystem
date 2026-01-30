"use client";

import { use, useState, useMemo } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type ClientAgreement = ClientBySlug["agreements"][number];
type Proposal = RouterOutputs["portal"]["getProposals"][number];

import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  SearchFilterBar,
  ListItem,
  ListContainer,
  ProposalModal,
  type SortOrder,
  type ProposalMetadata,
} from "~/components/portal";
import {
  FileText,
  Loader2,
  AlertCircle,
  Search,
  Check,
  Clock,
  X,
} from "lucide-react";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function getStatusIcon(status: string) {
  switch (status) {
    case "accepted":
      return <Check className="h-4 w-4 text-green-400" />;
    case "sent":
      return <Clock className="h-4 w-4 text-yellow-400" />;
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

export default function PortalProposalsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );
  const {
    data: proposals,
    isLoading: proposalsLoading,
  } = api.portal.getProposals.useQuery(
    { slug },
    { staleTime: 2 * 60 * 1000 } // 2 minutes
  );

  // Modal state
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Check for success/cancel from Stripe redirect
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const checkoutSuccess = searchParams?.get("success") === "true";
  const checkoutCanceled = searchParams?.get("canceled") === "true";

  // Normalize proposals for display (new system from clientResources)
  const newProposals = useMemo(() => {
    if (!proposals) return [];
    return proposals.map((p: Proposal) => {
      const metadata = p.metadata as ProposalMetadata | null;
      const packages = metadata?.packages ?? [];
      const total = packages.reduce((sum, pkg) => sum + pkg.price, 0) || metadata?.total || 0;
      const currency = metadata?.currency ?? "usd";
      const status = metadata?.status ?? "draft";

      return {
        id: p.id,
        type: "new" as const,
        title: p.title,
        description: p.description,
        status,
        total,
        currency,
        createdAt: p.createdAt,
        project: p.project,
        metadata,
        packageCount: packages.length,
      };
    });
  }, [proposals]);

  // Legacy proposals from clientUpdates
  const legacyProposals = useMemo(() => {
    if (!client) return [];
    return client.projects
      .flatMap((p: ClientProject) =>
        p.updates
          .filter((u: ClientUpdate) => u.type === "proposal")
          .map((u: ClientUpdate) => ({
            id: u.id,
            type: "legacy" as const,
            title: u.title,
            description: u.content,
            status: "sent" as const,
            total: 0,
            currency: "usd",
            createdAt: u.createdAt,
            project: { name: p.name },
            metadata: null,
            packageCount: 0,
          }))
      );
  }, [client]);

  // Combine all proposals
  const allProposals = useMemo(() => {
    return [...newProposals, ...legacyProposals];
  }, [newProposals, legacyProposals]);

  // Filter proposals
  const filteredProposals = useMemo(() => {
    return allProposals.filter((proposal: typeof allProposals[number]) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = proposal.title.toLowerCase().includes(query);
        const matchesDesc = proposal.description?.toLowerCase().includes(query);
        const matchesProject = proposal.project?.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }
      return true;
    });
  }, [allProposals, searchQuery]);

  // Sort proposals
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

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSortOrder("newest");
  };

  // Handle proposal click (only for new-style proposals with modal)
  const handleProposalClick = (proposalId: number, type: "new" | "legacy") => {
    if (type === "legacy") return; // Legacy proposals don't have modal
    const proposal = proposals?.find((p: Proposal) => p.id === proposalId);
    if (proposal) {
      setSelectedProposal(proposal);
    }
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

  const hasProposals = allProposals.length > 0;
  const hasAgreements = client.agreements.length > 0;
  const hasContent = hasProposals || hasAgreements;
  const hasActiveFilters = Boolean(searchQuery) || sortOrder !== "newest";

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
        <div className="mb-6 flex items-center gap-3 rounded-md bg-yellow-900/30 p-4 text-yellow-400">
          <AlertCircle className="h-5 w-5" />
          <p>Checkout was canceled. You can try again when you&apos;re ready.</p>
        </div>
      )}

      {/* Search/Filter Bar - always visible */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search proposals..."
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {proposalsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
        </div>
      ) : !hasContent ? (
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
          {hasProposals && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-300">Proposals</h2>

              <ListContainer
                emptyIcon={<Search className="h-12 w-12" />}
                emptyMessage="No proposals match your search."
                onClearFilters={clearFilters}
                showClearFilters={hasActiveFilters}
              >
                {sortedProposals.map((proposal) => (
                  <div
                    key={`${proposal.type}-${proposal.id}`}
                    onClick={() => handleProposalClick(proposal.id, proposal.type)}
                    className={proposal.type === "new" ? "cursor-pointer" : ""}
                  >
                    <div className="flex items-center justify-between gap-4 rounded-md border border-gray-800 bg-white/5 px-4 py-3 transition-colors hover:border-yellow-600/50 hover:bg-white/10">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0" style={{ color: "#D4AF37" }}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium text-white">{proposal.title}</p>
                            <span className="flex items-center gap-1 text-xs">
                              {getStatusIcon(proposal.status)}
                              <span className="text-gray-500">{getStatusLabel(proposal.status)}</span>
                            </span>
                          </div>
                          {proposal.project && (
                            <p className="truncate text-sm text-gray-500">{proposal.project.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                              ? "bg-yellow-900/50 text-yellow-400"
                              : "bg-gray-800 text-gray-400"
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
        />
      )}
    </ClientPortalLayout>
  );
}
