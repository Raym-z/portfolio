"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/services/auth";
import {
  deleteProjectRecord,
  insertProject,
  listProjectSlugs,
  setProjectPublished,
  updateProjectRecord,
  uploadProjectImage,
} from "@/lib/services/projects";
import {
  deleteCertificateRecord,
  insertCertificate,
  uploadCertificateImage,
} from "@/lib/services/certificates";
import {
  deleteCommentRecord,
  setCommentPinned,
} from "@/lib/services/comments-admin";
import {
  deleteMessageRecord,
  setMessageRead,
} from "@/lib/services/messages";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { uniqueSlug } from "@/lib/utils/slug";
import { projectSchema } from "@/lib/utils/validation";
import type { ActionResult, ProjectInput } from "@/types";

async function requireAdmin(): Promise<ActionResult> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { success: false, error: "You must be signed in." };
  }

  if (profile.role !== "admin") {
    return { success: false, error: "You do not have admin access." };
  }

  return { success: true };
}

function assertImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a valid image file.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Images must be smaller than 8 MB.");
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function adminCreateProject(
  input: ProjectInput,
  thumbnail: File | null,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid project data.",
    };
  }

  try {
    const slugs = await listProjectSlugs();
    let thumbnailUrl: string | null = null;

    if (thumbnail) {
      assertImage(thumbnail);
      thumbnailUrl = await uploadProjectImage(thumbnail);
    }

    await insertProject({
      ...parsed.data,
      thumbnailUrl,
      slug: uniqueSlug(parsed.data.title, slugs),
    });

    updateTag("projects");
    return { success: true, message: "Project created." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminUpdateProject(
  id: string,
  input: ProjectInput,
  thumbnail: File | null,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid project data.",
    };
  }

  try {
    let thumbnailUrl = input.thumbnailUrl ?? null;

    if (thumbnail) {
      assertImage(thumbnail);
      thumbnailUrl = await uploadProjectImage(thumbnail);
    }

    await updateProjectRecord(id, { ...parsed.data, thumbnailUrl });
    updateTag("projects");
    return { success: true, message: "Project updated." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminDeleteProject(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    await deleteProjectRecord(id);
    updateTag("projects");
    return { success: true, message: "Project deleted." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminToggleProject(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    await setProjectPublished(id, published);
    updateTag("projects");
    return {
      success: true,
      message: published ? "Project published." : "Project moved to draft.",
    };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminMoveProject(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data, error } = await supabase
      .from("projects")
      .select("id, display_order")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const items = data ?? [];
    const index = items.findIndex((item) => item.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (index === -1 || swapIndex < 0 || swapIndex >= items.length) {
      return { success: false, error: "Project cannot be moved further." };
    }

    const current = items[index];
    const target = items[swapIndex];

    const [{ error: firstError }, { error: secondError }] = await Promise.all([
      supabase
        .from("projects")
        .update({ display_order: target.display_order })
        .eq("id", current.id),
      supabase
        .from("projects")
        .update({ display_order: current.display_order })
        .eq("id", target.id),
    ]);

    if (firstError || secondError) {
      throw new Error(firstError?.message || secondError?.message);
    }

    updateTag("projects");
    return { success: true, message: "Project order updated." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminUploadCertificate(
  input: { title: string; issuer: string; url: string; displayOrder: number },
  file: File,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  if (!input.title.trim()) {
    return { success: false, error: "Certificate title is required." };
  }

  try {
    assertImage(file);
    const imageUrl = await uploadCertificateImage(file);

    await insertCertificate({
      title: input.title.trim(),
      issuer: input.issuer.trim() || null,
      imageUrl,
      url: input.url.trim() || null,
      displayOrder: Number.isFinite(input.displayOrder)
        ? input.displayOrder
        : 0,
    });

    updateTag("certificates");
    return { success: true, message: "Certificate uploaded." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminDeleteCertificate(
  id: string,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    await deleteCertificateRecord(id);
    updateTag("certificates");
    return { success: true, message: "Certificate deleted." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminToggleCommentPin(
  id: string,
  pinned: boolean,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    await setCommentPinned(id, pinned);
    updateTag("comments");
    return {
      success: true,
      message: pinned ? "Comment pinned." : "Comment unpinned.",
    };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminDeleteComment(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    await deleteCommentRecord(id);
    updateTag("comments");
    return { success: true, message: "Comment deleted." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminToggleMessageRead(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    await setMessageRead(id, read);
    return { success: true, message: read ? "Marked as read." : "Marked as unread." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminDeleteMessage(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.success) return auth;

  try {
    await deleteMessageRecord(id);
    return { success: true, message: "Message deleted." };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function adminSignOut(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/login");
}
