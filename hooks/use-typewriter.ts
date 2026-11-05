"use client";

import { useEffect, useState } from "react";

export function useTypewriter(
  words: readonly string[],
  options?: {
    typingSpeed?: number;
    deletingSpeed?: number;
    pause?: number;
  },
) {
  const typingSpeed = options?.typingSpeed ?? 85;
  const deletingSpeed = options?.deletingSpeed ?? 40;
  const pause = options?.pause ?? 1800;

  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const current = words[wordIndex % words.length] ?? "";

    if (!deleting && text === current) {
      const timer = window.setTimeout(() => setDeleting(true), pause);
      return () => window.clearTimeout(timer);
    }

    if (deleting && text === "") {
      const timer = window.setTimeout(() => {
        setDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
      }, deletingSpeed);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(
      () => {
        setText((value) =>
          deleting
            ? current.slice(0, Math.max(0, value.length - 1))
            : current.slice(0, value.length + 1),
        );
      },
      deleting ? deletingSpeed : typingSpeed,
    );

    return () => window.clearTimeout(timer);
  }, [text, deleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return text;
}
