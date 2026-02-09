"use client";

import { use } from "react";
import { TAPCHWWebsiteDemo } from "~/components/demos/tapchw-website";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <TAPCHWWebsiteDemo backHref={`/portal/${slug}/demos`} />;
}
