"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Database,
  Users,
  Code,
  Palette,
  ArrowLeft,
  Save,
  Download,
  Share2,
  RefreshCw,
  BookOpen,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function DocumentGeneration() {
  const [activeTab, setActiveTab] = useState("prd")
  const [selectedTemplate, setSelectedTemplate] = useState("standard")
  const [selectedSection, setSelectedSection] = useState("overview")
  const [customPrompt, setCustomPrompt] = useState("")

  const documentTypes = [
    { id: "prd", label: "PRD", icon: FileText },
    { id: "technical", label: "Technical Spec", icon: Database },
    { id: "stories", label: "User Stories", icon: Users },
    { id: "api", label: "API Docs", icon: Code },
    { id: "marketing", label: "Marketing Copy", icon: Palette },
  ]

  const templates = [
    { id: "standard", name: "Standard PRD Template", description: "Comprehensive product requirements" },
    { id: "technical", name: "Technical PRD Template", description: "Engineering-focused requirements" },
    { id: "startup", name: "Startup PRD Template", description: "Lean startup methodology" },
    { id: "custom", name: "Custom Template", description: "Create your own template" },
  ]

  const sections = [
    "Product Overview",
    "Target Audience",
    "Problem Statement",
    "Key Features",
    "Technical Requirements",
    "Success Metrics",
    "Timeline & Milestones",
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/workspace">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workspace
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold">Product Requirements Document</h1>
              <Badge variant="secondary" className="text-xs">
                Auto-saved 2 minutes ago
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select defaultValue="notion">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notion">Notion</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Document Type Tabs */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
          {documentTypes.map((type) => {
            const IconComponent = type.icon
            return (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === type.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{type.label}</span>
              </button>
            )
          })}
        </div>

        {/* Template Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Template Selection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <h4 className="font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-slate-600">{template.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Split View */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generated Content Preview */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Document</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto h-[500px]">
                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold mb-6">TaskFlow - Product Requirements Document</h1>

                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">1. Product Overview</h2>
                  <p className="mb-4 text-slate-700">
                    TaskFlow is an AI-powered project management platform designed specifically for small to medium
                    development teams (5-50 people). The platform combines intelligent task assignment, real-time
                    collaboration, and integrated time tracking to streamline development workflows.
                  </p>

                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">2. Target Audience</h2>
                  <div className="mb-4">
                    <p className="font-medium mb-2">Primary Users:</p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-700">
                      <li>Development team leads and project managers</li>
                      <li>Software developers and engineers</li>
                      <li>Product managers in tech companies</li>
                    </ul>
                  </div>
                  <div className="mb-4">
                    <p className="font-medium mb-2">Team Characteristics:</p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-700">
                      <li>Team size: 5-50 people</li>
                      <li>Industry: Technology, Software Development, Digital Agencies</li>
                      <li>Work style: Remote-first or hybrid teams</li>
                      <li>Budget: Cost-conscious, seeking efficient solutions</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">3. Problem Statement</h2>
                  <p className="mb-4 text-slate-700">
                    Current project management tools are either too complex for small teams or too simple for effective
                    development workflows. Teams struggle with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700">
                    <li>Manual task assignment without considering team member skills and availability</li>
                    <li>Fragmented communication across multiple tools and platforms</li>
                    <li>Lack of real-time collaboration features for development workflows</li>
                    <li>Difficulty tracking time and measuring project progress accurately</li>
                    <li>Complex interfaces that require extensive training and onboarding</li>
                  </ul>

                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">4. Key Features</h2>

                  <h3 className="text-xl font-medium mb-3 text-slate-800">4.1 AI Task Assignment</h3>
                  <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium mb-2">Description:</p>
                    <p className="text-slate-700 mb-3">
                      Automatically assign tasks based on team member skills, availability, and current workload using
                      machine learning algorithms.
                    </p>
                    <p className="font-medium mb-2">
                      Priority:{" "}
                      <Badge variant="destructive" className="ml-2">
                        High
                      </Badge>
                    </p>
                    <p className="font-medium mb-2">User Story:</p>
                    <p className="text-slate-700 italic">
                      "As a project manager, I want AI to suggest optimal task assignments so that work is distributed
                      efficiently across my team."
                    </p>
                  </div>

                  <h3 className="text-xl font-medium mb-3 text-slate-800">4.2 Real-time Collaboration</h3>
                  <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium mb-2">Description:</p>
                    <p className="text-slate-700 mb-3">
                      Live editing, commenting, and status updates across all project elements with instant
                      synchronization.
                    </p>
                    <p className="font-medium mb-2">
                      Priority:{" "}
                      <Badge variant="destructive" className="ml-2">
                        High
                      </Badge>
                    </p>
                    <p className="font-medium mb-2">User Story:</p>
                    <p className="text-slate-700 italic">
                      "As a team member, I want to see real-time updates so that I'm always working with current
                      information."
                    </p>
                  </div>

                  <h3 className="text-xl font-medium mb-3 text-slate-800">4.3 Integrated Time Tracking</h3>
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium mb-2">Description:</p>
                    <p className="text-slate-700 mb-3">
                      Seamless time tracking with automatic detection of work patterns and productivity insights.
                    </p>
                    <p className="font-medium mb-2">
                      Priority:{" "}
                      <Badge variant="secondary" className="ml-2">
                        Medium
                      </Badge>
                    </p>
                    <p className="font-medium mb-2">User Story:</p>
                    <p className="text-slate-700 italic">
                      "As a developer, I want automatic time tracking so that I can focus on coding without manual time
                      entry."
                    </p>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4 text-slate-800">5. Technical Requirements</h2>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Frontend Technology</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• React 18 with TypeScript</li>
                        <li>• Tailwind CSS for styling</li>
                        <li>• Real-time WebSocket connections</li>
                        <li>• Progressive Web App (PWA) support</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Backend Technology</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Node.js with Express framework</li>
                        <li>• PostgreSQL for primary database</li>
                        <li>• Redis for caching and sessions</li>
                        <li>• Socket.io for real-time features</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editing Panel */}
          <div className="space-y-6">
            {/* Section Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Edit Section</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section.toLowerCase().replace(" ", "-")}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="w-full mt-3" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Section
                </Button>
              </CardContent>
            </Card>

            {/* Custom Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Enhancement</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Add more detail about security requirements..."
                  className="mb-3"
                />

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tone</label>
                    <Select defaultValue="professional">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Length</label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brief">Brief</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full mt-4">
                  <Zap className="h-4 w-4 mr-2" />
                  Enhance with AI
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Full Document
                </Button>
                <Button className="w-full" variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share for Review
                </Button>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
