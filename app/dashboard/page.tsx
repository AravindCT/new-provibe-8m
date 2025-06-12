"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, Bell, Settings, User } from "lucide-react"
import Link from "next/link"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ProjectCard } from "@/components/dashboard/project-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent } from "@/components/ui/card"
import { useProjects } from "@/hooks/use-projects"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"

export default function Dashboard() {
  // Use the current user ID - in a real app, get from auth context
  const userId = "550e8400-e29b-41d4-a716-446655440001"

  const { projects, loading, error, toggleStar, deleteProject, updateProject } = useProjects(userId)
  const { stats, loading: statsLoading } = useDashboardStats(userId)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("updated_at")

  const handleToggleStar = async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      await toggleStar(projectId, !project.starred)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(projectId)
    }
  }

  const handleArchiveProject = async (projectId: string) => {
    await updateProject(projectId, { status: "archived" })
  }

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const sortedProjects = [...(filteredProjects || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "status":
        return a.status.localeCompare(b.status)
      case "progress":
        return (b.progress || 0) - (a.progress || 0)
      case "updated_at":
      default:
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                <span className="text-xl font-bold gradient-text">ProVibe</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-indigo-600 font-medium">
                Dashboard
              </Link>
              <Link href="/projects" className="text-slate-600 hover:text-slate-900">
                Projects
              </Link>
              <Link href="/templates" className="text-slate-600 hover:text-slate-900">
                Templates
              </Link>
              <Link href="/help" className="text-slate-600 hover:text-slate-900">
                Help
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden md:block">Sarah Chen</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
            <p className="text-slate-600">Welcome back! Here's what's happening with your projects.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link href="/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <StatsOverview stats={stats} />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-3">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {filterStatus === "all" ? "All" : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Projects</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Draft</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("complete")}>Complete</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("paused")}>Paused</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("archived")}>Archived</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sort by: {sortBy === "updated_at" ? "Last Updated" : sortBy}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("updated_at")}>Last Updated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("progress")}>Progress</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Projects Grid */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-2 bg-gray-200 rounded mb-2"></div>
                      <div className="flex justify-between">
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        <div className="h-6 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">Error loading projects: {error}</div>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onToggleStar={handleToggleStar}
                    onArchive={handleArchiveProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && sortedProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first project"}
                </p>
                <Link href="/projects/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
            <ActivityFeed userId={userId} />
          </div>
        </div>
      </div>
    </div>
  )
}
