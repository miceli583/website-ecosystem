"use client";

import { use } from "react";
import { CHW360MockupHub } from "~/components/demos/chw360-mockup-hub";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CHW360MockupHub basePath={`/portal/${slug}/demos/mockup`} backHref={`/portal/${slug}/demos`} />;
}
