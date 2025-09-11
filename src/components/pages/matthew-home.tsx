import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Github, Linkedin, Mail, MapPin, Calendar } from "lucide-react";

export function MatthewHomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background to-muted/20 overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex min-h-screen flex-col items-center justify-center z-10">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          
          {/* Profile Section */}
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
              MM
            </div>
            
            <div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent sm:text-6xl">
                Matthew Miceli
              </h1>
              <p className="mt-4 text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
                Software Engineer & Digital Architect building the future of web experiences
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Full-Stack Development</h3>
                <p className="text-sm text-muted-foreground">
                  Next.js, TypeScript, React, Node.js, tRPC, and modern web technologies
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-3">🏗️</div>
                <h3 className="font-semibold mb-2">System Architecture</h3>
                <p className="text-sm text-muted-foreground">
                  Scalable applications, microservices, database design, and DevOps
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-3">🚀</div>
                <h3 className="font-semibold mb-2">Product Development</h3>
                <p className="text-sm text-muted-foreground">
                  From concept to deployment, creating impactful digital experiences
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" className="group">
              <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Get In Touch
            </Button>
            
            <Button variant="outline" size="lg" asChild className="group">
              <Link href="/projects">
                <Github className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Projects
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
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
    </div>
  );
}