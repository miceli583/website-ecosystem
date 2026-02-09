"use client";

import Link from "next/link";
import { ArrowLeft, Play, Monitor, Layers, Clock, Maximize2 } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface SlidesPresentationDemoProps {
  basePath?: string;
  backHref?: string;
}

const FEATURES = [
  {
    icon: Monitor,
    title: "Web-Based Viewer",
    description: "View slides directly in the browser with no downloads required.",
  },
  {
    icon: Maximize2,
    title: "Fullscreen Mode",
    description: "Present in fullscreen with keyboard navigation support.",
  },
  {
    icon: Layers,
    title: "Slide Navigation",
    description: "Jump between slides with the overview panel or arrow keys.",
  },
  {
    icon: Clock,
    title: "Presenter Timer",
    description: "Built-in timer to keep your presentation on track.",
  },
];

export function SlidesPresentationDemo({ backHref }: SlidesPresentationDemoProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      {backHref && (
        <header
          className="border-b px-4 py-4 sm:px-6"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Slides Hub
            </Link>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
            }}
          >
            <Play className="h-8 w-8" style={{ color: "#D4AF37" }} />
          </div>
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
            Slides Preview
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            A web-based presentation preview built with modern UI components,
            ready for live delivery or review.
          </p>
        </div>

        {/* Preview Placeholder */}
        <div
          className="mb-10 flex aspect-video items-center justify-center rounded-xl border"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(212,175,55,0.06) 100%)",
          }}
        >
          <div className="text-center">
            <div
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(246,230,193,0.15) 0%, rgba(212,175,55,0.2) 100%)",
              }}
            >
              <Play className="h-10 w-10" style={{ color: "#D4AF37" }} />
            </div>
            <p className="mb-1 text-lg font-semibold text-white">
              Module 1: Foundation
            </p>
            <p className="text-sm text-gray-500">61 slides ready for review</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-4">
          {[
            { label: "Module", value: "Part 1" },
            { label: "Total Slides", value: "61" },
            { label: "Est. Duration", value: "~45 min" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border p-4 text-center"
              style={{
                borderColor: "rgba(212, 175, 55, 0.2)",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: "#D4AF37" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="mb-4 text-lg font-semibold text-white">
          Presentation Features
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-0 bg-white/5 transition-colors hover:bg-white/10"
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: "#D4AF37" }}
                    />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
