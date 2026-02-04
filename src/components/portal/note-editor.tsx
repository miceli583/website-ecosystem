"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Loader2,
} from "lucide-react";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  saving?: boolean;
  /** Compact mode for inline editing within a note card */
  compact?: boolean;
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded p-1.5 transition-colors ${
        active
          ? "bg-[#D4AF37]/20 text-[#D4AF37]"
          : "text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none ${compact ? "min-h-[120px]" : "min-h-[200px]"} px-4 py-3 focus:outline-none`,
      },
    },
  });

  const handleSave = useCallback(() => {
    if (!title.trim()) return;
    onSave(title.trim(), editor?.getHTML() ?? "");
  }, [title, editor, onSave]);

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

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b px-3 py-1.5" style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
          title={`Bold (${modKey}B)`}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          title={`Italic (${modKey}I)`}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          active={editor?.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCode().run()}
          active={editor?.isActive("code")}
          title="Inline code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
        <ToolbarButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor?.isActive("heading", { level: 2 })}
          title="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
        <ToolbarButton
          onClick={() => editor?.chain().focus().undo().run()}
          title={`Undo (${modKey}Z)`}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().redo().run()}
          title={`Redo (${modKey}${isMac ? "Shift+Z" : "Y"})`}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <style jsx global>{`
        .ProseMirror {
          color: white;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #6b7280;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        .ProseMirror blockquote {
          border-left: 3px solid rgba(212, 175, 55, 0.4);
          padding-left: 1em;
          margin-left: 0;
          color: #9ca3af;
          font-style: italic;
        }
        .ProseMirror code {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 0.25em;
          padding: 0.15em 0.35em;
          font-size: 0.9em;
          color: #D4AF37;
        }
        .ProseMirror s {
          text-decoration: line-through;
          color: #6b7280;
        }
      `}</style>
      <EditorContent editor={editor} />

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
