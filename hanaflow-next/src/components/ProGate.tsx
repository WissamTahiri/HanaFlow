"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";

/**
 * ProGate — wrappe une page outil et la masque selon le statut du visiteur.
 *
 * Comportements :
 *  - Visiteur non connecté → teaser de la feature + CTA inscription/connexion
 *    (on ne redirige jamais : le visiteur voit ce qu'il rate)
 *  - User connecté + (isPro ou requirePro=false) → on rend les `children`
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
  /** Petits repères factuels affichés sous le titre (ex: "6 questions", "~15 s"). */
  meta?: string[];
  /** Icône de la feature (24×24, hérite de currentColor), affichée dans le bandeau. */
  icon?: React.ReactNode;
  /** Aperçu visuel du résultat obtenu, propre à chaque outil (mock statique). */
  preview?: React.ReactNode;
  /** false → un simple compte (gratuit) suffit, pas besoin de Pro. */
  requirePro?: boolean;
  children: React.ReactNode;
};

export default function ProGate({
  featureName,
  featureDescription,
  perks,
  meta,
  icon,
  preview,
  requirePro = true,
  children,
}: ProGateProps) {
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

  const paywallProps = { featureName, featureDescription, perks, meta, icon, preview };

  if (!isAuthenticated) {
    return <Paywall {...paywallProps} loggedOut />;
  }

  if (!requirePro || isPro) return <>{children}</>;

  return <Paywall {...paywallProps} />;
}

function Paywall({
  featureName,
  featureDescription,
  perks,
  meta,
  icon,
  preview,
  loggedOut = false,
}: {
  featureName: string;
  featureDescription: string;
  perks?: string[];
  meta?: string[];
  icon?: React.ReactNode;
  preview?: React.ReactNode;
  loggedOut?: boolean;
}) {
  const pathname = usePathname();
  return (
    <div className="relative min-h-screen bg-sap-gray-light dark:bg-sap-dark py-12 sm:py-20 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div className={`relative mx-auto px-4 sm:px-6 ${preview ? "max-w-5xl" : "max-w-2xl"}`}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`card overflow-hidden border-0 ${preview ? "grid lg:grid-cols-2" : ""}`}
        >
          {/* Colonne gauche — pitch + CTA */}
          <div className="flex flex-col">
            <div className="bg-linear-to-br from-sap-blue-dark via-sap-blue to-blue-500 p-8 sm:p-10 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider mb-5">
                <LockIcon /> {loggedOut ? "Compte requis" : "Réservé aux membres Pro"}
              </div>
              <div className="flex items-start gap-4 mb-4">
                {icon && (
                  <span className="shrink-0 h-11 w-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white">
                    {icon}
                  </span>
                )}
                <h1 className="text-3xl sm:text-[2.25rem] leading-[1.1] font-extrabold text-balance pt-0.5">
                  {featureName}
                </h1>
              </div>
              <p className="text-white/85 leading-relaxed">{featureDescription}</p>

              {meta && meta.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {meta.map((m, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center pl-3 pr-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-[11px] font-semibold text-white/90"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 sm:p-10 flex-1 flex flex-col">
              {perks && perks.length > 0 && (
                <>
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-4">
                    {loggedOut ? "Ce que tu débloques" : "Ce que tu débloques avec Pro"}
                  </h2>
                  <ul
                    className={`${
                      perks.length >= 5 ? "space-y-2.5 mb-6" : "space-y-3 mb-8"
                    }`}
                  >
                    {perks.map((p, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span className="shrink-0 mt-0.5 h-[18px] w-[18px] rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <CheckIcon />
                        </span>
                        <span className="leading-relaxed">{p}</span>
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-auto flex flex-col items-start gap-3">
                {loggedOut ? (
                  <>
                    <Link href="/register" className="btn-cta px-8 py-3.5 text-base w-full sm:w-auto justify-center">
                      Créer un compte gratuit →
                    </Link>
                    <p className="text-[11px] text-slate-400">
                      Déjà un compte ?{" "}
                      <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="text-sap-blue underline">
                        Se connecter
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
                    <Link href="/pricing" className="btn-cta px-8 py-3.5 text-base w-full sm:w-auto justify-center">
                      Activer le plan Pro →
                    </Link>
                    <p className="text-[11px] text-slate-400">Garantie 14 jours · Annulation en un clic</p>
                  </>
                )}

                <Link
                  href={loggedOut ? "/" : "/dashboard"}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mt-2"
                >
                  {loggedOut ? "← Retour à l'accueil" : "← Retour au dashboard"}
                </Link>
              </div>
            </div>
          </div>

          {/* Colonne droite — aperçu du résultat. Rendue uniquement si un
              aperçu est fourni : sans ça (ex: ProGate appelé sans prop
              `preview`, comme /emplois/[id]), pas de panneau vide à côté. */}
          {preview && (
            <div className="hidden lg:flex flex-col bg-gray-50 dark:bg-slate-900/40 border-l border-gray-100 dark:border-slate-700 p-8 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-3">
                Aperçu du résultat
              </span>
              <div className="flex-1 flex flex-col justify-start">{preview}</div>
            </div>
          )}
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
