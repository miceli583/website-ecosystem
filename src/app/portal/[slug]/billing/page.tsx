"use client";

import { use, useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import {
  ConfirmDialog,
  SearchFilterBar,
  ProjectGroupHeader,
  ListContainer,
  ProposalModal,
  type SortOrder,
  type ViewMode,
  type FilterOption,
  type ProposalMetadata,
  useTabFilters,
} from "~/components/portal";
import {
  DollarSign,
  Loader2,
  AlertCircle,
  CreditCard,
  Receipt,
  ExternalLink,
  Download,
  RefreshCw,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Search,
  ChevronDown,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(timestamp: number | null | undefined) {
  if (!timestamp) return "—";
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusBadge(status: string | null) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  switch (status) {
    case "paid":
      return (
        <span className={`${base} bg-green-900/50 text-green-400`}>Paid</span>
      );
    case "open":
      return (
        <span className={`${base} bg-[#D4AF37]/15 text-[#D4AF37]`}>Open</span>
      );
    case "draft":
      return (
        <span className={`${base} bg-white/10 text-gray-400`}>Draft</span>
      );
    case "uncollectible":
      return (
        <span className={`${base} bg-red-900/50 text-red-400`}>
          Uncollectible
        </span>
      );
    case "void":
      return (
        <span className={`${base} bg-white/10 text-gray-500`}>Void</span>
      );
    default:
      return (
        <span className={`${base} bg-white/10 text-gray-400`}>
          {status ?? "Unknown"}
        </span>
      );
  }
}

function getSubscriptionStatusBadge(
  status: string,
  cancelAtPeriodEnd?: boolean,
) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  if (cancelAtPeriodEnd && status === "active") {
    return (
      <span className={`${base} bg-[#D4AF37]/15 text-[#D4AF37]`}>
        Canceling
      </span>
    );
  }
  switch (status) {
    case "active":
      return (
        <span className={`${base} bg-green-900/50 text-green-400`}>
          Active
        </span>
      );
    case "trialing":
      return (
        <span className={`${base} bg-[#D4AF37]/15 text-[#D4AF37]`}>
          Trial
        </span>
      );
    case "past_due":
      return (
        <span className={`${base} bg-red-900/50 text-red-400`}>Past Due</span>
      );
    case "canceled":
      return (
        <span className={`${base} bg-white/10 text-gray-500`}>Canceled</span>
      );
    case "unpaid":
      return (
        <span className={`${base} bg-red-900/50 text-red-400`}>Unpaid</span>
      );
    default:
      return (
        <span className={`${base} bg-white/10 text-gray-400`}>{status}</span>
      );
  }
}

// ---------------------------------------------------------------------------
// Normalized billing item
// ---------------------------------------------------------------------------

interface NormalizedBillingItem {
  id: string;
  kind: "subscription" | "invoice" | "payment";
  title: string;
  amount: number;
  currency: string;
  status: string;
  date: number;
  proposalId: number | null;
  proposalName: string | null;
  projectId: number | null;
  projectName: string;
  subscriptionData?: {
    id: string;
    cancelAtPeriodEnd: boolean;
    trialEnd: number | null;
    currentPeriodEnd: number | null;
    startDate: number;
    items: Array<{
      id: string;
      priceId: string;
      productId: string | undefined;
      productName: string | null | undefined;
      unitAmount: number | null;
      currency: string;
      interval: string | undefined;
    }>;
  };
  invoiceData?: {
    hostedInvoiceUrl: string | null;
    invoicePdf: string | null;
    number: string | null;
    paidAt: number | null;
    dueDate: number | null;
  };
  paymentData?: {
    receiptUrl: string | null;
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PortalBillingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // Data queries
  const {
    data: client,
    isLoading,
    error,
  } = api.portal.getClientBySlug.useQuery({ slug }, { staleTime: 5 * 60 * 1000 });

  const {
    data: billing,
    isLoading: billingLoading,
    refetch: refetchBilling,
  } = api.portal.getBillingInfo.useQuery({ slug }, { staleTime: 2 * 60 * 1000 });

  const { data: resources } = api.portal.getResources.useQuery(
    { slug, section: "proposals" },
    { staleTime: 5 * 60 * 1000 },
  );

  // Persisted filter state
  const { getState, setState: persistState } = useTabFilters("billing");
  const saved = getState();

  // Filter / search state
  const [searchQuery, setSearchQuery] = useState(saved.searchQuery);
  const [sortOrder, setSortOrder] = useState<SortOrder>(saved.sortOrder);
  const [selectedProject, setSelectedProject] = useState<
    number | string | "all"
  >(saved.selectedProject);
  const [viewMode, setViewMode] = useState<ViewMode>(saved.viewMode);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(saved.collapsedGroups),
  );

  useEffect(() => {
    persistState({
      searchQuery, sortOrder, selectedProject, viewMode,
      collapsedGroups: Array.from(collapsedGroups),
    });
  }, [searchQuery, sortOrder, selectedProject, viewMode, collapsedGroups, persistState]);

  // Dialogs
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    subscriptionId: string | null;
  }>({ open: false, subscriptionId: null });

  // Proposal modal
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(
    null,
  );

  // Mutations
  const cancelMutation = api.portal.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription will cancel at period end");
      setCancelDialog({ open: false, subscriptionId: null });
      void refetchBilling();
    },
  });

  const reactivateMutation = api.portal.reactivateSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription reactivated");
      void refetchBilling();
    },
  });

  const resubscribeMutation = api.portal.resubscribe.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    },
  });

  const handleResubscribe = useCallback(
    (productId: string) => {
      const baseUrl = window.location.origin;
      resubscribeMutation.mutate({
        productId,
        successUrl: `${baseUrl}/portal/${slug}/billing?resubscribed=true&domain=live`,
        cancelUrl: `${baseUrl}/portal/${slug}/billing?domain=live`,
      });
    },
    [resubscribeMutation, slug],
  );

  // ---------------------------------------------------------------------------
  // Normalize billing items
  // ---------------------------------------------------------------------------

  const allItems = useMemo<NormalizedBillingItem[]>(() => {
    if (!billing?.hasStripeCustomer) return [];

    const items: NormalizedBillingItem[] = [];

    // Subscriptions
    for (const sub of billing.subscriptions) {
      const name = sub.items
        .map((i) => i.productName ?? i.nickname ?? "Subscription")
        .join(" + ");
      const totalAmount = sub.items.reduce(
        (sum, i) => sum + (i.unitAmount ?? 0),
        0,
      );
      items.push({
        id: `sub-${sub.id}`,
        kind: "subscription",
        title: name,
        amount: totalAmount,
        currency: sub.items[0]?.currency ?? "usd",
        status: sub.cancelAtPeriodEnd ? "cancel_at_period_end" : sub.status,
        date: sub.startDate,
        proposalId: sub.proposalId,
        proposalName: sub.proposalName,
        projectId: sub.projectId,
        projectName: sub.projectName ?? "Unassigned",
        subscriptionData: {
          id: sub.id,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          trialEnd: sub.trialEnd,
          currentPeriodEnd: sub.currentPeriodEnd,
          startDate: sub.startDate,
          items: sub.items.map((i) => ({
            id: i.id,
            priceId: i.priceId,
            productId: i.productId,
            productName: i.productName,
            unitAmount: i.unitAmount,
            currency: i.currency,
            interval: i.interval,
          })),
        },
      });
    }

    // Invoices
    for (const inv of billing.invoices) {
      items.push({
        id: `inv-${inv.id}`,
        kind: "invoice",
        title:
          inv.description ??
          inv.proposalName ??
          `Invoice ${inv.number ?? inv.id.slice(-8)}`,
        amount: inv.amountDue,
        currency: inv.currency,
        status: inv.status ?? "unknown",
        date: inv.created,
        proposalId: inv.proposalId,
        proposalName: inv.proposalName,
        projectId: inv.projectId,
        projectName: inv.projectName ?? "Unassigned",
        invoiceData: {
          hostedInvoiceUrl: inv.hostedInvoiceUrl ?? null,
          invoicePdf: inv.invoicePdf ?? null,
          number: inv.number,
          paidAt: inv.paidAt ?? null,
          dueDate: inv.dueDate,
        },
      });
    }

    // Payments
    for (const pay of billing.payments ?? []) {
      items.push({
        id: `pay-${pay.id}`,
        kind: "payment",
        title: pay.description ?? "Payment",
        amount: pay.amount,
        currency: pay.currency,
        status: pay.status,
        date: pay.created,
        proposalId: pay.proposalId ?? null,
        proposalName: null,
        projectId: pay.projectId ?? null,
        projectName: pay.projectName ?? "Unassigned",
        paymentData: {
          receiptUrl: pay.receiptUrl,
        },
      });
    }

    return items;
  }, [billing]);

  // ---------------------------------------------------------------------------
  // Filters & sorting
  // ---------------------------------------------------------------------------

  const projectFilters = useMemo<FilterOption[]>(() => {
    const map = new Map<string, FilterOption>();
    for (const item of allItems) {
      const key = item.projectId ? String(item.projectId) : "unassigned";
      if (!map.has(key)) {
        map.set(key, {
          id: item.projectId ?? "unassigned",
          name: item.projectName,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.name === "Unassigned" ? 1 : b.name === "Unassigned" ? -1 : a.name.localeCompare(b.name),
    );
  }, [allItems]);

  const filteredItems = useMemo(() => {
    let items = allItems;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.proposalName?.toLowerCase().includes(q) ?? false) ||
          i.projectName.toLowerCase().includes(q) ||
          (i.invoiceData?.number?.toLowerCase().includes(q) ?? false),
      );
    }

    // Project filter
    if (selectedProject !== "all") {
      items = items.filter((i) =>
        selectedProject === "unassigned"
          ? i.projectId === null
          : i.projectId === selectedProject,
      );
    }

    // Sort
    items = [...items].sort((a, b) => {
      if (sortOrder === "newest") return b.date - a.date;
      if (sortOrder === "oldest") return a.date - b.date;
      return a.title.localeCompare(b.title);
    });

    return items;
  }, [allItems, searchQuery, selectedProject, sortOrder]);

  // Grouped by type (for list view)
  const groupedByType = useMemo(() => {
    const subscriptions = filteredItems.filter((i) => i.kind === "subscription");
    const paid = filteredItems.filter(
      (i) =>
        (i.kind === "invoice" && i.status === "paid") ||
        (i.kind === "payment" && i.status === "succeeded"),
    );
    return [
      { label: "Subscriptions", items: subscriptions },
      { label: "Paid", items: paid },
    ].filter((g) => g.items.length > 0);
  }, [filteredItems]);

  // Grouped by project (for grouped view)
  const groupedItems = useMemo(() => {
    const groups = new Map<string, NormalizedBillingItem[]>();
    for (const item of filteredItems) {
      const key = item.projectName;
      const existing = groups.get(key) ?? [];
      existing.push(item);
      groups.set(key, existing);
    }
    // Sort groups: alphabetical, "Unassigned" last
    return Array.from(groups.entries()).sort(([a], [b]) =>
      a === "Unassigned" ? 1 : b === "Unassigned" ? -1 : a.localeCompare(b),
    );
  }, [filteredItems]);

  // Collapse helpers
  const toggleGroup = useCallback((name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const handleExpandAll = useCallback(() => setCollapsedGroups(new Set()), []);
  const handleCollapseAll = useCallback(() => {
    if (viewMode === "grouped") {
      setCollapsedGroups(new Set(groupedItems.map(([name]) => name)));
    } else {
      setCollapsedGroups(new Set(groupedByType.map((g) => g.label)));
    }
  }, [viewMode, groupedItems, groupedByType]);

  const activeGroupCount =
    viewMode === "grouped" ? groupedItems.length : groupedByType.length;
  const collapseState =
    collapsedGroups.size === 0
      ? ("all-expanded" as const)
      : collapsedGroups.size >= activeGroupCount
        ? ("all-collapsed" as const)
        : ("mixed" as const);

  const hasActiveFilters = searchQuery !== "" || selectedProject !== "all";
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedProject("all");
  }, []);

  // ---------------------------------------------------------------------------
  // Summary card data
  // ---------------------------------------------------------------------------

  const monthlyRecurring = useMemo(() => {
    return allItems
      .filter(
        (i) =>
          i.kind === "subscription" &&
          (i.status === "active" || i.status === "trialing"),
      )
      .reduce((sum, i) => sum + i.amount, 0);
  }, [allItems]);

  const totalPaid = useMemo(() => {
    const paidInvoices = allItems
      .filter((i) => i.kind === "invoice" && i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);
    const succeededPayments = allItems
      .filter((i) => i.kind === "payment" && i.status === "succeeded")
      .reduce((sum, i) => sum + i.amount, 0);
    return paidInvoices + succeededPayments;
  }, [allItems]);

  const nextPaymentDate = useMemo(() => {
    const activeSubs = allItems.filter(
      (i) =>
        i.kind === "subscription" &&
        (i.status === "active" || i.status === "trialing") &&
        i.subscriptionData?.currentPeriodEnd,
    );
    if (activeSubs.length === 0) return null;
    const earliest = Math.min(
      ...activeSubs.map((i) => i.subscriptionData!.currentPeriodEnd!),
    );
    return earliest;
  }, [allItems]);

  // ---------------------------------------------------------------------------
  // Proposal modal
  // ---------------------------------------------------------------------------

  const selectedProposal = useMemo(() => {
    if (!selectedProposalId || !resources) return null;
    return resources.find((r: { id: number }) => r.id === selectedProposalId) ?? null;
  }, [selectedProposalId, resources]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderBillingItem = (item: NormalizedBillingItem) => {
    if (item.kind === "subscription") return renderSubscription(item);
    if (item.kind === "invoice") return renderInvoice(item);
    return renderPayment(item);
  };

  const renderSubscription = (item: NormalizedBillingItem) => {
    const sub = item.subscriptionData!;
    const isActive = item.status === "active";
    const isCanceling = item.status === "cancel_at_period_end";
    const isCanceled = item.status === "canceled";
    const isTrialing = item.status === "trialing";

    return (
      <div
        key={item.id}
        className="rounded-lg border bg-white/5 p-5"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <CreditCard
                className="h-4 w-4 shrink-0"
                style={{ color: "#D4AF37" }}
              />
              <span className="font-semibold text-white">{item.title}</span>
              {getSubscriptionStatusBadge(
                isCanceling ? "active" : item.status,
                isCanceling,
              )}
            </div>
            {item.proposalName && item.proposalName !== item.title && (
              <p className="mt-0.5 pl-7 text-sm text-gray-500">
                From:{" "}
                {item.proposalId ? (
                  <button
                    onClick={() => setSelectedProposalId(item.proposalId)}
                    className="hover:underline"
                    style={{ color: "#D4AF37" }}
                  >
                    {item.proposalName}
                  </button>
                ) : (
                  item.proposalName
                )}
              </p>
            )}
            {viewMode === "list" && item.projectName !== "Unassigned" && (
              <p className="mt-0.5 pl-7 text-xs text-gray-600">
                {item.projectName}
              </p>
            )}
            {sub.items.map((si) => (
              <p key={si.id} className="mt-1 pl-7 text-sm text-gray-400">
                {si.productName ?? "Item"}:{" "}
                {si.unitAmount
                  ? formatCurrency(si.unitAmount, si.currency)
                  : "Custom pricing"}{" "}
                {si.interval && `/ ${si.interval}`}
              </p>
            ))}
          </div>
          <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
            <p>Started {formatDate(sub.startDate)}</p>
            {isTrialing && sub.trialEnd && (
              <p style={{ color: "#D4AF37" }}>
                Trial ends {formatDate(sub.trialEnd)}
              </p>
            )}
            {isCanceling && (
              <p className="flex items-center gap-1 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                Cancels at period end
              </p>
            )}
            {sub.currentPeriodEnd &&
              (isActive || isTrialing) &&
              !isCanceling && (
                <p className="text-xs text-gray-600">
                  Next billing {formatDate(sub.currentPeriodEnd)}
                </p>
              )}

            {/* Cancel */}
            {isActive && !isCanceling && (
              <button
                onClick={() =>
                  setCancelDialog({ open: true, subscriptionId: sub.id })
                }
                className="mt-1 flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel subscription
              </button>
            )}

            {/* Reactivate */}
            {isCanceling && (
              <button
                onClick={() => reactivateMutation.mutate({ subscriptionId: sub.id })}
                disabled={reactivateMutation.isPending}
                className="mt-1 flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs text-green-400 transition-colors hover:bg-green-900/20 hover:text-green-300"
              >
                {reactivateMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                Reactivate
              </button>
            )}

            {/* Resubscribe */}
            {isCanceled && sub.items[0]?.productId && (
              <button
                onClick={() => handleResubscribe(sub.items[0]!.productId!)}
                disabled={resubscribeMutation.isPending}
                className="mt-1 flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors hover:bg-[#D4AF37]/10"
                style={{ color: "#D4AF37" }}
              >
                {resubscribeMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ShoppingCart className="h-3.5 w-3.5" />
                )}
                Resubscribe
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderInvoice = (item: NormalizedBillingItem) => {
    const inv = item.invoiceData!;
    return (
      <div
        key={item.id}
        className="flex items-center justify-between rounded-lg border bg-white/5 p-4"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Receipt
              className="h-4 w-4 shrink-0"
              style={{ color: "#D4AF37" }}
            />
            <span className="font-medium text-white">
              {inv.number ?? item.title}
            </span>
            {getStatusBadge(item.status)}
          </div>
          <p className="mt-0.5 pl-6 text-sm text-gray-500">
            {formatDate(item.date)}
            {item.proposalName && (
              <>
                {" · "}
                {item.proposalId ? (
                  <button
                    onClick={() => setSelectedProposalId(item.proposalId)}
                    className="hover:underline"
                    style={{ color: "#D4AF37" }}
                  >
                    {item.proposalName}
                  </button>
                ) : (
                  item.proposalName
                )}
              </>
            )}
          </p>
          {viewMode === "list" && item.projectName !== "Unassigned" && (
            <p className="mt-0.5 pl-6 text-xs text-gray-600">
              {item.projectName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-white">
              {formatCurrency(item.amount, item.currency)}
            </p>
            {item.status === "paid" && inv.paidAt && (
              <p className="text-xs text-gray-500">
                Paid {formatDate(inv.paidAt)}
              </p>
            )}
            {item.status === "open" && inv.dueDate && (
              <p className="text-xs" style={{ color: "#D4AF37" }}>
                Due {formatDate(inv.dueDate)}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {inv.hostedInvoiceUrl && (
              <a
                href={inv.hostedInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                title="View invoice"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {inv.invoicePdf && (
              <a
                href={inv.invoicePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPayment = (item: NormalizedBillingItem) => {
    const pay = item.paymentData!;
    return (
      <div
        key={item.id}
        className="flex items-center justify-between rounded-lg border bg-white/5 p-4"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <DollarSign
              className="h-4 w-4 shrink-0"
              style={{ color: "#D4AF37" }}
            />
            <span className="font-medium text-white">{item.title}</span>
            <span className="inline-flex items-center rounded-full bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-400">
              Paid
            </span>
          </div>
          <p className="mt-0.5 pl-6 text-sm text-gray-500">
            {formatDate(item.date)}
            {item.proposalName && (
              <>
                {" · "}
                {item.proposalId ? (
                  <button
                    onClick={() => setSelectedProposalId(item.proposalId)}
                    className="hover:underline"
                    style={{ color: "#D4AF37" }}
                  >
                    {item.proposalName}
                  </button>
                ) : (
                  item.proposalName
                )}
              </>
            )}
          </p>
          {viewMode === "list" && item.projectName !== "Unassigned" && (
            <p className="mt-0.5 pl-6 text-xs text-gray-600">
              {item.projectName}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="font-semibold text-white">
            {formatCurrency(item.amount, item.currency)}
          </p>
          {pay.receiptUrl && (
            <a
              href={pay.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              title="View receipt"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="mb-2 text-xl font-bold">Access Denied</h1>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Portal not found
      </div>
    );
  }

  const hasContent = allItems.length > 0;

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Billing</h1>
          <p className="text-gray-400">
            Subscriptions, invoices, and payment history.
          </p>
        </div>
        <button
          onClick={() => refetchBilling()}
          aria-label="Refresh billing data"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {billingLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: "#D4AF37" }}
          />
        </div>
      ) : !billing?.hasStripeCustomer ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <DollarSign className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">Billing not yet configured.</p>
          <p className="mt-2 text-sm text-gray-600">
            Contact us to set up your billing account.
          </p>
        </div>
      ) : !hasContent ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Receipt className="mb-4 h-12 w-12 text-gray-600" />
          <p className="text-gray-500">No billing history yet.</p>
          <p className="mt-2 text-sm text-gray-600">
            Invoices and subscriptions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Monthly Recurring
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatCurrency(monthlyRecurring, "usd")}
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                Active subscriptions
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
                Total Paid
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatCurrency(totalPaid, "usd")}
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                All-time payments
              </p>
            </div>
            <div
              className="rounded-lg border bg-white/5 p-5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Next Payment
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {nextPaymentDate ? formatDate(nextPaymentDate) : "—"}
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                {nextPaymentDate ? "Upcoming billing date" : "No active subscriptions"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.4), transparent)",
            }}
          />

          {/* Search & Filter */}
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search billing..."
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            filterOptions={projectFilters}
            selectedFilter={selectedProject}
            onFilterChange={(id) =>
              setSelectedProject(id as number | "all" | "unassigned")
            }
            filterLabel="Project"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            collapseState={collapseState}
          />

          {/* Items */}
          {viewMode === "grouped" ? (
            <ListContainer
              emptyIcon={<Search className="h-12 w-12" />}
              emptyMessage="No billing items match your search."
              onClearFilters={clearFilters}
              showClearFilters={hasActiveFilters}
            >
              {filteredItems.length > 0
                ? groupedItems.map(([groupName, items]) => (
                    <div key={groupName}>
                      <ProjectGroupHeader
                        projectName={groupName}
                        itemCount={items.length}
                        collapsed={collapsedGroups.has(groupName)}
                        onToggle={() => toggleGroup(groupName)}
                      />
                      {!collapsedGroups.has(groupName) && (
                        <div className="space-y-3">
                          {items.map(renderBillingItem)}
                        </div>
                      )}
                    </div>
                  ))
                : null}
            </ListContainer>
          ) : (
            <ListContainer
              emptyIcon={<Search className="h-12 w-12" />}
              emptyMessage="No billing items match your search."
              onClearFilters={clearFilters}
              showClearFilters={hasActiveFilters}
            >
              {filteredItems.length > 0
                ? groupedByType.map((group) => (
                    <div key={group.label}>
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className="mb-2 mt-4 flex w-full items-center gap-2 text-left first:mt-0"
                      >
                        <div className="h-4 w-0.5 rounded-full" style={{ backgroundColor: "#D4AF37" }} />
                        <h3 className="text-sm font-medium text-gray-400">
                          {group.label}
                        </h3>
                        <span className="text-xs text-gray-600">
                          {group.items.length}
                        </span>
                        <div
                          className="flex-1 border-b"
                          style={{ borderColor: "rgba(255, 255, 255, 0.12)" }}
                        />
                        <ChevronDown
                          className={`h-4 w-4 text-gray-600 transition-transform ${collapsedGroups.has(group.label) ? "-rotate-90" : ""}`}
                        />
                      </button>
                      {!collapsedGroups.has(group.label) && (
                        <div className="space-y-3">
                          {group.items.map(renderBillingItem)}
                        </div>
                      )}
                    </div>
                  ))
                : null}
            </ListContainer>
          )}

          {/* Account Balance */}
          {billing?.balance !== null &&
            billing?.balance !== undefined &&
            billing.balance !== 0 && (
              <>
                <div
                  className="h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(212, 175, 55, 0.4), transparent)",
                  }}
                />
                <div
                  className="rounded-lg border bg-white/5 p-5"
                  style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Account Balance</span>
                    <span
                      className={
                        billing.balance < 0
                          ? "font-semibold text-green-400"
                          : "font-semibold text-red-400"
                      }
                    >
                      {billing.balance < 0 ? "Credit: " : "Due: "}
                      {formatCurrency(Math.abs(billing.balance), "usd")}
                    </span>
                  </div>
                </div>
              </>
            )}
        </div>
      )}

      {/* Cancel Subscription Dialog */}
      <ConfirmDialog
        open={cancelDialog.open}
        onOpenChange={(open) =>
          setCancelDialog({
            open,
            subscriptionId: open ? cancelDialog.subscriptionId : null,
          })
        }
        title="Cancel Subscription"
        description="Your subscription will remain active until the end of the current billing period. Are you sure you want to cancel?"
        confirmLabel="Cancel Subscription"
        variant="danger"
        onConfirm={() =>
          cancelDialog.subscriptionId &&
          cancelMutation.mutate({
            subscriptionId: cancelDialog.subscriptionId,
            immediate: false,
          })
        }
        isLoading={cancelMutation.isPending}
      />

      {/* Proposal Modal */}
      {selectedProposal && (
        <ProposalModal
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposalId(null)}
          proposal={{
            id: selectedProposal.id,
            title: selectedProposal.title,
            description: selectedProposal.description,
            createdAt: selectedProposal.createdAt,
            metadata: selectedProposal.metadata as ProposalMetadata | null,
            project: selectedProposal.project,
          }}
          slug={slug}
        />
      )}
    </ClientPortalLayout>
  );
}
