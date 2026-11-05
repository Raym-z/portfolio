import { Suspense } from "react";
import { connection } from "next/server";
import { AdminLoading } from "@/components/admin/admin-loading";
import { ProjectManager } from "@/components/admin/project-manager";
import { ErrorState } from "@/components/ui/states";
import { getAdminProjects } from "@/lib/services/projects";

async function ProjectsContent() {
  await connection();

  let projects: Awaited<ReturnType<typeof getAdminProjects>> = [];
  let error: string | null = null;

  try {
    projects = await getAdminProjects();
  } catch (cause) {
    error =
      cause instanceof Error
        ? cause.message
        : "Check your Supabase connection and RLS policies.";
  }

  if (error) {
    return <ErrorState title="Could not load projects" description={error} />;
  }

  return <ProjectManager projects={projects} />;
}

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <ProjectsContent />
    </Suspense>
  );
}
