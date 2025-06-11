"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Github,
  ArrowLeft,
  Check,
  Code,
  Database,
  FileText,
  AlertCircle,
  ExternalLink,
  Users,
  Calendar,
  GitBranch,
} from "lucide-react"
import Link from "next/link"

export default function GitHubIntegration() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/username/taskflow-backend")
  const [isConnected, setIsConnected] = useState(true)
  const [analysisProgress, setAnalysisProgress] = useState(75)
  const [currentStep, setCurrentStep] = useState("Analyzing code structure and dependencies")

  const analysisSteps = [
    { name: "Repository cloned", completed: true },
    { name: "Dependencies scanned", completed: true },
    { name: "Extracting documentation", completed: false, current: true },
    { name: "Generating insights", completed: false },
  ]

  const techStack = [
    { category: "Backend", items: ["Node.js 18", "Express 4.18"] },
    { category: "Database", items: ["PostgreSQL", "Prisma ORM"] },
    { category: "Authentication", items: ["JWT tokens"] },
    { category: "API", items: ["RESTful", "GraphQL endpoints"] },
  ]

  const featuresIdentified = [
    "User authentication system",
    "Project CRUD operations",
    "Real-time WebSocket connections",
    "File upload handling",
    "Email notification system",
  ]

  const architecturePatterns = [
    "MVC architecture",
    "Microservices approach",
    "Database migrations",
    "API rate limiting",
    "Error handling middleware",
  ]

  const missingDocs = [
    { name: "API endpoint documentation", priority: "High" },
    { name: "Database schema documentation", priority: "High" },
    { name: "Deployment instructions", priority: "Medium" },
    { name: "Environment setup guide", priority: "Medium" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/create">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Create
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Github className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Import from GitHub Repository</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Step 2 of 3</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Repository Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Repository URL</label>
                <Input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="mb-3"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant={isConnected ? "secondary" : "default"} className="flex items-center space-x-2">
                    <Github className="h-4 w-4" />
                    <span>{isConnected ? "Connected to GitHub" : "Connect GitHub Account"}</span>
                    {isConnected && <Check className="h-4 w-4 text-emerald-600" />}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Repository visibility:</span>
                  <Badge variant="outline">Public</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analysis Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-slate-600">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="mb-4" />
                <p className="text-sm text-slate-600">Current step: {currentStep}</p>
              </div>

              <div className="space-y-3">
                {analysisSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-emerald-100 text-emerald-600"
                          : step.current
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {step.completed ? (
                        <Check className="h-4 w-4" />
                      ) : step.current ? (
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm ${step.completed || step.current ? "text-slate-900" : "text-slate-500"}`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repository Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Repository Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">taskflow-backend</p>
                  <p className="text-xs text-slate-600">Repository name</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">JavaScript (Node.js)</p>
                  <p className="text-xs text-slate-600">Primary language</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">2.3 MB</p>
                  <p className="text-xs text-slate-600">Repository size</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">2 days ago</p>
                  <p className="text-xs text-slate-600">Last commit</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>3 contributors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitBranch className="h-4 w-4" />
                  <span>main branch</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>47 files</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Insights Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-blue-600" />
                <span>Tech Stack Detected</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {techStack.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-sm text-slate-700 mb-2">{category.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Identified */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span>Features Identified</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {featuresIdentified.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Architecture Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-600" />
                <span>Architecture Patterns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {architecturePatterns.map((pattern, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{pattern}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Missing Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span>Missing Documentation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {missingDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{doc.name}</span>
                    <Badge variant={doc.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                      {doc.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-auto p-4 flex flex-col items-center space-y-2">
                <FileText className="h-6 w-6" />
                <span>Generate Missing Documentation</span>
                <span className="text-xs opacity-75">Create API docs, setup guides, and more</span>
              </Button>

              <Link href="/workspace">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 w-full">
                  <ExternalLink className="h-6 w-6" />
                  <span>Create Project from Analysis</span>
                  <span className="text-xs opacity-75">Start building with extracted insights</span>
                </Button>
              </Link>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Check className="h-6 w-6" />
                <span>Review and Edit Insights</span>
                <span className="text-xs opacity-75">Refine the extracted information</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
