"use client";

/**
 * Shared dashboard shell for CargoWatch demo.
 * Provides the left sidebar (logo, user info, nav) that appears on
 * dashboard, alerts, map, and profile pages.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Home,
  Bell,
  Map,
  FilePlus,
  UserCircle,
} from "lucide-react";
import { DEMO_USER } from "~/lib/cargowatch-data";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "Alerts", path: "/alerts", icon: Bell },
  { label: "Map", path: "/map", icon: Map },
  { label: "Report", path: "/report", icon: FilePlus, highlight: true },
  { label: "Profile", path: "/profile", icon: UserCircle },
];

export function DashboardShell({
  baseUrl,
  children,
}: {
  baseUrl: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-7rem)]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-800 bg-cw-navy-dark md:block">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="border-b border-gray-800 px-5 py-5">
            <Link href={baseUrl} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cw-red/20">
                <ShieldCheck className="h-5 w-5 text-cw-red" />
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wide text-white">
                  Cargo Watch
                </div>
                <div className="text-xs text-gray-500">Command Center</div>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="border-b border-gray-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cw-red/20 text-sm font-medium text-cw-red">
                {DEMO_USER.fullName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {DEMO_USER.fullName}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {DEMO_USER.role.replace("_", " ")}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const href = `${baseUrl}${item.path}`;
                const isActive = pathname === href || pathname.startsWith(href + "/");
                const Icon = item.icon;

                if (item.highlight) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={href}
                        className="flex items-center gap-3 rounded-lg bg-cw-red px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cw-red-hover"
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-cw-navy-light text-white"
                          : "text-gray-400 hover:bg-cw-navy-light hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-800 px-5 py-4">
            <Link
              href={baseUrl}
              className="text-xs text-gray-500 transition-colors hover:text-white"
            >
              ← Back to Public Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
