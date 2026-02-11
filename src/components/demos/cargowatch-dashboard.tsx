"use client";

/**
 * CargoWatch Dashboard Demo
 * Faithful copy of the original CargoWatch dashboard for client portal demos.
 * Includes sidebar + main command center content. Static data, no auth, Lucide icons.
 */

import Link from "next/link";
import {
  ShieldCheck,
  Home,
  Bell,
  Map,
  FilePlus,
  UserCircle,
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Truck,
} from "lucide-react";
import {
  INCIDENTS,
  REGIONS,
  STATS,
  SEVERITY_COLORS,
  INCIDENT_TYPE_LABELS,
} from "~/lib/cargowatch-data";

/* ---------- Sidebar ---------- */

interface SidebarNavItem {
  name: string;
  path: string;
  icon: typeof Home;
  highlight?: boolean;
}

const SIDEBAR_NAV: SidebarNavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "Map", path: "/map", icon: Map },
  { name: "Report", path: "/report", icon: FilePlus, highlight: true },
  { name: "Profile", path: "/profile", icon: UserCircle },
];

function DashboardSidebar({ baseUrl, activePath }: { baseUrl: string; activePath: string }) {
  return (
    <div className="flex w-64 flex-col border-r border-gray-800 bg-cw-navy-dark">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-800 px-6">
        <Link href={`${baseUrl}/dashboard`} className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cw-red">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold uppercase tracking-wide text-white">
              CARGO WATCH
            </span>
            <span className="text-xs text-gray-400">Command Center</span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cw-red/10 text-cw-red">
            D
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">
              Demo User
            </div>
            <div className="truncate text-xs capitalize text-gray-400">
              Viewer
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {SIDEBAR_NAV.map((item) => {
          const href = `${baseUrl}${item.path}`;
          const isActive = activePath === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={href}
              className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                item.highlight
                  ? "bg-cw-red text-white hover:bg-cw-red-hover"
                  : isActive
                    ? "bg-cw-navy-light text-white"
                    : "text-gray-400 hover:bg-cw-navy-light hover:text-white"
              }`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Back to Public Site */}
      <div className="border-t border-gray-800 p-4">
        <Link
          href={baseUrl}
          className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Public Site</span>
        </Link>
      </div>
    </div>
  );
}

/* ---------- Dashboard Content ---------- */

const recentIncidents = INCIDENTS.slice(0, 5);
const hotspots = [...REGIONS]
  .sort((a, b) => b.incidentCount - a.incidentCount)
  .slice(0, 3);

function DashboardContent({ baseUrl }: { baseUrl: string }) {
  return (
    <div className="space-y-6">
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
        <div className="rounded-lg border border-gray-800 bg-cw-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Incidents</p>
              <p className="mt-2 text-3xl font-bold text-white">{STATS.totalIncidents}</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Bell className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">All time tracking</p>
        </div>

        {/* Critical Alerts */}
        <div className="rounded-lg border border-gray-800 bg-cw-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Critical Alerts</p>
              <p className="mt-2 text-3xl font-bold text-cw-red">{STATS.criticalAlerts}</p>
            </div>
            <div className="rounded-lg bg-cw-red/10 p-3">
              <AlertTriangle className="h-6 w-6 text-cw-red" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Requires immediate attention</p>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-gray-800 bg-cw-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Last 30 Days</p>
              <p className="mt-2 text-3xl font-bold text-green-500">{STATS.last30Days}</p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Recent incident reports</p>
        </div>

        {/* Active Regions */}
        <div className="rounded-lg border border-gray-800 bg-cw-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Regions</p>
              <p className="mt-2 text-3xl font-bold text-purple-500">{STATS.activeRegions}</p>
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
          <div className="rounded-lg border border-gray-800 bg-cw-navy-dark">
            <div className="border-b border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Incidents</h2>
                <Link
                  href={`${baseUrl}/alerts`}
                  className="text-sm text-cw-red hover:text-cw-red-hover"
                >
                  View All &rarr;
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {recentIncidents.map((incident) => {
                const severity = SEVERITY_COLORS[incident.severityLevel];
                return (
                  <div key={incident.id} className="p-6 hover:bg-cw-navy-light/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${severity.bg} ${severity.text}`}
                          >
                            {incident.severityLevel}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(incident.createdAt).toLocaleDateString()}
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
          <div className="rounded-lg border border-gray-800 bg-cw-navy-dark p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Top Hotspots</h2>
            <div className="space-y-4">
              {hotspots.map((region, index) => (
                <div key={region.id} className="flex items-center justify-between">
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
                      <div className="font-medium text-white">{region.name}</div>
                      <div className="text-xs text-gray-500">{region.state}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-cw-red">
                      {region.incidentCount}
                    </div>
                    <div className="text-xs text-gray-500">incidents</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={`${baseUrl}/map`}
              className="mt-4 block rounded-lg border border-gray-700 py-2 text-center text-sm text-gray-300 hover:bg-cw-navy-light"
            >
              View Full Map
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-gray-800 bg-cw-navy-dark p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`${baseUrl}/report`}
                className="block rounded-lg bg-cw-red px-4 py-3 text-center text-sm font-semibold text-white hover:bg-cw-red-hover"
              >
                Report New Incident
              </Link>
              <Link
                href={`${baseUrl}/alerts`}
                className="block rounded-lg border border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-300 hover:bg-cw-navy-light"
              >
                View All Alerts
              </Link>
              <Link
                href={`${baseUrl}/map`}
                className="block rounded-lg border border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-300 hover:bg-cw-navy-light"
              >
                Explore Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Export ---------- */

export function CargoWatchDashboard({ baseUrl }: { baseUrl: string }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar */}
      <DashboardSidebar baseUrl={baseUrl} activePath="/dashboard" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="mx-auto max-w-7xl">
            <DashboardContent baseUrl={baseUrl} />
          </div>
        </main>
      </div>
    </div>
  );
}
