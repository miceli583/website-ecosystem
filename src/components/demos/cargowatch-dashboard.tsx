"use client";

/**
 * CargoWatch Dashboard Demo
 * Faithful copy of the original CargoWatch dashboard for client portal demos.
 * Main command center content. Static data, no auth, Lucide icons.
 * Sidebar navigation is handled by the parent layout.
 */

import Link from "next/link";
import { Bell, AlertTriangle, TrendingUp, MapPin, Truck } from "lucide-react";
import {
  INCIDENTS,
  REGIONS,
  STATS,
  SEVERITY_COLORS,
  INCIDENT_TYPE_LABELS,
} from "~/lib/cargowatch-data";

/* ---------- Dashboard Content ---------- */

const recentIncidents = INCIDENTS.slice(0, 5);
const hotspots = [...REGIONS]
  .sort((a, b) => b.incidentCount - a.incidentCount)
  .slice(0, 3);

export function CargoWatchDashboard({ baseUrl }: { baseUrl: string }) {
  return (
    <div className="w-full bg-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="mt-1 text-sm text-gray-400">
            Monitor and respond to cargo security incidents across the network
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Incidents */}
          <div className="bg-cw-navy-dark rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Incidents
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {STATS.totalIncidents}
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">All time tracking</p>
          </div>

          {/* Critical Alerts */}
          <div className="bg-cw-navy-dark rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Critical Alerts
                </p>
                <p className="text-cw-red mt-2 text-3xl font-bold">
                  {STATS.criticalAlerts}
                </p>
              </div>
              <div className="bg-cw-red/10 rounded-lg p-3">
                <AlertTriangle className="text-cw-red h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Requires immediate attention
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-cw-navy-dark rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Last 30 Days
                </p>
                <p className="mt-2 text-3xl font-bold text-green-500">
                  {STATS.last30Days}
                </p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Recent incident reports
            </p>
          </div>

          {/* Active Regions */}
          <div className="bg-cw-navy-dark rounded-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Regions
                </p>
                <p className="mt-2 text-3xl font-bold text-purple-500">
                  {STATS.activeRegions}
                </p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-3">
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">Regions with incidents</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Incidents */}
          <div className="lg:col-span-2">
            <div className="bg-cw-navy-dark rounded-lg border border-gray-800">
              <div className="border-b border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Incidents
                  </h2>
                  <Link
                    href={`${baseUrl}/alerts`}
                    className="text-cw-red hover:text-cw-red-hover text-sm"
                  >
                    View All &rarr;
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-800">
                {recentIncidents.map((incident) => {
                  const severity = SEVERITY_COLORS[incident.severityLevel];
                  return (
                    <div
                      key={incident.id}
                      className="hover:bg-cw-navy-light/50 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${severity.bg} ${severity.text}`}
                            >
                              {incident.severityLevel}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                incident.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="mt-2 font-medium text-white">
                            {incident.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                            {incident.description}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {incident.region}
                            </span>
                            <span className="flex items-center">
                              <Truck className="mr-1 h-4 w-4" />
                              {INCIDENT_TYPE_LABELS[incident.incidentType]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hotspots & Quick Actions */}
          <div className="space-y-6">
            {/* Hotspots */}
            <div className="bg-cw-navy-dark rounded-lg border border-gray-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Top Hotspots
              </h2>
              <div className="space-y-4">
                {hotspots.map((region, index) => (
                  <div
                    key={region.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          index === 0
                            ? "bg-cw-red/10 text-cw-red"
                            : index === 1
                              ? "bg-orange-500/10 text-orange-500"
                              : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {region.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {region.state}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cw-red font-bold">
                        {region.incidentCount}
                      </div>
                      <div className="text-xs text-gray-500">incidents</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={`${baseUrl}/map`}
                className="hover:bg-cw-navy-light mt-4 block rounded-lg border border-gray-700 py-2 text-center text-sm text-gray-300"
              >
                View Full Map
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-cw-navy-dark rounded-lg border border-gray-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href={`${baseUrl}/report`}
                  className="bg-cw-red hover:bg-cw-red-hover block rounded-lg px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Report New Incident
                </Link>
                <Link
                  href={`${baseUrl}/alerts`}
                  className="hover:bg-cw-navy-light block rounded-lg border border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-300"
                >
                  View All Alerts
                </Link>
                <Link
                  href={`${baseUrl}/map`}
                  className="hover:bg-cw-navy-light block rounded-lg border border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-300"
                >
                  Explore Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
