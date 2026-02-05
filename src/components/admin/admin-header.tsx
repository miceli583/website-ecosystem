"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";
import { AdminSidebarMobileToggle } from "./admin-sidebar";
import { useAdminSidebar } from "./admin-sidebar-context";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./admin-sidebar";

export function AdminHeader() {
  const router = useRouter();
  const { isCollapsed } = useAdminSidebar();
  const utils = api.useUtils();

  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const handleSignOut = async () => {
    await utils.invalidate();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header
      className="fixed top-0 right-0 z-20 flex h-14 items-center justify-between border-b bg-black/95 px-4 backdrop-blur-sm transition-all duration-200 ease-out"
      style={{
        left: `${isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`,
        borderColor: "rgba(212, 175, 55, 0.2)",
      }}
    >
      {/* Mobile: show hamburger, Desktop: empty space or breadcrumb could go here */}
      <div className="flex items-center gap-4">
        <AdminSidebarMobileToggle />
      </div>

      {/* Right side: user info + sign out */}
      <div className="flex items-center gap-4">
        {profile && (
          <Link
            href="/portal/profile?domain=live"
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{profile.name}</span>
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>

      {/* Mobile left adjustment */}
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
