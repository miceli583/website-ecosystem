"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Users, UserPlus, X, Plus } from "lucide-react";
import { api } from "~/trpc/react";
import { inputClass, borderStyle } from "./styles";

export function ReferralPicker({
  contactId,
  referredBy,
  referredByExternal,
  onChange,
}: {
  contactId?: string;
  referredBy: string | null;
  referredByExternal: string | null;
  onChange: (
    referredBy: string | null,
    referredByExternal: string | null
  ) => void;
}) {
  const { data: contacts = [] } = api.crm.getContactOptions.useQuery();
  const { data: teamMembers = [] } = api.crm.getCompanyTeam.useQuery();
  const [search, setSearch] = useState(referredByExternal ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedContact = referredBy
    ? contacts.find((c: { id: string }) => c.id === referredBy)
    : null;
  const selectedTeamMember =
    !selectedContact && referredBy
      ? teamMembers.find((m: { id: string }) => m.id === referredBy)
      : null;
  const selectedName = selectedContact
    ? `${(selectedContact as { name: string }).name} (contact)`
    : selectedTeamMember
      ? `${(selectedTeamMember as { name: string }).name} (team)`
      : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = search.toLowerCase();
  const filteredContacts = contacts.filter(
    (c: { id: string; name: string; email: string }) =>
      c.id !== contactId &&
      (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  );
  const filteredTeam = teamMembers.filter(
    (m: { name: string; email: string }) =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
  );

  return (
    <div ref={ref} className="relative">
      {(referredBy || referredByExternal) && !open && (
        <div
          className="flex items-center justify-between rounded-lg border bg-white/5 px-3 py-2"
          style={borderStyle}
        >
          <span className="text-sm text-white">
            {selectedName ?? referredByExternal}
          </span>
          <button
            aria-label="Clear referral"
            onClick={() => {
              onChange(null, null);
              setSearch("");
            }}
            className="text-gray-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {!referredBy && !referredByExternal && (
        <>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
            <input
              className={inputClass + " pl-9"}
              style={borderStyle}
              placeholder="Search contacts or type external name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  e.preventDefault();
                  onChange(null, search.trim());
                  setOpen(false);
                }
              }}
            />
          </div>
          {open &&
            (filteredTeam.length > 0 ||
              filteredContacts.length > 0 ||
              search.trim()) && (
              <div
                className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-[#0a0a0a] py-1 shadow-xl"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                {filteredTeam.length > 0 && (
                  <>
                    <p className="px-3 pt-1.5 pb-1 text-[10px] font-medium tracking-wider text-gray-600 uppercase">
                      Team
                    </p>
                    {filteredTeam.map(
                      (m: { id: string; name: string; email: string }) => (
                        <button
                          key={`team-${m.id}`}
                          onClick={() => {
                            onChange(m.id, null);
                            setSearch("");
                            setOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                          <Users className="h-3 w-3 text-gray-500" />
                          <span>{m.name}</span>
                          <span className="ml-auto text-xs text-gray-600">
                            {m.email}
                          </span>
                        </button>
                      )
                    )}
                  </>
                )}
                {filteredContacts.length > 0 && (
                  <>
                    <p className="px-3 pt-1.5 pb-1 text-[10px] font-medium tracking-wider text-gray-600 uppercase">
                      Contacts
                    </p>
                    {filteredContacts.map(
                      (c: { id: string; name: string; email: string }) => (
                        <button
                          key={`contact-${c.id}`}
                          onClick={() => {
                            onChange(c.id, null);
                            setSearch("");
                            setOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                        >
                          <UserPlus className="h-3 w-3 text-gray-500" />
                          <span>{c.name}</span>
                          <span className="ml-auto text-xs text-gray-600">
                            {c.email}
                          </span>
                        </button>
                      )
                    )}
                  </>
                )}
                {search.trim() && (
                  <button
                    onClick={() => {
                      onChange(null, search.trim());
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
                    style={{ color: "#D4AF37" }}
                  >
                    <Plus className="h-3 w-3" />
                    Add external: &ldquo;{search.trim()}&rdquo;
                  </button>
                )}
              </div>
            )}
        </>
      )}

      {(referredBy || referredByExternal) && open && (
        <div className="relative">
          <input
            className={inputClass}
            style={borderStyle}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
