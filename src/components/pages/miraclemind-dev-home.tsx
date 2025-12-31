"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  ArrowRight,
  Brain,
  Heart,
  Network,
  Sparkles,
  Target,
  Users,
  Zap,
  Layers,
  Rocket,
  RefreshCw,
  Activity,
  DollarSign,
  HeartHandshake,
  Lightbulb,
} from "lucide-react";
import { BanyanEarlyAccessForm } from "~/components/banyan/early-access-form";

export function MiracleMindDevHomePage() {
  // Update page title and favicon for Banyan
  useEffect(() => {
    document.title = "BANYAN";

    // Update favicon
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = "/brand/banyan-tree-icon.svg";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.type = "image/svg+xml";
      newFavicon.href = "/brand/banyan-tree-icon.svg";
      document.head.appendChild(newFavicon);
    }

    // Cleanup: restore default on unmount
    return () => {
      document.title = "Create T3 App";
      const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (favicon) {
        favicon.href = "/brand/miracle-mind-orbit-star-v3.svg";
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Neural Net Shader Background */}
      <div className="fixed inset-0 z-0">
        <iframe
          src="/shaders/neural-net/embed"
          className="h-full w-full border-0"
          style={{ pointerEvents: "none" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black"
          style={{ pointerEvents: "none" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {/* Hero Section */}
          <section className="mb-16 flex flex-col items-center text-center sm:mb-24">
            <div className="mb-4 inline-flex items-center justify-center">
              <div className="relative h-16 w-16 sm:h-24 sm:w-24">
                <Image
                  src="/brand/banyan-tree-icon.svg"
                  alt="Banyan Tree of Life"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <Badge
              className="mb-6"
              style={{
                background: "rgba(212, 175, 55, 0.2)",
                borderColor: "rgba(212, 175, 55, 0.4)",
                color: "#D4AF37",
              }}
            >
              Under Development: Web and Mobile
            </Badge>

            <h1
              className="mb-4 text-4xl font-bold text-white sm:mb-6 sm:text-6xl md:text-7xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              BANYAN
              <br />
              <span
                className="text-3xl sm:text-5xl md:text-6xl"
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 40px rgba(212, 175, 55, 0.3)",
                }}
              >
                Your Life Operating System
              </span>
            </h1>

            <p
              className="mx-auto mb-8 max-w-3xl px-4 text-base text-gray-200 sm:mb-12 sm:text-xl"
              style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 300 }}
            >
              AI-powered integration across all life domains. So your daily habits align with your deepest values, and your goals emerge naturally from your way of being.
            </p>

            <a href="#signup">
              <Button
                size="lg"
                className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                Join Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </section>

          {/* The Problem Section */}
          <section id="problem" className="mb-16 sm:mb-24">
            <div className="text-center">
              <h2
                className="mb-4 text-3xl font-bold text-white sm:mb-6 sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: "var(--font-quattrocento-sans)",
                  letterSpacing: "0.02em",
                }}
              >
                Life Feels{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                  }}
                >
                  Fragmented
                </span>
              </h2>

              <p
                className="mx-auto mb-8 max-w-3xl px-4 text-base leading-relaxed text-gray-300 sm:mb-12 sm:text-lg"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                You're optimizing individual areas—health, work, relationships,
                finances—but they compete for your time and attention instead of supporting each other.
                You have goals but lack the systems to make them sustainable.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                {["Health", "Work", "Relationships", "Finances", "Learning", "Spirituality"].map(
                  (domain) => (
                    <div
                      key={domain}
                      className="rounded-lg border bg-white/5 p-3 backdrop-blur-sm sm:p-4"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.2)",
                      }}
                    >
                      <p className="text-sm text-gray-400 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                        {domain}
                      </p>
                    </div>
                  )
                )}
              </div>

              <p className="mt-8 text-sm text-gray-500">
                Disconnected domains competing for your energy
              </p>
            </div>
          </section>

          {/* What You Actually Get */}
          <section id="five-tools" className="mb-16 sm:mb-24">
            <div className="text-center">
              <h2
                className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: "var(--font-quattrocento-sans)",
                  letterSpacing: "0.02em",
                }}
              >
                Five Tools.{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                  }}
                >
                  One System.
                </span>
              </h2>

              <p
                className="mx-auto mb-8 max-w-3xl px-4 text-base text-gray-300 sm:mb-12 sm:text-lg"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Everything you need to run your life, designed to work together from day one.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {[
                  {
                    icon: Activity,
                    title: "Habit Tracker",
                    description: "Build and maintain practices aligned with your values",
                  },
                  {
                    icon: DollarSign,
                    title: "Finance Tracker",
                    description: "Sustainable abundance through conscious resource management",
                  },
                  {
                    icon: Zap,
                    title: "Fitness Planner",
                    description: "Physical vitality as foundation for everything else",
                  },
                  {
                    icon: HeartHandshake,
                    title: "Relationship Manager",
                    description: "Nurture the connections that matter most",
                  },
                  {
                    icon: Lightbulb,
                    title: "Second Brain",
                    description: "Capture, connect, and cultivate your ideas",
                  },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Card
                      key={tool.title}
                      className="group bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.3)",
                        borderWidth: "1px",
                      }}
                    >
                      <CardContent className="p-5 sm:p-6">
                        <div className="mb-3 inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110 sm:mb-4"
                          style={{
                            background: "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
                            border: "1px solid rgba(212, 175, 55, 0.2)",
                          }}
                        >
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: "#D4AF37" }} />
                        </div>
                        <h3
                          className="mb-1.5 text-base font-bold text-white sm:mb-2 sm:text-lg"
                          style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                        >
                          {tool.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-300 sm:text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>
                          {tool.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <p
                className="mt-6 px-4 text-base text-gray-400 sm:mt-8 sm:text-lg"
                style={{ fontFamily: "var(--font-geist-sans)", fontStyle: "italic" }}
              >
                Each tool is powerful on its own. Together, they're transformative.
              </p>
            </div>
          </section>

          {/* The Solution Section */}
          <section id="solution" className="mb-16 sm:mb-24">
            <Card
              className="overflow-hidden bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.4)",
                borderWidth: "2px",
                background:
                  "linear-gradient(135deg, rgba(246, 230, 193, 0.05) 0%, rgba(18, 24, 39, 0.05) 100%)",
              }}
            >
              <CardContent className="p-6 sm:p-10 md:p-12">
                <div className="mb-6 text-center sm:mb-8">
                  <h2
                    className="mb-4 px-2 text-2xl font-bold text-white sm:text-4xl md:text-5xl"
                    style={{
                      fontFamily: "var(--font-quattrocento-sans)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    What if your life operated as{" "}
                    <span
                      className="whitespace-normal sm:whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                      }}
                    >
                      one integrated whole
                    </span>
                    ?
                  </h2>

                  <div className="mb-6 mt-6 flex justify-center sm:mb-8 sm:mt-8">
                    <div className="relative h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32">
                      <Image
                        src="/brand/banyan-tree-icon.svg"
                        alt="Banyan Tree of Life"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <p
                    className="mx-auto max-w-3xl px-4 text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    BANYAN's AI doesn't just track—it <strong style={{ color: "#D4AF37" }}>connects</strong>. It sees your morning run improving your work focus. Your creative practice deepening your relationships. Your financial clarity creating space for rest.
                  </p>

                  <p
                    className="mx-auto mt-4 max-w-3xl px-4 text-sm leading-relaxed text-gray-300 sm:mt-6 sm:text-base md:text-lg"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    The system accesses data across all five life domains, surfaces patterns you'd never spot alone, and provides insights on how changes in one area ripple through your entire ecosystem. Over time, it learns what balance looks like <em>for you</em>—and guides you back when life pulls you off course.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Three Principles */}
          <section id="features" className="mb-16 sm:mb-24">
            <h2
              className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Built on{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                }}
              >
                Three Principles
              </span>
            </h2>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <Card
                className="bg-white/5 backdrop-blur-md"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <Layers className="mb-3 h-8 w-8 sm:mb-4 sm:h-10 sm:w-10" style={{ color: "#D4AF37" }} />
                  <h3
                    className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Master the Basics
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    All abundance flows from the fundamentals. Sleep, movement, nourishment, connection—BANYAN treats these as inseparable, because they are.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/5 backdrop-blur-md"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <Rocket className="mb-3 h-8 w-8 sm:mb-4 sm:h-10 sm:w-10" style={{ color: "#D4AF37" }} />
                  <h3
                    className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Harness the Overflow
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    When your basics are dialed, you create surplus energy. BANYAN channels that overflow toward your deepest aspirations, not just your urgent tasks.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="bg-white/5 backdrop-blur-md"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.3)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-6 sm:p-8">
                  <RefreshCw className="mb-3 h-8 w-8 sm:mb-4 sm:h-10 sm:w-10" style={{ color: "#D4AF37" }} />
                  <h3
                    className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl"
                    style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                  >
                    Review & Adapt
                  </h3>
                  <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                    Life changes. You change. Our review system shows you what's working, recommends adjustments, and keeps you aligned over years, not just weeks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="mb-16 sm:mb-24">
            <h2
              className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              How It{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                }}
              >
                Works
              </span>
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  step: "1",
                  title: "Start with Mission, Vision, and Values",
                  description:
                    "AI-guided reflection helps you articulate your long-term direction and what truly matters",
                },
                {
                  step: "2",
                  title: "Distill Into Goals and Habits",
                  description:
                    "We translate your vision into concrete goals, then reverse-engineer the daily habits that make them inevitable",
                },
                {
                  step: "3",
                  title: "Map to Your Tools",
                  description:
                    "Habits flow into BANYAN's five integrated systems—Habit Tracker, Finance, Fitness, Relationships, Second Brain",
                },
                {
                  step: "4",
                  title: "Live, Learn, Adapt",
                  description:
                    "AI insights show how your domains influence each other. Regular reviews keep you aligned. Your goals become byproducts of your daily reality.",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 sm:hover:scale-105"
                  style={{
                    borderColor: "rgba(212, 175, 55, 0.3)",
                    borderWidth: "1px",
                  }}
                >
                  <CardContent className="flex items-center gap-4 p-5 sm:gap-6 sm:p-8">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold text-black sm:h-16 sm:w-16 sm:text-2xl"
                      style={{
                        background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                      }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h3
                        className="mb-1 text-lg font-semibold text-white sm:mb-2 sm:text-2xl"
                        style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* For Whom */}
          <section className="mb-16 sm:mb-24">
            <h2
              className="mb-8 text-center text-3xl font-bold text-white sm:mb-12 sm:text-4xl md:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Who Is This{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                }}
              >
                For?
              </span>
            </h2>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              {[
                {
                  icon: Target,
                  title: "Founders & Creators",
                  description:
                    "Building something meaningful while maintaining health, relationships, and sanity",
                },
                {
                  icon: Sparkles,
                  title: "Multi-Passionate Polymaths",
                  description:
                    "Synthesizing diverse talents into coherent mastery",
                },
                {
                  icon: Users,
                  title: "Conscious Leaders",
                  description: "Leading from wholeness rather than hustle",
                },
              ].map((segment) => {
                const Icon = segment.icon;
                return (
                  <Card
                    key={segment.title}
                    className="bg-white/5 backdrop-blur-md"
                    style={{
                      borderColor: "rgba(212, 175, 55, 0.3)",
                      borderWidth: "1px",
                    }}
                  >
                    <CardContent className="p-6 text-center sm:p-8">
                      <div className="mb-3 inline-flex items-center justify-center rounded-lg p-2.5 sm:mb-4 sm:p-3" style={{
                        background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                      }}>
                        <Icon className="h-7 w-7 text-black sm:h-8 sm:w-8" />
                      </div>
                      <h3
                        className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl"
                        style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                      >
                        {segment.title}
                      </h3>
                      <p className="text-sm text-gray-300 sm:text-base" style={{ fontFamily: "var(--font-geist-sans)" }}>
                        {segment.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Playing the Long Game */}
          <section className="mb-16 sm:mb-24">
            <Card
              className="bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-6 text-center sm:p-10 md:p-12">
                <h2
                  className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl"
                  style={{
                    fontFamily: "var(--font-quattrocento-sans)",
                    letterSpacing: "0.02em",
                  }}
                >
                  This Is About{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                    }}
                  >
                    Playing the Long Game
                  </span>
                </h2>
                <p
                  className="mx-auto max-w-3xl px-4 text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  BANYAN isn't another productivity hack or 30-day challenge. It's infrastructure for a life that compounds—where today's small choices become next year's transformation. Where your deepest values aren't aspirations, but the ground you stand on.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Early Access Form */}
          <section className="mb-16 sm:mb-24">
            <BanyanEarlyAccessForm />
          </section>

          {/* Built by Miracle Mind */}
          <section className="mb-16 sm:mb-24">
            <Card
              className="bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-6 text-center sm:p-10 md:p-12">
                <div className="mb-4 inline-flex items-center justify-center sm:mb-6">
                  <div className="relative h-12 w-12 sm:h-16 sm:w-16">
                    <Image
                      src="/brand/miracle-mind-orbit-star-v3.svg"
                      alt="Miracle Mind"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3
                  className="mb-3 text-xl font-bold text-white sm:mb-4 sm:text-2xl"
                  style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                >
                  Built by{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))",
                    }}
                  >
                    Miracle Mind
                  </span>
                </h3>

                <p
                  className="mx-auto mb-6 max-w-2xl px-4 text-sm text-gray-300 sm:mb-8 sm:text-base md:text-lg"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  BANYAN is the flagship product of Miracle Mind—where AI-driven
                  development meets human-centered design.
                </p>

                <Link href="https://miraclemind.live">
                  <Button
                    variant="outline"
                    className="border-2 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                    style={{
                      borderColor: "rgba(212, 175, 55, 0.5)",
                      color: "#D4AF37",
                    }}
                  >
                    Learn About Miracle Mind
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
