"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  FileText,
  Wrench,
  StickyNote,
  FolderKanban,
  CreditCard,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "~/lib/utils";

const NAV_ITEMS = [
  { title: "Demos", icon: Play, active: true },
  { title: "Proposals", icon: FileText, active: false },
  { title: "Tooling", icon: Wrench, active: false },
  { title: "Notes", icon: StickyNote, active: false },
  { title: "Projects", icon: FolderKanban, active: false },
  { title: "Billing", icon: CreditCard, active: false },
  { title: "Profile", icon: UserCircle, active: false },
];

const MOCK_CLIENT = {
  name: "Bioregion Labs",
  company: "Bioregion Labs",
};

export default function ShowcasePortalPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-black">
      <Link
        href="/showcase#demos"
        className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>

      {/* Sidebar */}
      <aside
        className="flex flex-shrink-0 flex-col border-r transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          borderColor: "rgba(212, 175, 55, 0.15)",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Logo + Client */}
        <div
          className="flex items-center gap-3 border-b p-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
        >
          <Image
            src="/brand/miracle-mind-orbit-star-v3.svg"
            alt="Logo"
            width={32}
            height={32}
            className="shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {MOCK_CLIENT.name}
              </p>
              <p className="truncate text-xs text-gray-400">Client Portal</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.title}
              className={cn(
                "flex cursor-default items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div
          className="border-t p-3"
          style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-md py-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-2xl font-bold text-white">
            Welcome, Bioregion Labs
          </h1>
          <p className="mb-8 text-sm text-gray-400">
            Your project dashboard and resources
          </p>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FolderKanban,
                label: "Active Projects",
                value: "3",
                sub: "1 completed",
              },
              {
                icon: BarChart3,
                label: "Demos",
                value: "4",
                sub: "2 shared publicly",
              },
              {
                icon: TrendingUp,
                label: "This Month",
                value: "$2,400",
                sub: "Invoiced",
              },
              {
                icon: Clock,
                label: "Next Milestone",
                value: "Apr 5",
                sub: "Dashboard v2 delivery",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border bg-white/5 p-4"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
                  <stat.icon
                    className="h-3.5 w-3.5"
                    style={{ color: "#D4AF37" }}
                  />
                  {stat.label}
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <h2 className="mb-4 font-semibold text-white">Recent Activity</h2>
          <div
            className="space-y-3 rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            {[
              {
                icon: CheckCircle,
                text: "Soil Health Dashboard — Phase 1 completed",
                time: "2 days ago",
              },
              {
                icon: FileText,
                text: "New proposal uploaded: Canopy Tracker v2",
                time: "4 days ago",
              },
              {
                icon: StickyNote,
                text: "Note added: API integration requirements",
                time: "1 week ago",
              },
              {
                icon: Play,
                text: "Demo shared: Watershed Management preview",
                time: "1 week ago",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
                style={{ borderColor: "rgba(212, 175, 55, 0.08)" }}
              >
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]/60" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white/70">{item.text}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
