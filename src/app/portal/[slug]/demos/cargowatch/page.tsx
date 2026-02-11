"use client";

import { use } from "react";
import { CargoWatchLanding } from "~/components/demos/cargowatch-landing";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchLanding baseUrl={`/portal/${slug}/demos/cargowatch`} />;
}
