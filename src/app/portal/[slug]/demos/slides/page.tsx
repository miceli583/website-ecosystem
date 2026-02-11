"use client";

import { use } from "react";
import { SlidesHub } from "~/components/demos/slides-hub";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <SlidesHub basePath={`/portal/${slug}/demos/slides`} backHref={`/portal/${slug}/demos`} />;
}
