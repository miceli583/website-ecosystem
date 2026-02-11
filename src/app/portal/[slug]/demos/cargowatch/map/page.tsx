"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import { DashboardShell } from "~/components/demos/cargowatch-dashboard-shell";

const CargoWatchMap = dynamic(
  () => import("~/components/demos/cargowatch-map").then((m) => ({ default: m.CargoWatchMap })),
  { ssr: false, loading: () => <div className="flex min-h-[60vh] items-center justify-center bg-cw-navy text-white">Loading map...</div> }
);

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const baseUrl = `/portal/${slug}/demos/cargowatch`;
  return (
    <DashboardShell baseUrl={baseUrl}>
      <CargoWatchMap baseUrl={baseUrl} />
    </DashboardShell>
  );
}
