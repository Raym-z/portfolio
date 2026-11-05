"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-20">
      <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-300" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-white">
          {t("publicError.title")}
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-gray-500">
          {error.message || t("publicError.fallback")}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 text-xs font-semibold text-white transition hover:brightness-110"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("publicError.retry")}
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            {t("publicError.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
