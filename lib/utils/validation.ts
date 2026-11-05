import { z } from "zod";
import { defaultLocale, translate } from "@/lib/i18n/config";
import { containsProfanity } from "@/lib/utils/profanity";

type Translator = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

const defaultTranslate: Translator = (key) => translate(defaultLocale, key);

const respectful = (t: Translator) =>
  z
    .string()
    .refine((value) => !containsProfanity(value), {
      message: t("validation.messageProfanity"),
    });

export function createCommentSchema(t: Translator = defaultTranslate) {
  return z.object({
    userName: z
      .string()
      .trim()
      .min(2, t("validation.nameMin"))
      .max(40, t("validation.nameMax"))
      .pipe(
        z
          .string()
          .refine((value) => !containsProfanity(value), {
            message: t("validation.nameRespectful"),
          }),
      ),
    content: z
      .string()
      .trim()
      .min(2, t("validation.messageMin"))
      .max(500, t("validation.messageMax"))
      .pipe(respectful(t)),
  });
}

export const commentSchema = createCommentSchema();

export function createContactSchema(t: Translator = defaultTranslate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t("validation.contactName"))
      .max(80, t("validation.contactNameMax")),
    email: z.string().trim().email(t("validation.contactEmail")),
    message: z
      .string()
      .trim()
      .min(10, t("validation.contactMessageMin"))
      .max(2000, t("validation.contactMessageMax")),
    website: z.string().max(0).optional().or(z.literal("")),
  });
}

export const contactSchema = createContactSchema();

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(120),
  descriptionId: z
    .string()
    .trim()
    .min(10, "Indonesian description is required.")
    .max(4000),
  descriptionEn: z
    .string()
    .trim()
    .min(10, "English description is required.")
    .max(4000),
  techStack: z.array(z.string().trim().min(1)).max(30),
  features: z.array(z.string().trim().min(1)).max(30),
  liveUrl: z
    .string()
    .trim()
    .url("Live URL must be valid.")
    .or(z.literal(""))
    .or(z.null())
    .optional(),
  githubUrl: z
    .string()
    .trim()
    .url("GitHub URL must be valid.")
    .or(z.literal(""))
    .or(z.null())
    .optional(),
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
