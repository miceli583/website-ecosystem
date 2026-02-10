"use client";

import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Waves,
  Star,
  Heart,
  Type,
  MousePointer,
  Sun,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ANIMATIONS: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}[] = [
  {
    id: "golden-sunrays",
    title: "Golden Sunrays",
    description: "Radial ray burst effects with golden glow",
    icon: Sun,
    href: "/admin/playground/golden-sunrays",
  },
  {
    id: "meteor-effect",
    title: "Meteor Effects",
    description: "Particle systems with beautiful meteor animations",
    icon: Star,
    href: "/admin/playground/meteor-effect",
  },
  {
    id: "quantum-orbital",
    title: "Quantum Orbital",
    description: "Atomic orbital visualization with particle physics",
    icon: Zap,
    href: "/admin/playground/quantum-orbital",
  },
  {
    id: "gradient-waves",
    title: "Gradient Orbs",
    description: "Layered waves with floating orbs and smooth animations",
    icon: Waves,
    href: "/admin/playground/gradient-waves",
  },
  {
    id: "particle-field",
    title: "Particle Field",
    description: "Floating particles with mesmerizing glow effects",
    icon: Sparkles,
    href: "/admin/playground/particle-field",
  },
  {
    id: "morphing-buttons",
    title: "Morphing Buttons",
    description: "Interactive buttons with dynamic state morphing",
    icon: MousePointer,
    href: "/admin/playground/morphing-buttons",
  },
  {
    id: "text-shimmer",
    title: "Text Shimmer",
    description: "Gradient text animations with shimmer effects",
    icon: Type,
    href: "/admin/playground/text-shimmer",
  },
  {
    id: "liquid-morph",
    title: "Liquid Morph",
    description: "Smooth blob morphing and liquid animations",
    icon: Heart,
    href: "/admin/playground/liquid-morph",
  },
  {
    id: "geometric-shapes",
    title: "Geometric Shapes",
    description: "Animated SVG patterns and shape morphing",
    icon: Star,
    href: "/admin/playground/geometric-shapes",
  },
];

export default function PlaygroundPage() {
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
            <Sparkles className="h-5 w-5" style={{ color: "#D4AF37" }} />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Quattrocento Sans', serif",
              letterSpacing: "0.08em",
              background:
                "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            UI Playground
          </h1>
        </div>
        <p className="text-sm text-white/50">
          Interactive UI components and animations — each opens in a new tab
        </p>
      </div>

      {/* Animation Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ANIMATIONS.map((animation) => {
          const Icon = animation.icon;
          return (
            <Link
              key={animation.id}
              href={animation.href}
              target="_blank"
            >
              <div
                className="group flex h-full cursor-pointer flex-col rounded-xl p-5 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
                }}
              >
                <div className="mb-3 flex items-center gap-3">
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
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white">
                  {animation.title}
                </h3>
                <p className="mb-4 flex-1 text-xs leading-relaxed text-white/40">
                  {animation.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <ExternalLink
                    className="h-3 w-3"
                    style={{ color: "#D4AF37" }}
                  />
                  <span style={{ color: "#D4AF37" }}>Open Demo</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
