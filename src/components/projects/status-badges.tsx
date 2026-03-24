"use client";

export function ProjectStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    active: { bg: "rgba(74, 222, 128, 0.1)", text: "#4ade80" },
    completed: { bg: "rgba(96, 165, 250, 0.1)", text: "#60a5fa" },
    "on-hold": { bg: "rgba(251, 191, 36, 0.1)", text: "#fbbf24" },
    paused: { bg: "rgba(156, 163, 175, 0.1)", text: "#9ca3af" },
  };

  const s = styles[status] ?? styles.paused!;

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

export function TaskStatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    todo: { bg: "rgba(156, 163, 175, 0.1)", text: "#9ca3af" },
    "in-progress": { bg: "rgba(96, 165, 250, 0.1)", text: "#60a5fa" },
    done: { bg: "rgba(74, 222, 128, 0.1)", text: "#4ade80" },
  };

  const s = styles[status] ?? styles.todo!;
  const label = status === "in-progress" ? "In Progress" : status;

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    low: { bg: "rgba(156, 163, 175, 0.1)", text: "#9ca3af" },
    medium: { bg: "rgba(96, 165, 250, 0.1)", text: "#60a5fa" },
    high: { bg: "rgba(251, 191, 36, 0.1)", text: "#fbbf24" },
    urgent: { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444" },
  };

  const s = styles[priority] ?? styles.medium!;

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {priority}
    </span>
  );
}
