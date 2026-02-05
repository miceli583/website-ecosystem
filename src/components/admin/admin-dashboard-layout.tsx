"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebarProvider, useAdminSidebar } from "./admin-sidebar-context";
import { AdminSidebar, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

// Pages that should NOT get the dashboard shell
const STANDALONE_PAGES = ["/admin/login"];

function DashboardContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed, closeMobile } = useAdminSidebar();

  // Close mobile menu on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  // Check if this is a standalone page (no shell)
  const isStandalone = STANDALONE_PAGES.some((page) => pathname.startsWith(page));

  if (isStandalone) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminSidebar />
      <AdminHeader />

      {/* Main content area */}
      <main
        className="min-h-screen pt-14 transition-all duration-200 ease-out"
        style={{
          marginLeft: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
        }}
      >
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile: remove margin on main */}
      <style jsx>{`
        @media (max-width: 767px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminSidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </AdminSidebarProvider>
  );
}
