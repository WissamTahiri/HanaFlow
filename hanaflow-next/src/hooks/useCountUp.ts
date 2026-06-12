"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Compteur animé 0 → target (ease-out cubic, requestAnimationFrame).
 * Démarre quand `shouldStart` passe à true ; affiche directement la valeur
 * finale si prefers-reduced-motion est actif.
 */
export function useCountUp(target: number, duration = 1500, shouldStart = false): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!shouldStart || reduced) return;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      else setCount(target);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration, shouldStart, reduced]);

  // Reduced motion : pas d'animation, valeur finale dès le déclenchement.
  if (reduced && shouldStart) return target;
  return count;
}
