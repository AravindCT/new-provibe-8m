"use client"

import React from "react"
import { useState, useEffect, useCallback } from "react"
import { useChat as useVercelChat } from "ai/react"
import { ChatService } from "@/lib/supabase/chat"
import type { Database } from "@/lib/supabase/types"

type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"]

export function useChat(projectId: string, userId: string) {
  const [dbMessages, setDbMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Use Vercel AI SDK for chat functionality
  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading: aiLoading,
    error: aiError,
  } = useVercelChat({
    api: "/api/chat",
    body: {
      projectId,
      userId,
    },
    onFinish: async (message) => {
      // Save AI response to database
      try {
        await ChatService.saveMessage({
          project_id: projectId,
          user_id: null, // AI messages don't have a user_id
          content: message.content,
          role: "assistant",
        })
        // Reload messages to get the latest from database
        loadMessages()
      } catch (err) {
        console.error("Failed to save AI message:", err)
      }
    },
  })

  // Load existing messages from database
  const loadMessages = useCallback(async () => {
    if (!projectId) return

    try {
      setLoading(true)
      setError(null)
      const messages = await ChatService.getMessages(projectId)
      setDbMessages(messages)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load messages"))
      console.error("Error loading messages:", err)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  // Load messages on mount
  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!projectId) return

    let subscription: any = null

    const setupSubscription = async () => {
      try {
        subscription = await ChatService.subscribeToMessages(projectId, (newMessage) => {
          setDbMessages((prev) => {
            // Avoid duplicates
            const exists = prev.some((msg) => msg.id === newMessage.id)
            if (exists) return prev
            return [...prev, newMessage]
          })
        })
      } catch (err) {
        console.error("Failed to setup subscription:", err)
      }
    }

    setupSubscription()

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe()
      }
    }
  }, [projectId])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!input.trim()) return

      try {
        // Save user message to database first
        await ChatService.saveMessage({
          project_id: projectId,
          user_id: userId,
          content: input,
          role: "user",
        })

        // Let Vercel AI handle the submission
        originalHandleSubmit(e)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to send message"))
        console.error("Error sending message:", err)
      }
    },
    [input, projectId, userId, originalHandleSubmit],
  )

  // Combine and deduplicate messages for display
  const allMessages = React.useMemo(() => {
    const messageMap = new Map()

    // Add database messages
    dbMessages.forEach((msg) => {
      messageMap.set(msg.id, {
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        createdAt: new Date(msg.created_at),
      })
    })

    // Add AI messages that aren't already in database
    aiMessages.forEach((msg) => {
      if (!messageMap.has(msg.id)) {
        messageMap.set(msg.id, {
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt || new Date(),
        })
      }
    })

    return Array.from(messageMap.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }, [dbMessages, aiMessages])

  return {
    messages: allMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: loading || aiLoading,
    error: error || aiError,
    refetch: loadMessages,
  }
}
