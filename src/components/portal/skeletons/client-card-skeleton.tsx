import { Skeleton } from "~/components/ui/skeleton";

/**
 * Skeleton for client cards on the portal landing page.
 * Matches the Card layout: name/company | badge | email | slug + projects
 */
export function ClientCardSkeleton() {
  return (
    <div
      className="rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      {/* Header: Name/company + Badge */}
      <div className="mb-3 flex items-start justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      {/* Email */}
      <Skeleton className="mb-2 h-3 w-40" />

      {/* Footer: Slug + Projects */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

/**
 * Grid of client card skeletons
 */
export function ClientCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ClientCardSkeleton key={i} />
      ))}
    </div>
  );
}
