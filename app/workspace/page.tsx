"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  FileText,
  Database,
  Share2,
  Settings,
  Send,
  Paperclip,
  Mic,
  Users,
  Target,
  Zap,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  Download,
  Github,
  ExternalLink,
  ArrowLeft,
  X,
  Menu,
  Loader2,
  Search,
  GanttChart,
  Package2,
  Link2,
  CheckCircle,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Initial chat messages
const initialChatMessages = [
  {
    type: "ai",
    content:
      "Welcome! I see you're building TaskFlow. Let me understand your project better. What's the main problem you're solving for development teams?",
    timestamp: "2 min ago",
  },
  {
    type: "user",
    content:
      "We want to solve the chaos of project management for small dev teams. Most tools are too complex or too simple.",
    timestamp: "2 min ago",
  },
  {
    type: "ai",
    content:
      "Great insight! I'm updating your target audience and problem statement. What specific features are you thinking about?",
    timestamp: "1 min ago",
  },
  {
    type: "user",
    content:
      "AI-powered task assignment based on team member skills, real-time collaboration, and integrated time tracking.",
    timestamp: "1 min ago",
  },
  {
    type: "ai",
    content:
      "Excellent! I can see this shaping up. Ready to generate some documentation? I have enough context to create a PRD or technical specification.",
    timestamp: "Just now",
  },
]

// Initial project context
const initialProjectContext = {
  targetAudience: {
    confidence: 95,
    description: "Small to medium development teams (5-50 people)",
    details: ["Time-constrained developers", "Need simple workflows", "Budget-conscious", "Remote-first teams"],
  },
  coreFeatures: {
    confidence: 88,
    items: [
      { name: "AI task assignment", priority: "High", emoji: "🔥" },
      { name: "Real-time collaboration", priority: "High", emoji: "⚡" },
      { name: "Integrated time tracking", priority: "Medium", emoji: "⏱️" },
      { name: "Sprint planning", priority: "Medium", emoji: "📊" },
    ],
  },
  techStack: {
    confidence: 75,
    frontend: "React 18, TypeScript, Tailwind CSS",
    backend: "Node.js, Express, Socket.io",
    database: "PostgreSQL, Redis for caching",
    hosting: "AWS, Docker containers",
  },
  businessStrategy: {
    confidence: 65,
    revenueModel: "SaaS subscription",
    pricing: "Freemium with paid tiers",
    targetMarket: "SMB development teams",
    competition: "Asana, Linear, Monday.com",
  },
}

// Initial documents
const initialDocuments = [
  {
    id: 1,
    name: "Product Requirements Doc",
    status: "fresh",
    type: "PRD",
    lastModified: "2 hours ago",
    content: `# TaskFlow - Product Requirements Document

## 1. Product Overview
TaskFlow is an AI-powered project management platform designed specifically for small to medium development teams (5-50 people).

## 2. Target Audience
**Primary Users:** Development team leads, project managers, and developers
**Team Size:** 5-50 people
**Industry:** Technology, Software Development, Digital Agencies

## 3. Problem Statement
Current project management tools are either too complex for small teams or too simple for effective development workflows. Teams struggle with:
- Manual task assignment without considering team member skills
- Fragmented communication across multiple tools
- Lack of real-time collaboration features
- Difficulty tracking time and project progress

## 4. Key Features

### 4.1 AI Task Assignment
**Description:** Automatically assign tasks based on team member skills, availability, and workload
**Priority:** High
**User Story:** As a project manager, I want AI to suggest optimal task assignments so that work is distributed efficiently

### 4.2 Real-time Collaboration
**Description:** Live editing, commenting, and status updates across all project elements
**Priority:** High
**User Story:** As a team member, I want to see real-time updates so that I'm always working with current information

### 4.3 Integrated Time Tracking
**Description:** Seamless time tracking with automatic detection of work patterns
**Priority:** Medium
**User Story:** As a developer, I want automatic time tracking so that I can focus on coding without manual time entry

## 5. Technical Requirements

### 5.1 Frontend Technology
- React 18 with TypeScript
- Tailwind CSS for styling
- Real-time WebSocket connections
- Progressive Web App (PWA) support

### 5.2 Backend Technology
- Node.js with Express framework
- PostgreSQL for primary database
- Redis for caching and sessions
- Socket.io for real-time features

## 6. Success Metrics
- User adoption rate: 80% of team members actively using the platform within 30 days
- Task completion efficiency: 25% improvement in project delivery times
- User satisfaction: NPS score of 50+ within 6 months

## 7. Timeline & Milestones
- **Phase 1 (Months 1-3):** Core features development
- **Phase 2 (Months 4-6):** AI integration and testing
- **Phase 3 (Months 7-9):** Beta launch and user feedback
- **Phase 4 (Months 10-12):** Public launch and scaling`,
  },
  {
    id: 2,
    name: "Technical Specification",
    status: "needs-update",
    type: "Technical",
    lastModified: "1 day ago",
    content: "# Technical Specification\n\nThis document outlines the technical architecture...",
  },
  {
    id: 3,
    name: "User Stories Collection",
    status: "fresh",
    type: "User Stories",
    lastModified: "4 hours ago",
    content: "# User Stories\n\n## Epic: Task Management\n\nAs a project manager...",
  },
  {
    id: 4,
    name: "API Documentation",
    status: "draft",
    type: "Technical",
    lastModified: "2 days ago",
    content: "# API Documentation\n\n## Authentication\n\nAll API requests require...",
  },
  {
    id: 5,
    name: "Marketing Landing Page Copy",
    status: "fresh",
    type: "Marketing",
    lastModified: "6 hours ago",
    content: "# Landing Page Copy\n\n## Hero Section\n\nTransform your team's productivity...",
  },
  {
    id: 6,
    name: "Feature Roadmap Q1 2024",
    status: "fresh",
    type: "Planning",
    lastModified: "1 day ago",
    content: "# Q1 2024 Roadmap\n\n## January\n- AI task assignment beta\n- Real-time collaboration...",
  },
]

// Initial sources
const initialSources = [
  {
    id: 1,
    name: "Original Business Plan.pdf",
    type: "file",
    category: "Uploaded Files",
    status: "processed",
    lastProcessed: "3 days ago",
    insights: ["Market analysis", "Revenue projections", "Competitive landscape"],
  },
  {
    id: 2,
    name: "Competitor Analysis.docx",
    type: "file",
    category: "Uploaded Files",
    status: "processed",
    lastProcessed: "2 days ago",
    insights: ["Feature comparison", "Pricing analysis", "Market positioning"],
  },
  {
    id: 3,
    name: "User Interview Notes.md",
    type: "file",
    category: "Uploaded Files",
    status: "processing",
    lastProcessed: "1 hour ago",
    progress: 75,
    insights: [],
  },
  {
    id: 4,
    name: "taskflow-backend",
    type: "github",
    category: "GitHub Repositories",
    status: "connected",
    lastProcessed: "Live sync",
    insights: ["Node.js architecture", "PostgreSQL schema", "API endpoints"],
  },
  {
    id: 5,
    name: "Design System - Figma",
    type: "link",
    category: "External Links",
    status: "connected",
    lastProcessed: "1 day ago",
    insights: ["Component library", "Design tokens", "User flows"],
  },
  {
    id: 6,
    name: "Market Research - Notion",
    type: "link",
    category: "External Links",
    status: "processed",
    lastProcessed: "1 week ago",
    insights: ["Target demographics", "Market size", "Growth trends"],
  },
]

// Initial export history
const initialExportHistory = [
  {
    id: 1,
    destination: "Notion",
    document: "PRD to Notion",
    status: "success",
    timestamp: "2 hours ago",
    url: "https://notion.so/prd-taskflow",
  },
  {
    id: 2,
    destination: "Linear",
    document: "User Stories to Linear",
    status: "success",
    timestamp: "4 hours ago",
    url: "https://linear.app/taskflow/issues",
  },
  {
    id: 3,
    destination: "GitHub",
    document: "Tech Spec to GitHub",
    status: "in-progress",
    timestamp: "1 hour ago",
    progress: 60,
  },
  {
    id: 4,
    destination: "V0",
    document: "Landing Page to V0",
    status: "success",
    timestamp: "1 day ago",
    url: "https://v0.dev/chat/taskflow-landing",
  },
]

// Integration destinations
const integrationDestinations = [
  {
    name: "Notion",
    status: "connected",
    exportsToday: 3,
    lastExport: "2 hours ago",
    icon: "📝",
  },
  {
    name: "GitHub",
    status: "connected",
    exportsToday: 1,
    lastExport: "1 hour ago",
    icon: "🐙",
  },
  {
    name: "Google Drive",
    status: "connected",
    exportsToday: 2,
    lastExport: "2 hours ago",
    icon: "📁",
  },
  {
    name: "Linear",
    status: "not-connected",
    exportsToday: 0,
    lastExport: "Never",
    icon: "📋",
  },
  {
    name: "Figma",
    status: "connected",
    exportsToday: 0,
    lastExport: "Design tokens synced",
    icon: "🎨",
  },
  {
    name: "V0.dev",
    status: "connected",
    exportsToday: 1,
    lastExport: "1 day ago",
    icon: "⚡",
  },
  {
    name: "Slack",
    status: "connected",
    exportsToday: 0,
    lastExport: "Updates posted",
    icon: "💬",
  },
]

// Initial team members
const initialTeamMembers = [
  { name: "Sarah", avatar: "S", status: "online" },
  { name: "Mike", avatar: "M", status: "online" },
]

// Initial activities
const initialActivities = [
  { user: "Sarah", action: "added technical constraints", time: "2 min ago" },
  { user: "Mike", action: "generated user stories", time: "15 min ago" },
  { user: "Alex", action: "updated target audience", time: "1 hour ago" },
]

// Initial AI insights
const initialInsights = [
  {
    title: "Smart Suggestion",
    content: "Consider adding integrations with GitHub and Slack - your target audience heavily uses these tools",
    type: "suggestion",
  },
  {
    title: "Missing Information",
    content: "Define your pricing strategy and user onboarding flow to complete your business model",
    type: "warning",
  },
]

// Quick actions
const quickActions = [
  { label: "Generate PRD", icon: "FileText" },
  { label: "Create User Stories", icon: "Users" },
  { label: "Technical Spec", icon: "Database" },
  { label: "Add Features", icon: "Zap" },
]

// Local storage keys
const STORAGE_KEYS = {
  PROJECT_CONTEXT: "provibe-project-context",
  CHAT_MESSAGES: "provibe-chat-messages",
  DOCUMENTS: "provibe-documents",
  ACTIVITIES: "provibe-activities",
  INSIGHTS: "provibe-insights",
}

export default function Workspace() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // State for mobile responsiveness
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // State for chat functionality
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for tabs
  const [activeTab, setActiveTab] = useState("chat")

  // State with localStorage persistence
  const [projectContext, setProjectContext] = useState(initialProjectContext)
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [documents, setDocuments] = useState(initialDocuments)
  const [activities, setActivities] = useState(initialActivities)
  const [insights, setInsights] = useState(initialInsights)
  const [teamMembers] = useState(initialTeamMembers)
  const [sources, setSources] = useState(initialSources)
  const [exportHistory, setExportHistory] = useState(initialExportHistory)

  // State for selected items
  const [selectedDocument, setSelectedDocument] = useState(documents[0])
  const [selectedSource, setSelectedSource] = useState(sources[0])

  // State for action loading
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [documentFilter, setDocumentFilter] = useState("All")

  // Filtered documents based on search term and filter
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = documentFilter === "All" || doc.type === documentFilter
    return matchesSearch && matchesFilter
  })

  // Create stable function references to prevent re-renders
  const addAIMessage = useCallback((content: string) => {
    const newMessage = {
      type: "ai",
      content,
      timestamp: "Just now",
    }
    setChatMessages((prev) => [...prev, newMessage])
  }, [])

  const addActivity = useCallback((user: string, action: string) => {
    const newActivity = {
      user,
      action,
      time: "Just now",
    }
    setActivities((prev) => [newActivity, ...prev.slice(0, 4)])
  }, [])

  const addUserMessage = useCallback(
    (content: string, attachments?: File[]) => {
      const newMessage = {
        type: "user",
        content,
        timestamp: "Just now",
        attachments,
      }
      setChatMessages((prev) => [...prev, newMessage])
      addActivity("You", "sent a message")
    },
    [addActivity],
  )

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedContext = localStorage.getItem(STORAGE_KEYS.PROJECT_CONTEXT)
    const storedMessages = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)
    const storedDocuments = localStorage.getItem(STORAGE_KEYS.DOCUMENTS)
    const storedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
    const storedInsights = localStorage.getItem(STORAGE_KEYS.INSIGHTS)

    if (storedContext) setProjectContext(JSON.parse(storedContext))
    if (storedMessages) setChatMessages(JSON.parse(storedMessages))
    if (storedDocuments) setDocuments(JSON.parse(storedDocuments))
    if (storedActivities) setActivities(JSON.parse(storedActivities))
    if (storedInsights) setInsights(JSON.parse(storedInsights))
  }, []) // Empty dependency array - only run once on mount

  // Handle URL params separately
  useEffect(() => {
    const entryType = searchParams.get("type")
    if (entryType) {
      const timer = setTimeout(() => {
        addAIMessage(`I see you're starting with a ${entryType.replace("-", " ")}. Let's build on that!`)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, addAIMessage])

  // Save data to localStorage when it changes - separate effects with proper dependencies
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECT_CONTEXT, JSON.stringify(projectContext))
  }, [projectContext])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages))
  }, [chatMessages])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents))
  }, [documents])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights))
  }, [insights])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Function to add a user message
  // Function to add an AI message
  // Function to add an activity

  // Function to update project context
  const updateProjectContext = (updates: any) => {
    setProjectContext((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  // Function to add a document
  const addDocument = (name: string, status: "fresh" | "needs-update" | "draft" = "fresh", type = "PRD") => {
    const newDocument = {
      id: documents.length + 1,
      name,
      status,
      type,
      lastModified: "Just now",
      content: "",
    }
    setDocuments((prev) => [newDocument, ...prev])
    addActivity("AI Assistant", `generated ${name}`)
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return

    const content = message.trim() || (uploadedFiles.length > 0 ? `Uploaded ${uploadedFiles.length} file(s)` : "")
    addUserMessage(content, uploadedFiles.length > 0 ? [...uploadedFiles] : undefined)

    setMessage("")
    setUploadedFiles([])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      let response = "I understand. Let me analyze this and update your project context accordingly."

      if (content.toLowerCase().includes("feature") || content.toLowerCase().includes("functionality")) {
        response = "Great feature idea! I've added it to your core features list and updated the project context."
        const updatedFeatures = [...projectContext.coreFeatures.items]
        if (content.toLowerCase().includes("notification")) {
          updatedFeatures.push({ name: "Push notifications", priority: "Medium", emoji: "🔔" })
        } else if (content.toLowerCase().includes("dashboard")) {
          updatedFeatures.push({ name: "Analytics dashboard", priority: "Medium", emoji: "📊" })
        } else {
          updatedFeatures.push({ name: "Custom feature", priority: "Medium", emoji: "✨" })
        }

        updateProjectContext({
          coreFeatures: {
            ...projectContext.coreFeatures,
            items: updatedFeatures,
            confidence: Math.min(100, projectContext.coreFeatures.confidence + 5),
          },
        })
      }

      addAIMessage(response)
    }, 1500)
  }

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files))
      toast({
        title: "Files ready to upload",
        description: `${e.target.files.length} file(s) selected`,
      })
    }
  }

  // Handle quick action click
  const handleQuickAction = (action: { label: string; icon: string }) => {
    setLoadingAction(action.label)

    setTimeout(() => {
      switch (action.label) {
        case "Generate PRD":
          addDocument("Product Requirements Document", "fresh", "PRD")
          addAIMessage(
            "I've generated a comprehensive Product Requirements Document based on our conversation. You can view and edit it in the Documents tab.",
          )
          setActiveTab("documents")
          break
        case "Create User Stories":
          addDocument("User Stories Collection", "fresh", "User Stories")
          addAIMessage(
            "I've created user stories for all the core features we've discussed. Each story includes acceptance criteria and priority levels.",
          )
          break
        case "Technical Spec":
          addDocument("Technical Specification", "fresh", "Technical")
          addAIMessage(
            "I've generated a technical specification document that outlines the architecture, data models, and API endpoints for TaskFlow.",
          )
          break
        case "Add Features":
          addAIMessage(
            "What additional features would you like to add to TaskFlow? Please describe them and I'll update the project context.",
          )
          break
      }
      setLoadingAction(null)
    }, 2000)
  }

  // Handle export actions
  const handleExport = (destination: string) => {
    const newExport = {
      id: exportHistory.length + 1,
      destination,
      document: `Current project to ${destination}`,
      status: "in-progress",
      timestamp: "Just now",
      progress: 0,
    }

    setExportHistory((prev) => [newExport, ...prev])

    toast({
      title: "Exporting content",
      description: `Exporting to ${destination}...`,
    })

    setTimeout(() => {
      setExportHistory((prev) => {
        const updated = [...prev]
        updated[0] = { ...updated[0], status: "success", progress: 100 }
        return updated
      })

      toast({
        title: "Export complete",
        description: `Successfully exported to ${destination}`,
      })

      addActivity("You", `exported to ${destination}`)
    }, 3000)
  }

  // Get icon component by name
  const getIcon = (iconName: string) => {
    const icons = {
      FileText,
      Users,
      Database,
      Zap,
      Lightbulb,
      AlertTriangle,
    }
    return icons[iconName as keyof typeof icons] || FileText
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/create">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Projects
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold">TaskFlow - Project Management SaaS</h1>
              <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Mode Switcher - Hidden on mobile */}
            <div className="hidden md:flex bg-slate-100 rounded-lg p-1">
              {["chat", "documents", "sources", "export"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${
                    activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Team Avatars - Hidden on small screens */}
            <div className="hidden sm:flex -space-x-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="relative">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white">
                    {member.avatar}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === "online" ? "bg-emerald-400" : "bg-yellow-400"
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b p-4">
            <div className="flex space-x-2 mb-4">
              {["chat", "documents", "sources", "export"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    activeTab === tab ? "bg-indigo-100 text-indigo-900" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Mobile Panel Controls */}
        <div className="lg:hidden flex border-b bg-white">
          <button
            onClick={() => {
              setMobileSidebarOpen(true)
              setMobileMenuOpen(false)
            }}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              mobileSidebarOpen ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600"
            }`}
          >
            {activeTab === "chat"
              ? "Chat"
              : activeTab === "documents"
                ? "Documents"
                : activeTab === "sources"
                  ? "Sources"
                  : "Export"}
          </button>
          <button
            onClick={() => {
              setMobileSidebarOpen(false)
              setMobileMenuOpen(false)
            }}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              !mobileSidebarOpen ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-600"
            }`}
          >
            Content
          </button>
        </div>

        {/* Left Panel - Context-sensitive based on active tab */}
        <div
          className={`w-full lg:w-96 bg-white border-r flex flex-col ${
            mobileSidebarOpen ? "block" : "hidden lg:flex"
          } order-2 lg:order-1`}
        >
          {activeTab === "chat" && (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold">Product Intelligence Chat</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-sm text-slate-600">AI Assistant</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Import Sources
                </Button>
              </div>

              {/* Chat Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.type === "user" ? "text-indigo-200" : "text-slate-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-900">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = getIcon(action.icon)
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start"
                        onClick={() => handleQuickAction(action)}
                        disabled={loadingAction === action.label}
                      >
                        {loadingAction === action.label ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <IconComponent className="h-4 w-4 mr-2" />
                        )}
                        {action.label}
                      </Button>
                    )
                  })}
                </div>

                {/* File upload input (hidden) */}
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />

                {/* Uploaded files display */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-2 p-2 bg-slate-100 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Selected files:</span>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => setUploadedFiles([])}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="text-xs flex items-center">
                        <Paperclip className="h-3 w-3 mr-1" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe features, ask questions, or request documents..."
                      className="min-h-[60px] pr-20"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <div className="absolute bottom-2 right-2 flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button size="sm" className="self-end" onClick={handleSendMessage} disabled={isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "documents" && (
            <>
              <div className="p-4 border-b">
                <h2 className="font-semibold mb-3">Document Library</h2>

                {/* Search Input */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Dropdown */}
                <select
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="All">All Types</option>
                  <option value="PRD">PRD</option>
                  <option value="Technical">Technical</option>
                  <option value="User Stories">User Stories</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>

              {/* Document List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDocument?.id === doc.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{doc.name}</h4>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            doc.status === "fresh"
                              ? "bg-emerald-400"
                              : doc.status === "needs-update"
                                ? "bg-yellow-400"
                                : "bg-blue-400"
                          }`}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <Badge variant="secondary" className="text-xs">
                          {doc.type}
                        </Badge>
                        <span>{doc.lastModified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "sources" && (
            <>
              <div className="p-4 border-b">
                <h2 className="font-semibold mb-3">Source Management</h2>
                <Button variant="outline" size="sm" className="w-full">
                  <Package2 className="h-4 w-4 mr-2" />
                  Add New Source
                </Button>
              </div>

              {/* Source Categories */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {["Uploaded Files", "GitHub Repositories", "External Links"].map((category) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-slate-700 mb-2">{category}</h4>
                      <div className="space-y-2">
                        {sources
                          .filter((source) => source.category === category)
                          .map((source) => (
                            <div
                              key={source.id}
                              className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                                selectedSource?.id === source.id
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              onClick={() => setSelectedSource(source)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{source.name}</span>
                                {source.status === "processing" && (
                                  <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                                )}
                                {source.status === "processed" && <CheckCircle className="h-3 w-3 text-emerald-500" />}
                                {source.status === "connected" && (
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{source.lastProcessed}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "export" && (
            <>
              <div className="p-4 border-b">
                <h2 className="font-semibold mb-3">Export Destinations</h2>
                <Button variant="outline" size="sm" className="w-full">
                  <Link2 className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </div>

              {/* Integration List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {integrationDestinations.map((integration, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{integration.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{integration.name}</p>
                            <p className="text-xs text-slate-500">{integration.exportsToday} exports today</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {integration.status === "connected" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Button size="sm" variant="outline">
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Center Panel - Content based on active tab */}
        <div
          className={`flex-1 p-6 overflow-y-auto ${
            !mobileSidebarOpen ? "block" : "hidden lg:block"
          } order-1 lg:order-2`}
        >
          {activeTab === "chat" && (
            <div className="grid gap-6">
              {/* Target Audience Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-indigo-600" />
                      <span>Target Audience</span>
                    </CardTitle>
                    <Badge
                      className={`${
                        projectContext.targetAudience.confidence >= 90
                          ? "bg-emerald-100 text-emerald-700"
                          : projectContext.targetAudience.confidence >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {projectContext.targetAudience.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-3">{projectContext.targetAudience.description}</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {projectContext.targetAudience.details.map((detail, index) => (
                      <li key={index}>• {detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Key Features Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <span>Core Features</span>
                    </CardTitle>
                    <Badge
                      className={`${
                        projectContext.coreFeatures.confidence >= 90
                          ? "bg-emerald-100 text-emerald-700"
                          : projectContext.coreFeatures.confidence >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {projectContext.coreFeatures.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projectContext.coreFeatures.items.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">
                          {feature.emoji} {feature.name}
                        </span>
                        <Badge variant={feature.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                          {feature.priority} priority
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <span>Technical Architecture</span>
                    </CardTitle>
                    <Badge
                      className={`${
                        projectContext.techStack.confidence >= 90
                          ? "bg-emerald-100 text-emerald-700"
                          : projectContext.techStack.confidence >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {projectContext.techStack.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Frontend</p>
                      <p className="text-sm text-slate-600">{projectContext.techStack.frontend}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Backend</p>
                      <p className="text-sm text-slate-600">{projectContext.techStack.backend}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Database</p>
                      <p className="text-sm text-slate-600">{projectContext.techStack.database}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Hosting</p>
                      <p className="text-sm text-slate-600">{projectContext.techStack.hosting}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Model Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                      <span>Business Strategy</span>
                    </CardTitle>
                    <Badge
                      className={`${
                        projectContext.businessStrategy.confidence >= 90
                          ? "bg-emerald-100 text-emerald-700"
                          : projectContext.businessStrategy.confidence >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {projectContext.businessStrategy.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Revenue Model</p>
                      <p className="text-sm text-slate-600">{projectContext.businessStrategy.revenueModel}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Pricing</p>
                      <p className="text-sm text-slate-600">{projectContext.businessStrategy.pricing}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Target Market</p>
                      <p className="text-sm text-slate-600">{projectContext.businessStrategy.targetMarket}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Competition</p>
                      <p className="text-sm text-slate-600">{projectContext.businessStrategy.competition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "documents" && selectedDocument && (
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedDocument.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{selectedDocument.type}</Badge>
                      <Badge
                        className={
                          selectedDocument.status === "fresh"
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedDocument.status === "needs-update"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }
                      >
                        {selectedDocument.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">Last modified: {selectedDocument.lastModified}</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[500px] w-full font-mono text-sm"
                    value={selectedDocument.content}
                    onChange={(e) => {
                      const updatedDocuments = documents.map((doc) =>
                        doc.id === selectedDocument.id ? { ...doc, content: e.target.value } : doc,
                      )
                      setDocuments(updatedDocuments)
                      setSelectedDocument({ ...selectedDocument, content: e.target.value })
                    }}
                    placeholder="Document content will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "sources" && selectedSource && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{selectedSource.name}</span>
                    {selectedSource.status === "processing" && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {selectedSource.status === "processed" && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                    {selectedSource.status === "connected" && (
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    )}
                  </CardTitle>
                  <p className="text-sm text-slate-500">
                    {selectedSource.type} • {selectedSource.lastProcessed}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Processing Status</h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            selectedSource.status === "processed"
                              ? "bg-emerald-100 text-emerald-700"
                              : selectedSource.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                          }
                        >
                          {selectedSource.status}
                        </Badge>
                        {selectedSource.progress && (
                          <span className="text-sm text-slate-500">({selectedSource.progress}%)</span>
                        )}
                      </div>
                    </div>

                    {selectedSource.insights && selectedSource.insights.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Extracted Insights</h4>
                        <ul className="space-y-1">
                          {selectedSource.insights.map((insight, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedSource.type === "github" && (
                      <div>
                        <h4 className="font-medium mb-2">Repository Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Language:</strong> JavaScript (Node.js)
                          </p>
                          <p>
                            <strong>Size:</strong> 2.3 MB
                          </p>
                          <p>
                            <strong>Contributors:</strong> 3
                          </p>
                          <p>
                            <strong>Last Commit:</strong> 2 days ago
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "export" && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Export Dashboard</h3>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Exports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {exportHistory.map((exportItem) => (
                        <div key={exportItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{exportItem.document}</p>
                            <p className="text-sm text-slate-500">{exportItem.timestamp}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {exportItem.status === "in-progress" && (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                <span className="text-sm">In Progress</span>
                              </>
                            )}
                            {exportItem.status === "success" && (
                              <>
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm text-emerald-600">Success</span>
                                {exportItem.url && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={exportItem.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      View
                                    </a>
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Export</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {integrationDestinations
                        .filter((integration) => integration.status === "connected")
                        .map((integration, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() => handleExport(integration.name)}
                          >
                            <span className="text-2xl">{integration.icon}</span>
                            <span className="text-sm">Export to {integration.name}</span>
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Context-sensitive actions */}
        <div className="w-full lg:w-80 bg-white border-l p-4 overflow-y-auto hidden lg:block order-3">
          {activeTab === "chat" && (
            <>
              {/* AI Insights */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">AI Insights</h3>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-start space-x-2">
                        {insight.type === "suggestion" ? (
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{insight.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{insight.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Generated Documents */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Generated Documents</h3>
                <div className="space-y-2">
                  {documents.slice(0, 4).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setActiveTab("documents")
                        setSelectedDocument(doc)
                      }}
                    >
                      <FileText className="h-4 w-4 text-slate-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          doc.status === "fresh"
                            ? "bg-emerald-400"
                            : doc.status === "needs-update"
                              ? "bg-yellow-400"
                              : "bg-blue-400"
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Export */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Quick Export</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("Notion")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Export to Notion
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("GitHub")}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Push to GitHub
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("V0")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Send to V0
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleExport("Markdown")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Markdown
                  </Button>
                </div>
              </div>

              {/* Team Activity */}
              <div>
                <h3 className="font-semibold mb-3">Team Activity</h3>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium">
                        {activity.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "documents" && (
            <>
              {/* Document Actions */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Document Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* AI Assistance Tools */}
              <div>
                <h3 className="font-semibold mb-3">AI Assistance</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Summarize
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Improve Writing
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Check for Errors
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "sources" && (
            <>
              {/* Source Processing Tools */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Processing Tools</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze Source
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Extract Data
                  </Button>
                </div>
              </div>

              {/* Integration Tools */}
              <div>
                <h3 className="font-semibold mb-3">Integration Tools</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Link2 className="h-4 w-4 mr-2" />
                    Connect to API
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Github className="h-4 w-4 mr-2" />
                    Link to GitHub
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "export" && (
            <>
              {/* Export Configuration */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Configuration</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <GanttChart className="h-4 w-4 mr-2" />
                    Customize Template
                  </Button>
                </div>
              </div>

              {/* Integration Management */}
              <div>
                <h3 className="font-semibold mb-3">Integration Management</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Link2 className="h-4 w-4 mr-2" />
                    Manage Connections
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Package2 className="h-4 w-4 mr-2" />
                    Add Integration
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
