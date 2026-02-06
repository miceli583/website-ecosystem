"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, ChevronRight } from "lucide-react";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";
import { AdminSidebarMobileToggle } from "./admin-sidebar";
import { useAdminSidebar } from "./admin-sidebar-context";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./admin-sidebar";
import { ADMIN_SIDEBAR_NAV } from "./admin-nav";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

/**
 * Build breadcrumb items from current pathname
 */
function useBreadcrumbs() {
  const pathname = usePathname();

  // Find matching nav item and sub-item
  for (const item of ADMIN_SIDEBAR_NAV) {
    // Direct match (e.g., /admin)
    if (item.href === pathname) {
      return [{ label: item.title, href: item.href, isCurrent: true }];
    }

    // Check sub-items
    if (item.items) {
      for (const subItem of item.items) {
        if (pathname.startsWith(subItem.href)) {
          // Check for deeper routes (e.g., /admin/shaders/orbit-star)
          const isExactMatch = pathname === subItem.href;
          const deeperPath = pathname.slice(subItem.href.length);
          const deeperSegments = deeperPath.split("/").filter(Boolean);

          const crumbs = [
            { label: item.title, href: undefined, isCurrent: false },
            { label: subItem.title, href: subItem.href, isCurrent: isExactMatch },
          ];

          // Add deeper segments as additional breadcrumbs
          if (deeperSegments.length > 0) {
            let currentPath = subItem.href;
            for (let i = 0; i < deeperSegments.length; i++) {
              const segment = deeperSegments[i]!;
              currentPath = `${currentPath}/${segment}`;
              const isLast = i === deeperSegments.length - 1;
              crumbs.push({
                label: formatSegment(segment),
                href: isLast ? undefined : currentPath,
                isCurrent: isLast,
              });
            }
          }

          return crumbs;
        }
      }
    }
  }

  // Fallback for routes not in nav (like /admin/clients/edit/123)
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "admin") {
    return segments.slice(1).map((seg, idx, arr) => ({
      label: formatSegment(seg),
      href: idx < arr.length - 1 ? `/admin/${arr.slice(0, idx + 1).join("/")}` : undefined,
      isCurrent: idx === arr.length - 1,
    }));
  }

  return [];
}

function formatSegment(segment: string): string {
  // Convert slug format to title case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AdminHeader() {
  const router = useRouter();
  const { isCollapsed } = useAdminSidebar();
  const utils = api.useUtils();
  const breadcrumbs = useBreadcrumbs();

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
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <AdminSidebarMobileToggle />

        {/* Breadcrumbs - hidden on mobile */}
        {breadcrumbs.length > 0 && (
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </BreadcrumbSeparator>
                  )}
                  <BreadcrumbItem>
                    {crumb.isCurrent ? (
                      <BreadcrumbPage className="text-white">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : crumb.href ? (
                      <BreadcrumbLink
                        href={crumb.href}
                        className="text-gray-400 hover:text-white"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-gray-500">{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
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
