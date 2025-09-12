import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
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
} from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="via-background dark:via-background min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-6 dark:from-violet-950/20 dark:to-purple-950/20">
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
            Advanced interface components and experimental design patterns for
            MiracleMind
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
                    <span className="text-sm font-medium">Tinted Glass</span>
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
                    <span className="font-mono text-xs text-white">500</span>
                  </div>
                  <div className="flex h-12 items-end rounded-lg bg-purple-500 p-1">
                    <span className="font-mono text-xs text-white">500</span>
                  </div>
                  <div className="flex h-12 items-end rounded-lg bg-emerald-500 p-1">
                    <span className="font-mono text-xs text-white">500</span>
                  </div>
                  <div className="flex h-12 items-end rounded-lg bg-teal-500 p-1">
                    <span className="font-mono text-xs text-white">500</span>
                  </div>
                  <div className="flex h-12 items-end rounded-lg bg-orange-500 p-1">
                    <span className="font-mono text-xs text-white">500</span>
                  </div>
                  <div className="flex h-12 items-end rounded-lg bg-pink-500 p-1">
                    <span className="font-mono text-xs text-white">500</span>
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
                  <p className="text-muted-foreground text-sm">Small Text</p>
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

        {/* Experimental Section */}
        <Card className="border-gradient border-2">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Paintbrush className="h-5 w-5 text-violet-600" />
              Experimental Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* CSS Grid Playground */}
              <div className="space-y-3">
                <h3 className="text-center text-sm font-medium">CSS Grid</h3>
                <div className="grid h-32 grid-cols-3 gap-2">
                  <div className="col-span-2 flex items-center justify-center rounded bg-violet-100 dark:bg-violet-900/30">
                    <span className="text-xs">Main</span>
                  </div>
                  <div className="flex items-center justify-center rounded bg-purple-100 dark:bg-purple-900/30">
                    <span className="text-xs">Side</span>
                  </div>
                  <div className="col-span-3 flex items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/30">
                    <span className="text-xs">Footer</span>
                  </div>
                </div>
              </div>

              {/* Flexbox Playground */}
              <div className="space-y-3">
                <h3 className="text-center text-sm font-medium">Flexbox</h3>
                <div className="flex h-32 flex-col gap-2">
                  <div className="flex flex-1 gap-2">
                    <div className="flex flex-1 items-center justify-center rounded bg-orange-100 dark:bg-orange-900/30">
                      <span className="text-xs">A</span>
                    </div>
                    <div className="flex flex-1 items-center justify-center rounded bg-pink-100 dark:bg-pink-900/30">
                      <span className="text-xs">B</span>
                    </div>
                  </div>
                  <div className="flex h-8 items-center justify-center rounded bg-teal-100 dark:bg-teal-900/30">
                    <span className="text-xs">Full Width</span>
                  </div>
                </div>
              </div>

              {/* Animation Playground */}
              <div className="space-y-3">
                <h3 className="text-center text-sm font-medium">Animations</h3>
                <div className="bg-muted/50 relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
                  <div className="absolute h-4 w-4 animate-bounce rounded-full bg-violet-500"></div>
                  <div className="absolute top-4 h-4 w-4 animate-pulse rounded-full bg-purple-500"></div>
                  <div className="absolute bottom-4 h-4 w-4 animate-spin rounded-full bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
