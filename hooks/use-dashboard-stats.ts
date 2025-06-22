"use client"

import { useState, useEffect } from "react"
import { ProjectService } from "@/lib/supabase/projects"

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalDocuments: number
}

export function useDashboardStats(userId: string) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalDocuments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      loadStats()
    } else {
      setLoading(false)
      setError("User ID is required")
    }
  }, [userId])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ProjectService.getProjectStats(userId)
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats")
      console.error("Error loading dashboard stats:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  }
}
