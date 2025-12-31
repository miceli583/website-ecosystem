import { DevHub } from "~/components/pages/dev-hub";
import { Suspense } from "react";
import { DomainLayout } from "~/components/domain-layout";

/**
 * Admin Dashboard - Development Hub
 *
 * Authentication is handled by middleware (src/middleware.ts)
 * All /admin/* routes are protected and redirect to /admin/login if not authenticated
 */
function AdminPageContent() {
  return (
    <DomainLayout>
      <DevHub />
    </DomainLayout>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AdminPageContent />
    </Suspense>
  );
}
