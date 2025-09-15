"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DomainLayout } from "~/components/domain-layout";
import { PlaygroundLayout } from "~/components/playground/playground-layout";
import {
  Check,
  Star,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Play,
  BarChart3,
  Target,
  Rocket,
  Heart,
  MessageCircle,
  Quote,
} from "lucide-react";

export default function SaasBusinessPage() {
  return (
    <DomainLayout>
      <PlaygroundLayout>
        <div className="min-h-full bg-white dark:bg-gray-950">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
              <div className="text-center">
                <Badge className="mb-6 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <Rocket className="mr-1 h-3 w-3" />
                  Now in Beta
                </Badge>

                <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-7xl">
                  <span className="block">Scale your business</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    with CloudFlow
                  </span>
                </h1>

                <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
                  The all-in-one platform that helps modern businesses automate workflows,
                  manage teams, and scale operations with enterprise-grade security.
                </p>

                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" className="group bg-blue-600 px-8 py-4 text-lg hover:bg-blue-700">
                    <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button size="lg" variant="outline" className="group px-8 py-4 text-lg">
                    <BarChart3 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    View Demo
                  </Button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  14-day free trial • No credit card required • Cancel anytime
                </p>
              </div>

              {/* Feature Cards */}
              <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Deploy in minutes with our one-click setup process"
                  },
                  {
                    icon: Shield,
                    title: "Enterprise Security",
                    description: "SOC2 compliant with end-to-end encryption"
                  },
                  {
                    icon: Globe,
                    title: "Global Scale",
                    description: "99.9% uptime with servers in 15+ regions worldwide"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="group cursor-pointer border-none bg-white/60 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800/60">
                    <CardContent className="p-8 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-blue-100 p-3 transition-colors group-hover:bg-blue-200 dark:bg-blue-900 dark:group-hover:bg-blue-800">
                          <feature.icon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gray-50 py-16 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Trusted by teams worldwide
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[
                  { number: "10,000+", label: "Active Users" },
                  { number: "99.9%", label: "Uptime SLA" },
                  { number: "150+", label: "Countries" },
                  { number: "24/7", label: "Support" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                  Everything you need to succeed
                </h2>
                <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
                  Powerful features designed to help your team collaborate and scale efficiently
                </p>
              </div>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {[
                  {
                    icon: Users,
                    title: "Team Collaboration",
                    description: "Real-time collaboration tools with advanced permission controls and activity tracking.",
                    features: ["Real-time editing", "Comment system", "Role-based access", "Activity feeds"]
                  },
                  {
                    icon: TrendingUp,
                    title: "Advanced Analytics",
                    description: "Get deep insights into your business with powerful analytics and reporting tools.",
                    features: ["Custom dashboards", "Real-time metrics", "Export reports", "API access"]
                  },
                  {
                    icon: Target,
                    title: "Automation Engine",
                    description: "Streamline workflows with our no-code automation builder and triggers.",
                    features: ["Visual workflow builder", "Custom triggers", "Integration hub", "Smart notifications"]
                  },
                  {
                    icon: Award,
                    title: "Enterprise Ready",
                    description: "Scale with confidence using enterprise-grade security and compliance features.",
                    features: ["SOC2 compliance", "SSO integration", "Advanced security", "Priority support"]
                  }
                ].map((feature, index) => (
                  <Card key={index} className="group overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl">
                    <CardContent className="p-8">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-3 text-white">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="mb-6 text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.features.map((item, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gray-50 py-20 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                  Simple, transparent pricing
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Choose the plan that&apos;s right for your team
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {[
                  {
                    name: "Starter",
                    price: "$9",
                    period: "per user/month",
                    description: "Perfect for small teams getting started",
                    features: ["Up to 10 users", "Basic analytics", "Email support", "5GB storage"],
                    popular: false
                  },
                  {
                    name: "Professional",
                    price: "$29",
                    period: "per user/month",
                    description: "For growing teams that need more power",
                    features: ["Up to 100 users", "Advanced analytics", "Priority support", "50GB storage", "API access"],
                    popular: true
                  },
                  {
                    name: "Enterprise",
                    price: "Custom",
                    period: "contact sales",
                    description: "For large organizations with custom needs",
                    features: ["Unlimited users", "Custom integrations", "Dedicated support", "Unlimited storage", "SSO & compliance"],
                    popular: false
                  }
                ].map((plan, index) => (
                  <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${plan.popular ? 'border-blue-500 shadow-xl' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 transform">
                        <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="p-8">
                      <div className="mb-6 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                          {plan.period !== "contact sales" && (
                            <span className="ml-1 text-gray-600 dark:text-gray-400">/{plan.period}</span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">{plan.description}</p>
                      </div>
                      <ul className="mb-8 space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                  What our customers say
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  {
                    name: "Sarah Johnson",
                    role: "CEO, TechStart",
                    avatar: "SJ",
                    content: "CloudFlow transformed how our team collaborates. We've seen a 40% increase in productivity since switching."
                  },
                  {
                    name: "Michael Chen",
                    role: "CTO, DataCorp",
                    avatar: "MC",
                    content: "The automation features saved us countless hours. It's like having an extra team member working 24/7."
                  },
                  {
                    name: "Emily Rodriguez",
                    role: "Product Manager, InnovateX",
                    avatar: "ER",
                    content: "Best investment we've made for our workflow. The analytics insights help us make better decisions daily."
                  }
                ].map((testimonial, index) => (
                  <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <blockquote className="mb-6 text-gray-600 dark:text-gray-300">
                        &ldquo;{testimonial.content}&rdquo;
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white">
                Ready to transform your workflow?
              </h2>
              <p className="mb-8 text-xl text-blue-100">
                Join thousands of teams already using CloudFlow to scale their business
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="bg-white px-8 py-4 text-lg text-blue-600 hover:bg-gray-100">
                  Start Your Free Trial
                </Button>
                <Button size="lg" variant="outline" className="border-white px-8 py-4 text-lg text-white hover:bg-white/10">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .bg-grid-pattern {
            background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}</style>
      </PlaygroundLayout>
    </DomainLayout>
  );
}