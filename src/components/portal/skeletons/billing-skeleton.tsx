import { Skeleton } from "~/components/ui/skeleton";

/**
 * Skeleton for billing summary cards (MRR, Total Paid, Next Payment)
 */
export function BillingSummaryCardSkeleton() {
  return (
    <div
      className="rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="flex items-center gap-2">
        <Skeleton gold className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="mt-3 h-8 w-24" />
      <Skeleton className="mt-2 h-3 w-32" />
    </div>
  );
}

/**
 * Grid of 3 summary cards
 */
export function BillingSummarySkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <BillingSummaryCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for a subscription billing item (larger card with more details)
 */
export function SubscriptionItemSkeleton() {
  return (
    <div
      className="rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton gold className="h-4 w-4 flex-shrink-0" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="ml-7 h-4 w-48" />
          <Skeleton className="ml-7 h-4 w-32" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for an invoice/payment billing item (compact row)
 */
export function InvoiceItemSkeleton() {
  return (
    <div
      className="flex items-center justify-between rounded-lg border bg-white/5 p-4"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <Skeleton gold className="h-4 w-4 flex-shrink-0" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="ml-6 h-3 w-24" />
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-1 h-3 w-16" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Full billing page skeleton with summary + items
 */
export function BillingPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <BillingSummarySkeletonGrid />

      {/* Divider */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.4), transparent)",
        }}
      />

      {/* Search bar skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Items */}
      <div className="space-y-3">
        <SubscriptionItemSkeleton />
        <InvoiceItemSkeleton />
        <InvoiceItemSkeleton />
        <InvoiceItemSkeleton />
      </div>
    </div>
  );
}
