"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActivityService } from "@/lib/supabase/activity"
import type { Database } from "@/lib/supabase/types"
import { FileText, GitBranch, CheckCircle, Plus, Edit, Star } from "lucide-react"

type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"] & {
  project?: { name: string } | null
}

interface ActivityFeedProps {
  userId: string
}

export function ActivityFeed({ userId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivities()
  }, [userId])

  const loadActivities = async () => {
    try {
      const data = await ActivityService.getRecentActivity(userId)
      setActivities(data)
    } catch (error) {
      console.error("Failed to load activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "document_created":
        return <FileText className="h-4 w-4" />
      case "project_created":
        return <Plus className="h-4 w-4" />
      case "project_updated":
        return <Edit className="h-4 w-4" />
      case "project_completed":
        return <CheckCircle className="h-4 w-4" />
      case "source_connected":
        return <GitBranch className="h-4 w-4" />
      case "document_reviewed":
        return <Star className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActivityColor = (action: string) => {
    switch (action) {
      case "document_created":
        return "bg-blue-100 text-blue-600"
      case "project_created":
        return "bg-green-100 text-green-600"
      case "project_updated":
        return "bg-yellow-100 text-yellow-600"
      case "project_completed":
        return "bg-purple-100 text-purple-600"
      case "source_connected":
        return "bg-indigo-100 text-indigo-600"
      case "document_reviewed":
        return "bg-orange-100 text-orange-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.action)}`}
                >
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {activity.project && (
                      <Badge variant="outline" className="text-xs">
                        {activity.project.name}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">{formatTimeAgo(activity.created_at || "")}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
