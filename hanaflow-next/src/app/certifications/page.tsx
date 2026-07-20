"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import certCatalog from "@/data/cert-catalog.json";
import { certCode } from "@/lib/certCodes";

// Données de certification : toujours lues depuis cert-catalog.json (source
// de vérité, mise à jour par scripts/sap-cert-watch.mjs) — jamais hardcodées
// ici. Seuls l'habillage (couleur, libellés courts) reste local.
const CARD_STYLE: Record<string, { name: string; module: string; color: string }> = {
  fi: { name: "Financial Accounting",    module: "SAP FI",         color: "from-blue-600 to-blue-800" },
  co: { name: "Management Accounting",   module: "SAP CO",         color: "from-indigo-600 to-indigo-800" },
  mm: { name: "Materials Management",    module: "SAP MM",         color: "from-emerald-600 to-emerald-800" },
  sd: { name: "Sales & Distribution",    module: "SAP SD",         color: "from-purple-600 to-purple-800" },
  ai: { name: "Generative AI Developer", module: "SAP AI / Joule", color: "from-violet-600 to-fuchsia-700" },
  pp: { name: "Production Planning",     module: "SAP PP",         color: "from-rose-600 to-rose-800" },
};

const certifications = ["fi", "co", "mm", "sd", "ai", "pp"].map((id) => {
  const m = certCatalog.modules.find((mod) => mod.code.toLowerCase() === id)!;
  return {
    id,
    code: certCode(id),
    ...CARD_STYLE[id],
    level: m.level,
    questions: m.officialQuestions,
    duration: m.durationMin,
    chapters: m.chapters,
    passingScore: m.passingScore,
    priceEur: m.priceEur,
    targetRoles: m.targetRoles,
    available: true,
    path: `/certifications/${id}`,
  };
});

const lastVerifiedLabel = new Date(certCatalog.lastVerified).toLocaleDateString("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const FAQ_ITEMS = [
  { q: "Dois-je refaire la formation sur le site de SAP ?", a: "Non. Les cours officiels SAP ne sont pas obligatoires. Vous passez l'examen directement sur SAP Certification Hub après votre préparation sur HanaFlow." },
  { q: "Quel est le format de l'examen officiel ?", a: "Selon la certification : 60 à 80 questions, 120 à 180 minutes, seuil de réussite entre 64 % et 76 % (le détail exact est sur la fiche de chaque certification et la page Comparer). L'examen se passe en ligne (proctored) ou dans un centre de test agréé." },
  { q: "Combien coûte l'examen ?", a: "Un voucher d'examen SAP coûte environ 500 à 535 €. Il vous donne accès à une tentative. En cas d'échec, un 2ème voucher peut être acheté." },
];

export default function CertificationsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <div className="bg-linear-to-br from-slate-900 via-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/30">Certifications SAP</span>
              <span className="text-xs text-white/70">Format examen officiel</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Préparez votre certification SAP</h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mb-3 leading-relaxed">
              Des parcours de formation structurés, des quiz par chapitre et un simulateur d'examen complet — pour passer votre certification SAP en confiance.
            </p>
            <p className="text-xs text-white/50 mb-8">Référentiels d'examen vérifiés le {lastVerifiedLabel}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { step: "1", title: "Étudiez les chapitres", desc: "Contenu aligné sur le périmètre officiel de l'examen" },
                { step: "2", title: "Validez par les quiz", desc: "Quiz de chapitre dans le format des vraies questions SAP" },
                { step: "3", title: "Simulez l'examen", desc: "Questions chronométrées au format officiel avec résultats détaillés" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                  <span className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</span>
                  <div>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-xs text-white/70 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-gray-50 dark:bg-sap-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {/* Info examen officiel */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Comment fonctionne une certification SAP ?</p>
              <p>
                Vous vous formez ici sur HanaFlow, puis vous vous inscrivez et passez l'examen directement sur{" "}
                <a href="https://training.sap.com/certification" target="_blank" rel="noopener noreferrer" className="underline font-medium">SAP Training & Certification Hub</a>.
                Les cours officiels SAP ne sont pas obligatoires pour passer l'examen — vous pouvez passer directement l'examen après une bonne préparation.
              </p>
            </div>
          </div>

          {/* Grille de certifications */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Certifications disponibles</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">6 modules S/4HANA Cloud, contenu et quiz alignés sur le périmètre officiel de chaque examen.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {certifications.map((cert, i) => (
              <motion.div key={cert.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                {cert.available ? (
                  <Link href={cert.path} className="block group rounded-2xl">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 dark:hover:border-slate-600 group-focus-visible:shadow-lg group-focus-visible:-translate-y-0.5 group-focus-visible:border-blue-200 dark:group-focus-visible:border-slate-600">
                      <div className={`bg-linear-to-r ${cert.color} p-5 text-white`}>
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{cert.module}</span>
                          <span className="text-xs bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">Disponible</span>
                        </div>
                        <p className="text-xs text-white/70 font-mono">{cert.code}</p>
                        <h3 className="text-lg font-bold mt-1">{cert.name}</h3>
                      </div>
                      <div className="p-5">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{cert.questions}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">questions</p>
                          </div>
                          <div className="text-center border-x border-gray-100 dark:border-slate-700">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{cert.duration}<span className="text-sm">min</span></p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">durée examen</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{cert.chapters}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">chapitres</p>
                          </div>
                        </div>
                        {cert.targetRoles && cert.targetRoles.length > 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Pour qui ·</span> {cert.targetRoles.join(", ")}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                          <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Examen ≈ {cert.priceEur}&nbsp;€</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Niveau {cert.level} · Seuil : {cert.passingScore}&nbsp;%</p>
                          </div>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline whitespace-nowrap">Commencer →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden opacity-60">
                    <div className={`bg-linear-to-r ${cert.color} p-5 text-white`}>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{cert.module}</span>
                        <span className="text-xs bg-slate-400/20 text-slate-200 border border-slate-400/30 px-2 py-0.5 rounded-full font-semibold">Bientôt</span>
                      </div>
                      <p className="text-xs text-white/70 font-mono">{cert.code}</p>
                      <h3 className="text-lg font-bold mt-1">{cert.name}</h3>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-900 dark:text-white">{cert.questions}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">questions</p>
                        </div>
                        <div className="text-center border-x border-gray-100 dark:border-slate-700">
                          <p className="text-xl font-bold text-slate-900 dark:text-white">{cert.duration}<span className="text-sm">min</span></p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">durée examen</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-900 dark:text-white">{cert.chapters}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">chapitres</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Contenu en cours de rédaction</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* FAQ rapide */}
          <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Questions fréquentes</h3>
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {FAQ_ITEMS.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="py-1">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between gap-4 py-3 text-left"
                    >
                      <span className="font-medium text-sm text-slate-900 dark:text-white">{item.q}</span>
                      <span className={`flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </span>
                    </button>
                    {open && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 pb-4 leading-relaxed max-w-2xl">{item.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
