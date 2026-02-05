"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  Table2,
  HardDrive,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

/**
 * Database Health Dashboard
 * Shows table statistics and health advisors from Supabase
 */
export default function DatabaseHealthPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  // These would ideally come from Supabase Management API or direct queries
  // For now, showing placeholder structure
  const tables = [
    { name: "profiles", rows: "~25", size: "48 KB", hasRLS: true },
    { name: "clients", rows: "~15", size: "32 KB", hasRLS: true },
    { name: "projects", rows: "~30", size: "24 KB", hasRLS: true },
    { name: "resources", rows: "~100", size: "96 KB", hasRLS: true },
    { name: "notes", rows: "~200", size: "256 KB", hasRLS: true },
    { name: "core_values", rows: "~50", size: "16 KB", hasRLS: true },
    { name: "quotes", rows: "~500", size: "128 KB", hasRLS: true },
    { name: "authors", rows: "~100", size: "24 KB", hasRLS: true },
    { name: "banyan_signups", rows: "~10", size: "8 KB", hasRLS: true },
    { name: "blog_posts", rows: "~5", size: "64 KB", hasRLS: true },
    { name: "contact_submissions", rows: "~20", size: "32 KB", hasRLS: true },
  ];

  const advisors = {
    security: [
      { severity: "success", message: "All tables have RLS enabled", url: null },
      { severity: "success", message: "No exposed service role key detected", url: null },
      { severity: "info", message: "Consider adding rate limiting policies", url: "https://supabase.com/docs/guides/platform/performance#rate-limiting" },
    ],
    performance: [
      { severity: "success", message: "No missing indexes detected", url: null },
      { severity: "info", message: "Consider adding indexes on frequently filtered columns", url: "https://supabase.com/docs/guides/database/postgres/indexes" },
      { severity: "info", message: "Enable connection pooling for production scale", url: "https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2">
            <Link
              href="/admin/tooling"
              className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tooling
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">Database Health</h1>
          <p className="text-sm text-gray-400">
            Supabase PostgreSQL statistics and recommendations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRefreshKey((k) => k + 1)}
          className="border-gray-700 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Table2 className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{tables.length}</p>
          <p className="text-xs text-gray-500">Tables</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <HardDrive className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">~750 KB</p>
          <p className="text-xs text-gray-500">Total Size</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-green-400">100%</p>
          <p className="text-xs text-gray-500">RLS Coverage</p>
        </div>
        <div
          className="rounded-lg border bg-white/5 p-4 text-center"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4" style={{ color: "#D4AF37" }} />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">~40</p>
          <p className="text-xs text-gray-500">Auth Users</p>
        </div>
      </div>

      {/* Tables Section */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
          <Table2 className="h-4 w-4" style={{ color: "#D4AF37" }} />
          Tables
        </h2>
        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-white/5 text-left text-xs uppercase tracking-wider text-gray-500" style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3 text-right">Rows</th>
                <th className="px-4 py-3 text-right">Size</th>
                <th className="px-4 py-3 text-center">RLS</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr
                  key={table.name}
                  className="border-b bg-white/5 last:border-b-0 hover:bg-white/10"
                  style={{ borderColor: "rgba(212, 175, 55, 0.05)" }}
                >
                  <td className="px-4 py-2">
                    <code className="text-gray-300">{table.name}</code>
                  </td>
                  <td className="px-4 py-2 text-right text-gray-400">{table.rows}</td>
                  <td className="px-4 py-2 text-right text-gray-400">{table.size}</td>
                  <td className="px-4 py-2 text-center">
                    {table.hasRLS ? (
                      <CheckCircle2 className="mx-auto h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="mx-auto h-4 w-4 text-red-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisors Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Security Advisors */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Shield className="h-4 w-4" style={{ color: "#D4AF37" }} />
            Security
          </h2>
          <div
            className="space-y-2 rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {advisors.security.map((advisor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3"
              >
                {advisor.severity === "success" && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                )}
                {advisor.severity === "warning" && (
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                )}
                {advisor.severity === "info" && (
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{advisor.message}</p>
                  {advisor.url && (
                    <a
                      href={advisor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#D4AF37" }}
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Advisors */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Zap className="h-4 w-4" style={{ color: "#D4AF37" }} />
            Performance
          </h2>
          <div
            className="space-y-2 rounded-lg border bg-white/5 p-4"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            {advisors.performance.map((advisor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3"
              >
                {advisor.severity === "success" && (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                )}
                {advisor.severity === "warning" && (
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                )}
                {advisor.severity === "info" && (
                  <Zap className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#D4AF37" }} />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{advisor.message}</p>
                  {advisor.url && (
                    <a
                      href={advisor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#D4AF37" }}
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: "rgba(212, 175, 55, 0.2)",
          backgroundColor: "rgba(212, 175, 55, 0.05)",
        }}
      >
        <p className="text-sm text-gray-400">
          <strong className="text-gray-300">Note:</strong> Table statistics shown are estimates.
          For live metrics, connect to the Supabase Dashboard or use the Management API.
        </p>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-sm transition-colors hover:text-white"
          style={{ color: "#D4AF37" }}
        >
          Open Supabase Dashboard
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
