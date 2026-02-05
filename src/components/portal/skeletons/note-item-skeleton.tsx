import { Skeleton } from "~/components/ui/skeleton";

/**
 * Skeleton for note items in the notes page.
 * Matches the layout: icon | title + preview | project | author | timestamp
 */
export function NoteItemSkeleton() {
  return (
    <div
      className="rounded-md border bg-white/5 px-4 py-3"
      style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon + Title/Preview */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Icon */}
          <Skeleton gold className="h-5 w-5 flex-shrink-0 rounded" />

          <div className="min-w-0 space-y-1.5">
            {/* Title */}
            <Skeleton className="h-4 w-56 max-w-full" />
            {/* Preview */}
            <Skeleton className="h-3 w-80 max-w-full" />
          </div>
        </div>

        {/* Right: Metadata */}
        <div className="flex flex-shrink-0 items-center gap-4">
          {/* Project name */}
          <Skeleton className="hidden h-3 w-20 sm:block" />
          {/* Author initials */}
          <Skeleton className="h-5 w-5 rounded-full" />
          {/* Timestamp */}
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

/**
 * Group of note item skeletons
 */
export function NoteItemSkeletonGroup({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <NoteItemSkeleton key={i} />
      ))}
    </div>
  );
}
