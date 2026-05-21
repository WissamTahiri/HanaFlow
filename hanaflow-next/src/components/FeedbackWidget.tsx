"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";

/**
 * FeedbackWidget — bouton flottant en bas-gauche (le bas-droite est pris
 * par le TutorChat). Ouvre un modal avec 2 textareas et un email optionnel
 * pour les utilisateurs anonymes.
 *
 * Caché sur les routes /admin (l'admin n'a pas besoin de s'auto-spammer).
 */

export default function FeedbackWidget() {
  const pathname = usePathname();
  const { getToken, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [goodWhat, setGoodWhat] = useState("");
  const [improveWhat, setImproveWhat] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Pas affiché côté admin ni sur les écrans qu'on ne veut pas polluer
  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password") return null;
  if (pathname?.startsWith("/verifier-certificat")) return null;

  const submit = async () => {
    if (!goodWhat.trim() && !improveWhat.trim()) {
      setError("Remplis au moins un des deux champs.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (isAuthenticated) {
        const token = await getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
      }
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          context: pathname || undefined,
          goodWhat: goodWhat.trim() || undefined,
          improveWhat: improveWhat.trim() || undefined,
          contactEmail: !isAuthenticated && contactEmail.trim() ? contactEmail.trim() : undefined,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur d'envoi");
        return;
      }
      setSent(true);
      setGoodWhat("");
      setImproveWhat("");
      setContactEmail("");
    } catch {
      setError("Erreur réseau, réessaie.");
    } finally {
      setPending(false);
    }
  };

  const close = () => {
    setOpen(false);
    setError("");
    setTimeout(() => setSent(false), 300);
  };

  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] text-xs font-semibold transition-all"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Envoyer un feedback"
      >
        <FeedbackIcon />
        <span className="hidden sm:inline">Feedback</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.20)] p-6 sm:p-7"
              onClick={(e) => e.stopPropagation()}
            >
              {sent ? (
                <div className="text-center py-6">
                  <div className="inline-flex h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                    <CheckIcon />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Merci pour ton retour !</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    Chaque feedback nous aide à améliorer HanaFlow. On lit tout.
                  </p>
                  <button onClick={close} className="btn-primary px-5 py-2 text-sm">Fermer</button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Donne ton avis sur HanaFlow</h2>
                    <button
                      onClick={close}
                      aria-label="Fermer"
                      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                    Anonyme par défaut. Ton retour nous aide à prioriser.
                  </p>

                  <label className="block mb-4">
                    <span className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                      Ce qui marche bien
                    </span>
                    <textarea
                      value={goodWhat}
                      onChange={(e) => setGoodWhat(e.target.value)}
                      placeholder="Ce que tu apprécies sur la plateforme..."
                      rows={3}
                      maxLength={2000}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                    />
                  </label>

                  <label className="block mb-4">
                    <span className="block text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                      Ce qui manque ou pourrait être amélioré
                    </span>
                    <textarea
                      value={improveWhat}
                      onChange={(e) => setImproveWhat(e.target.value)}
                      placeholder="Bugs, manques, idées de features..."
                      rows={3}
                      maxLength={2000}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
                    />
                  </label>

                  {!isAuthenticated && (
                    <label className="block mb-4">
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                        Email (optionnel — si tu veux qu&apos;on te recontacte)
                      </span>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="ton@email.com"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sap-blue/40"
                      />
                    </label>
                  )}

                  {error && <p className="text-xs text-red-600 dark:text-red-400 mb-3">{error}</p>}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={close}
                      className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={submit}
                      disabled={pending || (!goodWhat.trim() && !improveWhat.trim())}
                      className="btn-primary px-5 py-2 text-sm disabled:opacity-50"
                    >
                      {pending ? "Envoi..." : "Envoyer"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FeedbackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
