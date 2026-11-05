import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/types";

export function getProjectDescription(project: Project, locale: Locale) {
  const primary =
    (locale === "id" ? project.descriptionId : project.descriptionEn) ?? "";
  const fallback =
    (locale === "id" ? project.descriptionEn : project.descriptionId) ?? "";

  return primary.trim() || fallback.trim();
}
