"use client";

/**
 * CargoWatch Profile Page Demo
 * User profile display with contact info, company details, activity feed, and stats.
 * Static data, no auth, Lucide icons.
 */

import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Bell,
  Activity,
  BadgeCheck,
  Hash,
  Truck,
  Clock,
  FileText,
  MapPin,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { DEMO_USER, DEMO_ACTIVITY } from "~/lib/cargowatch-data";
import type { CWUser } from "~/lib/cargowatch-data";

/* ---------- Profile Stats ---------- */

const PROFILE_STATS = [
  { label: "Reports Filed", value: 24, icon: FileText },
  { label: "Regions Monitored", value: 6, icon: MapPin },
  { label: "Alerts Raised", value: 38, icon: AlertTriangle },
];

/* ---------- Helper: Initials ---------- */

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ---------- Helper: Role Label ---------- */

function formatRole(role: CWUser["role"]): string {
  const labels: Record<CWUser["role"], string> = {
    admin: "Administrator",
    driver: "Driver",
    security: "Security",
    law_enforcement: "Law Enforcement",
    fleet_manager: "Fleet Manager",
  };
  return labels[role];
}

/* ---------- Section Card ---------- */

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-cw-navy-light p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cw-red/10">
          <Icon className="h-5 w-5 text-cw-red" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ---------- Info Row ---------- */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-gray-500" />
      <span className="w-28 shrink-0 text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-200">{value}</span>
    </div>
  );
}

/* ---------- Toggle Row ---------- */

function ToggleRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300">{label}</span>
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${
          enabled ? "bg-cw-red" : "bg-gray-700"
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export function CargoWatchProfile({ baseUrl }: { baseUrl: string }) {
  const user = DEMO_USER;

  return (
    <div className="w-full">
      {/* Profile Header */}
      <div
        className="border-b border-gray-800"
        style={{
          background: "linear-gradient(to bottom, #151822, #1b202b)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-cw-red text-2xl font-bold text-white">
              {getInitials(user.fullName)}
            </div>

            {/* Name & Meta */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-white">
                  {user.fullName}
                </h1>
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cw-red/10 px-2.5 py-0.5 text-xs font-medium text-cw-red">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-gray-300">
                {user.companyRole} at {user.company}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                {formatRole(user.role)} &middot; Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Edit button (display only) */}
            <Link
              href={baseUrl}
              className="shrink-0 rounded-md bg-cw-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cw-red-hover"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-gray-800 bg-cw-navy-dark">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-gray-800">
            {PROFILE_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-5">
                <div className="flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-cw-red" />
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <span className="mt-1 text-xs text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div
        className="py-8"
        style={{
          background:
            "linear-gradient(135deg, #242936 0%, #1b202b 40%, #0f1219 100%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Contact Info */}
              <SectionCard title="Contact Information" icon={Mail}>
                <div className="divide-y divide-gray-800">
                  <InfoRow icon={Mail} label="Email" value={user.email} />
                  <InfoRow icon={Phone} label="Phone" value={user.phone} />
                  <InfoRow
                    icon={Building2}
                    label="Department"
                    value={user.department}
                  />
                </div>
              </SectionCard>

              {/* Company Details */}
              <SectionCard title="Company Details" icon={Building2}>
                <div className="divide-y divide-gray-800">
                  <InfoRow
                    icon={Building2}
                    label="Company"
                    value={user.company}
                  />
                  <InfoRow
                    icon={Truck}
                    label="MC Number"
                    value={user.mcNumber}
                  />
                  <InfoRow
                    icon={Hash}
                    label="DOT Number"
                    value={user.dotNumber}
                  />
                  <InfoRow
                    icon={Shield}
                    label="Badge Number"
                    value={user.badgeNumber}
                  />
                </div>
              </SectionCard>

              {/* Account Settings */}
              <SectionCard title="Account Settings" icon={Bell}>
                <div className="divide-y divide-gray-800">
                  <ToggleRow
                    label="Push Notifications"
                    enabled={user.notificationsEnabled}
                  />
                  <ToggleRow
                    label="Email Alerts"
                    enabled={user.emailAlertsEnabled}
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Settings are display-only in this demo.
                </p>
              </SectionCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Bio */}
              <SectionCard title="Bio" icon={User}>
                <p className="text-sm leading-relaxed text-gray-300">
                  {user.bio}
                </p>
              </SectionCard>

              {/* Activity Feed */}
              <SectionCard title="Recent Activity" icon={Activity}>
                <div className="space-y-0 divide-y divide-gray-800">
                  {DEMO_ACTIVITY.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cw-navy">
                        <Activity className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white">{item.action}</p>
                        <p className="truncate text-xs text-gray-400">
                          {item.detail}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Quick Links */}
              <SectionCard title="Quick Links" icon={ChevronRight}>
                <div className="space-y-1">
                  {[
                    {
                      label: "Dashboard",
                      href: `${baseUrl}/dashboard`,
                      icon: Activity,
                    },
                    {
                      label: "My Alerts",
                      href: `${baseUrl}/alerts`,
                      icon: Bell,
                    },
                    {
                      label: "Incident Map",
                      href: `${baseUrl}/map`,
                      icon: MapPin,
                    },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-cw-navy hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <link.icon className="h-4 w-4 text-gray-500" />
                        {link.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </Link>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-cw-navy-dark py-8">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CargoWatch. Profile data shown is
            for demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
