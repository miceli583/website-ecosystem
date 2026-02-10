"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  ChevronDown,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Date range presets
// ---------------------------------------------------------------------------
type DatePreset = "all" | "week" | "month" | "quarter" | "year" | "custom";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i);

function getDateRange(
  preset: DatePreset,
  selectedYear?: number
): { start: string; end: string } {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0]!;
  const today = fmt(now);

  switch (preset) {
    case "all":
      return { start: "", end: "" };
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return { start: fmt(d), end: today };
    }
    case "month": {
      const d = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: fmt(d), end: today };
    }
    case "quarter": {
      const q = Math.floor(now.getMonth() / 3) * 3;
      const d = new Date(now.getFullYear(), q, 1);
      return { start: fmt(d), end: today };
    }
    case "year": {
      const yr = selectedYear ?? now.getFullYear();
      const start = fmt(new Date(yr, 0, 1));
      // If selected year is current year, end = today; otherwise end of that year
      const end =
        yr === now.getFullYear()
          ? today
          : fmt(new Date(yr + 1, 0, 1));
      return { start, end };
    }
    case "custom":
      return { start: "", end: "" };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function formatDollars(dollars: number) {
  return Math.abs(dollars).toLocaleString("en-US", {
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

// ---------------------------------------------------------------------------
// Expense / Revenue Form
// ---------------------------------------------------------------------------

function ExpenseForm({
  categories,
  onClose,
  onCategoryCreated,
  editExpense,
}: {
  categories: Array<{ id: number; name: string }>;
  onClose: () => void;
  onCategoryCreated: () => void;
  editExpense?: {
    id: number;
    categoryId: number;
    amount: number;
    vendor: string;
    description: string | null;
    date: string;
    type: string;
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
  const [entryType, setEntryType] = useState<"expense" | "revenue">(
    (editExpense?.type as "expense" | "revenue") ?? "expense"
  );
  const [isTaxDeductible, setIsTaxDeductible] = useState(
    editExpense?.isTaxDeductible ?? false
  );

  // Inline category creation
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
  const createCategory = api.finance.createExpenseCategory.useMutation({
    onSuccess: (data) => {
      if (data) {
        setCategoryId(data.id.toString());
        setShowNewCategory(false);
        setNewCategoryName("");
        onCategoryCreated();
      }
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
      type: entryType,
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
          {editExpense
            ? `Edit ${entryType === "revenue" ? "Revenue" : "Expense"}`
            : `Add ${entryType === "revenue" ? "Revenue" : "Expense"}`}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Type toggle */}
      <div className="mb-3 flex gap-1 rounded-lg bg-white/5 p-0.5" style={{ width: "fit-content" }}>
        <button
          type="button"
          onClick={() => setEntryType("expense")}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            entryType === "expense"
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setEntryType("revenue")}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            entryType === "revenue"
              ? "text-green-400"
              : "text-gray-400 hover:text-white"
          }`}
          style={entryType === "revenue" ? { backgroundColor: "rgba(74, 222, 128, 0.1)" } : undefined}
        >
          Revenue
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-gray-400">
            {entryType === "revenue" ? "Source" : "Vendor"}
          </label>
          <input
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            placeholder={entryType === "revenue" ? "e.g. Client payment" : "e.g. Vercel"}
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
          {showNewCategory ? (
            <div className="flex gap-1">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-500"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                placeholder="Category name"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (newCategoryName.trim()) {
                    createCategory.mutate({ name: newCategoryName.trim() });
                  }
                }}
                disabled={createCategory.isPending || !newCategoryName.trim()}
                className="rounded px-2 text-xs font-medium disabled:opacity-50"
                style={{ color: "#D4AF37" }}
              >
                {createCategory.isPending ? "..." : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategoryName("");
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setShowNewCategory(true);
                } else {
                  setCategoryId(e.target.value);
                }
              }}
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
              <option value="__new__">+ Add new category</option>
            </select>
          )}
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
              ? "Update"
              : `Add ${entryType === "revenue" ? "Revenue" : "Expense"}`}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Mercury Category Cell (inline categorization)
// ---------------------------------------------------------------------------

function MercuryCategoryCell({
  txId,
  counterpartyName,
  categories,
  currentCategory,
  onCategorize,
  onCategoryCreated,
}: {
  txId: string;
  counterpartyName?: string | null;
  categories: Array<{ id: number; name: string }>;
  currentCategory?: {
    categoryId: number;
    isTaxDeductible: boolean;
  };
  onCategorize: (params: {
    mercuryTransactionId: string;
    categoryId: number;
    isTaxDeductible: boolean;
    counterpartyName?: string;
  }) => void;
  onCategoryCreated: () => void;
}) {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const createCategory = api.finance.createExpenseCategory.useMutation({
    onSuccess: (data) => {
      if (data) {
        onCategorize({
          mercuryTransactionId: txId,
          categoryId: data.id,
          isTaxDeductible: true,
          counterpartyName: counterpartyName ?? undefined,
        });
        setShowNewCategory(false);
        setNewCategoryName("");
        onCategoryCreated();
      }
    },
  });

  if (showNewCategory) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="w-24 rounded border bg-white/5 px-2 py-0.5 text-xs text-white placeholder:text-gray-500"
          style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          placeholder="Name"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && newCategoryName.trim()) {
              createCategory.mutate({ name: newCategoryName.trim() });
            }
            if (e.key === "Escape") {
              setShowNewCategory(false);
              setNewCategoryName("");
            }
          }}
        />
        <button
          onClick={() => {
            if (newCategoryName.trim()) {
              createCategory.mutate({ name: newCategoryName.trim() });
            }
          }}
          disabled={createCategory.isPending}
          className="text-xs"
          style={{ color: "#D4AF37" }}
        >
          {createCategory.isPending ? "..." : "Add"}
        </button>
        <button
          onClick={() => {
            setShowNewCategory(false);
            setNewCategoryName("");
          }}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentCategory?.categoryId ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "__new__") {
            setShowNewCategory(true);
            return;
          }
          if (!val) return;
          onCategorize({
            mercuryTransactionId: txId,
            categoryId: parseInt(val),
            isTaxDeductible: currentCategory?.isTaxDeductible ?? true,
            counterpartyName: counterpartyName ?? undefined,
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
        <option value="__new__">+ New category</option>
      </select>
      {currentCategory && (
        <button
          onClick={() => {
            onCategorize({
              mercuryTransactionId: txId,
              categoryId: currentCategory.categoryId,
              isTaxDeductible: !currentCategory.isTaxDeductible,
              counterpartyName: counterpartyName ?? undefined,
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

// ---------------------------------------------------------------------------
// Mercury Transaction type
// ---------------------------------------------------------------------------
interface MercuryTx {
  id: string;
  amount: number;
  description: string;
  counterparty: string | null;
  status: string;
  postedAt: string | null;
  createdAt: string | null;
  kind: string;
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<{
    id: number;
    categoryId: number;
    amount: number;
    vendor: string;
    description: string | null;
    date: string;
    type: string;
    isTaxDeductible: boolean;
    receiptUrl: string | null;
  } | null>(null);

  // Date range state
  const [datePreset, setDatePreset] = useState<DatePreset>("year");
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const dateRange = useMemo(() => {
    if (datePreset === "custom") {
      return { start: customStart || undefined, end: customEnd || undefined };
    }
    const range = getDateRange(datePreset, selectedYear);
    return { start: range.start || undefined, end: range.end || undefined };
  }, [datePreset, selectedYear, customStart, customEnd]);

  // Income/expense filter for Mercury
  const [txFilter, setTxFilter] = useState<"all" | "income" | "expenses">("all");

  // Pagination
  const txLimit = 50;
  const [allTransactions, setAllTransactions] = useState<MercuryTx[]>([]);
  const [txOffset, setTxOffset] = useState(0);
  // Track the dateRange key to detect when filters change
  const dateRangeKey = `${dateRange.start ?? ""}-${dateRange.end ?? ""}`;
  const prevDateRangeKeyRef = useRef(dateRangeKey);

  const { data: balances, isLoading: balancesLoading } =
    api.finance.getMercuryBalances.useQuery();

  const { data: txData, isLoading: txLoading, isFetching: txFetching } =
    api.finance.getMercuryTransactions.useQuery({
      limit: txLimit,
      offset: txOffset,
      start: dateRange.start,
      end: dateRange.end,
    });

  // Server-side summary for accurate totals across full date range
  const { data: txSummary } = api.finance.getMercuryTransactionSummary.useQuery({
    start: dateRange.start,
    end: dateRange.end,
  });

  // Sync fetched data into allTransactions — reset on date change, append on pagination
  useEffect(() => {
    if (!txData) return;
    const dateChanged = prevDateRangeKeyRef.current !== dateRangeKey;
    prevDateRangeKeyRef.current = dateRangeKey;

    if (dateChanged || txOffset === 0) {
      // Fresh data for new date range
      setAllTransactions(txData.transactions);
    } else {
      // Append paginated results
      setAllTransactions((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTxs = txData.transactions.filter(
          (t: MercuryTx) => !existingIds.has(t.id)
        );
        return [...prev, ...newTxs];
      });
    }
  }, [txData, txOffset, dateRangeKey]);

  const { data: categories } = api.finance.getExpenseCategories.useQuery();
  const { data: manualExpenses, isLoading: expensesLoading } =
    api.finance.getExpenses.useQuery({});

  // Get Mercury transaction categorizations
  const txIds = allTransactions.map((tx) => tx.id);
  const { data: txCategories } =
    api.finance.getMercuryTransactionCategories.useQuery(
      { transactionIds: txIds },
      { enabled: txIds.length > 0 }
    );

  // Local optimistic overrides for categorizations (instant UI feedback)
  const [localCatOverrides, setLocalCatOverrides] = useState<
    Map<string, { categoryId: number; isTaxDeductible: boolean }>
  >(new Map());

  const txCatMap = useMemo(() => {
    const base = new Map<
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
    // Apply local overrides on top
    for (const [txId, override] of localCatOverrides) {
      base.set(txId, override);
    }
    return base;
  }, [txCategories, localCatOverrides]);

  // Filter transactions client-side by income/expense
  const filteredTransactions = useMemo(() => {
    if (txFilter === "all") return allTransactions;
    if (txFilter === "income") return allTransactions.filter((t) => t.amount >= 0);
    return allTransactions.filter((t) => t.amount < 0);
  }, [allTransactions, txFilter]);

  // Mercury summary totals from server (covers all transactions, not just loaded page)
  const mercuryTotals = useMemo(() => {
    if (txSummary) {
      return {
        totalIncome: txSummary.totalIncome,
        totalExpenses: txSummary.totalExpenses,
        net: txSummary.net,
        count: txSummary.count,
      };
    }
    return { totalIncome: 0, totalExpenses: 0, net: 0, count: 0 };
  }, [txSummary]);

  // Manual entry totals (amounts in cents)
  const manualTotals = useMemo(() => {
    if (!manualExpenses?.length) return { expenses: 0, revenue: 0, count: 0 };
    let expenses = 0;
    let revenue = 0;
    for (const exp of manualExpenses as Array<{ amount: number; type: string }>) {
      if (exp.type === "revenue") {
        revenue += exp.amount;
      } else {
        expenses += exp.amount;
      }
    }
    return { expenses, revenue, count: manualExpenses.length };
  }, [manualExpenses]);

  // Combined aggregate (convert manual cents to dollars for unified view)
  const aggregateTotals = useMemo(() => {
    const mercExpenses = mercuryTotals.totalExpenses;
    const mercIncome = mercuryTotals.totalIncome;
    const manualExpensesDollars = manualTotals.expenses / 100;
    const manualRevenueDollars = manualTotals.revenue / 100;

    const totalExpenses = mercExpenses + manualExpensesDollars;
    const totalIncome = mercIncome + manualRevenueDollars;
    return {
      totalExpenses,
      totalIncome,
      net: totalIncome - totalExpenses,
      mercuryExpenses: mercExpenses,
      mercuryIncome: mercIncome,
      manualExpenses: manualExpensesDollars,
      manualRevenue: manualRevenueDollars,
      totalEntries: mercuryTotals.count + manualTotals.count,
    };
  }, [mercuryTotals, manualTotals]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const utils = api.useUtils();
  const deleteExpense = api.finance.deleteExpense.useMutation({
    onSuccess: () => void utils.finance.getExpenses.invalidate(),
  });
  const seedCategories = api.finance.seedExpenseCategories.useMutation({
    onSuccess: () => void utils.finance.getExpenseCategories.invalidate(),
  });

  // Parent-level categorize mutation — instant optimistic update
  const categorizeMutation = api.finance.categorizeMercuryTransaction.useMutation({
    onSuccess: () => {
      // Background refetch, don't block UI
      void utils.finance.getMercuryTransactionCategories.invalidate();
    },
  });

  const handleCategorize = (params: {
    mercuryTransactionId: string;
    categoryId: number;
    isTaxDeductible: boolean;
    counterpartyName?: string;
  }) => {
    // Instant optimistic update
    setLocalCatOverrides((prev) => {
      const next = new Map(prev);
      next.set(params.mercuryTransactionId, {
        categoryId: params.categoryId,
        isTaxDeductible: params.isTaxDeductible,
      });
      return next;
    });
    // Fire mutation in background
    categorizeMutation.mutate(params);
  };

  const handleCategoryCreated = () => {
    void utils.finance.getExpenseCategories.invalidate();
  };

  // Auto-categorization
  const autoCategorizeDry =
    api.finance.autoCategorizeMercuryTransactions.useMutation({
      onSuccess: () => setShowSuggestions(true),
    });
  const autoCategorizeApply =
    api.finance.autoCategorizeMercuryTransactions.useMutation({
      onSuccess: () => {
        setShowSuggestions(false);
        void utils.finance.getMercuryTransactionCategories.invalidate();
      },
    });

  const cats = categories ?? [];

  // Reset pagination when date range changes
  const handleDatePresetChange = (preset: DatePreset) => {
    setAllTransactions([]);
    setTxOffset(0);
    setDatePreset(preset);
  };

  const handleYearChange = (yr: number) => {
    setAllTransactions([]);
    setTxOffset(0);
    setSelectedYear(yr);
  };

  const handleLoadMore = () => {
    setTxOffset((prev) => prev + txLimit);
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
                style={{
                  borderColor: "rgba(212, 175, 55, 0.2)",
                  color: "#D4AF37",
                }}
              >
                Seed Categories
              </button>
            )}
            <button
              onClick={() => autoCategorizeDry.mutate({ apply: false })}
              disabled={autoCategorizeDry.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-white/5"
              style={{
                borderColor: "rgba(212, 175, 55, 0.2)",
                color: "#D4AF37",
              }}
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
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Expense Form */}
      {(showForm || editingExpense) && cats.length > 0 && (
        <ExpenseForm
          categories={cats}
          editExpense={editingExpense ?? undefined}
          onCategoryCreated={handleCategoryCreated}
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
                  <tr
                    className="border-b text-left text-xs uppercase tracking-wider text-gray-500"
                    style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                  >
                    <th className="px-3 py-2">Counterparty</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Suggested Category</th>
                    <th className="px-3 py-2">Source</th>
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
                      source?: string;
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
                        <td className="px-3 py-1.5 text-xs text-gray-500">
                          {s.source === "db" ? "Learned" : "Rule"}
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
                "Add MERCURY_API_KEY to your environment. Get one from Mercury Settings \u2192 Tokens."}
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

      {/* Aggregate Summary */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Expense Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Expenses */}
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingDown className="h-4 w-4 text-red-400" />
              Total Expenses
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              ${formatDollars(aggregateTotals.totalExpenses)}
            </p>
            <div className="mt-2 space-y-0.5 text-xs text-gray-500">
              <p>Mercury: ${formatDollars(aggregateTotals.mercuryExpenses)}</p>
              <p>Manual: ${formatDollars(aggregateTotals.manualExpenses)}</p>
            </div>
          </div>

          {/* Total Income */}
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Total Income
            </div>
            <p className="mt-2 text-2xl font-bold text-green-400">
              ${formatDollars(aggregateTotals.totalIncome)}
            </p>
            <div className="mt-2 space-y-0.5 text-xs text-gray-500">
              <p>Mercury: ${formatDollars(aggregateTotals.mercuryIncome)}</p>
              <p>Manual: ${formatDollars(aggregateTotals.manualRevenue)}</p>
            </div>
          </div>

          {/* Net */}
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Net
            </div>
            <p
              className={`mt-2 text-2xl font-bold ${aggregateTotals.net >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {aggregateTotals.net >= 0 ? "+" : "-"}$
              {formatDollars(aggregateTotals.net)}
            </p>
          </div>

          {/* Entries Count */}
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Receipt className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Total Entries
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              {aggregateTotals.totalEntries}
            </p>
            <div className="mt-2 space-y-0.5 text-xs text-gray-500">
              <p>Mercury: {mercuryTotals.count}</p>
              <p>Manual: {manualTotals.count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Expenses */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Manual Entries</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {expensesLoading ? (
            <TableSkeleton />
          ) : !manualExpenses?.length ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No manual entries recorded. Click &quot;Add Entry&quot; to get
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
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Deductible</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {manualExpenses.map(
                  (exp: {
                    id: number;
                    categoryId: number;
                    categoryName: string | null;
                    amount: number;
                    vendor: string;
                    description: string | null;
                    date: string;
                    type: string;
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
                        {exp.type === "revenue" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <TrendingUp className="h-3 w-3" />
                            Revenue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <TrendingDown className="h-3 w-3" />
                            Expense
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {exp.isTaxDeductible ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <span className="text-xs text-gray-500">No</span>
                        )}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right font-medium ${
                          exp.type === "revenue" ? "text-green-400" : "text-white"
                        }`}
                      >
                        {exp.type === "revenue" ? "+" : ""}$
                        {formatCents(exp.amount)}
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
                                type: exp.type,
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
                              if (confirm("Delete this entry?")) {
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
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mercury Transactions */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-white">Mercury Transactions</h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Date range presets */}
            <div className="flex gap-0.5 rounded-lg bg-white/5 p-0.5">
              {(["week", "month", "quarter", "year"] as DatePreset[]).map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() => handleDatePresetChange(preset)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      datePreset === preset
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </button>
                )
              )}
              <button
                onClick={() => handleDatePresetChange("custom")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  datePreset === "custom"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Custom
              </button>
            </div>

            {/* Year selector */}
            {datePreset === "year" && (
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="rounded-lg border bg-white/5 px-2 py-1 text-xs text-white"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}

            {/* Custom date inputs */}
            {datePreset === "custom" && (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    setTxOffset(0);
                    setAllTransactions([]);
                  }}
                  className="rounded border bg-white/5 px-2 py-1 text-xs text-white"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                />
                <span className="text-xs text-gray-500">to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    setTxOffset(0);
                    setAllTransactions([]);
                  }}
                  className="rounded border bg-white/5 px-2 py-1 text-xs text-white"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                />
              </div>
            )}

            {/* Income/expense filter */}
            <div className="flex gap-0.5 rounded-lg bg-white/5 p-0.5">
              <button
                onClick={() => setTxFilter("all")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  txFilter === "all"
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Filter className="mr-1 inline h-3 w-3" />
                All
              </button>
              <button
                onClick={() => setTxFilter("income")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  txFilter === "income"
                    ? "text-green-400"
                    : "text-gray-400 hover:text-white"
                }`}
                style={
                  txFilter === "income"
                    ? { backgroundColor: "rgba(74, 222, 128, 0.1)" }
                    : undefined
                }
              >
                Income
              </button>
              <button
                onClick={() => setTxFilter("expenses")}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  txFilter === "expenses"
                    ? "text-red-400"
                    : "text-gray-400 hover:text-white"
                }`}
                style={
                  txFilter === "expenses"
                    ? { backgroundColor: "rgba(248, 113, 113, 0.1)" }
                    : undefined
                }
              >
                Expenses
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          {txLoading && txOffset === 0 ? (
            <TableSkeleton />
          ) : !txData?.connected || filteredTransactions.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              {txData?.connected
                ? "No transactions found for this period"
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
                  {filteredTransactions.map((tx) => (
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
                          counterpartyName={tx.counterparty}
                          categories={cats}
                          currentCategory={txCatMap.get(tx.id)}
                          onCategorize={handleCategorize}
                          onCategoryCreated={handleCategoryCreated}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Load More button */}
          {txData?.hasMore && (
            <div className="border-t p-3 text-center" style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}>
              <button
                onClick={handleLoadMore}
                disabled={txFetching}
                className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-1.5 text-sm transition-colors hover:bg-white/5"
                style={{
                  borderColor: "rgba(212, 175, 55, 0.2)",
                  color: "#D4AF37",
                }}
              >
                <ChevronDown className="h-4 w-4" />
                {txFetching ? "Loading..." : "Load More"}
              </button>
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
