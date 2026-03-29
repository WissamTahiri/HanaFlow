import { Link } from "react-router-dom";
import { motion } from "motion/react";
import SEO from "../components/SEO.jsx";

const certifications = [
  {
    id: "fi",
    code: "C_TS4FI_2023",
    name: "Financial Accounting",
    module: "SAP FI",
    level: "Associate",
    questions: 80,
    duration: 180,
    chapters: 7,
    available: true,
    color: "from-blue-600 to-blue-800",
    accent: "bg-blue-600",
    path: "/certifications/fi",
  },
  {
    id: "co",
    code: "C_TS4CO_2023",
    name: "Management Accounting",
    module: "SAP CO",
    level: "Associate",
    questions: 80,
    duration: 180,
    chapters: 7,
    available: true,
    color: "from-indigo-600 to-indigo-800",
    accent: "bg-indigo-600",
    path: "/certifications/co",
  },
  {
    id: "mm",
    code: "C_TS4MM_2023",
    name: "Materials Management",
    module: "SAP MM",
    level: "Associate",
    questions: 80,
    duration: 180,
    chapters: 7,
    available: false,
    color: "from-orange-600 to-orange-800",
    accent: "bg-orange-600",
    path: "/certifications/mm",
  },
  {
    id: "sd",
    code: "C_TS4SD_2023",
    name: "Sales & Distribution",
    module: "SAP SD",
    level: "Associate",
    questions: 80,
    duration: 180,
    chapters: 7,
    available: false,
    color: "from-purple-600 to-purple-800",
    accent: "bg-purple-600",
    path: "/certifications/sd",
  },
];

export default function Certifications() {
  return (
    <>
      <SEO
        title="Préparation aux Certifications SAP"
        description="Préparez les certifications SAP officielles (C_TS4FI, C_TS4CO, etc.) avec des cours structurés, des quiz et un simulateur d'examen complet."
        path="/certifications"
      />
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 border border-white/30">
                  Certifications SAP
                </span>
                <span className="text-xs text-white/70">Format examen officiel</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
                Préparez votre certification SAP
              </h1>
              <p className="text-base sm:text-lg text-white/80 max-w-2xl mb-8">
                Des parcours de formation structurés, des quiz par chapitre et un simulateur
                d'examen complet — pour passer votre certification SAP en confiance.
              </p>
              {/* Comment ça marche */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "Étudiez les chapitres", desc: "Contenu aligné sur le périmètre officiel de l'examen" },
                  { step: "2", title: "Validez par les quiz", desc: "Quiz de chapitre dans le format des vraies questions SAP" },
                  { step: "3", title: "Simulez l'examen", desc: "40 questions chronométrées avec résultats détaillés" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                    <span className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {s.step}
                    </span>
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
        <div className="bg-gray-50 dark:bg-sapDark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            {/* Info examen officiel */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex gap-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Comment fonctionne une certification SAP ?</p>
                <p>
                  Vous vous formez ici sur HanaFlow, puis vous vous inscrivez et passez l'examen directement
                  sur <a href="https://training.sap.com/certification" target="_blank" rel="noopener noreferrer" className="underline font-medium">SAP Training & Certification Hub</a>.
                  Les cours officiels SAP ne sont pas obligatoires pour passer l'examen — vous pouvez
                  passer directement l'examen après une bonne préparation.
                </p>
              </div>
            </div>

            {/* Grille de certifications */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Certifications disponibles
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {cert.available ? (
                    <Link to={cert.path} className="block group">
                      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`bg-gradient-to-r ${cert.color} p-5 text-white`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                                {cert.module}
                              </span>
                            </div>
                            <span className="text-xs bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                              Disponible
                            </span>
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
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Niveau {cert.level} · Seuil de réussite : 65%
                            </span>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                              Commencer →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden opacity-60">
                      <div className={`bg-gradient-to-r ${cert.color} p-5 text-white`}>
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                            {cert.module}
                          </span>
                          <span className="text-xs bg-slate-400/20 text-slate-200 border border-slate-400/30 px-2 py-0.5 rounded-full font-semibold">
                            Bientôt
                          </span>
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
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                          Contenu en cours de rédaction
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* FAQ rapide */}
            <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                {[
                  {
                    q: "Dois-je refaire la formation sur le site de SAP ?",
                    a: "Non. Les cours officiels SAP ne sont pas obligatoires. Vous passez l'examen directement sur SAP Certification Hub après votre préparation sur HanaFlow."
                  },
                  {
                    q: "Quel est le format de l'examen officiel ?",
                    a: "80 questions à choix multiples, 180 minutes, seuil de réussite à 65%. L'examen se passe en ligne (proctored) ou dans un centre de test agréé."
                  },
                  {
                    q: "Combien coûte l'examen ?",
                    a: "Un voucher d'examen SAP coûte environ 500€. Il vous donne accès à une tentative. En cas d'échec, un 2ème voucher peut être acheté."
                  },
                ].map((item, i) => (
                  <div key={i} className="border-b border-gray-100 dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white mb-1">{item.q}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
