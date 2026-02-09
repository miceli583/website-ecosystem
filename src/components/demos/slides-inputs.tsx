"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Layers, Target, Lightbulb, CheckCircle } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface SlidesInputsDemoProps {
  basePath?: string;
  backHref?: string;
}

const MODULES = [
  {
    part: 1,
    title: "Foundation",
    icon: Layers,
    slides: 61,
    topics: [
      "CHW Role & Identity",
      "Communication Fundamentals",
      "Cultural Competency",
      "Community Assessment Basics",
    ],
  },
  {
    part: 2,
    title: "Application",
    icon: Target,
    slides: 61,
    topics: [
      "Health Education Delivery",
      "Motivational Interviewing",
      "Care Coordination",
      "Documentation & Reporting",
    ],
  },
  {
    part: 3,
    title: "Advanced Practice",
    icon: Lightbulb,
    slides: 61,
    topics: [
      "Chronic Disease Management",
      "Behavioral Health Integration",
      "Advocacy & Policy",
      "Leadership Development",
    ],
  },
  {
    part: 4,
    title: "Integration & Mastery",
    icon: CheckCircle,
    slides: 61,
    topics: [
      "Program Evaluation",
      "Sustainability Planning",
      "Mentorship & Training",
      "Professional Growth",
    ],
  },
];

export function SlidesInputsDemo({ backHref }: SlidesInputsDemoProps) {
  const totalSlides = MODULES.reduce((sum, m) => sum + m.slides, 0);

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
            Training Input Documents
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Source training materials organized across 4 modules, covering the
            full CHW certification curriculum.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Slides", value: totalSlides.toString() },
            { label: "Modules", value: "4" },
            { label: "Slides per Module", value: "61" },
            { label: "Format", value: "Structured Text" },
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

        {/* Module Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Card
                key={mod.part}
                className="overflow-hidden border-0 bg-white/5 transition-colors hover:bg-white/10"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                      }}
                    >
                      <Icon className="h-6 w-6" style={{ color: "#D4AF37" }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Part {mod.part}</p>
                      <h3 className="text-lg font-semibold text-white">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-400">
                      {mod.slides} slides
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {mod.topics.map((topic) => (
                      <li
                        key={topic}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <div
                          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: "#D4AF37" }}
                        />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
