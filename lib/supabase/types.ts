export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: string
          company: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          company?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          company?: string | null
          role?: string | null
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
          progress: number | null
          owner_id: string
          starred: boolean
          tags: string[] | null
          collaborators: number | null
          documents_count: number | null
          target_audience: string | null
          market_size: string | null
          business_model: string | null
          key_features: string[] | null
          tech_stack: string[] | null
          timeline: string | null
          budget_range: string | null
          created_at: string
          updated_at: string
          last_updated: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          type?: string
          status?: string
          progress?: number | null
          owner_id: string
          starred?: boolean
          tags?: string[] | null
          collaborators?: number | null
          documents_count?: number | null
          target_audience?: string | null
          market_size?: string | null
          business_model?: string | null
          key_features?: string[] | null
          tech_stack?: string[] | null
          timeline?: string | null
          budget_range?: string | null
          created_at?: string
          updated_at?: string
          last_updated?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          status?: string
          progress?: number | null
          owner_id?: string
          starred?: boolean
          tags?: string[] | null
          collaborators?: number | null
          documents_count?: number | null
          target_audience?: string | null
          market_size?: string | null
          business_model?: string | null
          key_features?: string[] | null
          tech_stack?: string[] | null
          timeline?: string | null
          budget_range?: string | null
          created_at?: string
          updated_at?: string
          last_updated?: string | null
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
          author_id: string
          template_id: string | null
          ai_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content: string
          type?: string
          status?: string
          author_id: string
          template_id?: string | null
          ai_generated?: boolean
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
          author_id?: string
          template_id?: string | null
          ai_generated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          content: string
          author_id: string | null
          is_public: boolean
          usage_count: number
          rating: number
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          content: string
          author_id?: string | null
          is_public?: boolean
          usage_count?: number
          rating?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          content?: string
          author_id?: string | null
          is_public?: boolean
          usage_count?: number
          rating?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          project_id: string
          user_id: string
          content: string
          role: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          content: string
          role: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          content?: string
          role?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      project_sources: {
        Row: {
          id: string
          project_id: string
          name: string
          type: string
          url: string | null
          status: string
          metadata: Json | null
          last_sync: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: string
          url?: string | null
          status?: string
          metadata?: Json | null
          last_sync?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: string
          url?: string | null
          status?: string
          metadata?: Json | null
          last_sync?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          project_id: string
          action: string
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          action: string
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          action?: string
          description?: string
          metadata?: Json | null
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
