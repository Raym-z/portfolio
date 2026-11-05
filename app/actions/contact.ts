"use server";

import { contactSchema } from "@/lib/utils/validation";
import { insertContactMessage } from "@/lib/services/messages";
import type { ActionResult } from "@/types";

export async function submitContactMessage(input: {
  name: string;
  email: string;
  message: string;
  website?: string;
}): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
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
      message: "Thanks for reaching out. I'll get back to you soon.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again.",
    };
  }
}
