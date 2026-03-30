"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ShowcaseCreativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Hide original layout back buttons, text overlays, and sidebar nav */}
      <style>{`
        .showcase-creative-wrap > div > div > a[href*="/shaders"],
        .showcase-creative-wrap > div > div > a[href*="/playground"],
        .showcase-creative-wrap > div > div > a[href*="/admin"],
        .showcase-creative-wrap [class*="fixed"][class*="top-6"][class*="left-6"],
        .showcase-creative-wrap [class*="fixed"][class*="z-50"]:not([href*="showcase"]) {
          display: none !important;
        }
        /* Hide shader text overlays */
        .showcase-creative-wrap > div > div > div[class*="absolute"][class*="text-center"],
        .showcase-creative-wrap > div > div > div[class*="absolute"][class*="bottom-"] {
          display: none !important;
        }
        /* Hide playground sidebar/nav */
        .showcase-creative-wrap > div > div > aside,
        .showcase-creative-wrap > div > div > nav {
          display: none !important;
        }
      `}</style>
      <div className="showcase-creative-wrap h-full w-full">{children}</div>
      <Link
        href="/showcase#creative"
        className="fixed top-5 left-5 z-[60] flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>
    </div>
  );
}
