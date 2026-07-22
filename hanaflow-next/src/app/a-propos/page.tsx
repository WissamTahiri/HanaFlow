"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import PageLayout from "@/components/PageLayout";
import { HANAFLOW_STATS, QUESTIONS_TOTAL } from "@/config/stats";
import { CONTACT } from "@/config/contact";

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
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.29 6.84 9.63.5.1.68-.22.68-.49 0-.24-.01-1.02-.01-1.85-2.78.61-3.37-1.21-3.37-1.21-.45-1.17-1.11-1.48-1.11-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.19C22 6.58 17.52 2 12 2z"/>
  </svg>
);

const projectStats = [
  { value: `${HANAFLOW_STATS.modules}`, label: "modules SAP complets" },
  { value: `${HANAFLOW_STATS.lecons}`, label: "leçons documentées" },
  { value: `${QUESTIONS_TOTAL}`, label: "questions de quiz et d'examen" },
  { value: `${HANAFLOW_STATS.simulateurs}`, label: "simulateurs d'examen" },
];

const sapCoverage = [
  { code: "FI", label: "Financial Accounting", color: "bg-sap-blue/10 text-sap-blue dark:text-blue-300 border-sap-blue/20" },
  { code: "CO", label: "Controlling", color: "bg-sap-accent/10 text-sap-accent-dark dark:text-blue-300 border-sap-accent/20" },
  { code: "MM", label: "Materials Management", color: "bg-sap-blue/10 text-sap-blue dark:text-blue-300 border-sap-blue/20" },
  { code: "SD", label: "Sales & Distribution", color: "bg-sap-accent/10 text-sap-accent-dark dark:text-blue-300 border-sap-accent/20" },
  { code: "PP", label: "Production Planning", color: "bg-sap-blue/10 text-sap-blue dark:text-blue-300 border-sap-blue/20" },
  { code: "AI", label: "Generative AI Developer (C_AIG)", color: "bg-sap-accent/10 text-sap-accent-dark dark:text-blue-300 border-sap-accent/20" },
  { code: "S/4HANA", label: "ERP nouvelle génération", color: "bg-sap-blue/10 text-sap-blue dark:text-blue-300 border-sap-blue/20" },
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

const faqItems: { q: string; a: React.ReactNode }[] = [
  { q: "HanaFlow remplace-t-il les formations officielles SAP ?", a: "Non. HanaFlow est un complément pédagogique — il structure et vulgarise les concepts SAP pour aider à comprendre le \"pourquoi\" avant de plonger dans les formations officielles (SAP Learning Hub, S4F12, etc.). L'idéal est d'utiliser les deux en parallèle." },
  { q: "À qui s'adresse HanaFlow ?", a: "À toute personne qui souhaite comprendre l'écosystème SAP S/4HANA : étudiants en informatique, personnes en reconversion, consultants juniors, key users ou tout profil curieux des métiers ERP. Le contenu est conçu pour être accessible, même sans background SAP." },
  { q: "Le contenu est-il à jour avec S/4HANA 2024 ?", a: "Oui — les pages couvrent les concepts S/4HANA actuels : Universal Journal (ACDOCA), SAP Fiori, Joule (IA générative), MRP Live, RISE with SAP et la méthodologie SAP Activate. Le contenu est régulièrement revu et enrichi." },
  { q: "Puis-je passer la certification officielle après HanaFlow ?", a: "HanaFlow vous prépare aux certifications SAP Associate (C_TS4FI, C_TS4CO, C_TS452, C_TS460, C_TS422, C_AIG). Vous passez ensuite l'examen officiel directement sur SAP Training & Certification Hub, payant et indépendant d'HanaFlow." },
  {
    q: "En quoi HanaFlow diffère d'un MOOC classique ?",
    a: "Pas de vidéos à visionner en passif : chaque module combine leçons courtes, quiz immédiats et simulateurs d'examen calqués sur le format réel des certifications SAP. L'objectif n'est pas de \"suivre un cours\" mais de mesurer sa progression module par module, avec des scénarios métier concrets plutôt que des slides théoriques.",
  },
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
    <Section title="Questions fréquentes">
      <div className="space-y-3">
        {faqItems.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border border-sap-blue/15 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold hover:bg-sap-blue/5 dark:hover:bg-sap-blue/10 transition-colors"
              >
                <span>{item.q}</span>
                <span
                  className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-sap-blue/10 text-sap-blue text-sm transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-200 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</div>
                </div>
              </div>
            </div>
          );
        })}
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
            <div
              key={s.label}
              className="card-interactive cursor-default text-center border-sap-blue/15 p-4 bg-gray-50 dark:bg-slate-800 hover:border-sap-blue/30"
            >
              <p className="text-3xl font-extrabold text-sap-blue mb-1">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>HanaFlow est une plateforme pédagogique conçue pour rendre SAP S/4HANA accessible à tous — étudiants, profils en reconversion, key users et consultants juniors. Chaque module (FI, CO, MM, SD, PP, IA générative) est documenté avec le vocabulaire clé, les processus métier, les intégrations inter-modules et des quiz pour valider les acquis.</p>
          <p>L&apos;objectif : permettre à chaque apprenant de monter en compétences à son rythme et, s&apos;il le souhaite, de se présenter aux certifications officielles SAP avec un contenu de préparation aligné sur le périmètre des examens.</p>
          <p>HanaFlow ne remplace pas les formations officielles SAP. Il les complète avec une approche pédagogique structurée : leçons concises, concepts clés, T-codes, scénarios métier et roadmaps personnalisées.</p>
        </div>
      </Section>

      {/* Ce que couvre HanaFlow */}
      <Section title="Ce que couvre HanaFlow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {[
            { title: "6 modules SAP", desc: "FI, CO, MM, SD, PP, IA générative — chacun avec hero, concepts clés, processus, quiz et FAQ.", icon: <BookIcon /> },
            { title: "S/4HANA & IA Joule", desc: "Universal Journal, Fiori, migration, agents IA, Joule Studio et cas d'usage.", icon: <CpuIcon /> },
            { title: "Processus métier", desc: "P2P, O2C, R2R expliqués étape par étape avec t-codes et diagrammes de flux.", icon: <RefreshIcon /> },
            { title: "Quizzes interactifs", desc: "Questions par chapitre avec correction instantanée et explications détaillées.", icon: <CheckCircleIcon /> },
            { title: "Roadmaps personnalisées", desc: "Parcours par profil (Finance, Supply, Sales, Tech) avec étapes concrètes.", icon: <MapIcon /> },
            { title: "Débouchés métier", desc: "Rôles consultant, compétences recherchées et sens donné à chaque module.", icon: <BriefcaseIcon /> },
          ].map((item) => (
            <div
              key={item.title}
              className="card-interactive cursor-default border-sap-blue/15 p-4 bg-gray-50 dark:bg-slate-800 hover:border-sap-blue/30"
            >
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

      {/* Qui est derrière HanaFlow */}
      <Section title="Qui est derrière HanaFlow">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
          <div className="shrink-0 h-16 w-16 rounded-full bg-sap-dark text-white flex items-center justify-center text-lg font-extrabold ring-4 ring-sap-blue/15 shadow-soft">
            WT
          </div>
          <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              HanaFlow est conçu et développé par <span className="font-semibold text-slate-900 dark:text-white">Wissam Tahiri</span>,
              éditeur indépendant du projet. Pas d&apos;équipe marketing ni de levée de fonds : une plateforme construite pour
              résoudre un problème concret — la documentation SAP officielle est dense, coûteuse et rarement pensée pour
              l&apos;auto-formation.
            </p>
            <p>
              Le contenu (leçons, quiz, simulateurs d&apos;examen) est écrit, vérifié et maintenu directement à partir des
              référentiels de certification SAP, avec un seul objectif : que le contenu reste exact et à jour.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sap-blue hover:underline"
              >
                <LinkedInIcon /> LinkedIn
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sap-blue hover:underline"
              >
                <GitHubIcon /> GitHub
              </a>
            </div>
          </div>
        </div>
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
