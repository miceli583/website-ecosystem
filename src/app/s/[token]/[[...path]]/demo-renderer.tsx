"use client";

import { lazy, Suspense, type ComponentType } from "react";
import { DEMO_REGISTRY } from "~/components/demos/registry";
import { ExternalLink } from "lucide-react";

interface DemoRendererProps {
  demo: {
    title: string;
    description: string | null;
    type: string;
    url: string | null;
    embedCode: string | null;
    content: string | null;
    clientName: string;
  };
  componentKey: string | null;
  basePath: string;
  backHref?: string;
}

export function DemoRenderer({ demo, componentKey, basePath, backHref }: DemoRendererProps) {
  // Registry component (interactive page demos)
  if (componentKey && componentKey in DEMO_REGISTRY) {
    const loader = DEMO_REGISTRY[componentKey]!;
    const LazyComponent = lazy(loader) as ComponentType<{ basePath?: string; backHref?: string }>;

    return (
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600" style={{ borderTopColor: "#D4AF37" }} />
          </div>
        }
      >
        <LazyComponent basePath={basePath} backHref={backHref} />
      </Suspense>
    );
  }

  // Link type — landing page with CTA
  if (demo.type === "link" && demo.url) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1
          className="mb-4 text-4xl font-bold"
          style={{
            fontFamily: "Quattrocento Sans, serif",
            letterSpacing: "0.08em",
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {demo.title}
        </h1>
        {demo.description && (
          <p className="mb-8 max-w-lg text-lg text-gray-400">{demo.description}</p>
        )}
        <a
          href={demo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)" }}
        >
          <ExternalLink className="h-4 w-4" />
          Open Demo
        </a>
        <p className="mt-6 text-sm text-gray-500">Shared by {demo.clientName}</p>
      </div>
    );
  }

  // Embed type
  if (demo.type === "embed" && demo.embedCode) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1
          className="mb-6 text-center text-3xl font-bold"
          style={{
            fontFamily: "Quattrocento Sans, serif",
            letterSpacing: "0.08em",
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {demo.title}
        </h1>
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          dangerouslySetInnerHTML={{ __html: demo.embedCode }}
        />
      </div>
    );
  }

  // Richtext type
  if (demo.type === "richtext" && demo.content) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1
          className="mb-8 text-center text-3xl font-bold"
          style={{
            fontFamily: "Quattrocento Sans, serif",
            letterSpacing: "0.08em",
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {demo.title}
        </h1>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: demo.content }}
        />
      </div>
    );
  }

  // Fallback — demo exists but has no renderable content
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1
        className="mb-4 text-3xl font-bold"
        style={{
          fontFamily: "Quattrocento Sans, serif",
          letterSpacing: "0.08em",
          background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {demo.title}
      </h1>
      {demo.description && (
        <p className="mb-4 max-w-lg text-gray-400">{demo.description}</p>
      )}
      <p className="text-sm text-gray-500">Shared by {demo.clientName}</p>
    </div>
  );
}
