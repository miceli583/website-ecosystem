"use client";

import { use } from "react";
import { CHW360FrontendDemo } from "~/components/demos/chw360-frontend";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CHW360FrontendDemo backHref={`/portal/${slug}/demos/website`} />;
}
