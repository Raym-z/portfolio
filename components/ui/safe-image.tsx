"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function SafeImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/15 via-[#0b0b22] to-purple-500/10",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <ImageOff className="h-5 w-5" />
          <span className="text-[10px] uppercase tracking-wider">Preview</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
