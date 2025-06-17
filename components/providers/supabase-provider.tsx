"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

// Mock user for development when Supabase is not configured
const MOCK_USER = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  email: "sarah.chen@techcorp.com",
  user_metadata: {
    full_name: "Sarah Chen",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
} as User

interface SupabaseContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  isSupabaseConfigured: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  isSupabaseConfigured: false,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase not configured, using mock user for development")
      setUser(MOCK_USER)
      setLoading(false)
      setIsSupabaseConfigured(false)
      return
    }

    setIsSupabaseConfigured(true)

    // Only import and use Supabase if properly configured
    const initializeSupabase = async () => {
      try {
        const { supabase } = await import("@/lib/supabase/client")

        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? MOCK_USER) // Use mock user if no session
        setLoading(false)

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? MOCK_USER)
          setLoading(false)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Failed to initialize Supabase:", error)
        setUser(MOCK_USER)
        setLoading(false)
      }
    }

    initializeSupabase()
  }, [])

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        const { supabase } = await import("@/lib/supabase/client")
        await supabase.auth.signOut()
      } catch (error) {
        console.error("Failed to sign out:", error)
      }
    }
    setUser(null)
  }

  return (
    <SupabaseContext.Provider value={{ user, loading, signOut, isSupabaseConfigured }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
