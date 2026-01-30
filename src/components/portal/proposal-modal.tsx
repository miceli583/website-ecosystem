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
} from "lucide-react";

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
            <div className="mt-2 space-y-1">
              {pkg.lineItems!.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-gray-400"
                >
                  <span>
                    {item.name}
                    {item.quantity > 1 && ` × ${item.quantity}`}
                  </span>
                  <span>{formatCurrency(item.unitPrice * item.quantity, currency)}</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-800 bg-gray-950 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">{proposal.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
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
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
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
              <p className="text-gray-300">{proposal.description}</p>
            </div>
          )}

          {/* Customer Info */}
          {customerInfo && (customerInfo.name || customerInfo.email || customerInfo.company) && (
            <div className="mb-6 rounded-lg border border-gray-800 bg-white/5 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                <User className="h-4 w-4" />
                Prepared For
              </h3>
              <div className="space-y-2 text-sm">
                {customerInfo.name && (
                  <p className="text-white">{customerInfo.name}</p>
                )}
                {customerInfo.company && (
                  <p className="flex items-center gap-2 text-gray-400">
                    <Building className="h-4 w-4" />
                    {customerInfo.company}
                  </p>
                )}
                {customerInfo.email && (
                  <p className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    {customerInfo.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Packages */}
          {packages.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                <Package className="h-4 w-4" />
                Select Packages
              </h3>
              <div className="space-y-3">
                {packages.map((pkg) => (
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
            <div className="mb-6 rounded-lg border border-gray-800 bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                Notes
              </h3>
              <p className="text-sm text-gray-300">{metadata.notes}</p>
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
        <div className="sticky bottom-0 border-t border-gray-800 bg-gray-950 p-6">
          {checkoutError && (
            <div className="mb-4 rounded-lg bg-red-900/30 p-3 text-sm text-red-400">
              {checkoutError}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {selectedPackages.size} package{selectedPackages.size !== 1 ? "s" : ""} selected
              </p>
              <div className="flex items-baseline gap-2">
                {oneTimeTotal > 0 && (
                  <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                    {formatCurrency(oneTimeTotal, currency)}
                  </p>
                )}
                {oneTimeTotal > 0 && recurringTotal > 0 && (
                  <span className="text-gray-500">+</span>
                )}
                {recurringTotal > 0 && (
                  <p className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                    {formatCurrency(recurringTotal, currency)}
                    <span className="text-sm font-normal text-gray-500">
                      /{recurringInterval}
                    </span>
                  </p>
                )}
                {oneTimeTotal === 0 && recurringTotal === 0 && (
                  <p className="text-2xl font-bold text-gray-500">$0.00</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={!canCheckout || checkingOut}
              className="px-8"
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
