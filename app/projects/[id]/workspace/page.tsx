"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { getMockUser } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  FileText,
  Upload,
  Download,
  Send,
  Bot,
  User,
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useChat } from "@/hooks/use-chat"
import { useProjects } from "@/hooks/use-projects"

export default function WorkspacePage() {
  const params = useParams()
  const projectId = params.id as string

  // Use mock user for now - replace with real auth later
  const mockUser = getMockUser()
  const userId = mockUser.id

  const { projects, loading: projectLoading } = useProjects(userId)
  const { messages, input, handleInputChange, handleSubmit, isLoading: chatLoading } = useChat(projectId, userId)

  const [activeTab, setActiveTab] = useState("chat")

  const project = projects.find((p) => p.id === projectId)

  // Mock data for other tabs
  const documents = [
    { id: "1", title: "Product Requirements Document", type: "PRD", status: "completed", lastModified: "2024-01-15" },
    { id: "2", title: "Technical Specification", type: "Tech Spec", status: "in-progress", lastModified: "2024-01-14" },
    { id: "3", title: "User Stories", type: "Stories", status: "completed", lastModified: "2024-01-13" },
  ]

  const sources = [
    { id: "1", name: "GitHub Repository", type: "github", url: "https://github.com/user/repo", connected: true },
    { id: "2", name: "Figma Design", type: "figma", url: "https://figma.com/design", connected: true },
    { id: "3", name: "Notion Docs", type: "notion", url: "https://notion.so/docs", connected: false },
  ]

  const exports = [
    { id: "1", platform: "Linear", status: "completed", lastExport: "2024-01-15", items: 12 },
    { id: "2", platform: "Notion", status: "pending", lastExport: "2024-01-14", items: 8 },
    { id: "3", platform: "GitHub Issues", status: "failed", lastExport: "2024-01-13", items: 5 },
  ]

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
            <div className="text-sm text-gray-500">{project.progress}% complete</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Sources</span>
            </TabsTrigger>
            <TabsTrigger value="exports" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exports</span>
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>AI Assistant</span>
                </CardTitle>
                <CardDescription>
                  Get help with your project development, ask questions, and generate content.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Start a conversation with your AI assistant</p>
                        <p className="text-sm">Ask about your project, request documents, or get development advice</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))
                    )}
                    {chatLoading && (
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask your AI assistant anything..."
                    disabled={chatLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={chatLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Project Documents</CardTitle>
                    <CardDescription>Manage and generate project documentation</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <p className="text-sm text-gray-500">
                            {doc.type} • Last modified {doc.lastModified}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={doc.status === "completed" ? "default" : "secondary"}>
                          {doc.status === "completed" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {doc.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Project Sources</CardTitle>
                    <CardDescription>Connect external sources to your project</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Source
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Upload className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{source.name}</h3>
                          <p className="text-sm text-gray-500">{source.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={source.connected ? "default" : "secondary"}>
                          {source.connected ? "Connected" : "Disconnected"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exports Tab */}
          <TabsContent value="exports" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Export History</CardTitle>
                    <CardDescription>Track exports to external platforms</CardDescription>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    New Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exports.map((exportItem) => (
                    <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{exportItem.platform}</h3>
                          <p className="text-sm text-gray-500">
                            {exportItem.items} items • Last export {exportItem.lastExport}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            exportItem.status === "completed"
                              ? "default"
                              : exportItem.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {exportItem.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
