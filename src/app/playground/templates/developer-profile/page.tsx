"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Star,
  GitBranch,
  Calendar,
  MapPin,
  Download,
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  Eye,
  Users,
} from "lucide-react";

export default function DeveloperProfilePage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="min-h-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-950">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-20">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="floating-particles absolute inset-0">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 bg-gradient-to-br from-blue-400 to-purple-600">
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold">
                      JD
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-2 border-white animate-pulse"></div>
                </div>
              </div>

              <h1 className="mb-4 text-5xl font-bold tracking-tight">
                John Doe
              </h1>
              <p className="mb-2 text-xl text-blue-100">
                Full-Stack Developer & UI/UX Designer
              </p>
              <p className="mb-8 text-lg text-blue-200 max-w-2xl mx-auto">
                Passionate about creating beautiful, functional web experiences.
                Specializing in React, TypeScript, and modern web technologies.
              </p>

              <div className="mb-8 flex justify-center gap-4">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  <MapPin className="mr-1 h-3 w-3" />
                  San Francisco, CA
                </Badge>
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  <Calendar className="mr-1 h-3 w-3" />
                  Available for work
                </Badge>
              </div>

              <div className="flex justify-center gap-4">
                <Button size="lg" className="group bg-white text-blue-600 hover:bg-blue-50">
                  <Download className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Download Resume
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 py-12">
            {/* Stats Section */}
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-2 flex justify-center">
                    <Code className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold">50+</h3>
                  <p className="text-muted-foreground">Projects Completed</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-2 flex justify-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold">1.2k</h3>
                  <p className="text-muted-foreground">GitHub Stars</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-2 flex justify-center">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold">25+</h3>
                  <p className="text-muted-foreground">Happy Clients</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-2 flex justify-center">
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold">5</h3>
                  <p className="text-muted-foreground">Years Experience</p>
                </CardContent>
              </Card>
            </div>

            {/* Skills Section */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-semibold text-lg">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vue.js'].map((skill) => (
                        <Badge key={skill} variant="secondary" className="hover:scale-105 transition-transform">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 font-semibold text-lg">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Docker', 'AWS'].map((skill) => (
                        <Badge key={skill} variant="secondary" className="hover:scale-105 transition-transform">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Projects */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-emerald-600" />
                  Featured Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "E-commerce Platform",
                      description: "Full-stack e-commerce solution with React and Node.js",
                      tech: ["React", "Node.js", "PostgreSQL"],
                      stars: 124,
                      views: "2.3k"
                    },
                    {
                      title: "Task Management App",
                      description: "Real-time collaborative task management with WebSocket",
                      tech: ["Next.js", "TypeScript", "MongoDB"],
                      stars: 89,
                      views: "1.8k"
                    },
                    {
                      title: "Design System",
                      description: "Component library with Storybook and design tokens",
                      tech: ["React", "Storybook", "Figma"],
                      stars: 256,
                      views: "4.1k"
                    }
                  ].map((project, index) => (
                    <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <CardContent className="p-6">
                        <div className="mb-3">
                          <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                          <p className="text-muted-foreground text-sm">{project.description}</p>
                        </div>
                        <div className="mb-4 flex flex-wrap gap-1">
                          {project.tech.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {project.stars}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {project.views}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Let&apos;s Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-6 text-muted-foreground">
                      I&apos;m always interested in new opportunities and exciting projects.
                      Feel free to reach out if you&apos;d like to collaborate!
                    </p>
                    <div className="flex gap-4">
                      <Button size="sm" className="group">
                        <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        GitHub
                      </Button>
                      <Button size="sm" variant="outline" className="group">
                        <Linkedin className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        LinkedIn
                      </Button>
                      <Button size="sm" variant="outline" className="group">
                        <Twitter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        Twitter
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Mail className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <style jsx global>{`
          .floating-particles {
            overflow: hidden;
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
          }

          .particle-1 {
            top: 20%;
            left: 10%;
            animation: float 6s ease-in-out infinite;
          }

          .particle-2 {
            top: 40%;
            left: 80%;
            animation: float 8s ease-in-out infinite reverse;
          }

          .particle-3 {
            top: 60%;
            left: 20%;
            animation: float 7s ease-in-out infinite;
          }

          .particle-4 {
            top: 80%;
            left: 70%;
            animation: float 5s ease-in-out infinite reverse;
          }

          .particle-5 {
            top: 30%;
            left: 50%;
            animation: float 9s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            33% {
              transform: translateY(-20px) translateX(10px);
            }
            66% {
              transform: translateY(10px) translateX(-10px);
            }
          }
        `}</style>
      </PlaygroundLayout>
    </DomainLayout>
  );
}