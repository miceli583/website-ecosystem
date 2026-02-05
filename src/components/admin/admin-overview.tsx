"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Users,
  FileText,
  Palette,
  Zap,
  Code2,
  Rocket,
  CalendarClock,
  BookOpen,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { api } from "~/trpc/react";

interface QuickLinkCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  stat?: string;
  statLabel?: string;
}

function QuickLinkCard({
  title,
  description,
  href,
  icon,
  stat,
  statLabel,
}: QuickLinkCardProps) {
  return (
    <Link href={href} className="group block">
      <div
        className="h-full rounded-lg border bg-white/5 p-5 transition-all hover:bg-white/10"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
      >
        <div className="mb-3 flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(212, 175, 55, 0.1)" }}
          >
            <div style={{ color: "#D4AF37" }}>{icon}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-500 transition-transform group-hover:translate-x-1 group-hover:text-[#D4AF37]" />
        </div>
        <h3 className="mb-1 font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        {stat && (
          <p className="mt-3 text-xs text-gray-500">
            <span className="font-medium text-[#D4AF37]">{stat}</span>{" "}
            {statLabel}
          </p>
        )}
      </div>
    </Link>
  );
}

interface ExternalLinkCardProps {
  title: string;
  href: string;
  color: string;
}

function ExternalLinkCard({ title, href, color }: ExternalLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-lg border bg-white/5 px-4 py-3 transition-all hover:bg-white/10"
      style={{ borderColor: `${color}20` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium text-gray-300">{title}</span>
      </div>
      <ExternalLink className="h-4 w-4 text-gray-500 transition-colors group-hover:text-gray-300" />
    </a>
  );
}

export function AdminOverview() {
  // Fetch stats
  const { data: dailyValuesStats } = api.dailyValues.getStats.useQuery();
  const { data: clients } = api.portal.listClients.useQuery();

  const clientCount = clients?.length ?? 0;
  const activeClientCount =
    clients?.filter((c: { status: string }) => c.status === "active").length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12">
          <Image
            src="/brand/miracle-mind-orbit-star-v3.svg"
            alt="Miracle Mind"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">
            Miracle Mind Ecosystem Management
          </p>
        </div>
      </div>

      {/* Quick Links Grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-300">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLinkCard
            title="Clients"
            description="Manage client portals and accounts"
            href="/admin/clients"
            icon={<Users className="h-5 w-5" />}
            stat={`${activeClientCount}/${clientCount}`}
            statLabel="active clients"
          />
          <QuickLinkCard
            title="Daily Values"
            description="Manage daily value post content"
            href="/admin/daily-values"
            icon={<CalendarClock className="h-5 w-5" />}
            stat={String(dailyValuesStats?.coreValues ?? 0)}
            statLabel="core values"
          />
          <QuickLinkCard
            title="Blog"
            description="Manage blog posts and drafts"
            href="/admin/blog"
            icon={<BookOpen className="h-5 w-5" />}
          />
          <QuickLinkCard
            title="Brand Assets"
            description="Visual identity and guidelines"
            href="/admin/brand"
            icon={<Palette className="h-5 w-5" />}
          />
          <QuickLinkCard
            title="Templates"
            description="Full-page template collection"
            href="/admin/templates"
            icon={<Rocket className="h-5 w-5" />}
          />
          <QuickLinkCard
            title="Shaders"
            description="WebGL shader animations"
            href="/admin/shaders"
            icon={<Zap className="h-5 w-5" />}
          />
          <QuickLinkCard
            title="Playground"
            description="Interactive UI demos"
            href="/admin/playground"
            icon={<Code2 className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Live Sites Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-300">Live Sites</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <ExternalLinkCard
            title="matthewmiceli.com"
            href="https://matthewmiceli.com"
            color="#3b82f6"
          />
          <ExternalLinkCard
            title="miraclemind.dev"
            href="https://miraclemind.dev"
            color="#8b5cf6"
          />
          <ExternalLinkCard
            title="miraclemind.live"
            href="https://miraclemind.live"
            color="#10b981"
          />
        </div>
      </section>

      {/* Development Environment Note */}
      <section>
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
            backgroundColor: "rgba(212, 175, 55, 0.05)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="/brand/miracle-mind-orbit-star-v3.svg"
                alt=""
                fill
                className="object-contain opacity-60"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">
                Development Environment
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                This is the admin dashboard for the Miracle Mind ecosystem.
                Features are under active development.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
