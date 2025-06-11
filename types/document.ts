export interface Document {
  id: string
  title: string
  content: string
  type: "prd" | "spec" | "user-story" | "api-doc" | "design-doc" | "other"
  status: "draft" | "review" | "approved" | "published"
  projectId: string
  authorId: string
  createdAt: string
  updatedAt: string
  version: number
  tags: string[]
  collaborators: string[]
  template?: string
  metadata: {
    wordCount: number
    readTime: number
    lastEditedBy: string
  }
}

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  type: string
  content: string
  category: string
  isPublic: boolean
  authorId: string
  usageCount: number
  createdAt: string
}
