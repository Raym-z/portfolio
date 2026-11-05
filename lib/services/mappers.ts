import type { Database } from "@/types/database";
import type {
  Certificate,
  Comment,
  ContactMessage,
  Profile,
  Project,
} from "@/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type CertificateRow = Database["public"]["Tables"]["certificates"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
type MessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    techStack: row.tech_stack ?? [],
    features: row.features ?? [],
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    published: row.published,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCertificate(row: CertificateRow): Certificate {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    imageUrl: row.image_url,
    url: row.url,
    displayOrder: row.display_order,
    createdAt: row.created_at,
  };
}

export function mapComment(row: CommentRow): Comment {
  return {
    id: row.id,
    userName: row.user_name,
    content: row.content,
    profileImageUrl: row.profile_image_url,
    isPinned: row.is_pinned,
    createdAt: row.created_at,
  };
}

export function mapMessage(row: MessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    createdAt: row.created_at,
  };
}
