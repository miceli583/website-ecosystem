"use client";

import { use } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["portal"]["getClientBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type UpdateWithProject = ClientUpdate & { projectName: string };
type Resource = RouterOutputs["portal"]["getResources"][number];

import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Monitor, Loader2, AlertCircle, ExternalLink, Play } from "lucide-react";
import { useState } from "react";

function DemoResourceCard({ resource }: { resource: Resource }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const metadata = resource.metadata as Record<string, unknown> | null;

  return (
    <Card
      className="bg-white/5 overflow-hidden"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      {/* Embed preview */}
      {resource.type === "embed" && resource.url && showEmbed && (
        <div
          className="relative w-full bg-black"
          style={{ height: metadata?.height ? String(metadata.height) : "400px" }}
        >
          <iframe
            src={resource.url}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Custom embed code */}
      {resource.type === "embed" && resource.embedCode && showEmbed && (
        <div
          className="relative w-full bg-black"
          style={{ height: metadata?.height ? String(metadata.height) : "400px" }}
          dangerouslySetInnerHTML={{ __html: resource.embedCode }}
        />
      )}

      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Monitor className="mt-1 h-8 w-8 flex-shrink-0" style={{ color: "#D4AF37" }} />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{resource.title}</h3>
                {resource.description && (
                  <p className="mt-1 text-sm text-gray-400">{resource.description}</p>
                )}
              </div>
              {resource.isFeatured && (
                <Badge className="ml-2 bg-yellow-900/50 text-yellow-400">Featured</Badge>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {/* Embed toggle */}
              {resource.type === "embed" && (resource.url || resource.embedCode) && (
                <button
                  onClick={() => setShowEmbed(!showEmbed)}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: showEmbed ? "rgba(212, 175, 55, 0.2)" : "rgba(255, 255, 255, 0.1)",
                    color: showEmbed ? "#D4AF37" : "white",
                  }}
                >
                  <Play className="h-4 w-4" />
                  {showEmbed ? "Hide Preview" : "Show Preview"}
                </button>
              )}

              {/* External link */}
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in new tab
                </a>
              )}
            </div>

            {/* Project association */}
            {resource.project && (
              <p className="mt-3 text-xs text-gray-500">
                Project: {resource.project.name}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortalDemosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery({ slug });
  const { data: resources, isLoading: resourcesLoading } = api.portal.getResources.useQuery({
    slug,
    section: "demos",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold">Access Denied</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Portal not found
      </div>
    );
  }

  // Also get legacy demos from clientUpdates
  const legacyDemos = client.projects
    .flatMap((p: ClientProject) =>
      p.updates
        .filter((u: ClientUpdate) => u.type === "demo")
        .map((u: ClientUpdate) => ({ ...u, projectName: p.name }))
    )
    .sort(
      (a: UpdateWithProject, b: UpdateWithProject) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const hasContent = (resources?.length ?? 0) > 0 || legacyDemos.length > 0;

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <h1 className="mb-2 text-3xl font-bold">Demos</h1>
      <p className="mb-8 text-gray-400">
        Interactive previews and proof-of-concept builds for your projects.
      </p>

      {resourcesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
        </div>
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Monitor className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No demos yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Resource-based demos */}
          {resources?.map((resource: Resource) => (
            <DemoResourceCard key={resource.id} resource={resource} />
          ))}

          {/* Legacy demos from clientUpdates */}
          {legacyDemos.map((demo: UpdateWithProject) => (
            <Card
              key={demo.id}
              className="bg-white/5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Monitor className="mt-1 h-8 w-8 flex-shrink-0" style={{ color: "#D4AF37" }} />
                  <div>
                    <h3 className="text-lg font-semibold">{demo.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{demo.projectName}</p>
                    <div
                      className="prose prose-invert prose-sm mt-3 max-w-none text-gray-300"
                      dangerouslySetInnerHTML={{ __html: demo.content }}
                    />
                    <p className="mt-3 text-xs text-gray-500">
                      {new Date(demo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ClientPortalLayout>
  );
}
