import { supabase } from "./client"
import type { Database } from "./types"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

export class ProjectService {
  static async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`)
    }

    return data || []
  }

  static async getProject(id: string, userId: string): Promise<Project | null> {
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).eq("owner_id", userId).single()

    if (error) {
      if (error.code === "PGRST116") {
        return null // Project not found
      }
      throw new Error(`Failed to fetch project: ${error.message}`)
    }

    return data
  }

  static async createProject(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        lastUpdated: "just now",
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return data
  }

  static async updateProject(id: string, updates: ProjectUpdate, userId: string): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        lastUpdated: "just now",
      })
      .eq("id", id)
      .eq("owner_id", userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`)
    }

    return data
  }

  static async deleteProject(id: string, userId: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id).eq("owner_id", userId)

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  }

  static async toggleStar(id: string, starred: boolean, userId: string): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update({ starred, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("owner_id", userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`)
    }

    return data
  }

  static async getProjectStats(userId: string) {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("status, documents_count")
      .eq("owner_id", userId)

    if (error) {
      throw new Error(`Failed to fetch project stats: ${error.message}`)
    }

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === "active").length,
      completedProjects: projects.filter((p) => p.status === "complete").length,
      totalDocuments: projects.reduce((sum, p) => sum + (p.documents_count || 0), 0),
    }

    return stats
  }
}
