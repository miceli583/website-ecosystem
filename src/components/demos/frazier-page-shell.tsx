"use client";

import type { ReactNode } from "react";

const COLORS = {
  brown: "#483932",
  copper: "#A45A11",
  cream: "#f8f2eb",
  beige: "#E7DBD1",
};

interface FrazierPageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accent?: boolean;
}

export function FrazierPageShell({
  title,
  subtitle,
  children,
  accent,
}: FrazierPageShellProps) {
  return (
    <div>
      {/* Page Header */}
      <div
        className="px-4 py-12 text-center sm:px-6"
        style={{ backgroundColor: accent ? COLORS.cream : undefined }}
      >
        <h1
          className="mb-2 text-3xl sm:text-4xl"
          style={{ fontFamily: "'Lobster Two', cursive", color: COLORS.copper }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto max-w-2xl text-sm" style={{ color: "#5a5550" }}>
            {subtitle}
          </p>
        )}
        <div
          className="mx-auto mt-4 h-0.5 w-16"
          style={{ backgroundColor: COLORS.copper }}
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 leading-relaxed" style={{ color: COLORS.brown }}>
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{ borderColor: COLORS.beige, backgroundColor: "#fff" }}
    >
      <h3 className="mb-3 text-lg font-bold" style={{ color: COLORS.brown }}>
        {title}
      </h3>
      <div className="text-sm leading-relaxed" style={{ color: "#5a5550" }}>
        {children}
      </div>
    </div>
  );
}

export { COLORS as FRAZIER_COLORS };
