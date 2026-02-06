"use client";

import Link from "next/link";
import {
  Receipt,
  ArrowLeft,
  AlertCircle,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { api } from "~/trpc/react";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
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

export default function ExpensesPage() {
  const { data: balances, isLoading: balancesLoading } =
    api.finance.getMercuryBalances.useQuery();
  const { data: txData, isLoading: txLoading } =
    api.finance.getMercuryTransactions.useQuery({ limit: 50 });

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
        <h1 className="text-2xl font-bold text-white">Expenses & Banking</h1>
        <p className="text-sm text-gray-400">
          Mercury bank accounts, transactions, and infrastructure costs
        </p>
      </div>

      {/* Mercury Connection Warning */}
      {!balancesLoading && !balances?.connected && (
        <div
          className="flex items-start gap-3 rounded-lg border p-4"
          style={{
            borderColor: "rgba(248, 113, 113, 0.3)",
            backgroundColor: "rgba(248, 113, 113, 0.05)",
          }}
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-white">Mercury not connected</p>
            <p className="mt-1 text-sm text-gray-400">
              {(balances as { error?: string })?.error ??
                "Add MERCURY_API_KEY to your environment. Get one from Mercury Settings → Tokens."}
            </p>
          </div>
        </div>
      )}

      {/* Mercury Balances */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Bank Accounts</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {balancesLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border bg-white/5 p-5"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="mt-3 h-8 w-28 rounded bg-white/10" />
              </div>
            ))
          ) : balances?.connected && balances.accounts.length > 0 ? (
            <>
              {balances.accounts.map(
                (account: {
                  id: string;
                  name: string;
                  type: string;
                  available: number;
                }) => (
                  <div
                    key={account.id}
                    className="rounded-lg border bg-white/5 p-5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Landmark
                        className="h-4 w-4"
                        style={{ color: "#D4AF37" }}
                      />
                      {account.name}
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">
                      $
                      {account.available.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 capitalize">
                      {account.type} account
                    </p>
                  </div>
                )
              )}
              <div
                className="rounded-lg border bg-white/5 p-5"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Receipt
                    className="h-4 w-4"
                    style={{ color: "#D4AF37" }}
                  />
                  Total Available
                </div>
                <p className="mt-2 text-2xl font-bold text-white">
                  $
                  {balances.totalAvailable.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Across {balances.accounts.length} account
                  {balances.accounts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          ) : (
            <div
              className="col-span-full rounded-lg border bg-white/5 p-6 text-center text-sm text-gray-500"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              No Mercury accounts connected
            </div>
          )}
        </div>
      </div>

      {/* Mercury Transactions */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Recent Transactions</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {txLoading ? (
            <TableSkeleton />
          ) : !txData?.connected || !txData?.transactions?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              {txData?.connected
                ? "No transactions found"
                : "Connect Mercury to view transactions"}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Counterparty</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {txData.transactions.map(
                  (tx: {
                    id: string;
                    amount: number;
                    description: string;
                    counterparty: string | null;
                    status: string;
                    postedAt: string | null;
                    createdAt: string | null;
                    kind: string;
                  }) => (
                    <tr
                      key={tx.id}
                      className="border-b"
                      style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                    >
                      <td className="px-4 py-2.5 text-gray-300">
                        <span className="flex items-center gap-1.5">
                          {tx.amount >= 0 ? (
                            <ArrowDownLeft className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <ArrowUpRight className="h-3.5 w-3.5 text-red-400" />
                          )}
                          {tx.description}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">
                        {tx.counterparty ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(tx.postedAt ?? tx.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor:
                              tx.status === "sent" || tx.status === "received"
                                ? "rgba(74, 222, 128, 0.1)"
                                : tx.status === "pending"
                                  ? "rgba(250, 204, 21, 0.1)"
                                  : "rgba(156, 163, 175, 0.1)",
                            color:
                              tx.status === "sent" || tx.status === "received"
                                ? "#4ade80"
                                : tx.status === "pending"
                                  ? "#facc15"
                                  : "#9ca3af",
                          }}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-medium ${tx.amount >= 0 ? "text-green-400" : "text-white"}`}
                      >
                        {tx.amount >= 0 ? "+" : ""}$
                        {Math.abs(tx.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Infrastructure Costs */}
      <div>
        <h2 className="mb-3 font-semibold text-white">
          Estimated Infrastructure Costs
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
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3 text-right">Monthly Est.</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="border-b"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                <td className="px-4 py-2 text-gray-400">Hosting</td>
                <td className="px-4 py-2 text-gray-300">Vercel Pro</td>
                <td className="px-4 py-2 text-right text-gray-300">$20</td>
              </tr>
              <tr
                className="border-b"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                <td className="px-4 py-2 text-gray-400">Database</td>
                <td className="px-4 py-2 text-gray-300">Supabase</td>
                <td className="px-4 py-2 text-right text-gray-300">$0–25</td>
              </tr>
              <tr
                className="border-b"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                <td className="px-4 py-2 text-gray-400">Domains</td>
                <td className="px-4 py-2 text-gray-300">3 domains</td>
                <td className="px-4 py-2 text-right text-gray-300">~$3</td>
              </tr>
              <tr
                className="border-b"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                <td className="px-4 py-2 text-gray-400">Email</td>
                <td className="px-4 py-2 text-gray-300">Resend</td>
                <td className="px-4 py-2 text-right text-gray-300">$0</td>
              </tr>
              <tr
                className="border-b"
                style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
              >
                <td className="px-4 py-2 text-gray-400">Automation</td>
                <td className="px-4 py-2 text-gray-300">Make.com</td>
                <td className="px-4 py-2 text-right text-gray-300">$0</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-white" colSpan={2}>
                  Total Estimated
                </td>
                <td className="px-4 py-2 text-right font-medium text-white">
                  $23–48
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
