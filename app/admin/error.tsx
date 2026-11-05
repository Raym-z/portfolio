"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-7 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-300" />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-white">
          Dashboard error
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          {error.message || "Something went wrong while loading this section."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 text-xs font-semibold text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}
