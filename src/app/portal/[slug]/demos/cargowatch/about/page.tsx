"use client";

import { use } from "react";
import { CargoWatchAbout } from "~/components/demos/cargowatch-about";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchAbout baseUrl={`/portal/${slug}/demos/cargowatch`} />;
}
