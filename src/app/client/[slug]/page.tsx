"use client";

import { use } from "react";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientBySlug = NonNullable<RouterOutputs["clients"]["getBySlug"]>;
type ClientProject = ClientBySlug["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type UpdateWithProject = ClientUpdate & { projectName: string };
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Monitor, FileText, Send, DollarSign } from "lucide-react";
import Link from "next/link";

export default function ClientDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading } = api.clients.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
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

  const typeIcon = (type: string) => {
    switch (type) {
      case "demo":
        return <Monitor className="h-4 w-4" style={{ color: "#D4AF37" }} />;
      case "proposal":
        return <FileText className="h-4 w-4" style={{ color: "#D4AF37" }} />;
      case "invoice":
        return <DollarSign className="h-4 w-4" style={{ color: "#D4AF37" }} />;
      default:
        return <Send className="h-4 w-4" style={{ color: "#D4AF37" }} />;
    }
  };

  // Flatten all updates for the recent activity feed
  const allUpdates = client.projects
    .flatMap((p: ClientProject) =>
      p.updates.map((u: ClientUpdate) => ({ ...u, projectName: p.name }))
    )
    .sort(
      (a: UpdateWithProject, b: UpdateWithProject) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <h1 className="mb-2 text-3xl font-bold">Welcome, {client.name}</h1>
      <p className="mb-8 text-gray-400">
        Here&apos;s an overview of your projects and recent activity.
      </p>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card
          className="bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: "#D4AF37" }}>
              {client.projects.length}
            </p>
            <p className="text-sm text-gray-400">Active Projects</p>
          </CardContent>
        </Card>
        <Card
          className="bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: "#D4AF37" }}>
              {allUpdates.length}
            </p>
            <p className="text-sm text-gray-400">Total Updates</p>
          </CardContent>
        </Card>
        <Card
          className="bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold" style={{ color: "#D4AF37" }}>
              {client.agreements.length}
            </p>
            <p className="text-sm text-gray-400">Agreements</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent updates */}
      <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
      {allUpdates.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          No updates yet. Check back soon!
        </p>
      ) : (
        <div className="space-y-3">
          {allUpdates.slice(0, 10).map((update: UpdateWithProject) => (
            <Card
              key={update.id}
              className="bg-white/5 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="mt-1">{typeIcon(update.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{update.title}</p>
                    <Badge
                      variant="outline"
                      className="border-gray-700 text-xs text-gray-400"
                    >
                      {update.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {update.projectName} &middot;{" "}
                    {new Date(update.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Projects list */}
      <h2 className="mb-4 mt-10 text-xl font-semibold">Your Projects</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {client.projects.map((project: ClientProject) => (
          <Card
            key={project.id}
            className="bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <CardContent className="p-5">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              {project.description && (
                <p className="mt-1 text-sm text-gray-400">
                  {project.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <Badge
                  className={
                    project.status === "active"
                      ? "bg-green-900/50 text-green-400"
                      : "bg-gray-800 text-gray-400"
                  }
                >
                  {project.status}
                </Badge>
                <p className="text-xs text-gray-500">
                  {project.updates.length} update
                  {project.updates.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ClientPortalLayout>
  );
}
