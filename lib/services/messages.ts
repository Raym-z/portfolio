import "server-only";

import {
  createPublicSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/site-config";
import { mockMessages } from "@/lib/mock-data";
import { mapMessage } from "@/lib/services/mappers";
import type { ContactMessage } from "@/types";

export async function insertContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Contact form is not connected yet. Add your Supabase credentials to enable it.",
    );
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("contact_messages").insert(input);
  if (error) throw new Error(error.message);
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured) return mockMessages;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMessage);
}

export async function setMessageRead(
  id: string,
  read: boolean,
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteMessageRecord(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
