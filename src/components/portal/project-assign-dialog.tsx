"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { X, FolderOpen, Plus, Loader2, Search } from "lucide-react";

interface ProjectAssignDialogProps {
  currentProjectId: number | null;
  projects: Array<{ id: number; name: string }>;
  onAssign: (projectId: number | null) => void;
  onCreateProject: (name: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

export function ProjectAssignDialog({
  currentProjectId,
  projects,
  onAssign,
  onCreateProject,
  open,
  onOpenChange,
  isLoading = false,
}: ProjectAssignDialogProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Reset search when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setShowCreate(false);
      setNewProjectName("");
      // Auto-focus search when there are enough projects
      if (projects.length > 5) {
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    }
  }, [open, projects.length]);

  useEffect(() => {
    if (showCreate && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCreate]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [open, onOpenChange]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter((p) => p.name.toLowerCase().includes(query));
  }, [projects, searchQuery]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-xl border p-6"
        style={{
          borderColor: "rgba(212, 175, 55, 0.2)",
          backgroundColor: "rgba(10, 10, 10, 0.98)",
        }}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="mb-4 text-lg font-bold text-white">Assign to Project</h3>

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/50"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
          />
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {/* Unassigned option — hidden when searching */}
          {!searchQuery && (
            <button
              onClick={() => { onAssign(null); onOpenChange(false); }}
              disabled={isLoading}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                currentProjectId === null
                  ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FolderOpen className="h-4 w-4 flex-shrink-0" />
              Unassigned
            </button>
          )}

          {/* Filtered projects */}
          {filteredProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => { onAssign(project.id); onOpenChange(false); }}
              disabled={isLoading}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                currentProjectId === project.id
                  ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FolderOpen className="h-4 w-4 flex-shrink-0" />
              {project.name}
            </button>
          ))}

          {/* No results */}
          {searchQuery && filteredProjects.length === 0 && (
            <p className="px-3 py-2.5 text-sm text-gray-600">No projects match &ldquo;{searchQuery}&rdquo;</p>
          )}
        </div>

        {/* Divider */}
        <div className="my-2 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

        {/* Create new project */}
        {showCreate ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newProjectName.trim()) {
                  onCreateProject(newProjectName.trim());
                  setNewProjectName("");
                  setShowCreate(false);
                }
              }}
              placeholder="Project name..."
              className="flex-1 rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/50"
              style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
            />
            <button
              onClick={() => {
                if (newProjectName.trim()) {
                  onCreateProject(newProjectName.trim());
                  setNewProjectName("");
                  setShowCreate(false);
                }
              }}
              disabled={!newProjectName.trim() || isLoading}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)" }}
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-500 transition-colors hover:bg-white/5 hover:text-[#D4AF37]"
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            Create new project
          </button>
        )}
      </div>
    </div>
  );
}
