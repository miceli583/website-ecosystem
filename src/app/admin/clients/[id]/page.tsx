"use client";

import { use, useState } from "react";
import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientDetail = NonNullable<RouterOutputs["clients"]["getById"]>;
type ClientProject = ClientDetail["projects"][number];
type ClientUpdate = ClientProject["updates"][number];
type ClientAgreement = ClientDetail["agreements"][number];
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  FileText,
  Monitor,
  DollarSign,
  Send,
} from "lucide-react";

export default function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const clientId = Number(id);
  const { data: client, isLoading, refetch } = api.clients.getById.useQuery({
    id: clientId,
  });

  const createProject = api.clients.createProject.useMutation({
    onSuccess: () => void refetch(),
  });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const handleCreateProject = () => {
    if (!projectName) return;
    createProject.mutate({
      clientId,
      name: projectName,
      description: projectDesc || undefined,
    });
    setShowProjectForm(false);
    setProjectName("");
    setProjectDesc("");
  };

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
        Client not found
      </div>
    );
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case "demo":
        return <Monitor className="h-4 w-4" />;
      case "proposal":
        return <FileText className="h-4 w-4" />;
      case "invoice":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <Link
          href="/admin/clients"
          className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-gray-200"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          All Clients
        </Link>

        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-gray-400">{client.email}</p>
            {client.company && (
              <p className="mt-1 text-sm text-gray-500">{client.company}</p>
            )}
          </div>
          <Badge
            className={
              client.status === "active"
                ? "bg-green-900/50 text-green-400"
                : "bg-gray-800 text-gray-400"
            }
          >
            {client.status}
          </Badge>
        </div>

        {/* Notes */}
        {client.notes && (
          <Card
            className="mb-8 bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <CardContent className="p-4">
              <p className="text-sm text-gray-300">{client.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Button
            size="sm"
            onClick={() => setShowProjectForm(!showProjectForm)}
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              color: "black",
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            New Project
          </Button>
        </div>

        {showProjectForm && (
          <Card
            className="mb-6 bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
          >
            <CardContent className="p-4">
              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="rounded border border-gray-700 bg-black/50 px-3 py-2 text-white"
                  rows={2}
                />
              </div>
              <div className="mt-3 flex gap-3">
                <Button
                  size="sm"
                  onClick={handleCreateProject}
                  disabled={!projectName || createProject.isPending}
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    color: "black",
                  }}
                >
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowProjectForm(false)}
                  className="border-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {client.projects.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No projects yet. Create one to get started.
          </p>
        ) : (
          <div className="space-y-6">
            {client.projects.map((project: ClientProject) => (
              <Card
                key={project.id}
                className="bg-white/5"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-400">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        className={
                          project.status === "active"
                            ? "bg-green-900/50 text-green-400"
                            : project.status === "completed"
                              ? "bg-blue-900/50 text-blue-400"
                              : "bg-gray-800 text-gray-400"
                        }
                      >
                        {project.status}
                      </Badge>
                      <Link
                        href={`/admin/clients/${client.id}/push-update?projectId=${project.id}`}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-xs"
                        >
                          <Send className="mr-1 h-3 w-3" />
                          Push Update
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Updates */}
                  {project.updates.length > 0 && (
                    <div className="space-y-2 border-t border-gray-800 pt-3">
                      {project.updates.map((update: ClientUpdate) => (
                        <div
                          key={update.id}
                          className="flex items-start gap-3 rounded p-2 hover:bg-white/5"
                        >
                          <div className="mt-1 text-gray-500">
                            {typeIcon(update.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {update.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {update.type} &middot;{" "}
                              {new Date(update.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Agreements */}
        {client.agreements.length > 0 && (
          <>
            <h2 className="mb-4 mt-10 text-xl font-semibold">Agreements</h2>
            <div className="space-y-3">
              {client.agreements.map((agreement: ClientAgreement) => (
                <Card
                  key={agreement.id}
                  className="bg-white/5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{agreement.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(agreement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        agreement.status === "signed"
                          ? "bg-green-900/50 text-green-400"
                          : agreement.status === "sent"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-gray-800 text-gray-400"
                      }
                    >
                      {agreement.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Portal link */}
        <div className="mt-10 rounded border border-gray-800 p-4 text-center">
          <p className="text-sm text-gray-400">
            Client portal:{" "}
            <code className="text-gray-300">
              /client/{client.slug}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
