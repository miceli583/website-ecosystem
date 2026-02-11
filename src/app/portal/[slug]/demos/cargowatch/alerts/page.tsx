"use client";

import { use } from "react";
import { CargoWatchAlerts } from "~/components/demos/cargowatch-alerts";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchAlerts baseUrl={`/portal/${slug}/demos/cargowatch`} />;
}
