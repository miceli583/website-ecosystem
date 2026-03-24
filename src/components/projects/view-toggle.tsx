"use client";

import { LayoutList, Kanban } from "lucide-react";

interface ViewToggleProps {
  view: "list" | "kanban";
  onViewChange: (view: "list" | "kanban") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const base = "rounded-lg p-2 transition-colors border";
  const active = "bg-[#D4AF37]/10 text-[#D4AF37] border-[rgba(212,175,55,0.3)]";
  const inactive =
    "text-gray-500 hover:text-gray-300 border-transparent hover:bg-white/5";

  return (
    <div className="flex gap-1">
      <button
        onClick={() => onViewChange("list")}
        className={`${base} ${view === "list" ? active : inactive}`}
        title="List view"
      >
        <LayoutList className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("kanban")}
        className={`${base} ${view === "kanban" ? active : inactive}`}
        title="Kanban view"
      >
        <Kanban className="h-4 w-4" />
      </button>
    </div>
  );
}
