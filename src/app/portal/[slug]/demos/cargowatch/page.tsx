"use client";

import { use } from "react";
import { CargoWatchHub } from "~/components/demos/cargowatch-hub";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchHub basePath={`/portal/${slug}/demos/cargowatch`} backHref={`/portal/${slug}/demos`} />;
}
