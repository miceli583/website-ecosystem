"use client";

import { use } from "react";
import Link from "next/link";
import { Globe, LayoutDashboard } from "lucide-react";
import { DemoHubLayout } from "~/components/portal";

export default function CHW360DemoHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <DemoHubLayout
      slug={slug}
      title="CHW360 Website Build"
      subtitle="Preview your new high-converting website and admin dashboard"
      footerNote="These are design previews. Final implementation will include full functionality."
    >
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {/* Website Frontend Card */}
        <Link
          href={`/portal/${slug}/demos/website/frontend`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-[#0D7377]/50 hover:shadow-xl hover:shadow-[#0D7377]/10"
        >
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(13, 115, 119, 0.15)" }}
          >
            <Globe className="h-7 w-7" style={{ color: "#14919B" }} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-[#14919B]">
            Website Frontend
          </h2>
          <p className="text-gray-400">
            Preview your public-facing landing page with modern design,
            compelling copy, and conversion-focused layout
          </p>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#14919B]/5 blur-2xl transition-all group-hover:bg-[#14919B]/10" />
        </Link>

        {/* Admin Dashboard Card */}
        <Link
          href={`/portal/${slug}/demos/website/admin`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-[#E07A5F]/50 hover:shadow-xl hover:shadow-[#E07A5F]/10"
        >
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(224, 122, 95, 0.15)" }}
          >
            <LayoutDashboard
              className="h-7 w-7"
              style={{ color: "#E07A5F" }}
            />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-[#E07A5F]">
            Admin Dashboard
          </h2>
          <p className="text-gray-400">
            See how you&apos;ll manage signups, track analytics, and oversee
            your website performance
          </p>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#E07A5F]/5 blur-2xl transition-all group-hover:bg-[#E07A5F]/10" />
        </Link>
      </div>
    </DemoHubLayout>
  );
}
