"use client";

import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Users,
  Receipt,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

/**
 * Revenue Dashboard (Placeholder)
 * Will integrate with Stripe for detailed revenue analytics
 */
export default function RevenuePage() {
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
        <h1 className="text-2xl font-bold text-white">Revenue</h1>
        <p className="text-sm text-gray-400">
          Stripe payments, subscriptions, and MRR tracking
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div
        className="flex items-start gap-3 rounded-lg border p-6"
        style={{
          borderColor: "rgba(212, 175, 55, 0.3)",
          backgroundColor: "rgba(212, 175, 55, 0.05)",
        }}
      >
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#D4AF37" }} />
        <div>
          <p className="font-medium text-white">Revenue Dashboard Coming Soon</p>
          <p className="mt-1 text-sm text-gray-400">
            This page will display detailed revenue analytics from Stripe including:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Monthly Recurring Revenue (MRR) trends
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Subscription breakdown by plan
            </li>
            <li className="flex items-center gap-2">
              <Receipt className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Payment history and invoices
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Churn rate and customer lifetime value
            </li>
          </ul>
          <div className="mt-4">
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
              style={{ color: "#D4AF37" }}
            >
              View in Stripe Dashboard
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Placeholder Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "MRR", value: "$0", icon: TrendingUp },
          { label: "Active Subscriptions", value: "0", icon: Users },
          { label: "This Month", value: "$0", icon: CreditCard },
          { label: "All Time", value: "$0", icon: Receipt },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <stat.icon className="h-4 w-4" style={{ color: "#D4AF37" }} />
              {stat.label}
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-600">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
