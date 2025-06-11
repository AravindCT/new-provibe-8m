"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Eye,
  Edit,
  Download,
  Share,
  Trash2,
  Star,
  Clock,
  User,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ProjectDocuments() {
  const params = useParams()
  const projectId = params.id as string

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("updated")

  const documents = [
    {
      id: "1",
      title: "Product Requirements Document",
      type: "prd",
      status: "draft",
      content: "Comprehensive PRD for TaskFlow SaaS platform...",
      author: "Sarah Chen",
      updatedAt: "2024-03-15T14:30:00Z",
      createdAt: "2024-03-10T09:00:00Z",
      wordCount: 2450,
      readTime: 12,
      starred: true,
      collaborators: ["Mike Johnson", "Alex Garcia"],
      tags: ["core", "mvp", "requirements"],
    },
    {
      id: "2",
      title: "Technical Architecture Specification",
      type: "spec",
      status: "review",
      content: "Detailed technical architecture for the platform...",
      author: "Mike Johnson",
      updatedAt: "2024-03-14T16:20:00Z",
      createdAt: "2024-03-12T11:00:00Z",
      wordCount: 3200,
      readTime: 16,
      starred: false,
      collaborators: ["Sarah Chen"],
      tags: ["technical", "architecture", "backend"],
    },
    {
      id: "3",
      title: "User Stories & Acceptance Criteria",
      type: "user-story",
      status: "approved",
      content: "Complete user stories for all core features...",
      author: "Alex Garcia",
      updatedAt: "2024-03-13T10:15:00Z",
      createdAt: "2024-03-11T14:00:00Z",
      wordCount: 1800,
      readTime: 9,
      starred: true,
      collaborators: ["Sarah Chen", "Emily White"],
      tags: ["ux", "features", "stories"],
    },
    {
      id: "4",
      title: "API Documentation",
      type: "api-doc",
      status: "draft",
      content: "REST API endpoints and documentation...",
      author: "Mike Johnson",
      updatedAt: "2024-03-12T13:45:00Z",
      createdAt: "2024-03-12T13:45:00Z",
      wordCount: 950,
      readTime: 5,
      starred: false,
      collaborators: [],
      tags: ["api", "endpoints", "documentation"],
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesFilter
  })

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "type":
        return a.type.localeCompare(b.type)
      case "status":
        return a.status.localeCompare(b.status)
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "updated":
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "review":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "prd":
        return "📋"
      case "spec":
        return "⚙️"
      case "user-story":
        return "👤"
      case "api-doc":
        return "🔌"
      default:
        return "📄"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "1 day ago"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/projects/${projectId}/workspace`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workspace
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold gradient-text">ProVibe</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href={`/projects/${projectId}/documents/generate`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Document
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Documents</h1>
          <p className="text-slate-600">Manage and organize your project documentation</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search documents, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Type: {filterType === "all" ? "All" : filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("prd")}>PRD</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("spec")}>Specification</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("user-story")}>User Stories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("api-doc")}>API Documentation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort: {sortBy === "updated" ? "Last Updated" : sortBy}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("updated")}>Last Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("created")}>Date Created</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>Title</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("type")}>Type</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-lg">{getTypeIcon(doc.type)}</span>
                    <CardTitle className="text-lg line-clamp-2 flex-1">{doc.title}</CardTitle>
                    {doc.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
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
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{doc.content}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Status and Metadata */}
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                    <div className="text-xs text-slate-500">
                      {doc.wordCount} words • {doc.readTime} min read
                    </div>
                  </div>

                  {/* Tags */}
                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Author and Date */}
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{doc.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Collaborators */}
                  {doc.collaborators.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Collaborators:</span>
                      <div className="flex -space-x-1">
                        {doc.collaborators.slice(0, 3).map((collaborator, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium"
                            title={collaborator}
                          >
                            {collaborator
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        ))}
                        {doc.collaborators.length > 3 && (
                          <div className="w-6 h-6 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium">
                            +{doc.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/projects/${projectId}/documents/${doc.id}`}>
                    <Button className="w-full mt-4" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Open Document
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No documents found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by generating your first document"}
            </p>
            <Link href={`/projects/${projectId}/documents/generate`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Document
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
