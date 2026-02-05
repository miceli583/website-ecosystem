"use client";

import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Users,
  Receipt,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Clock,
} from "lucide-react";
import { api } from "~/trpc/react";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 flex-1 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function RevenuePage() {
  const { data: overview, isLoading: overviewLoading } =
    api.finance.getStripeOverview.useQuery();
  const { data: subData, isLoading: subsLoading } =
    api.finance.getSubscriptions.useQuery();

  const isLoading = overviewLoading || subsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2">
            <Link
              href="/admin/finance"
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Finance
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">Revenue</h1>
          <p className="text-sm text-gray-400">
            Stripe payments, subscriptions, and MRR tracking
          </p>
        </div>
        <a
          href="https://dashboard.stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5 hover:text-white"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37" }}
        >
          Stripe Dashboard
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Connection Warning */}
      {!isLoading && !overview?.connected && (
        <div
          className="flex items-start gap-3 rounded-lg border p-4"
          style={{
            borderColor: "rgba(248, 113, 113, 0.3)",
            backgroundColor: "rgba(248, 113, 113, 0.05)",
          }}
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-white">Stripe not connected</p>
            <p className="mt-1 text-sm text-gray-400">
              {(overview as { error?: string })?.error ??
                "Check that STRIPE_LIVE_SECRET_KEY is set in your environment."}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="mt-3 h-8 w-20 rounded bg-white/10" />
            </div>
          ))
        ) : (
          <>
            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
                MRR
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(overview?.mrr ?? 0)}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Active Subscriptions
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.activeSubscriptions ?? 0}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CreditCard className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Total Revenue
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(overview?.totalRevenue ?? 0)}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Receipt className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Recent Payments
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {overview?.recentPayments?.length ?? 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Recent Payments */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Recent Payments</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {overviewLoading ? (
            <TableSkeleton />
          ) : !overview?.recentPayments?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No payments found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-2.5 text-gray-300">
                      {payment.description ?? "Payment"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(payment.created)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-white">
                      ${formatCents(payment.amount)}
                      <span className="ml-1 text-xs uppercase text-gray-500">
                        {payment.currency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Subscriptions */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Subscriptions</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {subsLoading ? (
            <TableSkeleton />
          ) : !subData?.subscriptions?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No subscriptions found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Renews</th>
                </tr>
              </thead>
              <tbody>
                {subData.subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-2.5 text-gray-300">
                      {sub.customer?.email ?? "Unknown"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {sub.items[0]?.productName ?? "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor:
                            sub.status === "active"
                              ? "rgba(74, 222, 128, 0.1)"
                              : sub.status === "canceled"
                                ? "rgba(248, 113, 113, 0.1)"
                                : "rgba(250, 204, 21, 0.1)",
                          color:
                            sub.status === "active"
                              ? "#4ade80"
                              : sub.status === "canceled"
                                ? "#f87171"
                                : "#facc15",
                        }}
                      >
                        {sub.status}
                        {sub.cancelAtPeriodEnd && " (canceling)"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-white">
                      ${formatCents(sub.items[0]?.amount ?? 0)}
                      <span className="ml-1 text-xs text-gray-500">
                        /{sub.items[0]?.interval}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-400">
                      {sub.currentPeriodEnd
                        ? formatDate(sub.currentPeriodEnd)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
