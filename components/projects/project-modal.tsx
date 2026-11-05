"use client";

import { ArrowUpRight, ExternalLink, Layers3, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SafeImage } from "@/components/ui/safe-image";
import type { Project } from "@/types";

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={Boolean(project)}
      onClose={onClose}
      size="lg"
      className="max-h-[92dvh]"
    >
      {project && (
        <div>
          <div className="relative aspect-[16/8] w-full overflow-hidden bg-white/5">
            <SafeImage src={project.thumbnailUrl} alt={project.title} priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08081a] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 5).map((tech) => (
                  <Badge key={tech} variant="indigo">
                    {tech}
                  </Badge>
                ))}
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {project.title}
              </h2>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <p className="text-sm leading-relaxed text-gray-400">
              {project.description}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                  <Layers3 className="h-3.5 w-3.5" />
                  Tech stack
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.techStack.length > 0 ? (
                    project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] text-gray-300"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-600">Not listed</span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Key features
                </div>
                <ul className="mt-3 space-y-1.5">
                  {project.features.length > 0 ? (
                    project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[11px] leading-relaxed text-gray-400"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-purple-400" />
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-600">Not listed</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 border-t border-white/[0.07] pt-5">
              {project.liveUrl && (
                <ButtonLink
                  href={project.liveUrl}
                  external
                  size="md"
                  icon={<ExternalLink className="h-4 w-4" />}
                >
                  Live demo
                </ButtonLink>
              )}
              {project.githubUrl && (
                <ButtonLink
                  href={project.githubUrl}
                  external
                  variant="secondary"
                  size="md"
                  icon={<GithubIcon className="h-4 w-4" />}
                >
                  Source code
                </ButtonLink>
              )}
              <Link
                href={`/projects/${project.slug}`}
                onClick={onClose}
                className="group ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
              >
                Full case study
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
