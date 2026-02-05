"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "admin-sidebar-collapsed";

interface AdminSidebarContextValue {
  /** Whether sidebar is collapsed (icons only) */
  isCollapsed: boolean;
  /** Toggle between collapsed and expanded */
  toggle: () => void;
  /** Force collapse state */
  setCollapsed: (collapsed: boolean) => void;
  /** Whether mobile menu is open */
  isMobileOpen: boolean;
  /** Toggle mobile menu */
  toggleMobile: () => void;
  /** Close mobile menu */
  closeMobile: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage (default: expanded on desktop)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    }
  }, [isCollapsed, isHydrated]);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Close mobile menu on route change (handled by layout)
  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AdminSidebarContext.Provider
      value={{
        isCollapsed,
        toggle,
        setCollapsed,
        isMobileOpen,
        toggleMobile,
        closeMobile,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return context;
}
