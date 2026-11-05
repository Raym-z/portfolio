"use client";

import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Reveal } from "@/components/ui/reveal";
import { SafeImage } from "@/components/ui/safe-image";
import { EmptyState } from "@/components/ui/states";
import { formatDate } from "@/lib/utils/date";
import type { Certificate } from "@/types";

const INITIAL_COUNT = 4;

export function CertificateGallery({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = useMemo(
    () => (showAll ? certificates : certificates.slice(0, INITIAL_COUNT)),
    [certificates, showAll],
  );

  const active = activeIndex === null ? null : certificates[activeIndex];

  const move = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        return (current + direction + certificates.length) % certificates.length;
      });
    },
    [certificates.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, move]);

  if (certificates.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No research or credentials yet"
        description="Publications and certificates uploaded from the admin dashboard will be displayed here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((certificate, index) => {
          const card = certificate.url ? (
            <a
              href={certificate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_-30px_rgba(99,102,241,0.7)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                  <BookOpen className="h-4 w-4 text-indigo-300" />
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-gray-500">
                  {certificate.issuer || formatDate(certificate.createdAt)}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-white">
                {certificate.title}
              </h3>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300 transition group-hover:text-indigo-200">
                Read publication
                <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-30px_rgba(99,102,241,0.7)]"
            >
              <div className="relative aspect-[16/11.5] overflow-hidden bg-white/5">
                <SafeImage
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur">
                    <Maximize2 className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
                    View certificate
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-white">
                  {certificate.title}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-gray-500">
                  {certificate.issuer || formatDate(certificate.createdAt)}
                </p>
              </div>
            </button>
          );

          return (
            <Reveal
              key={certificate.id}
              direction={index % 2 === 0 ? "left" : "right"}
              distance={90}
              delay={(index % 3) * 0.06}
              className="h-full"
            >
              {card}
            </Reveal>
          );
        })}
      </div>

      {certificates.length > INITIAL_COUNT && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-400 transition hover:border-white/20 hover:text-white"
          >
            {showAll ? "Show less" : `View all ${certificates.length} entries`}
          </button>
        </div>
      )}

      <Modal
        open={Boolean(active)}
        onClose={() => setActiveIndex(null)}
        title={active?.title}
        description={active?.issuer ?? undefined}
        size="xl"
        className="bg-[#050513]"
      >
        {active && (
          <div className="relative flex min-h-[40vh] items-center justify-center bg-black/40 p-3 sm:p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.imageUrl}
              alt={active.title}
              className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
            />
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => move(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                aria-label="Previous entry"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <Badge variant="indigo">
                {(activeIndex ?? 0) + 1} / {certificates.length}
              </Badge>
              <button
                type="button"
                onClick={() => move(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                aria-label="Next entry"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
