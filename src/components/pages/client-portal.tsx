"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

interface ClientPortalLayoutProps {
  clientName: string;
  slug: string;
  children: ReactNode;
}

export function ClientPortalLayout({
  clientName,
  slug,
  children,
}: ClientPortalLayoutProps) {
  const navItems = [
    { name: "Dashboard", href: `/client/${slug}` },
    { name: "Demos", href: `/client/${slug}/demos` },
    { name: "Proposals", href: `/client/${slug}/proposals` },
    { name: "Billing", href: `/client/${slug}/billing` },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
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
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
