"use client";

import { use } from "react";
import { CHW360MockupDemo } from "~/components/demos/chw360-mockup";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CHW360MockupDemo backHref={`/portal/${slug}/demos/mockup`} />;
}
