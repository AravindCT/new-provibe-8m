import { supabase } from "./client"
import type { Database } from "./types"

type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"]
type ChatMessageInsert = Database["public"]["Tables"]["chat_messages"]["Insert"]

export class ChatService {
  static async getMessages(projectId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(`Failed to fetch messages: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error("Error in getMessages:", error)
      // Return empty array instead of throwing to prevent app crashes
      return []
    }
  }

  static async saveMessage(message: ChatMessageInsert): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          ...message,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(`Failed to save message: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Error in saveMessage:", error)
      return null
    }
  }

  static async subscribeToMessages(projectId: string, callback: (message: ChatMessage) => void) {
    try {
      const channel = supabase
        .channel(`chat:${projectId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `project_id=eq.${projectId}`,
          },
          (payload) => {
            if (payload.new) {
              callback(payload.new as ChatMessage)
            }
          },
        )
        .subscribe()

      return channel
    } catch (error) {
      console.error("Error setting up subscription:", error)
      return null
    }
  }
}
