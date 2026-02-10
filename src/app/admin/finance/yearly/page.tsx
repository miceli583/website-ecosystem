"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Shield,
  ArrowUpRight as ArrowUp,
  ArrowDownLeft as ArrowDown,
} from "lucide-react";
import { api } from "~/trpc/react";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const currentYear = new Date().getFullYear();
// Default to previous year if early in the current year (before April = tax season)
const defaultYear = new Date().getMonth() < 3 ? currentYear - 1 : currentYear;
const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

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
    </div>
  );
}

export default function YearlyReviewPage() {
  const [year, setYear] = useState(defaultYear);
  const comparisonYear = year - 1;

  const { data, isLoading } = api.finance.getYearlyProfitLoss.useQuery({
    year,
    comparisonYear,
  });

  const { data: expenseData } = api.finance.getYearlyExpenses.useQuery({
    year,
  });

  const maxRevenue = Math.max(
    ...(data?.months?.map((m) => m.revenue) ?? [1]),
    1
  );
  const maxExpense = Math.max(
    ...(data?.months?.map((m) => m.expenses) ?? [1]),
    1
  );
  const maxVal = Math.max(maxRevenue, maxExpense);

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Yearly Review</h1>
            <p className="text-sm text-gray-400">
              Profit & loss, expense breakdown, and year-over-year comparison
            </p>
          </div>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="rounded-lg border bg-white/5 px-3 py-1.5 text-sm text-white"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

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
                Total Revenue
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(data?.totalRevenue ?? 0)}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Receipt className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Total Expenses
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(data?.totalExpenses ?? 0)}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <DollarSign
                  className="h-4 w-4"
                  style={{ color: "#D4AF37" }}
                />
                Net Profit
              </div>
              <p
                className={`mt-2 text-2xl font-bold ${(data?.netProfit ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {(data?.netProfit ?? 0) < 0 ? "-" : ""}$
                {formatCents(Math.abs(data?.netProfit ?? 0))}
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Total Deductions
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(data?.totalDeductions ?? 0)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Month-by-Month P&L Table */}
      <div>
        <h2 className="mb-3 font-semibold text-white">
          Monthly Profit & Loss
        </h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Expenses</th>
                  <th className="px-4 py-3 text-right">Net</th>
                  <th className="px-4 py-3 text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {data?.months?.map((m) => (
                  <tr
                    key={m.month}
                    className="border-b"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-300">
                      {MONTH_NAMES[m.month - 1]}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-right text-gray-300">
                          ${formatCents(m.revenue)}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(m.revenue / maxVal) * 100}%`,
                              background:
                                "linear-gradient(90deg, #F6E6C1, #D4AF37)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-right text-gray-300">
                          ${formatCents(m.expenses)}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gray-500"
                            style={{
                              width: `${(m.expenses / maxVal) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-medium ${m.net >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {m.net < 0 ? "-" : ""}${formatCents(Math.abs(m.net))}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-400">
                      {m.margin}%
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                {data && (
                  <tr className="font-medium">
                    <td className="px-4 py-3 text-white">Total</td>
                    <td className="px-4 py-3 text-white">
                      ${formatCents(data.totalRevenue)}
                    </td>
                    <td className="px-4 py-3 text-white">
                      ${formatCents(data.totalExpenses)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${data.netProfit >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {data.netProfit < 0 ? "-" : ""}$
                      {formatCents(Math.abs(data.netProfit))}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400">
                      {data.totalRevenue > 0
                        ? Math.round(
                            (data.netProfit / data.totalRevenue) * 100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Expense Breakdown by Category */}
      {expenseData?.byCategory && expenseData.byCategory.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-white">
            Expense Breakdown by Category
          </h2>
          <div
            className="rounded-lg border bg-white/5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Monthly Avg</th>
                  <th className="px-4 py-3 text-right">Annual Total</th>
                  <th className="px-4 py-3 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {expenseData.byCategory.map((cat) => (
                  <tr
                    key={cat.name}
                    className="border-b"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-2.5 text-gray-300">{cat.name}</td>
                    <td className="px-4 py-2.5 text-right text-gray-400">
                      ${formatCents(Math.round(cat.total / 12))}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-white">
                      ${formatCents(cat.total)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-400">
                      {expenseData.total > 0
                        ? Math.round((cat.total / expenseData.total) * 100)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Year-over-Year Comparison */}
      {data?.comparison && (
        <div>
          <h2 className="mb-3 font-semibold text-white">
            Year-over-Year ({comparisonYear} vs {year})
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Revenue",
                current: data.totalRevenue,
                prev: data.comparison.revenue,
              },
              {
                label: "Expenses",
                current: data.totalExpenses,
                prev: data.comparison.expenses,
              },
              {
                label: "Net Profit",
                current: data.netProfit,
                prev: data.comparison.profit,
              },
            ].map((item) => {
              const delta = item.current - item.prev;
              const pct =
                item.prev > 0
                  ? Math.round(((item.current - item.prev) / item.prev) * 100)
                  : item.current > 0
                    ? 100
                    : 0;
              const isPositive = delta >= 0;
              // For expenses, increase is bad
              const isGood =
                item.label === "Expenses" ? !isPositive : isPositive;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border bg-white/5 p-5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <p className="text-sm text-gray-400">{item.label}</p>
                  <p className="mt-1 text-xl font-bold text-white">
                    ${formatCents(item.current)}
                  </p>
                  <div
                    className={`mt-2 flex items-center gap-1 text-sm ${isGood ? "text-green-400" : "text-red-400"}`}
                  >
                    {isPositive ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    )}
                    {Math.abs(pct)}%{" "}
                    <span className="text-gray-500">vs {comparisonYear}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {comparisonYear}: ${formatCents(item.prev)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
