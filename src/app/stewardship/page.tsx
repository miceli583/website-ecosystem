"use client";

import { Suspense } from "react";
import { ImageCard } from "~/components/ui/image-card";
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
          our mission. These are companies and individuals we steward—endorsing
          their products and services because we believe in their positive
          impact on the people we serve.
        </p>

        {/* Partners */}
        <section className="mb-16">
          <h2
            className="mb-8 text-2xl font-bold"
            style={{ fontFamily: "var(--font-quattrocento-sans)" }}
          >
            Our Partners
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ImageCard
              title="Entheos Holistics"
              description="Plant-based wellness products and holistic health practices. Premium supplements, adaptogens, and ceremonial-grade botanicals sourced with integrity."
              imageSrc="/images/stewards/entheos.png"
              imageAlt="Entheos Holistics - forest landscape"
              href="https://entheosholistics.com/?sld=miceli"
              linkText="Visit site"
              simple
            />
          </div>
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
