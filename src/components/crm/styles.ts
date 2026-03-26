/**
 * Shared CRM styles and constants.
 * Single source of truth for form styling across all CRM pages.
 */

export const inputClass =
  "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50";

export const selectClass =
  "w-full appearance-none rounded-lg border bg-white/5 px-3 py-2 pr-9 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50";

export const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-gray-500";

export const borderStyle = { borderColor: "rgba(212, 175, 55, 0.2)" };

export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  lead: { label: "Lead", bg: "rgba(250, 204, 21, 0.1)", color: "#facc15" },
  prospect: {
    label: "Prospect",
    bg: "rgba(96, 165, 250, 0.1)",
    color: "#60a5fa",
  },
  client: {
    label: "Client",
    bg: "rgba(74, 222, 128, 0.1)",
    color: "#4ade80",
  },
  inactive: {
    label: "Inactive",
    bg: "rgba(156, 163, 175, 0.1)",
    color: "#9ca3af",
  },
  churned: {
    label: "Churned",
    bg: "rgba(248, 113, 113, 0.1)",
    color: "#f87171",
  },
};
