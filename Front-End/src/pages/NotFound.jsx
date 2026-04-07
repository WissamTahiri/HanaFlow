import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import SEO from "../components/SEO.jsx";

export default function NotFound() {
  const numRef  = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(numRef.current.querySelectorAll(".digit"), {
        opacity: 0, y: 60, rotateX: -90, stagger: 0.1, duration: 0.8,
        ease: "back.out(1.7)",
      });
      gsap.from(textRef.current.children, {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: "power3.out", delay: 0.4,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO title="Page introuvable" description="Cette page n'existe pas sur HanaFlow." />

      <div className="grain min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center
                      px-4 bg-slate-950 relative overflow-hidden">
        {/* Glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[500px] h-[300px] rounded-full bg-sapBlue/15 blur-[120px]" />
        </div>

        <div className="relative text-center max-w-xl">
          {/* 404 — chaque chiffre animé individuellement */}
          <div ref={numRef} className="flex items-center justify-center mb-8"
               style={{ perspective: "600px" }}>
            {"404".split("").map((d, i) => (
              <span key={i} className="digit font-display font-bold text-[10rem] sm:text-[14rem]
                                       leading-none select-none inline-block"
                style={{
                  color: i === 1 ? "transparent" : "white",
                  WebkitTextStroke: i === 1 ? "2px rgba(15,82,186,0.6)" : "none",
                  letterSpacing: "-0.04em",
                }}>
                {d}
              </span>
            ))}
          </div>

          <div ref={textRef}>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 tracking-display">
              Page introuvable
            </h1>
            <p className="text-slate-400 mb-10 leading-relaxed">
              La page que tu cherches n'existe pas ou a été déplacée.<br />
              Reviens à l'accueil ou explore les modules SAP.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
                           bg-white text-slate-900 text-sm font-bold hover:bg-slate-100
                           transition-colors w-full sm:w-auto">
                ← Retour à l'accueil
              </Link>
              <Link to="/modules-sap"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl
                           border border-white/15 text-white text-sm font-medium
                           hover:bg-white/8 transition-colors w-full sm:w-auto">
                Explorer les modules SAP
              </Link>
            </div>

            <p className="mt-10 text-xs text-slate-700">
              Code erreur : 404 — ressource introuvable
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
