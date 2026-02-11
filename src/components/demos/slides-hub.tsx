"use client";

import { ArrowLeft, FileText, Presentation, Mic, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { StagingCard } from "~/components/portal";

interface SlidesHubProps {
  basePath: string;
  backHref?: string;
}

export function SlidesHub({ basePath, backHref }: SlidesHubProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b px-4 py-4 sm:px-6" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          {backHref ? (
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Demos
            </Link>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "#D4AF37" }}>
              <Presentation className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="font-bold">Slide Generator</p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl" style={{
            fontFamily: "Quattrocento Sans, serif",
            letterSpacing: "0.08em",
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Training Slide Generator
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Transform your training materials into polished, professional slides with AI-powered content generation and beautiful formatting.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <StagingCard href={`${basePath}/inputs`} icon={<FileText className="h-6 w-6" />} title="Input Documents" description="View and manage your source training materials. 4 modules ready for processing." badge="4 files loaded" />
          <StagingCard href={`${basePath}/talking-tracks`} icon={<Mic className="h-6 w-6" />} title="Talking Tracks" description="Presenter scripts and talking points for each slide in your training modules." badge="1 module ready" />
          <StagingCard href={`${basePath}/presentation`} icon={<Play className="h-6 w-6" />} title="Slides Preview" description="View a web-based presentation preview built with modern UI components." badge="Module 1 ready" />
          <StagingCard href={`${basePath}/gamma`} icon={<Sparkles className="h-6 w-6" />} title="Gamma Presentations" description="Generate polished presentation decks with AI. Export to PowerPoint, PDF, or share links." badge="AI-powered" />
        </div>
      </main>
    </div>
  );
}
