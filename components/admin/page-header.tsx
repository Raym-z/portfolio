import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function AdminPageHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#030014]">
          <span className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-40 blur" />
          <Icon className="h-4 w-4 text-indigo-400" />
        </span>
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
