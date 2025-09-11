import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
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
  TrendingUp
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">MiracleMind Development Environment</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4" />
              System Healthy
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                Peak: 156 users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Size</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 GB</div>
              <p className="text-xs text-muted-foreground">
                67% capacity used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-muted-foreground">
                +8% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Web Server</span>
                </div>
                <span className="text-xs text-emerald-600">Online</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <span className="text-xs text-emerald-600">Connected</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
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
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">user@example.com • 2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Database backup completed</p>
                    <p className="text-xs text-muted-foreground">Automated task • 1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">API rate limit adjusted</p>
                    <p className="text-xs text-muted-foreground">admin@miraclemind.dev • 3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">matthewmiceli.com</span>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm text-muted-foreground">Personal portfolio</p>
                <p className="text-xs text-muted-foreground mt-1">Last deploy: 2 hours ago</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">miraclemind.live</span>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm text-muted-foreground">Main platform</p>
                <p className="text-xs text-muted-foreground mt-1">Last deploy: 1 hour ago</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">miraclemind.dev</span>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm text-violet-700 dark:text-violet-300">Dev environment (current)</p>
                <p className="text-xs text-muted-foreground mt-1">Last deploy: 30 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}