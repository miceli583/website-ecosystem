"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { RichTextPreview } from "~/components/portal/rich-text-preview";
import { PaymentLinkModal } from "~/components/portal/payment-link-modal";
import ReactMarkdown from "react-markdown";
import type { ProposalMetadataV2 } from "~/server/api/routers/proposals";
import {
  ArrowLeft,
  FileText,
  Loader2,
  AlertCircle,
  Trash2,
  Archive,
  ArchiveRestore,
  LinkIcon,
  CreditCard,
  Landmark,
  CheckCircle2,
  RefreshCw,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

// ============================================================================
// HELPERS
// ============================================================================

function formatCents(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const statusConfig = {
  draft: { label: "Draft", color: "text-gray-400", bg: "bg-gray-500/10" },
  sent: { label: "Pending", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
  partial: {
    label: "Partially Paid",
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10",
  },
  accepted: {
    label: "Accepted",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  declined: { label: "Declined", color: "text-red-400", bg: "bg-red-500/10" },
};

const paymentMethodIcons = {
  credit: CreditCard,
  bank: Landmark,
};

const paymentMethodLabels = {
  credit: "Credit Card",
  bank: "Bank Transfer",
};

// ============================================================================
// PAGE
// ============================================================================

export default function ProposalDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = use(params);
  const proposalId = parseInt(id, 10);
  const router = useRouter();
  const utils = api.useUtils();

  // Detect success/cancel from Stripe redirect
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const checkoutSuccess = urlParams?.get("success") === "true";
  const checkoutCanceled = urlParams?.get("canceled") === "true";

  const { data: profile } = api.portal.getMyProfile.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = profile?.role === "admin";

  const { data: proposal, isLoading } = api.proposals.getById.useQuery(
    { proposalId },
    { staleTime: 30 * 1000 }
  );

  const { data: checkoutStatus } = api.proposals.getCheckoutStatus.useQuery(
    { proposalId },
    { staleTime: 30 * 1000 }
  );

  const updateStatus = api.proposals.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      void utils.proposals.getById.invalidate({ proposalId });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteProposal = api.portal.deleteResource.useMutation({
    onSuccess: () => {
      toast.success("Proposal deleted");
      router.push(`/portal/${slug}/proposals`);
    },
    onError: () => toast.error("Failed to delete proposal"),
  });

  const archiveProposal = api.portal.updateResource.useMutation({
    onSuccess: () => {
      toast.success("Proposal updated");
      void utils.proposals.getById.invalidate({ proposalId });
    },
    onError: () => toast.error("Failed to update"),
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <AlertCircle
          className="mb-4 h-12 w-12 text-gray-600"
          aria-hidden="true"
        />
        <h1 className="mb-2 text-xl font-bold text-white">
          Proposal not found
        </h1>
        <p className="mb-4 text-gray-400">
          This proposal may have been deleted or you don&apos;t have access.
        </p>
        <Link
          href={`/portal/${slug}/proposals`}
          className="text-sm transition-colors hover:underline"
          style={{ color: "#D4AF37" }}
        >
          &larr; Back to Proposals
        </Link>
      </div>
    );
  }

  const meta = proposal.metadata as unknown as ProposalMetadataV2 | null;
  const status = meta?.status ?? "draft";
  const sc = statusConfig[status] ?? statusConfig.draft;

  return (
    <>
      {/* Success/Cancel banners */}
      {checkoutSuccess && (
        <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="mr-2 inline h-4 w-4" />
          Payment successful! Your checkout has been processed.
        </div>
      )}
      {checkoutCanceled && (
        <div
          className="mb-6 rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
            backgroundColor: "rgba(212, 175, 55, 0.05)",
            color: "#D4AF37",
          }}
        >
          Checkout was canceled. You can try again when you&apos;re ready.
        </div>
      )}

      {/* Back link */}
      <div className="mb-6">
        <Link
          href={`/portal/${slug}/proposals`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FileText
                className="h-5 w-5 flex-shrink-0"
                style={{ color: "#D4AF37" }}
              />
              <h1 className="text-2xl font-bold text-white">
                {proposal.title}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span
                role="status"
                className={`rounded-full px-2 py-0.5 text-xs ${sc.bg} ${sc.color}`}
              >
                {sc.label}
              </span>
              {proposal.project && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                    color: "#D4AF37",
                  }}
                >
                  {proposal.project.name}
                </span>
              )}
              {meta?.customerInfo?.name && (
                <span className="text-xs text-gray-400">
                  Prepared for {meta.customerInfo.name}
                  {meta.customerInfo.company &&
                    ` (${meta.customerInfo.company})`}
                </span>
              )}
              <span className="text-xs">{formatDate(proposal.createdAt)}</span>
            </div>
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <div className="flex flex-shrink-0 items-center gap-2">
              <Link
                href={`/portal/${slug}/proposals/new?edit=${proposalId}`}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                Edit
              </Link>
              <button
                onClick={() =>
                  archiveProposal.mutate({
                    id: proposalId,
                    isActive: !proposal.isActive,
                  })
                }
                aria-label={
                  proposal.isActive ? "Archive proposal" : "Restore proposal"
                }
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                {proposal.isActive ? (
                  <Archive className="h-3.5 w-3.5" />
                ) : (
                  <ArchiveRestore className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                aria-label="Delete proposal"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                style={{ borderColor: "rgba(248, 113, 113, 0.2)" }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className="mb-6 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />

      {/* Description */}
      {proposal.description && (
        <p className="mb-6 text-gray-400">{proposal.description}</p>
      )}

      {/* Rich content */}
      {meta?.richContent && (
        <div className="prose-invert mb-8">
          <RichTextPreview html={meta.richContent} />
        </div>
      )}

      {/* Checkout Groups */}
      {meta?.checkoutGroups && (
        <div className="mb-8 space-y-6">
          <h2 className="text-lg font-semibold text-white">Packages</h2>
          {meta.checkoutGroups.map((group) => (
            <CheckoutGroupCard
              key={group.id}
              group={group}
              proposalId={proposalId}
              slug={slug}
              status={status}
              currency={meta.currency}
              isAdmin={isAdmin ?? false}
              checkoutStatus={checkoutStatus?.[group.id]}
            />
          ))}
        </div>
      )}

      {/* Terms & Agreements */}
      {(proposal.agreementTemplates.length > 0 || meta?.customTerms) && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Terms & Agreements
          </h2>
          <div
            className="space-y-4 rounded-lg border p-6"
            style={{
              borderColor: "rgba(212, 175, 55, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            {proposal.agreementTemplates.map(
              (template: { id: number; name: string; content: string }) => (
                <div key={template.id}>
                  <h3 className="mb-2 text-sm font-medium text-[#D4AF37]">
                    {template.name}
                  </h3>
                  <div className="prose-invert text-sm whitespace-pre-wrap text-gray-400">
                    {template.content}
                  </div>
                </div>
              )
            )}
            {meta?.customTerms && (
              <div className="[&_a]:text-[#D4AF37] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-[#D4AF37] [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1 [&_code]:text-[#D4AF37] [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[#D4AF37] [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-[#D4AF37] [&_hr]:my-8 [&_hr]:border-gray-700 [&_li]:my-1.5 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-gray-300 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-gray-300 [&_strong]:text-white [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown>{meta.customTerms}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Valid Until */}
      {meta?.validUntil && (
        <p className="mb-8 text-sm text-gray-500">
          This proposal is valid until{" "}
          <span className="text-gray-400">{formatDate(meta.validUntil)}</span>
        </p>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="w-full max-w-sm rounded-lg border p-6"
            style={{
              borderColor: "rgba(212, 175, 55, 0.2)",
              backgroundColor: "#111",
            }}
          >
            <h3 className="mb-2 text-lg font-bold text-white">
              Delete Proposal
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Are you sure you want to permanently delete &quot;
              {proposal.title}&quot;? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border px-4 py-2 text-sm text-gray-400 hover:bg-white/5"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProposal.mutate({ id: proposalId })}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
              >
                {deleteProposal.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// CHECKOUT GROUP CARD
// ============================================================================

type CheckoutRowData = {
  id: number;
  checkoutGroupId: string;
  optionId: string;
  paymentMethod: string;
  status: string;
  amount: number;
  paidAt: Date | null;
  mercuryInvoiceLink: string | null;
};

function CheckoutGroupCard({
  group,
  proposalId,
  slug,
  status,
  currency,
  isAdmin,
  checkoutStatus,
}: {
  group: ProposalMetadataV2["checkoutGroups"][number];
  proposalId: number;
  slug: string;
  status: string;
  currency: string;
  isAdmin: boolean;
  checkoutStatus?: CheckoutRowData[];
}) {
  const utils = api.useUtils();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    group.options.length === 1 ? group.options[0]!.id : null
  );
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [mercuryLink, setMercuryLink] = useState<string | null>(null);
  const [showLinkPayment, setShowLinkPayment] = useState(false);

  const checkMercury = api.proposals.checkMercuryPayment.useMutation({
    onSuccess: (data) => {
      if (data.status === "paid") {
        toast.success("Payment confirmed!");
        void utils.proposals.getCheckoutStatus.invalidate({ proposalId });
        void utils.proposals.getById.invalidate({ proposalId });
      } else if (data.status === "canceled") {
        toast.error("Invoice was canceled.");
        void utils.proposals.getCheckoutStatus.invalidate({ proposalId });
      } else if (data.status === "pending") {
        toast("Payment not yet received. Try again after completing payment.");
      } else if (data.status === "error") {
        toast.error("Could not check invoice status.");
      }
    },
    onError: () => toast.error("Failed to check payment status."),
  });

  const createCheckout = api.proposals.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.type === "stripe" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.type === "mercury") {
        setMercuryLink(data.invoiceLink ?? null);
        toast.success("Mercury invoice created! Click the link to pay.");
        void utils.proposals.getCheckoutStatus.invalidate({ proposalId });
      }
    },
    onError: (err) => toast.error(err.message),
  });

  // Check if this group is already paid
  const paidCheckout = checkoutStatus?.find((c) => c.status === "paid");
  const pendingCheckout = checkoutStatus?.find((c) => c.status === "pending");
  const isPaid = !!paidCheckout;
  const isPending = !!pendingCheckout && !isPaid;

  const canCheckout =
    !isPaid &&
    (status === "sent" || status === "partial" || status === "accepted") &&
    selectedOptionId;

  const selectedOption = group.options.find((o) => o.id === selectedOptionId);

  const ruleConfig = group.required
    ? { label: "Required", bg: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }
    : { label: "Optional", bg: "rgba(255, 255, 255, 0.08)", color: "#9ca3af" };

  return (
    <div
      className="rounded-lg border"
      style={{
        borderColor: isPaid
          ? "rgba(34, 197, 94, 0.3)"
          : "rgba(212, 175, 55, 0.2)",
        backgroundColor: isPaid
          ? "rgba(34, 197, 94, 0.03)"
          : "rgba(255, 255, 255, 0.02)",
      }}
    >
      {/* Group header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-white">{group.name}</h3>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: ruleConfig.bg, color: ruleConfig.color }}
          >
            {ruleConfig.label}
          </span>
        </div>
        {isPaid && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            Paid
          </span>
        )}
        {isPending && !isPaid && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/15 px-3 py-1 text-sm font-medium text-[#D4AF37]">
            <Clock className="h-4 w-4" />
            Pending
          </span>
        )}
      </div>

      {/* Options */}
      <div
        className="border-t px-6 py-4"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="space-y-3">
          {group.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isExpanded = expandedOption === option.id;

            return (
              <div
                key={option.id}
                className={`rounded-lg border p-4 transition-colors ${
                  isPaid
                    ? "opacity-60"
                    : isSelected
                      ? "border-[#D4AF37]/40 bg-[#D4AF37]/5"
                      : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    {!isPaid && group.options.length > 1 && (
                      <input
                        type="radio"
                        name={`group-${group.id}`}
                        checked={isSelected}
                        onChange={() => setSelectedOptionId(option.id)}
                        className="accent-[#D4AF37]"
                        disabled={isPaid}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {option.name}
                        </span>
                        {option.paymentType === "recurring" && (
                          <span className="rounded-full bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] text-[#D4AF37]">
                            {option.recurringInterval === "year"
                              ? "Yearly"
                              : "Monthly"}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <p className="mt-1 text-sm text-gray-400">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">
                      {formatCents(option.totalPrice, currency)}
                      {option.paymentType === "recurring" && (
                        <span className="text-sm font-normal text-gray-500">
                          /{option.recurringInterval === "year" ? "yr" : "mo"}
                        </span>
                      )}
                    </span>
                    {/* Payment method badges */}
                    <div className="flex gap-1">
                      {option.enabledPaymentMethods.map((method) => {
                        const Icon = paymentMethodIcons[method];
                        return (
                          <span
                            key={method}
                            className="inline-flex items-center rounded bg-white/5 px-1.5 py-0.5"
                            title={paymentMethodLabels[method]}
                          >
                            <Icon className="h-3.5 w-3.5 text-gray-500" />
                          </span>
                        );
                      })}
                    </div>
                    {option.lineItems.length > 1 && (
                      <button
                        onClick={() =>
                          setExpandedOption(isExpanded ? null : option.id)
                        }
                        className="text-gray-500 hover:text-white"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Line items expansion */}
                {isExpanded && (
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="pb-1 text-left font-normal">Item</th>
                          <th className="pb-1 text-right font-normal">Qty</th>
                          <th className="pb-1 text-right font-normal">Price</th>
                          <th className="pb-1 text-right font-normal">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {option.lineItems.map((item, i) => (
                          <tr key={i} className="text-gray-300">
                            <td className="py-0.5">{item.name}</td>
                            <td className="py-0.5 text-right">{item.qty}</td>
                            <td className="py-0.5 text-right">
                              {formatCents(item.unitPrice, currency)}
                            </td>
                            <td className="py-0.5 text-right">
                              {formatCents(item.unitPrice * item.qty, currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout buttons */}
      {canCheckout && selectedOption && !isPaid && (
        <div
          className="flex flex-col items-center gap-3 border-t px-6 py-4 sm:flex-row sm:flex-wrap"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          {selectedOption.enabledPaymentMethods.includes("credit") && (
            <button
              onClick={() =>
                createCheckout.mutate({
                  proposalId,
                  checkoutGroupId: group.id,
                  optionId: selectedOption.id,
                  paymentMethod: "credit",
                  successUrl: `${window.location.origin}/portal/${slug}/proposals/${proposalId}?success=true`,
                  cancelUrl: `${window.location.origin}/portal/${slug}/proposals/${proposalId}?canceled=true`,
                })
              }
              disabled={createCheckout.isPending}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              <CreditCard className="h-4 w-4" />
              {createCheckout.isPending ? "Processing..." : "Pay with Card"}
            </button>
          )}
          {selectedOption.enabledPaymentMethods.includes("bank") &&
            (mercuryLink || pendingCheckout?.mercuryInvoiceLink ? (
              <>
                <a
                  href={
                    mercuryLink ?? pendingCheckout?.mercuryInvoiceLink ?? "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Go to Invoice
                </a>
                <button
                  onClick={() =>
                    checkMercury.mutate({
                      proposalId,
                      checkoutGroupId: group.id,
                    })
                  }
                  disabled={checkMercury.isPending}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${checkMercury.isPending ? "animate-spin" : ""}`}
                  />
                  {checkMercury.isPending ? "Checking..." : "Check Payment"}
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  createCheckout.mutate({
                    proposalId,
                    checkoutGroupId: group.id,
                    optionId: selectedOption.id,
                    paymentMethod: "bank",
                    successUrl: `${window.location.origin}/portal/${slug}/proposals/${proposalId}`,
                    cancelUrl: `${window.location.origin}/portal/${slug}/proposals/${proposalId}`,
                  })
                }
                disabled={createCheckout.isPending}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
                style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
              >
                <Landmark className="h-4 w-4" />
                {createCheckout.isPending
                  ? "Creating Invoice..."
                  : "Pay via Bank Transfer"}
              </button>
            ))}
        </div>
      )}

      {(mercuryLink || pendingCheckout?.mercuryInvoiceLink) && !isPaid && (
        <p className="px-6 pb-4 text-xs text-gray-600">
          Paid via bank transfer? Click &ldquo;Check Payment&rdquo; to update
          status.
        </p>
      )}

      {/* Admin: Link existing payment to this package */}
      {isAdmin && !isPaid && selectedOption && (
        <div
          className="border-t px-6 py-3"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <button
            onClick={() => setShowLinkPayment(true)}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-[#D4AF37]"
          >
            <LinkIcon className="h-3 w-3" />
            Link existing payment to this package
          </button>
        </div>
      )}

      <PaymentLinkModal
        isOpen={showLinkPayment}
        onClose={() => setShowLinkPayment(false)}
        proposalId={proposalId}
        clientSlug={slug}
        checkoutGroupId={group.id}
        optionId={selectedOption?.id ?? group.options[0]?.id ?? "manual"}
      />
    </div>
  );
}
