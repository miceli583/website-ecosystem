"use client";

import Link from "next/link";
import { Clock, Building2, Tag, ChevronDown } from "lucide-react";
import { STATUS_CONFIG, borderStyle } from "./styles";

type ContactRow = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  company: string | null;
  status: string;
  tags: string[] | null;
  lastContactAt: Date;
};

interface ContactKanbanProps {
  contacts: ContactRow[];
  onStatusChange: (contactId: string, newStatus: string) => void;
  isPending?: boolean;
}

const COLUMNS = ["lead", "prospect", "client", "inactive", "churned"] as const;

export function ContactKanban({
  contacts,
  onStatusChange,
  isPending,
}: ContactKanbanProps) {
  const grouped = new Map<string, ContactRow[]>();
  for (const col of COLUMNS) grouped.set(col, []);
  for (const c of contacts) {
    const bucket = grouped.get(c.status) ?? [];
    bucket.push(c);
    grouped.set(c.status, bucket);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((status) => {
        const config = STATUS_CONFIG[status]!;
        const cards = grouped.get(status) ?? [];
        return (
          <div key={status} className="flex w-64 shrink-0 flex-col">
            {/* Column header */}
            <div
              className="mb-3 flex items-center justify-between rounded-lg border px-3 py-2"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium"
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  {cards.length}
                </span>
                <span className="text-sm font-medium text-white">
                  {config.label}s
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2">
              {cards.length === 0 && (
                <div
                  className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-gray-600"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  No contacts
                </div>
              )}
              {cards.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-lg border bg-white/5 p-3 transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                >
                  <Link
                    href={`/admin/crm/contacts/${contact.id}`}
                    className="text-sm font-medium text-white transition-colors hover:text-[#D4AF37]"
                  >
                    {contact.name}
                  </Link>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {contact.email}
                  </p>

                  {contact.company && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <Building2 className="h-3 w-3" />
                      {contact.company}
                    </p>
                  )}

                  {contact.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {contact.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px]"
                          style={{
                            backgroundColor: "rgba(212, 175, 55, 0.1)",
                            color: "#D4AF37",
                          }}
                        >
                          <Tag className="h-2 w-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(contact.lastContactAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </span>

                    {/* Status change dropdown */}
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => {
                          if (e.target.value !== status) {
                            onStatusChange(contact.id, e.target.value);
                          }
                        }}
                        disabled={isPending}
                        className="appearance-none rounded border bg-white/5 py-0.5 pr-5 pl-1.5 text-[10px] text-gray-400 focus:outline-none disabled:opacity-50"
                        style={borderStyle}
                      >
                        {COLUMNS.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s]!.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-1 h-2.5 w-2.5 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
