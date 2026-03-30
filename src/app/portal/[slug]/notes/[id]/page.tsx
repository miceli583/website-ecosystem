"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";
import {
  NoteEditor,
  ProjectAssignDialog,
  ConfirmDialog,
} from "~/components/portal";
import { RichTextPreview } from "~/components/portal/rich-text-preview";
import {
  ArrowLeft,
  Pin,
  Pencil,
  Trash2,
  FolderOpen,
  Archive,
  ArchiveRestore,
  Loader2,
  AlertCircle,
  StickyNote,
} from "lucide-react";

type Note = RouterOutputs["portalNotes"]["getNotes"][number];

function relativeTime(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function wasEdited(note: Note): boolean {
  return (
    new Date(note.updatedAt).getTime() - new Date(note.createdAt).getTime() >
    60_000
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]![0]!.toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = use(params);
  const noteId = parseInt(id, 10);
  const router = useRouter();
  const utils = api.useUtils();

  // Check if edit mode was requested via query param
  const startEditing =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("edit") === "1";

  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  const { data: notes, isLoading } = api.portalNotes.getNotes.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin, staleTime: 5 * 60 * 1000 }
  );

  const note = notes?.find((n: Note) => n.id === noteId) ?? null;

  // UI state
  const [isEditing, setIsEditing] = useState(startEditing);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Mutations
  const updateNote = api.portalNotes.updateNote.useMutation({
    onSuccess: () => {
      toast.success("Note updated");
      setIsEditing(false);
      void utils.portalNotes.getNotes.invalidate({ slug });
    },
    onError: () => toast.error("Failed to update note"),
  });

  const deleteNote = api.portalNotes.deleteNote.useMutation({
    onSuccess: () => {
      toast.success("Note deleted");
      router.push(`/portal/${slug}/notes`);
    },
    onError: () => toast.error("Failed to delete note"),
  });

  const togglePin = api.portalNotes.updateNote.useMutation({
    onSuccess: (_, variables) => {
      toast.success(variables.isPinned ? "Note pinned" : "Note unpinned");
      void utils.portalNotes.getNotes.invalidate({ slug });
    },
    onError: () => toast.error("Failed to update pin"),
  });

  const archiveNote = api.portalNotes.updateNote.useMutation({
    onSuccess: (_, variables) => {
      toast.success(variables.isArchived ? "Note archived" : "Note restored");
      void utils.portalNotes.getNotes.invalidate({ slug });
    },
    onError: () => toast.error("Failed to archive note"),
  });

  const assignNote = api.portalNotes.updateNote.useMutation({
    onSuccess: () => {
      toast.success("Project assigned");
      void utils.portalNotes.getNotes.invalidate({ slug });
      void utils.portal.getProjects.invalidate({ slug });
    },
    onError: () => toast.error("Failed to assign project"),
  });

  const createProject = api.portal.createProject.useMutation({
    onSuccess: () => {
      toast.success("Project created");
      void utils.portal.getProjects.invalidate({ slug });
    },
  });

  const canDelete = useCallback(
    (n: Note) => isAdmin || n.createdByAuthId === profile?.authUserId,
    [isAdmin, profile?.authUserId]
  );

  const canEdit = useCallback(
    (n: Note) => isAdmin || n.createdByAuthId === profile?.authUserId,
    [isAdmin, profile?.authUserId]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-gray-600" />
        <h1 className="mb-2 text-xl font-bold text-white">Note not found</h1>
        <p className="mb-4 text-gray-400">
          This note may have been deleted or you don&apos;t have access.
        </p>
        <Link
          href={`/portal/${slug}/notes`}
          className="text-sm transition-colors hover:underline"
          style={{ color: "#D4AF37" }}
        >
          &larr; Back to Notes
        </Link>
      </div>
    );
  }

  const edited = wasEdited(note);

  return (
    <>
      {/* Back link */}
      <div className="mb-6">
        <Link
          href={`/portal/${slug}/notes`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <StickyNote
                className="h-5 w-5 flex-shrink-0"
                style={{ color: "#D4AF37" }}
              />
              <h1 className="text-2xl font-bold text-white">{note.title}</h1>
              {note.isPinned && (
                <Pin
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "#D4AF37" }}
                />
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[10px] font-bold text-[#D4AF37]">
                  {getInitials(note.createdByName)}
                </span>
                <span>{note.createdByName}</span>
              </div>
              {note.project && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                    color: "#D4AF37",
                  }}
                >
                  {note.project.name}
                </span>
              )}
              <span className="text-xs">
                {relativeTime(note.updatedAt)}
                {edited && (
                  <span className="ml-1 text-gray-600 italic">(edited)</span>
                )}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {canEdit(note) && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={() =>
                    togglePin.mutate({
                      slug,
                      noteId: note.id,
                      isPinned: !note.isPinned,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 ${
                    note.isPinned
                      ? "text-[#D4AF37]"
                      : "text-gray-400 hover:text-white"
                  }`}
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <Pin className="h-3.5 w-3.5" />
                  {note.isPinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() =>
                    archiveNote.mutate({
                      slug,
                      noteId: note.id,
                      isArchived: !note.isArchived,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  {note.isArchived ? (
                    <ArchiveRestore className="h-3.5 w-3.5" />
                  ) : (
                    <Archive className="h-3.5 w-3.5" />
                  )}
                  {note.isArchived ? "Restore" : "Archive"}
                </button>
                <button
                  onClick={() => setShowAssignDialog(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Project
                </button>
              </>
            )}
            {canDelete(note) && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                style={{ borderColor: "rgba(248, 113, 113, 0.2)" }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mb-6 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />

      {/* Content */}
      {isEditing ? (
        <div
          className="rounded-lg border p-1"
          style={{
            borderColor: "rgba(212, 175, 55, 0.3)",
            backgroundColor: "rgba(212, 175, 55, 0.04)",
          }}
        >
          <NoteEditor
            initialTitle={note.title}
            initialContent={note.content}
            onSave={(title, content) =>
              updateNote.mutate({ slug, noteId: note.id, title, content })
            }
            onCancel={() => setIsEditing(false)}
            saving={updateNote.isPending}
            compact
          />
        </div>
      ) : (
        <div className="prose-invert">
          <RichTextPreview html={note.content} />
        </div>
      )}

      {/* Project Assignment Dialog */}
      {isAdmin && (
        <ProjectAssignDialog
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          currentProjectId={note.projectId}
          projects={projects ?? []}
          onAssign={(projectId) =>
            assignNote.mutate({ slug, noteId: note.id, projectId })
          }
          onCreateProject={(name) => createProject.mutateAsync({ slug, name })}
          isLoading={assignNote.isPending || createProject.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Note"
        description={`Are you sure you want to permanently delete "${note.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => deleteNote.mutate({ slug, noteId: note.id })}
        isLoading={deleteNote.isPending}
      />
    </>
  );
}
