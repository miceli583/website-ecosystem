"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Building,
  Rocket,
  Briefcase,
  Timer,
  Users,
  Zap,
  ExternalLink,
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ItemType = "template" | "landing";

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  type: ItemType;
  variants?: string[];
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "developer-profile",
    title: "Developer Profile",
    description: "Portfolio template for developers and designers",
    icon: User,
    href: "/admin/templates/developer-profile",
    type: "template",
  },
  {
    id: "saas-business",
    title: "SaaS Business",
    description: "Professional landing page for SaaS products",
    icon: Building,
    href: "/admin/templates/saas-business",
    type: "template",
  },
  {
    id: "startup",
    title: "Startup",
    description: "Modern startup landing page with animations",
    icon: Rocket,
    href: "/admin/templates/startup",
    type: "template",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Personal portfolio with smooth animations",
    icon: Briefcase,
    href: "/admin/templates/portfolio",
    type: "template",
  },
  {
    id: "countdown",
    title: "Countdown",
    description: "Countdown timer landing page with shader backgrounds",
    icon: Timer,
    href: "/admin/dope-ass-landing",
    type: "landing",
    variants: [
      "cosmic-blue",
      "deep-ocean",
      "blue-cyan",
      "earth-sky",
      "emerald-teal",
      "emerald",
      "forest-green",
      "teal",
    ],
  },
  {
    id: "waitlist",
    title: "Waitlist",
    description: "Community waitlist page with founding member offer",
    icon: Users,
    href: "/admin/join-community-1",
    type: "landing",
    variants: [
      "cosmic-blue",
      "deep-ocean",
      "blue-cyan",
      "earth-sky",
      "emerald-teal",
      "emerald",
      "forest-green",
      "teal",
    ],
  },
  {
    id: "launch",
    title: "Launch",
    description: "Launch party event page with countdown and details",
    icon: Zap,
    href: "/admin/launch-landing-1",
    type: "landing",
    variants: [
      "cosmic-blue",
      "deep-ocean",
      "blue-cyan",
      "earth-sky",
      "emerald-teal",
      "emerald",
      "forest-green",
      "teal",
    ],
  },
];

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Templates", value: "template" },
  { label: "Landing Pages", value: "landing" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

export default function WebDesignPage() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered =
    filter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.type === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.15) 0%, rgba(212,175,55,0.25) 100%)",
            }}
          >
            <Palette className="h-5 w-5" style={{ color: "#D4AF37" }} />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Quattrocento Sans', serif",
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Web Design Playground
          </h1>
        </div>
        <p className="text-sm text-white/50">
          Templates and landing pages — all open in new tabs for full-screen
          preview
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
            style={
              filter === f.value
                ? {
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    color: "#000",
                  }
                : {
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.6)",
                  }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group relative flex h-full flex-col rounded-xl p-5 transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
              }}
            >
              {/* Full-card click target */}
              <Link
                href={item.href}
                target="_blank"
                className="absolute inset-0 z-0 rounded-xl"
                aria-label={`Open ${item.title}`}
              />

              <div className="relative z-10 mb-3 flex items-center gap-3 pointer-events-none">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: "#D4AF37" }}
                  />
                </div>
                <span
                  className="rounded-md px-2 py-0.5 text-xs font-medium"
                  style={{
                    background:
                      item.type === "template"
                        ? "rgba(212,175,55,0.15)"
                        : "rgba(255,255,255,0.08)",
                    color:
                      item.type === "template"
                        ? "#D4AF37"
                        : "rgba(255,255,255,0.5)",
                  }}
                >
                  {item.type === "template" ? "Template" : "Landing Page"}
                </span>
              </div>

              <h3 className="relative z-10 mb-1 text-sm font-semibold text-white pointer-events-none">
                {item.title}
              </h3>
              <p className="relative z-10 mb-4 flex-1 text-xs leading-relaxed text-white/40 pointer-events-none">
                {item.description}
              </p>

              {/* Color variant chips for landing pages */}
              {item.variants && (
                <div className="relative z-10 mb-3 flex flex-wrap gap-1">
                  {item.variants.map((v) => (
                    <a
                      key={v}
                      href={`${item.href}/${v}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded px-1.5 py-0.5 text-[10px] text-white/50 transition-colors hover:text-white/80"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      {v}
                    </a>
                  ))}
                </div>
              )}

              <div className="relative z-10 flex items-center gap-1.5 text-xs font-medium pointer-events-none">
                <ExternalLink
                  className="h-3 w-3"
                  style={{ color: "#D4AF37" }}
                />
                <span style={{ color: "#D4AF37" }}>Open Preview</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
