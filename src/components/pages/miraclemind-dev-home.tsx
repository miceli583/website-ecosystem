import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Code, BookOpen, Cpu, Database, Terminal, ExternalLink } from "lucide-react";

export function MiracleMindDevHomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-violet-50/20 dark:via-violet-950/20 to-background overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative flex min-h-screen flex-col items-center justify-center z-10">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          
          {/* Brand Header */}
          <div className="text-center space-y-6">
            <div className="font-mono text-4xl mb-6 text-violet-600 dark:text-violet-400">&lt;/MM&gt;</div>
            
            <div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent sm:text-6xl">
                MiracleMind Dev
              </h1>
              <p className="mt-6 text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
                Technical documentation, APIs, and development resources for building the future of personal development technology
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 px-4 py-2 rounded-full font-mono">
              <Terminal className="h-4 w-4" />
              <span>v2.1.0 • Latest Release</span>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
            <Card className="border-violet-200 dark:border-violet-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-violet-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm">Documentation</h3>
                <p className="text-xs text-muted-foreground mt-1">Complete guides</p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 mx-auto mb-3 text-violet-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm">API Reference</h3>
                <p className="text-xs text-muted-foreground mt-1">REST & GraphQL</p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <Cpu className="h-8 w-8 mx-auto mb-3 text-violet-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm">SDKs</h3>
                <p className="text-xs text-muted-foreground mt-1">Multiple languages</p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <Database className="h-8 w-8 mx-auto mb-3 text-violet-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm">Admin Panel</h3>
                <p className="text-xs text-muted-foreground mt-1">System management</p>
              </CardContent>
            </Card>
          </div>

          {/* UI/UX Playground Link */}
          <div className="grid grid-cols-1 gap-6 max-w-2xl w-full mx-auto">
            <Link href="/playground">
              <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 hover:from-purple-100/50 hover:to-pink-100/50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Code className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        UI/UX Playground
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Experiment with advanced components, animations, and design patterns. Interactive testing ground for new UI ideas.
                      </p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-purple-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Main Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <Card className="border-violet-200 dark:border-violet-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Developer Documentation</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      Comprehensive guides, tutorials, and best practices for integrating with MiracleMind platform
                    </p>
                    <Button size="sm" variant="outline" className="text-violet-600 border-violet-300">
                      Read Docs
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">API Playground</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      Interactive API explorer with authentication, real-time testing, and code generation
                    </p>
                    <Button size="sm" variant="outline" className="text-purple-600 border-purple-300">
                      Try API
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack */}
          <div className="max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-center mb-8">Built with Modern Technology</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="text-sm font-mono">Next.js 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span className="text-sm font-mono">TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-violet-500 rounded"></div>
                <span className="text-sm font-mono">tRPC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500 rounded"></div>
                <span className="text-sm font-mono">Drizzle ORM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
                <span className="text-sm font-mono">Supabase</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" asChild className="bg-violet-600 hover:bg-violet-700 px-8">
              <Link href="/docs">
                <BookOpen className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="border-violet-300 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950">
              <Link href="/admin">
                <Terminal className="mr-2 h-5 w-5" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  );
}