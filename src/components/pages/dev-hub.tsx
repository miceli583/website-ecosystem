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
  Star,
  Megaphone,
  ChevronDown,
  CalendarClock,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Suspense } from "react";

function DevHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  // Fetch daily values stats
  const { data: dailyValuesStats } = api.dailyValues.getStats.useQuery();

  // Helper to get the actual live site URLs (always production, never localhost)
  const getLiveSiteUrl = (domainName: string) => {
    const urls: Record<string, string> = {
      matthew: "https://matthewmiceli.com",
      live: "https://miraclemind.live",
      dev: "https://miraclemind.dev",
    };
    return urls[domainName] || "/";
  };

  const features = [
    {
      title: "Brand Assets",
      description: "Visual identity & brand guidelines",
      details:
        "Complete brand asset library including logos, colors, favicons in multiple formats (SVG, PNG, PDF).",
      href: `/admin/brand${domainParam}`,
      icon: Palette,
      color: "golden",
      count: "Brand Kit",
    },
    {
      title: "Page Templates",
      description: "Full-page template collection",
      details:
        "Pre-built templates for portfolios, SaaS products, startups, and developer profiles.",
      href: `/admin/templates${domainParam}`,
      icon: Rocket,
      color: "emerald",
      count: "4 templates",
    },
    {
      title: "GLSL Shaders",
      description: "WebGL shader animations",
      details:
        "8 interactive shader demonstrations including sacred geometry, fractals, neural networks, and generative art.",
      href: `/admin/shaders${domainParam}`,
      icon: Zap,
      color: "cosmic-purple",
      count: "8 shaders",
    },
    {
      title: "Component Playground",
      description: "Interactive UI component demos",
      details:
        "Test and explore animation effects, particle systems, and interactive components in development.",
      href: `/admin/playground${domainParam}`,
      icon: Code2,
      color: "cosmic-blue",
      count: "9 demos",
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
                src="/brand/miracle-mind-orbit-star-v3.svg"
                alt="Miracle Mind"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <h1
            className="mb-4 text-6xl font-bold text-black dark:text-white"
            style={{
              fontFamily: "var(--font-cinzel)",
              letterSpacing: "0.1em",
            }}
          >
            Development Hub
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-xl text-neutral-600 dark:text-neutral-400">
            Miracle Mind - Under Development
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              admin.miraclemind.dev
            </Badge>
          </div>
        </section>

        {/* Live Sites Section */}
        <section className="mb-20">
          <h2
            className="mb-8 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-lato)", color: "#D4AF37" }}
          >
            Live Sites
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Matthew Miceli */}
            <a
              href={getLiveSiteUrl("matthew")}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="flex h-full flex-col border-2 border-blue-500/20 transition-all duration-300 hover:shadow-2xl dark:border-blue-500/30">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex flex-none items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Matthew Miceli
                    </h3>
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Personal portfolio and professional presence
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
                      matthewmiceli.com
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-blue-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* MiracleMind Live */}
            <a
              href={getLiveSiteUrl("live")}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="flex h-full flex-col border-2 border-emerald-500/20 transition-all duration-300 hover:shadow-2xl dark:border-emerald-500/30">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex flex-none items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      MiracleMind Live
                    </h3>
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Main product and brand site
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                      miraclemind.live
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* MiracleMind Dev */}
            <a
              href={getLiveSiteUrl("dev")}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="flex h-full flex-col border-2 border-violet-500/20 transition-all duration-300 hover:shadow-2xl dark:border-violet-500/30">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex flex-none items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      MiracleMind Dev
                    </h3>
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Technical documentation and resources
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-violet-500/10 text-violet-500 dark:bg-violet-500/20">
                      miraclemind.dev
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-violet-500 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>
        </section>

        {/* Sites Under Development Section */}
        <section className="mb-20">
          <h2
            className="mb-8 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-lato)", color: "#D4AF37" }}
          >
            Sites Under Development
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Dev Version: Matthew Miceli */}
            <Card className="group flex h-full flex-col border-2 border-blue-500/30 bg-blue-500/5 transition-all duration-300 hover:shadow-2xl dark:border-blue-500/40 dark:bg-blue-500/10">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Matthew Miceli
                    </h3>
                    <Badge className="mt-1 bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      DEV VERSION
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Development preview of matthewmiceli.com homepage
                </p>
                <button
                  onClick={() => router.push(`/?domain=matthew`)}
                  className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-sm font-medium text-blue-500 transition-all hover:border-blue-500/40 hover:bg-blue-500/10"
                >
                  <span>Preview</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>

            {/* Dev Version: MiracleMind Live */}
            <Card className="group flex h-full flex-col border-2 border-emerald-500/30 bg-emerald-500/5 transition-all duration-300 hover:shadow-2xl dark:border-emerald-500/40 dark:bg-emerald-500/10">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                    <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      MiracleMind Live
                    </h3>
                    <Badge className="mt-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      DEV VERSION
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Development preview of miraclemind.live homepage
                </p>
                <button
                  onClick={() => router.push(`/?domain=live`)}
                  className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm font-medium text-emerald-500 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10"
                >
                  <span>Preview</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>

            {/* Dev Version: MiracleMind Dev */}
            <Card className="group flex h-full flex-col border-2 border-violet-500/30 bg-violet-500/5 transition-all duration-300 hover:shadow-2xl dark:border-violet-500/40 dark:bg-violet-500/10">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg">
                    <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      MiracleMind Dev
                    </h3>
                    <Badge className="mt-1 bg-violet-500/20 text-violet-600 dark:text-violet-400">
                      DEV VERSION
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Development preview of miraclemind.dev homepage
                </p>
                <button
                  onClick={() => router.push(`/?domain=dev`)}
                  className="flex items-center justify-between rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-2 text-sm font-medium text-violet-500 transition-all hover:border-violet-500/40 hover:bg-violet-500/10"
                >
                  <span>Preview</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>

            {/* Landing Page: Countdown Landing */}
            <Card className="group flex h-full flex-col border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-amber-500/10 transition-all duration-300 hover:shadow-2xl dark:border-amber-500/40 dark:from-amber-500/10 dark:to-amber-500/5">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg transition-transform group-hover:scale-110">
                    <Megaphone className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Countdown Landing
                    </h3>
                    <Badge className="mt-1 border-amber-500/30 bg-amber-500/20 text-amber-700 shadow-sm dark:text-amber-300">
                      9 THEMES
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Epic countdown timer with bold typography and animated
                  backgrounds
                </p>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) router.push(e.target.value);
                    }}
                    className="w-full cursor-pointer appearance-none rounded-lg border-2 border-amber-500/30 bg-white px-4 py-3 pr-10 text-sm font-semibold text-amber-700 shadow-sm transition-all hover:border-amber-500/50 hover:shadow-md focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none dark:bg-neutral-900 dark:text-amber-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose a theme...
                    </option>
                    <option value={`/admin/dope-ass-landing${domainParam}`}>
                      🌟 Golden
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/emerald${domainParam}`}
                    >
                      💚 Emerald
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/cosmic-blue${domainParam}`}
                    >
                      🌌 Cosmic Blue
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/blue-cyan${domainParam}`}
                    >
                      💎 Blue Cyan
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/deep-ocean${domainParam}`}
                    >
                      🌊 Deep Ocean
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/emerald-teal${domainParam}`}
                    >
                      🍃 Emerald Teal
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/forest-green${domainParam}`}
                    >
                      🌲 Forest Green
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/teal${domainParam}`}
                    >
                      🐚 Teal
                    </option>
                    <option
                      value={`/admin/dope-ass-landing/earth-sky${domainParam}`}
                    >
                      🌍 Earth Sky
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            {/* Landing Page: Community Waitlist */}
            <Card className="group flex h-full flex-col border-2 border-rose-500/30 bg-gradient-to-br from-rose-500/5 to-rose-500/10 transition-all duration-300 hover:shadow-2xl dark:border-rose-500/40 dark:from-rose-500/10 dark:to-rose-500/5">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg transition-transform group-hover:scale-110">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Community Waitlist
                    </h3>
                    <Badge className="mt-1 border-rose-500/30 bg-rose-500/20 text-rose-700 shadow-sm dark:text-rose-300">
                      9 THEMES
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Capture early adopters with elegant waitlist signup forms
                </p>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) router.push(e.target.value);
                    }}
                    className="w-full cursor-pointer appearance-none rounded-lg border-2 border-rose-500/30 bg-white px-4 py-3 pr-10 text-sm font-semibold text-rose-700 shadow-sm transition-all hover:border-rose-500/50 hover:shadow-md focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:bg-neutral-900 dark:text-rose-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose a theme...
                    </option>
                    <option value={`/admin/join-community-1${domainParam}`}>
                      🌟 Golden
                    </option>
                    <option
                      value={`/admin/join-community-1/emerald${domainParam}`}
                    >
                      💚 Emerald
                    </option>
                    <option
                      value={`/admin/join-community-1/cosmic-blue${domainParam}`}
                    >
                      🌌 Cosmic Blue
                    </option>
                    <option
                      value={`/admin/join-community-1/blue-cyan${domainParam}`}
                    >
                      💎 Blue Cyan
                    </option>
                    <option
                      value={`/admin/join-community-1/deep-ocean${domainParam}`}
                    >
                      🌊 Deep Ocean
                    </option>
                    <option
                      value={`/admin/join-community-1/emerald-teal${domainParam}`}
                    >
                      🍃 Emerald Teal
                    </option>
                    <option
                      value={`/admin/join-community-1/forest-green${domainParam}`}
                    >
                      🌲 Forest Green
                    </option>
                    <option
                      value={`/admin/join-community-1/teal${domainParam}`}
                    >
                      🐚 Teal
                    </option>
                    <option
                      value={`/admin/join-community-1/earth-sky${domainParam}`}
                    >
                      🌍 Earth Sky
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-rose-500" />
                </div>
              </CardContent>
            </Card>

            {/* Landing Page: Launch Event */}
            <Card className="group flex h-full flex-col border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 transition-all duration-300 hover:shadow-2xl dark:border-cyan-500/40 dark:from-cyan-500/10 dark:to-cyan-500/5">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg transition-transform group-hover:scale-110">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Launch Event
                    </h3>
                    <Badge className="mt-1 border-cyan-500/30 bg-cyan-500/20 text-cyan-700 shadow-sm dark:text-cyan-300">
                      9 THEMES
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Announce product launches with high-impact hero sections
                </p>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) router.push(e.target.value);
                    }}
                    className="w-full cursor-pointer appearance-none rounded-lg border-2 border-cyan-500/30 bg-white px-4 py-3 pr-10 text-sm font-semibold text-cyan-700 shadow-sm transition-all hover:border-cyan-500/50 hover:shadow-md focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none dark:bg-neutral-900 dark:text-cyan-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose a theme...
                    </option>
                    <option value={`/admin/launch-landing-1${domainParam}`}>
                      🌟 Golden
                    </option>
                    <option
                      value={`/admin/launch-landing-1/emerald${domainParam}`}
                    >
                      💚 Emerald
                    </option>
                    <option
                      value={`/admin/launch-landing-1/cosmic-blue${domainParam}`}
                    >
                      🌌 Cosmic Blue
                    </option>
                    <option
                      value={`/admin/launch-landing-1/blue-cyan${domainParam}`}
                    >
                      💎 Blue Cyan
                    </option>
                    <option
                      value={`/admin/launch-landing-1/deep-ocean${domainParam}`}
                    >
                      🌊 Deep Ocean
                    </option>
                    <option
                      value={`/admin/launch-landing-1/emerald-teal${domainParam}`}
                    >
                      🍃 Emerald Teal
                    </option>
                    <option
                      value={`/admin/launch-landing-1/forest-green${domainParam}`}
                    >
                      🌲 Forest Green
                    </option>
                    <option
                      value={`/admin/launch-landing-1/teal${domainParam}`}
                    >
                      🐚 Teal
                    </option>
                    <option
                      value={`/admin/launch-landing-1/earth-sky${domainParam}`}
                    >
                      🌍 Earth Sky
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-cyan-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tooling Section */}
        <section className="mb-20">
          <h2
            className="mb-8 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-lato)", color: "#D4AF37" }}
          >
            Tooling
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Daily Value Post Automation */}
            <Card className="group flex h-full flex-col border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 transition-all duration-300 hover:shadow-2xl dark:border-indigo-500/40 dark:from-indigo-500/10 dark:to-indigo-500/5">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-none items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg transition-transform group-hover:scale-110">
                    <CalendarClock className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-black dark:text-white"
                      style={{
                        fontFamily: "var(--font-cinzel)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Daily Value Post Automation
                    </h3>
                    <Badge className="mt-1 border-indigo-500/30 bg-indigo-500/20 text-indigo-700 shadow-sm dark:text-indigo-300">
                      {dailyValuesStats?.coreValues ?? 0} VALUES •{" "}
                      {dailyValuesStats?.quotes ?? 0} QUOTES
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Create and automate daily inspirational posts with values and
                  quotes
                </p>
                <button
                  onClick={() =>
                    router.push(`/admin/daily-values${domainParam}`)
                  }
                  className="flex items-center justify-between rounded-lg border-2 border-indigo-500/30 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:border-indigo-500/50 hover:shadow-md dark:bg-neutral-900 dark:text-indigo-400"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Assets Grid */}
        <section className="mb-16">
          <h2
            className="mb-8 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-lato)", color: "#D4AF37" }}
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
                  gradient: "from-[#D4AF37] to-[#f59e0b]",
                  border: "border-[#D4AF37]/20 dark:border-[#D4AF37]/30",
                  badge:
                    "bg-[#D4AF37]/10 text-[#D4AF37] dark:bg-[#D4AF37]/20 dark:text-[#D4AF37]",
                  text: "#D4AF37",
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
                <Link
                  key={feature.title}
                  href={feature.href}
                  onClick={() => console.log("Navigating to:", feature.href)}
                >
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
                          fontFamily: "var(--font-cinzel)",
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
          <Card className="mx-auto max-w-3xl border-2 border-[#D4AF37]/20 bg-gradient-to-br from-white to-neutral-50 shadow-lg dark:from-neutral-900 dark:to-black">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="relative h-12 w-12 shrink-0">
                  <Image
                    src="/brand/miracle-mind-orbit-star-v3.svg"
                    alt="Miracle Mind"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
                <div className="text-left">
                  <h3
                    className="mb-2 text-xl font-bold text-black dark:text-white"
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Development Environment
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    This is the development environment for Miracle Mind.
                    Features are under active development.
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

export function DevHub() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <DevHubContent />
    </Suspense>
  );
}
