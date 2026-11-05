import { translate, type Locale } from "@/lib/i18n/config";

const intlLocale: Record<Locale, string> = {
  en: "en-US",
  id: "id-ID",
};

export function formatRelativeDate(
  value: string | Date,
  locale: Locale = "en",
) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return translate(locale, "date.justNow");
  if (diffMinutes < 60) {
    return translate(locale, "date.minutesAgo", { count: diffMinutes });
  }
  if (diffHours < 24) {
    return translate(locale, "date.hoursAgo", { count: diffHours });
  }
  if (diffDays < 7) {
    return translate(locale, "date.daysAgo", { count: diffDays });
  }

  return new Intl.DateTimeFormat(intlLocale[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDate(value: string | Date, locale: Locale = "en") {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(intlLocale[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
