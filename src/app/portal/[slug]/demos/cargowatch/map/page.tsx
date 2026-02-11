"use client";

import { use } from "react";
import dynamic from "next/dynamic";

const CargoWatchMap = dynamic(
  () => import("~/components/demos/cargowatch-map").then((m) => ({ default: m.CargoWatchMap })),
  { ssr: false, loading: () => <div className="flex min-h-screen items-center justify-center bg-cw-navy text-white">Loading map...</div> }
);

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchMap baseUrl={`/portal/${slug}/demos/cargowatch`} />;
}
