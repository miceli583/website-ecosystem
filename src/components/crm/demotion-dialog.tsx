"use client";

import { AlertTriangle, Shield } from "lucide-react";
import { api } from "~/trpc/react";
import { STATUS_CONFIG, borderStyle } from "./styles";
import type { ContactRow } from "./types";

export function DemotionDialog({
  contact,
  newStatus,
  clientInfo,
  onClose,
  onSuccess,
}: {
  contact: ContactRow;
  newStatus: string;
  clientInfo: { id: number; slug: string; name: string };
  onClose: () => void;
  onSuccess: () => void;
}) {
  const utils = api.useUtils();
  const demote = api.crm.demoteClient.useMutation({
    onSuccess: () => {
      void utils.crm.getContacts.invalidate();
      void utils.crm.getPipelineStats.invalidate();
      void utils.clients.list.invalidate();
      onSuccess();
    },
  });

  const handleAction = (portalAction: "archive" | "remove") => {
    demote.mutate({
      crmId: contact.id,
      newStatus: newStatus as "lead" | "prospect" | "inactive" | "churned",
      portalAction,
    });
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
        <div className="mb-4 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(248, 113, 113, 0.1)" }}
          >
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Client Has Active Portal
          </h2>
        </div>

        <p className="mb-2 text-sm text-gray-400">
          <span className="font-medium text-white">{clientInfo.name}</span> has
          a portal at{" "}
          <span className="font-mono text-xs" style={{ color: "#D4AF37" }}>
            /portal/{clientInfo.slug}
          </span>
          . Changing their status to{" "}
          <span className="font-medium text-white">
            {STATUS_CONFIG[newStatus]?.label ?? newStatus}
          </span>{" "}
          requires handling the portal.
        </p>

        <div className="mt-5 space-y-3">
          <button
            onClick={() => handleAction("archive")}
            disabled={demote.isPending}
            className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <Shield className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-white">Archive Portal</p>
              <p className="text-xs text-gray-500">
                Client becomes inactive — portal preserved but inaccessible
              </p>
            </div>
          </button>

          <button
            onClick={() => handleAction("remove")}
            disabled={demote.isPending}
            className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{ borderColor: "rgba(248, 113, 113, 0.2)" }}
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-white">
                Remove from Portal
              </p>
              <p className="text-xs text-gray-500">
                Client record deleted — portal data removed permanently
              </p>
            </div>
          </button>

          <button
            onClick={onClose}
            disabled={demote.isPending}
            className="w-full rounded-lg border px-4 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
            style={borderStyle}
          >
            Cancel — Keep as Client
          </button>
        </div>
      </div>
    </div>
  );
}
