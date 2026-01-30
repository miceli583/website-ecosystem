"use client";

import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  X,
  Check,
  CreditCard,
  Loader2,
  User,
  Building,
  Mail,
  Package,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Types for proposal metadata
export interface ProposalPackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: "one-time" | "subscription";
  interval?: "month" | "year";
  required?: boolean;
  popular?: boolean;
  lineItems?: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface ProposalMetadata {
  status: "draft" | "sent" | "accepted" | "declined";
  customerInfo?: {
    name?: string;
    email?: string;
    company?: string;
  };
  packages: ProposalPackage[];
  currency: string;
  notes?: string;
  validUntil?: string;
  // Legacy support
  lineItems?: Array<{
    name: string;
    description?: string;
    unitPrice: number;
    quantity: number;
    type: string;
  }>;
  total?: number;
  paymentType?: string;
}

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: {
    id: number;
    title: string;
    description: string | null;
    createdAt: Date | string;
    metadata: ProposalMetadata | null;
    project?: { name: string } | null;
  };
  slug: string;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

// Group line items by subsystem based on naming patterns
function groupLineItemsBySubsystem(lineItems: ProposalPackage["lineItems"]) {
  if (!lineItems || lineItems.length === 0) return [];

  const groups: Array<{
    name: string;
    total: number;
    items: typeof lineItems;
  }> = [];

  let currentGroup: (typeof groups)[0] | null = null;

  for (const item of lineItems) {
    // Detect subsystem from item name patterns
    let subsystem: string | null = null;

    if (item.name.toLowerCase().includes("landing page")) {
      subsystem = "Landing Page";
    } else if (
      item.name.toLowerCase().includes("slide builder") ||
      item.name.toLowerCase().includes("slide deck") ||
      item.name.toLowerCase().includes("user flow") ||
      item.name.toLowerCase().includes("document input") ||
      item.name.toLowerCase().includes("theme selection") ||
      item.name.toLowerCase().includes("prompt") ||
      item.name.toLowerCase().includes("pdf download") ||
      item.name.toLowerCase().includes("powerpoint") ||
      item.name.toLowerCase().includes("video recommend")
    ) {
      subsystem = "Protected Slide Builder";
    }

    // If we detected a subsystem and it's different from current, start a new group
    if (subsystem && (!currentGroup || currentGroup.name !== subsystem)) {
      currentGroup = { name: subsystem, total: 0, items: [] };
      groups.push(currentGroup);
    }

    // If no subsystem detected and no current group, create a default
    if (!currentGroup) {
      currentGroup = { name: "Items", total: 0, items: [] };
      groups.push(currentGroup);
    }

    currentGroup.items!.push(item);
    currentGroup.total += item.unitPrice * item.quantity;
  }

  return groups;
}

function PackageCard({
  pkg,
  currency,
  selected,
  onToggle,
  disabled,
}: {
  pkg: ProposalPackage;
  currency: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const hasLineItems = pkg.lineItems && pkg.lineItems.length > 0;
  const groupedItems = groupLineItemsBySubsystem(pkg.lineItems);
  const hasMultipleGroups = groupedItems.length > 1;

  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        selected
          ? "border-yellow-500 bg-yellow-900/20"
          : "border-gray-700 bg-white/5 hover:border-gray-600"
      } ${pkg.required ? "ring-1 ring-yellow-600/30" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white">{pkg.name}</h4>
            {pkg.required && (
              <span className="rounded bg-yellow-900/50 px-2 py-0.5 text-xs text-yellow-400">
                Required
              </span>
            )}
            {pkg.popular && (
              <span className="rounded bg-green-900/50 px-2 py-0.5 text-xs text-green-400">
                Popular
              </span>
            )}
          </div>
          {pkg.description && (
            <p className="mt-1 text-sm text-gray-400">{pkg.description}</p>
          )}
          <p className="mt-2 text-lg font-bold" style={{ color: "#D4AF37" }}>
            {formatCurrency(pkg.price, currency)}
            {pkg.type === "subscription" && (
              <span className="text-sm font-normal text-gray-500">
                /{pkg.interval ?? "month"}
              </span>
            )}
          </p>
        </div>

        <button
          onClick={onToggle}
          disabled={disabled || pkg.required}
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
            selected
              ? "border-yellow-500 bg-yellow-500 text-black"
              : "border-gray-600 text-transparent hover:border-gray-500"
          } ${pkg.required ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <Check className="h-4 w-4" />
        </button>
      </div>

      {/* Line items toggle */}
      {hasLineItems && (
        <div className="mt-3 border-t border-gray-800 pt-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300"
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {showDetails ? "Hide" : "Show"} details ({pkg.lineItems!.length} items)
          </button>

          {showDetails && (
            <div className="mt-3 space-y-4">
              {groupedItems.map((group, groupIdx) => (
                <div key={groupIdx}>
                  {hasMultipleGroups && (
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-yellow-500/70" />
                        <span className="text-xs font-medium uppercase tracking-wide text-yellow-500/70">
                          {group.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {formatCurrency(group.total, currency)}
                      </span>
                    </div>
                  )}
                  <div className={`space-y-1 ${hasMultipleGroups ? "ml-5 border-l border-gray-800 pl-3" : ""}`}>
                    {group.items!.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-gray-400"
                      >
                        <span>
                          {item.name
                            .replace(/ - Landing Page$/, "")
                            .replace(/ - Slide Builder$/, "")}
                          {item.quantity > 1 && ` × ${item.quantity}`}
                        </span>
                        <span className="flex-shrink-0 ml-2">{formatCurrency(item.unitPrice * item.quantity, currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProposalModal({ isOpen, onClose, proposal, slug }: ProposalModalProps) {
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const metadata = proposal.metadata;
  const packages = metadata?.packages ?? [];
  const currency = metadata?.currency ?? "usd";
  const status = metadata?.status ?? "draft";
  const customerInfo = metadata?.customerInfo;

  // Initialize required packages
  useMemo(() => {
    const required = new Set<string>();
    packages.forEach((pkg) => {
      if (pkg.required) required.add(pkg.id);
    });
    if (required.size > 0 && selectedPackages.size === 0) {
      setSelectedPackages(required);
    }
  }, [packages]);

  // Calculate totals (separate one-time and recurring)
  const { oneTimeTotal, recurringTotal, recurringInterval } = useMemo(() => {
    let oneTime = 0;
    let recurring = 0;
    let interval: "month" | "year" | null = null;
    packages.forEach((pkg) => {
      if (selectedPackages.has(pkg.id)) {
        if (pkg.type === "subscription") {
          recurring += pkg.price;
          interval = pkg.interval ?? "month";
        } else {
          oneTime += pkg.price;
        }
      }
    });
    return { oneTimeTotal: oneTime, recurringTotal: recurring, recurringInterval: interval };
  }, [packages, selectedPackages]);

  const togglePackage = (pkgId: string) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (pkg?.required) return;

    setSelectedPackages((prev) => {
      const next = new Set(prev);
      if (next.has(pkgId)) {
        next.delete(pkgId);
      } else {
        next.add(pkgId);
      }
      return next;
    });
  };

  const createCheckout = api.portal.createProposalCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      setCheckingOut(false);
      setCheckoutError(error.message);
    },
  });

  const handleCheckout = () => {
    if (selectedPackages.size === 0) return;
    setCheckingOut(true);
    setCheckoutError(null);
    const baseUrl = window.location.origin;
    createCheckout.mutate({
      proposalId: proposal.id,
      selectedPackageIds: Array.from(selectedPackages),
      successUrl: `${baseUrl}/portal/${slug}/proposals?success=true`,
      cancelUrl: `${baseUrl}/portal/${slug}/proposals?canceled=true`,
    });
  };

  const canCheckout = status === "sent" && selectedPackages.size > 0 && (oneTimeTotal > 0 || recurringTotal > 0);

  if (!isOpen) return null;

  // Legacy proposal without packages
  const isLegacyProposal = packages.length === 0 && metadata?.lineItems;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[95vh] w-full overflow-y-auto rounded-t-2xl border border-gray-800 bg-gray-950 shadow-2xl sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl md:max-w-3xl lg:max-w-4xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-800 bg-gray-950 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">{proposal.title}</h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {proposal.project && ` · ${proposal.project.name}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="-mr-2 -mt-2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white sm:mr-0 sm:mt-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {/* Status banner */}
          {status === "accepted" && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-900/30 p-3 text-green-400">
              <Check className="h-5 w-5" />
              This proposal has been accepted
            </div>
          )}
          {status === "draft" && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-gray-800 p-3 text-gray-400">
              <Clock className="h-5 w-5" />
              This proposal is still in draft
            </div>
          )}

          {/* Description */}
          {proposal.description && (
            <div className="mb-6">
              <p className="text-sm text-gray-300 sm:text-base">{proposal.description}</p>
            </div>
          )}

          {/* Customer Info */}
          {customerInfo && (customerInfo.name || customerInfo.email || customerInfo.company) && (
            <div className="mb-6 rounded-lg border border-gray-800 bg-white/5 p-4 sm:p-5">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                <User className="h-4 w-4" />
                Prepared For
              </h3>
              <div className="space-y-2 text-sm">
                {customerInfo.name && (
                  <p className="font-medium text-white">{customerInfo.name}</p>
                )}
                {customerInfo.company && (
                  <p className="flex items-center gap-2 text-gray-400">
                    <Building className="h-4 w-4 flex-shrink-0" />
                    {customerInfo.company}
                  </p>
                )}
                {customerInfo.email && (
                  <p className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{customerInfo.email}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* One-time Packages */}
          {packages.filter(p => p.type === "one-time").length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                <Package className="h-4 w-4" />
                {packages.filter(p => p.type === "one-time").length === 1
                  ? packages.find(p => p.type === "one-time")?.name ?? "Package"
                  : "Packages"}
              </h3>
              <div className="space-y-3">
                {packages.filter(p => p.type === "one-time").map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    currency={currency}
                    selected={selectedPackages.has(pkg.id)}
                    onToggle={() => togglePackage(pkg.id)}
                    disabled={status !== "sent"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Subscription Packages */}
          {packages.filter(p => p.type === "subscription").length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                <Clock className="h-4 w-4" />
                Hosting & Maintenance (Optional)
              </h3>
              <div className="space-y-3">
                {packages.filter(p => p.type === "subscription").map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    currency={currency}
                    selected={selectedPackages.has(pkg.id)}
                    onToggle={() => togglePackage(pkg.id)}
                    disabled={status !== "sent"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Legacy line items display */}
          {isLegacyProposal && metadata?.lineItems && (
            <div className="mb-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                <FileText className="h-4 w-4" />
                Line Items
              </h3>
              <div className="space-y-2">
                {metadata.lineItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between rounded-md bg-white/5 p-3"
                  >
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500">{item.description}</p>
                      )}
                    </div>
                    <p className="font-medium text-white">
                      {formatCurrency(item.unitPrice * item.quantity, currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {metadata?.notes && (
            <div className="mb-6 rounded-lg border border-gray-800 bg-white/5 p-4 sm:p-5 md:p-6">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                <FileText className="h-4 w-4" />
                Terms & Details
              </h3>
              <div className="prose prose-sm prose-invert max-w-none prose-headings:text-yellow-400 prose-headings:font-semibold prose-headings:text-xs prose-headings:mt-4 prose-headings:mb-2 prose-p:text-gray-300 prose-p:text-sm prose-p:my-1 prose-li:text-gray-300 prose-li:text-sm prose-li:my-0.5 prose-strong:text-white prose-ul:my-1 prose-hr:border-gray-700 prose-hr:my-4 sm:prose-headings:text-sm sm:prose-p:text-base sm:prose-li:text-base">
                <ReactMarkdown>{metadata.notes}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Valid until */}
          {metadata?.validUntil && (
            <p className="mb-6 text-center text-sm text-gray-500">
              Valid until {new Date(metadata.validUntil).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Footer with total and checkout */}
        <div className="sticky bottom-0 border-t border-gray-800 bg-gray-950 p-4 sm:p-6">
          {checkoutError && (
            <div className="mb-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-400">
              {checkoutError}
            </div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-500 sm:text-sm">
                {selectedPackages.size} package{selectedPackages.size !== 1 ? "s" : ""} selected
              </p>
              <div className="flex items-baseline justify-center gap-2 sm:justify-start">
                {oneTimeTotal > 0 && (
                  <p className="text-xl font-bold sm:text-2xl md:text-3xl" style={{ color: "#D4AF37" }}>
                    {formatCurrency(oneTimeTotal, currency)}
                  </p>
                )}
                {oneTimeTotal > 0 && recurringTotal > 0 && (
                  <span className="text-gray-500">+</span>
                )}
                {recurringTotal > 0 && (
                  <p className="text-xl font-bold sm:text-2xl md:text-3xl" style={{ color: "#D4AF37" }}>
                    {formatCurrency(recurringTotal, currency)}
                    <span className="text-xs font-normal text-gray-500 sm:text-sm">
                      /{recurringInterval}
                    </span>
                  </p>
                )}
                {oneTimeTotal === 0 && recurringTotal === 0 && (
                  <p className="text-xl font-bold text-gray-500 sm:text-2xl">$0.00</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={!canCheckout || checkingOut}
              className="w-full px-8 py-3 text-base sm:w-auto sm:py-2"
              style={{ backgroundColor: canCheckout ? "#D4AF37" : undefined }}
            >
              {checkingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {recurringTotal > 0 ? "Subscribe & Pay" : "Checkout"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
