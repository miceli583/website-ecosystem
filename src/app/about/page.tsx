"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { DomainLayout } from "~/components/domain-layout";
import {
  ArrowRight,
  Heart,
  Users,
  Leaf,
  Sparkles,
  Code,
} from "lucide-react";

function AboutContent() {
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

  const values = [
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
  ];

  return (
    <DomainLayout>
      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
              style={{
                fontFamily: "var(--font-quattrocento-sans)",
                letterSpacing: "0.02em",
              }}
            >
              About{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <span style={{ fontWeight: 300 }}>MIRACLE</span> MIND
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-300">
              We build technology that empowers human sovereignty, deepens connection,
              and honors what makes us most alive.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section
          className="px-4 py-20 sm:px-6"
          style={{ backgroundColor: "#141414" }}
        >
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-6 text-center text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-quattrocento-sans)" }}
            >
              Our Mission
            </h2>
            <p className="text-center text-lg leading-relaxed text-gray-300">
              Technology in service of humanity and human connection. We specialize in{" "}
              <span style={{ color: "#D4AF37", fontWeight: 600 }}>
                AI-driven development
              </span>{" "}
              that shortens time to market and enables{" "}
              <span style={{ color: "#D4AF37", fontWeight: 600 }}>
                real-time solutions emergent from customer needs
              </span>
              . We develop AI-powered software in-house and build custom solutions for
              companies, founders, and businesses.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-quattrocento-sans)" }}
            >
              Our Values
            </h2>
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

        {/* Founder */}
        <section
          className="px-4 py-20 sm:px-6"
          style={{ backgroundColor: "#141414" }}
        >
          <div className="mx-auto max-w-4xl">
            <h2
              className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-quattrocento-sans)" }}
            >
              Meet the Founder
            </h2>
            <Card
              className="bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-6 sm:p-8">
                <div className="grid items-center gap-6 sm:gap-8 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <div
                      className="mx-auto overflow-hidden rounded-full border-2 shadow-2xl"
                      style={{
                        borderColor: "#D4AF37",
                        boxShadow: "0 25px 50px -12px rgba(212, 175, 55, 0.25)",
                        maxWidth: "200px",
                      }}
                    >
                      <Image
                        src="/images/profile.jpg"
                        alt="Matthew Miceli"
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h3
                      className="mb-3 text-2xl font-bold text-white sm:text-3xl"
                      style={{ fontFamily: "var(--font-quattrocento-sans)" }}
                    >
                      Matthew Miceli
                    </h3>
                    <p className="mb-4 text-base leading-relaxed text-gray-300">
                      My journey spans robotics research, satellite testing, software
                      development, high-ticket sales, and music production. This diverse
                      background has fostered my passion to discover what it means to be a
                      modern polymath—one who harmonizes seemingly disparate disciplines and
                      builds systems that foster integration.
                    </p>
                    <Link href="https://matthewmiceli.com">
                      <Button
                        variant="outline"
                        className="border-2 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                        style={{
                          borderColor: "rgba(212, 175, 55, 0.5)",
                          color: "#D4AF37",
                        }}
                      >
                        Read Full Story
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="mb-4 text-3xl font-bold text-white sm:text-4xl"
              style={{ fontFamily: "var(--font-quattrocento-sans)" }}
            >
              Ready to Build Together?
            </h2>
            <p className="mb-8 text-gray-300">
              Whether you're launching a new venture or modernizing an existing system,
              let's explore how we can help.
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

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AboutContent />
    </Suspense>
  );
}
