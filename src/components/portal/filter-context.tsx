"use client";

import { createContext, useContext, useCallback, useRef, type ReactNode } from "react";
import type { SortOrder, ViewMode } from "./search-filter-bar";

export interface TabFilterState {
  searchQuery: string;
  sortOrder: SortOrder;
  selectedProject: number | string | "all";
  viewMode: ViewMode;
  collapsedGroups: string[];
  activeTab?: "active" | "archived";
}

const DEFAULT_STATE: TabFilterState = {
  searchQuery: "",
  sortOrder: "newest",
  selectedProject: "all",
  viewMode: "list",
  collapsedGroups: [],
  activeTab: "active",
};

interface FilterContextValue {
  getTabState: (tab: string) => TabFilterState;
  setTabState: (tab: string, state: Partial<TabFilterState>) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function PortalFilterProvider({ children }: { children: ReactNode }) {
  const stateMap = useRef(new Map<string, TabFilterState>());

  const getTabState = useCallback((tab: string): TabFilterState => {
    return stateMap.current.get(tab) ?? { ...DEFAULT_STATE };
  }, []);

  const setTabState = useCallback(
    (tab: string, partial: Partial<TabFilterState>) => {
      const prev = stateMap.current.get(tab) ?? { ...DEFAULT_STATE };
      stateMap.current.set(tab, { ...prev, ...partial });
    },
    [],
  );

  return (
    <FilterContext.Provider value={{ getTabState, setTabState }}>
      {children}
    </FilterContext.Provider>
  );
}

/**
 * Hook to manage filter state for a specific portal tab.
 * State persists across tab navigations within the same session.
 */
export function useTabFilters(tab: string) {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useTabFilters must be used within PortalFilterProvider");
  }
  return {
    getState: () => ctx.getTabState(tab),
    setState: (partial: Partial<TabFilterState>) => ctx.setTabState(tab, partial),
  };
}
