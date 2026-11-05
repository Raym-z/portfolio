import { siteConfig } from "@/lib/site-config";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[110] flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#030014]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.2),transparent_62%)]" />
        <div className="absolute left-1/2 top-[42%] h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/15 blur-[110px]" />
        <div className="grid-overlay absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#030014_82%)]" />
      </div>

      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-r-indigo-400/70 border-t-indigo-400" />
        <div className="absolute inset-3 rounded-full border border-indigo-400/15" />
        <div className="absolute inset-5 animate-pulse rounded-full border border-purple-400/20" />
        <div className="absolute inset-7 rounded-full bg-indigo-500/20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-indigo-500/35 to-purple-500/20 text-lg font-bold tracking-tight text-white shadow-[0_0_45px_-12px_rgba(99,102,241,0.9)]">
          {siteConfig.initials}
        </div>
      </div>

      <p className="relative mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-300/80">
        Loading
        <span className="ml-1 inline-flex">
          <span className="animate-blink">.</span>
          <span className="animate-blink [animation-delay:180ms]">.</span>
          <span className="animate-blink [animation-delay:360ms]">.</span>
        </span>
      </p>

      <div className="relative mt-5 h-1 w-56 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-400" />
      </div>

      <p className="relative mt-4 text-[9px] uppercase tracking-[0.22em] text-gray-600">
        Please wait
      </p>
    </div>
  );
}
