import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/site-config";
import { mapComment } from "@/lib/services/mappers";
import type { Comment } from "@/types";

export async function getAdminComments(): Promise<Comment[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapComment);
}

export async function setCommentPinned(
  id: string,
  pinned: boolean,
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  if (pinned) {
    const { error: unpinError } = await supabase
      .from("comments")
      .update({ is_pinned: false })
      .eq("is_pinned", true);

    if (unpinError) throw new Error(unpinError.message);
  }

  const { error } = await supabase
    .from("comments")
    .update({ is_pinned: pinned })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteCommentRecord(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
