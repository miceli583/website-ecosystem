"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { CalendarClock, Image as ImageIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

function DailyAnchorAutomationPageContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") ?? "dev";
  const [baseUrl, setBaseUrl] = useState("");

  // Set base URL on client side only to avoid hydration mismatch
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const imageUrls = [
    `${baseUrl}/dailyanchorautomation/image1?domain=${domain}`,
    `${baseUrl}/dailyanchorautomation/image2?domain=${domain}`,
    `${baseUrl}/dailyanchorautomation/image3?domain=${domain}`,
  ];

  // Don't render images until we have the base URL (client-side only)
  if (!baseUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1
              className="mb-4 text-4xl font-bold text-black dark:text-white"
              style={{
                fontFamily: "var(--font-cinzel)",
                letterSpacing: "0.1em",
              }}
            >
              Daily Anchor Automation
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <section className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8941F] shadow-lg">
              <CalendarClock className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1
            className="mb-4 text-5xl font-bold text-black dark:text-white"
            style={{
              fontFamily: "var(--font-cinzel)",
              letterSpacing: "0.1em",
            }}
          >
            Daily Anchor Automation
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            Temporary staging area for Instagram carousel images
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
              Automation Staging
            </Badge>
          </div>
        </section>

        {/* Image Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {imageUrls.map((url, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-2 border-[#D4AF37]/20 transition-all duration-300 hover:shadow-2xl dark:border-[#D4AF37]/30"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8941F]">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Page {index + 1}</CardTitle>
                    <CardDescription>Instagram Carousel</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                  <Image
                    src={url}
                    alt={`Carousel Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-2 text-sm font-medium text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
                >
                  View Full Size
                  <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="border-2 border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              These images are temporarily stored in memory for Instagram
              posting automation.
              <br />
              They will be replaced when a new post is generated from the{" "}
              <Link
                href={`/admin/daily-values?domain=${domain}&tab=generate`}
                className="font-medium text-[#D4AF37] hover:underline"
              >
                Daily Values Generator
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DailyAnchorAutomationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <DailyAnchorAutomationPageContent />
    </Suspense>
  );
}
