"use client";

import { use, useState, useMemo } from "react";
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
  type SortOrder,
  type FilterOption,
} from "~/components/portal";
import { Monitor, Loader2, AlertCircle, Search } from "lucide-react";

export default function PortalDemosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 } // 5 minutes - client data rarely changes
  );
  const { data: resources, isLoading: resourcesLoading } = api.portal.getResources.useQuery(
    { slug, section: "demos" },
    { staleTime: 2 * 60 * 1000 } // 2 minutes - resources can change more often
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Get all unique projects for filter options
  const projectFilters: FilterOption[] = useMemo(() => {
    if (!client) return [];
    const projectMap = new Map<number, string>();

    resources?.forEach((r: Resource) => {
      if (r.project) {
        projectMap.set(r.project.id, r.project.name);
      }
    });

    client.projects.forEach((p: ClientProject) => {
      projectMap.set(p.id, p.name);
    });

    return Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
  }, [client, resources]);

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
  const allDemos = useMemo(() => {
    const demos: Array<{
      id: string;
      title: string;
      description: string | null;
      url: string | null;
      projectId: number | null;
      projectName: string;
      createdAt: Date | string;
    }> = [];

    resources?.forEach((r: Resource) => {
      demos.push({
        id: `r-${r.id}`,
        title: r.title,
        description: r.description,
        url: r.url,
        projectId: r.project?.id ?? null,
        projectName: r.project?.name ?? "General",
        createdAt: r.createdAt,
      });
    });

    legacyDemos.forEach((d: UpdateWithProject) => {
      demos.push({
        id: `d-${d.id}`,
        title: d.title,
        description: null,
        url: null,
        projectId: d.projectId,
        projectName: d.projectName,
        createdAt: d.createdAt,
      });
    });

    return demos;
  }, [resources, legacyDemos]);

  // Filter demos
  const filteredDemos = useMemo(() => {
    return allDemos.filter((demo) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = demo.title.toLowerCase().includes(query);
        const matchesDesc = demo.description?.toLowerCase().includes(query);
        const matchesProject = demo.projectName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }
      if (selectedProject !== "all" && demo.projectId !== selectedProject) {
        return false;
      }
      return true;
    });
  }, [allDemos, searchQuery, selectedProject]);

  // Sort demos
  const sortedDemos = useMemo(() => {
    return [...filteredDemos].sort((a, b) => {
      if (sortOrder === "name") {
        return a.title.localeCompare(b.title);
      }
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredDemos, sortOrder]);

  // Clear all filters
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

  const hasContent = allDemos.length > 0;
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all" || sortOrder !== "newest";

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Demos</h1>
        <p className="text-gray-400">
          Interactive previews and proof-of-concept builds for your projects.
        </p>
      </div>

      {/* Search/Filter Bar - always visible */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search demos by name..."
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        filterOptions={projectFilters}
        selectedFilter={selectedProject}
        onFilterChange={(id) => setSelectedProject(id as number | "all")}
        filterLabel="Project"
      />

      {resourcesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
        </div>
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Monitor className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No demos yet. Check back soon!</p>
        </div>
      ) : (
        <ListContainer
            emptyIcon={<Search className="h-12 w-12" />}
            emptyMessage="No demos match your search."
            onClearFilters={clearFilters}
            showClearFilters={hasActiveFilters}
          >
            {sortedDemos.map((demo) => (
              <ListItem
                key={demo.id}
                icon={<Monitor className="h-5 w-5" />}
                title={demo.title}
                description={demo.description}
                date={demo.createdAt}
                secondaryText={demo.projectName}
                href={demo.url}
              />
            ))}
          </ListContainer>
      )}
    </ClientPortalLayout>
  );
}
