"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { RichTextEditor, type RichTextEditorRef } from "./rich-text-editor";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  saving?: boolean;
  /** Compact mode for inline editing within a note card */
  compact?: boolean;
}

export function NoteEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
  onCancel,
  saving = false,
  compact = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const editorRef = useRef<RichTextEditorRef>(null);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;
    onSave(title.trim(), editorRef.current?.getHTML() ?? "");
  }, [title, onSave]);

  // Keyboard shortcuts: Cmd+Enter to save, Escape to cancel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleSave, onCancel]);

  const isEditing = Boolean(initialTitle);
  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent);
  const modKey = isMac ? "\u2318" : "Ctrl+";

  return (
    <div
      className={`rounded-lg border transition-all ${compact ? "" : "shadow-lg shadow-black/20"}`}
      style={{ borderColor: "rgba(212, 175, 55, 0.2)", backgroundColor: "rgba(10, 10, 10, 0.95)" }}
    >
      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className={`w-full border-b bg-transparent px-4 text-white placeholder-gray-500 focus:outline-none ${compact ? "py-2.5 text-base font-medium" : "py-3 text-lg font-semibold"}`}
        style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
        autoFocus
      />

      <RichTextEditor
        ref={editorRef}
        initialContent={initialContent}
        placeholder="Start writing..."
        minHeight={compact ? "120px" : "200px"}
      />

      {/* Actions */}
      <div className="flex items-center justify-between border-t px-4 py-2.5" style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}>
        <span className="text-xs text-gray-600">
          {modKey}Enter to save &middot; Esc to cancel
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:text-white"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium text-black transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#D4AF37" }}
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
