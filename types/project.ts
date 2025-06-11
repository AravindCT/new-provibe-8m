export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "draft" | "complete" | "archived" | "paused"
  lastUpdated: string
  documentsCount: number
  collaborators: number
  progress: number
  type: "saas" | "mobile" | "api" | "ecommerce" | "other"
  starred: boolean
  createdAt: string
  owner: string
  tags: string[]
  lastActivity: Activity[]
}

export interface Activity {
  id: string
  type: "document_generated" | "export_completed" | "source_added" | "team_invite" | "project_created"
  project: string
  item: string
  time: string
  user?: string
}

export interface UserStats {
  totalProjects: number
  documentsGenerated: number
  exportsThisMonth: number
  teamMembers: number
  storageUsed: number
  storageLimit: number
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
