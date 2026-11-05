"use server";

import { insertContactMessage } from "@/lib/services/messages";
import { isLocale, translate, type Locale } from "@/lib/i18n/config";
import { createContactSchema } from "@/lib/utils/validation";
import type { ActionResult } from "@/types";

export async function submitContactMessage(input: {
  name: string;
  email: string;
  message: string;
  website?: string;
  locale?: Locale;
}): Promise<ActionResult> {
  const locale = isLocale(input.locale) ? input.locale : "id";
  const t = (key: string) => translate(locale, key);
  const parsed = createContactSchema(t).safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? t("validation.checkForm"),
    };
  }

  if (parsed.data.website) {
    return { success: false, error: "Your submission could not be processed." };
  }

  try {
    await insertContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });

    return {
      success: true,
      message: t("contact.toasts.sentText"),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : t("contact.error"),
    };
  }
}
