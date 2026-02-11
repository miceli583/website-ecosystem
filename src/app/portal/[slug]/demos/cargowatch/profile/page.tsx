"use client";

import { use } from "react";
import { CargoWatchProfile } from "~/components/demos/cargowatch-profile";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CargoWatchProfile baseUrl={`/portal/${slug}/demos/cargowatch`} />;
}
