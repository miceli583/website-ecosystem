"use client";
import { Suspense } from "react";

import { DomainLayout } from "~/components/domain-layout";
import { JoinCommunity1Content } from "~/components/join-community-1-content";
import { BackButton } from "~/components/back-button";

function EmeraldTealJoinCommunity1PageContent() {
  return (
    <DomainLayout
      headerClassName="border-b border-white/10 bg-gradient-to-r from-[#10b981] to-[#14b8a6] backdrop-blur-sm"
      footerClassName="mt-auto border-t border-white/10 bg-gradient-to-r from-[#10b981] to-[#14b8a6] backdrop-blur-sm"
    >
      <BackButton href="/admin" label="Back to Hub" />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#10b981] to-[#14b8a6]">
        <div className="absolute inset-0 opacity-15">
          <iframe
            src="/shaders/flower-of-life/embed"
            className="h-full w-full border-0"
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="relative z-10 px-4 py-16">
          <div className="container mx-auto max-w-4xl">
            <JoinCommunity1Content />
          </div>
        </div>
      </div>
    </DomainLayout>
  );
}

export default function EmeraldTealJoinCommunity1Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <EmeraldTealJoinCommunity1PageContent />
    </Suspense>
  );
}
