import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { ChatService } from "@/lib/supabase/chat"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, projectId, userId } = await req.json()

    // Save user message to database
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "user") {
        await ChatService.saveMessage({
          project_id: projectId,
          user_id: userId,
          content: lastMessage.content,
          role: "user",
        })
      }
    }

    const result = streamText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are ProVibe AI, an expert product development assistant. You help users build better products by providing insights, suggestions, and guidance throughout the development process. Be helpful, concise, and actionable in your responses.`,
        },
        ...messages,
      ],
      onFinish: async (result) => {
        // Save AI response to database
        await ChatService.saveMessage({
          project_id: projectId,
          user_id: userId,
          content: result.text,
          role: "assistant",
        })
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
