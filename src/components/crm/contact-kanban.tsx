"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Clock, Building2, Tag, ChevronDown, GripVertical } from "lucide-react";
import { STATUS_CONFIG, borderStyle } from "./styles";
import type { ContactRow } from "./types";

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
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const grouped = new Map<string, ContactRow[]>();
  for (const col of COLUMNS) grouped.set(col, []);
  for (const c of contacts) {
    const bucket = grouped.get(c.status) ?? [];
    bucket.push(c);
    grouped.set(c.status, bucket);
  }

  const handleDragStart = (e: React.DragEvent, contact: ContactRow) => {
    setDraggedId(contact.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", contact.id);
    if (dragNodeRef.current) {
      e.dataTransfer.setDragImage(dragNodeRef.current, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTarget !== status) setDropTarget(status);
  };

  const handleDragLeave = (e: React.DragEvent, status: string) => {
    const related = e.relatedTarget as HTMLElement | null;
    const currentTarget = e.currentTarget as HTMLElement;
    if (!related || !currentTarget.contains(related)) {
      if (dropTarget === status) setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDropTarget(null);

    if (!draggedId || isPending) return;

    const contact = contacts.find((c) => c.id === draggedId);
    if (!contact || contact.status === targetStatus) {
      setDraggedId(null);
      return;
    }

    onStatusChange(contact.id, targetStatus);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDropTarget(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((status) => {
        const config = STATUS_CONFIG[status]!;
        const cards = grouped.get(status) ?? [];
        const isOver = dropTarget === status;
        const draggedContact = draggedId
          ? contacts.find((c) => c.id === draggedId)
          : null;
        const isValidDrop = draggedContact && draggedContact.status !== status;

        return (
          <div
            key={status}
            className="flex w-64 shrink-0 flex-col"
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={(e) => handleDragLeave(e, status)}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Column header */}
            <div
              className="mb-3 flex items-center justify-between rounded-lg border px-3 py-2 transition-colors"
              style={{
                borderColor:
                  isOver && isValidDrop
                    ? config.color
                    : "rgba(212, 175, 55, 0.2)",
                backgroundColor:
                  isOver && isValidDrop ? `${config.color}10` : undefined,
              }}
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

            {/* Drop zone */}
            <div
              className={`flex min-h-[80px] flex-col gap-2 rounded-lg border-2 border-dashed p-1 transition-colors ${
                isOver && isValidDrop
                  ? "border-opacity-60"
                  : "border-transparent"
              }`}
              style={{
                borderColor:
                  isOver && isValidDrop ? config.color : "transparent",
                backgroundColor:
                  isOver && isValidDrop ? `${config.color}08` : undefined,
              }}
            >
              {cards.length === 0 && !isOver && (
                <div
                  className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-gray-600"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  No contacts
                </div>
              )}
              {cards.length === 0 && isOver && isValidDrop && (
                <div
                  className="rounded-lg border border-dashed px-3 py-6 text-center text-xs"
                  style={{ borderColor: config.color, color: config.color }}
                >
                  {status === "client"
                    ? "Drop to promote"
                    : `Move to ${config.label}`}
                </div>
              )}
              {cards.map((contact) => {
                const isDragging = draggedId === contact.id;
                return (
                  <div
                    key={contact.id}
                    ref={isDragging ? dragNodeRef : undefined}
                    draggable
                    onDragStart={(e) => handleDragStart(e, contact)}
                    onDragEnd={handleDragEnd}
                    className={`group cursor-grab rounded-lg border bg-white/5 p-3 transition-all active:cursor-grabbing ${
                      isDragging
                        ? "scale-[0.97] opacity-40"
                        : "hover:bg-white/10"
                    }`}
                    style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/crm/contacts/${contact.id}`}
                          className="text-sm font-medium text-white transition-colors hover:text-[#D4AF37]"
                          onClick={(e) => {
                            if (draggedId) e.preventDefault();
                          }}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
