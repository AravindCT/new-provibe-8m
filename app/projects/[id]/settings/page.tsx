"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Trash2, Users, Shield, Bell, Archive } from "lucide-react"
import Link from "next/link"
import { useProjects } from "@/hooks/use-projects"

export default function ProjectSettings() {
  const params = useParams()
  const projectId = params.id as string
  const userId = "550e8400-e29b-41d4-a716-446655440000"

  const { projects, updateProject, deleteProject } = useProjects(userId)
  const project = projects.find((p) => p.id === projectId)

  const [settings, setSettings] = useState({
    name: project?.name || "",
    description: project?.description || "",
    type: project?.type || "saas",
    status: project?.status || "draft",
    target_audience: project?.target_audience || "",
    market_size: project?.market_size || "",
    business_model: project?.business_model || "",
    timeline: project?.timeline || "",
    budget_range: project?.budget_range || "",
    tags: project?.tags?.join(", ") || "",
    notifications: {
      email: true,
      push: true,
      mentions: true,
    },
    privacy: {
      public: false,
      team_access: true,
      external_sharing: false,
    },
  })

  const handleSave = async () => {
    try {
      await updateProject(projectId, {
        name: settings.name,
        description: settings.description,
        type: settings.type as any,
        status: settings.status as any,
        target_audience: settings.target_audience,
        market_size: settings.market_size,
        business_model: settings.business_model,
        timeline: settings.timeline,
        budget_range: settings.budget_range,
        tags: settings.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      })
      // Show success message
    } catch (error) {
      // Show error message
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(projectId)
        // Redirect to projects page
      } catch (error) {
        // Show error message
      }
    }
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h1>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
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
            <Link href={`/projects/${projectId}/workspace`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold gradient-text">ProVibe</span>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Project Settings</h1>
            <p className="text-slate-600">Manage your project configuration and preferences</p>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <Input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <Select value={settings.type} onValueChange={(value) => setSettings({ ...settings, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS Platform</SelectItem>
                      <SelectItem value="mobile">Mobile App</SelectItem>
                      <SelectItem value="api">API Service</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select
                    value={settings.status}
                    onValueChange={(value) => setSettings({ ...settings, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    value={settings.tags}
                    onChange={(e) => setSettings({ ...settings, tags: e.target.value })}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience & Market */}
          <Card>
            <CardHeader>
              <CardTitle>Target Audience & Market</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <Textarea
                  value={settings.target_audience}
                  onChange={(e) => setSettings({ ...settings, target_audience: e.target.value })}
                  placeholder="Describe your target audience, demographics, and user personas"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Market Size</label>
                  <Textarea
                    value={settings.market_size}
                    onChange={(e) => setSettings({ ...settings, market_size: e.target.value })}
                    placeholder="TAM, SAM, SOM analysis and market opportunity"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Model</label>
                  <Textarea
                    value={settings.business_model}
                    onChange={(e) => setSettings({ ...settings, business_model: e.target.value })}
                    placeholder="Revenue model, pricing strategy, and monetization"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Timeline</label>
                  <Input
                    value={settings.timeline}
                    onChange={(e) => setSettings({ ...settings, timeline: e.target.value })}
                    placeholder="Project timeline and milestones"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <Input
                    value={settings.budget_range}
                    onChange={(e) => setSettings({ ...settings, budget_range: e.target.value })}
                    placeholder="Budget range and funding requirements"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team & Collaboration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team & Collaboration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Team Access</h4>
                  <p className="text-sm text-gray-600">Allow team members to access this project</p>
                </div>
                <Switch
                  checked={settings.privacy.team_access}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, team_access: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">External Sharing</h4>
                  <p className="text-sm text-gray-600">Allow sharing with external collaborators</p>
                </div>
                <Switch
                  checked={settings.privacy.external_sharing}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, external_sharing: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public Project</h4>
                  <p className="text-sm text-gray-600">Make this project visible to the public</p>
                </div>
                <Switch
                  checked={settings.privacy.public}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, public: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive project updates via email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications for important updates</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mentions</h4>
                  <p className="text-sm text-gray-600">Get notified when someone mentions you</p>
                </div>
                <Switch
                  checked={settings.notifications.mentions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, mentions: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">Archive Project</h4>
                  <p className="text-sm text-gray-600">Archive this project to hide it from active projects</p>
                </div>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-600">Delete Project</h4>
                  <p className="text-sm text-gray-600">Permanently delete this project and all its data</p>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
