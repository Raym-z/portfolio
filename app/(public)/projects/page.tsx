import type { Metadata } from "next";
import { FolderGit2 } from "lucide-react";
import Link from "next/link";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { getPublishedProjects } from "@/lib/services/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of products, tools, and experiments built with modern web technologies.",
};

export default async function ProjectsPage() {
  let projects = [] as Awaited<ReturnType<typeof getPublishedProjects>>;
  let error: string | null = null;

  try {
    projects = await getPublishedProjects();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Could not load projects.";
  }

  return (
    <div className="section-shell pb-20 pt-28 sm:pt-32">
      <Reveal>
        <SectionHeading
          eyebrow="Archive"
          title={
            <>
              All <span className="text-gradient">projects</span>
            </>
          }
          description="Every published project, from production applications to internal tools and experiments. Filter by the technologies you care about."
        />
      </Reveal>

      <div className="mt-10">
        {error ? (
          <ErrorState
            title="Projects are temporarily unavailable"
            description={error}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No projects published yet"
            description="Once projects are published from the admin dashboard, they will show up here."
          />
        ) : (
          <ProjectExplorer projects={projects} />
        )}
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Have a project in mind?
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            I&apos;m always interested in thoughtful products and teams.
          </p>
        </div>
        <ButtonLink href="/#contact" size="md">
          Start a conversation
        </ButtonLink>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-gray-500 transition hover:text-white"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
