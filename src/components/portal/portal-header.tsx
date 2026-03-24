"use client";

import { usePortalSidebar } from "./portal-sidebar-context";
import { PortalSidebarMobileToggle } from "./portal-sidebar";
import {
  PORTAL_SIDEBAR_WIDTH,
  PORTAL_SIDEBAR_WIDTH_COLLAPSED,
} from "./portal-sidebar";

export function PortalHeader({ clientName }: { clientName: string }) {
  const { isCollapsed } = usePortalSidebar();

  return (
    <header
      className="fixed top-0 right-0 z-20 flex h-14 items-center justify-between border-b bg-black/95 px-4 backdrop-blur-sm transition-all duration-200 ease-out"
      style={{
        left: `${isCollapsed ? PORTAL_SIDEBAR_WIDTH_COLLAPSED : PORTAL_SIDEBAR_WIDTH}px`,
        borderColor: "rgba(212, 175, 55, 0.2)",
      }}
    >
      <div className="flex items-center gap-4">
        <PortalSidebarMobileToggle />
        <span className="text-sm font-medium text-gray-400 md:hidden">
          {clientName}
        </span>
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          header {
            left: 0 !important;
          }
        }
      `}</style>
    </header>
  );
}
