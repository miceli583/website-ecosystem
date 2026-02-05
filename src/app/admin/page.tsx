import { AdminOverview } from "~/components/admin";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Miracle Mind",
  description: "Admin dashboard for managing Miracle Mind ecosystem",
};

/**
 * Admin Dashboard - Overview
 *
 * Authentication is handled by middleware (src/middleware.ts)
 * All /admin/* routes are protected and redirect to /admin/login if not authenticated
 */
export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D4AF37" }} />
        </div>
      }
    >
      <AdminOverview />
    </Suspense>
  );
}
