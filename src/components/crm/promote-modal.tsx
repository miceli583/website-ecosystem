"use client";

import { useState } from "react";
import { Shield, X } from "lucide-react";
import { api } from "~/trpc/react";
import { TeamMemberPicker } from "./team-member-picker";
import { CompanyPicker } from "./company-picker";
import { inputClass, labelClass, borderStyle } from "./styles";
import type { ContactRow } from "./types";

export function PromoteToClientModal({
  contact,
  onClose,
  onSuccess,
  preserveStatus,
}: {
  contact: ContactRow;
  onClose: () => void;
  onSuccess: () => void;
  preserveStatus?: boolean;
}) {
  const utils = api.useUtils();
  const promote = api.crm.promoteToClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
      onSuccess();
    },
  });

  const autoSlug = contact.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const [form, setForm] = useState({
    slug: autoSlug,
    company: contact.company ?? "",
    accountManagerId: contact.accountManagerId as string | null,
  });

  const [error, setError] = useState("");

  const handlePromote = () => {
    setError("");
    promote.mutate(
      {
        crmId: contact.id,
        slug: form.slug,
        company: form.company || undefined,
        accountManagerId: form.accountManagerId,
        preserveStatus: preserveStatus || undefined,
      },
      {
        onError: (err) => setError(err.message),
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-xl border bg-[#0a0a0a] p-6 shadow-2xl"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(246,230,193,0.1) 0%, rgba(212,175,55,0.15) 100%)",
              }}
            >
              <Shield className="h-4 w-4" style={{ color: "#D4AF37" }} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {preserveStatus ? "Create Portal" : "Create Client Portal"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-400">
          {preserveStatus ? (
            <>
              Creating a portal for{" "}
              <span className="font-medium text-white">{contact.name}</span>.
              Their CRM status will remain{" "}
              <span className="font-medium text-white">{contact.status}</span>.
              Portal at{" "}
            </>
          ) : (
            <>
              Promoting{" "}
              <span className="font-medium text-white">{contact.name}</span> to
              client. This will create a portal at{" "}
            </>
          )}
          <span className="font-mono text-xs" style={{ color: "#D4AF37" }}>
            /portal/{form.slug}
          </span>
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass + " cursor-not-allowed opacity-60"}
                style={borderStyle}
                value={contact.name}
                readOnly
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass + " cursor-not-allowed opacity-60"}
                style={borderStyle}
                value={contact.email}
                readOnly
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Portal Slug</label>
            <input
              className={inputClass}
              style={borderStyle}
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                }))
              }
              placeholder="client-slug"
            />
          </div>

          <div>
            <label className={labelClass}>Company</label>
            <CompanyPicker
              value={form.company}
              onChange={(v) => setForm((f) => ({ ...f, company: v }))}
            />
          </div>

          <div>
            <label className={labelClass}>Account Manager</label>
            <TeamMemberPicker
              placeholder="Select account manager..."
              value={form.accountManagerId}
              onChange={(id) =>
                setForm((f) => ({ ...f, accountManagerId: id }))
              }
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={borderStyle}
          >
            Cancel
          </button>
          <button
            onClick={handlePromote}
            disabled={promote.isPending || !form.slug}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-opacity disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {promote.isPending
              ? "Creating..."
              : preserveStatus
                ? "Create Portal"
                : "Create Client Portal"}
          </button>
        </div>
      </div>
    </div>
  );
}
