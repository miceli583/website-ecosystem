"use client";

interface RichTextPreviewProps {
  html: string;
  /** Truncate to N lines (uses CSS line-clamp) */
  lineClamp?: number;
  className?: string;
}

/**
 * Read-only renderer for TipTap HTML content.
 * Uses the shared .tiptap-content styles from globals.css so formatting
 * (bold, lists, blockquotes, code, etc.) renders identically to the editor.
 */
export function RichTextPreview({
  html,
  lineClamp,
  className = "",
}: RichTextPreviewProps) {
  if (!html || html === "<p></p>") {
    return (
      <p className={`text-sm text-gray-600 italic ${className}`}>No content</p>
    );
  }

  return (
    <div
      className={`tiptap-content text-sm ${lineClamp ? `line-clamp-${lineClamp}` : ""} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
