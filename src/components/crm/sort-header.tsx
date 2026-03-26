"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

export type SortLevel = { field: string; order: "asc" | "desc" };

export function SortHeader({
  field,
  label,
  sorts,
  onSort,
}: {
  field: string;
  label: string;
  sorts: SortLevel[];
  onSort: (field: string) => void;
}) {
  const idx = sorts.findIndex((s) => s.field === field);
  const isActive = idx !== -1;
  const order = isActive ? sorts[idx]!.order : null;
  const priority = isActive && sorts.length > 1 ? idx + 1 : null;

  return (
    <th className="px-4 py-3">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 transition-colors hover:text-white"
      >
        {label}
        {isActive ? (
          <span className="flex items-center gap-0.5">
            {order === "asc" ? (
              <ArrowUp className="h-3 w-3" style={{ color: "#D4AF37" }} />
            ) : (
              <ArrowDown className="h-3 w-3" style={{ color: "#D4AF37" }} />
            )}
            {priority !== null && (
              <span
                className="text-[9px] font-bold"
                style={{ color: "#D4AF37" }}
              >
                {priority}
              </span>
            )}
          </span>
        ) : (
          <span className="flex h-3 w-3 flex-col items-center justify-center">
            <ArrowUp className="h-2 w-2" />
            <ArrowDown className="-mt-0.5 h-2 w-2" />
          </span>
        )}
      </button>
    </th>
  );
}
