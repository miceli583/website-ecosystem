"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { getTemplate, type TemplateId } from "~/lib/staging-templates";

interface StagingCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  template?: TemplateId;
}

export function StagingCard({
  href,
  icon,
  title,
  description,
  badge,
  template,
}: StagingCardProps) {
  const t = getTemplate(template);

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl border ${t.card.bg} p-6 backdrop-blur-md transition-all ${t.card.hoverBg} hover:shadow-xl`}
      style={
        { borderColor: t.card.borderColor, "--hover-color": t.title.hoverColor } as React.CSSProperties
      }
    >
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{
          background: t.iconContainer.background,
          border: t.iconContainer.border,
        }}
      >
        <div style={{ color: t.iconContainer.iconColor }}>{icon}</div>
      </div>
      <h2 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-[var(--hover-color)]">
        {title}
      </h2>
      <p className="text-sm text-gray-400">{description}</p>
      {badge && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="rounded-full px-2 py-1 text-xs" style={t.badge}>
            {badge}
          </span>
        </div>
      )}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl transition-all"
        style={t.orb}
      />
    </Link>
  );
}
