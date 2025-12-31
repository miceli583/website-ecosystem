"use client";

import { useState, Suspense } from "react";
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
  ArrowLeft,
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

function PlaygroundLayoutContent({
  children,
  title,
  description,
}: PlaygroundLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  // Detect if we're in admin or public playground
  const isAdminPlayground = pathname.startsWith("/admin/playground");
  const basePath = isAdminPlayground ? "/admin/playground" : "/playground";
  const backPath = isAdminPlayground ? "/admin" : "/?domain=matthew";

  const isOverview = pathname === basePath;
  const [sidebarOpen, setSidebarOpen] = useState(!isOverview);

  // Generate items with correct base path
  const playgroundItems = PLAYGROUND_ITEMS.map((item) => ({
    ...item,
    href: item.href.replace("/admin/playground", basePath),
  }));

  const getCurrentItem = () => {
    return (
      playgroundItems.find((item) => item.href === pathname) ||
      playgroundItems[0]!
    );
  };

  const currentItem = getCurrentItem();

  return (
    <div className="bg-background flex min-h-screen">
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>

      {/* Floating back button at top left */}
      <Link href={isOverview ? `${backPath}${domainParam}` : `${basePath}${domainParam}`}>
        <Button
          size="lg"
          className="fixed top-6 left-6 z-50 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)',
            color: '#000000'
          }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      </Link>
    </div>
  );
}

export function PlaygroundLayout(props: PlaygroundLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <PlaygroundLayoutContent {...props} />
    </Suspense>
  );
}

export { PLAYGROUND_ITEMS };
