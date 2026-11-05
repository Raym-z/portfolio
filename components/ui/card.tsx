import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl",
        hover &&
          "transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055] hover:shadow-[0_30px_80px_-40px_rgba(99,102,241,0.65)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GlowCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group relative", className)}>
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-transparent opacity-0 blur transition duration-500 group-hover:opacity-100" />
      <div className="relative h-full rounded-2xl border border-white/10 bg-[#08081a]/90 backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}
