"use client";

import { use } from "react";
import { FrazierAssets } from "~/components/demos/frazier-assets";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <FrazierAssets backHref={`/portal/${slug}/demos`} />;
}
