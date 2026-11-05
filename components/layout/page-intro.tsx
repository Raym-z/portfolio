"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { WelcomeOverlay } from "@/components/layout/welcome-overlay";

const INTRO_DURATION = 3400;

export function PageIntro({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasQueuedIntro = useRef(false);
  const [showIntro, setShowIntro] = useState(false);
  const [revealPage, setRevealPage] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const skipIntro =
      pathname !== "/" || hasQueuedIntro.current || params.has("skipIntro");

    if (skipIntro) {
      const frame = window.requestAnimationFrame(() => setRevealPage(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let timer = 0;

    const dismiss = () => {
      window.clearTimeout(timer);
      setShowIntro(false);
    };

    const frame = window.requestAnimationFrame(() => {
      hasQueuedIntro.current = true;
      setShowIntro(true);
    });
    timer = window.setTimeout(() => setShowIntro(false), INTRO_DURATION);

    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      document.body.style.overflow = previousOverflow;
    };
  }, [pathname]);

  return (
    <>
      <motion.div
        initial={false}
        animate={
          revealPage
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 28 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      <AnimatePresence
        onExitComplete={() => {
          document.body.style.overflow = "";
          setRevealPage(true);
        }}
      >
        {showIntro && <WelcomeOverlay />}
      </AnimatePresence>
    </>
  );
}
