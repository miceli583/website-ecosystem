"use client";

import { use, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ShieldCheck, Menu, X } from "lucide-react";

export default function CargoWatchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const baseUrl = `/portal/${slug}/demos/cargowatch`;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: baseUrl },
    { name: "Resources", href: `${baseUrl}/resources` },
    { name: "About", href: `${baseUrl}/about` },
  ];

  const isDashboardRoute =
    pathname.includes("/dashboard") ||
    pathname.includes("/alerts") ||
    pathname.includes("/map") ||
    pathname.includes("/profile");

  return (
    <div className="min-h-screen bg-cw-navy">
      {/* Back to Demos sliver */}
      <div
        className="border-b px-4 py-1.5 sm:px-6"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)", background: "#000" }}
      >
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/portal/${slug}/demos`}
            className="inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Demos
          </Link>
        </div>
      </div>

      {/* CargoWatch Main Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-cw-navy-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={baseUrl} className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cw-red">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                  Cargo Watch
                </span>
                <span className="text-xs text-gray-400">
                  America&apos;s Freight Protection Network
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center space-x-1 md:flex">
              {navLinks.map((item) => {
                const isActive =
                  item.href === baseUrl
                    ? pathname === baseUrl
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-cw-navy-light text-white"
                        : "text-gray-300 hover:bg-cw-navy-light hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href={isDashboardRoute ? baseUrl : `${baseUrl}/dashboard`}
                className="ml-2 rounded-md bg-cw-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cw-red-hover"
              >
                {isDashboardRoute ? "Back to Site" : "Go to Dashboard"}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-cw-navy-light hover:text-white md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="border-t border-gray-800 pb-3 pt-2 md:hidden">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-cw-navy-light hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href={isDashboardRoute ? baseUrl : `${baseUrl}/dashboard`}
                className="mt-1 block rounded-md bg-cw-red px-3 py-2 text-base font-medium text-white hover:bg-cw-red-hover"
                onClick={() => setMobileOpen(false)}
              >
                {isDashboardRoute ? "Back to Site" : "Go to Dashboard"}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Page content */}
      {children}
    </div>
  );
}
