"use client"

import { getMockUser } from "@/lib/auth"
import { useProjects } from "@/lib/hooks/use-projects"
import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats"
import { useActivity } from "@/lib/hooks/use-activity"
import { Skeleton } from "@/components/ui/skeleton"
import ProjectCard from "@/components/project-card"
import { Activity } from "@/components/activity"
import { StatsCard } from "@/components/stats-card"

export default function DashboardPage() {
  // Use mock user for now - replace with real auth later
  const mockUser = getMockUser()
  const userId = mockUser.id

  const { projects, loading: projectsLoading, error: projectsError } = useProjects(userId)
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats(userId)
  const { activities, loading: activitiesLoading, error: activitiesError } = useActivity(userId)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatsCard
          title="Total Projects"
          value={statsLoading ? <Skeleton width={50} /> : stats?.totalProjects || 0}
          isLoading={statsLoading}
          error={statsError}
        />
        <StatsCard
          title="Completed Projects"
          value={statsLoading ? <Skeleton width={50} /> : stats?.completedProjects || 0}
          isLoading={statsLoading}
          error={statsError}
        />
        <StatsCard
          title="Active Projects"
          value={statsLoading ? <Skeleton width={50} /> : stats?.activeProjects || 0}
          isLoading={statsLoading}
          error={statsError}
        />
      </div>

      <h2 className="text-xl font-bold mb-4">Projects</h2>
      {projectsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-md p-4">
              <Skeleton className="h-40 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : projectsError ? (
        <p className="text-red-500">Error loading projects.</p>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p>No projects found.</p>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Recent Activity</h2>
      {activitiesLoading ? (
        <div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 py-2 border-b">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-0.5">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : activitiesError ? (
        <p className="text-red-500">Error loading activity.</p>
      ) : activities && activities.length > 0 ? (
        <div>
          {activities.map((activity) => (
            <Activity key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <p>No recent activity.</p>
      )}
    </div>
  )
}
