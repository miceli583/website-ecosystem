"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  ArrowLeft,
  AlertCircle,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Plus,
  X,
  Pencil,
  Trash2,
  Tag,
  CheckCircle2,
  Sparkles,
  Check,
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

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

function ExpenseForm({
  categories,
  onClose,
  editExpense,
}: {
  categories: Array<{ id: number; name: string }>;
  onClose: () => void;
  editExpense?: {
    id: number;
    categoryId: number;
    amount: number;
    vendor: string;
    description: string | null;
    date: string;
    isTaxDeductible: boolean;
    receiptUrl: string | null;
  };
}) {
  const [vendor, setVendor] = useState(editExpense?.vendor ?? "");
  const [amount, setAmount] = useState(
    editExpense ? (editExpense.amount / 100).toFixed(2) : ""
  );
  const [categoryId, setCategoryId] = useState(
    editExpense?.categoryId?.toString() ?? ""
  );
  const [date, setDate] = useState(
    editExpense?.date ?? new Date().toISOString().split("T")[0]!
  );
  const [description, setDescription] = useState(
    editExpense?.description ?? ""
  );
  const [isTaxDeductible, setIsTaxDeductible] = useState(
    editExpense?.isTaxDeductible ?? false
  );

  const utils = api.useUtils();
  const createExpense = api.finance.createExpense.useMutation({
    onSuccess: () => {
      void utils.finance.getExpenses.invalidate();
      onClose();
    },
  });
  const updateExpense = api.finance.updateExpense.useMutation({
    onSuccess: () => {
      void utils.finance.getExpenses.invalidate();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = Math.round(parseFloat(amount) * 100);
    if (!amountCents || !categoryId || !vendor || !date) return;

    const data = {
      categoryId: parseInt(categoryId),
      amount: amountCents,
      vendor,
      description: description || undefined,
      date,
      isTaxDeductible,
    };

    if (editExpense) {
      updateExpense.mutate({ id: editExpense.id, ...data });
    } else {
      createExpense.mutate(data);
    }
  };

  const isPending = createExpense.isPending || updateExpense.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-white/5 p-4"
      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">
          {editExpense ? "Edit Expense" : "Add Expense"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Vendor</label>
          <input
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            placeholder="e.g. Vercel"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            placeholder="20.00"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-white"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-white"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            placeholder="Optional"
          />
        </div>
        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isTaxDeductible}
              onChange={(e) => setIsTaxDeductible(e.target.checked)}
              className="rounded"
            />
            Tax deductible
          </label>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded px-3 py-1.5 text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded px-4 py-1.5 text-sm font-medium text-black transition-opacity disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
          }}
        >
          {isPending
            ? "Saving..."
            : editExpense
              ? "Update Expense"
              : "Add Expense"}
        </button>
      </div>
    </form>
  );
}

function MercuryCategoryCell({
  txId,
  categories,
  currentCategory,
}: {
  txId: string;
  categories: Array<{ id: number; name: string }>;
  currentCategory?: {
    categoryId: number;
    isTaxDeductible: boolean;
  };
}) {
  const utils = api.useUtils();
  const categorize = api.finance.categorizeMercuryTransaction.useMutation({
    onSuccess: () => {
      void utils.finance.getMercuryTransactionCategories.invalidate();
    },
  });

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentCategory?.categoryId ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) return;
          categorize.mutate({
            mercuryTransactionId: txId,
            categoryId: parseInt(val),
            isTaxDeductible: currentCategory?.isTaxDeductible ?? false,
          });
        }}
        className="rounded border bg-white/5 px-2 py-1 text-xs text-gray-300"
        style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
      >
        <option value="">—</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {currentCategory && (
        <button
          onClick={() => {
            categorize.mutate({
              mercuryTransactionId: txId,
              categoryId: currentCategory.categoryId,
              isTaxDeductible: !currentCategory.isTaxDeductible,
            });
          }}
          title={
            currentCategory.isTaxDeductible
              ? "Marked as tax deductible"
              : "Not tax deductible"
          }
          className="text-xs"
        >
          {currentCategory.isTaxDeductible ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Tag className="h-3.5 w-3.5 text-gray-500" />
          )}
        </button>
      )}
    </div>
  );
}

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<{
    id: number;
    categoryId: number;
    amount: number;
    vendor: string;
    description: string | null;
    date: string;
    isTaxDeductible: boolean;
    receiptUrl: string | null;
  } | null>(null);

  const { data: balances, isLoading: balancesLoading } =
    api.finance.getMercuryBalances.useQuery();
  const { data: txData, isLoading: txLoading } =
    api.finance.getMercuryTransactions.useQuery({ limit: 50 });
  const { data: categories } = api.finance.getExpenseCategories.useQuery();
  const { data: manualExpenses, isLoading: expensesLoading } =
    api.finance.getExpenses.useQuery({});

  // Get Mercury transaction categorizations
  const txIds = txData?.transactions?.map(
    (tx: { id: string }) => tx.id
  ) ?? [];
  const { data: txCategories } =
    api.finance.getMercuryTransactionCategories.useQuery(
      { transactionIds: txIds },
      { enabled: txIds.length > 0 }
    );

  const txCatMap = new Map<
    string,
    { categoryId: number; isTaxDeductible: boolean }
  >(
    txCategories?.map(
      (c: {
        mercuryTransactionId: string;
        categoryId: number;
        isTaxDeductible: boolean;
      }) => [
        c.mercuryTransactionId,
        { categoryId: c.categoryId, isTaxDeductible: c.isTaxDeductible },
      ]
    )
  );

  const [showSuggestions, setShowSuggestions] = useState(false);

  const utils = api.useUtils();
  const deleteExpense = api.finance.deleteExpense.useMutation({
    onSuccess: () => void utils.finance.getExpenses.invalidate(),
  });
  const seedCategories = api.finance.seedExpenseCategories.useMutation({
    onSuccess: () => void utils.finance.getExpenseCategories.invalidate(),
  });

  // Auto-categorization
  const autoCategorizeDry = api.finance.autoCategorizeMercuryTransactions.useMutation({
    onSuccess: () => setShowSuggestions(true),
  });
  const autoCategorizeApply = api.finance.autoCategorizeMercuryTransactions.useMutation({
    onSuccess: () => {
      setShowSuggestions(false);
      void utils.finance.getMercuryTransactionCategories.invalidate();
    },
  });

  const cats = categories ?? [];

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
              Expenses & Banking
            </h1>
            <p className="text-sm text-gray-400">
              Mercury bank accounts, manual expenses, and categorization
            </p>
          </div>
          <div className="flex gap-2">
            {cats.length === 0 && (
              <button
                onClick={() => seedCategories.mutate()}
                disabled={seedCategories.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37" }}
              >
                Seed Categories
              </button>
            )}
            <button
              onClick={() => autoCategorizeDry.mutate({ apply: false })}
              disabled={autoCategorizeDry.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)", color: "#D4AF37" }}
            >
              <Sparkles className="h-4 w-4" />
              {autoCategorizeDry.isPending ? "Scanning..." : "Auto-Categorize"}
            </button>
            <button
              onClick={() => {
                setEditingExpense(null);
                setShowForm(!showForm);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-black"
              style={{
                background:
                  "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Expense Form */}
      {(showForm || editingExpense) && cats.length > 0 && (
        <ExpenseForm
          categories={cats}
          editExpense={editingExpense ?? undefined}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}

      {/* Auto-Categorization Suggestions */}
      {showSuggestions && autoCategorizeDry.data && (
        <div
          className="rounded-lg border bg-white/5 p-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: "#D4AF37" }} />
              <h3 className="font-semibold text-white">
                Smart Categorization Suggestions
              </h3>
              <span className="text-xs text-gray-400">
                {autoCategorizeDry.data.suggestions.length} suggestions
                {autoCategorizeDry.data.skipped > 0 &&
                  ` · ${autoCategorizeDry.data.skipped} already categorized`}
              </span>
            </div>
            <div className="flex gap-2">
              {autoCategorizeDry.data.suggestions.length > 0 && (
                <button
                  onClick={() =>
                    autoCategorizeApply.mutate({ apply: true })
                  }
                  disabled={autoCategorizeApply.isPending}
                  className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium text-black"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                  {autoCategorizeApply.isPending
                    ? "Applying..."
                    : `Apply All (${autoCategorizeDry.data.suggestions.length})`}
                </button>
              )}
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {autoCategorizeDry.data.suggestions.length === 0 ? (
            <p className="text-sm text-gray-500">
              All Mercury transactions are already categorized, or no matching
              rules found for uncategorized transactions.
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500" style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}>
                    <th className="px-3 py-2">Counterparty</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Suggested Category</th>
                    <th className="px-3 py-2">Deductible</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {autoCategorizeDry.data.suggestions.map(
                    (s: {
                      transactionId: string;
                      counterparty: string | null;
                      description: string | null;
                      amount: number;
                      suggestedCategory: string;
                      isTaxDeductible: boolean;
                      date: string | null;
                    }) => (
                      <tr
                        key={s.transactionId}
                        className="border-b"
                        style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                      >
                        <td className="px-3 py-1.5 text-gray-300">
                          {s.counterparty ?? s.description ?? "Unknown"}
                        </td>
                        <td className="px-3 py-1.5 text-gray-400">
                          {s.date
                            ? new Date(s.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-3 py-1.5">
                          <span
                            className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: "rgba(212, 175, 55, 0.1)",
                              color: "#D4AF37",
                            }}
                          >
                            {s.suggestedCategory}
                          </span>
                        </td>
                        <td className="px-3 py-1.5">
                          {s.isTaxDeductible ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <span className="text-xs text-gray-500">No</span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-right font-medium text-white">
                          ${Math.abs(s.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
                    <p className="mt-1 text-xs capitalize text-gray-500">
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

      {/* Manual Expenses */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Manual Expenses</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {expensesLoading ? (
            <TableSkeleton />
          ) : !manualExpenses?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No manual expenses recorded. Click &quot;Add Expense&quot; to get
              started.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Deductible</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {manualExpenses.map((exp: {
                  id: number;
                  categoryId: number;
                  categoryName: string | null;
                  amount: number;
                  vendor: string;
                  description: string | null;
                  date: string;
                  isTaxDeductible: boolean;
                  receiptUrl: string | null;
                  createdAt: Date | null;
                }) => (
                  <tr
                    key={exp.id}
                    className="border-b"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-2.5 text-gray-300">
                      <div>
                        {exp.vendor}
                        {exp.description && (
                          <span className="ml-2 text-xs text-gray-500">
                            {exp.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {exp.categoryName ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-4 py-2.5">
                      {exp.isTaxDeductible ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <span className="text-xs text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-white">
                      ${formatCents(exp.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() =>
                            setEditingExpense({
                              id: exp.id,
                              categoryId: exp.categoryId,
                              amount: exp.amount,
                              vendor: exp.vendor,
                              description: exp.description,
                              date: exp.date,
                              isTaxDeductible: exp.isTaxDeductible,
                              receiptUrl: exp.receiptUrl,
                            })
                          }
                          className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this expense?")) {
                              deleteExpense.mutate({ id: exp.id });
                            }
                          }}
                          className="rounded p-1 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mercury Transactions */}
      <div>
        <h2 className="mb-3 font-semibold text-white">
          Mercury Transactions
        </h2>
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
            <div className="overflow-x-auto">
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
                    <th className="px-4 py-3">Category</th>
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
                                tx.status === "sent" ||
                                tx.status === "received"
                                  ? "rgba(74, 222, 128, 0.1)"
                                  : tx.status === "pending"
                                    ? "rgba(250, 204, 21, 0.1)"
                                    : "rgba(156, 163, 175, 0.1)",
                              color:
                                tx.status === "sent" ||
                                tx.status === "received"
                                  ? "#4ade80"
                                  : tx.status === "pending"
                                    ? "#facc15"
                                    : "#9ca3af",
                            }}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <MercuryCategoryCell
                            txId={tx.id}
                            categories={cats}
                            currentCategory={txCatMap.get(tx.id)}
                          />
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
            </div>
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
