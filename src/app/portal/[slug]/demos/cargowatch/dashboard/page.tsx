"use client";

import { use } from "react";
import { CargoWatchDashboard } from "~/components/demos/cargowatch-dashboard";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchDashboard baseUrl={`/portal/${slug}/demos/cargowatch`} />;
}
