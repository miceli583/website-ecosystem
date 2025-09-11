"use client";

import { useEffect, useState } from "react";
import { getDomainConfig } from "~/lib/domains";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { Button } from "./ui/button";

interface DomainLayoutProps {
  children: React.ReactNode;
  hostname?: string;
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
      <header className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <span className="text-2xl">{domainConfig.logo}</span>
            <span className="hidden sm:inline">{domainConfig.name}</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {domainConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{domainConfig.logo}</span>
              <span className="font-medium">{domainConfig.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {domainConfig.tagline}
            </p>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <span>© 2024</span>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}