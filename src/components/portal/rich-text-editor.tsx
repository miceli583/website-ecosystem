"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef as useReactRef,
} from "react";
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
} from "lucide-react";

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

export interface RichTextEditorRef {
  getHTML: () => string;
}

interface RichTextEditorProps {
  initialContent?: string;
  placeholder?: string;
  minHeight?: string;
  onChange?: (html: string) => void;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(function RichTextEditor(
  {
    initialContent = "",
    placeholder = "Start writing...",
    minHeight = "200px",
    onChange,
  },
  ref
) {
  const isMac =
    typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent);
  const modKey = isMac ? "\u2318" : "Ctrl+";

  // Track whether we're programmatically setting content to avoid loops
  const settingContent = useReactRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `tiptap-content prose prose-invert max-w-none px-4 py-3 focus:outline-none`,
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor: e }) => {
      if (!settingContent.current) {
        onChange?.(e.getHTML());
      }
    },
  });

  // Sync content when initialContent changes after mount (e.g. switching between notes)
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentHTML = editor.getHTML();
      if (initialContent !== currentHTML) {
        settingContent.current = true;
        editor.commands.setContent(initialContent || "");
        settingContent.current = false;
      }
    }
  }, [editor, initialContent]);

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() ?? "",
  }));

  return (
    <>
      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 border-b px-3 py-1.5"
        style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
      >
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
        <div
          className="mx-1 h-5 w-px"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        />
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
        <div
          className="mx-1 h-5 w-px"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        />
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

      {/* Editor — styles via .tiptap-content class in globals.css */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #6b7280;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <EditorContent editor={editor} />
    </>
  );
});
