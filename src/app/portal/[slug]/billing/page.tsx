"use client";

import { use, useState } from "react";
import { api } from "~/trpc/react";
import { ClientPortalLayout } from "~/components/pages/client-portal";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
} from "lucide-react";

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
  switch (status) {
    case "paid":
      return <Badge className="bg-green-900/50 text-green-400">Paid</Badge>;
    case "open":
      return <Badge className="bg-yellow-900/50 text-yellow-400">Open</Badge>;
    case "draft":
      return <Badge className="bg-gray-700 text-gray-300">Draft</Badge>;
    case "uncollectible":
      return <Badge className="bg-red-900/50 text-red-400">Uncollectible</Badge>;
    case "void":
      return <Badge className="bg-gray-700 text-gray-400">Void</Badge>;
    default:
      return <Badge className="bg-gray-700 text-gray-300">{status ?? "Unknown"}</Badge>;
  }
}

function getSubscriptionStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-900/50 text-green-400">Active</Badge>;
    case "trialing":
      return <Badge className="bg-blue-900/50 text-blue-400">Trial</Badge>;
    case "past_due":
      return <Badge className="bg-red-900/50 text-red-400">Past Due</Badge>;
    case "canceled":
      return <Badge className="bg-gray-700 text-gray-400">Canceled</Badge>;
    case "unpaid":
      return <Badge className="bg-red-900/50 text-red-400">Unpaid</Badge>;
    default:
      return <Badge className="bg-gray-700 text-gray-300">{status}</Badge>;
  }
}

export default function PortalBillingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: client, isLoading, error } = api.portal.getClientBySlug.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );
  const {
    data: billing,
    isLoading: billingLoading,
    refetch: refetchBilling,
  } = api.portal.getBillingInfo.useQuery(
    { slug },
    { staleTime: 2 * 60 * 1000 } // 2 minutes - billing data cached server-side
  );

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const cancelMutation = api.portal.cancelSubscription.useMutation({
    onSuccess: () => {
      setCancellingId(null);
      setConfirmCancelId(null);
      void refetchBilling();
    },
    onError: () => {
      setCancellingId(null);
    },
  });

  const reactivateMutation = api.portal.reactivateSubscription.useMutation({
    onSuccess: () => {
      void refetchBilling();
    },
  });

  const resubscribeMutation = api.portal.resubscribe.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
  });

  const handleCancelClick = (subscriptionId: string) => {
    if (confirmCancelId === subscriptionId) {
      // Second click - actually cancel
      setCancellingId(subscriptionId);
      cancelMutation.mutate({ subscriptionId, immediate: false });
    } else {
      // First click - show confirmation
      setConfirmCancelId(subscriptionId);
    }
  };

  const handleReactivate = (subscriptionId: string) => {
    reactivateMutation.mutate({ subscriptionId });
  };

  const handleResubscribe = (productId: string) => {
    const baseUrl = window.location.origin;
    resubscribeMutation.mutate({
      productId,
      successUrl: `${baseUrl}/portal/${slug}/billing?resubscribed=true&domain=live`,
      cancelUrl: `${baseUrl}/portal/${slug}/billing?domain=live`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
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

  const hasInvoices = (billing?.invoices.length ?? 0) > 0;
  const hasPayments = (billing?.payments?.length ?? 0) > 0;
  const hasSubscriptions = (billing?.subscriptions.length ?? 0) > 0;
  const hasContent = hasInvoices || hasPayments || hasSubscriptions;

  return (
    <ClientPortalLayout clientName={client.name} slug={slug}>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Billing</h1>
          <p className="text-gray-400">Subscriptions and payment history.</p>
        </div>
        <button
          onClick={() => refetchBilling()}
          className="text-gray-400 transition-colors hover:text-white"
          title="Refresh billing data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {billingLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
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
        <div className="space-y-8">
          {/* Subscriptions */}
          {hasSubscriptions && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-300">
                <CreditCard className="h-5 w-5" style={{ color: "#D4AF37" }} />
                Active Subscriptions
              </h2>
              <div className="space-y-4">
                {billing.subscriptions.map((sub) => {
                  // Build subscription name from items (product name > nickname > fallback)
                  const subscriptionName = sub.items
                    .map(
                      (item) =>
                        item.productName ?? item.nickname ?? "Subscription"
                    )
                    .join(" + ");

                  return (
                    <Card
                      key={sub.id}
                      className="bg-white/5"
                      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">
                                {subscriptionName}
                              </span>
                              {getSubscriptionStatusBadge(sub.status)}
                            </div>
                            {sub.proposalName && sub.proposalName !== subscriptionName && (
                              <p className="mt-0.5 text-sm text-gray-500">
                                From: {sub.proposalName}
                              </p>
                            )}
                            {sub.items.map((item) => (
                              <p key={item.id} className="mt-1 text-sm text-gray-400">
                                {item.unitAmount
                                  ? formatCurrency(item.unitAmount, item.currency)
                                  : "Custom pricing"}{" "}
                                {item.interval && `/ ${item.interval}`}
                              </p>
                            ))}
                        </div>
                        <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                          <p>Started {formatDate(sub.startDate)}</p>
                          {sub.trialEnd && sub.status === "trialing" && (
                            <p className="text-blue-400">
                              Trial ends {formatDate(sub.trialEnd)}
                            </p>
                          )}
                          {sub.cancelAtPeriodEnd && (
                            <p className="flex items-center gap-1 text-yellow-500">
                              <AlertTriangle className="h-4 w-4" />
                              Cancels at period end
                            </p>
                          )}

                          {/* Cancel/Reactivate buttons */}
                          {sub.status === "active" && !sub.cancelAtPeriodEnd && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelClick(sub.id)}
                              disabled={cancellingId === sub.id}
                              className={`mt-1 h-8 text-xs ${
                                confirmCancelId === sub.id
                                  ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                                  : "text-gray-400 hover:text-red-400"
                              }`}
                            >
                              {cancellingId === sub.id ? (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {confirmCancelId === sub.id
                                ? "Click to confirm"
                                : "Cancel subscription"}
                            </Button>
                          )}

                          {sub.cancelAtPeriodEnd && sub.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReactivate(sub.id)}
                              disabled={reactivateMutation.isPending}
                              className="mt-1 h-8 text-xs text-green-400 hover:bg-green-900/30 hover:text-green-300"
                            >
                              {reactivateMutation.isPending ? (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              ) : (
                                <RotateCcw className="mr-1 h-3 w-3" />
                              )}
                              Reactivate
                            </Button>
                          )}

                          {/* Resubscribe button for canceled subscriptions */}
                          {sub.status === "canceled" && sub.items[0]?.productId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleResubscribe(sub.items[0]!.productId!)
                              }
                              disabled={resubscribeMutation.isPending}
                              className="mt-1 h-8 text-xs text-yellow-500 hover:bg-yellow-900/30 hover:text-yellow-400"
                            >
                              {resubscribeMutation.isPending ? (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              ) : (
                                <ShoppingCart className="mr-1 h-3 w-3" />
                              )}
                              Resubscribe
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Payment History (Invoices + One-time Payments) */}
          {(hasInvoices || hasPayments) && (
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-300">
                <Receipt className="h-5 w-5" style={{ color: "#D4AF37" }} />
                Payment History
              </h2>
              <div className="space-y-3">
                {/* One-time payments (from checkout) */}
                {billing.payments?.map((payment) => (
                  <Card
                    key={payment.id}
                    className="bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {payment.description}
                            </span>
                            <Badge className="bg-green-900/50 text-green-400">Paid</Badge>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {formatDate(payment.created)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                        </div>
                        {payment.receiptUrl && (
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                            title="View receipt"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Invoices */}
                {billing.invoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    className="bg-white/5"
                    style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {invoice.number ?? invoice.id.slice(-8)}
                            </span>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {formatDate(invoice.created)}
                            {invoice.proposalName
                              ? ` · ${invoice.proposalName}`
                              : invoice.description && ` · ${invoice.description}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(invoice.amountDue, invoice.currency)}
                          </p>
                          {invoice.status === "paid" && invoice.paidAt && (
                            <p className="text-xs text-gray-500">
                              Paid {formatDate(invoice.paidAt)}
                            </p>
                          )}
                          {invoice.status === "open" && invoice.dueDate && (
                            <p className="text-xs text-yellow-500">
                              Due {formatDate(invoice.dueDate)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {invoice.hostedInvoiceUrl && (
                            <a
                              href={invoice.hostedInvoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                              title="View invoice"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {invoice.invoicePdf && (
                            <a
                              href={invoice.invoicePdf}
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Account Balance */}
          {billing?.balance !== null && billing?.balance !== 0 && (
            <Card
              className="bg-white/5"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account Balance</span>
                  <span
                    className={
                      billing.balance && billing.balance < 0
                        ? "font-semibold text-green-400"
                        : "font-semibold text-red-400"
                    }
                  >
                    {/* Negative balance = credit to customer */}
                    {billing.balance && billing.balance < 0 ? "Credit: " : "Due: "}
                    {formatCurrency(Math.abs(billing.balance ?? 0), "usd")}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ClientPortalLayout>
  );
}
