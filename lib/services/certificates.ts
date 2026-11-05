import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  createPublicSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/site-config";
import { mockCertificates } from "@/lib/mock-data";
import { mapCertificate } from "@/lib/services/mappers";
import type { Certificate } from "@/types";

type CertificateFeed = {
  items: Certificate[];
  total: number;
};

function starterContentEnabled() {
  return process.env.USE_STARTER_CONTENT !== "false";
}

async function getCertificateFeed(): Promise<CertificateFeed> {
  "use cache";
  cacheLife("minutes");
  cacheTag("certificates");

  if (!isSupabaseConfigured) {
    return { items: mockCertificates, total: mockCertificates.length };
  }

  const supabase = createPublicSupabaseClient();
  if (!supabase) return { items: [], total: 0 };

  const [itemsResult, countResult] = await Promise.all([
    supabase
      .from("certificates")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("certificates")
      .select("id", { count: "exact", head: true }),
  ]);

  if (itemsResult.error) {
    throw new Error(
      `Could not load certificates: ${itemsResult.error.message}`,
    );
  }

  return {
    items: (itemsResult.data ?? []).map(mapCertificate),
    total: countResult.error
      ? (itemsResult.data ?? []).length
      : (countResult.count ?? 0),
  };
}

export async function getCertificates(): Promise<Certificate[]> {
  const feed = await getCertificateFeed();

  if (feed.total === 0 && starterContentEnabled()) {
    return mockCertificates;
  }

  return feed.items;
}

export async function getAdminCertificates(): Promise<Certificate[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapCertificate);
}

export async function uploadCertificateImage(file: File): Promise<string> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `certificates/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("certificate-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("certificate-images")
    .getPublicUrl(path);
  return data.publicUrl;
}

export async function insertCertificate(input: {
  title: string;
  issuer: string | null;
  imageUrl: string;
  url: string | null;
  displayOrder: number;
}): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("certificates").insert({
    title: input.title,
    issuer: input.issuer,
    image_url: input.imageUrl,
    url: input.url,
    display_order: input.displayOrder,
  });
  if (error) throw new Error(error.message);
}

export async function deleteCertificateRecord(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

