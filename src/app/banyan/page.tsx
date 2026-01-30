"use client";

import { Suspense } from "react";
import { MiracleMindDevHomePage } from "~/components/pages/miraclemind-dev-home";
import { DomainLayout } from "~/components/domain-layout";

function BanyanContent() {
  return (
    <DomainLayout>
      <MiracleMindDevHomePage />
    </DomainLayout>
  );
}

export default function BanyanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BanyanContent />
    </Suspense>
  );
}
