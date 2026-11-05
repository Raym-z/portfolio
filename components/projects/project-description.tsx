"use client";

import { useI18n } from "@/lib/i18n/provider";
import { getProjectDescription } from "@/lib/utils/project-description";
import type { Project } from "@/types";

export function ProjectDescription({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const { locale } = useI18n();

  return (
    <p className={className}>{getProjectDescription(project, locale)}</p>
  );
}
