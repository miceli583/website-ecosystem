"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, Plus } from "lucide-react";
import { api } from "~/trpc/react";
import { inputClass, borderStyle } from "./styles";

export function CompanyPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { data: suggestions = [] } = api.crm.getCompanyOptions.useQuery();
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
    (c) => c.toLowerCase().includes(value.toLowerCase()) && c !== value
  );

  const showCreate =
    value.trim() &&
    !suggestions.some((c) => c.toLowerCase() === value.trim().toLowerCase());

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Building2 className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
        <input
          className={inputClass + " pl-9"}
          style={borderStyle}
          placeholder="Search or create company..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (filtered.length > 0 || showCreate) && (
        <div
          className="absolute z-10 mt-1 max-h-32 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {filtered.map((company) => (
            <button
              key={company}
              onClick={() => {
                onChange(company);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Building2 className="h-3 w-3 text-gray-500" />
              {company}
            </button>
          ))}
          {showCreate && (
            <button
              onClick={() => {
                onChange(value.trim());
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
              style={{ color: "#D4AF37" }}
            >
              <Plus className="h-3 w-3" />
              Create &ldquo;{value.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
