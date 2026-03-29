"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";
import {
  SearchFilterBar,
  StatusTabs,
  NoteEditor,
  ProjectAssignDialog,
  ConfirmDialog,
  AdminActionMenu,
  useTabFilters,
  type AdminAction,
  type FilterOption,
} from "~/components/portal";
import { SortHeader, type SortLevel } from "~/components/crm/sort-header";
import { RichTextPreview } from "~/components/portal/rich-text-preview";
import {
  StickyNote,
  Loader2,
  AlertCircle,
  Plus,
  Pin,
  Pencil,
  Trash2,
  Search,
  FolderOpen,
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type Note = RouterOutputs["portalNotes"]["getNotes"][number];

const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

// ── Helpers ──────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
  });
}

function wasEdited(note: Note): boolean {
  const created = new Date(note.createdAt).getTime();
  const updated = new Date(note.updatedAt).getTime();
  return updated - created > 60_000;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]![0]!.toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

// ── Page Component ───────────────────────────────────────

export default function PortalNotesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const utils = api.useUtils();

  // Data queries
  const {
    data: client,
    isLoading,
    error,
  } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 }
  );
  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  const { data: notes, isLoading: notesLoading } =
    api.portalNotes.getNotes.useQuery({ slug }, { staleTime: 5 * 60 * 1000 });
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin, staleTime: 5 * 60 * 1000 }
  );

  // Mutations with optimistic updates
  const createNote = api.portalNotes.createNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData(
        { slug },
        (old: Note[] | undefined) => {
          if (!old) return old;
          return [
            {
              id: -Date.now(),
              clientId: client?.id ?? 0,
              projectId: input.projectId ?? null,
              createdByAuthId: profile?.authUserId ?? "",
              createdByName: profile?.name ?? "You",
              title: input.title,
              content: input.content ?? "",
              isPinned: false,
              isArchived: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              project: null,
            } as Note,
            ...old,
          ];
        }
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to create note");
    },
    onSuccess: () => {
      toast.success("Note created");
      setShowEditor(false);
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const deleteNote = api.portalNotes.deleteNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) =>
        old?.filter((n) => n.id !== input.noteId)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to delete note");
    },
    onSuccess: () => {
      toast.success("Note deleted");
      setDeleteDialog({ open: false, note: null });
      setExpandedNoteId(null);
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const togglePin = api.portalNotes.updateNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData(
        { slug },
        (old: Note[] | undefined) => {
          if (!old) return old;
          const updated = old.map((n) =>
            n.id === input.noteId
              ? { ...n, isPinned: input.isPinned ?? n.isPinned }
              : n
          );
          return updated.sort(
            (a, b) =>
              (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) ||
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to update pin");
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isPinned ? "Note pinned" : "Note unpinned");
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const archiveNote = api.portalNotes.updateNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) =>
        old?.map((n) =>
          n.id === input.noteId
            ? { ...n, isArchived: input.isArchived ?? n.isArchived }
            : n
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to archive note");
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isArchived ? "Note archived" : "Note restored");
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const assignNote = api.portalNotes.updateNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) =>
        old?.map((n) =>
          n.id === input.noteId
            ? { ...n, projectId: input.projectId ?? n.projectId }
            : n
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to assign project");
    },
    onSuccess: () => {
      toast.success("Project assigned");
      void utils.portal.getProjects.invalidate({ slug });
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const createProject = api.portal.createProject.useMutation({
    onSuccess: () => {
      toast.success("Project created");
      void utils.portal.getProjects.invalidate({ slug });
    },
  });

  // Persisted filter state
  const { getState, setState: persistState } = useTabFilters("notes");
  const saved = getState();

  // UI state
  const [showEditor, setShowEditor] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "archived">(
    saved.activeTab ?? "active"
  );
  const [searchQuery, setSearchQuery] = useState(saved.searchQuery);
  const [selectedProject, setSelectedProject] = useState<
    number | "all" | "unassigned"
  >(saved.selectedProject as number | "all" | "unassigned");
  const [sorts, setSorts] = useState<SortLevel[]>(
    saved.sorts ?? [{ field: "updatedAt", order: "desc" }]
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    note: Note | null;
  }>({
    open: false,
    note: null,
  });
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    note: Note | null;
  }>({
    open: false,
    note: null,
  });

  useEffect(() => {
    persistState({
      searchQuery,
      selectedProject,
      activeTab,
      sorts,
    });
  }, [searchQuery, selectedProject, activeTab, sorts, persistState]);

  const canDelete = useCallback(
    (note: Note) => isAdmin || note.createdByAuthId === profile?.authUserId,
    [isAdmin, profile?.authUserId]
  );

  // Split active/archived
  const activeNotes = useMemo(
    () => (notes ?? []).filter((n: Note) => !n.isArchived),
    [notes]
  );
  const archivedNotes = useMemo(
    () => (notes ?? []).filter((n: Note) => n.isArchived),
    [notes]
  );
  const currentNotes = activeTab === "active" ? activeNotes : archivedNotes;

  // Project filters
  const hasUnassigned = currentNotes.some((n: Note) => n.projectId === null);
  const projectFilters: FilterOption[] = useMemo(() => {
    if (!currentNotes.length) return [];
    const projectMap = new Map<number, string>();
    currentNotes.forEach((n: Note) => {
      if (n.project) projectMap.set(n.project.id, n.project.name);
    });
    projects?.forEach((p: { id: number; name: string }) => {
      projectMap.set(p.id, p.name);
    });
    const filters: FilterOption[] = Array.from(projectMap.entries()).map(
      ([id, name]) => ({ id, name })
    );
    if (hasUnassigned) filters.push({ id: "unassigned", name: "Unassigned" });
    return filters;
  }, [currentNotes, projects, hasUnassigned]);

  // Filter
  const filteredNotes = useMemo(() => {
    return currentNotes.filter((n: Note) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = stripHtml(n.content).toLowerCase().includes(q);
        const matchAuthor = n.createdByName.toLowerCase().includes(q);
        const matchProject = n.project?.name.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchAuthor && !matchProject)
          return false;
      }
      if (selectedProject === "unassigned") return n.projectId === null;
      if (selectedProject !== "all" && n.projectId !== selectedProject)
        return false;
      return true;
    });
  }, [currentNotes, searchQuery, selectedProject]);

  // Multi-column sort (pinned always first)
  const handleSort = (field: string) => {
    setSorts((prev) => {
      const idx = prev.findIndex((s) => s.field === field);
      if (idx === -1) return [...prev, { field, order: "asc" as const }];
      if (prev[idx]!.order === "asc")
        return prev.map((s, i) =>
          i === idx ? { ...s, order: "desc" as const } : s
        );
      return prev.filter((_, i) => i !== idx);
    });
  };

  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      // Pinned always first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (!sorts.length) {
        // Default: newest updated first
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      for (const { field, order } of sorts) {
        let cmp = 0;
        const dir = order === "asc" ? 1 : -1;
        switch (field) {
          case "title":
            cmp = a.title.localeCompare(b.title);
            break;
          case "author":
            cmp = a.createdByName.localeCompare(b.createdByName);
            break;
          case "project":
            cmp = (a.project?.name || "zzz").localeCompare(
              b.project?.name || "zzz"
            );
            break;
          case "updatedAt":
            cmp =
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
        }
        if (cmp !== 0) return cmp * dir;
      }
      return 0;
    });
  }, [filteredNotes, sorts]);

  // Admin actions for a note
  const getNoteActions = useCallback(
    (note: Note): AdminAction[] => [
      ...(isAdmin
        ? [
            {
              label: note.isPinned ? "Unpin" : "Pin",
              icon: <Pin className="h-4 w-4" />,
              onClick: () =>
                togglePin.mutate({
                  slug,
                  noteId: note.id,
                  isPinned: !note.isPinned,
                }),
            },
          ]
        : []),
      {
        label: "Edit",
        icon: <Pencil className="h-4 w-4" />,
        onClick: () => {
          // Navigate to detail page in edit mode via query param
          window.location.href = `/portal/${slug}/notes/${note.id}?edit=1`;
        },
      },
      ...(isAdmin
        ? [
            {
              label: note.isArchived ? "Restore" : "Archive",
              icon: note.isArchived ? (
                <ArchiveRestore className="h-4 w-4" />
              ) : (
                <Archive className="h-4 w-4" />
              ),
              onClick: () =>
                archiveNote.mutate({
                  slug,
                  noteId: note.id,
                  isArchived: !note.isArchived,
                }),
            },
            {
              label: "Assign to Project",
              icon: <FolderOpen className="h-4 w-4" />,
              onClick: () => setAssignDialog({ open: true, note }),
            },
          ]
        : []),
      ...(canDelete(note)
        ? [
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => setDeleteDialog({ open: true, note }),
              variant: "danger" as const,
            },
          ]
        : []),
    ],
    [slug, togglePin, archiveNote, canDelete, isAdmin]
  );

  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all";

  // Column count for colSpan
  const colCount = isAdmin ? 6 : 5;

  // ── Loading / Error states ──

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
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
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Notes</h1>
          <p className="text-gray-400">
            Collaborative notes between you and your team.
          </p>
        </div>
        {!showEditor && (
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

      {/* Active / Archived tabs */}
      {isAdmin && (notes?.length ?? 0) > 0 && !showEditor && (
        <StatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeNotes.length}
          archivedCount={archivedNotes.length}
        />
      )}

      {/* Search + Filter Bar */}
      {currentNotes.length > 0 && !showEditor && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search notes..."
          filterOptions={projectFilters}
          selectedFilter={selectedProject}
          onFilterChange={(id) =>
            setSelectedProject(id as number | "all" | "unassigned")
          }
          filterLabel="Project"
        />
      )}

      {/* Notes table */}
      {notesLoading ? (
        <div className="overflow-x-auto rounded-lg border" style={borderStyle}>
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b px-4 py-4"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                <div className="h-4 w-4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
                <div className="h-4 flex-1 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      ) : (notes?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <StickyNote className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No notes yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            Create a note to start collaborating.
          </p>
        </div>
      ) : !sortedNotes.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-gray-500">
            {activeTab === "archived"
              ? "No archived notes."
              : "No notes match your filters."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedProject("all");
              }}
              className="mt-3 text-sm text-[#D4AF37] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-lg border bg-white/5"
          style={borderStyle}
        >
          <table className="w-full text-left text-sm text-gray-400">
            <thead>
              <tr
                className="border-b text-xs font-medium tracking-wider text-gray-500 uppercase"
                style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <th className="w-8 px-3 py-3" />
                <SortHeader
                  field="title"
                  label="Title"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="author"
                  label="Author"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="project"
                  label="Project"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <SortHeader
                  field="updatedAt"
                  label="Updated"
                  sorts={sorts}
                  onSort={handleSort}
                />
                <th className="w-12 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {sortedNotes.map((note) => {
                const isExpanded = expandedNoteId === note.id;
                const edited = wasEdited(note);

                return (
                  <Fragment key={note.id}>
                    <tr
                      className="cursor-pointer border-b transition-colors hover:bg-white/5"
                      style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                      onClick={() =>
                        setExpandedNoteId(isExpanded ? null : note.id)
                      }
                    >
                      {/* Pin */}
                      <td className="px-3 py-3">
                        {note.isPinned ? (
                          <Pin
                            className="h-3.5 w-3.5"
                            style={{ color: "#D4AF37" }}
                          />
                        ) : isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                        )}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/portal/${slug}/notes/${note.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-white transition-colors hover:text-[#D4AF37]"
                        >
                          {note.title}
                        </Link>
                      </td>

                      {/* Author */}
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[10px] font-bold text-[#D4AF37]">
                            {getInitials(note.createdByName)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {note.createdByName}
                          </span>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span className="text-xs text-gray-500">
                          {note.project?.name ?? "Unassigned"}
                        </span>
                      </td>

                      {/* Updated */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">
                          {relativeTime(note.updatedAt)}
                          {edited && (
                            <span className="ml-1 text-gray-600 italic">
                              (edited)
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-2 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AdminActionMenu actions={getNoteActions(note)} />
                      </td>
                    </tr>

                    {/* Expanded preview row */}
                    {isExpanded && (
                      <tr>
                        <td
                          colSpan={colCount}
                          className="border-b bg-white/[0.02] px-4 pt-2 pb-4"
                          style={{
                            borderColor: "rgba(212, 175, 55, 0.05)",
                          }}
                        >
                          <div className="pl-7">
                            <RichTextPreview
                              html={note.content}
                              lineClamp={4}
                              className="text-gray-400"
                            />
                            <div className="mt-3">
                              <Link
                                href={`/portal/${slug}/notes/${note.id}`}
                                className="text-xs font-medium transition-colors hover:underline"
                                style={{ color: "#D4AF37" }}
                              >
                                View full note &rarr;
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Assignment Dialog */}
      {isAdmin && (
        <ProjectAssignDialog
          open={assignDialog.open}
          onOpenChange={(open) =>
            setAssignDialog({ open, note: open ? assignDialog.note : null })
          }
          currentProjectId={assignDialog.note?.projectId ?? null}
          projects={projects ?? []}
          onAssign={(projectId) => {
            if (!assignDialog.note) return;
            assignNote.mutate({
              slug,
              noteId: assignDialog.note.id,
              projectId,
            });
          }}
          onCreateProject={(name) => createProject.mutateAsync({ slug, name })}
          isLoading={assignNote.isPending || createProject.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, note: open ? deleteDialog.note : null })
        }
        title="Delete Note"
        description={`Are you sure you want to permanently delete "${deleteDialog.note?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() =>
          deleteDialog.note &&
          deleteNote.mutate({ slug, noteId: deleteDialog.note.id })
        }
        isLoading={deleteNote.isPending}
      />
    </>
  );
}

// Need Fragment for key on adjacent table rows
import { Fragment } from "react";
