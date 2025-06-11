import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Github, Upload, Palette, BarChart3, RefreshCw, ArrowLeft, User, Clock, Folder } from "lucide-react"
import Link from "next/link"

export default function CreateProject() {
  const creationOptions = [
    {
      id: "fresh-idea",
      icon: Lightbulb,
      title: "Fresh Idea",
      description: "Start with a new product concept and build comprehensive documentation",
      useCases: "SaaS platforms, Mobile apps, E-commerce sites",
      buttonText: "Start with Idea",
      color: "bg-yellow-100 text-yellow-600",
      href: "/workspace",
    },
    {
      id: "github-repo",
      icon: Github,
      title: "GitHub Repository",
      description: "Import existing code to generate documentation and specifications",
      useCases: "React apps, API backends, Full-stack projects",
      buttonText: "Connect GitHub",
      color: "bg-gray-100 text-gray-600",
      href: "/github",
    },
    {
      id: "upload-docs",
      icon: Upload,
      title: "Existing Documents",
      description: "Upload PRDs, specs, or business plans to enhance and organize",
      useCases: "Legacy docs, Business plans, Research notes",
      buttonText: "Upload Files",
      color: "bg-blue-100 text-blue-600",
      href: "/workspace",
    },
    {
      id: "design-first",
      icon: Palette,
      title: "Design Files",
      description: "Import Figma designs or wireframes to create implementation specs",
      useCases: "UI/UX designs, User flows, Mockups",
      buttonText: "Import Design",
      color: "bg-pink-100 text-pink-600",
      href: "/workspace",
    },
    {
      id: "business-plan",
      icon: BarChart3,
      title: "Business Strategy",
      description: "Transform business strategy documents into technical requirements",
      useCases: "Pitch decks, Market analysis, Business models",
      buttonText: "Import Strategy",
      color: "bg-green-100 text-green-600",
      href: "/workspace",
    },
    {
      id: "product-iteration",
      icon: RefreshCw,
      title: "Update Existing Product",
      description: "Evolve existing product documentation with new features and changes",
      useCases: "Feature updates, Pivots, Version 2.0 planning",
      buttonText: "Update Product",
      color: "bg-purple-100 text-purple-600",
      href: "/workspace",
    },
  ]

  const recentProjects = [
    { name: "TaskFlow SaaS", updated: "2 hours ago", status: "Active" },
    { name: "E-commerce Mobile App", updated: "1 day ago", status: "Draft" },
    { name: "API Documentation", updated: "3 days ago", status: "Complete" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded"></div>
              <span className="font-bold gradient-text">ProVibe</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Sarah Chen</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-slate-900 font-medium">New Project</span>
        </div>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Start Your Next Project</h1>
          <p className="text-xl text-slate-600">Choose how you'd like to begin building your product documentation</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {creationOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <Card
                    key={option.id}
                    className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
                  >
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${option.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">{option.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-slate-600 mb-4">{option.description}</p>
                      <div className="mb-6">
                        <p className="text-sm text-slate-500 mb-2">Use cases:</p>
                        <p className="text-sm text-slate-700">{option.useCases}</p>
                      </div>
                      <Link href={option.href}>
                        <Button className="w-full group-hover:bg-indigo-600 transition-colors">
                          {option.buttonText}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Getting Started Tips */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Start with your core idea or existing materials</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Chat with AI to build comprehensive context</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Generate docs and export to your favorite tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Popular Templates */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Popular Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-sm">SaaS Platform</span>
                    <Badge variant="secondary" className="text-xs">
                      PRD
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">Mobile App</span>
                    <Badge variant="secondary" className="text-xs">
                      Spec
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-sm">API Service</span>
                    <Badge variant="secondary" className="text-xs">
                      Docs
                    </Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {recentProjects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                        <Folder className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{project.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span>{project.updated}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          project.status === "Active"
                            ? "default"
                            : project.status === "Complete"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
