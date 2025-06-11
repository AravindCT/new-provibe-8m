import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Github, FileText, Zap, Users } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "New Project",
      description: "Start from scratch or use a template",
      icon: <Plus className="h-5 w-5" />,
      href: "/projects/new",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      title: "Import from GitHub",
      description: "Analyze existing repository",
      icon: <Github className="h-5 w-5" />,
      href: "/projects/new?source=github",
      color: "bg-gray-800 hover:bg-gray-900",
    },
    {
      title: "Upload Files",
      description: "Import documents and specs",
      icon: <Upload className="h-5 w-5" />,
      href: "/projects/new?source=upload",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Browse Templates",
      description: "Use pre-built project templates",
      icon: <FileText className="h-5 w-5" />,
      href: "/templates",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "AI Assistant",
      description: "Get help with your projects",
      icon: <Zap className="h-5 w-5" />,
      href: "/help?tab=ai",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      title: "Invite Team",
      description: "Collaborate with your team",
      icon: <Users className="h-5 w-5" />,
      href: "/settings/team",
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button variant="outline" className="w-full justify-start h-auto p-4 hover:shadow-md transition-shadow">
                <div className={`p-2 rounded-lg text-white mr-3 ${action.color}`}>{action.icon}</div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
