"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getDomainConfig, DOMAINS } from "~/lib/domains";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

interface DomainLayoutProps {
  children: React.ReactNode;
  hostname?: string;
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
                      <span className="mr-3 text-base">{link.config.logo}</span>
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

export function DomainLayout({ children, hostname }: DomainLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [currentHostname, setCurrentHostname] = useState(hostname || "");

  useEffect(() => {
    setMounted(true);
    if (!hostname && typeof window !== "undefined") {
      setCurrentHostname(window.location.hostname);
    }
  }, [hostname]);

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

  const domainConfig = getDomainConfig(currentHostname);

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header Navigation */}
      <header className="border-border/40 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Left side: Menu + Logo */}
          <div className="flex items-center space-x-3">
            <EcosystemMenu currentHostname={currentHostname} />
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold"
            >
              <span className="text-2xl">{domainConfig.logo}</span>
              <span className="hidden sm:inline">{domainConfig.name}</span>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            {domainConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-border/40 mt-auto border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{domainConfig.logo}</span>
              <span className="font-medium">{domainConfig.name}</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {domainConfig.tagline}
            </p>
            <div className="text-muted-foreground flex space-x-4 text-sm">
              <span>© 2024</span>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
