import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/site-config";
import type { AdminStats } from "@/types";

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured) {
    return {
      totalProjects: 0,
      publishedProjects: 0,
      totalCertificates: 0,
      totalComments: 0,
      pinnedComments: 0,
      unreadMessages: 0,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      totalProjects: 0,
      publishedProjects: 0,
      totalCertificates: 0,
      totalComments: 0,
      pinnedComments: 0,
      unreadMessages: 0,
    };
  }

  const [
    projects,
    published,
    certificates,
    comments,
    pinned,
    messages,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("is_pinned", true),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false),
  ]);

  return {
    totalProjects: projects.count ?? 0,
    publishedProjects: published.count ?? 0,
    totalCertificates: certificates.count ?? 0,
    totalComments: comments.count ?? 0,
    pinnedComments: pinned.count ?? 0,
    unreadMessages: messages.count ?? 0,
  };
}
