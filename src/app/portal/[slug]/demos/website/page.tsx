"use client";

import { use } from "react";
import { CHW360WebsiteHub } from "~/components/demos/chw360-website-hub";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CHW360WebsiteHub basePath={`/portal/${slug}/demos/website`} backHref={`/portal/${slug}/demos`} />;
}
