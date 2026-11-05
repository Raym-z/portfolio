import messages from "./messages.json";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";
export const localeStorageKey = "portfolio-locale";

export type TranslationVars = Record<string, string | number>;

const dictionaries = messages as Record<Locale, unknown>;

function lookup(source: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((current, part) => {
    if (
      current &&
      typeof current === "object" &&
      part in (current as Record<string, unknown>)
    ) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

function interpolate(template: string, vars?: TranslationVars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  );
}

export function translate(
  locale: Locale,
  key: string,
  vars?: TranslationVars,
): string {
  const value =
    lookup(dictionaries[locale], key) ?? lookup(dictionaries.en, key);

  if (Array.isArray(value)) return value.join(", ");
  if (typeof value !== "string") return key;

  return interpolate(value, vars);
}

export function translateList(locale: Locale, key: string): string[] {
  const value =
    lookup(dictionaries[locale], key) ?? lookup(dictionaries.en, key);

  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
