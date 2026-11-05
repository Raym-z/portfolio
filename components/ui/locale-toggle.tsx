"use client";

import { locales } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("nav.locale")}
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-0.5",
        className,
      )}
    >
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          aria-pressed={locale === item}
          className={cn(
            "rounded-md px-2 py-1 text-[10px] font-semibold transition",
            locale === item
              ? "bg-indigo-500/25 text-white"
              : "text-gray-500 hover:text-gray-200",
          )}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
