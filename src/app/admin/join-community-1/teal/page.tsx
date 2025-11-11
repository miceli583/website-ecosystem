"use client";

import { DomainLayout } from "~/components/domain-layout";
import { JoinCommunity1Content } from "~/components/join-community-1-content";
import { BackButton } from "~/components/back-button";

export default function TealJoinCommunity1Page() {
  return (
    <DomainLayout
      headerClassName="border-b border-white/10 bg-[#00695c] backdrop-blur-sm"
      footerClassName="mt-auto border-t border-white/10 bg-[#00695c] backdrop-blur-sm"
    >
      <BackButton href="/admin" label="Back to Hub" />
      <div className="relative min-h-screen overflow-hidden bg-[#00695c]">
        <div className="absolute inset-0 opacity-15">
          <iframe
            src="/admin/shaders/flower-of-life/embed"
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
