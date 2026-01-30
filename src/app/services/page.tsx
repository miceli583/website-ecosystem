"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ImageCard } from "~/components/ui/image-card";
import { ArrowRight } from "lucide-react";
import { DomainLayout } from "~/components/domain-layout";

function ServicesContent() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  const buildHref = (path: string) => {
    if (hostname.includes("localhost") && domainParam) {
      return `${path}?domain=${domainParam}`;
    }
    return path;
  };

  const services: Array<{
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    imagePosition?: string;
    goldTint?: boolean;
    imageScale?: number;
    objectFit?: "cover" | "contain";
  }> = [
    {
      title: "AI & Automation",
      description:
        "Custom AI tools, workflow automation, and intelligent systems. Available via client portal, as independent packaged solutions, or deeply integrated into your existing systems.",
      imageSrc: "/images/services/ai-robot-hand.jpg",
      imageAlt: "AI robot floating above wireframe hand",
      imagePosition: "right center",
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
    {
      title: "Technical Consulting",
      description:
        "Architecture review, technology strategy, and roadmapping. Informed decisions aligned with your long-term vision and business goals.",
      imageSrc: "/images/services/consulting-ring.png",
      imageAlt: "Gold ring representing focused consulting",
    },
    {
      title: "Optimization Services",
      description:
        "Efficiency audits, cost reduction strategies, and architectural redesign. Transform technical debt into competitive advantage.",
      imageSrc: "/images/services/optimization-wave.jpg",
      imageAlt: "Gold particle wave representing optimization flow",
    },
    {
      title: "Data & Analytics",
      description:
        "Data infrastructure, dashboards, and business intelligence. Turn raw information into actionable insights that drive informed decisions.",
      imageSrc: "/images/services/data-matrix.avif",
      imageAlt: "Digital matrix representing data infrastructure",
    },
    {
      title: "Training & Enablement",
      description:
        "Empower your team to truly own their tools. Documentation, workshops, and knowledge transfer that builds lasting capability.",
      imageSrc: "/images/services/training-horse.jpeg",
      imageAlt: "Gold horse representing empowerment and momentum",
    },
    {
      title: "Product Strategy & Discovery",
      description:
        "Define what to build before building it. User research, requirements gathering, and prototyping to ensure technology serves real human needs.",
      imageSrc: "/images/services/strategy-chess.jpeg",
      imageAlt: "Chess pieces representing strategic thinking",
      imagePosition: "center 0%",
      imageScale: 1.3,
    },
    {
      title: "Maintenance & Support",
      description:
        "Ongoing monitoring, updates, and support. Long-term partnership that keeps your systems healthy and evolving with your needs.",
      imageSrc: "/images/services/support-hexagon.jpeg",
      imageAlt: "Gold hexagon representing stable support structure",
      objectFit: "contain",
    },
  ];

  return (
    <DomainLayout>
      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="mb-6 text-4xl font-bold text-white sm:text-5xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              Our{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Services
              </span>
            </h1>
            <p className="text-lg text-gray-300">
              For founders, businesses, and enterprises aligned with our mission.
              We build technology that expands your freedom, not your dependencies.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-3">
              {services.map((service) => (
                <ImageCard
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  imageSrc={service.imageSrc}
                  imageAlt={service.imageAlt}
                  simple
                  imagePosition={service.imagePosition}
                  goldTint={service.goldTint}
                  imageScale={service.imageScale}
                  objectFit={service.objectFit}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="mb-4 text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-quattrocento-sans)" }}
            >
              Ready to Start?
            </h2>
            <p className="mb-8 text-gray-300">
              Tell us about your project and let's explore how we can help.
            </p>
            <Link href={buildHref("/contact")}>
              <Button
                size="lg"
                className="px-8 text-black shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                }}
              >
                Get In Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </DomainLayout>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ServicesContent />
    </Suspense>
  );
}
