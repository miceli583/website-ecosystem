"use client";

import { use, useState, useMemo } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import {
  SearchFilterBar,
  ListItem,
  ListContainer,
  type SortOrder,
  type FilterOption,
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
} from "lucide-react";

type Resource = RouterOutputs["portal"]["getResources"][number];

// Get icon for resource type
function getResourceIcon(resource: Resource) {
  const iconMap: Record<string, React.ReactNode> = {
    link: <LinkIcon className="h-5 w-5" />,
    key: <Key className="h-5 w-5" />,
    book: <Book className="h-5 w-5" />,
    code: <Code className="h-5 w-5" />,
    file: <FileText className="h-5 w-5" />,
    wrench: <Wrench className="h-5 w-5" />,
  };

  if (resource.icon && iconMap[resource.icon]) {
    return iconMap[resource.icon];
  }

  // Default icons by type
  switch (resource.type) {
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
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );
  const { data: resources, isLoading: resourcesLoading } = api.portal.getResources.useQuery(
    { slug, section: "tooling" },
    { staleTime: 2 * 60 * 1000 } // 2 minutes
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Get unique projects for filter
  const projectFilters: FilterOption[] = useMemo(() => {
    if (!resources) return [];
    const projectMap = new Map<number, string>();

    resources.forEach((r: Resource) => {
      if (r.project) {
        projectMap.set(r.project.id, r.project.name);
      }
    });

    return Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
  }, [resources]);

  // Filter resources
  const filteredResources = useMemo(() => {
    if (!resources) return [];

    return resources.filter((r: Resource) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesDesc = r.description?.toLowerCase().includes(query);
        const matchesProject = r.project?.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProject) return false;
      }

      // Project filter
      if (selectedProject !== "all" && r.project?.id !== selectedProject) {
        return false;
      }

      return true;
    });
  }, [resources, searchQuery, selectedProject]);

  // Sort resources
  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      if (sortOrder === "name") {
        return a.title.localeCompare(b.title);
      }
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredResources, sortOrder]);

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

  const hasContent = (resources?.length ?? 0) > 0;
  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all" || sortOrder !== "newest";

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Tooling</h1>
        <p className="text-gray-400">
          Resources, integrations, and developer tools for your projects.
        </p>
      </div>

      {/* Search/Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tools..."
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
          <Wrench className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No tools configured yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            API keys, documentation, and integrations will appear here.
          </p>
        </div>
      ) : (
        <ListContainer
          emptyIcon={<Search className="h-12 w-12" />}
          emptyMessage="No tools match your search."
          onClearFilters={clearFilters}
          showClearFilters={hasActiveFilters}
        >
          {sortedResources.map((resource) => (
            <ListItem
              key={resource.id}
              icon={getResourceIcon(resource)}
              title={resource.title}
              description={resource.description}
              date={resource.createdAt}
              secondaryText={resource.project?.name}
              href={resource.url}
              disabled={!resource.subscriptionActive}
              disabledMessage="Subscription required"
            />
          ))}
        </ListContainer>
      )}
    </ClientPortalLayout>
  );
}
