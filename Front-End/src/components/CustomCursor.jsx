import { useEffect, useRef } from "react";

/**
 * Custom cursor — deux éléments :
 * - dot   : suit la souris instantanément (4px)
 * - ring  : suit avec un léger délai lerp (32px), grandit sur les éléments cliquables
 *
 * Visible uniquement sur desktop (pointer: fine).
 * Le curseur CSS natif est masqué via index.css (.cursor-none sur html).
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Masque le curseur natif
    document.documentElement.style.cursor = "none";

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let rafId;
    let isHovering = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Le dot suit instantanément
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const onMouseEnterInteractive = () => { isHovering = true; };
    const onMouseLeaveInteractive = () => { isHovering = false; };

    // Délégation événements sur éléments interactifs
    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select, label")
        .forEach((el) => {
          el.addEventListener("mouseenter", onMouseEnterInteractive);
          el.addEventListener("mouseleave", onMouseLeaveInteractive);
        });
    };

    addListeners();

    // Observer les nouveaux éléments (navigation SPA)
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Loop lerp pour le ring
    const lerp = (a, b, t) => a + (b - a) * t;

    const loop = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);

      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${isHovering ? 1.6 : 1})`;

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    // Masquer pendant l'inactivité
    const onMouseLeave = () => {
      dot.style.opacity  = "0";
      ring.style.opacity = "0";
    };
    const onMouseEnter = () => {
      dot.style.opacity  = "1";
      ring.style.opacity = "1";
    };

    document.addEventListener("mousemove",   onMouseMove,   { passive: true });
    document.addEventListener("mouseleave",  onMouseLeave);
    document.addEventListener("mouseenter",  onMouseEnter);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove",  onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  // Invisible sur touch / mobile (pointer: coarse)
  return (
    <>
      {/* Dot — suit instantanément */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none
                   w-1.5 h-1.5 rounded-full bg-sapBlue dark:bg-sapAccent
                   transition-opacity duration-300
                   hidden [@media(pointer:fine)]:block"
        style={{ willChange: "transform" }}
      />

      {/* Ring — suit avec délai + grandit sur hover */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none
                   w-8 h-8 rounded-full border border-sapBlue/50 dark:border-sapAccent/50
                   transition-[opacity,transform] duration-150
                   hidden [@media(pointer:fine)]:block"
        style={{ willChange: "transform", transitionProperty: "opacity, scale" }}
      />
    </>
  );
}
