"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * true dès que l'élément entre dans le viewport (one-shot : ne repasse
 * jamais à false — les animations d'entrée ne rejouent pas au scroll).
 */
export function useInView(ref: RefObject<Element | null>, threshold = 0.3): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, inView]);

  return inView;
}
