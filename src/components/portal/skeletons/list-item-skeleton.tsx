import { Skeleton } from "~/components/ui/skeleton";

interface ListItemSkeletonProps {
  /** Show secondary text placeholder on larger screens */
  showSecondaryText?: boolean;
  /** Show date placeholder */
  showDate?: boolean;
  /** Show description line */
  showDescription?: boolean;
}

/**
 * Skeleton for ListItem component.
 * Matches the layout: icon | title/description | secondary text | date
 */
export function ListItemSkeleton({
  showSecondaryText = true,
  showDate = true,
  showDescription = true,
}: ListItemSkeletonProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-md border bg-white/5 px-4 py-3"
      style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Icon placeholder */}
        <Skeleton gold className="h-5 w-5 flex-shrink-0 rounded" />

        <div className="min-w-0 space-y-1.5">
          {/* Title */}
          <Skeleton className="h-4 w-48 max-w-full" />
          {/* Description */}
          {showDescription && <Skeleton className="h-3 w-64 max-w-full" />}
        </div>
      </div>

      {/* Right: Metadata */}
      <div className="flex flex-shrink-0 items-center gap-4">
        {showSecondaryText && (
          <Skeleton className="hidden h-3 w-20 sm:block" />
        )}
        {showDate && <Skeleton className="h-3 w-16" />}
      </div>
    </div>
  );
}

/**
 * Pre-configured skeleton list with multiple items
 */
export function ListItemSkeletonGroup({
  count = 5,
  ...props
}: ListItemSkeletonProps & { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} {...props} />
      ))}
    </div>
  );
}
