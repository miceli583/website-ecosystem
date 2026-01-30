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

  const services = [
    {
      title: "Custom Applications",
      description:
        "Full-stack web applications, mobile apps, and custom CRMs. From concept to production, we build systems that scale with your vision.",
      imageSrc: "https://images.unsplash.com/photo-1558618666-fcd25c85f64d?w=800&h=500&fit=crop",
      imageAlt: "Abstract geometric architecture representing custom software development",
      href: "/contact",
      linkText: "Get started",
    },
    {
      title: "AI & Automation",
      description:
        "Custom AI tools, workflow automation, and intelligent systems. Available via client portal, as packaged solutions, or deeply integrated into your existing tech.",
      imageSrc: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop",
      imageAlt: "Neural network visualization representing AI and automation",
      href: "/contact",
      linkText: "Get started",
    },
    {
      title: "System Integration",
      description:
        "Connect disparate systems, develop APIs, build data pipelines. We create coherence from complexity, helping your tools work together seamlessly.",
      imageSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
      imageAlt: "Connected network nodes representing system integration",
      href: "/contact",
      linkText: "Get started",
    },
    {
      title: "Technical Consulting",
      description:
        "Architecture review, technology strategy, and roadmapping. Informed decisions aligned with your long-term vision and business goals.",
      imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
      imageAlt: "Strategic planning and consulting",
      href: "/contact",
      linkText: "Get started",
    },
    {
      title: "Optimization Services",
      description:
        "Efficiency audits, cost reduction strategies, and architectural redesign. Transform technical debt into competitive advantage.",
      imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
      imageAlt: "Performance optimization and analytics",
      href: "/contact",
      linkText: "Get started",
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
        <section
          className="px-4 py-20 sm:px-6"
          style={{ backgroundColor: "rgba(23, 23, 23, 0.95)" }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ImageCard
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  imageSrc={service.imageSrc}
                  imageAlt={service.imageAlt}
                  href={buildHref(service.href)}
                  linkText={service.linkText}
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
