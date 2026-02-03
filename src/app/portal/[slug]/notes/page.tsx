"use client";

import { use, useState, useMemo } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { SearchFilterBar, NoteEditor, type SortOrder } from "~/components/portal";
import {
  StickyNote,
  Loader2,
  AlertCircle,
  Plus,
  Pin,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

type Note = RouterOutputs["portalNotes"]["getNotes"][number];

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PortalNotesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    data: client,
    isLoading,
    error,
  } = api.portal.getClientBySlug.useQuery({ slug }, { staleTime: 5 * 60 * 1000 });
  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 0,
  });
  const {
    data: notes,
    isLoading: notesLoading,
  } = api.portalNotes.getNotes.useQuery({ slug }, { staleTime: 30 * 1000 });

  const utils = api.useUtils();

  // UI state
  const [showEditor, setShowEditor] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // Mutations
  const createNote = api.portalNotes.createNote.useMutation({
    onSuccess: () => {
      void utils.portalNotes.getNotes.invalidate({ slug });
      setShowEditor(false);
    },
  });

  const updateNote = api.portalNotes.updateNote.useMutation({
    onSuccess: () => {
      void utils.portalNotes.getNotes.invalidate({ slug });
      setEditingNoteId(null);
    },
  });

  const deleteNote = api.portalNotes.deleteNote.useMutation({
    onSuccess: () => {
      void utils.portalNotes.getNotes.invalidate({ slug });
      setExpandedNoteId(null);
    },
  });

  const togglePin = api.portalNotes.updateNote.useMutation({
    onSuccess: () => {
      void utils.portalNotes.getNotes.invalidate({ slug });
    },
  });

  // Filter notes by search
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!searchQuery) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n: Note) =>
        n.title.toLowerCase().includes(q) ||
        n.createdByName.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q),
    );
  }, [notes, searchQuery]);

  const isAdmin = profile?.role === "admin";
  const canDelete = (note: Note) =>
    isAdmin || note.createdByAuthId === profile?.authUserId;

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

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Notes</h1>
          <p className="text-gray-400">
            Collaborative notes between you and your team.
          </p>
        </div>
        {!showEditor && editingNoteId === null && (
          <button
            onClick={() => setShowEditor(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: "#D4AF37" }}
          >
            <Plus className="h-4 w-4" />
            New Note
          </button>
        )}
      </div>

      {/* New note editor */}
      {showEditor && (
        <div className="mb-6">
          <NoteEditor
            onSave={(title, content) =>
              createNote.mutate({ slug, title, content })
            }
            onCancel={() => setShowEditor(false)}
            saving={createNote.isPending}
          />
        </div>
      )}

      {/* Search */}
      {(notes?.length ?? 0) > 0 && !showEditor && editingNoteId === null && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search notes..."
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}

      {/* Notes list */}
      {notesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
        </div>
      ) : (notes?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <StickyNote className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No notes yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            Create a note to start collaborating.
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No notes match your search.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-3 text-sm hover:underline"
            style={{ color: "#D4AF37" }}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note: Note) => {
            const isExpanded = expandedNoteId === note.id;
            const isEditing = editingNoteId === note.id;

            if (isEditing) {
              return (
                <div key={note.id}>
                  <NoteEditor
                    initialTitle={note.title}
                    initialContent={note.content}
                    onSave={(title, content) =>
                      updateNote.mutate({ slug, noteId: note.id, title, content })
                    }
                    onCancel={() => setEditingNoteId(null)}
                    saving={updateNote.isPending}
                  />
                </div>
              );
            }

            return (
              <div
                key={note.id}
                className="rounded-lg border border-gray-800 bg-gray-900/50 transition-colors hover:border-gray-700"
              >
                {/* Note header — click to expand */}
                <button
                  onClick={() =>
                    setExpandedNoteId(isExpanded ? null : note.id)
                  }
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-white">
                        {note.title}
                      </span>
                      {note.isPinned && (
                        <Pin
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: "#D4AF37" }}
                        />
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                      <span>{note.createdByName}</span>
                      <span>&middot;</span>
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-800 px-4 py-4">
                    {note.content && note.content !== "<p></p>" ? (
                      <div
                        className="prose prose-invert max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                    ) : (
                      <p className="text-sm italic text-gray-500">
                        No content.
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2 border-t border-gray-800 pt-3">
                      <button
                        onClick={() =>
                          togglePin.mutate({
                            slug,
                            noteId: note.id,
                            isPinned: !note.isPinned,
                          })
                        }
                        className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Pin className="h-3.5 w-3.5" />
                        {note.isPinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setExpandedNoteId(null);
                        }}
                        className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      {canDelete(note) && (
                        <button
                          onClick={() => {
                            if (confirm("Delete this note?")) {
                              deleteNote.mutate({ slug, noteId: note.id });
                            }
                          }}
                          className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ClientPortalLayout>
  );
}
