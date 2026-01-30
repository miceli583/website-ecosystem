"use client";

import { type ReactNode } from "react";
import { ExternalLink } from "lucide-react";

interface ListItemProps {
  // Content
  icon: ReactNode;
  title: string;
  description?: string | null;

  // Metadata (displayed on the right)
  date?: Date | string;
  secondaryText?: string;
  badge?: ReactNode; // Optional badge to show (e.g., status)

  // Link behavior
  href?: string | null;
  onClick?: () => void;
  external?: boolean; // Opens in new tab

  // Disabled state (e.g., subscription required)
  disabled?: boolean;
  disabledMessage?: string;
}

export function ListItem({
  icon,
  title,
  description,
  date,
  secondaryText,
  badge,
  href,
  onClick,
  external = true,
  disabled = false,
  disabledMessage,
}: ListItemProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const content = (
    <div
      className={`flex items-center justify-between gap-4 rounded-md border px-4 py-3 transition-colors ${
        disabled
          ? "cursor-not-allowed border-gray-800 bg-white/[0.02] opacity-60"
          : "border-gray-800 bg-white/5 hover:border-yellow-600/50 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className="flex-shrink-0"
          style={{ color: disabled ? "#6b7280" : "#D4AF37" }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`truncate font-medium ${disabled ? "text-gray-400" : "text-white"}`}
            >
              {title}
            </p>
            {badge}
          </div>
          {description && (
            <p className="truncate text-sm text-gray-500">{description}</p>
          )}
          {disabled && disabledMessage && (
            <p className="mt-0.5 text-xs text-red-400/80">{disabledMessage}</p>
          )}
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-4 text-sm text-gray-500">
        {secondaryText && <span className="hidden sm:inline">{secondaryText}</span>}
        {formattedDate && <span>{formattedDate}</span>}
        {href && external && !disabled && <ExternalLink className="h-4 w-4" />}
      </div>
    </div>
  );

  // Disabled items are not clickable
  if (disabled) {
    return <div className="block">{content}</div>;
  }

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block"
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

interface ListContainerProps {
  children: ReactNode;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  onClearFilters?: () => void;
  showClearFilters?: boolean;
}

export function ListContainer({
  children,
  emptyIcon,
  emptyMessage = "No items found.",
  onClearFilters,
  showClearFilters = false,
}: ListContainerProps) {
  // Check if children is empty
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

  if (!hasChildren) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {emptyIcon && <div className="mb-4 text-gray-600">{emptyIcon}</div>}
        <p className="text-gray-500">{emptyMessage}</p>
        {showClearFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 text-sm text-yellow-500 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return <div className="space-y-2">{children}</div>;
}
