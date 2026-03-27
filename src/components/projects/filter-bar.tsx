"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, Building2 } from "lucide-react";
import type { FilterState, TeamMember, ClientOption } from "./types";

const inputClass =
  "rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";
const selectClass =
  "appearance-none rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

function SelectWithChevron({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={selectClass}
        style={borderStyle}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}

function ClientPicker({
  value,
  onChange,
  clients,
}: {
  value: number | undefined;
  onChange: (id: number | undefined) => void;
  clients: ClientOption[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? clients.find((c) => c.id === value) : null;

  const filtered = search
    ? clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : clients;

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
        className="flex items-center gap-2 rounded-lg border bg-white/5 py-2 pr-9 pl-3 text-sm text-white"
        style={borderStyle}
      >
        <span className={selected ? "text-white" : "text-gray-400"}>
          {selected ? selected.name : "All Clients"}
        </span>
      </button>
      {value ? (
        <span
          role="button"
          tabIndex={0}
          aria-label="Clear client filter"
          onClick={() => onChange(undefined)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onChange(undefined);
          }}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </span>
      ) : (
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
      )}
      {open && (
        <div
          className="absolute z-10 mt-1 w-56 rounded-lg border bg-[#0a0a0a] shadow-xl"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div
            className="border-b px-3 py-2"
            style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
          >
            <input
              type="text"
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            <button
              onClick={() => {
                onChange(undefined);
                setOpen(false);
                setSearch("");
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10 ${
                !value ? "text-[#D4AF37]" : "text-gray-300 hover:text-white"
              }`}
            >
              All Clients
            </button>
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onChange(c.id);
                  setOpen(false);
                  setSearch("");
                }}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors hover:bg-white/10 ${
                  c.id === value
                    ? "text-[#D4AF37]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Building2 className="h-3 w-3 text-gray-500" />
                {c.name}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-500">No matches</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  clients?: ClientOption[];
  team?: TeamMember[];
  mode: "admin" | "portal";
  showPriority?: boolean;
  showOwner?: boolean;
}

export function FilterBar({
  filters,
  onFiltersChange,
  clients,
  team,
  mode,
  showPriority = false,
  showOwner = false,
}: FilterBarProps) {
  const accountManagers = team?.filter(
    (m) =>
      m.companyRoles?.includes("account_manager") ||
      m.companyRoles?.includes("founder")
  );
  const developers = team?.filter(
    (m) =>
      m.companyRoles?.includes("developer") ||
      m.companyRoles?.includes("founder")
  );

  const hasFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          value={filters.search ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              search: e.target.value || undefined,
            })
          }
          className={`${inputClass} w-48 pl-9`}
          style={borderStyle}
        />
      </div>

      {/* Client filter (admin only, searchable) */}
      {mode === "admin" && clients && clients.length > 0 && (
        <ClientPicker
          value={filters.clientId}
          onChange={(id) => onFiltersChange({ ...filters, clientId: id })}
          clients={clients}
        />
      )}

      {/* Status filter */}
      <SelectWithChevron
        value={filters.status ?? ""}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            status: e.target.value || undefined,
          })
        }
      >
        <option value="">All Statuses</option>
        {showPriority ? (
          <>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </>
        ) : (
          <>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </>
        )}
      </SelectWithChevron>

      {/* Priority filter (tasks only) */}
      {showPriority && (
        <SelectWithChevron
          value={filters.priority ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              priority: e.target.value || undefined,
            })
          }
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </SelectWithChevron>
      )}

      {/* Account Manager filter */}
      {mode === "admin" && accountManagers && accountManagers.length > 0 && (
        <SelectWithChevron
          value={filters.accountManagerId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              accountManagerId: e.target.value || undefined,
            })
          }
        >
          <option value="">All AMs</option>
          {accountManagers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </SelectWithChevron>
      )}

      {/* Developer filter */}
      {mode === "admin" && developers && developers.length > 0 && (
        <SelectWithChevron
          value={filters.developerId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              developerId: e.target.value || undefined,
            })
          }
        >
          <option value="">All Devs</option>
          {developers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </SelectWithChevron>
      )}

      {/* Owner filter */}
      {showOwner && team && team.length > 0 && (
        <SelectWithChevron
          value={filters.ownerId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              ownerId: e.target.value || undefined,
            })
          }
        >
          <option value="">All Owners</option>
          {team.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </SelectWithChevron>
      )}

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => onFiltersChange({})}
          className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs text-gray-400 transition-colors hover:text-white"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
