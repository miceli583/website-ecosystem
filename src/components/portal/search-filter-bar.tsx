"use client";

import { useState, useMemo } from "react";
import { Input } from "~/components/ui/input";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  ArrowUpDown,
  LayoutList,
  LayoutGrid,
  ChevronsUpDown,
} from "lucide-react";

export type SortOrder = "newest" | "oldest" | "name";
export type ViewMode = "grouped" | "list";

export interface FilterOption {
  id: number | string;
  name: string;
}

interface SearchFilterBarProps {
  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  // Sort
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  sortOptions?: Array<{ value: SortOrder; label: string }>;

  // Filter (optional)
  filterOptions?: FilterOption[];
  selectedFilter?: number | string | "all";
  onFilterChange?: (filterId: number | string | "all") => void;
  filterLabel?: string;

  // View mode (optional)
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;

  // Expand/collapse all (optional — only shown in grouped mode)
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  /** Indicates group collapse state for button highlighting */
  collapseState?: "all-expanded" | "all-collapsed" | "mixed";
}

const defaultSortOptions: Array<{ value: SortOrder; label: string }> = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name", label: "Name A-Z" },
];

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortOrder,
  onSortChange,
  sortOptions = defaultSortOptions,
  filterOptions,
  selectedFilter = "all",
  onFilterChange,
  filterLabel = "Filter",
  viewMode,
  onViewModeChange,
  onExpandAll,
  onCollapseAll,
  collapseState = "all-expanded",
}: SearchFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");

  const hasFilters = filterOptions && filterOptions.length > 1;
  const hasActiveFilter = selectedFilter !== "all";

  const filteredFilterOptions = useMemo(() => {
    if (!filterOptions || !filterSearch) return filterOptions;
    const query = filterSearch.toLowerCase();
    return filterOptions.filter((o) => o.name.toLowerCase().includes(query));
  }, [filterOptions, filterSearch]);

  // Show search within filters when there are more than 6 options
  const showFilterSearch = hasFilters && (filterOptions?.length ?? 0) > 6;

  // Show view mode toggle and expand/collapse when provided
  const showViewToggle = viewMode !== undefined && onViewModeChange !== undefined;
  const showExpandCollapse =
    viewMode === "grouped" && (onExpandAll !== undefined || onCollapseAll !== undefined);

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            aria-label="Search deliverables"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-gray-700 bg-white/5 pl-10 text-white placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            className="h-full appearance-none rounded-md border border-gray-700 bg-white/5 px-4 py-2 pr-10 text-sm text-gray-300 transition-colors hover:bg-white/10 focus:border-[#D4AF37] focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Filter toggle */}
        {hasFilters && onFilterChange && (
          <button
            onClick={() => { setShowFilters(!showFilters); if (showFilters) setFilterSearch(""); }}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 transition-colors ${
              showFilters || hasActiveFilter
                ? "border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37]"
                : "border-gray-700 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Filter className="h-4 w-4" />
            {filterLabel}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* View mode toggle */}
        {showViewToggle && (
          <div className="flex items-center rounded-md border border-gray-700 bg-white/5">
            <button
              onClick={() => onViewModeChange!("list")}
              className={`rounded-l-md px-2.5 py-2 transition-colors ${
                viewMode === "list"
                  ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
              title="List view"
              aria-label="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <div className="w-px self-stretch bg-gray-700" />
            <button
              onClick={() => onViewModeChange!("grouped")}
              className={`rounded-r-md px-2.5 py-2 transition-colors ${
                viewMode === "grouped"
                  ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
              title="Grouped view"
              aria-label="Grouped view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Expand/Collapse all — visible in grouped mode */}
        {showExpandCollapse && (
          <div className="flex items-center rounded-md border border-gray-700 bg-white/5">
            {onExpandAll && (
              <button
                onClick={onExpandAll}
                className={`rounded-l-md px-2.5 py-2 transition-colors ${
                  collapseState === "all-expanded"
                    ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                }`}
                title="Expand all"
                aria-label="Expand all"
              >
                <ChevronsUpDown className="h-4 w-4" />
              </button>
            )}
            {onExpandAll && onCollapseAll && (
              <div className="w-px self-stretch bg-gray-700" />
            )}
            {onCollapseAll && (
              <button
                onClick={onCollapseAll}
                className={`rounded-r-md px-2.5 py-2 transition-colors ${
                  collapseState === "all-collapsed"
                    ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                }`}
                title="Collapse all"
                aria-label="Collapse all"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter options */}
      {showFilters && hasFilters && onFilterChange && (
        <div className="flex items-start gap-3">
          {/* Scrollable tag area */}
          <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(212, 175, 55, 0.3) transparent" }}>
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => onFilterChange("all")}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  selectedFilter === "all"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                All
              </button>
              {(filteredFilterOptions ?? []).map((option) => (
                <button
                  key={option.id}
                  onClick={() => onFilterChange(option.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                    selectedFilter === option.id
                      ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {option.name}
                </button>
              ))}
              {filterSearch && filteredFilterOptions?.length === 0 && (
                <span className="shrink-0 px-3 py-1.5 text-sm text-gray-600">No matches</span>
              )}
            </div>
          </div>

          {/* Filter search — visible when many options */}
          {showFilterSearch && (
            <div className="relative shrink-0">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                aria-label="Filter deliverables"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Find..."
                className="w-32 rounded-full border bg-white/5 py-1.5 pl-8 pr-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#D4AF37]/50 focus:bg-white/10"
                style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              />
              {filterSearch && (
                <button
                  onClick={() => setFilterSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
