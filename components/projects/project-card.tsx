"use client";

import { ArrowRight, ExternalLink, Layers3 } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/ui/safe-image";
import type { Project } from "@/types";

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  return (
    <article className="group relative h-full">
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/20 to-transparent opacity-0 blur transition duration-500 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#08081b]/90 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:border-white/20">
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="relative block aspect-[16/9] w-full overflow-hidden text-left"
          aria-label={`Open ${project.title} details`}
        >
          <SafeImage
            src={project.thumbnailUrl}
            alt={project.title}
            className="transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08081b] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-medium text-gray-300 backdrop-blur"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-gray-400 backdrop-blur">
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/70 backdrop-blur transition group-hover:border-indigo-400/40 group-hover:text-white">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </button>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-white transition group-hover:text-indigo-200">
              {project.title}
            </h3>
            {project.published ? (
              <Badge variant="green" className="shrink-0">
                Live
              </Badge>
            ) : (
              <Badge variant="amber" className="shrink-0">
                Draft
              </Badge>
            )}
          </div>

          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-400">
            {project.description}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <div className="flex items-center gap-1">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-indigo-300 transition hover:bg-indigo-500/10 hover:text-indigo-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  Live demo
                </a>
              ) : (
                <span className="px-2 py-1.5 text-[11px] text-gray-600">
                  No demo
                </span>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                  <GithubIcon className="h-3 w-3" />
                  Code
                </a>
              )}
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-gray-200 transition hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white"
            >
              <Layers3 className="h-3 w-3" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
