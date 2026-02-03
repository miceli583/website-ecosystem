"use client";

import { ChevronDown } from "lucide-react";

interface ProjectGroupHeaderProps {
  projectName: string;
  itemCount: number;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function ProjectGroupHeader({
  projectName,
  itemCount,
  collapsed = false,
  onToggle,
}: ProjectGroupHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="mb-2 mt-6 flex w-full items-center gap-3 first:mt-0"
    >
      <div className="h-5 w-0.5 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
      <h3 className="text-sm font-medium text-gray-400">{projectName}</h3>
      <span className="text-xs text-gray-600">{itemCount}</span>
      <div className="flex-1 border-b" style={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />
      <ChevronDown
        className={`h-4 w-4 text-gray-600 transition-transform ${collapsed ? "-rotate-90" : ""}`}
      />
    </button>
  );
}
