"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star, Edit, ExternalLink, Archive, Trash2, FileText, Users, Clock } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
  onToggleStar: (projectId: string) => void
  onArchive: (projectId: string) => void
  onDelete: (projectId: string) => void
}

export function ProjectCard({ project, onToggleStar, onArchive, onDelete }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "complete":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-orange-100 text-orange-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "saas":
        return "💼"
      case "mobile":
        return "📱"
      case "api":
        return "🔌"
      case "ecommerce":
        return "🛒"
      default:
        return "📁"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getTypeIcon(project.type)}</span>
            <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleStar(project.id)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Star className={`h-4 w-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <Link href={`/projects/${project.id}/workspace`}>
                  <DropdownMenuItem>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Workspace
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onArchive(project.id)}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Status and Progress */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            <span className="text-sm text-gray-600">{project.progress}%</span>
          </div>

          {/* Progress Bar */}
          <Progress value={project.progress} className="h-2" />

          {/* Project Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>{project.documentsCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{project.collaborators}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{project.lastUpdated}</span>
            </div>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <Link href={`/projects/${project.id}/workspace`}>
            <Button className="w-full mt-4">
              Open Project
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
