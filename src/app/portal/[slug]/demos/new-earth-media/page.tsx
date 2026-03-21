"use client";
import { use } from "react";
import { NewEarthMediaLanding } from "~/components/demos/new-earth-media";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <NewEarthMediaLanding backHref={`/portal/${slug}/demos`} />;
}
