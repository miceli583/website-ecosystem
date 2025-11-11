"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Sparkles,
  Waves,
  Star,
  Heart,
  Eye,
  ChevronRight,
  Sun,
  Type,
  MousePointer,
  Zap,
  Home,
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
    href: "/admin/playground",
    color: "violet",
  },
  {
    id: "golden-sunrays",
    name: "Golden Sunrays",
    description: "Radial ray burst effects",
    icon: Sun,
    href: "/admin/playground/golden-sunrays",
    color: "amber",
  },
  {
    id: "meteor-effect",
    name: "Meteor Effects",
    description: "Particle system meteor animations",
    icon: Star,
    href: "/admin/playground/meteor-effect",
    color: "emerald",
  },
  {
    id: "quantum-orbital",
    name: "Quantum Orbital",
    description: "Atomic orbital visualization",
    icon: Zap,
    href: "/admin/playground/quantum-orbital",
    color: "orange",
  },
  {
    id: "gradient-waves",
    name: "Gradient Orbs",
    description: "Layered waves with floating orbs",
    icon: Waves,
    href: "/admin/playground/gradient-waves",
    color: "blue",
  },
  {
    id: "particle-field",
    name: "Particle Field",
    description: "Floating particles with glow",
    icon: Sparkles,
    href: "/admin/playground/particle-field",
    color: "purple",
  },
  {
    id: "morphing-buttons",
    name: "Morphing Buttons",
    description: "Interactive button state morphing",
    icon: MousePointer,
    href: "/admin/playground/morphing-buttons",
    color: "indigo",
  },
  {
    id: "text-shimmer",
    name: "Text Shimmer",
    description: "Gradient text with shimmer effects",
    icon: Type,
    href: "/admin/playground/text-shimmer",
    color: "violet",
  },
  {
    id: "liquid-morph",
    name: "Liquid Morph",
    description: "Blob animation effects",
    icon: Heart,
    href: "/admin/playground/liquid-morph",
    color: "pink",
  },
  {
    id: "geometric-shapes",
    name: "Geometric Shapes",
    description: "Animated SVG patterns",
    icon: Star,
    href: "/admin/playground/geometric-shapes",
    color: "orange",
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
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";
  const isOverview = pathname === "/admin/playground";
  const [sidebarOpen, setSidebarOpen] = useState(!isOverview);

  const getCurrentItem = () => {
    return (
      PLAYGROUND_ITEMS.find((item) => item.href === pathname) ||
      PLAYGROUND_ITEMS[0]!
    );
  };

  const currentItem = getCurrentItem();

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar - Hidden on overview */}
      {!isOverview && (
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
                  <Link key={item.id} href={`${item.href}${domainParam}`}>
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
                          <p className="text-xs opacity-70">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Page Header - Hidden on overview */}
        {!isOverview && (
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
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>

      {/* Floating back button at bottom left - only show on overview */}
      {isOverview && (
        <Link href={`/admin${domainParam}`}>
          <Button
            size="lg"
            className="fixed bottom-6 left-6 z-50 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Hub
          </Button>
        </Link>
      )}
    </div>
  );
}

export { PLAYGROUND_ITEMS };
