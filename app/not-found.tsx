import { ArrowLeft, Home, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#030014] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-72 w-72 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="grid-overlay absolute inset-0 opacity-60" />
      </div>

      <div className="relative text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/25 bg-indigo-500/10">
          <SearchX className="h-7 w-7 text-indigo-300" />
        </div>
        <p className="text-7xl font-bold tracking-tight text-gradient sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
          This page took a wrong turn
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
          The page you are looking for may have moved, been deleted, or never
          existed in the first place.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            Back home
          </Link>
          <Link
            href="/projects"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse projects
          </Link>
        </div>
      </div>
    </div>
  );
}
