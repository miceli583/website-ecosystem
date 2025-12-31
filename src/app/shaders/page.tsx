"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft, Sparkles, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";

/**
 * Public GLSL Shaders Gallery
 *
 * This is the public-facing version accessible from matthewmiceli.com
 * Unlike the admin version, this doesn't require authentication
 */

// GLSL Shader showcase items
const SHADERS = [
  {
    id: "north-star",
    title: "North Star",
    description: "Golden guiding beacon with radiant rays and pulsing energy",
    color: "amber",
    href: "/shaders/north-star",
  },
  {
    id: "neural-net",
    title: "Neural Network",
    description: "Mesmerizing interconnected nodes pulsing with consciousness",
    color: "cyan",
    href: "/shaders/neural-net",
  },
  {
    id: "flower-of-life",
    title: "Flower of Life",
    description: "Sacred geometry with glowing circles and mystical energy",
    color: "pink",
    href: "/shaders/flower-of-life",
  },
  {
    id: "fractal-pyramid",
    title: "Fractal Pyramid",
    description: "Raymarched fractal geometry with rotating transformations",
    color: "purple",
    href: "/shaders/fractal-pyramid",
  },
  {
    id: "the-way",
    title: "The Way",
    description:
      "A journey through flowing light, spiraling paths, and infinite consciousness",
    color: "blue",
    href: "/shaders/the-way",
  },
  {
    id: "metatrons-cube",
    title: "Metatron's Cube",
    description:
      "Sacred geometry containing all five Platonic solids and the blueprint of creation",
    color: "emerald",
    href: "/shaders/metatrons-cube",
  },
  {
    id: "icosahedron",
    title: "Icosahedron",
    description:
      "Floating 3D Platonic solid with 20 triangular faces, rotating in space",
    color: "orange",
    href: "/shaders/icosahedron",
  },
];

function ShadersPageContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  return (
    <div className="via-background dark:via-background min-h-screen p-6" style={{ background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)' }}>
        {/* Floating back button at top left */}
        <Link href={`/?domain=matthew${domainParam ? `&${domainParam.slice(1)}` : ''}`}>
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

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <Zap className="h-10 w-10" style={{ color: '#D4AF37' }} />
              <h1 className="text-5xl font-bold" style={{
                background: 'linear-gradient(to right, #D4AF37, #B8942A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
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
              const colorMap: Record<
                string,
                { dark: string; gradient: string }
              > = {
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
                        <h3 className="text-lg font-semibold">
                          {shader.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                        {shader.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#D4AF37' }}>
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

export default function ShadersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ShadersPageContent />
    </Suspense>
  );
}
