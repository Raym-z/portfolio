"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  isLocale,
  localeStorageKey,
  translate,
  translateList,
  type Locale,
  type TranslationVars,
} from "./config";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: TranslationVars) => string;
  tList: (key: string) => string[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(localeStorageKey);
  return isLocale(stored) ? stored : defaultLocale;
}

function getServerSnapshot(): Locale {
  return defaultLocale;
}

function persistLocale(locale: Locale) {
  window.localStorage.setItem(localeStorageKey, locale);
  listeners.forEach((listener) => listener());
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
  }, []);

  const t = useCallback(
    (key: string, vars?: TranslationVars) => translate(locale, key, vars),
    [locale],
  );

  const tList = useCallback(
    (key: string) => translateList(locale, key),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, tList }),
    [locale, setLocale, t, tList],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
