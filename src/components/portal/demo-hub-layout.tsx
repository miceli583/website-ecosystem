"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type ReactNode } from "react";

interface DemoHubLayoutProps {
  slug: string;
  title: string;
  subtitle: string;
  footerNote?: string;
  children: ReactNode;
  headerIcon?: ReactNode;
  headerLabel?: string;
}

export function DemoHubLayout({
  slug,
  title,
  subtitle,
  footerNote,
  children,
  headerIcon,
  headerLabel,
}: DemoHubLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className="border-b px-4 py-4 sm:px-6"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href={`/portal/${slug}?domain=live`}
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Link>
          {headerIcon && headerLabel && (
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#D4AF37" }}
              >
                {headerIcon}
              </div>
              <div>
                <p className="font-bold">{headerLabel}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-12 text-center">
          <h1
            className="mb-4 text-4xl font-bold sm:text-5xl"
            style={{
              background:
                "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">{subtitle}</p>
        </div>

        {children}

        {footerNote && (
          <p className="mt-12 text-center text-sm text-gray-500">
            {footerNote}
          </p>
        )}
      </main>
    </div>
  );
}
