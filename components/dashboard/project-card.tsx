"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, MoreHorizontal, Calendar, Users, FileText, Target, DollarSign, Clock } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/lib/supabase/types"

type Project = Database["public"]["Tables"]["projects"]["Row"]

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
        return "bg-green-100 text-green-800 border-green-200"
      case "complete":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "archived":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(project.type)}</span>
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {project.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {project.type}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStar(project.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Star className={`h-4 w-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/projects/${project.id}/settings`} className="w-full">
                    Edit Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onArchive(project.id)}>Archive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium">{project.progress || 0}%</span>
          </div>
          <Progress value={project.progress || 0} className="h-2" />
        </div>

        {/* Target Audience */}
        {project.target_audience && (
          <div className="flex items-start space-x-2">
            <Target className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-700">Target Audience</p>
              <p className="text-xs text-slate-600 line-clamp-2">{project.target_audience}</p>
            </div>
          </div>
        )}

        {/* Market Size */}
        {project.market_size && (
          <div className="flex items-start space-x-2">
            <DollarSign className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-700">Market Size</p>
              <p className="text-xs text-slate-600 line-clamp-1">{project.market_size}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {project.timeline && (
          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-700">Timeline</p>
              <p className="text-xs text-slate-600">{project.timeline}</p>
            </div>
          </div>
        )}

        {/* Key Features */}
        {project.key_features && project.key_features.length > 0 && (
          <div>
            <p className="text-xs font-medium text-slate-700 mb-1">Key Features</p>
            <div className="flex flex-wrap gap-1">
              {project.key_features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {project.key_features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.key_features.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{project.collaborators || 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{project.documents_count || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{project.last_updated || "Never"}</span>
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Link href={`/projects/${project.id}/workspace`}>
          <Button className="w-full mt-4">Open Project</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
