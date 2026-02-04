"use client";

import { PortalFilterProvider } from "~/components/portal";

export default function PortalSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalFilterProvider>{children}</PortalFilterProvider>;
}
