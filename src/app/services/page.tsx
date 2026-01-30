"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  ArrowRight,
  Code,
  TreeDeciduous,
  Handshake,
  Sparkles,
  Zap,
  Users,
} from "lucide-react";
import { DomainLayout } from "~/components/domain-layout";

function ServicesContent() {
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
            AI-driven development that empowers human sovereignty and deepens connection.
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
                  href="/banyan"
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Custom Development */}
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
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Get in touch <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
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
                  href="/stewardship"
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* AI Integration */}
            <Card
              className="group bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8">
                <Sparkles
                  className="mb-4 h-10 w-10"
                  style={{ color: "#D4AF37" }}
                />
                <h3
                  className="mb-2 text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                >
                  AI Integration
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  Enhance your existing systems with intelligent automation,
                  natural language interfaces, and AI-powered insights
                  tailored to your workflow.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Get in touch <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Automation */}
            <Card
              className="group bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8">
                <Zap
                  className="mb-4 h-10 w-10"
                  style={{ color: "#D4AF37" }}
                />
                <h3
                  className="mb-2 text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                >
                  Workflow Automation
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  Streamline operations with custom automation pipelines.
                  Connect your tools, eliminate repetitive tasks, and
                  reclaim time for what matters.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Get in touch <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Consulting */}
            <Card
              className="group bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8">
                <Users
                  className="mb-4 h-10 w-10"
                  style={{ color: "#D4AF37" }}
                />
                <h3
                  className="mb-2 text-xl font-bold text-white"
                  style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                >
                  Technical Consulting
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  Strategic guidance on architecture, technology choices,
                  and AI adoption. We help you make informed decisions
                  that align with your long-term vision.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: "#D4AF37" }}
                >
                  Get in touch <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
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
          <Link href="/contact">
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
