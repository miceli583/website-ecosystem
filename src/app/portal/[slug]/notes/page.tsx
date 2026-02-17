"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api, type RouterOutputs } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import {
  SearchFilterBar,
  StatusTabs,
  NoteEditor,
  ProjectGroupHeader,
  ProjectAssignDialog,
  ConfirmDialog,
  AdminActionMenu,
  useTabFilters,
  NoteItemSkeletonGroup,
  type SortOrder,
  type AdminAction,
  type ViewMode,
  type FilterOption,
} from "~/components/portal";
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
  ChevronsUp,
} from "lucide-react";

type Note = RouterOutputs["portalNotes"]["getNotes"][number];

// ── Helpers ──────────────────────────────────────────────

/** Strip HTML tags and return a plain-text preview */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Truncate to a max character count at a word boundary */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max);
  const lastSpace = trimmed.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? trimmed.slice(0, lastSpace) : trimmed) + "…";
}

/** Relative timestamp: "just now", "5m ago", "3h ago", "2d ago", "Jan 15" */
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

/** Check if a note was edited after creation (> 60s difference) */
function wasEdited(note: Note): boolean {
  const created = new Date(note.createdAt).getTime();
  const updated = new Date(note.updatedAt).getTime();
  return updated - created > 60_000;
}

/** Get initials from a name (first + last) */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]![0]!.toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Gold badge style for all author initials */
function authorColor(_name: string): string {
  return "bg-[#D4AF37]/20 text-[#D4AF37]";
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
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 },
  );
  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  const { data: notes, isLoading: notesLoading } = api.portalNotes.getNotes.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 },
  );
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin, staleTime: 5 * 60 * 1000 },
  );

  // Mutations with optimistic updates
  const createNote = api.portalNotes.createNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) => {
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
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to create note");
    },
    onSuccess: () => {
      toast.success("Note created");
      setShowEditor(false);
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const updateNote = api.portalNotes.updateNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) =>
        old?.map((n) =>
          n.id === input.noteId
            ? {
                ...n,
                ...(input.title !== undefined && { title: input.title }),
                ...(input.content !== undefined && { content: input.content }),
                updatedAt: new Date(),
              }
            : n,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to update note");
    },
    onSuccess: () => {
      toast.success("Note updated");
      setEditingNoteId(null);
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const deleteNote = api.portalNotes.deleteNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) =>
        old?.filter((n) => n.id !== input.noteId),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.portalNotes.getNotes.setData({ slug }, context.previous);
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
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) => {
        if (!old) return old;
        const updated = old.map((n) =>
          n.id === input.noteId ? { ...n, isPinned: input.isPinned ?? n.isPinned } : n,
        );
        return updated.sort(
          (a, b) =>
            (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) ||
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to update pin");
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isPinned ? "Note pinned" : "Note unpinned");
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const assignNote = api.portalNotes.updateNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) =>
        old?.map((n) =>
          n.id === input.noteId ? { ...n, projectId: input.projectId ?? n.projectId } : n,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.portalNotes.getNotes.setData({ slug }, context.previous);
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
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "archived">(saved.activeTab ?? "active");
  const [searchQuery, setSearchQuery] = useState(saved.searchQuery);
  const [sortOrder, setSortOrder] = useState<SortOrder>(saved.sortOrder);
  const [selectedProject, setSelectedProject] = useState<number | "all" | "unassigned">(
    saved.selectedProject as number | "all" | "unassigned",
  );
  const [viewMode, setViewMode] = useState<ViewMode>(saved.viewMode);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(saved.collapsedGroups),
  );
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; note: Note | null }>({
    open: false,
    note: null,
  });
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; note: Note | null }>({
    open: false,
    note: null,
  });

  // Persist filter state on change
  useEffect(() => {
    persistState({
      searchQuery,
      sortOrder,
      selectedProject,
      viewMode,
      collapsedGroups: Array.from(collapsedGroups),
      activeTab,
    });
  }, [searchQuery, sortOrder, selectedProject, viewMode, collapsedGroups, activeTab, persistState]);

  const archiveNote = api.portalNotes.updateNote.useMutation({
    onMutate: async (input) => {
      await utils.portalNotes.getNotes.cancel({ slug });
      const previous = utils.portalNotes.getNotes.getData({ slug });
      utils.portalNotes.getNotes.setData({ slug }, (old: Note[] | undefined) =>
        old?.map((n) =>
          n.id === input.noteId ? { ...n, isArchived: input.isArchived ?? n.isArchived } : n,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) utils.portalNotes.getNotes.setData({ slug }, context.previous);
      toast.error("Failed to archive note");
    },
    onSuccess: (_, variables) => {
      toast.success(variables.isArchived ? "Note archived" : "Note restored");
    },
    onSettled: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });

  const toggleGroup = useCallback((groupName: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  }, []);

  const canDelete = useCallback(
    (note: Note) => isAdmin || note.createdByAuthId === profile?.authUserId,
    [isAdmin, profile?.authUserId],
  );

  // Split active/archived
  const activeNotes = useMemo(() => (notes ?? []).filter((n: Note) => !n.isArchived), [notes]);
  const archivedNotes = useMemo(() => (notes ?? []).filter((n: Note) => n.isArchived), [notes]);
  const currentNotes = activeTab === "active" ? activeNotes : archivedNotes;

  // Project filters (from current tab's notes)
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
    const filters: FilterOption[] = Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
    if (hasUnassigned) filters.push({ id: "unassigned", name: "Unassigned" });
    return filters;
  }, [currentNotes, projects, hasUnassigned]);

  // Filter + sort notes
  const filteredNotes = useMemo(() => {
    return currentNotes.filter((n: Note) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchContent = n.content.toLowerCase().includes(q);
        const matchAuthor = n.createdByName.toLowerCase().includes(q);
        const matchProject = n.project?.name.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchAuthor && !matchProject) return false;
      }
      if (selectedProject === "unassigned") return n.projectId === null;
      if (selectedProject !== "all" && n.projectId !== selectedProject) return false;
      return true;
    });
  }, [currentNotes, searchQuery, selectedProject]);

  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      // Pinned always first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (sortOrder === "name") return a.title.localeCompare(b.title);
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [filteredNotes, sortOrder]);

  // Group by project
  const groupedNotes = useMemo(() => {
    const groups = new Map<string, Note[]>();
    for (const note of sortedNotes) {
      const key = note.project?.name ?? "Unassigned";
      const group = groups.get(key) ?? [];
      group.push(note);
      groups.set(key, group);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });
  }, [sortedNotes]);

  const showGrouping =
    viewMode === "grouped" &&
    selectedProject === "all" &&
    (groupedNotes.length > 1 ||
      (groupedNotes.length === 1 && groupedNotes[0]![0] !== "Unassigned"));

  const handleExpandAll = useCallback(() => setCollapsedGroups(new Set()), []);
  const handleCollapseAll = useCallback(() => {
    setCollapsedGroups(new Set(groupedNotes.map(([name]) => name)));
  }, [groupedNotes]);

  const hasActiveFilters = Boolean(searchQuery) || selectedProject !== "all" || sortOrder !== "newest";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProject("all");
    setSortOrder("newest");
  };

  // Admin actions for a note (three-dot menu) - must be before early returns
  const getNoteActions = useCallback(
    (note: Note): AdminAction[] => [
      {
        label: note.isPinned ? "Unpin" : "Pin",
        icon: <Pin className="h-4 w-4" />,
        onClick: () =>
          togglePin.mutate({ slug, noteId: note.id, isPinned: !note.isPinned }),
      },
      {
        label: "Edit",
        icon: <Pencil className="h-4 w-4" />,
        onClick: () => {
          setEditingNoteId(note.id);
          setExpandedNoteId(null);
        },
      },
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
    [slug, togglePin, archiveNote, canDelete],
  );

  // ── Loading / Error states ──

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

  // ── Note card renderer ──

  function renderNote(note: Note) {
    const isExpanded = expandedNoteId === note.id;
    const isEditing = editingNoteId === note.id;
    const preview = truncate(stripHtml(note.content), 120);
    const edited = wasEdited(note);

    if (isEditing) {
      return (
        <div
          key={note.id}
          className="rounded-md border p-1"
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
            onCancel={() => setEditingNoteId(null)}
            saving={updateNote.isPending}
            compact
          />
        </div>
      );
    }

    return (
      <div
        key={note.id}
        className="rounded-md border bg-white/5 transition-colors hover:bg-white/10"
        style={{
          borderColor: isExpanded
            ? "rgba(212, 175, 55, 0.3)"
            : "rgba(212, 175, 55, 0.15)",
        }}
      >
        {/* Header row — matches ListItem layout */}
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <button
            onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <div className="flex-shrink-0" style={{ color: "#D4AF37" }}>
              <StickyNote className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-white">{note.title}</p>
                {note.isPinned && (
                  <Pin className="h-3.5 w-3.5 shrink-0" style={{ color: "#D4AF37" }} />
                )}
              </div>
              {!isExpanded && preview && preview !== "No content." && (
                <p className="truncate text-sm text-gray-500">{preview}</p>
              )}
            </div>
          </button>
          <div className="flex flex-shrink-0 items-center gap-4 text-sm text-gray-500">
            <span className="hidden sm:inline">{note.project?.name ?? "Unassigned"}</span>
            <span className="flex items-center gap-1 text-xs">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${authorColor(note.createdByName)}`}
              >
                {getInitials(note.createdByName)}
              </span>
            </span>
            <span className="text-xs">
              {relativeTime(note.updatedAt)}
              {edited && <span className="ml-1 italic text-gray-600">(edited)</span>}
            </span>
            {isAdmin && <AdminActionMenu actions={getNoteActions(note)} />}
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div
            className="border-t"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            {/* Collapse indicator */}
            <button
              onClick={() => setExpandedNoteId(null)}
              className="flex w-full items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 transition-colors hover:bg-white/5 hover:text-gray-300"
            >
              <ChevronsUp className="h-3.5 w-3.5" />
              <span>Collapse</span>
            </button>

            <div className="px-4 pb-4">
            {note.content && note.content !== "<p></p>" ? (
              <div
                className="prose prose-invert max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            ) : (
              <p className="text-sm italic text-gray-500">No content.</p>
            )}

            {/* Inline actions — pin + edit for quick access */}
            <div
              className="mt-4 flex items-center gap-2 border-t pt-3"
              style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
            >
              <button
                onClick={() =>
                  togglePin.mutate({
                    slug,
                    noteId: note.id,
                    isPinned: !note.isPinned,
                  })
                }
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors hover:bg-white/5 ${
                  note.isPinned
                    ? "text-[#D4AF37]"
                    : "text-gray-400 hover:text-white"
                }`}
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
            </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Render ──

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

      {/* Active / Archived tabs */}
      {isAdmin && (notes?.length ?? 0) > 0 && !showEditor && editingNoteId === null && (
        <StatusTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeNotes.length}
          archivedCount={archivedNotes.length}
        />
      )}

      {/* Search + Filter Bar */}
      {currentNotes.length > 0 && !showEditor && editingNoteId === null && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search notes..."
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          filterOptions={projectFilters}
          selectedFilter={selectedProject}
          onFilterChange={(id) => setSelectedProject(id as number | "all" | "unassigned")}
          filterLabel="Project"
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          collapseState={
            collapsedGroups.size === 0
              ? "all-expanded"
              : collapsedGroups.size >= groupedNotes.length
                ? "all-collapsed"
                : "mixed"
          }
        />
      )}

      {/* Notes list */}
      {notesLoading ? (
        <NoteItemSkeletonGroup count={5} />
      ) : (notes?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <StickyNote className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No notes yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            Create a note to start collaborating.
          </p>
        </div>
      ) : currentNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Archive className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">
            {activeTab === "archived" ? "No archived notes." : "No active notes."}
          </p>
        </div>
      ) : sortedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No notes match your filters.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-sm hover:underline"
              style={{ color: "#D4AF37" }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {showGrouping
            ? groupedNotes.map(([groupName, groupNotes]) => (
                <div key={groupName}>
                  <ProjectGroupHeader
                    projectName={groupName}
                    itemCount={groupNotes.length}
                    collapsed={collapsedGroups.has(groupName)}
                    onToggle={() => toggleGroup(groupName)}
                  />
                  {!collapsedGroups.has(groupName) && (
                    <div className="space-y-2">
                      {groupNotes.map((note) => renderNote(note))}
                    </div>
                  )}
                </div>
              ))
            : sortedNotes.map((note) => renderNote(note))}
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
            assignNote.mutate({ slug, noteId: assignDialog.note.id, projectId });
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
    </ClientPortalLayout>
  );
}
