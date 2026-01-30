"use client";

import { use } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Wrench,
  Loader2,
  AlertCircle,
  ExternalLink,
  Key,
  Book,
  Code,
  Link as LinkIcon,
  FileText,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

type Resource = RouterOutputs["portal"]["getResources"][number];

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  link: <LinkIcon className="h-5 w-5" />,
  key: <Key className="h-5 w-5" />,
  book: <Book className="h-5 w-5" />,
  code: <Code className="h-5 w-5" />,
  file: <FileText className="h-5 w-5" />,
  wrench: <Wrench className="h-5 w-5" />,
};

function ResourceCard({ resource }: { resource: Resource }) {
  const [showCredentials, setShowCredentials] = useState(false);
  const [copied, setCopied] = useState(false);

  const metadata = resource.metadata as Record<string, unknown> | null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    if (resource.icon && iconMap[resource.icon]) {
      return iconMap[resource.icon];
    }
    // Default icons by type
    switch (resource.type) {
      case "credential":
        return <Key className="h-5 w-5" />;
      case "embed":
        return <Code className="h-5 w-5" />;
      case "file":
        return <FileText className="h-5 w-5" />;
      default:
        return <LinkIcon className="h-5 w-5" />;
    }
  };

  return (
    <Card
      className="bg-white/5 transition-all hover:bg-white/10"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "rgba(212, 175, 55, 0.1)", color: "#D4AF37" }}
            >
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-white">{resource.title}</h3>
              {resource.description && (
                <p className="mt-1 text-sm text-gray-400">{resource.description}</p>
              )}
            </div>
          </div>
          {resource.isFeatured && (
            <Badge className="bg-yellow-900/50 text-yellow-400">Featured</Badge>
          )}
        </div>

        {/* Link type */}
        {resource.type === "link" && resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm transition-colors hover:underline"
            style={{ color: "#D4AF37" }}
          >
            Open link <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {/* Credential type */}
        {resource.type === "credential" && metadata && (
          <div className="mt-4 space-y-2 rounded-md bg-black/30 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-gray-500">Credentials</span>
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-gray-400 hover:text-white"
              >
                {showCredentials ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {Boolean(metadata.username) && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Username:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white">
                    {showCredentials ? String(metadata.username) : "••••••••"}
                  </code>
                  <button
                    onClick={() => handleCopy(String(metadata.username))}
                    className="text-gray-400 hover:text-white"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            {Boolean(metadata.password) && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Password:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white">
                    {showCredentials ? String(metadata.password) : "••••••••"}
                  </code>
                  <button
                    onClick={() => handleCopy(String(metadata.password))}
                    className="text-gray-400 hover:text-white"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            {Boolean(metadata.apiKey) && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">API Key:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white">
                    {showCredentials ? String(metadata.apiKey) : "••••••••••••"}
                  </code>
                  <button
                    onClick={() => handleCopy(String(metadata.apiKey))}
                    className="text-gray-400 hover:text-white"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File type */}
        {resource.type === "file" && resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
          >
            <FileText className="h-4 w-4" />
            Download {metadata?.filename ? String(metadata.filename) : "file"}
          </a>
        )}

        {/* Project association */}
        {resource.project && (
          <p className="mt-3 text-xs text-gray-500">
            Project: {resource.project.name}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function PortalToolingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery({ slug });
  const { data: resources, isLoading: resourcesLoading } = api.portal.getResources.useQuery({
    slug,
    section: "tooling",
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

  const featuredResources = resources?.filter((r: Resource) => r.isFeatured) ?? [];
  const otherResources = resources?.filter((r: Resource) => !r.isFeatured) ?? [];

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <h1 className="mb-2 text-3xl font-bold">Tooling</h1>
      <p className="mb-8 text-gray-400">
        Resources, integrations, and developer tools for your projects.
      </p>

      {resourcesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
        </div>
      ) : resources?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Wrench className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No tools configured yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            API keys, documentation, and integrations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured */}
          {featuredResources.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-300">Featured</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredResources.map((resource: Resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* Other resources */}
          {otherResources.length > 0 && (
            <div>
              {featuredResources.length > 0 && (
                <h2 className="mb-4 text-lg font-semibold text-gray-300">All Tools</h2>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {otherResources.map((resource: Resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ClientPortalLayout>
  );
}
