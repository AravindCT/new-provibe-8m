export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          type: string
          status: string
          progress: number
          owner_id: string
          starred: boolean
          tags: string[]
          collaborators: number
          documents_count: number
          created_at: string
          updated_at: string
          lastUpdated: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: string
          status?: string
          progress?: number
          owner_id: string
          starred?: boolean
          tags?: string[]
          collaborators?: number
          documents_count?: number
          created_at?: string
          updated_at?: string
          lastUpdated?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          status?: string
          progress?: number
          owner_id?: string
          starred?: boolean
          tags?: string[]
          collaborators?: number
          documents_count?: number
          created_at?: string
          updated_at?: string
          lastUpdated?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          project_id: string
          user_id: string
          content: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          content: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          content?: string
          role?: string
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          type: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content: string
          type: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          type?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
