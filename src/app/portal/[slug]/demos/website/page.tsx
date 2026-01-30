"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export default function CHW360DemoHubPage({
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
            CHW360 Website Build
          </h1>
          <p className="text-lg text-gray-400">
            Preview your new high-converting website and admin dashboard
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Website Frontend Card */}
          <Link href={`/portal/${slug}/demos/website/frontend`}>
            <Card
              className="group h-full cursor-pointer bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(13, 115, 119, 0.2) 0%, rgba(20, 145, 155, 0.3) 100%)",
                    border: "1px solid rgba(13, 115, 119, 0.4)",
                  }}
                >
                  <Globe className="h-8 w-8" style={{ color: "#14919B" }} />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">
                  Website Frontend
                </h2>
                <p className="text-sm text-gray-400">
                  Preview your public-facing landing page with modern design,
                  compelling copy, and conversion-focused layout
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Dashboard Card */}
          <Link href={`/portal/${slug}/demos/website/admin`}>
            <Card
              className="group h-full cursor-pointer bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(224, 122, 95, 0.2) 0%, rgba(224, 122, 95, 0.3) 100%)",
                    border: "1px solid rgba(224, 122, 95, 0.4)",
                  }}
                >
                  <LayoutDashboard
                    className="h-8 w-8"
                    style={{ color: "#E07A5F" }}
                  />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-gray-400">
                  See how you&apos;ll manage signups, track analytics, and
                  oversee your website performance
                </p>
              </CardContent>
            </Card>
          </Link>

        </div>

        {/* Note */}
        <p className="mt-12 text-center text-sm text-gray-500">
          These are design previews. Final implementation will include full
          functionality.
        </p>
      </main>
    </div>
  );
}
