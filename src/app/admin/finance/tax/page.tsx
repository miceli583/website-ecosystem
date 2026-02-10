"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  Shield,
  FileText,
  Download,
} from "lucide-react";
import { api } from "~/trpc/react";

interface TaxExportRow {
  date: string;
  vendor: string;
  category: string;
  amount: number;
  description: string;
  source: string;
  deductible: boolean;
}

interface DeductibleCategory {
  categoryName: string | null;
  irsCategory: string | null;
  count: number;
  total: number;
}

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

export default function TaxPage() {
  const [year, setYear] = useState(defaultYear);

  const { data: taxSummary, isLoading: summaryLoading } =
    api.finance.getTaxSummary.useQuery({ year });
  const { data: exportData } = api.finance.exportTaxData.useQuery({ year });

  const handleExportCSV = () => {
    if (!exportData?.rows?.length) return;

    const headers = [
      "Date",
      "Vendor",
      "Category",
      "Amount",
      "Description",
      "Source",
    ];
    const csvRows = [
      headers.join(","),
      ...exportData.rows.map((row: TaxExportRow) =>
        [
          row.date,
          `"${row.vendor.replace(/"/g, '""')}"`,
          `"${row.category.replace(/"/g, '""')}"`,
          (row.amount / 100).toFixed(2),
          `"${row.description.replace(/"/g, '""')}"`,
          row.source,
        ].join(",")
      ),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tax-deductions-${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
            <h1 className="text-2xl font-bold text-white">
              Tax & Deductions
            </h1>
            <p className="text-sm text-gray-400">
              IRS Schedule C deduction summary and export
            </p>
          </div>
          <div className="flex items-center gap-3">
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
            <button
              onClick={handleExportCSV}
              disabled={!exportData?.rows?.length}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-black transition-opacity disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {summaryLoading ? (
          <>
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
                <DollarSign
                  className="h-4 w-4"
                  style={{ color: "#D4AF37" }}
                />
                Gross Income
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(taxSummary?.grossIncome ?? 0)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                From Stripe charges ({year})
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
              <p className="mt-2 text-2xl font-bold text-green-400">
                ${formatCents(taxSummary?.totalDeductions ?? 0)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Tax-deductible expenses
              </p>
            </div>

            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Est. Taxable Income
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                ${formatCents(taxSummary?.estimatedTaxableIncome ?? 0)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Gross income minus deductions
              </p>
            </div>
          </>
        )}
      </div>

      {/* Deductions by IRS Category */}
      <div>
        <h2 className="mb-3 font-semibold text-white">
          Deductions by IRS Category
        </h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {summaryLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 flex-1 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : !taxSummary?.deductibleByCategory?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No tax-deductible expenses recorded for {year}. Mark expenses as
              deductible on the Expenses page.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">IRS Category</th>
                  <th className="px-4 py-3">Schedule C</th>
                  <th className="px-4 py-3 text-right"># Expenses</th>
                  <th className="px-4 py-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {taxSummary.deductibleByCategory
                  .sort((a: DeductibleCategory, b: DeductibleCategory) => (b.total ?? 0) - (a.total ?? 0))
                  .map((cat: DeductibleCategory) => (
                    <tr
                      key={cat.categoryName}
                      className="border-b"
                      style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                    >
                      <td className="px-4 py-2.5 text-gray-300">
                        {cat.categoryName}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500">
                        {cat.irsCategory}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-400">
                        {cat.count}
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-white">
                        ${formatCents(cat.total ?? 0)}
                      </td>
                    </tr>
                  ))}
                {/* Total row */}
                <tr className="font-medium">
                  <td className="px-4 py-3 text-white" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400">
                    {taxSummary.deductibleByCategory.reduce(
                      (sum: number, c: DeductibleCategory) => sum + c.count,
                      0
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-green-400">
                    ${formatCents(taxSummary.totalDeductions)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* All Deductible Expenses */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-white">
            All Deductible Expenses
          </h2>
          {exportData?.rows?.length ? (
            <span className="text-xs text-gray-500">
              {exportData.rows.length} expense
              {exportData.rows.length !== 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {!exportData?.rows?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No deductible expenses for {year}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                    style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                  >
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {exportData.rows.map((row: TaxExportRow, i: number) => (
                    <tr
                      key={`${row.date}-${row.vendor}-${i}`}
                      className="border-b"
                      style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                    >
                      <td className="px-4 py-2.5 text-gray-400">
                        {new Date(row.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-gray-300">
                        {row.vendor}
                        {row.description && (
                          <span className="ml-2 text-xs text-gray-500">
                            {row.description}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">
                        {row.category}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor:
                              row.source === "Manual"
                                ? "rgba(212, 175, 55, 0.1)"
                                : "rgba(156, 163, 175, 0.1)",
                            color:
                              row.source === "Manual" ? "#D4AF37" : "#9ca3af",
                          }}
                        >
                          {row.source}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-medium text-white">
                        ${formatCents(row.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
