"use client";

/**
 * CargoWatch Resources Demo
 * Faithful copy of the original CargoWatch resources page for client portal demos.
 * Static data, no auth, Lucide icons.
 */

import {
  ShieldCheck,
  Signal,
  Lock,
  Video,
  FileText,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { RESOURCES } from "~/lib/cargowatch-data";

/* ---------- Helpers ---------- */

const GPS_PRODUCTS = RESOURCES.filter((r) => r.subcategory === "gps_tracking");
const PHYSICAL_PRODUCTS = RESOURCES.filter((r) => r.subcategory === "physical_security");
const SURVEILLANCE_PRODUCTS = RESOURCES.filter((r) => r.subcategory === "surveillance");

/* ---------- Main ---------- */

export function CargoWatchResources({ baseUrl }: { baseUrl: string }) {
  return (
    <div className="min-h-screen bg-cw-navy">
      <div className="w-full">
        {/* Header */}
        <div className="border-b border-gray-700 bg-cw-navy-dark px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-white">Security Resources</h1>
            <p className="mt-2 text-gray-400">
              Educational materials, security products, and industry partnerships to help combat cargo crime
            </p>
          </div>
        </div>

        {/* Security Products & Services */}
        <div className="bg-cw-navy py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">Security Products &amp; Services</h2>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* GPS Tracking */}
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cw-red/10 p-2">
                    <Signal className="h-6 w-6 text-cw-red" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">GPS Tracking</h3>
                </div>

                <div className="mt-6 space-y-4">
                  {GPS_PRODUCTS.length > 0 ? (
                    GPS_PRODUCTS.map((r) => (
                      <div key={r.id}>
                        <h4 className="font-semibold text-white">{r.title}</h4>
                        <p className="mt-1 text-sm text-gray-400">{r.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold text-white">Tive</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          Real-time location and condition tracking sensors
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Arviem</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          Multi-modal cargo monitoring solutions
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">CargoNet</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          National cargo theft database and tracking
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Physical Security */}
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cw-red/10 p-2">
                    <Lock className="h-6 w-6 text-cw-red" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Physical Security</h3>
                </div>

                <div className="mt-6 space-y-4">
                  {PHYSICAL_PRODUCTS.length > 0 ? (
                    PHYSICAL_PRODUCTS.map((r) => (
                      <div key={r.id}>
                        <h4 className="font-semibold text-white">{r.title}</h4>
                        <p className="mt-1 text-sm text-gray-400">{r.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold text-white">High-Security Seals</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          Tamper-evident container seals
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Smart Locks</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          IoT-enabled locking systems with alerts
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Kingpin Locks</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          Prevent unauthorized trailer coupling
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Surveillance */}
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cw-red/10 p-2">
                    <Video className="h-6 w-6 text-cw-red" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Surveillance</h3>
                </div>

                <div className="mt-6 space-y-4">
                  {SURVEILLANCE_PRODUCTS.length > 0 ? (
                    SURVEILLANCE_PRODUCTS.map((r) => (
                      <div key={r.id}>
                        <h4 className="font-semibold text-white">{r.title}</h4>
                        <p className="mt-1 text-sm text-gray-400">{r.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        <h4 className="font-semibold text-white">Dash Cameras</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          HD recording with cloud backup
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Yard Cameras</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          Perimeter monitoring systems
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">AI-Powered Analytics</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          Automated threat detection
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Resources */}
        <div className="bg-cw-navy-dark py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">Educational Resources</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Best Practices Guide */}
              <div className="group rounded-lg border border-gray-700 bg-cw-navy p-6 transition hover:bg-cw-navy-light">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-cw-red/10 p-2">
                    <ShieldCheck className="h-6 w-6 text-cw-red" />
                  </div>
                  <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-400">
                    Guide
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  Best Practices for Cargo Security
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Comprehensive guide to preventing theft and securing loads
                </p>

                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cw-red hover:text-cw-red-hover"
                >
                  View Resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Whitepaper */}
              <div className="group rounded-lg border border-gray-700 bg-cw-navy p-6 transition hover:bg-cw-navy-light">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-cw-red/10 p-2">
                    <FileText className="h-6 w-6 text-cw-red" />
                  </div>
                  <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-semibold text-purple-400">
                    Research
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  Cargo Theft in America Whitepaper
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  IMC Logistics analysis of trends and prevention strategies
                </p>

                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cw-red hover:text-cw-red-hover"
                >
                  View Resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Law Enforcement */}
              <div className="group rounded-lg border border-gray-700 bg-cw-navy p-6 transition hover:bg-cw-navy-light">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-cw-red/10 p-2">
                    <FileText className="h-6 w-6 text-cw-red" />
                  </div>
                  <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400">
                    Directory
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  Law Enforcement Contacts
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Directory of cargo theft task forces by region
                </p>

                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cw-red hover:text-cw-red-hover"
                >
                  View Resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* 2024 Report */}
              <div className="group rounded-lg border border-gray-700 bg-cw-navy p-6 transition hover:bg-cw-navy-light">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-cw-red/10 p-2">
                    <BarChart3 className="h-6 w-6 text-cw-red" />
                  </div>
                  <span className="rounded-full bg-orange-600/20 px-3 py-1 text-xs font-semibold text-orange-400">
                    Report
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  2024 Cargo Theft Report
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Annual statistics and emerging threat analysis
                </p>

                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cw-red hover:text-cw-red-hover"
                >
                  View Resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Security Tips */}
        <div className="bg-cw-navy py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-8">
              <h3 className="text-xl font-semibold text-white">Quick Security Tips</h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-cw-red">Before You Park</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>&#8226; Check CargoWatch alerts for recent incidents in the area</li>
                    <li>&#8226; Choose well-lit, high-traffic truck stops</li>
                    <li>&#8226; Park with trailer doors against a barrier when possible</li>
                    <li>&#8226; Note security cameras and patrol presence</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-cw-red">During Your Stop</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>&#8226; Use high-quality locks and seals on trailer doors</li>
                    <li>&#8226; Enable GPS tracking and tamper alerts</li>
                    <li>&#8226; Check trailer every few hours if possible</li>
                    <li>&#8226; Report suspicious activity immediately via CargoWatch</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-cw-red">High-Value Loads</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>&#8226; Never discuss cargo contents in public</li>
                    <li>&#8226; Use team drivers for continuous movement</li>
                    <li>&#8226; Install covert tracking in addition to standard GPS</li>
                    <li>&#8226; Coordinate with law enforcement for high-risk routes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-cw-red">If You&apos;re Targeted</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>&#8226; Call 911 immediately if threat is imminent</li>
                    <li>&#8226; Report via CargoWatch to alert nearby drivers</li>
                    <li>&#8226; Don&apos;t confront suspects - your safety is priority #1</li>
                    <li>&#8226; Take photos/video from a safe distance if possible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Partners */}
        <div className="bg-cw-navy-dark py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white">Industry Partners</h2>
            <p className="mt-2 text-gray-400">
              Cargo Watch collaborates with leading security providers and industry organizations
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* CargoNet */}
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <h3 className="font-semibold text-white">CargoNet</h3>
                <p className="mt-2 text-sm text-gray-400">Theft Prevention</p>
                <a
                  href="https://cargonet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-cw-red hover:text-cw-red-hover"
                >
                  cargonet.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Overhaul */}
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <h3 className="font-semibold text-white">Overhaul</h3>
                <p className="mt-2 text-sm text-gray-400">Supply Chain Security</p>
                <a
                  href="https://overhaul.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-cw-red hover:text-cw-red-hover"
                >
                  overhaul.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* FreightWatch */}
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <h3 className="font-semibold text-white">FreightWatch</h3>
                <p className="mt-2 text-sm text-gray-400">Intelligence &amp; Recovery</p>
                <a
                  href="https://freightwatch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-cw-red hover:text-cw-red-hover"
                >
                  freightwatch.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* TAPA */}
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6">
                <h3 className="font-semibold text-white">TAPA</h3>
                <p className="mt-2 text-sm text-gray-400">Security Standards</p>
                <a
                  href="https://tapa-global.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-cw-red hover:text-cw-red-hover"
                >
                  tapa-global.org
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="border-t border-gray-700 bg-cw-navy py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-white">
              Emergency Contacts
            </h2>
            <p className="mt-2 text-center text-gray-400">
              For immediate threats, always call 911 first
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6 text-center">
                <div className="text-2xl font-bold text-cw-red">911</div>
                <div className="mt-2 text-white">Emergency Services</div>
                <p className="mt-2 text-sm text-gray-400">
                  Immediate threats or crimes in progress
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6 text-center">
                <div className="text-2xl font-bold text-cw-red">1-800-CARGO-TIP</div>
                <div className="mt-2 text-white">CargoNet Hotline</div>
                <p className="mt-2 text-sm text-gray-400">
                  Report cargo theft 24/7
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-cw-navy-light p-6 text-center">
                <div className="text-2xl font-bold text-cw-red">1-800-CALL-FBI</div>
                <div className="mt-2 text-white">FBI Cargo Theft</div>
                <p className="mt-2 text-sm text-gray-400">
                  Report organized cargo crime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partner CTA */}
        <div className="bg-cw-navy-dark py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cw-red/20">
              <ShieldCheck className="h-8 w-8 text-cw-red" />
            </div>

            <h2 className="text-3xl font-bold text-white">Partner with Cargo Watch</h2>
            <p className="mt-4 text-lg text-gray-300">
              Reach 12,000+ transportation professionals across the US freight network. Contact us about advertising your security products and services.
            </p>

            <button className="mt-8 rounded-lg bg-cw-red px-8 py-3 font-semibold text-white transition hover:bg-cw-red-hover">
              Learn About Advertising
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-700 bg-cw-navy-dark py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cw-red">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                  Cargo Watch
                </span>
              </div>
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Cargo Watch. America&apos;s Freight Protection Network.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
