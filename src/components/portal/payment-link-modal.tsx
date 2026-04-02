"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  X,
  Search,
  CreditCard,
  Landmark,
  Loader2,
  CheckCircle2,
  LinkIcon,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { formatCents, formatUnixDate } from "~/lib/format";

// ============================================================================
// TYPES
// ============================================================================

interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: number;
  clientSlug: string;
  checkoutGroupId: string;
  optionId: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PaymentLinkModal({
  isOpen,
  onClose,
  proposalId,
  clientSlug,
  checkoutGroupId,
  optionId,
}: PaymentLinkModalProps) {
  const utils = api.useUtils();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const {
    data: results,
    isLoading,
    refetch,
  } = api.proposals.searchPayments.useQuery(
    {
      clientSlug,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      limit: 20,
    },
    { enabled: searchTriggered, staleTime: 30 * 1000 }
  );

  const linkPayment = api.proposals.linkPayment.useMutation({
    onSuccess: () => {
      toast.success("Payment linked to proposal");
      void utils.proposals.getById.invalidate({ proposalId });
      void utils.proposals.getCheckoutStatus.invalidate({ proposalId });
      void utils.portal.getBillingInfo.invalidate({ slug: clientSlug });
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSearch = () => {
    setSearchTriggered(true);
    void refetch();
  };

  const handleLink = (
    source: "stripe" | "mercury",
    externalId: string,
    amount: number,
    fee: number | null,
    currency: string,
    date: number
  ) => {
    linkPayment.mutate({
      proposalId,
      checkoutGroupId,
      optionId,
      source,
      externalId,
      amount,
      fee: fee ?? undefined,
      currency,
      paidAt: new Date(date * 1000).toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg border"
        style={{
          borderColor: "rgba(212, 175, 55, 0.2)",
          backgroundColor: "#111",
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b bg-[#111] px-6 py-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <h2 className="text-lg font-semibold text-white">
            <LinkIcon
              className="mr-2 inline h-5 w-5"
              style={{ color: "#D4AF37" }}
            />
            Link Existing Payment
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search controls */}
        <div
          className="border-b px-6 py-4"
          style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
        >
          <p className="mb-3 text-sm text-gray-400">
            Search Stripe charges and Mercury transactions for{" "}
            <span className="text-white">
              {results?.client?.name ?? clientSlug}
            </span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="link-start-date"
                className="mb-1 block text-xs text-gray-500"
              >
                From
              </label>
              <input
                id="link-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="link-end-date"
                className="mb-1 block text-xs text-gray-500"
              >
                To
              </label>
              <input
                id="link-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="px-6 py-4">
          {!searchTriggered && (
            <p className="py-8 text-center text-sm text-gray-500">
              Set a date range and click Search to find payments.
            </p>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2
                className="h-6 w-6 animate-spin"
                style={{ color: "#D4AF37" }}
              />
            </div>
          )}

          {searchTriggered && !isLoading && results && (
            <div className="space-y-6">
              {/* Stripe results */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-400">
                  <CreditCard className="h-4 w-4" />
                  Stripe Charges ({results.stripe.length})
                </h3>
                {results.stripe.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No Stripe charges found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {results.stripe.map((charge) => (
                      <div
                        key={charge.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          charge.alreadyLinked
                            ? "border-green-500/20 bg-green-500/5 opacity-60"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {formatCents(charge.amount, charge.currency)}
                            </span>
                            {charge.fee !== null && (
                              <span className="text-xs text-gray-500">
                                (fee: {formatCents(charge.fee, charge.currency)}
                                )
                              </span>
                            )}
                            {charge.alreadyLinked && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-400">
                                <CheckCircle2 className="h-3 w-3" />
                                Linked
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatUnixDate(charge.date)}
                            </span>
                            {charge.description && (
                              <span className="truncate">
                                {charge.description}
                              </span>
                            )}
                          </div>
                        </div>
                        {!charge.alreadyLinked && (
                          <button
                            onClick={() =>
                              handleLink(
                                "stripe",
                                charge.id,
                                charge.amount,
                                charge.fee,
                                charge.currency,
                                charge.date
                              )
                            }
                            disabled={linkPayment.isPending}
                            className="ml-3 inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10"
                            style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                          >
                            <LinkIcon className="h-3 w-3" />
                            Link
                          </button>
                        )}
                        {charge.receiptUrl && (
                          <a
                            href={charge.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-gray-500 hover:text-white"
                            aria-label="View receipt"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mercury results */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Landmark className="h-4 w-4" />
                  Mercury Transactions ({results.mercury.length})
                </h3>
                {results.mercury.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No Mercury transactions found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {results.mercury.map((tx) => (
                      <div
                        key={tx.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          tx.alreadyLinked
                            ? "border-green-500/20 bg-green-500/5 opacity-60"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {formatCents(tx.amount, tx.currency)}
                            </span>
                            {tx.alreadyLinked && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-400">
                                <CheckCircle2 className="h-3 w-3" />
                                Linked
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatUnixDate(tx.date)}
                            </span>
                            {tx.counterpartyName && (
                              <span>{tx.counterpartyName}</span>
                            )}
                            {tx.description && (
                              <span className="truncate">{tx.description}</span>
                            )}
                          </div>
                        </div>
                        {!tx.alreadyLinked && (
                          <button
                            onClick={() =>
                              handleLink(
                                "mercury",
                                tx.id,
                                tx.amount,
                                null,
                                tx.currency,
                                tx.date
                              )
                            }
                            disabled={linkPayment.isPending}
                            className="ml-3 inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10"
                            style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                          >
                            <LinkIcon className="h-3 w-3" />
                            Link
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
