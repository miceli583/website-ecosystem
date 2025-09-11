import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Brain, Sparkles, Target, Users, ArrowRight, Star } from "lucide-react";

export function MiracleMindLiveHomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-emerald-50/20 dark:via-emerald-950/20 to-background overflow-hidden">
      
      {/* Hero Section */}
      <div className="relative flex min-h-screen flex-col items-center justify-center z-10">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          
          {/* Brand Header */}
          <div className="text-center space-y-6">
            <div className="text-6xl mb-6">🧠✨</div>
            
            <div>
              <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent sm:text-7xl">
                MiracleMind
              </h1>
              <p className="mt-6 text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
                Transform your mind, transform your life with AI-powered personal development
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full">
              <Star className="h-4 w-4 fill-current" />
              <span>Join 50,000+ people transforming their lives</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get personalized recommendations and insights powered by advanced AI to accelerate your growth journey
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-teal-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Goal Achievement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set meaningful goals and track your progress with intelligent systems that adapt to your unique path
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-violet-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with like-minded individuals on their transformation journey and grow together
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 group">
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" asChild className="border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                <Link href="/features">
                  Explore Features
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              ✨ Free 14-day trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/5 via-transparent to-transparent rounded-full" />
    </div>
  );
}