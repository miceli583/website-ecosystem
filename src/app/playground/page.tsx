import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import Link from "next/link";
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
} from "lucide-react";

// Animation showcase items
const ANIMATIONS = [
  {
    id: "golden-sunrays",
    title: "Golden Sunrays",
    description: "Radial ray burst effects with golden glow",
    icon: Sun,
    color: "amber",
    href: "/playground/golden-sunrays",
  },
  {
    id: "meteor-effect",
    title: "Meteor Effects",
    description: "Particle systems with beautiful meteor animations",
    icon: Star,
    color: "emerald",
    href: "/playground/meteor-effect",
  },
  {
    id: "quantum-orbital",
    title: "Quantum Orbital",
    description: "Atomic orbital visualization with particle physics",
    icon: Zap,
    color: "orange",
    href: "/playground/quantum-orbital",
  },
  {
    id: "gradient-waves",
    title: "Gradient Orbs",
    description: "Layered waves with floating orbs and smooth animations",
    icon: Waves,
    color: "blue",
    href: "/playground/gradient-waves",
  },
  {
    id: "particle-field",
    title: "Particle Field",
    description: "Floating particles with mesmerizing glow effects",
    icon: Sparkles,
    color: "purple",
    href: "/playground/particle-field",
  },
  {
    id: "morphing-buttons",
    title: "Morphing Buttons",
    description: "Interactive buttons with dynamic state morphing",
    icon: MousePointer,
    color: "indigo",
    href: "/playground/morphing-buttons",
  },
  {
    id: "text-shimmer",
    title: "Text Shimmer",
    description: "Gradient text animations with shimmer effects",
    icon: Type,
    color: "violet",
    href: "/playground/text-shimmer",
  },
  {
    id: "liquid-morph",
    title: "Liquid Morph",
    description: "Smooth blob morphing and liquid animations",
    icon: Heart,
    color: "pink",
    href: "/playground/liquid-morph",
  },
  {
    id: "geometric-shapes",
    title: "Geometric Shapes",
    description: "Animated SVG patterns and shape morphing",
    icon: Star,
    color: "orange",
    href: "/playground/geometric-shapes",
  },
];

export default function PlaygroundPage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="via-background dark:via-background min-h-full bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:from-violet-950/20 dark:to-purple-950/20">
          <div className="mx-auto max-w-7xl space-y-12">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-violet-400 dark:to-purple-400">
                  UI Playground
                </h1>
              </div>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Interactive UI components, animations, and experimental design
                patterns
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200"
                >
                  <Code className="mr-1 h-3 w-3" />
                  Experimental
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Interactive
                </Badge>
              </div>
            </div>

            {/* Animation Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ANIMATIONS.map((animation) => {
                const Icon = animation.icon;

                // Color mappings for borders
                const colorMap: Record<
                  string,
                  { light: string; dark: string; gradient: string }
                > = {
                  amber: {
                    light: "#fcd34d",
                    dark: "#f59e0b",
                    gradient: "from-amber-500 to-amber-600",
                  },
                  emerald: {
                    light: "#34d399",
                    dark: "#10b981",
                    gradient: "from-emerald-500 to-emerald-600",
                  },
                  orange: {
                    light: "#fb923c",
                    dark: "#f97316",
                    gradient: "from-orange-500 to-orange-600",
                  },
                  blue: {
                    light: "#60a5fa",
                    dark: "#3b82f6",
                    gradient: "from-blue-500 to-blue-600",
                  },
                  purple: {
                    light: "#a78bfa",
                    dark: "#8b5cf6",
                    gradient: "from-purple-500 to-purple-600",
                  },
                  indigo: {
                    light: "#818cf8",
                    dark: "#6366f1",
                    gradient: "from-indigo-500 to-indigo-600",
                  },
                  violet: {
                    light: "#a78bfa",
                    dark: "#8b5cf6",
                    gradient: "from-violet-500 to-violet-600",
                  },
                  pink: {
                    light: "#f472b6",
                    dark: "#ec4899",
                    gradient: "from-pink-500 to-pink-600",
                  },
                };

                const colors = colorMap[animation.color] ?? colorMap.violet!;

                return (
                  <Link key={animation.id} href={animation.href}>
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
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold">
                            {animation.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                          {animation.description}
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
            <div className="text-muted-foreground pt-8 text-center text-sm">
              <p>
                All components are built with modern CSS, React, and TypeScript.
                More GLSL shader animations coming soon!
              </p>
            </div>
          </div>
        </div>
      </PlaygroundLayout>
    </DomainLayout>
  );
}
