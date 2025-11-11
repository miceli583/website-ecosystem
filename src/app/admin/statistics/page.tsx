import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { DomainLayout } from "~/components/domain-layout";
import { BackButton } from "~/components/back-button";
import {
  Users,
  Database,
  Activity,
  Settings,
  BarChart3,
  Shield,
  Globe,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  LogOut,
  User,
} from "lucide-react";
import { createClient } from "~/lib/supabase/server";
import { redirect } from "next/navigation";
import { SignOutButton } from "~/components/auth/signout-button";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }
  return (
    <DomainLayout>
      <BackButton href="/admin" label="Back to Hub" />
      <div className="bg-background min-h-screen p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="border-b pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  MiracleMind Development Environment
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-sm dark:bg-violet-900/20">
                  <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <span className="text-violet-700 dark:text-violet-300">
                    {user.email}
                  </span>
                </div>
                <SignOutButton />
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-muted-foreground text-xs">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Sessions
                </CardTitle>
                <Activity className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-muted-foreground text-xs">Peak: 156 users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Database Size
                </CardTitle>
                <Database className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 GB</div>
                <p className="text-muted-foreground text-xs">
                  67% capacity used
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  API Requests
                </CardTitle>
                <TrendingUp className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.2K</div>
                <p className="text-muted-foreground text-xs">
                  +8% from yesterday
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium">Web Server</span>
                  </div>
                  <span className="text-xs text-emerald-600">Online</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <span className="text-xs text-emerald-600">Connected</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Background Jobs</span>
                  </div>
                  <span className="text-xs text-yellow-600">Processing</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm font-medium">
                        New user registration
                      </p>
                      <p className="text-muted-foreground text-xs">
                        user@example.com • 2 minutes ago
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="text-sm font-medium">
                        Database backup completed
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Automated task • 1 hour ago
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-purple-500"></div>
                    <div>
                      <p className="text-sm font-medium">
                        API rate limit adjusted
                      </p>
                      <p className="text-muted-foreground text-xs">
                        admin@miraclemind.dev • 3 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Users</span>
            </Button>

            <Button variant="outline" className="h-24 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">Database</span>
            </Button>

            <Button variant="outline" className="h-24 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Analytics</span>
            </Button>

            <Button variant="outline" className="h-24 flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>

          {/* Domain Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Multi-Domain Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">matthewmiceli.com</span>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Personal portfolio
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Last deploy: 2 hours ago
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">miraclemind.live</span>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-muted-foreground text-sm">Main platform</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Last deploy: 1 hour ago
                  </p>
                </div>

                <div className="rounded-lg border bg-violet-50 p-4 dark:bg-violet-900/20">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">miraclemind.dev</span>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    Dev environment (current)
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Last deploy: 30 minutes ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DomainLayout>
  );
}
