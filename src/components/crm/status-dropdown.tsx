"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface StatusOption {
  value: string;
  label: string;
  color: string;
  bg: string;
}

interface StatusDropdownProps {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function StatusDropdown({
  value,
  options,
  onChange,
  disabled,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === value) ?? options[0]!;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-opacity disabled:opacity-50"
        style={{ backgroundColor: current.bg, color: current.color }}
      >
        {current.label}
        <ChevronDown className="h-3 w-3" style={{ color: current.color }} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-20 mt-1 min-w-[140px] overflow-hidden rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                if (opt.value !== value) onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10 ${
                opt.value === value ? "text-white" : "text-gray-400"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: opt.color }}
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
