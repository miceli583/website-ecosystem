"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ExternalLink, FileText } from "lucide-react";

const gammaPressentations = [
  {
    id: "org-skills-1",
    title: "Organizational Skills Part 1",
    description: "Foundation module covering time management, task tracking, and accountability systems for CHWs.",
    slides: 60,
    url: "https://gamma.app/docs/5feaowxahntp9wd",
    status: "ready" as const,
  },
  {
    id: "org-skills-2",
    title: "Organizational Skills Part 2",
    description: "Applied organizational skills with real-world CHW workflows and scenarios.",
    slides: null,
    url: null,
    status: "coming-soon" as const,
  },
  {
    id: "org-skills-3",
    title: "Organizational Skills Part 3",
    description: "Advanced techniques for high-volume work and team coordination.",
    slides: null,
    url: null,
    status: "coming-soon" as const,
  },
  {
    id: "org-skills-4",
    title: "Organizational Skills Part 4",
    description: "Integrated practice combining all organizational competencies.",
    slides: null,
    url: null,
    status: "coming-soon" as const,
  },
];

export default function GammaPresentationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className="border-b backdrop-blur-md"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href={`/portal/${slug}/demos/slides`}
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Slide Generator
          </Link>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#D4AF37" }}
            >
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold">Gamma Presentations</h1>
              <p className="text-xs text-gray-500">AI-Generated Decks</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
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
            Gamma Presentations
          </h1>
          <p className="max-w-2xl text-lg text-gray-400">
            AI-generated presentation decks for your CHW training modules.
            View online, export to PowerPoint, or download as PDF.
          </p>
        </div>

        {/* Info Banner */}
        <div
          className="mb-8 rounded-xl border p-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)", backgroundColor: "rgba(212, 175, 55, 0.05)" }}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#D4AF37" }} />
            <div>
              <p className="font-medium" style={{ color: "#F6E6C1" }}>Powered by Gamma AI</p>
              <p className="mt-1 text-sm text-gray-400">
                These presentations are generated using your training content and can be
                exported to PowerPoint or PDF for offline use.
              </p>
            </div>
          </div>
        </div>

        {/* Presentations Grid */}
        <div className="grid gap-4">
          {gammaPressentations.map((presentation) => (
            <div
              key={presentation.id}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all ${
                presentation.status === "ready"
                  ? "bg-white/5 backdrop-blur-md hover:bg-white/10 hover:shadow-xl"
                  : "bg-white/[0.02]"
              }`}
              style={{
                borderColor: presentation.status === "ready"
                  ? "rgba(212, 175, 55, 0.2)"
                  : "rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: presentation.status === "ready"
                        ? "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)"
                        : "rgba(255, 255, 255, 0.03)",
                      border: presentation.status === "ready"
                        ? "1px solid rgba(212, 175, 55, 0.2)"
                        : "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <FileText
                      className="h-6 w-6"
                      style={{
                        color: presentation.status === "ready" ? "#D4AF37" : "#4b5563",
                      }}
                    />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        presentation.status === "ready"
                          ? "text-white group-hover:text-[#D4AF37]"
                          : "text-gray-500"
                      }`}
                    >
                      {presentation.title}
                    </h2>
                    <p
                      className={`mt-1 ${
                        presentation.status === "ready"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {presentation.description}
                    </p>
                    {presentation.slides && (
                      <p className="mt-2 text-sm" style={{ color: "#D4AF37" }}>
                        {presentation.slides} slides
                      </p>
                    )}
                  </div>
                </div>

                {presentation.status === "ready" && presentation.url ? (
                  <a
                    href={presentation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 font-medium text-black transition-opacity hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)" }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View
                  </a>
                ) : (
                  <span className="flex-shrink-0 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-500">
                    Coming Soon
                  </span>
                )}
              </div>

              {presentation.status === "ready" && (
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all" style={{ backgroundColor: "rgba(212, 175, 55, 0.03)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div
          className="mt-10 rounded-xl border p-6 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.15)", backgroundColor: "rgba(255, 255, 255, 0.02)" }}
        >
          <p className="text-sm text-gray-500">
            CHW360 Training Materials | Generated with Gamma AI
          </p>
          <p className="mt-2 text-xs text-gray-600">
            Presentations can be edited in Gamma, exported to PowerPoint (.pptx),
            or downloaded as PDF for offline training sessions.
          </p>
        </div>
      </main>
    </div>
  );
}
