import { PlaygroundLayout } from "~/components/playground/playground-layout";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI Playground | Matthew Miceli",
  description:
    "Explore interactive UI components and animations built with React, TypeScript, and Tailwind CSS",
};
import {
  Sparkles,
  Code,
  Eye,
  ArrowRight,
  Waves,
  Star,
  Heart,
  Type,
  MousePointer,
  Sun,
  Zap,
  Circle,
} from "lucide-react";

/**
 * Public Playground - UI Component Showcase
 *
 * This is the public-facing version accessible from matthewmiceli.com
 * Unlike the admin version, this doesn't require authentication
 */

// Animation showcase items
const ANIMATIONS = [
  {
    id: "gradient-waves",
    title: "Gradient Orbs",
    description: "Floating gradient orbs with mesmerizing motion",
    icon: Circle,
    color: "from-blue-500 to-cyan-500",
    href: "/playground/gradient-waves",
  },
  {
    id: "particle-field",
    title: "Particle Field",
    description: "Interactive particle system with mouse tracking",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    href: "/playground/particle-field",
  },
  {
    id: "meteor-effect",
    title: "Meteor Shower",
    description: "Animated meteors streaking across the sky",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    href: "/playground/meteor-effect",
  },
  {
    id: "text-shimmer",
    title: "Text Shimmer",
    description: "Shimmering text effect with gradient animation",
    icon: Type,
    color: "from-indigo-500 to-purple-500",
    href: "/playground/text-shimmer",
  },
  {
    id: "morphing-buttons",
    title: "Morphing Buttons",
    description: "Buttons that transform and animate on interaction",
    icon: MousePointer,
    color: "from-green-500 to-emerald-500",
    href: "/playground/morphing-buttons",
  },
  {
    id: "liquid-morph",
    title: "Liquid Morph",
    description: "Fluid morphing shapes with liquid-like transitions",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    href: "/playground/liquid-morph",
  },
  {
    id: "golden-sunrays",
    title: "Golden Sunrays",
    description: "Radiant golden rays emanating from center",
    icon: Sun,
    color: "from-amber-500 to-yellow-500",
    href: "/playground/golden-sunrays",
  },
  {
    id: "quantum-orbital",
    title: "Quantum Orbital",
    description: "Orbiting particles with quantum-inspired motion",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    href: "/playground/quantum-orbital",
  },
  {
    id: "geometric-shapes",
    title: "Geometric Shapes",
    description: "Animated geometric patterns and transformations",
    icon: Code,
    color: "from-violet-500 to-purple-500",
    href: "/playground/geometric-shapes",
  },
];

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const params = await searchParams;
  const domainParam = params.domain ? `?domain=${params.domain}` : "";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaygroundLayout>
        <div className="via-background dark:via-background min-h-full bg-gradient-to-br from-amber-50 to-yellow-50 p-6 dark:from-amber-950/20 dark:to-yellow-950/20" style={{ background: 'linear-gradient(135deg, rgba(246, 230, 193, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)' }}>
            <div className="mx-auto max-w-7xl space-y-12">
              {/* Header */}
              <div className="space-y-4 text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Sparkles className="h-10 w-10" style={{ color: '#D4AF37' }} />
                  <h1 className="text-5xl font-bold" style={{
                    background: 'linear-gradient(to right, #D4AF37, #B8942A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    UI Playground
                  </h1>
                </div>
                <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                  Explore interactive UI components and animations built with
                  React, TypeScript, and Tailwind CSS
                </p>
              </div>

              {/* Animation Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ANIMATIONS.map((animation) => {
                  const Icon = animation.icon;
                  return (
                    <Link
                      key={animation.id}
                      href={`${animation.href}${domainParam}`}
                    >
                      <Card className="group h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', borderWidth: '1px' }}>
                        <CardContent className="flex h-full flex-col p-6">
                          <div className="mb-4 flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${animation.color}`}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold">
                              {animation.title}
                            </h3>
                          </div>
                          <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                            {animation.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#D4AF37' }}>
                            <span>View Demo</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="text-muted-foreground pt-8 text-center text-sm">
                <p>
                  All components are built with modern web technologies and are
                  fully customizable
                </p>
              </div>
            </div>
          </div>
        </PlaygroundLayout>
      </Suspense>
  );
}
