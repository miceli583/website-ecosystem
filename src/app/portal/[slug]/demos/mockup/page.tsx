"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Palette } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export default function CHW360MockupHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className="border-b px-4 py-4 sm:px-6"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href={`/portal/${slug}?domain=live`}
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CHW360 Mockup Implementation
          </h1>
          <p className="text-lg text-gray-400">
            Exact replica of the approved mockup design
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
          {/* View Mockup Card */}
          <Link href={`/portal/${slug}/demos/mockup/frontend`}>
            <Card
              className="group h-full cursor-pointer bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(45, 90, 90, 0.2) 0%, rgba(61, 122, 122, 0.3) 100%)",
                    border: "1px solid rgba(45, 90, 90, 0.4)",
                  }}
                >
                  <Globe className="h-8 w-8" style={{ color: "#3D7A7A" }} />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">
                  View Mockup
                </h2>
                <p className="text-sm text-gray-400">
                  Preview the CHW360 website design with all sections and
                  interactions
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Brand Assets Card */}
          <Link href={`/portal/${slug}/demos/mockup/assets`}>
            <Card
              className="group h-full cursor-pointer bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201, 114, 91, 0.2) 0%, rgba(201, 114, 91, 0.3) 100%)",
                    border: "1px solid rgba(201, 114, 91, 0.4)",
                  }}
                >
                  <Palette className="h-8 w-8" style={{ color: "#C9725B" }} />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">
                  Brand Assets
                </h2>
                <p className="text-sm text-gray-400">
                  Logo, colors, typography, and imagery used in the CHW360
                  design
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Note */}
        <p className="mt-12 text-center text-sm text-gray-500">
          This is a design preview matching the approved mockup specifications.
        </p>
      </main>
    </div>
  );
}
