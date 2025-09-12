"use client";

import { useEffect, useState } from "react";
import { getDomainConfig, DOMAINS } from "~/lib/domains";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { Button } from "./ui/button";

interface DomainLayoutProps {
  children: React.ReactNode;
  hostname?: string;
}

function EcosystemNav({ currentHostname }: { currentHostname: string }) {
  const getEcosystemLinks = () => {
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

  return (
    <div className="border-border bg-background/50 flex items-center space-x-1 rounded-md border p-1">
      <span className="text-muted-foreground px-2 text-xs font-medium">
        Ecosystem:
      </span>
      {ecosystemLinks.map((link) => (
        <Button
          key={link.key}
          asChild
          variant={link.isActive ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2 text-xs"
        >
          <Link href={link.href}>
            <span className="mr-1">{link.config.logo}</span>
            <span className="hidden xl:inline">
              {link.config.name.split(" ")[0]}
            </span>
          </Link>
        </Button>
      ))}
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
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <span className="text-2xl">{domainConfig.logo}</span>
            <span className="hidden sm:inline">{domainConfig.name}</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
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

            {/* Ecosystem Navigation */}
            <div className="hidden lg:block">
              <EcosystemNav currentHostname={currentHostname} />
            </div>
          </div>

          {/* Theme Toggle */}
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
          {/* Mobile Ecosystem Navigation */}
          <div className="mb-6 block lg:hidden">
            <div className="text-center">
              <p className="text-muted-foreground mb-3 text-sm font-medium">
                Explore the Ecosystem
              </p>
              <div className="flex justify-center">
                <EcosystemNav currentHostname={currentHostname} />
              </div>
            </div>
          </div>

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
