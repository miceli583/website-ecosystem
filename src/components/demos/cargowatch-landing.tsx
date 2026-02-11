"use client";

/**
 * CargoWatch Landing Page Demo
 * Faithful copy of the original CargoWatch homepage for client portal demos.
 * No auth, static data, Lucide icons.
 */

import Link from "next/link";
import {
  ShieldCheck,
  BellRing,
  Users,
} from "lucide-react";
import { STATS } from "~/lib/cargowatch-data";

/* ---------- Main Component ---------- */

export function CargoWatchLanding({ baseUrl }: { baseUrl: string }) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 sm:py-32"
        style={{
          background: "linear-gradient(to bottom, #080a0f 0%, #1b202b 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Alert Banner */}
          <div className="mx-auto mb-8 flex max-w-2xl items-center justify-center">
            <div className="rounded-full bg-cw-red/10 px-4 py-2 text-sm font-medium text-cw-red ring-1 ring-inset ring-cw-red/20">
              <BellRing className="mr-2 inline-block h-4 w-4" />
              $35 Billion Annual Cargo Theft Problem
            </div>
          </div>

          {/* Hero Text */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Watch. Alert. Protect.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              A collaborative community technology platform for the US maritime, intermodal, and
              trucking community. Share real-time alerts, report incidents, and protect America&apos;s
              freight network together.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={`${baseUrl}/report`}
                className="inline-flex items-center gap-2 rounded-md bg-cw-red px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cw-red-hover"
              >
                <BellRing className="h-4 w-4" />
                Report an Incident
              </Link>
              <Link
                href={`${baseUrl}/alerts`}
                className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
              >
                <ShieldCheck className="h-4 w-4" />
                View Alert Feed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(to top, #080a0f 0%, #1b202b 70%, #242936 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Real-Time Alerts */}
            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <ShieldCheck className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Real-Time Alerts
              </h3>
              <p className="text-sm text-gray-400">
                Instant notifications of suspicious activity in your region with photos, videos, and
                details
              </p>
            </div>

            {/* Community-Driven */}
            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <Users className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Community-Driven
              </h3>
              <p className="text-sm text-gray-400">
                Connect with neighboring supply chain members and law enforcement to combat cargo
                crime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-cw-red">
                {STATS.totalIncidents}
              </div>
              <div className="mt-1 text-sm text-gray-600">Total Incidents</div>
              <div className="mt-1 text-xs text-cw-red">Live Data</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold" style={{ color: "#2563EB" }}>
                {STATS.totalUsers}
              </div>
              <div className="mt-1 text-sm text-gray-600">Active Members</div>
              <div className="mt-1 text-xs" style={{ color: "#2563EB" }}>
                Growing Daily
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold" style={{ color: "#16A34A" }}>
                $8.3M
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Estimated Losses Prevented
              </div>
              <div className="mt-1 text-xs" style={{ color: "#16A34A" }}>
                Community Impact
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold" style={{ color: "#9333EA" }}>
                {STATS.totalRegions}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Monitored Regions
              </div>
              <div className="mt-1 text-xs" style={{ color: "#9333EA" }}>
                Nationwide Coverage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-cw-red py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <ShieldCheck className="mx-auto h-12 w-12 text-white" />
          <h2 className="mt-6 text-3xl font-bold text-white">Our Mission</h2>
          <p className="mt-4 text-lg text-white/90">
            To create a collaborative community technology platform for the US maritime, intermodal,
            and trucking community that aims to watch, alert, and protect our US freight network, our
            people, and our cargo.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-cw-navy-dark py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cw-red">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wide text-white">
                Cargo Watch
              </span>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} CargoWatch. Protecting America&apos;s Freight
              Network.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
