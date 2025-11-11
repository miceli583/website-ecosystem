"use client";

import { DomainLayout } from "~/components/domain-layout";
import { JoinCommunity1Content } from "~/components/join-community-1-content";
import { BackButton } from "~/components/back-button";

export default function JoinCommunity1Page() {
  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* Flower of Life Shader Background - Subtle & Non-Distracting */}
        <div className="absolute inset-0 opacity-15">
          <iframe
            src="/shaders/flower-of-life/embed"
            className="h-full w-full border-0"
            style={{ pointerEvents: "none" }}
          />
        </div>

        {/* Gradient Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Content */}
        <div className="relative z-10 px-4 py-16">
          <div className="container mx-auto max-w-4xl">
            <JoinCommunity1Content />
          </div>
        </div>
      </div>
    </DomainLayout>
  );
}
