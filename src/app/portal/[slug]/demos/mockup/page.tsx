"use client";

import { use } from "react";
import Link from "next/link";
import { Globe, Palette } from "lucide-react";
import { DemoHubLayout } from "~/components/portal";

export default function CHW360MockupHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <DemoHubLayout
      slug={slug}
      title="CHW360 Mockup Implementation"
      subtitle="Exact replica of the approved mockup design"
      footerNote="This is a design preview matching the approved mockup specifications."
    >
      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {/* View Mockup Card */}
        <Link
          href={`/portal/${slug}/demos/mockup/frontend`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-[#3D7A7A]/50 hover:shadow-xl hover:shadow-[#3D7A7A]/10"
        >
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(45, 90, 90, 0.15)" }}
          >
            <Globe className="h-7 w-7" style={{ color: "#3D7A7A" }} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-[#3D7A7A]">
            View Mockup
          </h2>
          <p className="text-gray-400">
            Preview the CHW360 website design with all sections and interactions
          </p>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#3D7A7A]/5 blur-2xl transition-all group-hover:bg-[#3D7A7A]/10" />
        </Link>

        {/* Brand Assets Card */}
        <Link
          href={`/portal/${slug}/demos/mockup/assets`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-[#C9725B]/50 hover:shadow-xl hover:shadow-[#C9725B]/10"
        >
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(201, 114, 91, 0.15)" }}
          >
            <Palette className="h-7 w-7" style={{ color: "#C9725B" }} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-[#C9725B]">
            Brand Assets
          </h2>
          <p className="text-gray-400">
            Logo, colors, typography, and imagery used in the CHW360 design
          </p>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#C9725B]/5 blur-2xl transition-all group-hover:bg-[#C9725B]/10" />
        </Link>
      </div>
    </DemoHubLayout>
  );
}
