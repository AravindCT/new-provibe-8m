"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Github, Upload, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewProject() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    type: "",
    source: "scratch",
    githubUrl: "",
    files: [] as File[],
    idea: "",
  })

  const projectTypes = [
    { value: "saas", label: "SaaS Platform", icon: "💼", description: "Web-based software service" },
    { value: "mobile", label: "Mobile App", icon: "📱", description: "iOS/Android application" },
    { value: "api", label: "API Service", icon: "🔌", description: "Backend API or microservice" },
    { value: "ecommerce", label: "E-commerce", icon: "🛒", description: "Online store or marketplace" },
    { value: "other", label: "Other", icon: "📁", description: "Custom project type" },
  ]

  const templates = [
    { name: "SaaS Starter", type: "saas", description: "Complete SaaS platform with auth, billing, and dashboard" },
    { name: "Mobile App MVP", type: "mobile", description: "React Native app with core features" },
    { name: "REST API", type: "api", description: "Node.js API with authentication and CRUD operations" },
    { name: "E-commerce Store", type: "ecommerce", description: "Full-featured online store with payments" },
  ]

  const handleCreateProject = () => {
    // In a real app, this would create the project via API
    const projectId = Math.random().toString(36).substr(2, 9)
    router.push(`/projects/${projectId}/workspace`)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">How would you like to start?</h2>
              <p className="text-gray-600">Choose your preferred method to create a new project</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  projectData.source === "scratch" ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => setProjectData({ ...projectData, source: "scratch" })}
              >
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Start from Scratch</h3>
                  <p className="text-sm text-gray-600">Describe your idea and let AI help you build</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  projectData.source === "github" ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => setProjectData({ ...projectData, source: "github" })}
              >
                <CardContent className="p-6 text-center">
                  <Github className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Import from GitHub</h3>
                  <p className="text-sm text-gray-600">Analyze existing repository and generate docs</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  projectData.source === "upload" ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => setProjectData({ ...projectData, source: "upload" })}
              >
                <CardContent className="p-6 text-center">
                  <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Upload Files</h3>
                  <p className="text-sm text-gray-600">Import existing documents and specifications</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!projectData.source}>
                Continue
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Project Details</h2>
              <p className="text-gray-600">Tell us about your project</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <Input
                    placeholder="My Awesome Project"
                    value={projectData.name}
                    onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <Select
                    value={projectData.type}
                    onValueChange={(value) => setProjectData({ ...projectData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Describe your project..."
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Popular Templates</h3>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          </div>
                          <Badge variant="outline">{template.type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {projectData.source === "github" && (
              <div>
                <label className="block text-sm font-medium mb-2">GitHub Repository URL</label>
                <Input
                  placeholder="https://github.com/username/repository"
                  value={projectData.githubUrl}
                  onChange={(e) => setProjectData({ ...projectData, githubUrl: e.target.value })}
                />
              </div>
            )}

            {projectData.source === "scratch" && (
              <div>
                <label className="block text-sm font-medium mb-2">Describe Your Idea</label>
                <Textarea
                  placeholder="I want to build a task management app that helps teams collaborate better..."
                  value={projectData.idea}
                  onChange={(e) => setProjectData({ ...projectData, idea: e.target.value })}
                  rows={4}
                />
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleCreateProject} disabled={!projectData.name || !projectData.type}>
                Create Project
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold gradient-text">ProVibe</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">Step {step} of 2</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">{renderStepContent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
