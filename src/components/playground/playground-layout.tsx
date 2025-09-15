"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Sparkles,
  Waves,
  Zap,
  Palette,
  Globe,
  Star,
  Heart,
  Eye,
  ChevronRight,
  Plus,
  Code,
  Sun,
} from "lucide-react";

interface PlaygroundItem {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  color: string;
}

const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: "overview",
    name: "Overview",
    description: "Interactive component showcase",
    icon: Eye,
    href: "/playground",
    color: "violet",
  },
  {
    id: "gradient-waves",
    name: "Gradient Waves",
    description: "Flowing animated gradients",
    icon: Waves,
    href: "/playground/gradient-waves",
    badge: "New",
    color: "blue",
  },
  {
    id: "particle-field",
    name: "Particle Field",
    description: "Interactive floating particles",
    icon: Sparkles,
    href: "/playground/particle-field",
    color: "purple",
  },
  {
    id: "aurora-glow",
    name: "Aurora Glow",
    description: "Northern lights effect",
    icon: Zap,
    href: "/playground/aurora-glow",
    color: "emerald",
  },
  {
    id: "geometric-shapes",
    name: "Geometric Shapes",
    description: "Animated SVG patterns",
    icon: Star,
    href: "/playground/geometric-shapes",
    color: "orange",
  },
  {
    id: "liquid-morph",
    name: "Liquid Morph",
    description: "Blob animation effects",
    icon: Heart,
    href: "/playground/liquid-morph",
    badge: "Beta",
    color: "pink",
  },
  {
    id: "radial-rays",
    name: "Radial Rays",
    description: "Rainbow sunburst with shimmer",
    icon: Sun,
    href: "/playground/radial-rays",
    badge: "New",
    color: "yellow",
  },
];

interface PlaygroundLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function PlaygroundLayout({
  children,
  title,
  description,
}: PlaygroundLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getCurrentItem = () => {
    return (
      PLAYGROUND_ITEMS.find((item) => item.href === pathname) ||
      PLAYGROUND_ITEMS[0]!
    );
  };

  const currentItem = getCurrentItem();

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-16"} bg-muted/20 border-r transition-all duration-300`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-semibold">Playground</h2>
                <p className="text-muted-foreground text-sm">
                  Animation Showcase
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {PLAYGROUND_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.id} href={item.href}>
                  <div
                    className={`group hover:bg-accent flex items-center rounded-lg p-3 transition-all duration-200 ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isActive
                          ? `bg-${item.color}-500 text-white`
                          : `bg-${item.color}-100 text-${item.color}-600 dark:bg-${item.color}-900/30 dark:text-${item.color}-400`
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {sidebarOpen && (
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs opacity-70">{item.description}</p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Add New Button */}
            {sidebarOpen && (
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="text-muted-foreground hover:text-foreground w-full justify-start"
                  disabled
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Animation
                  <Code className="ml-auto h-3 w-3" />
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Page Header */}
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-${currentItem.color}-500 to-${currentItem.color}-600`}
              >
                <currentItem.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  {title || currentItem.name}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {description || currentItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export { PLAYGROUND_ITEMS };
