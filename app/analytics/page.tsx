"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  Target,
  Download,
  Calendar,
  Activity,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  // Mock analytics data
  const projectsData = [
    { month: "Jan", created: 12, completed: 8 },
    { month: "Feb", created: 15, completed: 10 },
    { month: "Mar", created: 18, completed: 14 },
    { month: "Apr", created: 22, completed: 16 },
    { month: "May", created: 25, completed: 20 },
    { month: "Jun", created: 28, completed: 22 },
  ]

  const documentsData = [
    { day: "Mon", generated: 45 },
    { day: "Tue", generated: 52 },
    { day: "Wed", generated: 38 },
    { day: "Thu", generated: 61 },
    { day: "Fri", generated: 55 },
    { day: "Sat", generated: 32 },
    { day: "Sun", generated: 28 },
  ]

  const projectTypeData = [
    { name: "SaaS", value: 45, color: "#8B5CF6" },
    { name: "Mobile", value: 30, color: "#06B6D4" },
    { name: "API", value: 15, color: "#10B981" },
    { name: "E-commerce", value: 10, color: "#F59E0B" },
  ]

  const metrics = [
    {
      title: "Total Projects",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Documents Generated",
      value: "2,847",
      change: "+18%",
      trend: "up",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg. Completion Time",
      value: "14.2 days",
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const topProjects = [
    { name: "TaskFlow Pro", documents: 45, progress: 85, status: "active" },
    { name: "FinanceAI", documents: 32, progress: 72, status: "active" },
    { name: "MedConnect", documents: 28, progress: 58, status: "active" },
    { name: "EduTech Hub", documents: 24, progress: 41, status: "draft" },
    { name: "RetailOptimize", documents: 38, progress: 91, status: "active" },
  ]

  const recentActivity = [
    { action: "Project created", project: "CryptoVault", user: "Mike Rodriguez", time: "2 hours ago" },
    { action: "Document generated", project: "TaskFlow Pro", user: "Sarah Chen", time: "4 hours ago" },
    { action: "Project completed", project: "FoodieAI", user: "Alex Kim", time: "1 day ago" },
    { action: "Team member added", project: "MedConnect", user: "Emma Wilson", time: "2 days ago" },
    { action: "Export completed", project: "RetailOptimize", user: "Lisa Zhang", time: "3 days ago" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                <span className="text-xl font-bold gradient-text">ProVibe</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/projects" className="text-slate-600 hover:text-slate-900">
                Projects
              </Link>
              <span className="text-indigo-600 font-medium">Analytics</span>
              <Link href="/help" className="text-slate-600 hover:text-slate-900">
                Help
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Track your project performance and team productivity</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {metric.change}
                      </span>
                      <span className="text-sm text-slate-600 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-slate-100`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Creation vs Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="created" fill="#8B5CF6" name="Created" />
                      <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Project Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {projectTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Projects and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProjects.map((project, index) => (
                      <div key={project.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-slate-600">{project.documents} documents</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-sm font-medium">{project.progress}%</p>
                            <Badge variant={project.status === "active" ? "default" : "secondary"} className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.action}</span> in{" "}
                            <span className="font-medium">{activity.project}</span>
                          </p>
                          <p className="text-xs text-slate-600">
                            by {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Generation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={documentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="generated" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Projects</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">24</p>
                    </div>
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Completed This Month</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">8</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg. Project Duration</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">18 days</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sarah Chen</span>
                      <span className="text-sm text-slate-600">12 projects</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mike Rodriguez</span>
                      <span className="text-sm text-slate-600">8 projects</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Alex Kim</span>
                      <span className="text-sm text-slate-600">6 projects</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg. Team Size</span>
                      <span className="text-sm text-slate-600">4.2 members</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cross-team Projects</span>
                      <span className="text-sm text-slate-600">15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">External Collaborators</span>
                      <span className="text-sm text-slate-600">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
