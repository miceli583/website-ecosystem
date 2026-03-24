"use client";

import { Search, X } from "lucide-react";
import type { FilterState, TeamMember, ClientOption } from "./types";

const selectClass =
  "rounded-lg border bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50";
const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

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
          className={`${selectClass} w-48 pl-9`}
          style={borderStyle}
        />
      </div>

      {/* Client filter (admin only) */}
      {mode === "admin" && clients && clients.length > 0 && (
        <select
          value={filters.clientId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              clientId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className={selectClass}
          style={borderStyle}
        >
          <option value="">All Clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {/* Status filter */}
      <select
        value={filters.status ?? ""}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            status: e.target.value || undefined,
          })
        }
        className={selectClass}
        style={borderStyle}
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
      </select>

      {/* Priority filter (tasks only) */}
      {showPriority && (
        <select
          value={filters.priority ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              priority: e.target.value || undefined,
            })
          }
          className={selectClass}
          style={borderStyle}
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      )}

      {/* Account Manager filter */}
      {mode === "admin" && accountManagers && accountManagers.length > 0 && (
        <select
          value={filters.accountManagerId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              accountManagerId: e.target.value || undefined,
            })
          }
          className={selectClass}
          style={borderStyle}
        >
          <option value="">All AMs</option>
          {accountManagers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      )}

      {/* Developer filter */}
      {mode === "admin" && developers && developers.length > 0 && (
        <select
          value={filters.developerId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              developerId: e.target.value || undefined,
            })
          }
          className={selectClass}
          style={borderStyle}
        >
          <option value="">All Devs</option>
          {developers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      )}

      {/* Owner filter */}
      {showOwner && team && team.length > 0 && (
        <select
          value={filters.ownerId ?? ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              ownerId: e.target.value || undefined,
            })
          }
          className={selectClass}
          style={borderStyle}
        >
          <option value="">All Owners</option>
          {team.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
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
