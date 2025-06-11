"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Wand2, Download, Share, Edit } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function GenerateDocument() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    template: "",
    requirements: "",
    audience: "",
    tone: "professional",
  })
  const [generatedContent, setGeneratedContent] = useState("")

  const documentTypes = [
    {
      id: "prd",
      name: "Product Requirements Document",
      description: "Comprehensive product specification and requirements",
      icon: "📋",
      estimatedTime: "5-8 minutes",
    },
    {
      id: "spec",
      name: "Technical Specification",
      description: "Detailed technical architecture and implementation plan",
      icon: "⚙️",
      estimatedTime: "8-12 minutes",
    },
    {
      id: "user-story",
      name: "User Stories",
      description: "User-centered feature descriptions and acceptance criteria",
      icon: "👤",
      estimatedTime: "3-5 minutes",
    },
    {
      id: "api-doc",
      name: "API Documentation",
      description: "Complete API reference and integration guide",
      icon: "🔌",
      estimatedTime: "6-10 minutes",
    },
    {
      id: "design-doc",
      name: "Design Document",
      description: "UI/UX specifications and design system documentation",
      icon: "🎨",
      estimatedTime: "4-7 minutes",
    },
  ]

  const templates = {
    prd: [
      { id: "saas-prd", name: "SaaS Product PRD", description: "Template for SaaS products" },
      { id: "mobile-prd", name: "Mobile App PRD", description: "Template for mobile applications" },
      { id: "api-prd", name: "API Product PRD", description: "Template for API products" },
    ],
    spec: [
      { id: "system-arch", name: "System Architecture", description: "High-level system design" },
      { id: "api-spec", name: "API Specification", description: "RESTful API design" },
      { id: "database-spec", name: "Database Design", description: "Database schema and design" },
    ],
    "user-story": [
      { id: "agile-stories", name: "Agile User Stories", description: "Standard agile format" },
      { id: "epic-stories", name: "Epic Breakdown", description: "Large feature breakdown" },
    ],
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 500)

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval)
      setGenerationProgress(100)
      setGeneratedContent(`# ${formData.title}

## Overview
This document outlines the ${formData.description.toLowerCase()} for our project.

## Objectives
- Define clear requirements and specifications
- Establish success criteria
- Provide implementation guidance

## Requirements
${formData.requirements}

## Target Audience
${formData.audience}

## Implementation Plan
1. **Phase 1**: Initial setup and core functionality
2. **Phase 2**: Feature enhancement and optimization
3. **Phase 3**: Testing and deployment

## Success Metrics
- User engagement metrics
- Performance benchmarks
- Quality assurance criteria

## Conclusion
This document serves as the foundation for our development efforts and will be updated as requirements evolve.`)

      setTimeout(() => {
        setIsGenerating(false)
        setStep(3)
      }, 1000)
    }, 4000)
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    router.push(`/projects/${projectId}/documents`)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Document Type</h2>
              <p className="text-gray-600">Select the type of document you want to generate</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    formData.type === type.id ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{type.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{type.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {type.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!formData.type}>
                Continue
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Document Details</h2>
              <p className="text-gray-600">Provide details to customize your document</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Document Title</label>
                  <Input
                    placeholder="Enter document title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Brief description of what this document should cover"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {formData.type && templates[formData.type as keyof typeof templates] && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Template</label>
                    <Select
                      value={formData.template}
                      onValueChange={(value) => setFormData({ ...formData, template: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates[formData.type as keyof typeof templates].map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Specific Requirements</label>
                  <Textarea
                    placeholder="What specific requirements, features, or sections should be included?"
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <Textarea
                    placeholder="Who is the intended audience for this document?"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={!formData.title || !formData.description}>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Document
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Generated Document</h2>
                <p className="text-gray-600">Review and edit your generated document</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleSave}>Save Document</Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{formData.title}</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{generatedContent}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="h-8 w-8 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Generating Document</h3>
            <p className="text-gray-600 mb-6">AI is creating your {formData.title}...</p>
            <Progress value={generationProgress} className="mb-4" />
            <p className="text-sm text-gray-500">{Math.round(generationProgress)}% complete</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/projects/${projectId}/documents`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Documents
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold gradient-text">ProVibe</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">Step {step} of 3</div>
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
