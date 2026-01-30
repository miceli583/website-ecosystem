"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ImageCard } from "~/components/ui/image-card";
import {
  ArrowRight,
  Sparkles,
  Code,
  Users,
  Heart,
  Leaf,
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

  // Services in requested order: AI & Automation, System Integration, Custom Apps
  const clientServices: Array<{
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    imagePosition?: string;
    goldTint?: boolean;
  }> = [
    {
      title: "AI & Automation",
      description:
        "Custom AI tools, workflow automation, and intelligent systems. Available via client portal, as independent packaged solutions, or deeply integrated into your existing systems.",
      imageSrc: "/images/services/ai-robot-hand.jpg",
      imageAlt: "AI robot floating above wireframe hand",
      imagePosition: "right center", // Crop to show right half
      goldTint: true,
    },
    {
      title: "System Integration & Coherence",
      description:
        "Connect disparate systems, develop APIs, build data pipelines. We create coherence from complexity, helping your tools work together seamlessly.",
      imageSrc: "/images/services/mushroom-network.avif",
      imageAlt: "Mushroom mycelial network representing system integration",
    },
    {
      title: "Custom Applications",
      description:
        "Full-stack web apps, mobile apps, and custom CRMs w/ AI and LLM integration. From concept to production, we build systems that scale with your vision.",
      imageSrc: "/images/services/fingerprint-tech.avif",
      imageAlt: "Fingerprint technology representing custom software development",
      goldTint: true,
    },
  ];

  const values = [
    {
      icon: Heart,
      label: "Contribution",
      desc: "Building systems that create genuine value for people and communities",
    },
    {
      icon: Users,
      label: "Sovereignty",
      desc: "Technology that expands your freedom to act on your own behalf",
    },
    {
      icon: Leaf,
      label: "Cultivation",
      desc: "Investing in solutions designed for sustainable, long-term growth",
    },
    {
      icon: Sparkles,
      label: "Coherence",
      desc: "Aligning systems so every part works in harmony with the whole",
    },
    {
      icon: Code,
      label: "Integration",
      desc: (
        <>
          Weaving disparate
          <br />
          tools and data into one
          <br />
          fluid ecosystem
        </>
      ),
    },
  ];

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
              Intelligent systems designed with humans at the center. Powered by
              AI-driven development that shortens time to market and enables
              real-time solutions emergent from human needs.
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

      {/* Client Services - What We Build */}
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
            For founders, businesses, and enterprises aligned with our mission.
            <br />
            AI-powered software grounded in human values.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {clientServices.map((service) => (
              <ImageCard
                key={service.title}
                title={service.title}
                description={service.description}
                imageSrc={service.imageSrc}
                imageAlt={service.imageAlt}
                simple
                imagePosition={service.imagePosition}
                goldTint={service.goldTint}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href={buildHref("/services")}>
              <Button
                size="lg"
                className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BANYAN Feature Section */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Content */}
            <div>
              <Badge
                className="mb-4 border-0 px-3 py-1"
                style={{
                  background: "rgba(212, 175, 55, 0.15)",
                  color: "#D4AF37",
                }}
              >
                Under Development
              </Badge>
              <h2
                className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
                style={{
                  fontFamily: "var(--font-quattrocento-sans)",
                  letterSpacing: "0.02em",
                }}
              >
                BANYAN{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  LifeOS
                </span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-300">
                An AI-powered life operating system that integrates health,
                finance, relationships, and personal growth into one coherent
                platform. Not to dictate how you should live, but to help you
                understand how the pieces of your life affect each other as part
                of an interdependent whole—so you can make decisions from a place
                of clarity, balance, and integrity with your deepest values.
              </p>
              <Link href={buildHref("/banyan")}>
                <Button
                  size="lg"
                  className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  Explore BANYAN
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative mx-auto aspect-[4/3] max-w-[500px] overflow-hidden rounded-lg">
                <Image
                  src="/images/services/banyan-gold-tree.avif"
                  alt="Abstract gold tree representing BANYAN LifeOS"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Mission */}
      <section
        className="px-4 py-20 sm:px-6"
        style={{ backgroundColor: "#141414" }}
      >
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
            it. Every system we build serves
            <br />
            human agency, cultivates long-term growth, and honors what makes us
            most alive.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => {
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
      >
        <div className="mx-auto max-w-3xl text-center">
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
            Whether you need a custom application, AI integration, or want to explore
            <br />
            how BANYAN can transform your workflow—let&apos;s talk.
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
