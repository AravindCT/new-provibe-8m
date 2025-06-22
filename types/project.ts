export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "draft" | "complete" | "archived" | "paused"
  type: "saas" | "mobile" | "api" | "ecommerce" | "other"
  progress: number
  owner_id: string
  starred: boolean
  tags: string[]
  collaborators: number
  documents_count: number
  target_audience: string | null
  market_size: string | null
  business_model: string | null
  key_features: string[] | null
  tech_stack: string[] | null
  timeline: string | null
  budget_range: string | null
  created_at: string
  updated_at: string
  last_updated: string
}

export interface Activity {
  id: string
  user_id: string
  project_id: string
  action: string
  description: string
  metadata?: any
  created_at: string
}

export interface UserStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalDocuments: number
}

export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}
