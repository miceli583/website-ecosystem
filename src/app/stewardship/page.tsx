"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PartnerCard } from "~/components/stewardship/partner-card";
import { DomainLayout } from "~/components/domain-layout";

function StewardshipContent() {
  return (
    <DomainLayout>
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">

        {/* Header */}
        <h1
          className="mb-4 text-4xl font-bold sm:text-5xl"
          style={{
            fontFamily: "var(--font-quattrocento-sans)",
            letterSpacing: "0.02em",
          }}
        >
          Stewardship{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Program
          </span>
        </h1>

        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-gray-300">
          We partner with businesses and practitioners whose work aligns with
          our mission of empowering human sovereignty. As a Steward, you help
          extend our reach while earning from the value you create.
        </p>

        {/* How it works */}
        <section className="mb-16">
          <h2
            className="mb-6 text-2xl font-bold"
            style={{ fontFamily: "var(--font-quattrocento-sans)" }}
          >
            How It Works
          </h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Stewards are trusted partners — not affiliates. We vet every
              partner to ensure their products and services genuinely support
              the well-being of the people we serve.
            </p>
            <p>
              When you refer someone through a Steward link, both parties
              benefit: the person gets access to a vetted resource, and the
              Steward earns a commission for the introduction.
            </p>
          </div>
        </section>

        {/* Partners */}
        <section className="mb-16">
          <h2
            className="mb-8 text-2xl font-bold"
            style={{ fontFamily: "var(--font-quattrocento-sans)" }}
          >
            Our Partners
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <PartnerCard
              name="Entheos Holistics"
              description="Plant-based wellness products and holistic health practices. Premium supplements, adaptogens, and ceremonial-grade botanicals sourced with integrity."
              href="https://entheosholistics.com/?sld=miceli"
              icon={Leaf}
            />
          </div>
        </section>

        {/* Become a Steward CTA */}
        <section
          className="rounded-lg border p-8 text-center"
          style={{
            borderColor: "rgba(212, 175, 55, 0.3)",
            background:
              "linear-gradient(135deg, rgba(246,230,193,0.05) 0%, rgba(18,24,39,0.05) 100%)",
          }}
        >
          <h2
            className="mb-4 text-2xl font-bold"
            style={{ fontFamily: "var(--font-quattrocento-sans)" }}
          >
            Interested in Becoming a Steward?
          </h2>
          <p className="mb-6 text-gray-300">
            If your business or practice is aligned with conscious living and
            human empowerment, we&apos;d love to hear from you.
          </p>
          <a href="mailto:connect@miraclemind.live?subject=Stewardship%20Interest">
            <Button
              size="lg"
              className="px-8 text-black transition-all duration-300 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              Get In Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </section>
      </div>
    </div>
    </DomainLayout>
  );
}

export default function StewardshipPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <StewardshipContent />
    </Suspense>
  );
}
