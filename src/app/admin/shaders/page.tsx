"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { DomainLayout } from "~/components/domain-layout";
import { BackButton } from "~/components/back-button";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Suspense } from "react";

/**
 * GLSL Shaders Gallery - WebGL Shader Showcase
 *
 * Authentication is handled by middleware (src/middleware.ts)
 * This route was moved from /shaders to /admin/shaders to restrict access
 */

// GLSL Shader showcase items
const SHADERS = [
  {
    id: "north-star",
    title: "North Star",
    description: "Golden guiding beacon with radiant rays and pulsing energy",
    color: "amber",
    href: "/admin/shaders/north-star",
  },
  {
    id: "neural-net",
    title: "Neural Network",
    description: "Mesmerizing interconnected nodes pulsing with consciousness",
    color: "cyan",
    href: "/admin/shaders/neural-net",
  },
  {
    id: "flower-of-life",
    title: "Flower of Life",
    description: "Sacred geometry with glowing circles and mystical energy",
    color: "pink",
    href: "/admin/shaders/flower-of-life",
  },
  {
    id: "fractal-pyramid",
    title: "Fractal Pyramid",
    description: "Raymarched fractal geometry with rotating transformations",
    color: "purple",
    href: "/admin/shaders/fractal-pyramid",
  },
  {
    id: "the-way",
    title: "The Way",
    description:
      "A journey through flowing light, spiraling paths, and infinite consciousness",
    color: "blue",
    href: "/admin/shaders/the-way",
  },
  {
    id: "metatrons-cube",
    title: "Metatron's Cube",
    description:
      "Sacred geometry containing all five Platonic solids and the blueprint of creation",
    color: "emerald",
    href: "/admin/shaders/metatrons-cube",
  },
  {
    id: "icosahedron",
    title: "Icosahedron",
    description:
      "Floating 3D Platonic solid with 20 triangular faces, rotating in space",
    color: "orange",
    href: "/admin/shaders/icosahedron",
  },
];

function ShadersContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  return (
    <div className="via-background dark:via-background min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent dark:from-violet-400 dark:to-purple-400">
              GLSL Shaders
            </h1>
          </div>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Explore beautiful WebGL shader animations powered by GLSL in
            Shadertoy format
          </p>
        </div>

        {/* Shader Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SHADERS.map((shader) => {
            // Color mappings for borders
            const colorMap: Record<string, { dark: string; gradient: string }> =
              {
                amber: {
                  dark: "#f59e0b",
                  gradient: "from-amber-500 to-amber-600",
                },
                cyan: {
                  dark: "#06b6d4",
                  gradient: "from-cyan-500 to-cyan-600",
                },
                purple: {
                  dark: "#8b5cf6",
                  gradient: "from-purple-500 to-purple-600",
                },
                blue: {
                  dark: "#3b82f6",
                  gradient: "from-blue-500 to-blue-600",
                },
                pink: {
                  dark: "#ec4899",
                  gradient: "from-pink-500 to-pink-600",
                },
                emerald: {
                  dark: "#10b981",
                  gradient: "from-emerald-500 to-emerald-600",
                },
                orange: {
                  dark: "#f97316",
                  gradient: "from-orange-500 to-orange-600",
                },
              };

            const colors = colorMap[shader.color] ?? colorMap.purple!;

            return (
              <Link key={shader.id} href={`${shader.href}${domainParam}`}>
                <Card
                  className="group h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    borderColor: colors.dark,
                    borderWidth: "1px",
                  }}
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${colors.gradient}`}
                      >
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold">{shader.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                      {shader.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-400">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-muted-foreground pt-16 text-center text-sm">
          <p>Interactive GLSL shader animations rendered in real-time</p>
        </div>
      </div>
    </div>
  );
}

function ShadersPageContent() {
  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <ShadersContent />
      </Suspense>
    </DomainLayout>
  );
}

export default function ShadersPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ShadersPageContent />
    </Suspense>
  );
}
