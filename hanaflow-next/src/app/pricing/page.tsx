"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/analytics";

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
    ctaStyle: "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700",
    features: [
      { label: "6 modules SAP complets (FI, CO, MM, SD, PP, IA générative)", included: true },
      { label: "Chapitre 1 de chaque certification (aperçu)", included: true },
      { label: "Roadmap personnalisée (basique)", included: true },
      { label: "Suivi de progression (modules visités)", included: true },
      { label: "Chapitres 2-7 des certifications", included: false },
      { label: "Simulateurs d'examen complets (jusqu'à 80 questions par module)", included: false },
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
    color: "border-sap-blue dark:border-blue-500 ring-2 ring-sap-blue/20 dark:ring-blue-500/20",
    badge: { label: "Accès gratuit", color: "bg-sap-blue text-white" },
    // Pendant la phase de lancement : prix barré + 0€ mis en avant, pour
    // lever l'ambiguïté "9€/mois" vs "Activer gratuitement".
    launchFree: true,
    cta: "Activer Pro gratuitement",
    ctaStyle: "bg-sap-blue text-white hover:bg-sap-blue-dark",
    features: [
      { label: "6 modules SAP complets (FI, CO, MM, SD, PP, IA générative)", included: true },
      { label: "Chapitre 1 de chaque certification (aperçu)", included: true },
      { label: "Roadmap personnalisée (basique)", included: true },
      { label: "Suivi de progression (modules visités)", included: true },
      { label: "Chapitres 2-7 des certifications (FI, CO, MM, SD)", included: true },
      { label: "Simulateurs d'examen complets (format réel, jusqu'à 80 questions)", included: true },
      { label: "Quiz par chapitre avec explications détaillées", included: true },
      { label: "Badges et gamification", included: true },
      { label: "Roadmap personnalisée complète", included: true },
    ],
  },
  {
    id: "team",
    name: "Équipe",
    price: "Sur devis",
    period: "",
    desc: "Pour former plusieurs consultants SAP en entreprise ou en école.",
    color: "border-gray-200 dark:border-slate-700",
    badge: { label: "Écoles & entreprises", color: "bg-slate-700 text-white" },
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
    a: "Non. Les examens officiels SAP (C_TS4FI, C_TS4CO, etc.) sont passés directement sur SAP Training & Certification Hub (~500€ par voucher). HanaFlow vous prépare à ces examens mais ne les organise pas.",
  },
  {
    q: "Le plan Équipe est-il disponible maintenant ?",
    a: "Le plan Équipe est proposé sur devis, selon la taille de votre équipe ou promotion. Contactez-nous par email pour discuter de vos besoins (tableau de bord, suivi de progression, facturation entreprise).",
  },
];

export default function PricingPage() {
  const { isPro } = useSubscription();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);

  const handleProCta = () => {
    trackEvent("pro_cta_clicked");
    if (!isAuthenticated) { router.push("/register"); return; }
    router.push("/profil?upgrade=1");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-sap-dark">

      {/* Hero */}
      <div className="bg-linear-to-br from-slate-900 via-blue-900 to-sap-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Phase de lancement — Pro gratuit pour tous
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-balance">
              Le bon plan pour votre objectif SAP
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-8 text-pretty">
              Commencez gratuitement, passez au Pro quand vous êtes prêt à préparer votre certification.
            </p>

            {/* Toggle annuel/mensuel */}
            <div className="inline-flex items-center gap-3 bg-white/10 rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${!annual ? "bg-white text-slate-900" : "text-white/70 hover:text-white"}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${annual ? "bg-white text-slate-900" : "text-white/70 hover:text-white"}`}
              >
                Annuel
                <span className="text-xs bg-emerald-400 text-slate-900 px-1.5 py-0.5 rounded-full font-bold">-27%</span>
              </button>
            </div>
            <p className="mt-2 text-[11px] text-white/70">
              S&apos;appliquera à la fin de la phase de lancement
            </p>

            {/* Réassurance */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-white/50" /> Sans carte bancaire</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-white/50" /> Sans engagement</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-white/50" /> Annulation en 1 clic</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 pb-16">
        <div className="grid md:grid-cols-3 gap-5 md:items-start">
          {PLANS.map((plan, i) => {
            const launchFree = "launchFree" in plan && plan.launchFree;
            const isFeatured = plan.id === "pro";
            const displayPrice = annual && plan.annualPrice ? plan.annualPrice.split(" ")[0] : plan.price;
            const displayPeriod = annual && plan.annualPrice ? "/ an" : plan.period;
            return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl border-2 ${plan.color} overflow-hidden flex flex-col ${
                isFeatured ? "md:-mt-3 shadow-xl shadow-sap-blue/10" : "shadow-sm"
              }`}
            >
              {/* Badge */}
              <div className={`flex items-center justify-center ${isFeatured ? "h-10 bg-sap-blue" : "h-6"}`}>
                {plan.badge && (
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${isFeatured ? "text-white" : plan.badge.color}`}>
                    {plan.badge.label}
                  </span>
                )}
              </div>

              <div className="px-6 pb-6 pt-6 flex flex-col flex-1">
                {/* En-tête plan */}
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 min-h-[2rem]">{plan.desc}</p>
                  {/* Pendant le lancement (launchFree) : 0€ en avant, prix barré —
                      le badge "Lancement — Accès gratuit" et le CTA portent déjà
                      le message, pas besoin d'un 3e libellé. */}
                  <div className={`mt-4 flex items-end ${launchFree ? "gap-2" : "gap-1"}`}>
                    {launchFree && <span className="text-4xl font-black text-slate-900 dark:text-white">0€</span>}
                    <span
                      className={
                        launchFree
                          ? "text-xl font-bold text-slate-500 dark:text-slate-400 line-through mb-0.5"
                          : "text-4xl font-black text-slate-900 dark:text-white"
                      }
                    >
                      {displayPrice}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">{displayPeriod}</span>
                  </div>
                  {!launchFree && annual && plan.annualPrice && plan.id !== "free" && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                      Économisez 29€ par rapport au mensuel
                    </p>
                  )}
                </div>

                {/* CTA */}
                {plan.id === "free" ? (
                  isPro ? (
                    <div className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 mb-5 cursor-default">
                      Inclus dans votre offre Pro
                    </div>
                  ) : isAuthenticated ? (
                    <div className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 mb-5 cursor-default">
                      Plan actuel
                    </div>
                  ) : (
                    <Link
                      href="/register"
                      className={`block w-full py-2.5 text-center text-sm font-semibold rounded-xl transition-colors cursor-pointer mb-5 ${plan.ctaStyle}`}
                    >
                      {plan.cta}
                    </Link>
                  )
                ) : plan.id === "pro" ? (
                  isPro ? (
                    <div className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-sap-blue/10 text-sap-blue dark:text-blue-400 mb-5 cursor-default border border-sap-blue/30">
                      ✓ Plan actuel
                    </div>
                  ) : (
                    <button onClick={handleProCta} className="btn-cta w-full mb-5">
                      {plan.cta}
                    </button>
                  )
                ) : (
                  <Link
                    href="/ecoles#demande-demo"
                    className={`block w-full py-2.5 text-center text-sm font-semibold rounded-xl transition-colors cursor-pointer mb-5 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </Link>
                )}

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-2 text-sm ${f.included ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
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
            );
          })}
        </div>

        {/* Comparatif détaillé */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-10 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <h2 className="font-bold text-slate-900 dark:text-white">Comparatif détaillé</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50">
                  <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-300 w-1/2">Fonctionnalité</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Gratuit</th>
                  <th className="text-center px-4 py-3 font-semibold text-sap-blue dark:text-blue-400 bg-sap-blue/5">Pro</th>
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
                    <td className="px-6 py-3 text-slate-700 dark:text-slate-200">{label as string}</td>
                    <td className="px-4 py-3 text-center">{free ? <span className="inline-flex text-emerald-500"><CheckIcon /></span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                    <td className="px-4 py-3 text-center bg-sap-blue/5">{pro ? <span className="inline-flex text-emerald-500"><CheckIcon /></span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                    <td className="px-4 py-3 text-center">{team ? <span className="inline-flex text-emerald-500"><CheckIcon /></span> : <span className="text-slate-300 dark:text-slate-600">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-10 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6"
        >
          <h2 className="font-bold text-slate-900 dark:text-white mb-5">Questions fréquentes</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
              <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? "border-sap-blue/30 dark:border-blue-500/30" : "border-gray-100 dark:border-slate-700"}`}>
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                >
                  <span className="font-medium text-sm text-slate-900 dark:text-white">{item.q}</span>
                  <span className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180 text-sap-blue dark:text-blue-400" : ""}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 border-t border-gray-100 dark:border-slate-700 pt-3">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Des questions ?{" "}
            <Link href="/contact" className="text-sap-blue hover:underline">Contactez-nous</Link>
          </p>
          <Link href="/certifications" className="inline-flex items-center gap-2 text-sm text-sap-blue dark:text-blue-400 hover:underline font-medium">
            ← Voir les certifications disponibles
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
