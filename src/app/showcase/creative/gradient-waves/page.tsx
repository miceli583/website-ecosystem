"use client";

import dynamic from "next/dynamic";
import { ShowcaseCreativeLayout } from "~/components/showcase/creative-layout";

const Content = dynamic(() => import("~/app/playground/gradient-waves/page"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="animate-pulse text-sm text-white/30">Loading...</div>
    </div>
  ),
});

export default function Page() {
  return (
    <ShowcaseCreativeLayout>
      <Content />
    </ShowcaseCreativeLayout>
  );
}
