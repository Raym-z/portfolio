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
import { EmptyState } from "@/components/ui/states";
import { formatDate } from "@/lib/utils/date";
import { useI18n } from "@/lib/i18n/provider";
import type { Certificate } from "@/types";

const INITIAL_COUNT = 4;

export function CertificateGallery({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const { t, locale } = useI18n();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = useMemo(
    () => (showAll ? certificates : certificates.slice(0, INITIAL_COUNT)),
    [certificates, showAll],
  );

  const imageCertificates = useMemo(
    () => certificates.filter((certificate) => !certificate.url),
    [certificates],
  );

  const active =
    activeIndex === null ? null : imageCertificates[activeIndex];

  const move = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => {
        if (current === null || imageCertificates.length === 0) return current;
        return (
          (current + direction + imageCertificates.length) %
          imageCertificates.length
        );
      });
    },
    [imageCertificates.length],
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
        title={t("certificates.emptyTitle")}
        description={t("certificates.emptyDescription")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((certificate, index) => {
          const isPublication = Boolean(certificate.url);
          const Icon = isPublication ? BookOpen : Award;

          const content = (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                  <Icon className="h-4 w-4 text-indigo-300" />
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-gray-500">
                  {certificate.issuer || formatDate(certificate.createdAt, locale)}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold leading-snug text-white">
                {certificate.title}
              </h3>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300 transition group-hover:text-indigo-200">
                {isPublication ? t("certificates.readPublication") : t("certificates.showCertificate")}
                {isPublication ? (
                  <ExternalLink className="h-3 w-3" />
                ) : (
                  <Maximize2 className="h-3 w-3" />
                )}
              </span>
            </>
          );

          const cardClassName =
            "group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_-30px_rgba(99,102,241,0.7)]";

          return (
            <Reveal
              key={certificate.id}
              direction={index % 2 === 0 ? "left" : "right"}
              distance={90}
              delay={(index % 3) * 0.06}
              className="h-full min-w-0"
            >
              {certificate.url ? (
                <a
                  href={certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const imageIndex = imageCertificates.findIndex(
                      (item) => item.id === certificate.id,
                    );
                    if (imageIndex >= 0) setActiveIndex(imageIndex);
                  }}
                  className={cardClassName}
                >
                  {content}
                </button>
              )}
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
            {showAll ? t("common.showLess") : t("certificates.viewAll", { count: certificates.length })}
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
              {imageCertificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                  aria-label={t("certificates.previous")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <Badge variant="indigo">
                {(activeIndex ?? 0) + 1} / {imageCertificates.length}
              </Badge>
              {imageCertificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                  aria-label={t("certificates.next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
