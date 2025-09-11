import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ThemeToggle } from "~/components/theme-toggle";
import { Rocket, BookOpen, GraduationCap, Grid3x3, ExternalLink, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>


      {/* Background Elements - Dark Mode Only */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_50%_120%,rgba(255,193,7,0.03),rgba(0,0,0,1))]" />
      <div className="absolute top-0 left-0 w-full h-px dark:bg-gradient-to-r dark:from-transparent dark:via-amber-500/20 dark:to-transparent" />
      
      {/* Floating Orbs - Green and Turquoise */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-green-100/30 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full opacity-30 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-teal-100/30 to-cyan-100/30 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-full opacity-30 blur-xl animate-pulse delay-1000" />
      
      <div className="relative flex min-h-screen flex-col items-center justify-center z-10">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* Enhanced Logo with Animation */}
          <div className="group text-center">
            <div className="mb-6 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-amber-500 dark:text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-br from-black via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent sm:text-8xl transition-all duration-500 group-hover:scale-105">
              NEXT
              <span className="text-3xl font-light bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-400 dark:to-yellow-500 bg-clip-text text-transparent ml-2 sm:text-4xl">.js</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 font-light max-w-md mx-auto leading-relaxed">
              The React framework for production-grade applications
            </p>
          </div>

          {/* Vercel-Style Steps Card */}
          <div className="max-w-lg border border-gray-200 dark:border-neutral-800 rounded-lg bg-gray-50/50 dark:bg-black/50 transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-gray-50/80 dark:hover:bg-black/80">
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xs font-medium shadow-lg">
                    1
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                      Get started by editing{" "}
                      <code className="inline-flex items-center rounded border border-gray-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 text-xs font-mono text-amber-600 dark:text-amber-400">
                        src/app/page.tsx
                      </code>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-medium shadow-lg">
                    2
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                      Save and see your changes instantly with hot reload
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              asChild 
              size="lg"
              className="group bg-gradient-to-r from-black to-neutral-800 dark:from-white dark:to-neutral-200 hover:from-neutral-800 hover:to-black dark:hover:from-neutral-100 dark:hover:to-white shadow-lg shadow-black/25 dark:shadow-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 dark:hover:shadow-white/20 hover:-translate-y-0.5 text-white dark:text-neutral-900"
            >
              <Link href="https://vercel.com/new" target="_blank">
                <Rocket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300 text-amber-400 dark:text-amber-600" />
                Deploy now
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild 
              size="lg"
              className="group border-teal-300 dark:border-teal-600 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-900/50 dark:hover:to-cyan-900/50 hover:border-teal-400 dark:hover:border-teal-500 shadow-lg shadow-teal-200/25 dark:shadow-teal-900/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-200/40 dark:hover:shadow-teal-900/40 hover:-translate-y-0.5 text-black dark:text-neutral-100"
            >
              <Link href="https://nextjs.org/docs" target="_blank">
                <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300 text-teal-600 dark:text-teal-400" />
                Read our docs
              </Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Footer Links */}
        <div className="absolute bottom-8 flex items-center gap-8 text-gray-500 dark:text-gray-400 z-10">
          <Button 
            variant="link" 
            className="group p-0 h-auto text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300" 
            asChild
          >
            <Link href="https://nextjs.org/learn" target="_blank">
              <GraduationCap className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
              <span className="group-hover:underline underline-offset-4">Learn</span>
            </Link>
          </Button>
          <Button 
            variant="link" 
            className="group p-0 h-auto text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300" 
            asChild
          >
            <Link href="https://nextjs.org/examples" target="_blank">
              <Grid3x3 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300 group-hover:text-teal-500 dark:group-hover:text-teal-400" />
              <span className="group-hover:underline underline-offset-4">Examples</span>
            </Link>
          </Button>
          <Button 
            variant="link" 
            className="group p-0 h-auto text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300" 
            asChild
          >
            <Link href="https://nextjs.org" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300 group-hover:text-amber-500 dark:group-hover:text-amber-400" />
              <span className="group-hover:underline underline-offset-4">Go to nextjs.org</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
