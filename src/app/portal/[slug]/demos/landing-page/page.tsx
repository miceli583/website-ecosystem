"use client";
import { use } from "react";
import { WildflowerLanding } from "~/components/demos/wildflower-landing";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <WildflowerLanding backHref={`/portal/${slug}/demos`} />;
}
