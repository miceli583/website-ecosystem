"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  FileDown,
  Share2,
  Palette,
  Wand2,
  FileText,
  Presentation,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface SlidesGammaDemoProps {
  basePath?: string;
  backHref?: string;
}

const CAPABILITIES = [
  {
    icon: Wand2,
    title: "AI Content Generation",
    description:
      "Transform raw training content into polished, structured slides with intelligent formatting.",
  },
  {
    icon: Palette,
    title: "Professional Themes",
    description:
      "Apply cohesive visual themes that match your organization's brand identity automatically.",
  },
  {
    icon: FileDown,
    title: "Multiple Export Formats",
    description:
      "Download as PowerPoint (.pptx) for editing, PDF for distribution, or share via link.",
  },
  {
    icon: Share2,
    title: "Shareable Links",
    description:
      "Generate instant share links for stakeholder review without needing to send files.",
  },
];

const EXPORT_FORMATS = [
  {
    icon: Presentation,
    format: "PowerPoint",
    ext: ".pptx",
    description: "Editable slides for customization",
  },
  {
    icon: FileText,
    format: "PDF",
    ext: ".pdf",
    description: "Print-ready document format",
  },
  {
    icon: Share2,
    format: "Share Link",
    ext: "URL",
    description: "Instant web-based sharing",
  },
];

export function SlidesGammaDemo({ backHref }: SlidesGammaDemoProps) {
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
            <Sparkles className="h-8 w-8" style={{ color: "#D4AF37" }} />
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
            Gamma Presentations
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            AI-powered slide generation that transforms your training content
            into polished, professional presentation decks.
          </p>
        </div>

        {/* Capabilities */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">
            AI Capabilities
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <Card
                  key={cap.title}
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
                        {cap.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {cap.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Export Formats */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Export Formats
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {EXPORT_FORMATS.map((fmt) => {
              const Icon = fmt.icon;
              return (
                <div
                  key={fmt.format}
                  className="rounded-xl border p-5 text-center"
                  style={{
                    borderColor: "rgba(212, 175, 55, 0.2)",
                    background: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Icon
                    className="mx-auto mb-3 h-8 w-8"
                    style={{ color: "#D4AF37" }}
                  />
                  <p className="font-semibold text-white">{fmt.format}</p>
                  <p
                    className="mb-2 text-xs font-mono"
                    style={{ color: "#D4AF37" }}
                  >
                    {fmt.ext}
                  </p>
                  <p className="text-xs text-gray-500">{fmt.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Workflow Info */}
        <div
          className="rounded-xl border p-8 text-center"
          style={{
            borderColor: "rgba(212, 175, 55, 0.3)",
            background:
              "linear-gradient(135deg, rgba(246,230,193,0.05) 0%, rgba(212,175,55,0.08) 100%)",
          }}
        >
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-gray-500" />
          <p className="mb-2 text-lg font-semibold text-white">
            How It Works
          </p>
          <p className="mx-auto max-w-lg text-sm text-gray-500">
            Select a training module, choose a theme, and Gamma AI generates a
            complete presentation deck. Review, refine, and export in your
            preferred format -- all from one interface.
          </p>
        </div>
      </main>
    </div>
  );
}
