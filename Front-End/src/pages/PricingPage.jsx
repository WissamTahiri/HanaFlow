import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useGamification } from "../context/GamificationContext.jsx";
import SEO from "../components/SEO.jsx";

const CheckIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const CrossIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: "0€",
    period: "pour toujours",
    desc: "Pour découvrir SAP et commencer sa formation.",
    color: "border-gray-200 dark:border-slate-700",
    badge: null,
    cta: "Commencer gratuitement",
    ctaStyle: "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700",
    features: [
      { label: "6 modules SAP complets (FI, CO, MM, SD, HCM, PP)", included: true },
      { label: "Chapitre 1 de chaque certification (aperçu)", included: true },
      { label: "Roadmap personnalisée (basique)", included: true },
      { label: "Suivi de progression (modules visités)", included: true },
      { label: "Chapitres 2-7 des certifications", included: false },
      { label: "Simulateurs d'examen (40 questions)", included: false },
      { label: "Quiz par chapitre avec explications", included: false },
      { label: "Badges et gamification", included: false },
      { label: "Roadmap personnalisée complète", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "9€",
    period: "/ mois",
    annualPrice: "79€ / an",
    desc: "Pour préparer sérieusement une certification SAP.",
    color: "border-sapBlue dark:border-blue-500 ring-2 ring-sapBlue/20 dark:ring-blue-500/20",
    badge: { label: "🚀 Lancement — Accès gratuit", color: "bg-sapBlue text-white" },
    cta: "Activer Pro gratuitement",
    ctaStyle: "bg-sapBlue text-white hover:bg-sapBlueDark",
    features: [
      { label: "6 modules SAP complets (FI, CO, MM, SD, HCM, PP)", included: true },
      { label: "Chapitre 1 de chaque certification (aperçu)", included: true },
      { label: "Roadmap personnalisée (basique)", included: true },
      { label: "Suivi de progression (modules visités)", included: true },
      { label: "Chapitres 2-7 des certifications (FI, CO, MM, SD)", included: true },
      { label: "Simulateurs d'examen (40 questions, format réel)", included: true },
      { label: "Quiz par chapitre avec explications détaillées", included: true },
      { label: "Badges et gamification", included: true },
      { label: "Roadmap personnalisée complète", included: true },
    ],
  },
  {
    id: "team",
    name: "Équipe",
    price: "29€",
    period: "/ mois",
    annualPrice: "249€ / an",
    desc: "Pour former plusieurs consultants SAP en entreprise.",
    color: "border-gray-200 dark:border-slate-700",
    badge: { label: "Bientôt disponible", color: "bg-slate-700 text-white" },
    cta: "Nous contacter",
    ctaStyle: "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600",
    features: [
      { label: "Tout le plan Pro", included: true },
      { label: "Jusqu'à 10 membres", included: true },
      { label: "Tableau de bord administrateur", included: true },
      { label: "Suivi de progression de l'équipe", included: true },
      { label: "Facturation entreprise (TVA)", included: true },
      { label: "Support prioritaire", included: true },
      { label: "Formation sur mesure (option)", included: true },
      { label: "Accès prioritaire aux nouvelles certifications", included: true },
      { label: "Intégration LMS sur demande", included: true },
    ],
  },
];

const FAQ = [
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui. L'abonnement Pro est sans engagement. Vous pouvez annuler à tout moment depuis votre profil et continuer à accéder au contenu jusqu'à la fin de la période payée.",
  },
  {
    q: "Comment fonctionne la phase de lancement gratuite ?",
    a: "Pendant la phase de lancement, le plan Pro est accessible gratuitement. Cela nous permet de collecter des retours et d'améliorer la plateforme avant d'activer la facturation. Vous serez prévenu par email avant tout changement de tarif.",
  },
  {
    q: "Quels moyens de paiement seront acceptés ?",
    a: "Nous intégrerons Stripe (carte bancaire, SEPA, Apple Pay, Google Pay) et potentiellement Revolut. La facturation sera disponible pour les entreprises (facture avec TVA).",
  },
  {
    q: "Les certifications SAP sont-elles incluses dans l'abonnement ?",
    a: "Non. Les examens officiels SAP (C_TS4FI_2023, etc.) sont passés directement sur SAP Training & Certification Hub (~500€ par voucher). HanaFlow vous prépare à ces examens mais ne les organise pas.",
  },
  {
    q: "Le plan Équipe est-il disponible maintenant ?",
    a: "Le plan Équipe est en cours de développement. Contactez-nous pour rejoindre la liste d'attente ou discuter d'un accès anticipé pour votre équipe.",
  },
];

export default function PricingPage() {
  const { isPro, upgradeToPro } = useSubscription();
  const { isAuthenticated } = useAuth();
  const { onProActivated } = useGamification();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [annual, setAnnual] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState(null);

  const handleProCta = async () => {
    if (!isAuthenticated) { navigate("/register"); return; }
    setUpgrading(true);
    setUpgradeError(null);
    try {
      await upgradeToPro();
      onProActivated();
      navigate("/dashboard");
    } catch {
      setUpgradeError("Une erreur est survenue. Réessaie dans un instant.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <>
      <SEO
        title="Tarifs — HanaFlow"
        description="Choisissez le plan HanaFlow adapté à votre objectif SAP. Gratuit pour démarrer, Pro pour préparer une certification, Équipe pour former vos collaborateurs."
        path="/pricing"
      />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-slate-950">

        {/* ── Hero dark ─────────────────────────────────── */}
        <div className="grain relative bg-slate-950 pt-24 pb-16 px-4 sm:px-6 overflow-hidden text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-sapBlue/15 blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
              🚀 Phase de lancement — Pro gratuit pour tous
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-white tracking-display mb-5">
              Le bon plan pour<br className="hidden sm:block" /> votre objectif SAP
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed mb-10">
              Commencez gratuitement, passez au Pro quand vous êtes prêt à préparer votre certification.
            </p>

            {/* Toggle annuel/mensuel */}
            <div className="inline-flex items-center gap-1 bg-white/8 rounded-full p-1 border border-white/10">
              <button onClick={() => setAnnual(false)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  !annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
                }`}>
                Mensuel
              </button>
              <button onClick={() => setAnnual(true)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"
                }`}>
                Annuel
                <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">-27%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 pb-16">
          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`card-interactive bg-white dark:bg-slate-900 rounded-2xl border-2 ${plan.color} overflow-hidden flex flex-col ${plan.id === "pro" ? "shadow-soft" : ""}`}
              >
                {/* Badge */}
                <div className="h-8 flex items-center justify-center">
                  {plan.badge && (
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${plan.badge.color}`}>
                      {plan.badge.label}
                    </span>
                  )}
                </div>

                <div className="px-6 pb-6 flex flex-col flex-1">
                  {/* En-tête plan */}
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{plan.desc}</p>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {annual && plan.annualPrice ? plan.annualPrice.split(" ")[0] : plan.price}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {annual && plan.annualPrice ? "/ an" : plan.period}
                      </span>
                    </div>
                    {annual && plan.annualPrice && plan.id !== "free" && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                        Économisez {plan.id === "pro" ? "29€" : "99€"} par rapport au mensuel
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  {plan.id === "free" ? (
                    isPro ? (
                      <div className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gray-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 mb-5 cursor-default">
                        Plan actuel
                      </div>
                    ) : (
                      <Link
                        to={isAuthenticated ? "/dashboard" : "/register"}
                        className={`block w-full py-2.5 text-center text-sm font-semibold rounded-xl transition-colors mb-5 ${plan.ctaStyle}`}
                      >
                        {isAuthenticated ? "Votre plan actuel" : plan.cta}
                      </Link>
                    )
                  ) : plan.id === "pro" ? (
                    isPro ? (
                      <div className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-sapBlue/10 text-sapBlue dark:text-blue-400 mb-5 cursor-default border border-sapBlue/30">
                        ✓ Plan actuel
                      </div>
                    ) : (
                      <button
                        onClick={handleProCta}
                        disabled={upgrading}
                        className={`btn-cta w-full py-2.5 text-sm font-semibold rounded-xl transition-colors mb-5 disabled:opacity-60 disabled:cursor-not-allowed ${plan.ctaStyle}`}
                      >
                        {upgrading ? "Activation…" : plan.cta}
                      </button>
                    )
                  ) : (
                    <a
                      href="mailto:contact@hanaflow.fr"
                      className={`block w-full py-2.5 text-center text-sm font-semibold rounded-xl transition-colors mb-5 opacity-70 cursor-not-allowed ${plan.ctaStyle}`}
                    >
                      {plan.cta}
                    </a>
                  )}

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className={`flex items-start gap-2 text-sm ${f.included ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                        {f.included
                          ? <span className="text-emerald-500 mt-0.5"><CheckIcon /></span>
                          : <span className="mt-0.5"><CrossIcon /></span>
                        }
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Erreur upgrade */}
          {upgradeError && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
              {upgradeError}
            </div>
          )}

          {/* Banner lancement */}
          <div className="mt-8 bg-sapBlue/8 border border-sapBlue/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                🎉 Phase de lancement — Accès Pro totalement gratuit
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Profitez de toutes les fonctionnalités Pro sans carte bancaire. Vous serez prévenu avant toute activation de la facturation.
              </p>
            </div>
            {!isPro && (
              <button
                onClick={handleProCta}
                disabled={upgrading}
                className="flex-shrink-0 px-5 py-2.5 bg-sapBlue text-white rounded-xl text-sm font-bold hover:bg-sapBlueDark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {upgrading ? "Activation…" : "Activer Pro gratuitement →"}
              </button>
            )}
          </div>

          {/* Comparatif détaillé */}
          <div className="mt-10 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="font-display font-semibold text-slate-900 dark:text-white tracking-tight-xl">Comparatif détaillé</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50">
                    <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-300 w-1/2">Fonctionnalité</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Gratuit</th>
                    <th className="text-center px-4 py-3 font-semibold text-sapBlue dark:text-blue-400">Pro</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Équipe</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Modules SAP complets (6)", true, true, true],
                    ["Chapitre 1 certifications (aperçu)", true, true, true],
                    ["Chapitres 2-7 certifications", false, true, true],
                    ["Simulateurs d'examen", false, true, true],
                    ["Quiz avec explications", false, true, true],
                    ["Badges & gamification", false, true, true],
                    ["Roadmap complète", false, true, true],
                    ["Gestion d'équipe (10 membres)", false, false, true],
                    ["Dashboard administrateur", false, false, true],
                    ["Facturation entreprise (TVA)", false, false, true],
                    ["Support prioritaire", false, false, true],
                  ].map(([label, free, pro, team], i) => (
                    <tr key={i} className="border-t border-gray-50 dark:border-slate-700/50 hover:bg-gray-50/50 dark:hover:bg-slate-700/20">
                      <td className="px-6 py-3 text-slate-700 dark:text-slate-200">{label}</td>
                      <td className="px-4 py-3 text-center">{free ? <span className="text-emerald-500">✓</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                      <td className="px-4 py-3 text-center">{pro ? <span className="text-emerald-500">✓</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                      <td className="px-4 py-3 text-center">{team ? <span className="text-emerald-500">✓</span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-10 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-5 tracking-tight-xl">Questions fréquentes</h2>
            <div className="space-y-2">
              {FAQ.map((item, i) => (
                <div key={i} className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="font-medium text-sm text-slate-900 dark:text-white">{item.q}</span>
                    <span className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 border-t border-gray-100 dark:border-slate-700 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA final */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Des questions ? Contactez-nous à{" "}
              <a href="mailto:contact@hanaflow.fr" className="text-sapBlue hover:underline">contact@hanaflow.fr</a>
            </p>
            <Link to="/certifications" className="inline-flex items-center gap-2 text-sm text-sapBlue dark:text-blue-400 hover:underline font-medium">
              ← Voir les certifications disponibles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
