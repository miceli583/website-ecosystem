"use client";

import { PortalFilterProvider } from "~/components/portal";
import { PortalDashboardLayout } from "~/components/portal/portal-dashboard-layout";

export default function PortalSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <PortalFilterProvider>
      <PortalDashboardLayout params={params}>{children}</PortalDashboardLayout>
    </PortalFilterProvider>
  );
}
