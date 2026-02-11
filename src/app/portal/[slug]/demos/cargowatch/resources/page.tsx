"use client";

import { use } from "react";
import { CargoWatchResources } from "~/components/demos/cargowatch-resources";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchResources baseUrl={`/portal/${slug}/demos/cargowatch`} />;
}
