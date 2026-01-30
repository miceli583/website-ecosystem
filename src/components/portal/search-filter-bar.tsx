"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  ArrowUpDown,
} from "lucide-react";

export type SortOrder = "newest" | "oldest" | "name";

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
}: SearchFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters = filterOptions && filterOptions.length > 1;
  const hasActiveFilter = selectedFilter !== "all";

  return (
    <div className="mb-6 space-y-3">
      <div className="flex gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-gray-700 bg-white/5 pl-10 text-white placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
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
            className="h-full appearance-none rounded-md border border-gray-700 bg-white/5 px-4 py-2 pr-10 text-sm text-gray-300 transition-colors hover:bg-white/10 focus:border-yellow-600 focus:outline-none"
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
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 transition-colors ${
              showFilters || hasActiveFilter
                ? "border-yellow-600 bg-yellow-900/20 text-yellow-400"
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
      </div>

      {/* Filter options */}
      {showFilters && hasFilters && onFilterChange && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              selectedFilter === "all"
                ? "bg-yellow-900/50 text-yellow-400"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            All
          </button>
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                selectedFilter === option.id
                  ? "bg-yellow-900/50 text-yellow-400"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
