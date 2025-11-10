"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Code2,
  Rocket,
  ArrowRight,
  Palette,
  Sparkles,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DevHub() {
  const router = useRouter();
  const [selectedVariation, setSelectedVariation] =
    useState("/dope-ass-landing");
  const [selectedJoinCommunity, setSelectedJoinCommunity] =
    useState("/join-community-1");
  const [selectedLaunchLanding, setSelectedLaunchLanding] =
    useState("/launch-landing-1");

  const landingPageVariations = [
    { name: "Original (Golden)", path: "/dope-ass-landing" },
    { name: "Earth to Sky Gradient", path: "/dope-ass-landing/earth-sky" },
    { name: "Deep Ocean Gradient", path: "/dope-ass-landing/deep-ocean" },
    { name: "Emerald-Teal Gradient", path: "/dope-ass-landing/emerald-teal" },
    { name: "Blue-Cyan Gradient", path: "/dope-ass-landing/blue-cyan" },
    { name: "Emerald", path: "/dope-ass-landing/emerald" },
    { name: "Cosmic Blue", path: "/dope-ass-landing/cosmic-blue" },
    { name: "Teal", path: "/dope-ass-landing/teal" },
    { name: "Forest Green", path: "/dope-ass-landing/forest-green" },
  ];

  const joinCommunityVariations = [
    { name: "Original (Golden)", path: "/join-community-1" },
    { name: "Earth to Sky Gradient", path: "/join-community-1/earth-sky" },
    { name: "Deep Ocean Gradient", path: "/join-community-1/deep-ocean" },
    { name: "Emerald-Teal Gradient", path: "/join-community-1/emerald-teal" },
    { name: "Blue-Cyan Gradient", path: "/join-community-1/blue-cyan" },
    { name: "Emerald", path: "/join-community-1/emerald" },
    { name: "Cosmic Blue", path: "/join-community-1/cosmic-blue" },
    { name: "Teal", path: "/join-community-1/teal" },
    { name: "Forest Green", path: "/join-community-1/forest-green" },
  ];

  const launchLandingVariations = [
    { name: "Original (Golden)", path: "/launch-landing-1" },
    { name: "Earth to Sky Gradient", path: "/launch-landing-1/earth-sky" },
    { name: "Deep Ocean Gradient", path: "/launch-landing-1/deep-ocean" },
    { name: "Emerald-Teal Gradient", path: "/launch-landing-1/emerald-teal" },
    { name: "Blue-Cyan Gradient", path: "/launch-landing-1/blue-cyan" },
    { name: "Emerald", path: "/launch-landing-1/emerald" },
    { name: "Cosmic Blue", path: "/launch-landing-1/cosmic-blue" },
    { name: "Teal", path: "/launch-landing-1/teal" },
    { name: "Forest Green", path: "/launch-landing-1/forest-green" },
  ];

  const features = [
    {
      title: "Brand Assets",
      description: "Visual identity & brand guidelines",
      details:
        "Complete brand asset library including logos, colors, favicons in multiple formats (SVG, PNG, PDF).",
      href: "/brand",
      icon: Palette,
      color: "golden",
      count: "Brand Kit",
    },
    {
      title: "Page Templates",
      description: "Full-page template collection",
      details:
        "Pre-built templates for portfolios, SaaS products, startups, and developer profiles.",
      href: "/templates",
      icon: Rocket,
      color: "emerald",
      count: "4 templates",
    },
    {
      title: "GLSL Shaders",
      description: "WebGL shader animations",
      details:
        "8 interactive shader demonstrations including sacred geometry, fractals, neural networks, and generative art.",
      href: "/shaders",
      icon: Zap,
      color: "cosmic-purple",
      count: "8 shaders",
    },
    {
      title: "Component Playground",
      description: "Interactive UI component demos",
      details:
        "Test and explore animation effects, particle systems, and interactive components in development.",
      href: "/playground",
      icon: Code2,
      color: "cosmic-blue",
      count: "9 demos",
    },
    {
      title: "Statistics Dashboard",
      description: "System metrics and analytics",
      details:
        "Monitor users, sessions, database stats, system status, and multi-domain deployment information.",
      href: "/admin/statistics",
      icon: BarChart3,
      color: "sunset-orange",
      count: "Live Stats",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <section className="mb-20 text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative h-20 w-20">
              <Image
                src="/brand/symbol.svg"
                alt="New Earth Collective"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <h1
            className="mb-4 text-6xl font-bold text-black dark:text-white"
            style={{
              fontFamily: "Airwaves, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Development Hub
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-xl text-neutral-600 dark:text-neutral-400">
            New Earth Collective - Under Development
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="border-[#facf39]/40 bg-[#facf39]/10 text-[#facf39]">
              test.joinnewearthcollective.com
            </Badge>
          </div>
        </section>

        {/* Sites Section */}
        <section className="mb-20">
          <h2
            className="mb-8 text-center text-4xl font-bold"
            style={{ fontFamily: "Bourton, sans-serif", color: "#facf39" }}
          >
            Sites
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Dope Ass Landing Page with Dropdown */}
            <Card className="group flex h-full flex-col border-2 border-[#facf39]/20 transition-all duration-300 hover:shadow-2xl dark:border-[#facf39]/30">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#facf39] to-[#f59e0b] shadow-lg">
                    <Sparkles className="h-7 w-7 text-black" />
                  </div>
                  <h3
                    className="text-xl font-bold text-black dark:text-white"
                    style={{
                      fontFamily: "Airwaves, sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Dope Ass Landing
                  </h3>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Epic landing page with countdown timer and sacred geometry
                  vibes - now in 9 color variations!
                </p>

                {/* Dropdown to select variation */}
                <div className="mb-4">
                  <label
                    htmlFor="variation-select"
                    className="mb-2 block text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
                  >
                    Select Color Variation
                  </label>
                  <div className="relative">
                    <select
                      id="variation-select"
                      value={selectedVariation}
                      onChange={(e) => setSelectedVariation(e.target.value)}
                      className="w-full appearance-none rounded-lg border-2 border-[#facf39]/20 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-black transition-colors hover:border-[#facf39]/40 focus:border-[#facf39] focus:outline-none dark:border-[#facf39]/30 dark:bg-neutral-900 dark:text-white dark:hover:border-[#facf39]/50"
                    >
                      {landingPageVariations.map((variation) => (
                        <option key={variation.path} value={variation.path}>
                          {variation.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#facf39]" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className="bg-[#facf39]/10 text-[#facf39] dark:bg-[#facf39]/20">
                    9 Variations
                  </Badge>
                  <button
                    onClick={() => router.push(selectedVariation)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "#facf39" }}
                  >
                    <span>View Demo</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* JoinCommunity 1 with Dropdown */}
            <Card className="group flex h-full flex-col border-2 border-[#facf39]/20 transition-all duration-300 hover:shadow-2xl dark:border-[#facf39]/30">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#14b8a6] shadow-lg">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <h3
                    className="text-xl font-bold text-black dark:text-white"
                    style={{
                      fontFamily: "Airwaves, sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Join Community 1
                  </h3>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Full community landing page with waitlist CTA - now in 9 color
                  variations!
                </p>

                {/* Dropdown to select variation */}
                <div className="mb-4">
                  <label
                    htmlFor="join-community-select"
                    className="mb-2 block text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
                  >
                    Select Color Variation
                  </label>
                  <div className="relative">
                    <select
                      id="join-community-select"
                      value={selectedJoinCommunity}
                      onChange={(e) => setSelectedJoinCommunity(e.target.value)}
                      className="w-full appearance-none rounded-lg border-2 border-[#facf39]/20 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-black transition-colors hover:border-[#facf39]/40 focus:border-[#facf39] focus:outline-none dark:border-[#facf39]/30 dark:bg-neutral-900 dark:text-white dark:hover:border-[#facf39]/50"
                    >
                      {joinCommunityVariations.map((variation) => (
                        <option key={variation.path} value={variation.path}>
                          {variation.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#facf39]" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className="bg-[#facf39]/10 text-[#facf39] dark:bg-[#facf39]/20">
                    9 Variations
                  </Badge>
                  <button
                    onClick={() => router.push(selectedJoinCommunity)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "#facf39" }}
                  >
                    <span>View Demo</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Launch Landing 1 with Dropdown */}
            <Card className="group flex h-full flex-col border-2 border-[#facf39]/20 transition-all duration-300 hover:shadow-2xl dark:border-[#facf39]/30">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#facf39] to-[#f59e0b] shadow-lg">
                    <Sparkles className="h-7 w-7 text-black" />
                  </div>
                  <h3
                    className="text-xl font-bold text-black dark:text-white"
                    style={{
                      fontFamily: "Airwaves, sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Launch Landing 1
                  </h3>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Event landing page with countdown timer for Dec 20th launch
                  party - 9 color variations!
                </p>

                {/* Dropdown to select variation */}
                <div className="mb-4">
                  <label
                    htmlFor="launch-landing-select"
                    className="mb-2 block text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
                  >
                    Select Color Variation
                  </label>
                  <div className="relative">
                    <select
                      id="launch-landing-select"
                      value={selectedLaunchLanding}
                      onChange={(e) => setSelectedLaunchLanding(e.target.value)}
                      className="w-full appearance-none rounded-lg border-2 border-[#facf39]/20 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-black transition-colors hover:border-[#facf39]/40 focus:border-[#facf39] focus:outline-none dark:border-[#facf39]/30 dark:bg-neutral-900 dark:text-white dark:hover:border-[#facf39]/50"
                    >
                      {launchLandingVariations.map((variation) => (
                        <option key={variation.path} value={variation.path}>
                          {variation.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#facf39]" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className="bg-[#facf39]/10 text-[#facf39] dark:bg-[#facf39]/20">
                    9 Variations
                  </Badge>
                  <button
                    onClick={() => router.push(selectedLaunchLanding)}
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "#facf39" }}
                  >
                    <span>View Demo</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Assets Grid */}
        <section className="mb-16">
          <h2
            className="mb-8 text-center text-4xl font-bold"
            style={{ fontFamily: "Bourton, sans-serif", color: "#facf39" }}
          >
            Assets
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              const colorMap: Record<
                string,
                {
                  gradient: string;
                  border: string;
                  badge: string;
                  text: string;
                }
              > = {
                "cosmic-purple": {
                  gradient: "from-[#6d28d9] to-[#a855f7]",
                  border: "border-[#6d28d9]/20 dark:border-[#6d28d9]/30",
                  badge:
                    "bg-[#6d28d9]/10 text-[#6d28d9] dark:bg-[#6d28d9]/20 dark:text-[#a855f7]",
                  text: "#6d28d9",
                },
                "cosmic-blue": {
                  gradient: "from-[#0891b2] to-[#06b6d4]",
                  border: "border-[#0891b2]/20 dark:border-[#0891b2]/30",
                  badge:
                    "bg-[#0891b2]/10 text-[#0891b2] dark:bg-[#0891b2]/20 dark:text-[#06b6d4]",
                  text: "#0891b2",
                },
                emerald: {
                  gradient: "from-[#059669] to-[#10b981]",
                  border: "border-[#059669]/20 dark:border-[#059669]/30",
                  badge:
                    "bg-[#059669]/10 text-[#059669] dark:bg-[#059669]/20 dark:text-[#10b981]",
                  text: "#059669",
                },
                golden: {
                  gradient: "from-[#facf39] to-[#f59e0b]",
                  border: "border-[#facf39]/20 dark:border-[#facf39]/30",
                  badge:
                    "bg-[#facf39]/10 text-[#facf39] dark:bg-[#facf39]/20 dark:text-[#facf39]",
                  text: "#facf39",
                },
                "sunset-orange": {
                  gradient: "from-[#f97316] to-[#fb923c]",
                  border: "border-[#f97316]/20 dark:border-[#f97316]/30",
                  badge:
                    "bg-[#f97316]/10 text-[#f97316] dark:bg-[#f97316]/20 dark:text-[#fb923c]",
                  text: "#f97316",
                },
              };
              const colors = colorMap[feature.color] ?? colorMap.golden!;

              return (
                <Link key={feature.title} href={feature.href}>
                  <Card
                    className={`group flex h-full cursor-pointer flex-col border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${colors.border}`}
                  >
                    <CardHeader className="flex-none">
                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle
                        className="text-xl font-bold text-black dark:text-white"
                        style={{
                          fontFamily: "Airwaves, sans-serif",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-neutral-600 dark:text-neutral-400">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col space-y-4">
                      <p className="flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {feature.details}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={colors.badge}>{feature.count}</Badge>
                        <div
                          className="flex items-center gap-2 text-sm font-medium transition-colors"
                          style={{ color: colors.text }}
                        >
                          <span>Explore</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-center">
          <Card className="mx-auto max-w-3xl border-2 border-[#facf39]/20 bg-gradient-to-br from-white to-neutral-50 shadow-lg dark:from-neutral-900 dark:to-black">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="relative h-12 w-12 shrink-0">
                  <Image
                    src="/brand/symbol.svg"
                    alt="New Earth Collective"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
                <div className="text-left">
                  <h3
                    className="mb-2 text-xl font-bold text-black dark:text-white"
                    style={{
                      fontFamily: "Airwaves, sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Development Environment
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    This is the development environment for New Earth
                    Collective. Features are under active development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
