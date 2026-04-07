import { useRef, useCallback } from "react";

/**
 * useMagneticButton — effet magnétique sur un bouton.
 * Le bouton se déplace légèrement vers le curseur, puis revient.
 *
 * Usage :
 *   const { ref, onMouseMove, onMouseLeave } = useMagneticButton();
 *   <button ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>…</button>
 *
 * @param {number} strength  Force de l'attraction (0.3 = 30% du déplacement curseur)
 */
export function useMagneticButton(strength = 0.3) {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width  / 2;
    const cy = top  + height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = "transform 0.1s ease";
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
    el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
