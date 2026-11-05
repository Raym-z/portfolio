import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
  accent = "indigo",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  hint?: string;
  href?: string;
  accent?: "indigo" | "purple" | "cyan" | "amber" | "emerald";
}) {
  const accents = {
    indigo: "from-indigo-500/20 text-indigo-300 border-indigo-400/20",
    purple: "from-purple-500/20 text-purple-300 border-purple-400/20",
    cyan: "from-cyan-500/20 text-cyan-300 border-cyan-400/20",
    amber: "from-amber-500/20 text-amber-300 border-amber-400/20",
    emerald: "from-emerald-500/20 text-emerald-300 border-emerald-400/20",
  };

  const body = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accents[accent]} opacity-50`}
      />
      <div className="relative flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-white/[0.04] ${accents[accent]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        {href && (
          <ArrowUpRight className="h-4 w-4 text-gray-600 transition group-hover:text-white" />
        )}
      </div>
      <p className="relative mt-4 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="relative mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
        {label}
      </p>
      {hint && (
        <p className="relative mt-1.5 text-[10px] text-gray-600">{hint}</p>
      )}
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}
