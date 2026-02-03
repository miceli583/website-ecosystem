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
          className="group relative overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
          }}
        >
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <Globe className="h-6 w-6" style={{ color: "#D4AF37" }} />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white group-hover:text-[#D4AF37]">
            View Mockup
          </h2>
          <p className="text-sm text-gray-400">
            Preview the CHW360 website design with all sections and interactions
          </p>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all" style={{ backgroundColor: "rgba(212, 175, 55, 0.03)" }} />
        </Link>

        {/* Brand Assets Card */}
        <Link
          href={`/portal/${slug}/demos/mockup/assets`}
          className="group relative overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
          }}
        >
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <Palette className="h-6 w-6" style={{ color: "#D4AF37" }} />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white group-hover:text-[#D4AF37]">
            Brand Assets
          </h2>
          <p className="text-sm text-gray-400">
            Logo, colors, typography, and imagery used in the CHW360 design
          </p>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all" style={{ backgroundColor: "rgba(212, 175, 55, 0.03)" }} />
        </Link>
      </div>
    </DemoHubLayout>
  );
}
