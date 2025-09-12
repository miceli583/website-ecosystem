import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Brain, Sparkles, Target, Users, ArrowRight, Star } from "lucide-react";

export function MiracleMindLiveHomePage() {
  return (
    <div className="from-background to-background relative min-h-screen overflow-hidden bg-gradient-to-br via-emerald-50/20 dark:via-emerald-950/20">
      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* Brand Header */}
          <div className="space-y-6 text-center">
            <div className="mb-6 text-6xl">🧠✨</div>

            <div>
              <h1 className="bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl dark:from-emerald-400 dark:to-teal-400">
                MiracleMind
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-3xl text-2xl leading-relaxed font-light">
                Transform your mind, transform your life with AI-powered
                personal development
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
              <Star className="h-4 w-4 fill-current" />
              <span>Join 50,000+ people transforming their lives</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="bg-card/80 hover:bg-card group border-emerald-200 backdrop-blur-sm transition-all duration-300 dark:border-emerald-800">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 transition-transform group-hover:scale-110">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  AI-Powered Insights
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get personalized recommendations and insights powered by
                  advanced AI to accelerate your growth journey
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 hover:bg-card group border-emerald-200 backdrop-blur-sm transition-all duration-300 dark:border-emerald-800">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 transition-transform group-hover:scale-110">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Goal Achievement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set meaningful goals and track your progress with intelligent
                  systems that adapt to your unique path
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 hover:bg-card group border-emerald-200 backdrop-blur-sm transition-all duration-300 dark:border-emerald-800">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500 transition-transform group-hover:scale-110">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  Community Support
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with like-minded individuals on their transformation
                  journey and grow together
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group bg-emerald-600 px-8 text-white hover:bg-emerald-700"
              >
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950"
              >
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>

            <p className="text-muted-foreground text-center text-sm">
              ✨ Free 14-day trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5" />
      <div className="absolute top-1/4 left-10 h-96 w-96 animate-pulse rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute right-10 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-teal-500/10 blur-3xl delay-1000" />
      <div className="bg-gradient-radial absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full from-emerald-500/5 via-transparent to-transparent" />
    </div>
  );
}
