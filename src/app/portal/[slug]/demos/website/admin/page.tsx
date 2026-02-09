"use client";

import { use } from "react";
import { CHW360AdminDemo } from "~/components/demos/chw360-admin";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CHW360AdminDemo backHref={`/portal/${slug}/demos/website`} />;
}
