"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowLeft, LogOut, Menu, X } from "lucide-react";
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
  const pathname = usePathname();
  const utils = api.useUtils();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: profile, isLoading: profileLoading } = api.portal.getMyProfile.useQuery(
    undefined,
    { staleTime: 0 } // Always fetch fresh profile data
  );
  // Only show admin features when profile is loaded AND role is admin
  const isAdmin = !profileLoading && profile?.role === "admin";
  // Check if user is viewing their own portal (client viewing own, not admin viewing client)
  const isOwnPortal = profile?.clientSlug === slug;
  // Display name: show user's name only if viewing own portal, otherwise show client name
  const displayName = isOwnPortal ? (profile?.name ?? clientName) : clientName;

  const navItems = [
    { name: "Demos", href: `${basePath}/${slug}/demos` },
    { name: "Proposals", href: `${basePath}/${slug}/proposals` },
    { name: "Tooling", href: `${basePath}/${slug}/tooling` },
    { name: "Notes", href: `${basePath}/${slug}/notes` },
    { name: "Billing", href: `${basePath}/${slug}/billing` },
    { name: "Profile", href: `${basePath}/${slug}/profile` },
  ];

  const isActiveLink = (href: string) => pathname?.startsWith(href);

  const handleSignOut = async () => {
    // Invalidate all cached data before signing out
    await utils.invalidate();
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
              <p className="text-sm font-semibold">{displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop nav */}
            <nav className="hidden gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors hover:text-white ${
                    isActiveLink(item.href) ? "font-medium text-[#D4AF37]" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* Desktop sign out */}
            <button
              onClick={handleSignOut}
              className="hidden items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white sm:flex"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 transform bg-black transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderLeft: "1px solid rgba(212, 175, 55, 0.2)" }}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.2)" }}
        >
          <span className="font-medium text-white">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm transition-colors hover:bg-white/10 ${
                isActiveLink(item.href)
                  ? "font-medium text-[#D4AF37]"
                  : "text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <hr
            className="my-3 border-0"
            style={{ borderTop: "1px solid rgba(212, 175, 55, 0.2)" }}
          />
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              void handleSignOut();
            }}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </nav>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
