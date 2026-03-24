"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, ChevronRight, Bell, Check } from "lucide-react";
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
            {
              label: subItem.title,
              href: subItem.href,
              isCurrent: isExactMatch,
            },
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
      href:
        idx < arr.length - 1
          ? `/admin/${arr.slice(0, idx + 1).join("/")}`
          : undefined,
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

type Notification = {
  id: number;
  title: string;
  message: string | null;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: Date;
  type: string;
  recipientId: string;
};

function NotificationBell() {
  const router = useRouter();
  const utils = api.useUtils();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = api.notifications.getUnreadCount.useQuery(
    undefined,
    { refetchInterval: 30_000, staleTime: 10_000 }
  );

  const { data: unreadNotifications } = api.notifications.getUnread.useQuery(
    undefined,
    { enabled: isOpen, staleTime: 5_000 }
  );

  const markRead = api.notifications.markRead.useMutation({
    onSuccess: () => {
      void utils.notifications.getUnreadCount.invalidate();
      void utils.notifications.getUnread.invalidate();
    },
  });

  const markAllRead = api.notifications.markAllRead.useMutation({
    onSuccess: () => {
      void utils.notifications.getUnreadCount.invalidate();
      void utils.notifications.getUnread.invalidate();
    },
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center text-gray-400 transition-colors hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {(unreadCount ?? 0) > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-bold text-black">
            {unreadCount! > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-80 rounded-lg border bg-[#0a0a0a] shadow-2xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <h3 className="text-sm font-medium text-white">Notifications</h3>
            {(unreadCount ?? 0) > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-[#D4AF37]"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {!unreadNotifications || unreadNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto mb-2 h-5 w-5 text-gray-700" />
                <p className="text-xs text-gray-600">No new notifications</p>
              </div>
            ) : (
              (unreadNotifications as Notification[]).map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    markRead.mutate({ id: n.id });
                    if (n.linkUrl) {
                      router.push(n.linkUrl);
                      setIsOpen(false);
                    }
                  }}
                  className="flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.08)" }}
                >
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#D4AF37]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {n.title}
                    </p>
                    {n.message && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                        {n.message}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-gray-600">
                      {new Date(n.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div
            className="border-t px-4 py-2"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs text-gray-500 transition-colors hover:text-[#D4AF37]"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
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

      {/* Right side: notifications + user info + sign out */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        {profile && (
          <Link
            href="/admin/profile"
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
