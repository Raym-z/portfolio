"use client";

import { getBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/site-config";
import { mapComment } from "@/lib/services/mappers";
import type { Comment } from "@/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

export async function fetchComments(): Promise<Comment[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = getBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapComment);
}

export async function uploadCommentAvatar(file: File): Promise<string> {
  const supabase = getBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Profile image must be smaller than 5 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `avatars/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function createComment(input: {
  userName: string;
  content: string;
  avatarFile: File | null;
}): Promise<Comment> {
  const supabase = getBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const profileImageUrl = input.avatarFile
    ? await uploadCommentAvatar(input.avatarFile)
    : null;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      user_name: input.userName,
      content: input.content,
      profile_image_url: profileImageUrl,
      is_pinned: false,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapComment(data);
}

export function subscribeToComments(onChange: () => void): () => void {
  const supabase = getBrowserClient();
  if (!supabase) return () => {};

  const channel = supabase
    .channel("public-comments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "comments" },
      onChange,
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel as RealtimeChannel);
  };
}
