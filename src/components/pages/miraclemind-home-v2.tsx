"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  Code,
  Users,
  Heart,
  Leaf,
  TreeDeciduous,
  Handshake,
} from "lucide-react";

export function MiracleMindHomeV2() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    setHostname(window.location.hostname);
    document.title = "Miracle Mind — Technology Empowering Human Sovereignty";
    return () => {
      document.title = "Miracle Mind";
    };
  }, []);

  // Helper to build href with domain param preserved on localhost
  const buildHref = (path: string) => {
    if (hostname.includes("localhost") && domainParam) {
      return `${path}?domain=${domainParam}`;
    }
    return path;
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-0">
          {/* Left: Text */}
          <div className="relative z-10 order-2 lg:order-1">
            <h1
              className="mb-8"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
              }}
            >
              <span
                className="block text-2xl font-medium uppercase tracking-widest text-gray-400 sm:text-3xl"
                style={{ letterSpacing: "0.25em" }}
              >
                Technology
              </span>
              <span
                className="block text-4xl font-bold uppercase sm:text-5xl lg:text-6xl"
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "0.08em",
                  lineHeight: 1.1,
                }}
              >
                Empowering
              </span>
              <span
                className="block text-2xl font-medium uppercase tracking-widest text-white sm:text-3xl"
                style={{ letterSpacing: "0.25em" }}
              >
                Human Sovereignty
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-300">
              AI-driven development that shortens time to market and enables
              real-time solutions emergent from customer needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={buildHref("/services")}>
                <Button
                  size="lg"
                  className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  Our Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={buildHref("/banyan")}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 bg-white/5 px-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                  style={{
                    borderColor: "rgba(212, 175, 55, 0.5)",
                    color: "#D4AF37",
                  }}
                >
                  Explore BANYAN
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Orbit Star shader */}
          <div className="relative order-1 lg:order-2">
            <div
              className="relative mx-auto h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] lg:h-[500px] lg:w-[500px]"
              style={{
                maskImage: "radial-gradient(circle, black 40%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 70%)",
              }}
            >
              <iframe
                src="/shaders/orbit-star/embed"
                className="h-full w-full border-0"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Services */}
      <section
        id="services"
        className="scroll-mt-20 px-4 py-20 sm:px-6"
        style={{ backgroundColor: "#141414" }}
      >
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-quattrocento-sans)",
              letterSpacing: "0.02em",
            }}
          >
            What We{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Build
            </span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
            From flagship products to custom client work, we deliver
            AI-powered software grounded in human values.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* BANYAN */}
            <Card
              className="group bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8">
                <TreeDeciduous
                  className="mb-4 h-10 w-10"
                  style={{ color: "#D4AF37" }}
                />
                <h3
                  className="mb-2 text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                >
                  BANYAN LifeOS
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  Our flagship product: an AI-powered life operating system
                  that integrates health, finance, relationships, and
                  personal growth into one coherent platform.
                </p>
                <Link
                  href={buildHref("/banyan")}
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Custom Dev */}
            <Card
              className="group bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8">
                <Code
                  className="mb-4 h-10 w-10"
                  style={{ color: "#D4AF37" }}
                />
                <h3
                  className="mb-2 text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                >
                  Custom Development
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  Full-stack web applications, AI integrations, and
                  automation systems built with modern tooling. From concept
                  to production, we ship fast.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Get in touch <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* Stewardship */}
            <Card
              className="group bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8">
                <Handshake
                  className="mb-4 h-10 w-10"
                  style={{ color: "#D4AF37" }}
                />
                <h3
                  className="mb-2 text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                >
                  Stewardship Program
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  Partner with aligned businesses and practitioners we
                  trust. Our stewards extend our mission by connecting
                  people with tools for conscious living.
                </p>
                <Link
                  href={buildHref("/stewardship")}
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values / Mission */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-quattrocento-sans)",
              letterSpacing: "0.02em",
            }}
          >
            Our{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Philosophy
            </span>
          </h2>
          <p className="mb-12 text-lg leading-relaxed text-gray-300">
            We believe technology should deepen human connection, not replace
            it. Every system we build serves human agency, cultivates long-term
            growth, and honors what makes us most alive.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Heart,
                label: "Contribution",
                desc: "Technology in service of humanity",
              },
              {
                icon: Users,
                label: "Sovereignty",
                desc: "Empowering human agency",
              },
              {
                icon: Leaf,
                label: "Cultivation",
                desc: "Playing the long game",
              },
              {
                icon: Sparkles,
                label: "Coherence",
                desc: "AI meets human-centered design",
              },
              {
                icon: Code,
                label: "Integration",
                desc: "Unified systems, seamless flow",
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.label} className="text-center">
                  <div
                    className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(246,230,193,0.15) 0%, rgba(212,175,55,0.2) 100%)",
                      border: "1px solid rgba(212,175,55,0.3)",
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: "#D4AF37" }} />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-white">
                    {v.label}
                  </h3>
                  <p className="text-xs text-gray-400">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section
        id="contact"
        className="scroll-mt-20 px-4 py-20 sm:px-6"
        style={{ backgroundColor: "#141414" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            <div className="relative h-14 w-14">
              <Image
                src="/brand/miracle-mind-orbit-star-v3.svg"
                alt="Miracle Mind"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h2
            className="mb-4 text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-quattrocento-sans)" }}
          >
            Ready to Build Something{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Meaningful
            </span>
            ?
          </h2>
          <p className="mb-8 text-gray-300">
            Whether you need a custom application, AI integration, or want to
            explore how BANYAN can transform your workflow — let&apos;s talk.
          </p>
          <Link href={buildHref("/contact")}>
            <Button
              size="lg"
              className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
