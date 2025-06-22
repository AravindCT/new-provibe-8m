"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/lib/supabase/types"

type Activity = Database["public"]["Tables"]["activity_logs"]["Row"]

// Mock activity data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440601",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    project_id: "550e8400-e29b-41d4-a716-446655440201",
    action: "document_generated",
    description: "Generated AI-powered PRD for TaskFlow Pro",
    metadata: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440602",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    project_id: "550e8400-e29b-41d4-a716-446655440202",
    action: "project_created",
    description: "Created FinanceAI project with target audience analysis",
    metadata: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440603",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    project_id: "550e8400-e29b-41d4-a716-446655440203",
    action: "compliance_review",
    description: "Completed HIPAA compliance review for MedConnect",
    metadata: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
]

export function useActivity(userId: string) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      loadActivities()
    } else {
      setLoading(false)
      setError("User ID is required")
    }
  }, [userId])

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.log("Using mock activity data")
        setActivities(MOCK_ACTIVITIES.filter((a) => a.user_id === userId))
        return
      }

      try {
        const { supabase } = await import("@/lib/supabase/client")

        const { data, error } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) {
          console.error("Error fetching activities:", error)
          setActivities(MOCK_ACTIVITIES.filter((a) => a.user_id === userId))
          return
        }

        setActivities(data || [])
      } catch (supabaseError) {
        console.error("Failed to load Supabase:", supabaseError)
        setActivities(MOCK_ACTIVITIES.filter((a) => a.user_id === userId))
      }
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
