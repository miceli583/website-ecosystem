import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import Link from "next/link";
import {
  Palette,
  Layers,
  Sparkles,
  Zap,
  Code,
  Paintbrush,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Settings,
  RefreshCw,
  Play,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  ArrowRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  Type,
  Rocket,
  Building,
  User,
  ExternalLink,
  Sun,
} from "lucide-react";

export default function PlaygroundPage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="via-background dark:via-background min-h-full bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:from-violet-950/20 dark:to-purple-950/20">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header */}
            <div className="space-y-4 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-violet-400 dark:to-purple-400">
                  UI/UX Playground
                </h1>
              </div>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Advanced interface components and experimental design patterns
                for MiracleMind
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

            {/* Svelte-Inspired Animations */}
            <Card className="border-gradient border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  Svelte-Inspired Animations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Link href="/playground/text-shimmer">
                    <Card className="group cursor-pointer border-violet-200 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-violet-800">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <Type className="h-5 w-5 text-violet-600" />
                          <h3 className="font-semibold">Text Shimmer</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Gradient text animations with shimmer effects
                        </p>
                        <ArrowRight className="mt-3 h-4 w-4 text-violet-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/morphing-buttons">
                    <Card className="group cursor-pointer border-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-purple-800">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <MousePointer className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold">Morphing Buttons</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Interactive buttons with state morphing
                        </p>
                        <ArrowRight className="mt-3 h-4 w-4 text-purple-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/meteor-effect">
                    <Card className="group cursor-pointer border-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-emerald-800">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <Star className="h-5 w-5 text-emerald-600" />
                          <h3 className="font-semibold">Meteor Effects</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Particle systems and meteor animations
                        </p>
                        <ArrowRight className="mt-3 h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Existing Animations */}
            <Card className="border-gradient border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Interactive Animations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <Link href="/playground/aurora-glow">
                    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-violet-600" />
                          <h4 className="text-sm font-medium">Aurora Glow</h4>
                        </div>
                        <ArrowRight className="h-3 w-3 text-violet-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/geometric-shapes">
                    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Triangle className="h-4 w-4 text-emerald-600" />
                          <h4 className="text-sm font-medium">Geometric</h4>
                        </div>
                        <ArrowRight className="h-3 w-3 text-emerald-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/gradient-waves">
                    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Palette className="h-4 w-4 text-blue-600" />
                          <h4 className="text-sm font-medium">Waves</h4>
                        </div>
                        <ArrowRight className="h-3 w-3 text-blue-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/liquid-morph">
                    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Circle className="h-4 w-4 text-purple-600" />
                          <h4 className="text-sm font-medium">Liquid</h4>
                        </div>
                        <ArrowRight className="h-3 w-3 text-purple-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/particle-field">
                    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Star className="h-4 w-4 text-orange-600" />
                          <h4 className="text-sm font-medium">Particles</h4>
                        </div>
                        <ArrowRight className="h-3 w-3 text-orange-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                <div className="mt-4">
                  <Link href="/playground/golden-sunrays">
                    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-600" />
                          <h4 className="text-sm font-medium">
                            Golden Sunrays
                          </h4>
                        </div>
                        <p className="text-muted-foreground mb-2 text-xs">
                          Flowing golden rays from above
                        </p>
                        <ArrowRight className="h-3 w-3 text-yellow-600 transition-transform group-hover:translate-x-1" />
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Template Gallery */}
            <Card className="border-gradient border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Rocket className="h-5 w-5 text-orange-600" />
                  Template Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Link href="/playground/templates/developer-profile">
                    <Card className="group cursor-pointer border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-blue-800">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <User className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">Developer Profile</h3>
                        </div>
                        <p className="text-muted-foreground mb-3 text-sm">
                          Portfolio template for developers and designers
                        </p>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-blue-600">
                            View Template
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/templates/saas-business">
                    <Card className="group cursor-pointer border-green-200 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-green-800">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <Building className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold">SaaS Business</h3>
                        </div>
                        <p className="text-muted-foreground mb-3 text-sm">
                          Professional landing page for SaaS products
                        </p>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            View Template
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/playground/templates/startup">
                    <Card className="group cursor-pointer border-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:border-purple-800">
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <Rocket className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold">Startup</h3>
                        </div>
                        <p className="text-muted-foreground mb-3 text-sm">
                          Modern startup landing page with animations
                        </p>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3 text-purple-600" />
                          <span className="text-xs text-purple-600">
                            View Template
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Component Sections */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Interactive Elements */}
              <Card className="border-violet-200 dark:border-violet-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="h-5 w-5 text-violet-600" />
                    Interactive Elements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Animated Buttons */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Animated Buttons
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Button className="group bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                        <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                        Magic Button
                      </Button>
                      <Button
                        variant="outline"
                        className="group border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950"
                      >
                        <Zap className="mr-2 h-4 w-4 text-violet-600 transition-transform group-hover:scale-125" />
                        Power Up
                      </Button>
                      <Button
                        size="sm"
                        className="group bg-gradient-to-r from-emerald-500 to-teal-600"
                      >
                        <Play className="mr-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        Start
                      </Button>
                    </div>
                  </div>

                  {/* Shape Animations */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Animated Shapes
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 animate-pulse cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 transition-transform hover:scale-110">
                        <Circle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex h-12 w-12 rotate-45 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform duration-500 hover:rotate-90">
                        <Square className="h-6 w-6 -rotate-45 text-white" />
                      </div>
                      <div className="clip-triangle flex h-12 w-12 cursor-pointer items-center justify-center bg-gradient-to-br from-orange-500 to-red-600 transition-transform hover:scale-125">
                        <Triangle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 transition-all hover:animate-spin">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Micro Interactions */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Micro Interactions
                    </h3>
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        className="group hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Heart className="h-4 w-4 transition-all group-hover:fill-red-500 group-hover:text-red-500" />
                      </Button>
                      <Button size="icon" variant="outline" className="group">
                        <RefreshCw className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" />
                      </Button>
                      <Button size="icon" variant="outline" className="group">
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="group hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <X className="h-4 w-4 transition-all group-hover:rotate-90 group-hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Layout Experiments */}
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-purple-600" />
                    Layout Experiments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Glass Morphism Cards */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Glass Morphism
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex h-20 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-lg">
                        <span className="text-sm font-medium">Glass Card</span>
                      </div>
                      <div className="flex h-20 items-center justify-center rounded-lg border border-violet-200/30 bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-lg dark:border-violet-700/30">
                        <span className="text-sm font-medium">
                          Tinted Glass
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Neumorphism */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Neumorphism
                    </h3>
                    <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                      <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.7),inset_2px_2px_6px_rgba(0,0,0,0.15)] dark:bg-gray-800 dark:shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.1),inset_2px_2px_6px_rgba(0,0,0,0.4)]">
                        <span className="text-xs">Inset</span>
                      </div>
                      <div className="flex h-16 items-center justify-center rounded-lg bg-gray-100 shadow-[-2px_-2px_6px_rgba(255,255,255,0.7),2px_2px_6px_rgba(0,0,0,0.15)] dark:bg-gray-800 dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.1),2px_2px_6px_rgba(0,0,0,0.4)]">
                        <span className="text-xs">Raised</span>
                      </div>
                    </div>
                  </div>

                  {/* Responsive Preview */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Device Preview
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/50 flex items-center gap-1 rounded-lg p-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="text-xs">Mobile</span>
                      </div>
                      <div className="bg-muted flex items-center gap-1 rounded-lg p-2">
                        <Tablet className="h-4 w-4" />
                        <span className="text-xs">Tablet</span>
                      </div>
                      <div className="bg-muted/50 flex items-center gap-1 rounded-lg p-2">
                        <Monitor className="h-4 w-4" />
                        <span className="text-xs">Desktop</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Color & Typography */}
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-emerald-600" />
                    Color & Typography
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Brand Colors */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Brand Palette
                    </h3>
                    <div className="grid grid-cols-6 gap-2">
                      <div className="flex h-12 items-end rounded-lg bg-violet-500 p-1">
                        <span className="font-mono text-xs text-white">
                          500
                        </span>
                      </div>
                      <div className="flex h-12 items-end rounded-lg bg-purple-500 p-1">
                        <span className="font-mono text-xs text-white">
                          500
                        </span>
                      </div>
                      <div className="flex h-12 items-end rounded-lg bg-emerald-500 p-1">
                        <span className="font-mono text-xs text-white">
                          500
                        </span>
                      </div>
                      <div className="flex h-12 items-end rounded-lg bg-teal-500 p-1">
                        <span className="font-mono text-xs text-white">
                          500
                        </span>
                      </div>
                      <div className="flex h-12 items-end rounded-lg bg-orange-500 p-1">
                        <span className="font-mono text-xs text-white">
                          500
                        </span>
                      </div>
                      <div className="flex h-12 items-end rounded-lg bg-pink-500 p-1">
                        <span className="font-mono text-xs text-white">
                          500
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Typography Scale */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Typography
                    </h3>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold">Heading 1</p>
                      <p className="text-2xl font-semibold">Heading 2</p>
                      <p className="text-xl font-medium">Heading 3</p>
                      <p className="text-base">Body Text</p>
                      <p className="text-muted-foreground text-sm">
                        Small Text
                      </p>
                      <p className="font-mono text-xs tracking-wider uppercase">
                        Label
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Components */}
              <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Advanced Components
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Indicators */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Progress
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-muted h-2 w-full rounded-full">
                        <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"></div>
                      </div>
                      <div className="bg-muted h-1 w-full rounded-full">
                        <div className="h-1 w-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-pulse rounded-full bg-violet-500"></div>
                        <div
                          className="h-4 w-4 animate-pulse rounded-full bg-purple-500"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-4 w-4 animate-pulse rounded-full bg-emerald-500"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Status
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                        <span className="text-sm">Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span className="text-sm">Offline</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Cards */}
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                      Interactive Cards
                    </h3>
                    <div className="group cursor-pointer rounded-lg border p-4 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Hover Effect</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Interactive card with smooth transitions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Svelte-Inspired Interactive Components */}
            <Card className="border-gradient border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  Interactive Svelte Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {/* Bouncing Ball */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      Bouncing Ball
                    </h3>
                    <div className="svelte-bouncing-container relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                      <div className="svelte-bouncing-ball"></div>
                    </div>
                  </div>

                  {/* Morphing Shape */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      Morphing Shape
                    </h3>
                    <div className="relative flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
                      <div className="svelte-morph-shape"></div>
                    </div>
                  </div>

                  {/* Floating Hearts */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      Floating Hearts
                    </h3>
                    <div className="svelte-hearts-container relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
                      <div className="svelte-heart svelte-heart-1">💖</div>
                      <div className="svelte-heart svelte-heart-2">💕</div>
                      <div className="svelte-heart svelte-heart-3">💝</div>
                    </div>
                  </div>

                  {/* Pulsing Rings */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      Pulsing Rings
                    </h3>
                    <div className="relative flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                      <div className="svelte-pulse-ring svelte-pulse-ring-1"></div>
                      <div className="svelte-pulse-ring svelte-pulse-ring-2"></div>
                      <div className="svelte-pulse-ring svelte-pulse-ring-3"></div>
                      <div className="svelte-pulse-center"></div>
                    </div>
                  </div>

                  {/* Rotating Squares */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      Rotating Squares
                    </h3>
                    <div className="relative flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                      <div className="svelte-rotating-container">
                        <div className="svelte-rotating-square svelte-square-1"></div>
                        <div className="svelte-rotating-square svelte-square-2"></div>
                        <div className="svelte-rotating-square svelte-square-3"></div>
                      </div>
                    </div>
                  </div>

                  {/* Wave Animation */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      Wave Effect
                    </h3>
                    <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
                      <div className="svelte-wave svelte-wave-1"></div>
                      <div className="svelte-wave svelte-wave-2"></div>
                      <div className="svelte-wave svelte-wave-3"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experimental Section */}
            <Card className="border-gradient border-2">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Paintbrush className="h-5 w-5 text-violet-600" />
                  Layout Experiments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* CSS Grid Playground */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      CSS Grid
                    </h3>
                    <div className="grid h-32 grid-cols-3 gap-2">
                      <div className="col-span-2 flex items-center justify-center rounded bg-violet-100 transition-all duration-300 hover:scale-105 dark:bg-violet-900/30">
                        <span className="text-xs">Main</span>
                      </div>
                      <div className="flex items-center justify-center rounded bg-purple-100 transition-all duration-300 hover:scale-105 dark:bg-purple-900/30">
                        <span className="text-xs">Side</span>
                      </div>
                      <div className="col-span-3 flex items-center justify-center rounded bg-emerald-100 transition-all duration-300 hover:scale-105 dark:bg-emerald-900/30">
                        <span className="text-xs">Footer</span>
                      </div>
                    </div>
                  </div>

                  {/* Flexbox Playground */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">Flexbox</h3>
                    <div className="flex h-32 flex-col gap-2">
                      <div className="flex flex-1 gap-2">
                        <div className="flex flex-1 items-center justify-center rounded bg-orange-100 transition-all duration-300 hover:scale-105 dark:bg-orange-900/30">
                          <span className="text-xs">A</span>
                        </div>
                        <div className="flex flex-1 items-center justify-center rounded bg-pink-100 transition-all duration-300 hover:scale-105 dark:bg-pink-900/30">
                          <span className="text-xs">B</span>
                        </div>
                      </div>
                      <div className="flex h-8 items-center justify-center rounded bg-teal-100 transition-all duration-300 hover:scale-105 dark:bg-teal-900/30">
                        <span className="text-xs">Full Width</span>
                      </div>
                    </div>
                  </div>

                  {/* Animation Playground */}
                  <div className="space-y-3">
                    <h3 className="text-center text-sm font-medium">
                      Hover Effects
                    </h3>
                    <div className="bg-muted/50 relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
                      <div className="group cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-violet-500 transition-all duration-500 group-hover:scale-150 group-hover:rotate-180"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PlaygroundLayout>
    </DomainLayout>
  );
}

// Global styles for Svelte-inspired animations
const globalStyles = `
  /* Bouncing Ball */
  .svelte-bouncing-ball {
    position: absolute;
    width: 24px;
    height: 24px;
    background: linear-gradient(45deg, #8b5cf6, #ec4899);
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
    animation: svelte-bounce 2s ease-in-out infinite;
  }

  @keyframes svelte-bounce {
    0%, 100% {
      top: 80%;
      left: 20px;
      transform: scale(1);
    }
    25% {
      top: 20%;
      left: 40%;
      transform: scale(0.8);
    }
    50% {
      top: 80%;
      left: 60%;
      transform: scale(1.1);
    }
    75% {
      top: 20%;
      left: 80%;
      transform: scale(0.9);
    }
  }

  /* Morphing Shape */
  .svelte-morph-shape {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #10b981, #06b6d4);
    animation: svelte-morph 3s ease-in-out infinite;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  @keyframes svelte-morph {
    0%, 100% {
      border-radius: 50%;
      transform: rotate(0deg) scale(1);
    }
    25% {
      border-radius: 25%;
      transform: rotate(90deg) scale(1.2);
    }
    50% {
      border-radius: 0%;
      transform: rotate(180deg) scale(0.8);
    }
    75% {
      border-radius: 25%;
      transform: rotate(270deg) scale(1.1);
    }
  }

  /* Floating Hearts */
  .svelte-heart {
    position: absolute;
    font-size: 20px;
    animation: svelte-float-hearts 4s ease-in-out infinite;
  }

  .svelte-heart-1 {
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }

  .svelte-heart-2 {
    top: 60%;
    left: 60%;
    animation-delay: 1.3s;
  }

  .svelte-heart-3 {
    top: 40%;
    left: 80%;
    animation-delay: 2.6s;
  }

  @keyframes svelte-float-hearts {
    0%, 100% {
      transform: translateY(0px) scale(1);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-20px) scale(1.3);
      opacity: 1;
    }
  }

  /* Pulsing Rings */
  .svelte-pulse-ring {
    position: absolute;
    border: 2px solid #f97316;
    border-radius: 50%;
    animation: svelte-pulse 2s ease-out infinite;
  }

  .svelte-pulse-ring-1 {
    width: 40px;
    height: 40px;
    animation-delay: 0s;
  }

  .svelte-pulse-ring-2 {
    width: 60px;
    height: 60px;
    animation-delay: 0.7s;
  }

  .svelte-pulse-ring-3 {
    width: 80px;
    height: 80px;
    animation-delay: 1.4s;
  }

  .svelte-pulse-center {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #f97316;
    border-radius: 50%;
    z-index: 10;
  }

  @keyframes svelte-pulse {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  /* Rotating Squares */
  .svelte-rotating-container {
    position: relative;
    width: 60px;
    height: 60px;
  }

  .svelte-rotating-square {
    position: absolute;
    background: linear-gradient(45deg, #8b5cf6, #6366f1);
    animation: svelte-rotate-squares 4s linear infinite;
  }

  .svelte-square-1 {
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    animation-delay: 0s;
  }

  .svelte-square-2 {
    width: 16px;
    height: 16px;
    top: 22px;
    left: 22px;
    animation-delay: 1.3s;
  }

  .svelte-square-3 {
    width: 12px;
    height: 12px;
    top: 44px;
    left: 44px;
    animation-delay: 2.6s;
  }

  @keyframes svelte-rotate-squares {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.5);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }

  /* Wave Animation */
  .svelte-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(90deg, #06b6d4, #3b82f6);
    animation: svelte-wave-move 3s ease-in-out infinite;
  }

  .svelte-wave-1 {
    opacity: 0.7;
    animation-delay: 0s;
  }

  .svelte-wave-2 {
    opacity: 0.5;
    animation-delay: 1s;
    height: 30px;
  }

  .svelte-wave-3 {
    opacity: 0.3;
    animation-delay: 2s;
    height: 40px;
  }

  @keyframes svelte-wave-move {
    0%, 100% {
      clip-path: polygon(0 100%, 25% 70%, 50% 80%, 75% 60%, 100% 70%, 100% 100%);
    }
    50% {
      clip-path: polygon(0 100%, 25% 80%, 50% 60%, 75% 80%, 100% 60%, 100% 100%);
    }
  }
`;

// Inject global styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}
