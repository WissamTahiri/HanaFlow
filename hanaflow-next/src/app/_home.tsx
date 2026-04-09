"use client";

import Link from "next/link";
import { motion } from "motion/react";

const GraduationIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const AwardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const MapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

const modules = [
  { code: "FI", name: "Finance", href: "/modules-sap/fi", color: "from-blue-500 to-blue-700", desc: "Comptabilité générale, fournisseurs, clients et immobilisations." },
  { code: "CO", name: "Controlling", href: "/modules-sap/co", color: "from-indigo-500 to-indigo-700", desc: "Centres de coûts, ordres internes et contrôle de gestion." },
  { code: "MM", name: "Materials Mgmt", href: "/modules-sap/mm", color: "from-sky-500 to-sky-700", desc: "Achats, gestion des stocks et valorisation des articles." },
  { code: "SD", name: "Sales & Distrib.", href: "/modules-sap/sd", color: "from-cyan-500 to-cyan-700", desc: "Commandes clients, livraisons, facturation et tarification." },
  { code: "HCM", name: "Human Capital", href: "/modules-sap/hcm", color: "from-teal-500 to-teal-700", desc: "Gestion RH, paie, temps et recrutement." },
  { code: "PP", name: "Production Plan.", href: "/modules-sap/pp", color: "from-emerald-500 to-emerald-700", desc: "Planification de la production, ordres de fabrication et MRP." },
];

const features = [
  { icon: <GraduationIcon />, title: "Cours structurés", desc: "Contenus pédagogiques par module SAP, du concept à la pratique." },
  { icon: <AwardIcon />,      title: "Certifications", desc: "Simulateurs d'examens avec corrections détaillées et certificats PDF." },
  { icon: <ZapIcon />,        title: "Gamification", desc: "Badges, XP et niveaux pour rester motivé tout au long de ton parcours." },
  { icon: <MapIcon />,        title: "Roadmap consultant", desc: "Chemin balisé pour devenir consultant SAP junior en partant de zéro." },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-accent py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur-sm border border-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              Plateforme SAP éducative gratuite
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Maîtrise SAP S/4HANA<br className="hidden sm:block" /> de zéro à consultant
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Apprends les modules SAP FI, CO, MM, SD, HCM et PP avec des cours interactifs,
              des simulateurs d&apos;examens et une roadmap consultant complète.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary px-8 py-3 text-base bg-white text-sap-blue hover:bg-slate-100">
                Commencer gratuitement →
              </Link>
              <Link href="/modules-sap" className="btn px-8 py-3 text-base border-2 border-white/40 text-white hover:bg-white/10">
                Explorer les modules
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-sap-blue border-b border-sap-blue-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-white text-sm font-medium">
            {[
              { value: "6", label: "Modules SAP" },
              { value: "50+", label: "Concepts clés" },
              { value: "6", label: "Simulateurs d'examen" },
              { value: "100%", label: "Gratuit" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-xl font-extrabold">{s.value}</span>
                <span className="text-white/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="py-20 bg-sap-gray-light dark:bg-sap-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Les modules SAP
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Plonge dans chaque domaine fonctionnel avec des cours progressifs et des exercices pratiques.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={mod.href} className="card group flex flex-col p-6 hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5">
                  <div className={`h-12 w-12 rounded-xl bg-linear-to-br ${mod.color} flex items-center justify-center text-white font-bold text-sm mb-4`}>
                    {mod.code}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">{mod.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{mod.desc}</p>
                  <span className="mt-4 text-sm font-semibold text-sap-blue dark:text-sap-accent group-hover:underline">
                    Voir le module →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Pourquoi HanaFlow ?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Une plateforme pensée pour aller vite et apprendre efficacement.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 text-center"
              >
                <div className="h-12 w-12 rounded-xl bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue dark:text-blue-300 flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sap-gray-light dark:bg-sap-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="card p-10 text-center bg-linear-to-br from-sap-blue to-sap-accent border-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Prêt à démarrer ta carrière SAP ?
            </h2>
            <p className="text-white/80 mb-8">
              Rejoins la plateforme gratuitement et commence dès aujourd&apos;hui.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-sap-blue font-bold hover:bg-slate-100 transition-all duration-150 active:scale-[0.98]">
              Créer mon compte →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
