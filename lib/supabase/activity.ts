import { supabase } from "./client"
import type { Database } from "./types"

type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"]

export class ActivityService {
  static async getRecentActivity(userId: string, limit = 10): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select(`
        *,
        project:projects(name)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch activity: ${error.message}`)
    }

    return data || []
  }

  static async logActivity(activity: {
    user_id: string
    project_id?: string
    action: string
    description: string
    metadata?: any
  }) {
    const { error } = await supabase.from("activity_logs").insert({
      ...activity,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Failed to log activity:", error)
    }
  }
}
