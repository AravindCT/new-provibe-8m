export interface Integration {
  id: string
  name: string
  type: "notion" | "github" | "linear" | "figma" | "slack" | "discord"
  status: "connected" | "disconnected" | "error"
  config: Record<string, any>
  lastSync?: string
  createdAt: string
}

export interface ExportConfig {
  destination: string
  format: "markdown" | "pdf" | "docx" | "html"
  includeImages: boolean
  includeComments: boolean
  template?: string
}

export interface ExportHistory {
  id: string
  projectId: string
  documentIds: string[]
  destination: string
  status: "pending" | "processing" | "completed" | "failed"
  config: ExportConfig
  createdAt: string
  completedAt?: string
  error?: string
}
