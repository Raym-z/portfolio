import { z } from "zod";
import { containsProfanity } from "@/lib/utils/profanity";

const respectful = (message: string) =>
  z.string().refine((value) => !containsProfanity(value), { message });

export const commentSchema = z.object({
  userName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(40, "Name must be 40 characters or fewer.")
    .pipe(respectful("Please keep your name respectful.")),
  content: z
    .string()
    .trim()
    .min(2, "Message must be at least 2 characters.")
    .max(500, "Message must be 500 characters or fewer.")
    .pipe(respectful("Please remove inappropriate language from your message.")),
});

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(80, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message is too long."),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(120),
  description: z.string().trim().min(10, "Description is required.").max(4000),
  techStack: z.array(z.string().trim().min(1)).max(30),
  features: z.array(z.string().trim().min(1)).max(30),
  liveUrl: z.string().trim().url("Live URL must be valid.").optional().or(z.literal("")),
  githubUrl: z
    .string()
    .trim()
    .url("GitHub URL must be valid.")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
  displayOrder: z.number().int().min(0).max(9999),
});

export const certificateSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(160),
  issuer: z.string().trim().max(160).optional().or(z.literal("")),
  displayOrder: z.number().int().min(0).max(9999),
});

export function parseList(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return [];
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}
