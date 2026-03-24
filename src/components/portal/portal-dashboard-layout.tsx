"use client";

import { type ReactNode, use } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";
import {
  PortalSidebarProvider,
  usePortalSidebar,
} from "./portal-sidebar-context";
import {
  PortalSidebar,
  PORTAL_SIDEBAR_WIDTH,
  PORTAL_SIDEBAR_WIDTH_COLLAPSED,
} from "./portal-sidebar";
import { PortalHeader } from "./portal-header";

function PortalContent({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapsed, closeMobile } = usePortalSidebar();

  const { data: profile, isLoading: profileLoading } =
    api.portal.getMyProfile.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const { data: client, isLoading: clientLoading } =
    api.portal.getClientBySlug.useQuery({ slug }, { staleTime: 5 * 60 * 1000 });

  // Close mobile menu on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal");
  };

  if (profileLoading || clientLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#D4AF37" }}
        />
      </div>
    );
  }

  if (!profile || !client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-gray-400">Portal not found.</p>
      </div>
    );
  }

  const isAdmin = profile.role === "admin";
  const clientName = client.name;

  return (
    <div className="min-h-screen bg-black text-white">
      <PortalSidebar
        clientName={clientName}
        slug={slug}
        isAdmin={isAdmin}
        onSignOut={handleSignOut}
      />
      <PortalHeader clientName={clientName} />

      <main
        className="min-h-screen pt-14 transition-all duration-200 ease-out"
        style={{
          marginLeft: isCollapsed
            ? PORTAL_SIDEBAR_WIDTH_COLLAPSED
            : PORTAL_SIDEBAR_WIDTH,
        }}
      >
        <div className="p-6">{children}</div>
      </main>

      <style jsx>{`
        @media (max-width: 767px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export function PortalDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return (
    <PortalSidebarProvider>
      <PortalContent slug={slug}>{children}</PortalContent>
    </PortalSidebarProvider>
  );
}
