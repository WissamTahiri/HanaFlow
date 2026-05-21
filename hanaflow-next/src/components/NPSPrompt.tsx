"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";

/**
 * NPSPrompt — modal NPS qui s'affiche après J+7 d'usage, max 1x par 90 jours.
 *
 * La décision d'afficher est prise CÔTÉ SERVEUR via /api/nps/should-show :
 * ça permet de vérifier l'ancienneté du compte et l'historique en sécurité
 * (un user ne peut pas tromper la fenêtre 90j en clearant son localStorage).
 *
 * Affichage : "Bottom sheet" en bas-droite, ferme-able. Snooze 7j en local
 * si l'user ferme sans répondre — évite le harcèlement.
 */

const SNOOZE_KEY = "hf_nps_snooze_until";

export default function NPSPrompt() {
  const pathname = usePathname();
  const { getToken, isAuthenticated, loading } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  // Pas affiché sur certaines pages
  const hideOnRoute =
    !pathname ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verifier-certificat") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/forgot-password");

  useEffect(() => {
    if (loading || !isAuthenticated || hideOnRoute) return;

    // Snooze local : si l'user a fermé récemment, on respecte
    try {
      const snoozedUntil = parseInt(localStorage.getItem(SNOOZE_KEY) ?? "0", 10);
      if (snoozedUntil > Date.now()) return;
    } catch {
      /* ignore */
    }

    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const r = await fetch("/api/nps/should-show", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!r.ok || cancelled) return;
        const d = await r.json();
        if (d.show && !cancelled) {
          // Petit délai pour ne pas s'afficher instantanément à la connexion
          setTimeout(() => {
            if (!cancelled) {
              setShouldShow(true);
              setOpen(true);
            }
          }, 8000);
        }
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, isAuthenticated, loading, hideOnRoute]);

  const dismiss = () => {
    setOpen(false);
    // Snooze 7 jours après dismiss sans réponse
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
    } catch {
      /* ignore */
    }
  };

  const submit = async () => {
    if (score === null) return;
    setPending(true);
    try {
      const token = await getToken();
      if (!token) return;
      const r = await fetch("/api/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ score, comment: comment.trim() || undefined }),
      });
      if (r.ok) {
        setSent(true);
        // Une fois soumis, ne réapparaît pas avant 90j (le serveur le gère côté should-show)
        setTimeout(() => setOpen(false), 2500);
      }
    } finally {
      setPending(false);
    }
  };

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.20)] overflow-hidden"
        >
          {sent ? (
            <div className="p-6 text-center">
              <div className="text-3xl mb-2">🙏</div>
              <p className="text-base font-bold text-slate-900 dark:text-white mb-1">Merci pour ton retour !</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chaque avis nous aide à itérer.</p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between p-4 pb-2">
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Une question rapide</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Sur une échelle de 0 à 10, recommanderais-tu HanaFlow à un collègue ?
                  </p>
                </div>
                <button
                  onClick={dismiss}
                  aria-label="Fermer"
                  className="h-6 w-6 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="px-4 pb-3">
                <div className="grid grid-cols-11 gap-1 mb-3">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setScore(i)}
                      className={`h-9 rounded text-xs font-bold transition-all ${
                        score === i
                          ? "bg-sap-blue text-white scale-110"
                          : i <= 6
                            ? "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                            : i <= 8
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                              : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3">
                  <span>Pas du tout</span>
                  <span>Absolument</span>
                </div>

                {score !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        score >= 9
                          ? "Super ! Une raison particulière ?"
                          : score >= 7
                            ? "Qu'est-ce qui te ferait passer à 10 ?"
                            : "Qu'est-ce qui te déçoit ? On veut savoir."
                      }
                      rows={2}
                      maxLength={2000}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sap-blue/40 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={submit}
                        disabled={pending}
                        className="btn-primary px-4 py-1.5 text-xs disabled:opacity-50"
                      >
                        {pending ? "Envoi…" : "Envoyer"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
