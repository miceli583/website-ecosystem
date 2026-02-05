import { Skeleton } from "~/components/ui/skeleton";

/**
 * Skeleton for profile card section
 */
export function ProfileCardSkeleton() {
  return (
    <div
      className="rounded-lg border bg-white/5 p-6"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      {/* Header with icon and title */}
      <div className="mb-4 flex items-center gap-3">
        <Skeleton gold className="h-12 w-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {/* Name field */}
        <div>
          <Skeleton className="h-3 w-12" />
          <Skeleton className="mt-1 h-5 w-32" />
        </div>
        {/* Email field */}
        <div>
          <Skeleton className="h-3 w-12" />
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        {/* Phone field */}
        <div>
          <Skeleton className="h-3 w-24" />
          <div className="mt-1 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the Role/Permissions card
 */
export function RoleCardSkeleton() {
  return (
    <div
      className="rounded-lg border bg-white/5 p-6"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Skeleton gold className="h-12 w-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <Skeleton className="h-3 w-10" />
          <Skeleton className="mt-1 h-5 w-16" />
        </div>
        <div>
          <Skeleton className="h-3 w-20" />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the Security card
 */
export function SecurityCardSkeleton() {
  return (
    <div
      className="rounded-lg border bg-white/5 p-6"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Skeleton gold className="h-12 w-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>

      {/* Button placeholder */}
      <Skeleton className="h-10 w-36" />
    </div>
  );
}

/**
 * Full profile page skeleton
 */
export function ProfilePageSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ProfileCardSkeleton />
      <RoleCardSkeleton />
      <div className="md:col-span-2">
        <SecurityCardSkeleton />
      </div>
    </div>
  );
}
