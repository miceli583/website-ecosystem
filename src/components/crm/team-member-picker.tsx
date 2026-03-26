"use client";

import { useState, useEffect, useRef } from "react";
import { Users, X, ChevronDown } from "lucide-react";
import { api } from "~/trpc/react";
import { borderStyle } from "./styles";

export function TeamMemberPicker({
  value,
  onChange,
  placeholder = "Select team member...",
}: {
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
}) {
  const { data: team = [] } = api.crm.getCompanyTeam.useQuery();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = value
    ? team.find((m: { id: string }) => m.id === value)
    : null;

  const filtered = search
    ? team.filter(
        (m: { name: string; email: string }) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
      )
    : team;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border bg-white/5 px-3 py-2 text-left text-sm text-white"
        style={borderStyle}
      >
        <span className={selected ? "text-white" : "text-gray-500"}>
          {selected ? selected.name : placeholder}
        </span>
        {value ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear selection"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange(null);
              }
            }}
            className="text-gray-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>
      {open && (
        <div
          className="absolute z-10 mt-1 w-full rounded-lg border bg-[#0a0a0a] shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div
            className="border-b px-3 py-2"
            style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
          >
            <input
              type="text"
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-40 overflow-y-auto py-1">
            {filtered.map(
              (member: { id: string; name: string; email: string }) => (
                <button
                  key={member.id}
                  onClick={() => {
                    onChange(member.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <Users className="h-3 w-3 text-gray-500" />
                  <span>{member.name}</span>
                  <span className="ml-auto text-xs text-gray-600">
                    {member.email}
                  </span>
                </button>
              )
            )}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-500">
                {search ? "No matches" : "No team members found"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
