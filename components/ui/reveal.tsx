"use client";

import { motion, type Variants } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

const ease = [0.22, 1, 0.36, 1] as const;

let scrollDirection: "up" | "down" = "down";
let scrollListenerAttached = false;

function ensureScrollDirectionListener() {
  if (scrollListenerAttached || typeof window === "undefined") return;
  scrollListenerAttached = true;

  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > lastY) scrollDirection = "down";
      else if (y < lastY) scrollDirection = "up";
      lastY = y;
    },
    { passive: true },
  );
}

function offsetFor(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "down":
      return { x: 0, y: -distance };
    case "none":
      return { x: 0, y: 0 };
    default:
      return { x: 0, y: distance };
  }
}

function useScrollVisibility(once: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ visible: false, instant: false });

  useEffect(() => {
    ensureScrollDirectionListener();

    const node = ref.current;
    if (!node) return;

    let inView = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!inView) {
            setState({
              visible: true,
              instant: scrollDirection === "up",
            });
          }
          inView = true;
          return;
        }

        if (!once && inView) {
          inView = false;
          setState({ visible: false, instant: false });
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return { ref, ...state };
}

const InstantContext = createContext(false);

export function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
  distance = 48,
  once = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
  once?: boolean;
}) {
  const { ref, visible, instant } = useScrollVisibility(once);
  const offset = offsetFor(direction, distance);

  const variants: Variants = {
    hidden: { opacity: 0, ...offset, scale: 0.97 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: instant ? 0 : 0.8, delay: instant ? 0 : delay, ease },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.1,
  once = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const { ref, visible, instant } = useScrollVisibility(once);

  return (
    <InstantContext.Provider value={instant}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: instant ? 0 : stagger,
              delayChildren: instant ? 0 : delay,
            },
          },
        }}
        className={className}
      >
        {children}
      </motion.div>
    </InstantContext.Provider>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 44,
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
}) {
  const instant = useContext(InstantContext);
  const offset = offsetFor(direction, distance);

  const variants: Variants = {
    hidden: { opacity: 0, ...offset, scale: 0.96 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: instant ? 0 : 0.7, ease },
    },
  };

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
