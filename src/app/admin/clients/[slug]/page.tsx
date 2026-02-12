"use client";

import { use, useState } from "react";
import Link from "next/link";
import { api, type RouterOutputs } from "~/trpc/react";

type ClientDetail = NonNullable<RouterOutputs["clients"]["getBySlugAdmin"]>;
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
  ExternalLink,
  Pencil,
  Check,
  X,
} from "lucide-react";

export default function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, refetch } = api.clients.getBySlugAdmin.useQuery({
    slug,
  });

  const createProject = api.clients.createProject.useMutation({
    onSuccess: () => void refetch(),
  });
  const updateProject = api.clients.updateProject.useMutation({
    onSuccess: () => void refetch(),
  });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  // Inline project editing state
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleCreateProject = () => {
    if (!projectName || !client) return;
    createProject.mutate({
      clientId: client.id,
      name: projectName,
      description: projectDesc || undefined,
    });
    setShowProjectForm(false);
    setProjectName("");
    setProjectDesc("");
  };

  const startEditing = (project: ClientProject) => {
    setEditingProjectId(project.id);
    setEditName(project.name);
    setEditDesc(project.description ?? "");
  };

  const cancelEditing = () => {
    setEditingProjectId(null);
    setEditName("");
    setEditDesc("");
  };

  const saveEditing = () => {
    if (!editName || editingProjectId === null) return;
    updateProject.mutate({
      id: editingProjectId,
      name: editName,
      description: editDesc || null,
    });
    setEditingProjectId(null);
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

        {/* Stripe Lifetime Spend */}
        {client.stripeLifetimeSpend && (
          <Card
            className="mb-8 bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ background: "rgba(212, 175, 55, 0.15)" }}
              >
                <DollarSign className="h-5 w-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stripe Lifetime Spend
                </p>
                <p className="text-xl font-bold text-white">
                  {(client.stripeLifetimeSpend.totalCents / 100).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
              </div>
              <p className="ml-auto text-sm text-gray-500">
                {client.stripeLifetimeSpend.chargeCount} payment{client.stripeLifetimeSpend.chargeCount !== 1 ? "s" : ""}
              </p>
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
                    {editingProjectId === project.id ? (
                      <div className="flex-1 space-y-2 pr-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-gray-700 bg-black/50 px-3 py-1.5 text-white"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          placeholder="Description (optional)"
                          className="w-full rounded border border-gray-700 bg-black/50 px-3 py-1.5 text-sm text-white placeholder:text-gray-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-400">
                            {project.description}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {editingProjectId === project.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={saveEditing}
                            disabled={!editName || updateProject.isPending}
                            style={{
                              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                              color: "black",
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                            className="border-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(project)}
                            className="border-gray-700 text-xs"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Link
                            href={`/admin/clients/${slug}/push-update?projectId=${project.id}`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 text-xs"
                              title="Create an update record and send email notification to the client"
                            >
                              <Send className="mr-1 h-3 w-3" />
                              Push Update
                            </Button>
                          </Link>
                        </>
                      )}
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
        <Link
          href={`/portal/${client.slug}`}
          className="mt-10 flex items-center gap-3 rounded-lg border p-4 transition-all hover:bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
            }}
          >
            <ExternalLink className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Client Portal</p>
            <p className="text-xs text-gray-500">
              /portal/{client.slug}
            </p>
          </div>
          <span className="text-xs text-gray-500">Open portal &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
