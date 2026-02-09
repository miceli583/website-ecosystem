"use client";

import { Globe, Palette } from "lucide-react";
import { StagingCard } from "~/components/portal";

interface CHW360MockupHubProps {
  basePath: string;
}

export function CHW360MockupHub({ basePath }: CHW360MockupHubProps) {
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
            CHW360 Mockup Implementation
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Exact replica of the approved mockup design
          </p>
        </div>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <StagingCard
            href={`${basePath}/frontend`}
            icon={<Globe className="h-6 w-6" />}
            title="View Mockup"
            description="Preview the CHW360 website design with all sections and interactions"
          />
          <StagingCard
            href={`${basePath}/assets`}
            icon={<Palette className="h-6 w-6" />}
            title="Brand Assets"
            description="Logo, colors, typography, and imagery used in the CHW360 design"
          />
        </div>
        <p className="mt-12 text-center text-sm text-gray-500">
          This is a design preview matching the approved mockup specifications.
        </p>
      </main>
    </div>
  );
}
