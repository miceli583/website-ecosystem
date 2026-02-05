"use client";

import Link from "next/link";
import {
  Receipt,
  Server,
  Mail,
  Cloud,
  Workflow,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

/**
 * Expenses Dashboard (Placeholder)
 * Will track infrastructure costs and operating expenses
 */
export default function ExpensesPage() {
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
        <h1 className="text-2xl font-bold text-white">Expenses</h1>
        <p className="text-sm text-gray-400">
          Infrastructure costs and operating expenses
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
          <p className="font-medium text-white">Expense Tracking Coming Soon</p>
          <p className="mt-1 text-sm text-gray-400">
            This page will help track and categorize expenses:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Cloud className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Infrastructure (Vercel, Supabase, domains)
            </li>
            <li className="flex items-center gap-2">
              <Server className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Third-party services (APIs, tools)
            </li>
            <li className="flex items-center gap-2">
              <Workflow className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Automation tools (Make.com, etc.)
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" style={{ color: "#D4AF37" }} />
              Communication (email, SMS)
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            Optional: Connect Mercury API for automatic bank transaction import
          </p>
        </div>
      </div>

      {/* Estimated Monthly Costs */}
      <div>
        <h2 className="mb-3 font-semibold text-white">Current Estimated Costs</h2>
        <div
          className="rounded-lg border bg-white/5"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500" style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3 text-right">Monthly Est.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-400">Hosting</td>
                <td className="px-4 py-2 text-gray-300">Vercel Pro</td>
                <td className="px-4 py-2 text-right text-gray-300">$20</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-400">Database</td>
                <td className="px-4 py-2 text-gray-300">Supabase</td>
                <td className="px-4 py-2 text-right text-gray-300">$0–25</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-400">Domains</td>
                <td className="px-4 py-2 text-gray-300">3 domains</td>
                <td className="px-4 py-2 text-right text-gray-300">~$3</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-400">Email</td>
                <td className="px-4 py-2 text-gray-300">Resend</td>
                <td className="px-4 py-2 text-right text-gray-300">$0</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}>
                <td className="px-4 py-2 text-gray-400">Automation</td>
                <td className="px-4 py-2 text-gray-300">Make.com</td>
                <td className="px-4 py-2 text-right text-gray-300">$0</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-white" colSpan={2}>
                  Total Estimated
                </td>
                <td className="px-4 py-2 text-right font-medium text-white">$23–48</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
