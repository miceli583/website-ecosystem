"use client";

import { Suspense } from "react";
import { ShowcasePage } from "~/components/showcase/showcase-page";

export default function ShowcaseRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="animate-pulse text-sm text-white/30">Loading...</div>
        </div>
      }
    >
      <ShowcasePage />
    </Suspense>
  );
}
