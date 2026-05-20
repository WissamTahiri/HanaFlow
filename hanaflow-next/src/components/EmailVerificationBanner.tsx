"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Bandeau discret rappelant à l'utilisateur de confirmer son email.
 * - Dismissable (cache jusqu'au prochain reload de session)
 * - Permet de renvoyer un email de vérification (1 click)
 * - N'apparaît pas pour les comptes déjà vérifiés ni pendant l'impersonation
 */
export default function EmailVerificationBanner() {
  const { user, token, isImpersonating } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  if (!user || isImpersonating || hidden) return null;
  // Si emailVerifiedAt n'est pas présent dans la réponse (anciens comptes pré-migration),
  // on considère prudemment qu'on ne sait pas → on cache pour ne pas spammer.
  if (user.emailVerifiedAt === undefined) return null;
  if (user.emailVerifiedAt) return null;

  const resend = async () => {
    if (!token) return;
    setSending(true);
    setMsg(null);
    try {
      const r = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
      });
      const d = await r.json();
      setMsg({ text: d.message ?? (r.ok ? "Email envoyé." : "Erreur"), ok: r.ok });
    } catch {
      setMsg({ text: "Erreur réseau", ok: false });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          <span className="truncate">
            Confirme ton email <strong>{user.email}</strong> pour sécuriser ton compte.
            {msg && (
              <span className={msg.ok ? "ml-2 text-emerald-700 dark:text-emerald-400" : "ml-2 text-red-700 dark:text-red-400"}>
                · {msg.text}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={resend}
            disabled={sending}
            className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-200 dark:bg-amber-800/60 hover:bg-amber-300 dark:hover:bg-amber-800 disabled:opacity-50"
          >
            {sending ? "Envoi…" : "Renvoyer l'email"}
          </button>
          <button
            onClick={() => setHidden(true)}
            aria-label="Fermer"
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-amber-200 dark:hover:bg-amber-800/60"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
