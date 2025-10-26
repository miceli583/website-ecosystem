"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
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
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="animate-fade-in">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                  Hi, I'm Alex Chen 👋
                </h1>
              </div>
              <div className="animate-fade-in-delay-1 max-w-2xl">
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Software Engineer turned Entrepreneur. I love building things
                  and helping people. Very active on Twitter and passionate
                  about open source.
                </p>
              </div>
            </div>
            <div className="animate-fade-in-delay-2 flex-shrink-0">
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-gray-200 bg-gradient-to-br from-blue-400 to-purple-600 dark:border-gray-700">
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    AC
                  </div>
                </div>
                <div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"></div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <div className="animate-fade-in-delay-3">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              About
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                I&apos;m a passionate software developer with over 5 years of
                experience building scalable web applications. I specialize in
                React, TypeScript, and Node.js, and I&apos;m always excited to learn
                new technologies and tackle challenging problems.
              </p>
              <p>
                When I&apos;m not coding, you can find me contributing to open source
                projects, writing technical blog posts, or exploring the latest
                trends in web development. I believe in building software that
                makes a positive impact on people&apos;s lives.
              </p>
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="mb-16">
          <div className="animate-fade-in-delay-4">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Work Experience
            </h2>
            <div className="space-y-6">
              {[
                {
                  company: "TechCorp",
                  role: "Senior Frontend Engineer",
                  period: "2022 - Present",
                  description:
                    "Lead development of the main product dashboard, improving user engagement by 40%",
                  logo: "TC",
                },
                {
                  company: "StartupXYZ",
                  role: "Full Stack Developer",
                  period: "2020 - 2022",
                  description:
                    "Built the entire frontend from scratch using React and TypeScript",
                  logo: "SX",
                },
                {
                  company: "DevAgency",
                  role: "Junior Developer",
                  period: "2019 - 2020",
                  description:
                    "Developed client websites and learned best practices in agile development",
                  logo: "DA",
                },
              ].map((job, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {job.role}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {job.period}
                          </span>
                        </div>
                        <p className="text-blue-600 dark:text-blue-400">
                          {job.company}
                        </p>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          {job.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16">
          <div className="animate-fade-in-delay-5">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Education
            </h2>
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Computer Science
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        2015 - 2019
                      </span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-400">
                      University of Technology
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      Bachelor's degree with focus on software engineering and
                      web development
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <div className="animate-fade-in-delay-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "TypeScript",
                "Next.js",
                "Node.js",
                "Express",
                "MongoDB",
                "PostgreSQL",
                "GraphQL",
                "Docker",
                "AWS",
                "Git",
                "Figma",
                "Tailwind CSS",
                "Jest",
                "Cypress",
                "Webpack",
              ].map((skill, index) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="animate-fade-in transition-transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-16">
          <div className="animate-fade-in-delay-7">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                My Projects
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Check out my latest work
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                I've worked on a variety of projects, from simple websites to
                complex web applications. Here are a few of my favorites.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  title: "E-commerce Platform",
                  description:
                    "A full-stack e-commerce solution with React, Node.js, and Stripe integration",
                  tech: ["React", "Node.js", "MongoDB", "Stripe"],
                  image: "🛒",
                  links: { github: "#", live: "#" },
                },
                {
                  title: "Task Manager Pro",
                  description:
                    "Real-time collaborative task management app with WebSocket integration",
                  tech: ["Next.js", "TypeScript", "Socket.io", "PostgreSQL"],
                  image: "📋",
                  links: { github: "#", live: "#" },
                },
                {
                  title: "Weather Dashboard",
                  description:
                    "Beautiful weather app with location-based forecasts and interactive maps",
                  tech: ["React", "OpenWeather API", "Mapbox", "Tailwind"],
                  image: "🌤️",
                  links: { github: "#", live: "#" },
                },
                {
                  title: "Portfolio Website",
                  description:
                    "Personal portfolio built with modern web technologies and smooth animations",
                  tech: ["Next.js", "Framer Motion", "Tailwind", "MDX"],
                  image: "💼",
                  links: { github: "#", live: "#" },
                },
              ].map((project, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 p-8">
                      <div className="flex h-full items-center justify-center text-6xl">
                        {project.image}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-300">
                        {project.description}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-1">
                        {project.tech.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="group/btn"
                        >
                          <Github className="mr-1 h-3 w-3 transition-transform group-hover/btn:scale-110" />
                          Code
                        </Button>
                        <Button size="sm" className="group/btn">
                          <ExternalLink className="mr-1 h-3 w-3 transition-transform group-hover/btn:scale-110" />
                          Live Demo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Hackathons Section */}
        <section className="mb-16">
          <div className="animate-fade-in-delay-8">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Hackathons
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                I like building things
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                During my time in university, I attended 8+ hackathons. People
                from around the country would come together and build incredible
                things in 2-3 days.
              </p>
            </div>

            <div className="ml-4 border-l border-gray-200 dark:border-gray-700">
              {[
                {
                  title: "TechHacks 2023",
                  description:
                    "Built an AI-powered study assistant that helps students organize their learning",
                  award: "🏆 Winner - Best AI Application",
                  date: "Oct 2023",
                },
                {
                  title: "StartupWeekend",
                  description:
                    "Created a platform connecting local farmers with consumers for fresh produce",
                  award: "🥈 2nd Place - Social Impact",
                  date: "Aug 2023",
                },
                {
                  title: "HackTheChange",
                  description:
                    "Developed a carbon footprint tracker with gamification elements",
                  award: "🥉 3rd Place - Sustainability",
                  date: "May 2023",
                },
              ].map((hackathon, index) => (
                <div key={index} className="relative pb-8 pl-6">
                  <div className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-600"></div>
                  <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    {hackathon.date}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {hackathon.title}
                  </h3>
                  <p className="mb-2 text-gray-600 dark:text-gray-300">
                    {hackathon.description}
                  </p>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {hackathon.award}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <div className="animate-fade-in-delay-9">
            <div className="text-center">
              <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Contact
              </Badge>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Get in Touch
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                Want to chat? Just shoot me a dm{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  with a direct question on twitter
                </a>{" "}
                and I'll respond whenever I can. I will ignore all soliciting.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="group">
                  <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  GitHub
                </Button>
                <Button size="lg" variant="outline" className="group">
                  <Twitter className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Twitter
                </Button>
                <Button size="lg" variant="outline" className="group">
                  <Linkedin className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  LinkedIn
                </Button>
                <Button size="lg" variant="outline" className="group">
                  <Mail className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out 0.1s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.3s both;
        }

        .animate-fade-in-delay-4 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }

        .animate-fade-in-delay-5 {
          animation: fade-in 0.6s ease-out 0.5s both;
        }

        .animate-fade-in-delay-6 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }

        .animate-fade-in-delay-7 {
          animation: fade-in 0.6s ease-out 0.7s both;
        }

        .animate-fade-in-delay-8 {
          animation: fade-in 0.6s ease-out 0.8s both;
        }

        .animate-fade-in-delay-9 {
          animation: fade-in 0.6s ease-out 0.9s both;
        }
      `}</style>
    </div>
  );
}
