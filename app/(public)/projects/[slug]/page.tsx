import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  ExternalLink,
  Layers3,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { ProjectDescription } from "@/components/projects/project-description";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/ui/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SafeImage } from "@/components/ui/safe-image";
import { T } from "@/components/ui/translated-text";
import { getProjectDescription } from "@/lib/utils/project-description";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/services/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: getProjectDescription(project, "en").slice(0, 160),
    openGraph: {
      title: project.title,
      description: getProjectDescription(project, "en").slice(0, 160),
      images: project.thumbnailUrl ? [project.thumbnailUrl] : undefined,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) notFound();

  const allProjects = await getPublishedProjects().catch(() => []);
  const related = allProjects
    .filter((item) => item.slug !== project.slug)
    .slice(0, 2);

  return (
    <div className="pb-20 pt-24 sm:pt-28">
      <div className="section-shell">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <T k="projects.detail.back" />
          </Link>
          <span className="text-gray-700">/</span>
          <Link href="/projects" className="transition hover:text-white">
            <T k="projects.detail.breadcrumb" />
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-700" />
          <span className="truncate text-gray-300">{project.title}</span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <Reveal>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <Badge key={tech} variant="indigo">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div>
                <h1 className="text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                <div className="mt-4 h-1 w-20 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-white/60" />
                </div>
              </div>

              <ProjectDescription
                project={project}
                className="text-sm leading-relaxed text-gray-400 sm:text-base"
              />

              <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/[0.06] p-4">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <Code2 className="h-4 w-4" />
                    <span className="text-xl font-semibold">
                      {project.techStack.length}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">
                    <T k="projects.detail.technologies" />
                  </p>
                </div>
                <div className="rounded-xl border border-purple-400/20 bg-purple-500/[0.06] p-4">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Layers3 className="h-4 w-4" />
                    <span className="text-xl font-semibold">
                      {project.features.length}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-500">
                    <T k="projects.detail.keyFeatures" />
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {project.liveUrl && (
                  <ButtonLink
                    href={project.liveUrl}
                    external
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    <T k="common.liveDemo" />
                  </ButtonLink>
                )}
                {project.githubUrl && (
                  <ButtonLink
                    href={project.githubUrl}
                    external
                    variant="secondary"
                    icon={<GithubIcon className="h-4 w-4" />}
                  >
                    <T k="common.sourceCode" />
                  </ButtonLink>
                )}
                <ButtonLink
                  href="/#contact"
                  variant="ghost"
                  icon={<ArrowUpRight className="h-4 w-4" />}
                >
                  <T k="projects.detail.discuss" />
                </ButtonLink>
              </div>

              <div className="space-y-3 pt-2">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Code2 className="h-4 w-4 text-indigo-400" />
                  <T k="projects.detail.technologiesUsed" />
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.length > 0 ? (
                    project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-indigo-400/15 bg-indigo-500/[0.07] px-3 py-1.5 text-xs text-indigo-200"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-600">
                      <T k="projects.detail.noTechnologies" />
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="relative aspect-[16/10]">
                  <SafeImage
                    src={project.thumbnailUrl}
                    alt={project.title}
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition group-hover:border-white/10" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Star className="h-4 w-4 text-amber-300" />
                  <T k="projects.detail.keyFeatures" />
                </h2>
                <ul className="mt-4 space-y-2">
                  {project.features.length > 0 ? (
                    project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 rounded-lg border border-transparent p-2 text-xs leading-relaxed text-gray-400 transition hover:border-white/[0.07] hover:bg-white/[0.03] hover:text-gray-200"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-600">
                      <T k="projects.detail.noFeatures" />
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/[0.08] to-transparent p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <T k="projects.detail.builtWithIntent" />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
                  <T k="projects.detail.builtWithIntentDescription" />
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-white/[0.06] pt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                <T k="projects.detail.moreProjects" />
              </h2>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1 text-xs text-indigo-300 transition hover:text-indigo-200"
              >
                <T k="projects.detail.viewAll" />
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ProjectExplorer projects={related} />
          </div>
        )}
      </div>
    </div>
  );
}
