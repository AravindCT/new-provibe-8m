export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string
  plan: string
  company: string
  role: string
  created_at: string
  updated_at: string
}

export function getMockUser(): User {
  return {
    id: "550e8400-e29b-41d4-a716-446655440001", // Updated to match database
    email: "sarah.chen@techcorp.com",
    full_name: "Sarah Chen",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    plan: "pro",
    company: "TechCorp Inc.",
    role: "Senior Product Manager",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
