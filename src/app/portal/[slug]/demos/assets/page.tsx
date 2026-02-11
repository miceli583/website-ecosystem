"use client";
import { use } from "react";
import { WildflowerAssets } from "~/components/demos/wildflower-assets";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <WildflowerAssets backHref={`/portal/${slug}/demos`} />;
}
