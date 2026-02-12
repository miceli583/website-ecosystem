"use client";

import { use, useState, useRef } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Send,
} from "lucide-react";
import {
  RichTextEditor,
  type RichTextEditorRef,
} from "~/components/portal/rich-text-editor";

type Project = RouterOutputs["portal"]["getProjects"][number];

export default function PortalProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const utils = api.useUtils();

  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 },
  );
  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  const { data: projects, isLoading: projectsLoading } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin },
  );

  const createProject = api.portal.createProject.useMutation({
    onSuccess: () => {
      void utils.portal.getProjects.invalidate({ slug });
      setShowCreateForm(false);
      setNewName("");
      setNewDesc("");
    },
  });

  const updateProject = api.portal.updateProject.useMutation({
    onSuccess: () => {
      void utils.portal.getProjects.invalidate({ slug });
      setEditingId(null);
    },
  });

  const deleteProject = api.portal.deleteProject.useMutation({
    onSuccess: () => {
      void utils.portal.getProjects.invalidate({ slug });
      setDeletingId(null);
    },
  });

  const pushUpdate = api.clients.pushUpdate.useMutation({
    onSuccess: () => {
      void utils.portal.getProjects.invalidate({ slug });
      setPushingId(null);
      setPushTitle("");
      setPushHasContent(false);
      setPushType("update");
    },
  });

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Push update state
  const [pushingId, setPushingId] = useState<number | null>(null);
  const [pushTitle, setPushTitle] = useState("");
  const [pushHasContent, setPushHasContent] = useState(false);
  const [pushType, setPushType] = useState<"demo" | "proposal" | "update" | "invoice">("update");
  const pushEditorRef = useRef<RichTextEditorRef>(null);

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDesc(project.description ?? "");
  };

  const startPushing = (projectId: number) => {
    setPushingId(projectId);
    setPushTitle("");
    setPushHasContent(false);
    setPushType("update");
  };

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

  if (!isAdmin) {
    return (
      <ClientPortalLayout clientName={client.name} slug={slug}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">Admin access required.</p>
        </div>
      </ClientPortalLayout>
    );
  }

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Projects</h1>
          <p className="text-gray-400">
            Manage projects for this client.
          </p>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: "#D4AF37" }}
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div
          className="mb-6 rounded-lg border bg-white/5 p-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              autoFocus
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
          </div>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => {
                if (!newName) return;
                createProject.mutate({
                  slug,
                  name: newName,
                  description: newDesc || undefined,
                });
              }}
              disabled={!newName || createProject.isPending}
              className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              {createProject.isPending ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewName("");
                setNewDesc("");
              }}
              className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Projects list */}
      {projectsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-white/5"
            />
          ))}
        </div>
      ) : !projects?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderKanban className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No projects yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            Create a project to organize this client&apos;s work.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project: Project) => (
            <div
              key={project.id}
              className="rounded-lg border bg-white/5 p-4 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
            >
              {editingId === project.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!editName) return;
                        updateProject.mutate({
                          id: project.id,
                          name: editName,
                          description: editDesc || null,
                        });
                      }}
                      disabled={!editName || updateProject.isPending}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-opacity disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                      }}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : deletingId === project.id ? (
                <div>
                  <p className="mb-3 text-sm text-gray-300">
                    Delete <strong className="text-white">{project.name}</strong>? This will also delete all updates under this project.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteProject.mutate({ id: project.id })}
                      disabled={deleteProject.isPending}
                      className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {deleteProject.isPending ? "Deleting..." : "Confirm Delete"}
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
                        }}
                      >
                        <FolderKanban className="h-4 w-4" style={{ color: "#D4AF37" }} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{project.name}</p>
                        {project.description && (
                          <p className="text-sm text-gray-500">{project.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor:
                            project.status === "active"
                              ? "rgba(74, 222, 128, 0.1)"
                              : project.status === "completed"
                                ? "rgba(96, 165, 250, 0.1)"
                                : "rgba(156, 163, 175, 0.1)",
                          color:
                            project.status === "active"
                              ? "#4ade80"
                              : project.status === "completed"
                                ? "#60a5fa"
                                : "#9ca3af",
                        }}
                      >
                        {project.status}
                      </span>
                      <button
                        onClick={() => startPushing(project.id)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
                        title="Push update"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => startEditing(project)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                        title="Edit project"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(project.id)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline push update form */}
                  {pushingId === project.id && (
                    <div
                      className="mt-4 space-y-3 rounded-lg border p-4"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.25)",
                        backgroundColor: "rgba(212, 175, 55, 0.03)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <select
                          value={pushType}
                          onChange={(e) =>
                            setPushType(e.target.value as typeof pushType)
                          }
                          className="rounded-lg border bg-white/5 px-3 py-2 text-sm text-white"
                          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                        >
                          <option value="update">Update</option>
                          <option value="demo">Demo</option>
                          <option value="proposal">Proposal</option>
                          <option value="invoice">Invoice</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Update title"
                          value={pushTitle}
                          onChange={(e) => setPushTitle(e.target.value)}
                          className="flex-1 rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
                          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                          autoFocus
                        />
                      </div>

                      <div
                        className="rounded-lg border"
                        style={{
                          borderColor: "rgba(212, 175, 55, 0.2)",
                          backgroundColor: "rgba(10, 10, 10, 0.95)",
                        }}
                      >
                        <RichTextEditor
                          ref={pushEditorRef}
                          placeholder="Write your update..."
                          minHeight="120px"
                          onChange={(html) => {
                            const stripped = html.replace(/<[^>]*>/g, "").trim();
                            setPushHasContent(stripped.length > 0);
                          }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const content = pushEditorRef.current?.getHTML() ?? "";
                            if (!pushTitle || !content) return;
                            pushUpdate.mutate({
                              projectId: project.id,
                              title: pushTitle,
                              content,
                              type: pushType,
                            });
                          }}
                          disabled={!pushTitle || !pushHasContent || pushUpdate.isPending}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-opacity disabled:opacity-50"
                          style={{
                            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                          }}
                        >
                          <Send className="h-3.5 w-3.5" />
                          {pushUpdate.isPending ? "Pushing..." : "Push"}
                        </button>
                        <button
                          onClick={() => {
                            setPushingId(null);
                            setPushTitle("");
                            setPushHasContent(false);
                            setPushType("update");
                          }}
                          className="rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </ClientPortalLayout>
  );
}
