"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";

/**
 * ProGate — wrappe une page premium et la masque pour les comptes sans Pro.
 *
 * Comportements :
 *  - User non connecté → on laisse passer (la page elle-même peut être
 *    derrière ProtectedRoute si nécessaire ; sinon le serveur retourne 401)
 *  - User connecté + isPro=true → on rend les `children`
 *  - User connecté + isPro=false → paywall UI avec CTA vers /pricing
 *  - Admins : `useSubscription` les considère selon isPro réel en DB. Si tu
 *    veux qu'un admin voie tout sans payer, set isPro=true sur ton compte.
 *
 * On ne dépend PAS de cette gate seule pour la sécurité — les routes API
 * elles-mêmes utilisent `requireProUser` côté serveur. ProGate = UX/UI.
 */

type ProGateProps = {
  /** Nom court de la feature affiché dans le paywall (ex: "Mock Interview IA") */
  featureName: string;
  /** Une phrase qui décrit ce que l'utilisateur ratera. */
  featureDescription: string;
  /** Liste de bullets affichés sous "Ce que tu débloques" */
  perks?: string[];
  children: React.ReactNode;
};

export default function ProGate({ featureName, featureDescription, perks, children }: ProGateProps) {
  const { isAuthenticated, loading } = useAuth();
  const { isPro } = useSubscription();

  // Pendant le chargement initial du JWT/user, on évite de flasher la paywall.
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-sap-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  // Pas connecté → on laisse passer, ProtectedRoute ou la route serveur géreront.
  if (!isAuthenticated) return <>{children}</>;

  if (isPro) return <>{children}</>;

  return <Paywall featureName={featureName} featureDescription={featureDescription} perks={perks} />;
}

function Paywall({
  featureName,
  featureDescription,
  perks,
}: {
  featureName: string;
  featureDescription: string;
  perks?: string[];
}) {
  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card overflow-hidden border-0"
        >
          {/* Hero gradient */}
          <div className="bg-linear-to-br from-sap-blue-dark via-sap-blue to-blue-500 p-8 sm:p-10 text-white text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider mb-4">
              <LockIcon /> Réservé aux membres Pro
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-balance">{featureName}</h1>
            <p className="text-white/85 max-w-md mx-auto leading-relaxed">{featureDescription}</p>
          </div>

          {/* Perks + CTA */}
          <div className="p-8 sm:p-10">
            {perks && perks.length > 0 && (
              <>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-4 text-center">
                  Ce que tu débloques avec Pro
                </h2>
                <ul className="space-y-3 mb-8 max-w-md mx-auto">
                  {perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="shrink-0 mt-0.5 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckIcon />
                      </span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex flex-col items-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-sap-blue text-white font-bold hover:bg-sap-blue-dark transition-all active:scale-[0.98] shadow-[0_6px_24px_rgba(37,99,235,0.30)]"
              >
                Activer le plan Pro →
              </Link>
              <p className="text-[11px] text-slate-400 text-center">
                Garantie 14 jours · Annulation en un clic
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
              <Link
                href="/dashboard"
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ← Retour au dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
