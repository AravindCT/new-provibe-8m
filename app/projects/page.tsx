"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Star,
  MoreHorizontal,
  Calendar,
  Users,
  FileText,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useProjects } from "@/hooks/use-projects"

export default function ProjectsPage() {
  const userId = "550e8400-e29b-41d4-a716-446655440001"
  const { projects, loading, error, toggleStar, loadAllProjects } = useProjects(userId)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("updated_at")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAllProjects, setShowAllProjects] = useState(false)

  const handleLoadAllProjects = async () => {
    setShowAllProjects(true)
    await loadAllProjects()
  }

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesType = filterType === "all" || project.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const sortedProjects = [...(filteredProjects || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "status":
        return a.status.localeCompare(b.status)
      case "type":
        return a.type.localeCompare(b.type)
      case "progress":
        return (b.progress || 0) - (a.progress || 0)
      case "updated_at":
      default:
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "complete":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "saas":
        return "💼"
      case "mobile":
        return "📱"
      case "api":
        return "🔌"
      case "ecommerce":
        return "🛒"
      default:
        return "📁"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-slate-600">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Projects</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={handleLoadAllProjects}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Loading All Projects
          </Button>
        </div>
      </div>
    )
  }

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
              <span className="text-indigo-600 font-medium">Projects</span>
              <Link href="/templates" className="text-slate-600 hover:text-slate-900">
                Templates
              </Link>
              <Link href="/help" className="text-slate-600 hover:text-slate-900">
                Help
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleLoadAllProjects}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {showAllProjects ? "All Projects" : "Load All"}
            </Button>
            <Link href="/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Projects {showAllProjects && "(All Projects)"}</h1>
            <p className="text-slate-600">
              {showAllProjects
                ? `Showing all ${projects.length} projects in the database`
                : `Manage and track your ${projects.length} product development projects`}
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Information:</h3>
          <p className="text-blue-700 text-sm">
            • Total projects loaded: {projects.length}
            <br />• User ID: {userId}
            <br />• Showing: {showAllProjects ? "All projects" : "User projects only"}
            <br />• Supabase configured: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Yes" : "No"}
          </p>
        </div>

        {/* Filters */}
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
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Draft</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("complete")}>Complete</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("paused")}>Paused</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("archived")}>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Type: {filterType === "all" ? "All" : filterType}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("saas")}>SaaS</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("mobile")}>Mobile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("api")}>API</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("ecommerce")}>E-commerce</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort: {sortBy === "updated_at" ? "Last Updated" : sortBy}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("updated_at")}>Last Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("type")}>Type</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("progress")}>Progress</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getTypeIcon(project.type)}</span>
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{project.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStar(project.id, !project.starred)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star className={`h-4 w-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      <span className="text-sm text-slate-600">{project.progress}% complete</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{project.collaborators}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{project.documents_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.last_updated}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(project.tags?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(project.tags?.length || 0) - 3}
                        </Badge>
                      )}
                    </div>

                    <Link href={`/projects/${project.id}/workspace`}>
                      <Button className="w-full mt-4">Open Project</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="text-2xl">{getTypeIcon(project.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          {project.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        </div>
                        <p className="text-slate-600 mb-2">{project.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-slate-600">
                          <span>{project.type}</span>
                          <span>{project.progress}% complete</span>
                          <span>{project.collaborators} collaborators</span>
                          <span>{project.documents_count} documents</span>
                          <span>Updated {project.last_updated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/projects/${project.id}/workspace`}>
                        <Button>Open</Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              {searchQuery || filterStatus !== "all" || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first project"}
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleLoadAllProjects} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Load All Projects
              </Button>
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
