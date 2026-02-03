"use client";

import { use } from "react";
import { FileText, Presentation, Mic, Play, Sparkles } from "lucide-react";
import { DemoHubLayout, StagingCard } from "~/components/portal";

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
        <StagingCard
          href={`/portal/${slug}/demos/slides/inputs`}
          icon={<FileText className="h-6 w-6" />}
          title="Input Documents"
          description="View and manage your source training materials. 4 modules ready for processing."
          badge="4 files loaded"
        />
        <StagingCard
          href={`/portal/${slug}/demos/slides/talking-tracks`}
          icon={<Mic className="h-6 w-6" />}
          title="Talking Tracks"
          description="Presenter scripts and talking points for each slide in your training modules."
          badge="1 module ready"
        />
        <StagingCard
          href={`/portal/${slug}/demos/slides/presentation`}
          icon={<Play className="h-6 w-6" />}
          title="Slides Preview"
          description="View a web-based presentation preview built with modern UI components."
          badge="Module 1 ready"
        />
        <StagingCard
          href={`/portal/${slug}/demos/slides/gamma`}
          icon={<Sparkles className="h-6 w-6" />}
          title="Gamma Presentations"
          description="Generate polished presentation decks with AI. Export to PowerPoint, PDF, or share links."
          badge="AI-powered"
        />
      </div>
    </DemoHubLayout>
  );
}
