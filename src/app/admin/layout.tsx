import type { ReactNode } from "react";

/**
 * Admin Layout
 *
 * This is a pass-through layout that provides a grouping for all admin routes.
 * Authentication is handled globally by middleware (src/middleware.ts).
 *
 * All routes under /admin/* are:
 * - Protected by authentication
 * - Only accessible on miraclemind.dev domain
 * - Redirect to /admin/login if not authenticated
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
