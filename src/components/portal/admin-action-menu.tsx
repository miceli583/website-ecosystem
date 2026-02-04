"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

export interface AdminAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}

interface AdminActionMenuProps {
  actions: AdminAction[];
}

export function AdminActionMenu({ actions }: AdminActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-label="Open actions menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border py-1 shadow-xl backdrop-blur-md"
          style={{
            borderColor: "rgba(212, 175, 55, 0.15)",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          }}
        >
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                action.onClick();
              }}
              disabled={action.disabled}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                action.disabled
                  ? "cursor-not-allowed opacity-40"
                  : action.variant === "danger"
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
