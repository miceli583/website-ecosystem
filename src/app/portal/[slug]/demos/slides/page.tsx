"use client";

import { use } from "react";
import Link from "next/link";
import { FileText, Presentation, Mic, Play, Sparkles } from "lucide-react";
import { DemoHubLayout } from "~/components/portal";

export default function SlidesHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <DemoHubLayout
      slug={slug}
      title="Training Slide Generator"
      subtitle="Transform your training materials into polished, professional slides with AI-powered content generation and beautiful formatting."
      headerIcon={<Presentation className="h-5 w-5 text-black" />}
      headerLabel="Slide Generator"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Documents Card */}
        <Link
          href={`/portal/${slug}/demos/slides/inputs`}
          className="group relative overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <FileText className="h-6 w-6" style={{ color: "#D4AF37" }} />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white group-hover:text-[#D4AF37]">
            Input Documents
          </h2>
          <p className="text-sm text-gray-400">
            View and manage your source training materials. 4 modules ready for
            processing.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className="rounded-full px-2 py-1 text-xs"
              style={{ backgroundColor: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }}
            >
              4 files loaded
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all" style={{ backgroundColor: "rgba(212, 175, 55, 0.03)" }} />
        </Link>

        {/* Talking Tracks Card */}
        <Link
          href={`/portal/${slug}/demos/slides/talking-tracks`}
          className="group relative overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <Mic className="h-6 w-6" style={{ color: "#D4AF37" }} />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white group-hover:text-[#D4AF37]">
            Talking Tracks
          </h2>
          <p className="text-sm text-gray-400">
            Presenter scripts and talking points for each slide in your training
            modules.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className="rounded-full px-2 py-1 text-xs"
              style={{ backgroundColor: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }}
            >
              1 module ready
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all" style={{ backgroundColor: "rgba(212, 175, 55, 0.03)" }} />
        </Link>

        {/* Slides Preview Card */}
        <Link
          href={`/portal/${slug}/demos/slides/presentation`}
          className="group relative overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <Play className="h-6 w-6" style={{ color: "#D4AF37" }} />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white group-hover:text-[#D4AF37]">
            Slides Preview
          </h2>
          <p className="text-sm text-gray-400">
            View a web-based presentation preview built with modern UI
            components.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className="rounded-full px-2 py-1 text-xs"
              style={{ backgroundColor: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }}
            >
              Module 1 ready
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all" style={{ backgroundColor: "rgba(212, 175, 55, 0.03)" }} />
        </Link>

        {/* GAMMA Presentations Card */}
        <Link
          href={`/portal/${slug}/demos/slides/gamma`}
          className="group relative overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <Sparkles className="h-6 w-6" style={{ color: "#D4AF37" }} />
          </div>
          <h2 className="mb-2 text-lg font-bold text-white group-hover:text-[#D4AF37]">
            Gamma Presentations
          </h2>
          <p className="text-sm text-gray-400">
            Generate polished presentation decks with AI. Export to PowerPoint,
            PDF, or share links.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span
              className="rounded-full px-2 py-1 text-xs"
              style={{ backgroundColor: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }}
            >
              AI-powered
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all" style={{ backgroundColor: "rgba(212, 175, 55, 0.03)" }} />
        </Link>
      </div>
    </DemoHubLayout>
  );
}
