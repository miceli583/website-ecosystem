"use client";

import { use, useState, useMemo, useCallback } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import {
  SearchFilterBar,
  NoteEditor,
  ProjectGroupHeader,
  ProjectAssignDialog,
  ConfirmDialog,
  type SortOrder,
  type ViewMode,
  type FilterOption,
} from "~/components/portal";
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
  FolderOpen,
  Clock,
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
    { staleTime: 30 * 1000 },
  );
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { enabled: isAdmin, staleTime: 5 * 60 * 1000 },
  );

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
      setDeleteDialog({ open: false, note: null });
      setExpandedNoteId(null);
    },
  });
  const togglePin = api.portalNotes.updateNote.useMutation({
    onSuccess: () => void utils.portalNotes.getNotes.invalidate({ slug }),
  });
  const assignNote = api.portalNotes.updateNote.useMutation({
    onSuccess: () => {
      void utils.portalNotes.getNotes.invalidate({ slug });
      void utils.portal.getProjects.invalidate({ slug });
    },
  });
  const createProject = api.portal.createProject.useMutation({
    onSuccess: () => void utils.portal.getProjects.invalidate({ slug }),
  });

  // UI state
  const [showEditor, setShowEditor] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedProject, setSelectedProject] = useState<number | "all" | "unassigned">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grouped");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; note: Note | null }>({
    open: false,
    note: null,
  });
  const [assignDialog, setAssignDialog] = useState<{ open: boolean; note: Note | null }>({
    open: false,
    note: null,
  });

  const toggleGroup = useCallback((groupName: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  }, []);

  const canDelete = (note: Note) =>
    isAdmin || note.createdByAuthId === profile?.authUserId;

  // Project filters
  const hasUnassigned = (notes ?? []).some((n: Note) => n.projectId === null);
  const projectFilters: FilterOption[] = useMemo(() => {
    if (!notes) return [];
    const projectMap = new Map<number, string>();
    notes.forEach((n: Note) => {
      if (n.project) projectMap.set(n.project.id, n.project.name);
    });
    projects?.forEach((p: { id: number; name: string }) => {
      projectMap.set(p.id, p.name);
    });
    const filters: FilterOption[] = Array.from(projectMap.entries()).map(([id, name]) => ({ id, name }));
    if (hasUnassigned) filters.push({ id: "unassigned", name: "Unassigned" });
    return filters;
  }, [notes, projects, hasUnassigned]);

  // Filter + sort notes
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    return notes.filter((n: Note) => {
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
  }, [notes, searchQuery, selectedProject]);

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

    return (
      <div
        key={note.id}
        className="rounded-lg border transition-all"
        style={{
          borderColor: isEditing
            ? "rgba(212, 175, 55, 0.35)"
            : isExpanded
              ? "rgba(212, 175, 55, 0.3)"
              : "rgba(212, 175, 55, 0.12)",
          backgroundColor: isEditing
            ? "rgba(212, 175, 55, 0.04)"
            : isExpanded
              ? "rgba(212, 175, 55, 0.03)"
              : "transparent",
        }}
      >
        {isEditing ? (
          /* Inline editor — stays within the card */
          <div className="p-1">
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
        ) : (
          <>
            {/* Note header — click to expand */}
            <button
              onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
            >
              {isExpanded ? (
                <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              ) : (
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
              )}

              <div className="min-w-0 flex-1">
                {/* Title row */}
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-white">{note.title}</span>
                  {note.isPinned && (
                    <Pin className="h-3.5 w-3.5 shrink-0" style={{ color: "#D4AF37" }} />
                  )}
                </div>

                {/* Content preview (collapsed only) */}
                {!isExpanded && preview && preview !== "No content." && (
                  <p className="mt-1 truncate text-sm text-gray-500">{preview}</p>
                )}

                {/* Meta row: author badge + timestamp + edited + project */}
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {/* Author initials badge */}
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${authorColor(note.createdByName)}`}
                  >
                    {getInitials(note.createdByName)}
                  </span>
                  <span>{note.createdByName}</span>
                  <span className="text-gray-700">&middot;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {relativeTime(note.updatedAt)}
                  </span>
                  {edited && (
                    <span className="italic text-gray-600">(edited)</span>
                  )}
                  <span className="text-gray-700">&middot;</span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <FolderOpen className="h-3 w-3" />
                    {note.project?.name ?? "Unassigned"}
                  </span>
                </div>
              </div>
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div
                className="border-t px-4 py-4"
                style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
              >
                {note.content && note.content !== "<p></p>" ? (
                  <div
                    className="prose prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                ) : (
                  <p className="text-sm italic text-gray-500">No content.</p>
                )}

                {/* Actions */}
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
                  {isAdmin && (
                    <button
                      onClick={() => setAssignDialog({ open: true, note })}
                      className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      Assign
                    </button>
                  )}
                  {canDelete(note) && (
                    <button
                      onClick={() => setDeleteDialog({ open: true, note })}
                      className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
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

      {/* Search + Filter Bar */}
      {(notes?.length ?? 0) > 0 && !showEditor && editingNoteId === null && (
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
          onCreateProject={(name) => createProject.mutate({ slug, name })}
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
