"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Star, Download, Eye, Plus, TrendingUp, Clock, User, Heart, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  const categories = [
    { id: "all", name: "All Templates", count: 24 },
    { id: "prd", name: "Product Requirements", count: 8 },
    { id: "spec", name: "Technical Specs", count: 6 },
    { id: "user-story", name: "User Stories", count: 5 },
    { id: "api-doc", name: "API Documentation", count: 3 },
    { id: "design", name: "Design Documents", count: 2 },
  ]

  const templates = [
    {
      id: "1",
      name: "SaaS Product PRD Template",
      description:
        "Comprehensive template for SaaS product requirements with user personas, feature specifications, and success metrics",
      category: "prd",
      author: "ProVibe Team",
      usageCount: 1247,
      rating: 4.8,
      isPublic: true,
      isFeatured: true,
      tags: ["saas", "product", "requirements", "mvp"],
      createdAt: "2024-01-15",
      updatedAt: "2024-03-10",
      preview: "# Product Requirements Document\n\n## Executive Summary\n...",
    },
    {
      id: "2",
      name: "Mobile App Technical Specification",
      description:
        "Detailed technical architecture template for mobile applications including API design, data models, and security considerations",
      category: "spec",
      author: "Alex Chen",
      usageCount: 892,
      rating: 4.7,
      isPublic: true,
      isFeatured: true,
      tags: ["mobile", "technical", "architecture", "api"],
      createdAt: "2024-02-01",
      updatedAt: "2024-03-08",
      preview: "# Technical Specification\n\n## Architecture Overview\n...",
    },
    {
      id: "3",
      name: "Agile User Stories Template",
      description:
        "Standard format for writing user stories with acceptance criteria, story points, and definition of done",
      category: "user-story",
      author: "Sarah Johnson",
      usageCount: 756,
      rating: 4.6,
      isPublic: true,
      isFeatured: false,
      tags: ["agile", "user stories", "scrum", "acceptance criteria"],
      createdAt: "2024-01-20",
      updatedAt: "2024-03-05",
      preview: "# User Stories\n\n## Epic: User Authentication\n...",
    },
    {
      id: "4",
      name: "REST API Documentation",
      description:
        "Complete API documentation template with endpoint specifications, authentication, and code examples",
      category: "api-doc",
      author: "Mike Rodriguez",
      usageCount: 634,
      rating: 4.9,
      isPublic: true,
      isFeatured: true,
      tags: ["api", "rest", "documentation", "endpoints"],
      createdAt: "2024-02-10",
      updatedAt: "2024-03-12",
      preview: "# API Documentation\n\n## Authentication\n...",
    },
    {
      id: "5",
      name: "E-commerce Platform PRD",
      description:
        "Specialized PRD template for e-commerce platforms with payment integration, inventory management, and user experience flows",
      category: "prd",
      author: "Emily Davis",
      usageCount: 523,
      rating: 4.5,
      isPublic: true,
      isFeatured: false,
      tags: ["ecommerce", "platform", "payments", "inventory"],
      createdAt: "2024-02-15",
      updatedAt: "2024-03-01",
      preview: "# E-commerce Platform Requirements\n\n## Business Objectives\n...",
    },
    {
      id: "6",
      name: "Design System Documentation",
      description: "Template for documenting design systems including components, patterns, and usage guidelines",
      category: "design",
      author: "Lisa Wang",
      usageCount: 445,
      rating: 4.7,
      isPublic: true,
      isFeatured: false,
      tags: ["design system", "components", "ui", "guidelines"],
      createdAt: "2024-02-20",
      updatedAt: "2024-03-07",
      preview: "# Design System\n\n## Color Palette\n...",
    },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "rating":
        return b.rating - a.rating
      case "usage":
        return b.usageCount - a.usageCount
      case "recent":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "popular":
      default:
        return b.usageCount - a.usageCount
    }
  })

  const featuredTemplates = templates.filter((t) => t.isFeatured)

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
              <span className="text-indigo-600 font-medium">Templates</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Document Templates</h1>
          <p className="text-slate-600">Discover and use professional templates to accelerate your documentation</p>
        </div>

        <Tabs value="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Templates</TabsTrigger>
            <TabsTrigger value="my-templates">My Templates</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Featured Templates */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Featured Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTemplates.slice(0, 3).map((template) => (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                          <p className="text-sm text-slate-600 mt-1">by {template.author}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{template.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{template.usageCount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Category: {categories.find((c) => c.id === selectedCategory)?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} onClick={() => setSelectedCategory(category.id)}>
                      {category.name} ({category.count})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sort: {sortBy === "popular" ? "Most Popular" : sortBy}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("popular")}>Most Popular</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating")}>Highest Rated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>Recently Updated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">by {template.author}</p>
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
                            <Heart className="h-4 w-4 mr-2" />
                            Add to Favorites
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{template.usageCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-templates">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No custom templates yet</h3>
              <p className="text-slate-600 mb-6">Create your own templates to reuse across projects</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No favorites yet</h3>
              <p className="text-slate-600 mb-6">Save templates you love for quick access</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
