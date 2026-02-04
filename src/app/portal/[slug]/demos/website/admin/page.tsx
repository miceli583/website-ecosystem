"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Home,
  Mail,
  MoreHorizontal,
  Percent,
  Plus,
  Search,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

export default function CHW360AdminDemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const stats = [
    {
      title: "Total Signups",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: UserPlus,
      gradient: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)",
    },
    {
      title: "Page Views",
      value: "24,891",
      change: "+8%",
      trend: "up",
      icon: Eye,
      gradient: "linear-gradient(135deg, #14919B 0%, #2D9596 100%)",
    },
    {
      title: "Conversion Rate",
      value: "5.01%",
      change: "+0.3%",
      trend: "up",
      icon: Percent,
      gradient: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)",
    },
    {
      title: "Active Users",
      value: "892",
      change: "+23%",
      trend: "up",
      icon: Users,
      gradient: "linear-gradient(135deg, #2D9596 0%, #3da8a8 100%)",
    },
  ];

  const recentSignups = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@healthdept.gov",
      organization: "Metro Health Department",
      date: "2 hours ago",
      status: "new",
    },
    {
      name: "Michael Chen",
      email: "mchen@university.edu",
      organization: "State University",
      date: "5 hours ago",
      status: "new",
    },
    {
      name: "Lisa Rodriguez",
      email: "l.rodriguez@clinic.org",
      organization: "Community Health Clinic",
      date: "Yesterday",
      status: "contacted",
    },
    {
      name: "David Thompson",
      email: "dthompson@hospital.com",
      organization: "Regional Hospital",
      date: "Yesterday",
      status: "contacted",
    },
    {
      name: "Jennifer Williams",
      email: "jwilliams@nonprofit.org",
      organization: "Health Equity Foundation",
      date: "2 days ago",
      status: "qualified",
    },
  ];

  const trafficData = [
    { day: "Mon", views: 3200 },
    { day: "Tue", views: 4100 },
    { day: "Wed", views: 3800 },
    { day: "Thu", views: 4500 },
    { day: "Fri", views: 3900 },
    { day: "Sat", views: 2400 },
    { day: "Sun", views: 2100 },
  ];

  const maxViews = Math.max(...trafficData.map((d) => d.views));

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "Leads", badge: "47" },
    { icon: BarChart3, label: "Analytics" },
    { icon: FileText, label: "Content" },
    { icon: Mail, label: "Email", badge: "3" },
    { icon: Settings, label: "Settings" },
  ];

  const quickActions = [
    { icon: Download, label: "Export Leads", primary: true },
    { icon: Mail, label: "Send Campaign" },
    { icon: BarChart3, label: "View Analytics" },
    { icon: FileText, label: "Generate Report" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 hidden h-full w-72 flex-col border-r border-gray-200/80 bg-white/80 backdrop-blur-xl lg:flex">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-gray-200/80 px-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)" }}
          >
            360
          </div>
          <div>
            <span className="font-bold" style={{ color: "#0D7377" }}>
              CHW360
            </span>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? "text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                style={
                  item.active
                    ? { background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)" }
                    : {}
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${item.active ? "" : "text-gray-400 group-hover:text-gray-600"}`} />
                  {item.label}
                </div>
                {item.badge && (
                  <Badge
                    className={`text-xs ${
                      item.active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200/80 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
              style={{ background: "linear-gradient(135deg, #E07A5F 0%, #c9624a 100%)" }}
            >
              SS
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Shechem Sauls</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        {/* Demo Banner */}
        <div
          className="px-4 py-2 text-center text-sm text-white"
          style={{ background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)" }}
        >
          <Link
            href={`/portal/${slug}/demos/website`}
            className="inline-flex items-center gap-2 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            This is a design preview - Back to Demo Hub
          </Link>
        </div>

        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-200/80 bg-white/80 px-6 backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Shechem</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search anything..."
                className="w-72 rounded-xl border-gray-200 pl-11 transition-all focus:bg-white"
                style={{ backgroundColor: '#f3f4f6' }}
              />
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all hover:bg-gray-200">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <Button
              className="shadow-lg shadow-[#0D7377]/25 transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)" }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="group overflow-hidden border-0 bg-white shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {stat.title}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">
                              {stat.change}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">vs last month</span>
                        </div>
                      </div>
                      <div
                        className="rounded-2xl p-3 shadow-lg transition-transform duration-300 group-hover:scale-110"
                        style={{ background: stat.gradient }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Traffic Chart */}
            <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-gray-200/50 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <CardTitle className="text-lg font-bold">Weekly Traffic</CardTitle>
                  <p className="text-sm text-gray-500">Page views this week</p>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex h-52 items-end justify-between gap-3">
                  {trafficData.map((data, index) => (
                    <div key={data.day} className="group flex flex-1 flex-col items-center gap-2">
                      <div className="relative w-full">
                        <div
                          className="w-full rounded-xl transition-all duration-300 group-hover:opacity-80"
                          style={{
                            height: `${(data.views / maxViews) * 180}px`,
                            background:
                              index === 3
                                ? "linear-gradient(180deg, #0D7377 0%, #14919B 100%)"
                                : "linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)",
                          }}
                        />
                        {index === 3 && (
                          <div
                            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-semibold text-white shadow-lg"
                            style={{ background: "#0D7377" }}
                          >
                            {data.views.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${index === 3 ? "text-[#0D7377]" : "text-gray-400"}`}>
                        {data.day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-500">Total this week</p>
                    <p className="text-xl font-bold" style={{ color: "#0D7377" }}>
                      24,000 views
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">+12.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Signups */}
            <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-gray-200/50 lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <CardTitle className="text-lg font-bold">Recent Signups</CardTitle>
                  <p className="text-sm text-gray-500">Latest leads from your website</p>
                </div>
                <Button variant="ghost" size="sm" className="text-sm font-medium" style={{ color: "#0D7377" }}>
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {recentSignups.map((signup, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                          style={{
                            background: `linear-gradient(135deg, ${
                              index % 3 === 0 ? "#0D7377" : index % 3 === 1 ? "#14919B" : "#E07A5F"
                            } 0%, ${
                              index % 3 === 0 ? "#14919B" : index % 3 === 1 ? "#2D9596" : "#c9624a"
                            } 100%)`,
                          }}
                        >
                          {signup.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{signup.name}</p>
                          <p className="text-sm text-gray-500">{signup.organization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            signup.status === "new"
                              ? "bg-green-100 text-green-700"
                              : signup.status === "contacted"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {signup.status}
                        </Badge>
                        <span className="text-sm text-gray-400">{signup.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className={`group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 ${
                      action.primary
                        ? "text-white shadow-lg shadow-[#0D7377]/25 hover:shadow-xl hover:shadow-[#0D7377]/30"
                        : "bg-white text-gray-700 shadow-lg shadow-gray-200/50 hover:shadow-xl"
                    }`}
                    style={
                      action.primary
                        ? { background: "linear-gradient(135deg, #0D7377 0%, #14919B 100%)" }
                        : {}
                    }
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                        action.primary ? "bg-white/20" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${action.primary ? "text-white" : ""}`}
                        style={!action.primary ? { color: "#0D7377" } : {}}
                      />
                    </div>
                    <span className="font-semibold">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="mt-8">
            <Card className="overflow-hidden border-0 bg-white shadow-lg shadow-gray-200/50">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                    <p className="text-sm text-gray-500">What&apos;s happening on your site</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                    <button className="rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-900 shadow-sm">
                      Today
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                      Week
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                      Month
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {[
                    { icon: UserPlus, text: "New signup from Metro Health Department", time: "2 hours ago", color: "#0D7377" },
                    { icon: Eye, text: "Training Programs page received 1,247 views", time: "4 hours ago", color: "#14919B" },
                    { icon: Mail, text: "Email campaign sent to 500 subscribers", time: "Yesterday", color: "#E07A5F" },
                    { icon: Zap, text: "Conversion rate increased by 0.3%", time: "2 days ago", color: "#2D9596" },
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${activity.color}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: activity.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.text}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <p className="mt-12 text-center text-sm text-gray-400">
            This is a design preview. Final admin dashboard will include full CRUD functionality and real-time data.
          </p>
        </div>
      </main>
    </div>
  );
}
