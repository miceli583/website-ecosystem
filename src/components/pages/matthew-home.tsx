import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Rocket,
  Zap,
} from "lucide-react";

export function MatthewHomePage() {
  return (
    <div className="from-background to-muted/20 relative min-h-screen overflow-hidden bg-gradient-to-br">
      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* Profile Section */}
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-2xl">
              MM
            </div>

            <div>
              <h1 className="from-foreground to-muted-foreground bg-gradient-to-br bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
                Matthew Miceli
              </h1>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-xl leading-relaxed font-light">
                Software Engineer & Digital Architect building the future of web
                experiences
              </p>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Available for projects</span>
              </div>
            </div>
          </div>

          {/* Skills Cards */}
          <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="border-border/50 bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-3 text-2xl">⚡</div>
                <h3 className="mb-2 font-semibold">Full-Stack Development</h3>
                <p className="text-muted-foreground text-sm">
                  Next.js, TypeScript, React, Node.js, tRPC, and modern web
                  technologies
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-3 text-2xl">🏗️</div>
                <h3 className="mb-2 font-semibold">System Architecture</h3>
                <p className="text-muted-foreground text-sm">
                  Scalable applications, microservices, database design, and
                  DevOps
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 hover:bg-card/80 backdrop-blur-sm transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-3 text-2xl">🚀</div>
                <h3 className="mb-2 font-semibold">Product Development</h3>
                <p className="text-muted-foreground text-sm">
                  From concept to deployment, creating impactful digital
                  experiences
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group">
              <Mail className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Get In Touch
            </Button>

            <Button variant="outline" size="lg" asChild className="group">
              <Link href="/projects">
                <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                View Projects
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="group border-purple-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20"
            >
              <Link href="/playground">
                <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                UI Playground
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="group border-blue-500/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20"
            >
              <Link href="/templates">
                <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Template Gallery
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="group border-violet-500/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
            >
              <Link href="/shaders">
                <Zap className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Animation Showcase
              </Link>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/matthewmiceli"
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
            >
              <Github className="h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com/in/matthew-miceli"
              className="text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link
              href="mailto:hello@matthewmiceli.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="bg-grid-pattern absolute inset-0 opacity-5" />
      <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-10 bottom-1/4 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
    </div>
  );
}
