"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { usePortalSidebar } from "./portal-sidebar-context";
import { PORTAL_NAV, type PortalNavItem } from "./portal-nav";

export const PORTAL_SIDEBAR_WIDTH = 240;
export const PORTAL_SIDEBAR_WIDTH_COLLAPSED = 64;

function NavItem({
  item,
  slug,
  isCollapsed,
  isActive,
}: {
  item: PortalNavItem;
  slug: string;
  isCollapsed: boolean;
  isActive: boolean;
}) {
  const Icon = item.icon;
  const href = `/portal/${slug}/${item.path}`;

  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#D4AF37]/10 text-[#D4AF37]"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && <span className="truncate">{item.title}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={8}
          className="border border-[rgba(212,175,55,0.2)] bg-black p-0"
        >
          <div className="min-w-[120px] p-2">
            <Link
              href={href}
              className={cn(
                "flex items-center rounded-md px-2 py-1.5 text-sm font-semibold transition-colors",
                isActive
                  ? "text-[#D4AF37]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.title}
            </Link>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function SidebarContent({
  isCollapsed,
  clientName,
  slug,
  isAdmin,
  onSignOut,
}: {
  isCollapsed: boolean;
  clientName: string;
  slug: string;
  isAdmin: boolean;
  onSignOut: () => void;
}) {
  const pathname = usePathname();

  const visibleNav = PORTAL_NAV.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col">
      {/* Logo / Client Name */}
      <div
        className={cn(
          "flex items-center gap-3 border-b px-4 py-4",
          isCollapsed && "justify-center px-2"
        )}
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="relative h-8 w-8 flex-shrink-0">
          <Image
            src="/brand/miracle-mind-orbit-star-v3.svg"
            alt="Miracle Mind"
            fill
            className="object-contain"
          />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {clientName}
            </p>
            <p className="text-xs text-gray-500">Client Portal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {visibleNav.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            slug={slug}
            isCollapsed={isCollapsed}
            isActive={pathname.includes(`/portal/${slug}/${item.path}`)}
          />
        ))}
      </nav>

      {/* Footer: Admin back link + Sign out */}
      <div
        className="space-y-1 border-t p-2"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        {isAdmin && !isCollapsed && (
          <Link
            href="/admin/clients"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
          >
            ← Back to Admin
          </Link>
        )}
        <button
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}

export function PortalSidebar({
  clientName,
  slug,
  isAdmin,
  onSignOut,
}: {
  clientName: string;
  slug: string;
  isAdmin: boolean;
  onSignOut: () => void;
}) {
  const { isCollapsed, toggle, isMobileOpen, closeMobile } = usePortalSidebar();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden border-r bg-black md:block"
        style={{
          width: PORTAL_SIDEBAR_WIDTH,
          borderColor: "rgba(212, 175, 55, 0.2)",
        }}
      />
    );
  }

  return (
    <TooltipProvider>
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden border-r bg-black transition-all duration-200 ease-out md:block"
        style={{
          width: isCollapsed
            ? PORTAL_SIDEBAR_WIDTH_COLLAPSED
            : PORTAL_SIDEBAR_WIDTH,
          borderColor: "rgba(212, 175, 55, 0.2)",
        }}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          clientName={clientName}
          slug={slug}
          isAdmin={isAdmin}
          onSignOut={onSignOut}
        />
        <button
          onClick={toggle}
          aria-label="Toggle sidebar"
          className="absolute top-20 -right-3 flex h-6 w-6 items-center justify-center rounded-full border bg-black text-gray-400 transition-colors hover:text-white"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={closeMobile}>
        <SheetContent
          side="left"
          className="w-[280px] border-r bg-black p-0"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent
            isCollapsed={false}
            clientName={clientName}
            slug={slug}
            isAdmin={isAdmin}
            onSignOut={onSignOut}
          />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

export function PortalSidebarMobileToggle() {
  const { toggleMobile } = usePortalSidebar();

  return (
    <button
      onClick={toggleMobile}
      className="flex h-12 w-12 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </button>
  );
}
