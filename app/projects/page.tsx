"use client"

import { getMockUser } from "@/lib/auth"
import { useProjects } from "@/lib/hooks/use-projects"
import ProjectCard from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ProjectForm from "@/components/project-form"
import { Plus } from "lucide-react"

export default function ProjectsPage() {
  // Use mock user for now - replace with real auth later
  const mockUser = getMockUser()
  const userId = mockUser.id

  const { projects, loading, error, createProject, toggleStar } = useProjects(userId)

  const [showForm, setShowForm] = useState(false)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {showForm && (
        <ProjectForm
          onCreate={async (projectData) => {
            await createProject(projectData)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} toggleStar={() => toggleStar(project.id)} />
        ))}
      </div>
    </div>
  )
}
