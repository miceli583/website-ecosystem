"use client";

import { useState, useEffect, useRef } from "react";
import { Tag, X, Plus } from "lucide-react";
import { api } from "~/trpc/react";
import { borderStyle } from "./styles";

export function TagPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const { data: suggestions = [] } = api.crm.getTagOptions.useQuery();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter(
    (t) =>
      !selected.includes(t) && t.toLowerCase().includes(input.toLowerCase())
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter((t) => t !== tag));
  };

  return (
    <div ref={ref} className="relative">
      <div
        className="flex min-h-[38px] flex-wrap gap-1.5 rounded-lg border bg-white/5 px-2 py-1.5"
        style={borderStyle}
        onClick={() => setOpen(true)}
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs"
            style={{
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              color: "#D4AF37",
            }}
          >
            <Tag className="h-2.5 w-2.5" />
            {tag}
            <button
              aria-label="Remove tag"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-0.5 hover:text-white"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          className="min-w-[80px] flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
          placeholder={
            selected.length === 0 ? "Search or add tags..." : "Add..."
          }
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              addTag(input);
            }
            if (e.key === "Backspace" && !input && selected.length > 0) {
              removeTag(selected[selected.length - 1]!);
            }
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (filtered.length > 0 || input.trim()) && (
        <div
          className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {filtered.map((tag) => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Tag className="h-3 w-3 text-gray-500" />
              {tag}
            </button>
          ))}
          {input.trim() && !suggestions.includes(input.trim()) && (
            <button
              onClick={() => addTag(input)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
              style={{ color: "#D4AF37" }}
            >
              <Plus className="h-3 w-3" />
              Create &ldquo;{input.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
