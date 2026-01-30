"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";

interface ClientPortalLayoutProps {
  clientName: string;
  slug: string;
  children: ReactNode;
  basePath?: string;
}

export function ClientPortalLayout({
  clientName,
  slug,
  children,
  basePath = "/portal",
}: ClientPortalLayoutProps) {
  const router = useRouter();
  const { data: profile } = api.portal.getMyProfile.useQuery();
  const isAdmin = profile?.role === "admin";

  const navItems = [
    { name: "Dashboard", href: `${basePath}/${slug}` },
    { name: "Demos", href: `${basePath}/${slug}/demos` },
    { name: "Proposals", href: `${basePath}/${slug}/proposals` },
    { name: "Tooling", href: `${basePath}/${slug}/tooling` },
    { name: "Billing", href: `${basePath}/${slug}/billing` },
    { name: "Profile", href: `${basePath}/${slug}/profile` },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/?domain=live");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin back link */}
      {isAdmin && (
        <div
          className="border-b px-4 py-2 sm:px-6"
          style={{ borderColor: "rgba(212, 175, 55, 0.1)" }}
        >
          <div className="mx-auto max-w-6xl">
            <Link
              href="/portal?domain=live"
              className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className="border-b px-4 py-4 sm:px-6"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                src="/brand/miracle-mind-orbit-star-v3.svg"
                alt="Miracle Mind"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500">Client Portal</p>
              <p className="text-sm font-semibold">{clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden gap-6 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
