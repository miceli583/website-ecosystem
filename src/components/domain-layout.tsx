"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getDomainConfig,
  DOMAINS,
  ADMIN_NAV,
  isAdminPath,
} from "~/lib/domains";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

interface DomainLayoutProps {
  children: React.ReactNode;
  hostname?: string;
  headerClassName?: string;
  footerClassName?: string;
}

function EcosystemMenu({ currentHostname }: { currentHostname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getEcosystemLinks = () => {
    if (!mounted) return [];

    const isLocalhost = currentHostname.includes("localhost");

    const ecosystemDomains = [
      {
        key: "matthew",
        domain: DOMAINS.MATTHEW_MICELI,
        config: getDomainConfig("matthewmiceli.com"),
      },
      {
        key: "live",
        domain: DOMAINS.MIRACLE_MIND_LIVE,
        config: getDomainConfig("miraclemind.live"),
      },
      {
        key: "dev",
        domain: DOMAINS.MIRACLE_MIND_DEV,
        config: getDomainConfig("miraclemind.dev"),
      },
    ];

    return ecosystemDomains.map((domain) => {
      let href: string;
      let isActive: boolean;

      if (isLocalhost) {
        href = `/?domain=${domain.key}`;
        const urlParams = new URLSearchParams(window.location.search);
        const currentDomain = urlParams.get("domain") || "matthew";
        isActive = currentDomain === domain.key;
      } else {
        href = `https://${domain.domain}`;
        const domainPrefix = domain.domain.split(".")[0];
        isActive = domainPrefix
          ? currentHostname.includes(domainPrefix)
          : false;
      }

      return {
        ...domain,
        href,
        isActive,
      };
    });
  };

  const ecosystemLinks = getEcosystemLinks();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 opacity-50"
        disabled
        aria-label="Loading menu"
      >
        <Menu className="h-4 w-4" />
      </Button>
    );
  }

  const renderMenu = () => {
    if (!mounted) return null;

    return createPortal(
      <div
        className={`fixed inset-0 z-[50000] transition-all duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={handleMenuClose}
        />
        <div
          className={`absolute top-16 left-4 w-80 transform transition-all duration-200 ease-out ${
            isOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-2 scale-95 opacity-0"
          }`}
        >
          <div className="border-border bg-background rounded-lg border p-4 shadow-xl ring-1 ring-black/5 dark:ring-white/5">
            <div className="space-y-4">
              <div>
                <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
                  Ecosystem Sites
                </h3>
                <div className="space-y-1">
                  {ecosystemLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      onClick={handleMenuClose}
                      className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-start rounded-md p-3 text-sm transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="mr-3">
                        {link.config.logo.startsWith("/") ? (
                          <div className="relative h-6 w-6">
                            <Image
                              src={link.config.logo}
                              alt={link.config.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <span className="text-base">{link.config.logo}</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium ${link.isActive ? "text-primary" : ""}`}
                        >
                          {link.config.name}
                        </div>
                        <div className="text-xs opacity-70">{link.domain}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 transition-all duration-150 hover:scale-110 active:scale-95"
        onClick={handleToggle}
        aria-label={isOpen ? "Close ecosystem menu" : "Open ecosystem menu"}
        aria-expanded={isOpen}
      >
        <div className="relative h-4 w-4">
          <Menu
            className={`absolute h-4 w-4 transform transition-all duration-200 ${
              isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <X
            className={`absolute h-4 w-4 transform transition-all duration-200 ${
              isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          />
        </div>
      </Button>

      {renderMenu()}
    </div>
  );
}

export function DomainLayout({
  children,
  hostname,
  headerClassName,
  footerClassName,
}: DomainLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [currentHostname, setCurrentHostname] = useState(hostname || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain");
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (!hostname && typeof window !== "undefined") {
      setCurrentHostname(window.location.hostname);
    }
  }, [hostname]);

  // Force re-render when domain param changes
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [domainParam]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        {children}
      </div>
    );
  }

  // Miracle Mind routes that should always use dev config
  const miracleMindRoutes = ["/banyan", "/services", "/contact", "/stewardship"];
  const isMiracleMindRoute = miracleMindRoutes.some(route => pathname.startsWith(route));

  // Helper to build href with domain param preserved on localhost
  const buildHref = (path: string) => {
    if (currentHostname.includes("localhost") && domainParam) {
      return `${path}?domain=${domainParam}`;
    }
    return path;
  };

  // Force re-evaluation of domainConfig when domain param changes
  // On localhost, infer domain from pathname if it's a Miracle Mind route
  let effectiveHostname = currentHostname;
  if (currentHostname.includes("localhost") && isMiracleMindRoute && !domainParam) {
    effectiveHostname = "miraclemind.dev"; // Force dev config for MM routes
  }

  const domainConfig = getDomainConfig(effectiveHostname);
  const isAdmin = isAdminPath(pathname);
  const navItems = isAdmin ? ADMIN_NAV : domainConfig.nav;

  // Determine display name based on current route
  let displayName: string = domainConfig.name;
  if (isAdmin) {
    if (pathname.startsWith("/admin/matthewmiceli")) {
      displayName = "Matthew Miceli";
    } else if (pathname.startsWith("/admin/miraclemind-live")) {
      displayName = "Miracle Mind";
    } else if (pathname.startsWith("/admin/miraclemind-dev")) {
      displayName = "Miracle Mind";
    } else {
      displayName = `${domainConfig.name} Admin`;
    }
  }

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header Navigation */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md ${headerClassName || ""}`}
        style={{ backgroundColor: "#0b0b0b" }}
      >
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Left side: Logo */}
          <div className="flex items-center">
            <Link
              href={currentHostname.includes("localhost") ? "/?domain=dev" : "https://miraclemind.dev"}
              className="flex items-center"
            >
              <div className="relative h-16 w-64 -mt-1">
                <Image
                  src="/brand/miracle-mind-logo-no-slogan.png"
                  alt="Miracle Mind"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-white/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={buildHref(item.href)}
                  className="text-white hover:text-white/80 text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Explore Banyan Button - Show on Miracle Mind domains */}
            {((currentHostname.includes("localhost") && (domainParam === "dev" || domainParam === "live")) ||
              currentHostname.includes("miraclemind.dev") || currentHostname.includes("miraclemind.live")) && !isAdminPath(pathname) && (
              <Link href={buildHref("/banyan")}>
                <button
                  className="px-6 py-2 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 rounded-md"
                  style={{
                    background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                  }}
                >
                  Explore BANYAN
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-black md:hidden">
            <nav className="container mx-auto flex flex-col space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={buildHref(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                >
                  {item.name}
                </Link>
              ))}

              {/* Explore Banyan Button for mobile - Show on Miracle Mind domains */}
              {((currentHostname.includes("localhost") && (domainParam === "dev" || domainParam === "live")) ||
                currentHostname.includes("miraclemind.dev") || currentHostname.includes("miraclemind.live")) && !isAdminPath(pathname) && (
                <Link
                  href={buildHref("/banyan")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button
                    className="w-full rounded-md px-4 py-3 text-sm font-semibold text-black transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    }}
                  >
                    Explore BANYAN
                  </button>
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Header bottom divider */}
        <div className="w-full">
          <div className="h-px w-full" style={{ backgroundColor: "rgba(212,175,55,0.4)" }} />
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer
        className={`relative z-50 mt-auto border-t backdrop-blur-md ${footerClassName || ""}`}
        style={{ backgroundColor: "#0b0b0b", borderColor: "rgba(212,175,55,0.4)" }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="relative h-16 w-64">
              <Image
                src="/brand/miracle-mind-logo-no-slogan.png"
                alt="Miracle Mind"
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="flex gap-6">
              <Link href={buildHref("/stewardship")} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                Stewardship
              </Link>
              <Link href={buildHref("/terms")} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href={buildHref("/privacy")} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/?domain=live" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                Client Portal
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Miracle Mind LLC
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
