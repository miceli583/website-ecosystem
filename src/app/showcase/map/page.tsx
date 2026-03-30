"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CargoWatchMap = dynamic(
  () =>
    import("~/components/demos/cargowatch-map").then((m) => ({
      default: m.CargoWatchMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-pulse text-sm text-white/30">
          Loading map...
        </div>
      </div>
    ),
  }
);

export default function ShowcaseMapPage() {
  return (
    <div className="relative h-screen w-full bg-black">
      <Link
        href="/showcase#demos"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>
      <CargoWatchMap baseUrl="/showcase/map" />
    </div>
  );
}
