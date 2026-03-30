"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CHW360AdminDemo } from "~/components/demos/chw360-admin";

export default function ShowcaseAdminPage() {
  return (
    <div className="min-h-screen bg-black">
      <Link
        href="/showcase#demos"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>
      <CHW360AdminDemo backHref="/showcase" />
    </div>
  );
}
