"use client";

import { Globe, LayoutDashboard } from "lucide-react";
import { StagingCard } from "~/components/portal";

interface CHW360WebsiteHubProps {
  basePath: string;
}

export function CHW360WebsiteHub({ basePath }: CHW360WebsiteHubProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              fontFamily: "Quattrocento Sans, serif",
              letterSpacing: "0.08em",
              background:
                "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CHW360 Website Build
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Preview your new high-converting website and admin dashboard
          </p>
        </div>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <StagingCard
            href={`${basePath}/frontend`}
            icon={<Globe className="h-6 w-6" />}
            title="Website Frontend"
            description="Preview your public-facing landing page with modern design, compelling copy, and conversion-focused layout"
          />
          <StagingCard
            href={`${basePath}/admin`}
            icon={<LayoutDashboard className="h-6 w-6" />}
            title="Admin Dashboard"
            description="See how you'll manage signups, track analytics, and oversee your website performance"
          />
        </div>
        <p className="mt-12 text-center text-sm text-gray-500">
          These are design previews. Final implementation will include full
          functionality.
        </p>
      </main>
    </div>
  );
}
