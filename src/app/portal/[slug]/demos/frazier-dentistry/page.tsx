"use client";

import { use } from "react";
import { FrazierDentistryDemo } from "~/components/demos/frazier-dentistry";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <FrazierDentistryDemo backHref={`/portal/${slug}/demos`} />;
}
