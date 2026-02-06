"use client";

import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ExternalLink,
  Landmark,
  AlertCircle,
} from "lucide-react";
import { api } from "~/trpc/react";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function MetricSkeleton() {
  return (
    <div
      className="animate-pulse rounded-lg border bg-white/5 p-5"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="mt-3 h-8 w-20 rounded bg-white/10" />
      <div className="mt-2 h-3 w-32 rounded bg-white/5" />
    </div>
  );
}

export default function FinancePage() {
  const { data, isLoading, error } = api.finance.getOverview.useQuery();

  const stripe = data?.stripe;
  const mercury = data?.mercury;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance Overview</h1>
          <p className="text-sm text-gray-400">
            Revenue, expenses, and financial health
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

      {/* Connection Status */}
      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{
              backgroundColor: stripe?.connected
                ? "rgba(74, 222, 128, 0.1)"
                : "rgba(248, 113, 113, 0.1)",
              color: stripe?.connected ? "#4ade80" : "#f87171",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: stripe?.connected ? "#4ade80" : "#f87171",
              }}
            />
            Stripe {stripe?.connected ? "Connected" : "Disconnected"}
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{
              backgroundColor: mercury?.connected
                ? "rgba(74, 222, 128, 0.1)"
                : "rgba(248, 113, 113, 0.1)",
              color: mercury?.connected ? "#4ade80" : "#f87171",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: mercury?.connected ? "#4ade80" : "#f87171",
              }}
            />
            Mercury {mercury?.connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-lg border p-4"
          style={{
            borderColor: "rgba(248, 113, 113, 0.3)",
            backgroundColor: "rgba(248, 113, 113, 0.05)",
          }}
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-white">Failed to load finance data</p>
            <p className="mt-1 text-sm text-gray-400">{error.message}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Monthly Recurring
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(stripe?.mrr ?? 0)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {stripe?.activeSubscriptions ?? 0} active subscription{(stripe?.activeSubscriptions ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <DollarSign className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Revenue (This Month)
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(stripe?.thisMonthRevenue ?? 0)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                All-time: ${formatCents(stripe?.totalRevenue ?? 0)}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CreditCard className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Stripe Balance
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(stripe?.stripeBalance ?? 0)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Available for payout</p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Landmark className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Bank Balance
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {mercury?.connected
                  ? `$${mercury.totalAvailable.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {mercury?.connected
                  ? `${mercury.accounts.length} Mercury account${mercury.accounts.length !== 1 ? "s" : ""}`
                  : "Mercury not connected"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/finance/revenue"
          className="group rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <CreditCard className="h-5 w-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Revenue</h3>
                <p className="text-sm text-gray-400">Stripe payments & subscriptions</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </div>
        </Link>

        <Link
          href="/admin/finance/expenses"
          className="group rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
              >
                <Receipt className="h-5 w-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Expenses</h3>
                <p className="text-sm text-gray-400">Bank transactions & costs</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </div>
        </Link>
      </div>

      {/* Infrastructure Costs */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Estimated Infrastructure Costs</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500" style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3 text-right">Plan</th>
                <th className="px-4 py-3 text-right">Est. Monthly</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-300">Vercel</td>
                <td className="px-4 py-2 text-right text-gray-400">Pro</td>
                <td className="px-4 py-2 text-right text-gray-300">$20</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-300">Supabase</td>
                <td className="px-4 py-2 text-right text-gray-400">Free / Pro</td>
                <td className="px-4 py-2 text-right text-gray-300">$0–25</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-300">Resend</td>
                <td className="px-4 py-2 text-right text-gray-400">Free tier</td>
                <td className="px-4 py-2 text-right text-gray-300">$0</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-300">Stripe</td>
                <td className="px-4 py-2 text-right text-gray-400">Per transaction</td>
                <td className="px-4 py-2 text-right text-gray-300">~2.9%</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-300">Make.com</td>
                <td className="px-4 py-2 text-right text-gray-400">Free tier</td>
                <td className="px-4 py-2 text-right text-gray-300">$0</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-white">Estimated Total</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right font-medium text-white">$20–45</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
