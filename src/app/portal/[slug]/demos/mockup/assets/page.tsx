"use client";

import { use } from "react";
import { MockupAssetsDemo } from "~/components/demos/mockup-assets";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <MockupAssetsDemo backHref={`/portal/${slug}/demos/mockup`} />;
}
