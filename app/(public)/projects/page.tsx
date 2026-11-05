import type { Metadata } from "next";
import { FolderGit2 } from "lucide-react";
import Link from "next/link";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { T } from "@/components/ui/translated-text";
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
          eyebrow={<T k="projects.archive.eyebrow" />}
          title={
            <>
              <T k="projects.archive.titleLead" /> <span className="text-gradient"><T k="projects.archive.titleHighlight" /></span>
            </>
          }
          description={<T k="projects.archive.description" />}
        />
      </Reveal>

      <div className="mt-10">
        {error ? (
          <ErrorState
            title={<T k="projects.errorTitle" />}
            description={error}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title={<T k="projects.emptyTitle" />}
            description={<T k="projects.emptyDescription" />}
          />
        ) : (
          <ProjectExplorer projects={projects} />
        )}
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-sm font-semibold text-white">
            <T k="projects.cta.title" />
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            <T k="projects.cta.description" />
          </p>
        </div>
        <ButtonLink href="/#contact" size="md">
          <T k="projects.cta.button" />
        </ButtonLink>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-gray-500 transition hover:text-white"
        >
          <T k="projects.backHome" />
        </Link>
      </div>
    </div>
  );
}
