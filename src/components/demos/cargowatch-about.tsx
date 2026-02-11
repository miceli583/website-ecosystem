"use client";

/**
 * CargoWatch About Page Demo
 * Faithful copy of the original CargoWatch about page for client portal demos.
 * No auth, static data, Lucide icons.
 */

import Link from "next/link";
import {
  ShieldCheck,
  Users,
  BarChart3,
  Globe,
  Truck,
  Building2,
  BellRing,
  Menu,
} from "lucide-react";

/* ---------- Shared Navigation ---------- */

function CWNavigation({ baseUrl }: { baseUrl: string }) {
  const navLinks = [
    { name: "Home", href: baseUrl },
    { name: "Resources", href: `${baseUrl}/resources` },
    { name: "About", href: `${baseUrl}/about` },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-cw-navy-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={baseUrl} className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cw-red">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                  CARGO WATCH
                </span>
                <span className="text-xs text-gray-400">
                  America&apos;s Freight Protection Network
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-cw-navy-light hover:text-white"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href={`${baseUrl}/dashboard`}
                className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-cw-navy-light hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href={`${baseUrl}/alerts`}
                className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-cw-navy-light hover:text-white"
              >
                Alerts
              </Link>
              <Link
                href={`${baseUrl}/map`}
                className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-cw-navy-light hover:text-white"
              >
                Map
              </Link>

              <Link
                href={baseUrl}
                className="ml-2 rounded-md bg-cw-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cw-red-hover"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-cw-navy-light hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Main Component ---------- */

export function CargoWatchAbout({ baseUrl }: { baseUrl: string }) {
  return (
    <div className="w-full">
      <CWNavigation baseUrl={baseUrl} />

      {/* Hero */}
      <div
        className="border-b border-gray-700"
        style={{
          background: "linear-gradient(to bottom, #151822, #1b202b)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-16 w-16 text-cw-red" />
            <h1 className="mt-6 text-4xl font-bold text-white">
              Protecting America&apos;s Freight Network
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-300">
              CargoWatch is a collaborative community technology platform designed to watch, alert,
              and protect our US freight network, our people, and our cargo.
            </p>
          </div>
        </div>
      </div>

      {/* The Problem */}
      <div className="bg-cw-red py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">The $35 Billion Problem</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/90">
              Cargo theft is a massive, growing crisis affecting the entire US supply chain
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="text-4xl font-bold text-white">$35B+</div>
              <div className="mt-2 text-white/90">Annual Losses</div>
              <p className="mt-3 text-sm text-white/75">
                Cargo theft costs the US economy over $35 billion annually and rising
              </p>
            </div>

            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="text-4xl font-bold text-white">1,247</div>
              <div className="mt-2 text-white/90">Incidents in 2024</div>
              <p className="mt-3 text-sm text-white/75">
                Reported cargo thefts increased 18% year-over-year with organized crime involvement
              </p>
            </div>

            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="text-4xl font-bold text-white">72 Hours</div>
              <div className="mt-2 text-white/90">Average Response Time</div>
              <p className="mt-3 text-sm text-white/75">
                Most incidents go unreported or reported too late, allowing criminals to escape
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-white/10 p-8 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Why This Happens</h3>
            <ul className="mt-4 space-y-3 text-white/90">
              <li className="flex items-start gap-3">
                <span className="text-white">&#8226;</span>
                <span>
                  <strong>Fragmented Communication:</strong> Drivers, carriers, and law enforcement
                  lack a unified platform to share real-time threat intelligence
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">&#8226;</span>
                <span>
                  <strong>Slow Response Times:</strong> By the time incidents are reported through
                  traditional channels, stolen cargo has often crossed state lines
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">&#8226;</span>
                <span>
                  <strong>Organized Crime:</strong> Professional cargo theft rings operate across
                  regions, but information sharing remains siloed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-white">&#8226;</span>
                <span>
                  <strong>Hotspot Blindness:</strong> Drivers unknowingly park in high-risk areas
                  without access to recent threat data
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Solution */}
      <div
        className="py-16"
        style={{
          background: "linear-gradient(135deg, #242936 0%, #1b202b 40%, #0f1219 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">How CargoWatch Solves This</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-300">
              A real-time, community-driven platform that connects everyone in the freight ecosystem
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <Users className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Real-Time Community Alerts</h3>
              <p className="mt-3 text-gray-300">
                Drivers, security personnel, and law enforcement share incidents instantly. See
                threats as they happen, not days later. Community-verified reports create a trusted
                network of protection.
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <Globe className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Geolocation Intelligence</h3>
              <p className="mt-3 text-gray-300">
                Automatic routing to nearest law enforcement. Real-time hotspot mapping shows
                high-risk areas. Region-specific alerts keep you informed about threats along your
                route.
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <ShieldCheck className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Law Enforcement Integration</h3>
              <p className="mt-3 text-gray-300">
                Direct reporting to police departments, FBI Cargo Theft Program, and CargoNet.
                Automated evidence collection and chain of custody. Faster response times save
                millions in recovered cargo.
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <Truck className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Driver Empowerment</h3>
              <p className="mt-3 text-gray-300">
                One-button alerts during emergencies. Photo/video evidence upload from mobile
                devices. Satellite connectivity (Globalstar) for remote areas without cell service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Opportunity */}
      <div
        className="py-16"
        style={{
          background: "linear-gradient(to bottom, #080a0f 0%, #1b202b 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-cw-red" />
            <h2 className="mt-6 text-3xl font-bold text-white">Market Opportunity</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cw-red">$1.38T</div>
              <div className="mt-2 text-white">Total US Freight Market</div>
              <p className="mt-2 text-sm text-gray-400">2025 projection</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-cw-red">$906B</div>
              <div className="mt-2 text-white">Trucking Revenue</div>
              <p className="mt-2 text-sm text-gray-400">Annual trucking industry revenue</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-cw-red">500K</div>
              <div className="mt-2 text-white">Motor Carriers in US</div>
              <p className="mt-2 text-sm text-gray-400">Active motor carrier companies</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-cw-red">$77.6B</div>
              <div className="mt-2 text-white">Rail Freight Revenue</div>
              <p className="mt-2 text-sm text-gray-400">Annual rail freight revenue</p>
            </div>
          </div>

          <div className="mt-12 rounded-lg border border-gray-700 bg-cw-navy p-8">
            <h3 className="text-xl font-semibold text-white">Priority Regions</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <div className="text-lg font-semibold text-white">Memphis, TN</div>
                <div className="mt-2 font-semibold text-cw-red">#1 in Nation</div>
                <div className="mt-3 text-sm text-gray-400">
                  Top logistics and supply chain concentration with 293,000 workers employed in the
                  sector
                </div>
                <div className="mt-2 text-xs text-gray-500">Primary nexus region</div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <div className="text-lg font-semibold text-white">Los Angeles, CA</div>
                <div className="mt-2 font-semibold text-cw-red">902,400</div>
                <div className="mt-3 text-sm text-gray-400">
                  Workers employed in Southern California trade and logistics sector
                </div>
                <div className="mt-2 text-xs text-gray-500">Major port operations</div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <div className="text-lg font-semibold text-white">Dallas, TX</div>
                <div className="mt-2 font-semibold text-cw-red">Top 3</div>
                <div className="mt-3 text-sm text-gray-400">
                  Major intermodal site for US, ranking among top cargo handling cities for air and
                  rail
                </div>
                <div className="mt-2 text-xs text-gray-500">Critical junction point</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div
        className="py-16"
        style={{
          background: "linear-gradient(to top, #080a0f 0%, #1b202b 70%, #242936 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Who We Serve</h2>
            <p className="mt-4 text-gray-300">
              CargoWatch brings together every stakeholder in freight security
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              "Motor Carriers",
              "Rail Freight Operators",
              "Warehouses & Distribution Centers",
              "Port Authorities",
              "Law Enforcement Agencies",
              "Insurance Companies",
              "Freight Forwarders",
              "Shippers & Receivers",
            ].map((name) => (
              <div
                key={name}
                className="rounded-lg border border-gray-700 bg-cw-navy-light px-6 py-4 text-center"
              >
                <div className="font-semibold text-white">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Model */}
      <div className="bg-cw-navy-dark py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Revenue Model</h2>
          </div>

          <div className="mt-8 rounded-lg border border-gray-700 bg-cw-navy p-6 text-center">
            <div className="text-lg font-semibold text-white">
              FREE for all users.{" "}
              <span className="text-gray-400">
                Cargo Watch is a community-driven platform. Users become our customer base, and we
                monetize through strategic partnerships.
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <BarChart3 className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="text-lg font-semibold text-white">Advertising Revenue</h3>
              <p className="mt-3 text-sm text-gray-400">
                Security products, GPS tracking, insurance, and safety tools
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <ShieldCheck className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="text-lg font-semibold text-white">Law Enforcement Grants</h3>
              <p className="mt-3 text-sm text-gray-400">
                Local, state, and federal funding for crime prevention
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cw-red/10">
                <Globe className="h-6 w-6 text-cw-red" />
              </div>
              <h3 className="text-lg font-semibold text-white">Data Services</h3>
              <p className="mt-3 text-sm text-gray-400">
                Insights for CargoNet, Overhaul, FCIS, and insurance companies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-gray-700 bg-cw-navy py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Join the Fight Against Cargo Theft
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Together, we can protect America&apos;s freight network and stop organized cargo theft
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Link
              href={baseUrl}
              className="rounded-md bg-cw-red px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cw-red-hover"
            >
              Join CargoWatch Free
            </Link>
            <Link
              href={baseUrl}
              className="text-sm font-semibold leading-6 text-gray-300 transition-colors hover:text-white"
            >
              Learn More &rarr;
            </Link>
          </div>
          <p className="mt-8 text-gray-400">
            CargoWatch is 100% free for all transportation stakeholders
          </p>
        </div>
      </div>

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
