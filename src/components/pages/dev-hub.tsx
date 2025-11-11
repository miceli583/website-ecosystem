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
  Star,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function DevHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  // State for localhost detection (client-side only to avoid hydration issues)
  const [isLocalhost, setIsLocalhost] = useState(false);

  // Detect localhost on client side only
  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    );
  }, []);

  // Helper to get the correct URL for live sites
  const getLiveSiteUrl = (domainName: string) => {
    if (isLocalhost) {
      return `/?domain=${domainName}`;
    }
    // Production URLs
    const urls: Record<string, string> = {
      matthew: "https://matthewmiceli.com",
      live: "https://miraclemind.live",
      dev: "https://miraclemind.dev",
    };
    return urls[domainName] || "/";
  };

  const [selectedVariation, setSelectedVariation] =
    useState("/admin/dope-ass-landing");
  const [selectedJoinCommunity, setSelectedJoinCommunity] =
    useState("/admin/join-community-1");
  const [selectedLaunchLanding, setSelectedLaunchLanding] =
    useState("/admin/launch-landing-1");

  const landingPageVariations = [
    { name: "Original (Golden)", path: "/admin/dope-ass-landing" },
    { name: "Earth to Sky Gradient", path: "/admin/dope-ass-landing/earth-sky" },
    { name: "Deep Ocean Gradient", path: "/admin/dope-ass-landing/deep-ocean" },
    { name: "Emerald-Teal Gradient", path: "/admin/dope-ass-landing/emerald-teal" },
    { name: "Blue-Cyan Gradient", path: "/admin/dope-ass-landing/blue-cyan" },
    { name: "Emerald", path: "/admin/dope-ass-landing/emerald" },
    { name: "Cosmic Blue", path: "/admin/dope-ass-landing/cosmic-blue" },
    { name: "Teal", path: "/admin/dope-ass-landing/teal" },
    { name: "Forest Green", path: "/admin/dope-ass-landing/forest-green" },
  ];

  const joinCommunityVariations = [
    { name: "Original (Golden)", path: "/admin/join-community-1" },
    { name: "Earth to Sky Gradient", path: "/admin/join-community-1/earth-sky" },
    { name: "Deep Ocean Gradient", path: "/admin/join-community-1/deep-ocean" },
    { name: "Emerald-Teal Gradient", path: "/admin/join-community-1/emerald-teal" },
    { name: "Blue-Cyan Gradient", path: "/admin/join-community-1/blue-cyan" },
    { name: "Emerald", path: "/admin/join-community-1/emerald" },
    { name: "Cosmic Blue", path: "/admin/join-community-1/cosmic-blue" },
    { name: "Teal", path: "/admin/join-community-1/teal" },
    { name: "Forest Green", path: "/admin/join-community-1/forest-green" },
  ];

  const launchLandingVariations = [
    { name: "Original (Golden)", path: "/admin/launch-landing-1" },
    { name: "Earth to Sky Gradient", path: "/admin/launch-landing-1/earth-sky" },
    { name: "Deep Ocean Gradient", path: "/admin/launch-landing-1/deep-ocean" },
    { name: "Emerald-Teal Gradient", path: "/admin/launch-landing-1/emerald-teal" },
    { name: "Blue-Cyan Gradient", path: "/admin/launch-landing-1/blue-cyan" },
    { name: "Emerald", path: "/admin/launch-landing-1/emerald" },
    { name: "Cosmic Blue", path: "/admin/launch-landing-1/cosmic-blue" },
    { name: "Teal", path: "/admin/launch-landing-1/teal" },
    { name: "Forest Green", path: "/admin/launch-landing-1/forest-green" },
  ];

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
    {
      title: "Statistics Dashboard",
      description: "System metrics and analytics",
      details:
        "Monitor users, sessions, database stats, system status, and multi-domain deployment information.",
      href: `/admin/statistics${domainParam}`,
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

        {/* Live Sites Section */}
        <section className="mb-20">
          <h2
            className="mb-8 text-center text-4xl font-bold"
            style={{ fontFamily: "Bourton, sans-serif", color: "#facf39" }}
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
                        fontFamily: "Airwaves, sans-serif",
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
                        fontFamily: "Airwaves, sans-serif",
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
                        fontFamily: "Airwaves, sans-serif",
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
            style={{ fontFamily: "Bourton, sans-serif", color: "#facf39" }}
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
                        fontFamily: "Airwaves, sans-serif",
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
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
                    Live Site Preview
                  </Badge>
                  <button
                    onClick={() => router.push(`/admin/matthewmiceli${domainParam}`)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-500 transition-colors hover:opacity-80"
                  >
                    <span>View Demo</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
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
                        fontFamily: "Airwaves, sans-serif",
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
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                    Live Site Preview
                  </Badge>
                  <button
                    onClick={() => router.push(`/admin/miraclemind-live${domainParam}`)}
                    className="flex items-center gap-2 text-sm font-medium text-emerald-500 transition-colors hover:opacity-80"
                  >
                    <span>View Demo</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
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
                        fontFamily: "Airwaves, sans-serif",
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
                <div className="flex items-center justify-between">
                  <Badge className="bg-violet-500/10 text-violet-500 dark:bg-violet-500/20">
                    Live Site Preview
                  </Badge>
                  <button
                    onClick={() => router.push(`/admin/miraclemind-dev${domainParam}`)}
                    className="flex items-center gap-2 text-sm font-medium text-violet-500 transition-colors hover:opacity-80"
                  >
                    <span>View Demo</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Original landing page cards below */}
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
                    onClick={() => router.push(`${selectedVariation}${domainParam}`)}
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
                    onClick={() => router.push(`${selectedJoinCommunity}${domainParam}`)}
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
                    onClick={() => router.push(`${selectedLaunchLanding}${domainParam}`)}
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
                <Link
                  key={feature.title}
                  href={feature.href}
                  onClick={() => console.log('Navigating to:', feature.href)}
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
