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

  // Load projects on mount, but only if userId is provided
  useEffect(() => {
    if (userId) {
      loadProjects()
    } else {
      setLoading(false)
      setError("User ID is required")
    }
  }, [userId])

  const loadProjects = async () => {
    if (!userId) {
      setError("User ID is required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await ProjectService.getProjects(userId)
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects")
      console.error("Error loading projects:", err)
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
    if (!userId) {
      throw new Error("User ID is required")
    }

    try {
      const newProject = await ProjectService.createProject({
        ...projectData,
        owner_id: userId,
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
    if (!userId) {
      throw new Error("User ID is required")
    }

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
    if (!userId) {
      throw new Error("User ID is required")
    }

    try {
      await ProjectService.deleteProject(projectId, userId)
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project")
      throw err
    }
  }

  const toggleStar = async (projectId: string, starred: boolean) => {
    if (!userId) {
      throw new Error("User ID is required")
    }

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
  }
}
