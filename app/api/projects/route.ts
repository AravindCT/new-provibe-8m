import { type NextRequest, NextResponse } from "next/server"
import { ProjectService } from "@/lib/supabase/projects"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const projects = await ProjectService.getProjects(userId)
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Projects API error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const project = await ProjectService.createProject(body)
    return NextResponse.json(project)
  } catch (error) {
    console.error("Create project API error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
