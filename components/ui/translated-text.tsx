"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { TranslationVars } from "@/lib/i18n/config";

export function T({ k, vars }: { k: string; vars?: TranslationVars }) {
  const { t } = useI18n();
  return <>{t(k, vars)}</>;
}
