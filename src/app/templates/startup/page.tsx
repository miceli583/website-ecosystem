"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Rocket,
  ArrowRight,
  Play,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Star,
  ChevronDown,
  Check,
  X,
  Sparkles,
  Heart,
  MessageSquare,
  Award,
  Target,
  Clock,
  BarChart3,
  Lightbulb,
} from "lucide-react";

export default function StartupPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="hero-bg-animation"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="animated-badge mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Sparkles className="mr-1 h-3 w-3" />
              Launching Soon • Join Waitlist
            </Badge>

            <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-gray-900 lg:text-8xl dark:text-white">
              <span className="block">The Future</span>
              <span className="hero-gradient-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 lg:text-2xl dark:text-gray-300">
              Revolutionary AI-powered platform that transforms how startups
              build, scale, and succeed in the digital age. Be part of the next
              big thing.
            </p>

            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="group animated-button bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg hover:from-purple-700 hover:to-pink-700"
              >
                <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                Join the Revolution
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-purple-300 px-8 py-4 text-lg text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              >
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Early access perks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Exclusive community</span>
              </div>
            </div>
          </div>

          {/* Video/Demo Section */}
          <div className="mt-20">
            <Card className="mx-auto max-w-4xl overflow-hidden border-none bg-white/80 shadow-2xl backdrop-blur-lg dark:bg-gray-900/80">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-purple-900 to-pink-900">
                  {!isVideoPlaying ? (
                    <div className="flex h-full items-center justify-center">
                      <Button
                        size="lg"
                        className="group h-20 w-20 rounded-full bg-white/20 backdrop-blur-lg hover:bg-white/30"
                        onClick={() => setIsVideoPlaying(true)}
                      >
                        <Play className="h-8 w-8 text-white transition-transform group-hover:scale-110" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-white">
                      <div className="text-center">
                        <div className="mb-4 text-6xl">🚀</div>
                        <p className="text-xl">Demo video would play here</p>
                        <Button
                          className="mt-4"
                          variant="outline"
                          onClick={() => setIsVideoPlaying(false)}
                        >
                          Close Demo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Problem & Solution Section */}
      <div className="bg-white/50 py-20 backdrop-blur-lg dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
                The Problem
              </h2>
              <div className="space-y-4">
                {[
                  "95% of startups fail within the first 5 years",
                  "Founders spend 60% of time on non-core activities",
                  "Limited access to mentorship and resources",
                  "Difficulty in finding the right team and investors",
                ].map((problem, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <X className="mt-1 h-5 w-5 text-red-500" />
                    <p className="text-gray-600 dark:text-gray-300">
                      {problem}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
                Our Solution
              </h2>
              <div className="space-y-4">
                {[
                  "AI-powered business planning and strategy",
                  "Automated workflow and task management",
                  "Global network of mentors and experts",
                  "Smart matching with investors and co-founders",
                ].map((solution, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 text-green-500" />
                    <p className="text-gray-600 dark:text-gray-300">
                      {solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Revolutionary Features
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Everything you need to build, launch, and scale your startup
              successfully
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: "AI Business Planner",
                description:
                  "Generate comprehensive business plans with market research and financial projections in minutes",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Users,
                title: "Team Builder",
                description:
                  "Find and connect with co-founders, employees, and advisors using our smart matching algorithm",
                color: "from-blue-500 to-purple-500",
              },
              {
                icon: TrendingUp,
                title: "Growth Analytics",
                description:
                  "Track your startup's progress with real-time analytics and actionable insights",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: Target,
                title: "Investor Network",
                description:
                  "Access our curated network of angel investors and VCs actively looking for startups",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Clock,
                title: "Automation Engine",
                description:
                  "Automate repetitive tasks and focus on what matters most - building your product",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Globe,
                title: "Global Marketplace",
                description:
                  "Launch your product to a global audience with built-in marketing and distribution tools",
                color: "from-teal-500 to-blue-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group feature-card overflow-hidden border-none bg-white/80 backdrop-blur-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl dark:bg-gray-900/80"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div
                      className={`inline-flex rounded-lg bg-gradient-to-r ${feature.color} p-3 text-white shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white/50 py-20 backdrop-blur-lg dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              What Early Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Alex Chen",
                role: "Founder, TechVision",
                avatar: "AC",
                content:
                  "This platform gave me the clarity and direction I needed. My startup went from idea to MVP in just 3 weeks!",
                rating: 5,
              },
              {
                name: "Maria Santos",
                role: "CEO, EcoStart",
                avatar: "MS",
                content:
                  "The AI business planner created a strategy that got us our first $100K in funding. Absolutely game-changing!",
                rating: 5,
              },
              {
                name: "David Kim",
                role: "Co-founder, AppFlow",
                avatar: "DK",
                content:
                  "Found my co-founder through the platform and we're now building together. The matching algorithm is incredible.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="testimonial-card overflow-hidden border-none bg-white/80 backdrop-blur-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80"
              >
                <CardContent className="p-8">
                  <div className="mb-4 flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mb-6 text-gray-600 dark:text-gray-300">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { number: "50K+", label: "Startups Launched" },
              { number: "$2.5B", label: "Total Funding Raised" },
              { number: "95%", label: "Success Rate" },
              { number: "150+", label: "Countries" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="stat-number mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="cta-particles absolute inset-0">
          <div className="cta-particle cta-particle-1"></div>
          <div className="cta-particle cta-particle-2"></div>
          <div className="cta-particle cta-particle-3"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
          <h2 className="mb-4 text-5xl font-bold">
            Your Startup Journey Begins Now
          </h2>
          <p className="mb-8 text-xl">
            Join thousands of founders who are already building the future. Get
            early access and exclusive perks.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="group bg-white px-8 py-4 text-lg text-purple-600 hover:bg-gray-100"
            >
              <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Get Early Access
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white px-8 py-4 text-lg text-white hover:bg-white/10"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Join Community
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hero-bg-animation {
          background: linear-gradient(
            -45deg,
            #ee7752,
            #e73c7e,
            #23a6d5,
            #23d5ab
          );
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          opacity: 0.1;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .hero-gradient-text {
          animation: shimmer 3s ease-in-out infinite;
          background-size: 300% 100%;
        }

        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animated-badge {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.6);
          }
        }

        .animated-button {
          animation: button-float 3s ease-in-out infinite;
        }

        @keyframes button-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .feature-card {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .feature-card:hover {
          transform: translateY(-10px) scale(1.05);
        }

        .testimonial-card {
          animation: float-gentle 6s ease-in-out infinite;
        }

        .testimonial-card:nth-child(2) {
          animation-delay: 2s;
        }

        .testimonial-card:nth-child(3) {
          animation-delay: 4s;
        }

        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .stat-number {
          animation: count-up 2s ease-out;
        }

        @keyframes count-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cta-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
        }

        .cta-particle-1 {
          top: 20%;
          left: 10%;
          animation: float-particles 8s ease-in-out infinite;
        }

        .cta-particle-2 {
          top: 60%;
          left: 80%;
          animation: float-particles 10s ease-in-out infinite reverse;
        }

        .cta-particle-3 {
          top: 30%;
          left: 60%;
          animation: float-particles 12s ease-in-out infinite;
        }

        @keyframes float-particles {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-30px) translateX(20px);
          }
          66% {
            transform: translateY(20px) translateX(-20px);
          }
        }
      `}</style>
    </div>
  );
}
