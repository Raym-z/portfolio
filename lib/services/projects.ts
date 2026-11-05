import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  createPublicSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/site-config";
import { mapProject } from "@/lib/services/mappers";
import type { Project, ProjectInput } from "@/types";

type ProjectFeed = {
  published: Project[];
  total: number;
};

async function getProjectFeed(): Promise<ProjectFeed> {
  "use cache";
  cacheLife("minutes");
  cacheTag("projects");

  if (!isSupabaseConfigured) {
    return { published: [], total: 0 };
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) return { published: [], total: 0 };

  const [publishedResult, countResult] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true }),
  ]);

  if (publishedResult.error) {
    throw new Error(
      `Could not load projects: ${publishedResult.error.message}`,
    );
  }

  return {
    published: (publishedResult.data ?? []).map(mapProject),
    total: countResult.error
      ? (publishedResult.data ?? []).length
      : (countResult.count ?? 0),
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const feed = await getProjectFeed();
  return feed.published;
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const feed = await getProjectFeed();
  return feed.published.find((project) => project.slug === slug) ?? null;
}

export async function getAdminProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapProject);
}

export async function insertProject(
  input: ProjectInput & { slug: string },
): Promise<Project> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug: input.slug,
      title: input.title,
      description_id: input.descriptionId,
      description_en: input.descriptionEn,
      thumbnail_url: input.thumbnailUrl ?? null,
      tech_stack: input.techStack,
      features: input.features,
      live_url: input.liveUrl || null,
      github_url: input.githubUrl || null,
      published: input.published,
      display_order: input.displayOrder,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapProject(data);
}

export async function updateProjectRecord(
  id: string,
  input: ProjectInput,
): Promise<Project> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("projects")
    .update({
      title: input.title,
      description_id: input.descriptionId,
      description_en: input.descriptionEn,
      thumbnail_url: input.thumbnailUrl ?? null,
      tech_stack: input.techStack,
      features: input.features,
      live_url: input.liveUrl || null,
      github_url: input.githubUrl || null,
      published: input.published,
      display_order: input.displayOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapProject(data);
}

export async function deleteProjectRecord(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setProjectPublished(
  id: string,
  published: boolean,
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("projects")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function listProjectSlugs(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("projects").select("slug");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.slug);
}

export async function uploadProjectImage(file: File): Promise<string> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `projects/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

