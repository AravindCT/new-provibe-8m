import { supabase } from "./client"
import type { Database } from "./types"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

// Mock data for when Supabase is not configured
const MOCK_PROJECTS: Project[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440201",
    name: "TaskFlow Pro",
    description: "Enterprise project management platform with AI-powered insights and team collaboration features",
    status: "active",
    type: "saas",
    progress: 75,
    target_audience: "Enterprise teams and project managers",
    market_size: "TAM: $45B, SAM: $12B, SOM: $800M",
    business_model: "SaaS subscription with tiered pricing",
    key_features: ["AI insights", "Team collaboration", "Project tracking"],
    tech_stack: ["React", "Node.js", "PostgreSQL"],
    timeline: "12 months",
    budget_range: "$500K",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    owner_id: "550e8400-e29b-41d4-a716-446655440001",
    starred: true,
    tags: ["enterprise", "productivity", "ai"],
    collaborators: 8,
    documents_count: 12,
    last_updated: "2 hours ago",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440202",
    name: "FinanceAI",
    description: "Personal wealth management assistant for millennials with AI-driven investment recommendations",
    status: "active",
    type: "mobile",
    progress: 60,
    target_audience: "Millennials aged 25-40 with disposable income",
    market_size: "TAM: $28B, SAM: $8B, SOM: $400M",
    business_model: "Freemium with premium AI features",
    key_features: ["AI recommendations", "Portfolio tracking", "Goal setting"],
    tech_stack: ["React Native", "Python", "TensorFlow"],
    timeline: "8 months",
    budget_range: "$300K",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-18T16:45:00Z",
    owner_id: "550e8400-e29b-41d4-a716-446655440001",
    starred: false,
    tags: ["fintech", "ai", "mobile"],
    collaborators: 5,
    documents_count: 8,
    last_updated: "1 day ago",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440203",
    name: "MedConnect",
    description: "HIPAA-compliant telemedicine platform connecting patients with healthcare providers",
    status: "active",
    type: "saas",
    progress: 45,
    target_audience: "Healthcare providers and patients",
    market_size: "TAM: $55B, SAM: $15B, SOM: $1.2B",
    business_model: "B2B SaaS with per-provider licensing",
    key_features: ["Video consultations", "HIPAA compliance", "Patient records"],
    tech_stack: ["Vue.js", "Node.js", "MongoDB"],
    timeline: "18 months",
    budget_range: "$750K",
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-19T11:20:00Z",
    owner_id: "550e8400-e29b-41d4-a716-446655440001",
    starred: true,
    tags: ["healthcare", "telemedicine", "compliance"],
    collaborators: 12,
    documents_count: 15,
    last_updated: "3 hours ago",
  },
]

// UUID validation helper
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseAnonKey)
}

export class ProjectService {
  static async getProjects(userId?: string): Promise<Project[]> {
    console.log("🔍 Fetching projects for user:", userId)

    if (!isSupabaseConfigured()) {
      console.log("📝 Using mock projects data (Supabase not configured)")
      return MOCK_PROJECTS
    }

    try {
      // If no userId provided, fetch all projects (for debugging)
      let query = supabase.from("projects").select("*").order("updated_at", { ascending: false })

      if (userId && isValidUUID(userId)) {
        query = query.eq("owner_id", userId)
        console.log("🔍 Filtering by owner_id:", userId)
      } else {
        console.log("⚠️ No valid userId provided, fetching all projects")
      }

      const { data, error } = await query

      if (error) {
        console.error("❌ Error fetching projects:", error)
        return MOCK_PROJECTS
      }

      console.log("✅ Successfully fetched projects:", data?.length || 0)
      console.log("📊 Projects data:", data)

      return data || []
    } catch (error) {
      console.error("💥 Failed to fetch projects:", error)
      return MOCK_PROJECTS
    }
  }

  static async getAllProjects(): Promise<Project[]> {
    console.log("🔍 Fetching ALL projects from database")

    if (!isSupabaseConfigured()) {
      console.log("📝 Using mock projects data (Supabase not configured)")
      return MOCK_PROJECTS
    }

    try {
      const { data, error } = await supabase.from("projects").select("*").order("updated_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching all projects:", error)
        return MOCK_PROJECTS
      }

      console.log("✅ Successfully fetched all projects:", data?.length || 0)
      console.log("📊 All projects data:", data)

      return data || []
    } catch (error) {
      console.error("💥 Failed to fetch all projects:", error)
      return MOCK_PROJECTS
    }
  }

  static async getProject(id: string, userId?: string): Promise<Project | null> {
    if (!id || !isValidUUID(id)) {
      throw new Error("Valid project ID is required")
    }

    if (!isSupabaseConfigured()) {
      return MOCK_PROJECTS.find((p) => p.id === id) || null
    }

    try {
      let query = supabase.from("projects").select("*").eq("id", id)

      if (userId && isValidUUID(userId)) {
        query = query.eq("owner_id", userId)
      }

      const { data, error } = await query.single()

      if (error) {
        if (error.code === "PGRST116") {
          return null // Project not found
        }
        console.error("Error fetching project:", error)
        return MOCK_PROJECTS.find((p) => p.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Failed to fetch project:", error)
      return MOCK_PROJECTS.find((p) => p.id === id) || null
    }
  }

  static async createProject(project: ProjectInsert): Promise<Project> {
    if (!isSupabaseConfigured()) {
      const newProject: Project = {
        ...project,
        id: `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_updated: "just now",
        documents_count: 0,
        starred: false,
        collaborators: 1,
        progress: 0,
      } as Project

      MOCK_PROJECTS.unshift(newProject)
      return newProject
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_updated: "just now",
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create project: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Failed to create project:", error)
      throw error
    }
  }

  static async updateProject(id: string, updates: ProjectUpdate, userId?: string): Promise<Project> {
    if (!id || !isValidUUID(id)) {
      throw new Error("Valid project ID is required")
    }

    if (!isSupabaseConfigured()) {
      const projectIndex = MOCK_PROJECTS.findIndex((p) => p.id === id)
      if (projectIndex === -1) {
        throw new Error("Project not found")
      }

      MOCK_PROJECTS[projectIndex] = {
        ...MOCK_PROJECTS[projectIndex],
        ...updates,
        updated_at: new Date().toISOString(),
        last_updated: "just now",
      }

      return MOCK_PROJECTS[projectIndex]
    }

    try {
      let query = supabase
        .from("projects")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          last_updated: "just now",
        })
        .eq("id", id)

      if (userId && isValidUUID(userId)) {
        query = query.eq("owner_id", userId)
      }

      const { data, error } = await query.select().single()

      if (error) {
        throw new Error(`Failed to update project: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Failed to update project:", error)
      throw error
    }
  }

  static async deleteProject(id: string, userId?: string): Promise<void> {
    if (!id || !isValidUUID(id)) {
      throw new Error("Valid project ID is required")
    }

    if (!isSupabaseConfigured()) {
      const projectIndex = MOCK_PROJECTS.findIndex((p) => p.id === id)
      if (projectIndex !== -1) {
        MOCK_PROJECTS.splice(projectIndex, 1)
      }
      return
    }

    try {
      let query = supabase.from("projects").delete().eq("id", id)

      if (userId && isValidUUID(userId)) {
        query = query.eq("owner_id", userId)
      }

      const { error } = await query

      if (error) {
        throw new Error(`Failed to delete project: ${error.message}`)
      }
    } catch (error) {
      console.error("Failed to delete project:", error)
      throw error
    }
  }

  static async toggleStar(id: string, starred: boolean, userId?: string): Promise<Project> {
    if (!id || !isValidUUID(id)) {
      throw new Error("Valid project ID is required")
    }

    if (!isSupabaseConfigured()) {
      const projectIndex = MOCK_PROJECTS.findIndex((p) => p.id === id)
      if (projectIndex === -1) {
        throw new Error("Project not found")
      }

      MOCK_PROJECTS[projectIndex] = {
        ...MOCK_PROJECTS[projectIndex],
        starred,
        updated_at: new Date().toISOString(),
        last_updated: "just now",
      }

      return MOCK_PROJECTS[projectIndex]
    }

    try {
      let query = supabase.from("projects").update({ starred, updated_at: new Date().toISOString() }).eq("id", id)

      if (userId && isValidUUID(userId)) {
        query = query.eq("owner_id", userId)
      }

      const { data, error } = await query.select().single()

      if (error) {
        throw new Error(`Failed to update project: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Failed to update project:", error)
      throw error
    }
  }

  static async getProjectStats(userId?: string) {
    console.log("📊 Fetching project stats for user:", userId)

    if (!isSupabaseConfigured()) {
      const userProjects = userId ? MOCK_PROJECTS.filter((p) => p.owner_id === userId) : MOCK_PROJECTS
      return {
        totalProjects: userProjects.length,
        activeProjects: userProjects.filter((p) => p.status === "active").length,
        completedProjects: userProjects.filter((p) => p.status === "complete").length,
        totalDocuments: userProjects.reduce((sum, p) => sum + (p.documents_count || 0), 0),
      }
    }

    try {
      let query = supabase.from("projects").select("status, documents_count")

      if (userId && isValidUUID(userId)) {
        query = query.eq("owner_id", userId)
      }

      const { data: projects, error } = await query

      if (error) {
        console.error("Error fetching project stats:", error)
        const userProjects = userId ? MOCK_PROJECTS.filter((p) => p.owner_id === userId) : MOCK_PROJECTS
        return {
          totalProjects: userProjects.length,
          activeProjects: userProjects.filter((p) => p.status === "active").length,
          completedProjects: userProjects.filter((p) => p.status === "complete").length,
          totalDocuments: userProjects.reduce((sum, p) => sum + (p.documents_count || 0), 0),
        }
      }

      console.log("✅ Project stats fetched:", projects?.length || 0, "projects")

      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "active").length,
        completedProjects: projects.filter((p) => p.status === "complete").length,
        totalDocuments: projects.reduce((sum, p) => sum + (p.documents_count || 0), 0),
      }

      return stats
    } catch (error) {
      console.error("Failed to fetch project stats:", error)
      const userProjects = userId ? MOCK_PROJECTS.filter((p) => p.owner_id === userId) : MOCK_PROJECTS
      return {
        totalProjects: userProjects.length,
        activeProjects: userProjects.filter((p) => p.status === "active").length,
        completedProjects: userProjects.filter((p) => p.status === "complete").length,
        totalDocuments: userProjects.reduce((sum, p) => sum + (p.documents_count || 0), 0),
      }
    }
  }
}
