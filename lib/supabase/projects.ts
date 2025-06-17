import type { Project, ProjectStatus, ProjectType } from "@/types/project"

// Mock data for when Supabase is not configured
const MOCK_PROJECTS: Project[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440201",
    name: "TaskFlow Pro",
    description: "Enterprise project management platform with AI-powered insights and team collaboration features",
    status: "active" as ProjectStatus,
    type: "saas" as ProjectType,
    progress: 75,
    target_audience: "Enterprise teams and project managers",
    market_size: "TAM: $45B, SAM: $12B, SOM: $800M",
    business_model: "SaaS subscription with tiered pricing",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    is_starred: true,
    tags: ["enterprise", "productivity", "ai"],
    timeline: "12 months",
    budget: "$500K",
    team_size: 8,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440202",
    name: "FinanceAI",
    description: "Personal wealth management assistant for millennials with AI-driven investment recommendations",
    status: "active" as ProjectStatus,
    type: "mobile" as ProjectType,
    progress: 60,
    target_audience: "Millennials aged 25-40 with disposable income",
    market_size: "TAM: $28B, SAM: $8B, SOM: $400M",
    business_model: "Freemium with premium AI features",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-18T16:45:00Z",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    is_starred: false,
    tags: ["fintech", "ai", "mobile"],
    timeline: "8 months",
    budget: "$300K",
    team_size: 5,
  },
]

export async function getProjects(userId: string): Promise<Project[]> {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("Using mock projects data")
    return MOCK_PROJECTS
  }

  try {
    const { supabase } = await import("@/lib/supabase/client")

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return MOCK_PROJECTS
    }

    return data || MOCK_PROJECTS
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return MOCK_PROJECTS
  }
}

export async function getProject(id: string): Promise<Project | null> {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return MOCK_PROJECTS.find((p) => p.id === id) || null
  }

  try {
    const { supabase } = await import("@/lib/supabase/client")

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return MOCK_PROJECTS.find((p) => p.id === id) || null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch project:", error)
    return MOCK_PROJECTS.find((p) => p.id === id) || null
  }
}

export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const newProject: Project = {
      ...project,
      id: `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    MOCK_PROJECTS.unshift(newProject)
    return newProject
  }

  try {
    const { supabase } = await import("@/lib/supabase/client")

    const { data, error } = await supabase.from("projects").insert([project]).select().single()

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Failed to create project:", error)
    throw error
  }
}
