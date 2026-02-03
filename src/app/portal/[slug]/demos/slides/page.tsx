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
      <div className="grid gap-6 md:grid-cols-3">
        {/* Input Documents Card */}
        <Link
          href={`/portal/${slug}/demos/slides/inputs`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-yellow-600/50 hover:shadow-xl hover:shadow-yellow-900/10"
        >
          <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <FileText className="h-7 w-7" style={{ color: "#D4AF37" }} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-yellow-400">
            Input Documents
          </h2>
          <p className="text-gray-400">
            View and manage your source training materials. 4 modules ready for
            processing.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-full bg-green-900/30 px-2 py-1 text-green-400">
              4 files loaded
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-500/5 blur-2xl transition-all group-hover:bg-yellow-500/10" />
        </Link>

        {/* Talking Tracks Card */}
        <Link
          href={`/portal/${slug}/demos/slides/talking-tracks`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-orange-600/50 hover:shadow-xl hover:shadow-orange-900/10"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-900/20">
            <Mic className="h-7 w-7 text-orange-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-orange-400">
            Talking Tracks
          </h2>
          <p className="text-gray-400">
            Presenter scripts and talking points for each slide in your training
            modules.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-full bg-orange-900/30 px-2 py-1 text-orange-400">
              1 module ready
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl transition-all group-hover:bg-orange-500/10" />
        </Link>

        {/* Slides Preview Card */}
        <Link
          href={`/portal/${slug}/demos/slides/presentation`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-cyan-600/50 hover:shadow-xl hover:shadow-cyan-900/10"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-900/20">
            <Play className="h-7 w-7 text-cyan-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-cyan-400">
            Slides Preview
          </h2>
          <p className="text-gray-400">
            View a web-based presentation preview built with modern UI
            components.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-full bg-cyan-900/30 px-2 py-1 text-cyan-400">
              Module 1 ready
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl transition-all group-hover:bg-cyan-500/10" />
        </Link>

        {/* GAMMA Presentations Card */}
        <Link
          href={`/portal/${slug}/demos/slides/gamma`}
          className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 transition-all hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-900/10"
        >
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-900/20">
            <Sparkles className="h-7 w-7 text-purple-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white group-hover:text-purple-400">
            Gamma Presentations
          </h2>
          <p className="text-gray-400">
            Generate polished presentation decks with AI. Export to PowerPoint,
            PDF, or share links.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-full bg-purple-900/30 px-2 py-1 text-purple-400">
              AI-powered
            </span>
          </div>
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/5 blur-2xl transition-all group-hover:bg-purple-500/10" />
        </Link>
      </div>
    </DemoHubLayout>
  );
}
