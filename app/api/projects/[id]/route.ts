import { type NextRequest, NextResponse } from "next/server"
import { ProjectService } from "@/lib/supabase/projects"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const project = await ProjectService.getProject(params.id, userId)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Project API error:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const project = await ProjectService.updateProject(params.id, updates, userId)
    return NextResponse.json(project)
  } catch (error) {
    console.error("Update project API error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await ProjectService.deleteProject(params.id, userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete project API error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
