"use client"

import { useState, useEffect } from "react"
import { ProjectService } from "@/lib/supabase/projects"
import type { Database } from "@/lib/supabase/types"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

export function useProjects(userId?: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load projects on mount
  useEffect(() => {
    loadProjects()
  }, [userId])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Loading projects with userId:", userId)

      // Fetch projects - if no userId, get all projects
      const data = await ProjectService.getProjects(userId)

      console.log("📦 Loaded projects:", data.length)
      setProjects(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load projects"
      setError(errorMessage)
      console.error("❌ Error loading projects:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadAllProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Loading ALL projects")

      const data = await ProjectService.getAllProjects()

      console.log("📦 Loaded all projects:", data.length)
      setProjects(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load projects"
      setError(errorMessage)
      console.error("❌ Error loading all projects:", err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: {
    name: string
    description: string
    type: string
    status?: string
  }) => {
    try {
      const newProject = await ProjectService.createProject({
        ...projectData,
        owner_id: userId || "550e8400-e29b-41d4-a716-446655440001",
        progress: 0,
        starred: false,
        tags: [],
        collaborators: 1,
        documents_count: 0,
        last_updated: "just now",
      })
      setProjects((prev) => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
      throw err
    }
  }

  const updateProject = async (projectId: string, updates: ProjectUpdate) => {
    try {
      const updatedProject = await ProjectService.updateProject(projectId, updates, userId)
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)))
      return updatedProject
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project")
      throw err
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId, userId)
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project")
      throw err
    }
  }

  const toggleStar = async (projectId: string, starred: boolean) => {
    try {
      const updatedProject = await ProjectService.toggleStar(projectId, starred, userId)
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)))
      return updatedProject
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project")
      throw err
    }
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    toggleStar,
    refetch: loadProjects,
    loadAllProjects, // New method to load all projects
  }
}
