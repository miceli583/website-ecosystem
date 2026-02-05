"use client";

import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

/**
 * Finance Overview Dashboard
 * Shows P&L summary and links to detailed views
 */
export default function FinancePage() {
  // Placeholder data - would come from Stripe/Mercury APIs
  const metrics = {
    mrr: 0,
    revenue: {
      thisMonth: 0,
      lastMonth: 0,
      total: 0,
    },
    expenses: {
      thisMonth: 0,
      infrastructure: 0,
    },
    profit: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Finance Overview</h1>
        <p className="text-sm text-gray-400">
          Revenue, expenses, and financial health
        </p>
      </div>

      {/* Integration Notice */}
      <div
        className="flex items-start gap-3 rounded-lg border p-4"
        style={{
          borderColor: "rgba(212, 175, 55, 0.3)",
          backgroundColor: "rgba(212, 175, 55, 0.05)",
        }}
      >
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#D4AF37" }} />
        <div>
          <p className="font-medium text-white">Finance Dashboard Under Development</p>
          <p className="mt-1 text-sm text-gray-400">
            This dashboard will integrate with Stripe for revenue tracking and optionally
            Mercury API for bank account data. Currently showing placeholder structure.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
              style={{ color: "#D4AF37" }}
            >
              Open Stripe Dashboard
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="rounded-lg border bg-white/5 p-5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Monthly Recurring
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            ${metrics.mrr.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-gray-500">MRR from subscriptions</p>
        </div>

        <div
          className="rounded-lg border bg-white/5 p-5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Revenue (This Month)
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            ${metrics.revenue.thisMonth.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            All payments received
          </p>
        </div>

        <div
          className="rounded-lg border bg-white/5 p-5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingDown className="h-4 w-4 text-red-400" />
              Expenses (This Month)
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            ${metrics.expenses.thisMonth.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Operating costs
          </p>
        </div>

        <div
          className="rounded-lg border bg-white/5 p-5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Receipt className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Net Profit
            </div>
          </div>
          <p className={`mt-2 text-2xl font-bold ${metrics.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${Math.abs(metrics.profit).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Revenue - Expenses
          </p>
        </div>
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
          <div className="mt-3 inline-flex items-center rounded-full bg-[#D4AF37]/15 px-2 py-0.5 text-xs text-[#D4AF37]">
            Coming Soon
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
                <p className="text-sm text-gray-400">Service costs & operations</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
          </div>
          <div className="mt-3 inline-flex items-center rounded-full bg-[#D4AF37]/15 px-2 py-0.5 text-xs text-[#D4AF37]">
            Coming Soon
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
