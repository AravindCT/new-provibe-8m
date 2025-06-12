"use client"

import { useState, useEffect } from "react"
import { ActivityService } from "@/lib/supabase/activity"
import type { Database } from "@/lib/supabase/types"

type Activity = Database["public"]["Tables"]["activity_logs"]["Row"]

export function useActivity(userId?: string) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load activities on mount, but only if userId is provided
  useEffect(() => {
    if (userId) {
      loadActivities()
    } else {
      setLoading(false)
      setError("User ID is required")
    }
  }, [userId])

  const loadActivities = async () => {
    if (!userId) {
      setError("User ID is required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await ActivityService.getUserActivities(userId)
      setActivities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load activities")
      console.error("Error loading activities:", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    activities,
    loading,
    error,
    refetch: loadActivities,
  }
}
