import type { ReactNode } from "react";
import { AdminDashboardLayout } from "~/components/admin";

/**
 * Admin Layout
 *
 * Provides the dashboard shell (sidebar + header) for all admin routes
 * except the login page, which uses its own standalone layout.
 *
 * Authentication is handled globally by middleware (src/middleware.ts).
 *
 * All routes under /admin/* are:
 * - Protected by authentication
 * - Only accessible on miraclemind.dev domain
 * - Redirect to /admin/login if not authenticated
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
