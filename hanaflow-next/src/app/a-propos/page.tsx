"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import PageLayout from "@/components/PageLayout";

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const CpuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const projectStats = [
  { value: "6", label: "modules SAP complets" },
  { value: "60+", label: "concepts clés documentés" },
  { value: "200+", label: "questions de quiz" },
  { value: "6", label: "simulateurs d'examen" },
];

const sapCoverage = [
  { code: "FI", label: "Financial Accounting", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  { code: "CO", label: "Controlling", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  { code: "MM", label: "Materials Management", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  { code: "SD", label: "Sales & Distribution", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30" },
  { code: "HCM", label: "Human Capital Management", color: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30" },
  { code: "PP", label: "Production Planning", color: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30" },
  { code: "S/4HANA", label: "ERP nouvelle génération", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30" },
  { code: "Joule / IA", label: "IA générative SAP", color: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30" },
];

const techStack = [
  { label: "Next.js 16" },
  { label: "React 19" },
  { label: "Tailwind CSS v4" },
  { label: "TypeScript" },
  { label: "PostgreSQL / Neon" },
  { label: "Prisma ORM" },
  { label: "JWT + argon2id" },
  { label: "Vercel" },
];

const faqItems = [
  { q: "HanaFlow remplace-t-il les formations officielles SAP ?", a: "Non. HanaFlow est un complément pédagogique — il structure et vulgarise les concepts SAP pour aider à comprendre le \"pourquoi\" avant de plonger dans les formations officielles (SAP Learning Hub, S4F12, etc.). L'idéal est d'utiliser les deux en parallèle." },
  { q: "À qui s'adresse HanaFlow ?", a: "À toute personne qui souhaite comprendre l'écosystème SAP S/4HANA : étudiants en informatique, personnes en reconversion, consultants juniors, key users ou tout profil curieux des métiers ERP. Le contenu est conçu pour être accessible, même sans background SAP." },
  { q: "Le contenu est-il à jour avec S/4HANA 2024 ?", a: "Oui — les pages couvrent les concepts S/4HANA actuels : Universal Journal (ACDOCA), SAP Fiori, Joule (IA générative), MRP Live, RISE with SAP et la méthodologie SAP Activate. Le contenu est régulièrement revu et enrichi." },
  { q: "Puis-je passer la certification officielle après HanaFlow ?", a: "HanaFlow vous prépare aux certifications SAP Associate (C_TS4FI, C_TS4CO, C_TS4MM, C_TS4SD, C_THR81, C_TS422). Vous passez ensuite l'examen officiel directement sur SAP Training & Certification Hub, payant et indépendant d'HanaFlow." },
  { q: "Comment contacter HanaFlow ?", a: "Via la page contact ou par e-mail. Nous répondons aux demandes (support, partenariat école, RGPD) sous 48 heures ouvrées." },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-soft border border-sap-blue/10"
  >
    <h2 className="text-xl sm:text-2xl font-bold mb-5">{title}</h2>
    {children}
  </motion.section>
);

const FaqAccordion = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section title="FAQ">
      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <div key={i} className="border border-sap-blue/15 rounded-2xl overflow-hidden">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-sap-blue/5 dark:hover:bg-sap-blue/10 transition-colors">
              <span>{item.q}</span>
              <span className="ml-2 text-sap-blue text-base">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default function AboutPage() {
  return (
    <PageLayout
      label="Le projet"
      title="Le projet HanaFlow"
      description="HanaFlow est une plateforme éducative SAP : cours structurés, quiz interactifs et simulateurs d'examen pour préparer les certifications S/4HANA — du débutant au consultant junior."
      gradient="from-slate-900 via-sap-blue-dark to-sap-blue"
      badge="Plateforme SAP éducative · Préparation certifications"
    >
      {/* Stats projet */}
      <Section title="HanaFlow en chiffres">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {projectStats.map((s) => (
            <div key={s.label} className="text-center rounded-2xl border border-sap-blue/15 p-4 bg-gray-50 dark:bg-slate-800">
              <p className="text-3xl font-extrabold text-sap-blue mb-1">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>HanaFlow est une plateforme pédagogique conçue pour rendre SAP S/4HANA accessible à tous — étudiants, profils en reconversion, key users et consultants juniors. Chaque module (FI, CO, MM, SD, HCM, PP) est documenté avec le vocabulaire clé, les processus métier, les intégrations inter-modules et des quiz pour valider les acquis.</p>
          <p>L&apos;objectif : permettre à chaque apprenant de monter en compétences à son rythme et, s&apos;il le souhaite, de se présenter aux certifications officielles SAP avec un contenu de préparation aligné sur le périmètre des examens.</p>
          <p>HanaFlow ne remplace pas les formations officielles SAP. Il les complète avec une approche pédagogique structurée : leçons concises, concepts clés, T-codes, scénarios métier et roadmaps personnalisées.</p>
        </div>
      </Section>

      {/* Ce que couvre HanaFlow */}
      <Section title="Ce que couvre HanaFlow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {[
            { title: "6 modules SAP", desc: "FI, CO, MM, SD, HCM, PP — chacun avec hero, concepts clés, processus, quiz et FAQ.", icon: <BookIcon /> },
            { title: "S/4HANA & IA Joule", desc: "Universal Journal, Fiori, migration, agents IA, Joule Studio et cas d'usage.", icon: <CpuIcon /> },
            { title: "Processus métier", desc: "P2P, O2C, R2R expliqués étape par étape avec t-codes et diagrammes de flux.", icon: <RefreshIcon /> },
            { title: "Quizzes interactifs", desc: "Questions par chapitre avec correction instantanée et explications détaillées.", icon: <CheckCircleIcon /> },
            { title: "Roadmaps personnalisées", desc: "Parcours par profil (Finance, Supply, Sales, Tech) avec étapes concrètes.", icon: <MapIcon /> },
            { title: "Débouchés métier", desc: "Rôles consultant, compétences recherchées et sens donné à chaque module.", icon: <BriefcaseIcon /> },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-sap-blue/15 p-4 bg-gray-50 dark:bg-slate-800">
              <div className="h-9 w-9 rounded-xl bg-sap-blue/10 text-sap-blue dark:text-blue-300 flex items-center justify-center mb-3">{item.icon}</div>
              <p className="text-sm font-semibold mb-1">{item.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/modules-sap" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sap-blue text-white text-sm font-semibold hover:bg-sap-blue-dark transition-colors">
            Explorer les modules →
          </Link>
          <Link href="/roadmap" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sap-blue/40 text-sap-blue dark:text-blue-300 text-sm font-semibold hover:bg-sap-blue/5 transition-colors">
            Générer ma roadmap →
          </Link>
        </div>
      </Section>

      {/* Modules SAP couverts */}
      <Section title="Modules SAP couverts">
        <div className="flex flex-wrap gap-2 mb-4">
          {sapCoverage.map((s) => (
            <span key={s.code} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${s.color}`}>
              <span className="font-bold">{s.code}</span>
              <span className="opacity-70 hidden sm:inline">· {s.label}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Tous les modules majeurs SAP S/4HANA, plus une introduction à Joule et l&apos;IA générative dans l&apos;écosystème SAP.</p>
      </Section>

      {/* Stack technique */}
      <Section title="Stack technique">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {techStack.map((t) => (
            <div key={t.label} className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-gray-50 dark:bg-slate-800">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Application Next.js entièrement serverless déployée sur <span className="font-semibold">Vercel</span>, base de données <span className="font-semibold">PostgreSQL</span> hébergée chez <span className="font-semibold">Neon</span> (région Europe).
        </p>
      </Section>

      <FaqAccordion />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
        className="bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-400 rounded-3xl p-8 text-white text-center"
      >
        <p className="text-sm uppercase tracking-widest font-semibold text-white/60 mb-3">Prêt à démarrer ?</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Lancez votre formation SAP</h2>
        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
          Créez votre compte gratuitement et accédez à l&apos;ensemble des modules SAP. Aucun engagement, aucune carte bancaire requise.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-sap-blue-dark text-sm font-bold hover:bg-white/90 transition-colors">
            Créer mon compte gratuit →
          </Link>
          <Link href="/modules-sap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
            Explorer les modules
          </Link>
        </div>
      </motion.div>
    </PageLayout>
  );
}
