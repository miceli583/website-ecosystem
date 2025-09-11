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
  X
} from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-purple-50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              UI/UX Playground
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced interface components and experimental design patterns for MiracleMind
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200">
              <Code className="h-3 w-3 mr-1" />
              Experimental
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
              <Eye className="h-3 w-3 mr-1" />
              Interactive
            </Badge>
          </div>
        </div>

        {/* Component Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Animated Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button className="group bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                    <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Magic Button
                  </Button>
                  <Button variant="outline" className="group border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950">
                    <Zap className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform text-violet-600" />
                    Power Up
                  </Button>
                  <Button size="sm" className="group bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Play className="mr-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    Start
                  </Button>
                </div>
              </div>

              {/* Shape Animations */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Animated Shapes</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-pulse flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Circle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg rotate-45 hover:rotate-90 transition-transform duration-500 cursor-pointer flex items-center justify-center">
                    <Square className="h-6 w-6 text-white -rotate-45" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 clip-triangle hover:scale-125 transition-transform cursor-pointer flex items-center justify-center">
                    <Triangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full hover:animate-spin transition-all cursor-pointer flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Micro Interactions */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Micro Interactions</h3>
                <div className="flex items-center gap-3">
                  <Button size="icon" variant="outline" className="group hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Heart className="h-4 w-4 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                  </Button>
                  <Button size="icon" variant="outline" className="group">
                    <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-700" />
                  </Button>
                  <Button size="icon" variant="outline" className="group">
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                  </Button>
                  <Button size="icon" variant="outline" className="group hover:bg-red-50 dark:hover:bg-red-950/30">
                    <X className="h-4 w-4 group-hover:rotate-90 group-hover:text-red-500 transition-all" />
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
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Glass Morphism</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium">Glass Card</span>
                  </div>
                  <div className="h-20 bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-lg border border-violet-200/30 dark:border-violet-700/30 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium">Tinted Glass</span>
                  </div>
                </div>
              </div>

              {/* Neumorphism */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Neumorphism</h3>
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.7),inset_2px_2px_6px_rgba(0,0,0,0.15)] dark:shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.1),inset_2px_2px_6px_rgba(0,0,0,0.4)] flex items-center justify-center">
                    <span className="text-xs">Inset</span>
                  </div>
                  <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-[-2px_-2px_6px_rgba(255,255,255,0.7),2px_2px_6px_rgba(0,0,0,0.15)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.1),2px_2px_6px_rgba(0,0,0,0.4)] flex items-center justify-center">
                    <span className="text-xs">Raised</span>
                  </div>
                </div>
              </div>

              {/* Responsive Preview */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Device Preview</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 p-2 rounded-lg bg-muted/50">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-xs">Mobile</span>
                  </div>
                  <div className="flex items-center gap-1 p-2 rounded-lg bg-muted">
                    <Tablet className="h-4 w-4" />
                    <span className="text-xs">Tablet</span>
                  </div>
                  <div className="flex items-center gap-1 p-2 rounded-lg bg-muted/50">
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
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Brand Palette</h3>
                <div className="grid grid-cols-6 gap-2">
                  <div className="h-12 bg-violet-500 rounded-lg flex items-end p-1">
                    <span className="text-xs text-white font-mono">500</span>
                  </div>
                  <div className="h-12 bg-purple-500 rounded-lg flex items-end p-1">
                    <span className="text-xs text-white font-mono">500</span>
                  </div>
                  <div className="h-12 bg-emerald-500 rounded-lg flex items-end p-1">
                    <span className="text-xs text-white font-mono">500</span>
                  </div>
                  <div className="h-12 bg-teal-500 rounded-lg flex items-end p-1">
                    <span className="text-xs text-white font-mono">500</span>
                  </div>
                  <div className="h-12 bg-orange-500 rounded-lg flex items-end p-1">
                    <span className="text-xs text-white font-mono">500</span>
                  </div>
                  <div className="h-12 bg-pink-500 rounded-lg flex items-end p-1">
                    <span className="text-xs text-white font-mono">500</span>
                  </div>
                </div>
              </div>

              {/* Typography Scale */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Typography</h3>
                <div className="space-y-2">
                  <p className="text-3xl font-bold">Heading 1</p>
                  <p className="text-2xl font-semibold">Heading 2</p>
                  <p className="text-xl font-medium">Heading 3</p>
                  <p className="text-base">Body Text</p>
                  <p className="text-sm text-muted-foreground">Small Text</p>
                  <p className="text-xs font-mono uppercase tracking-wider">Label</p>
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
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Progress</h3>
                <div className="space-y-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-1 rounded-full w-1/2"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-violet-500 rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Status</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Offline</span>
                  </div>
                </div>
              </div>

              {/* Interactive Cards */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Interactive Cards</h3>
                <div className="p-4 border rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hover Effect</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Interactive card with smooth transitions</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CSS Grid Playground */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-center">CSS Grid</h3>
                <div className="grid grid-cols-3 gap-2 h-32">
                  <div className="bg-violet-100 dark:bg-violet-900/30 rounded col-span-2 flex items-center justify-center">
                    <span className="text-xs">Main</span>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                    <span className="text-xs">Side</span>
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded col-span-3 flex items-center justify-center">
                    <span className="text-xs">Footer</span>
                  </div>
                </div>
              </div>

              {/* Flexbox Playground */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-center">Flexbox</h3>
                <div className="flex flex-col gap-2 h-32">
                  <div className="flex gap-2 flex-1">
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded flex-1 flex items-center justify-center">
                      <span className="text-xs">A</span>
                    </div>
                    <div className="bg-pink-100 dark:bg-pink-900/30 rounded flex-1 flex items-center justify-center">
                      <span className="text-xs">B</span>
                    </div>
                  </div>
                  <div className="bg-teal-100 dark:bg-teal-900/30 rounded flex items-center justify-center h-8">
                    <span className="text-xs">Full Width</span>
                  </div>
                </div>
              </div>

              {/* Animation Playground */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-center">Animations</h3>
                <div className="h-32 flex items-center justify-center relative overflow-hidden rounded-lg bg-muted/50">
                  <div className="w-4 h-4 bg-violet-500 rounded-full animate-bounce absolute"></div>
                  <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse absolute top-4"></div>
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-spin absolute bottom-4"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}