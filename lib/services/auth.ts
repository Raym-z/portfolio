import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapProfile } from "@/lib/services/mappers";
import type { Profile } from "@/types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      fullName: null,
      role: "user",
      createdAt: user.created_at,
    };
  }

  return mapProfile(profile);
}

export async function isAdminUser(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}
