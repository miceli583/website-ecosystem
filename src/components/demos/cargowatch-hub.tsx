"use client";

import { ArrowLeft, Globe, LayoutDashboard, AlertTriangle, Map, BookOpen } from "lucide-react";
import Link from "next/link";
import { StagingCard } from "~/components/portal";

interface CargoWatchHubProps {
  basePath: string;
  backHref?: string;
}

export function CargoWatchHub({ basePath, backHref }: CargoWatchHubProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {backHref && (
        <header className="border-b px-4 py-4 sm:px-6" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
          <div className="mx-auto max-w-5xl">
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Demos
            </Link>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              fontFamily: "Quattrocento Sans, serif",
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            CargoWatch Demo
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Freight protection platform — real-time cargo theft tracking and community alerts
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StagingCard
            href={`${basePath}/landing`}
            icon={<Globe className="h-6 w-6" />}
            title="Landing Page"
            description="Public-facing homepage with features, stats, and mission"
          />
          <StagingCard
            href={`${basePath}/dashboard`}
            icon={<LayoutDashboard className="h-6 w-6" />}
            title="Dashboard"
            description="Command center with stats, recent incidents, and hotspots"
          />
          <StagingCard
            href={`${basePath}/alerts`}
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Alert Feed"
            description="Filterable incident feed with detailed reports"
          />
          <StagingCard
            href={`${basePath}/map`}
            icon={<Map className="h-6 w-6" />}
            title="Threat Map"
            description="Interactive Mapbox map with incident markers and cargo routes"
          />
          <StagingCard
            href={`${basePath}/about`}
            icon={<BookOpen className="h-6 w-6" />}
            title="About"
            description="The $35B problem, market opportunity, and who we serve"
          />
          <StagingCard
            href={`${basePath}/resources`}
            icon={<BookOpen className="h-6 w-6" />}
            title="Resources"
            description="Security products, guides, partners, and emergency contacts"
          />
        </div>
      </main>
    </div>
  );
}
