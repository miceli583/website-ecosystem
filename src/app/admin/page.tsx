import { DevHub } from "~/components/pages/dev-hub";
import { DomainLayout } from "~/components/domain-layout";

/**
 * Admin Dashboard - Development Hub
 *
 * Authentication is handled by middleware (src/middleware.ts)
 * All /admin/* routes are protected and redirect to /admin/login if not authenticated
 */
export default function AdminPage() {
  return (
    <DomainLayout>
      <DevHub />
    </DomainLayout>
  );
}
