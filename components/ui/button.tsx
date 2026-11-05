import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "relative overflow-hidden text-white shadow-[0_18px_45px_-22px_rgba(99,102,241,0.9)] bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#a855f7] hover:brightness-110",
  secondary:
    "border border-white/10 bg-white/5 text-gray-100 hover:border-white/20 hover:bg-white/10 backdrop-blur-xl",
  ghost:
    "text-gray-300 hover:bg-white/5 hover:text-white border border-transparent",
  danger:
    "border border-red-500/25 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/40",
  outline:
    "border border-indigo-400/30 bg-indigo-500/5 text-indigo-200 hover:border-indigo-400/60 hover:bg-indigo-500/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-xs gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-sm gap-2.5 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: BaseProps & ComponentProps<"button">) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "group relative inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-12deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[230%]" />
      )}
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        icon
      )}
      <span className="relative">{children}</span>
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  external,
  ...props
}: BaseProps & { href: string; external?: boolean } & Omit<
    ComponentProps<"a">,
    "href"
  >) {
  const classes = cn(
    "group relative inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60",
    variants[variant],
    sizes[size],
    className,
  );

  const content = (
    <>
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-12deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[230%]" />
      )}
      {icon}
      <span className="relative">{children}</span>
    </>
  );

  if (external || /^https?:|^mailto:/.test(href)) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
