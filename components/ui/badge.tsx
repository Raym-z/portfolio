import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "indigo" | "purple" | "green" | "amber" | "red";

const variants: Record<BadgeVariant, string> = {
  default: "border-white/10 bg-white/5 text-gray-300",
  indigo: "border-indigo-400/25 bg-indigo-500/10 text-indigo-200",
  purple: "border-purple-400/25 bg-purple-500/10 text-purple-200",
  green: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
  amber: "border-amber-400/25 bg-amber-500/10 text-amber-200",
  red: "border-red-400/25 bg-red-500/10 text-red-300",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
