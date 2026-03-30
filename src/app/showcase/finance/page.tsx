"use client";

import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  ArrowUpRight,
  Landmark,
  Calendar,
  Shield,
} from "lucide-react";

function formatCents(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Fabricated data for showcase
const stripe = {
  connected: true,
  mrr: 485000,
  activeSubscriptions: 12,
  thisMonthRevenue: 820000,
  totalRevenue: 6750000,
  stripeBalance: 1234000,
};

const mercury = {
  connected: true,
  totalAvailable: 45200.0,
  accounts: [
    { name: "Operating", availableBalance: 38700.0 },
    { name: "Tax Reserve", availableBalance: 6500.0 },
  ],
};

export default function ShowcaseFinancePage() {
  return (
    <div className="min-h-screen bg-black p-6 sm:p-10">
      <Link
        href="/showcase#demos"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/50 backdrop-blur-md transition-colors hover:border-[rgba(212,175,55,0.3)] hover:text-white/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Showcase
      </Link>

      <div className="mx-auto mt-14 max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Finance Overview</h1>
          <p className="text-sm text-gray-400">
            Revenue, expenses, and financial health
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{
              backgroundColor: "rgba(74, 222, 128, 0.1)",
              color: "#4ade80",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#4ade80" }}
            />
            Stripe Connected
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={{
              backgroundColor: "rgba(74, 222, 128, 0.1)",
              color: "#4ade80",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#4ade80" }}
            />
            Mercury Connected
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Monthly Recurring
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              ${formatCents(stripe.mrr)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {stripe.activeSubscriptions} active subscriptions
            </p>
          </div>

          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Revenue (This Month)
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              ${formatCents(stripe.thisMonthRevenue)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              All-time: ${formatCents(stripe.totalRevenue)}
            </p>
          </div>

          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CreditCard className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Stripe Balance
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              ${formatCents(stripe.stripeBalance)}
            </p>
            <p className="mt-1 text-xs text-gray-500">Available for payout</p>
          </div>

          <div
            className="rounded-lg border bg-white/5 p-5"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Landmark className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Bank Balance
            </div>
            <p className="mt-2 text-2xl font-bold text-white">
              $
              {mercury.totalAvailable.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {mercury.accounts.length} Mercury accounts
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: CreditCard,
              title: "Revenue",
              desc: "Stripe payments & subscriptions",
            },
            {
              icon: Receipt,
              title: "Expenses",
              desc: "Bank transactions & costs",
            },
            {
              icon: Calendar,
              title: "Yearly Review",
              desc: "P&L, breakdown & YoY comparison",
            },
            {
              icon: Shield,
              title: "Tax & Deductions",
              desc: "IRS categories & CSV export",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group cursor-default rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                  >
                    <item.icon
                      className="h-5 w-5"
                      style={{ color: "#D4AF37" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </div>
            </div>
          ))}
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
                  className="border-b text-left text-xs tracking-wider text-gray-500 uppercase"
                  style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
                >
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3 text-right">Plan</th>
                  <th className="px-4 py-3 text-right">Est. Monthly</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: "AWS (EC2 + S3)", plan: "Reserved", cost: "$320" },
                  { service: "Datadog", plan: "Pro", cost: "$75" },
                  { service: "Auth0", plan: "Essential", cost: "$35" },
                  { service: "SendGrid", plan: "Pro 100K", cost: "$90" },
                  { service: "Stripe", plan: "Per transaction", cost: "~2.9%" },
                  { service: "Cloudflare", plan: "Pro", cost: "$20" },
                  { service: "GitHub", plan: "Team", cost: "$16" },
                ].map((row) => (
                  <tr
                    key={row.service}
                    className="border-b"
                    style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                  >
                    <td className="px-4 py-2 text-gray-300">{row.service}</td>
                    <td className="px-4 py-2 text-right text-gray-400">
                      {row.plan}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-300">
                      {row.cost}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-2 font-medium text-white">
                    Estimated Total
                  </td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-medium text-white">
                    $556+
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
