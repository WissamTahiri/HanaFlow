"use client";

import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

/**
 * Chiffre animé 0 → value au scroll (one-shot). `delay` décale le départ
 * entre compteurs voisins (stagger), `suffix` pour "+", " %"…
 */
export default function StatCounter({
  value,
  suffix = "",
  className = "",
  duration = 1500,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const count = useCountUp(value, duration, inView);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}
