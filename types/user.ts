export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
  settings: {
    notifications: {
      email: boolean
      push: boolean
      mentions: boolean
      updates: boolean
    }
    privacy: {
      profileVisible: boolean
      activityVisible: boolean
    }
    preferences: {
      theme: "light" | "dark" | "system"
      language: string
      timezone: string
    }
  }
}

export interface Team {
  id: string
  name: string
  members: TeamMember[]
  plan: "free" | "pro" | "enterprise"
  createdAt: string
}

export interface TeamMember {
  id: string
  userId: string
  role: "owner" | "admin" | "member" | "viewer"
  joinedAt: string
  user: User
}
