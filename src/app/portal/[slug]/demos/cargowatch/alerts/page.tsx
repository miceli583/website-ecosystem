"use client";

import { use } from "react";
import { DashboardShell } from "~/components/demos/cargowatch-dashboard-shell";
import { CargoWatchAlerts } from "~/components/demos/cargowatch-alerts";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const baseUrl = `/portal/${slug}/demos/cargowatch`;
  return (
    <DashboardShell baseUrl={baseUrl}>
      <CargoWatchAlerts baseUrl={baseUrl} />
    </DashboardShell>
  );
}
