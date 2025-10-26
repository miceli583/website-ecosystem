import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Code,
  BookOpen,
  Cpu,
  Database,
  Terminal,
  ExternalLink,
} from "lucide-react";

export function MiracleMindDevHomePage() {
  return (
    <div className="from-background to-background relative min-h-screen overflow-hidden bg-gradient-to-br via-violet-50/20 dark:via-violet-950/20">
      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* Brand Header */}
          <div className="space-y-6 text-center">
            <div className="mb-6 font-mono text-4xl text-violet-600 dark:text-violet-400">
              &lt;/MM&gt;
            </div>

            <div>
              <h1 className="bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl dark:from-violet-400 dark:to-purple-400">
                MiracleMind Dev
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-xl leading-relaxed font-light">
                Technical documentation, APIs, and development resources for
                building the future of personal development technology
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-full bg-violet-100 px-4 py-2 font-mono text-sm text-violet-800 dark:bg-violet-900/30 dark:text-violet-200">
              <Terminal className="h-4 w-4" />
              <span>v2.1.0 • Latest Release</span>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            <Card className="bg-card/80 hover:bg-card group cursor-pointer border-violet-200 backdrop-blur-sm transition-all duration-300 dark:border-violet-800">
              <CardContent className="p-6 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-violet-600 transition-transform group-hover:scale-110" />
                <h3 className="text-sm font-semibold">Documentation</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  Complete guides
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 hover:bg-card group cursor-pointer border-violet-200 backdrop-blur-sm transition-all duration-300 dark:border-violet-800">
              <CardContent className="p-6 text-center">
                <Code className="mx-auto mb-3 h-8 w-8 text-violet-600 transition-transform group-hover:scale-110" />
                <h3 className="text-sm font-semibold">API Reference</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  REST & GraphQL
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 hover:bg-card group cursor-pointer border-violet-200 backdrop-blur-sm transition-all duration-300 dark:border-violet-800">
              <CardContent className="p-6 text-center">
                <Cpu className="mx-auto mb-3 h-8 w-8 text-violet-600 transition-transform group-hover:scale-110" />
                <h3 className="text-sm font-semibold">SDKs</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  Multiple languages
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 hover:bg-card group cursor-pointer border-violet-200 backdrop-blur-sm transition-all duration-300 dark:border-violet-800">
              <CardContent className="p-6 text-center">
                <Database className="mx-auto mb-3 h-8 w-8 text-violet-600 transition-transform group-hover:scale-110" />
                <h3 className="text-sm font-semibold">Admin Panel</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  System management
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Cards */}
          <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="bg-card/80 hover:bg-card border-violet-200 backdrop-blur-sm transition-all duration-300 dark:border-violet-800">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">
                      Developer Documentation
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      Comprehensive guides, tutorials, and best practices for
                      integrating with MiracleMind platform
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-violet-300 text-violet-600"
                    >
                      Read Docs
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 hover:bg-card border-violet-200 backdrop-blur-sm transition-all duration-300 dark:border-violet-800">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">
                      API Playground
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      Interactive API explorer with authentication, real-time
                      testing, and code generation
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-600"
                    >
                      Try API
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack */}
          <div className="w-full max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Built with Modern Technology
            </h2>
            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-blue-500"></div>
                <span className="font-mono text-sm">Next.js 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-blue-600"></div>
                <span className="font-mono text-sm">TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-violet-500"></div>
                <span className="font-mono text-sm">tRPC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-500"></div>
                <span className="font-mono text-sm">Drizzle ORM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-orange-500"></div>
                <span className="font-mono text-sm">Supabase</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-violet-600 px-8 hover:bg-violet-700"
            >
              <Link href="/docs">
                <BookOpen className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-violet-300 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950"
            >
              <Link href="/admin">
                <Terminal className="mr-2 h-5 w-5" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5" />
      <div className="absolute top-1/4 left-10 h-96 w-96 animate-pulse rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute right-10 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
    </div>
  );
}
