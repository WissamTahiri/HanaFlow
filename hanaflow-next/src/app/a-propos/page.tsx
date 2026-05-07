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
  { value: "10", label: "pages de contenu SAP" },
  { value: "60+", label: "concepts clés documentés" },
  { value: "100+", label: "questions de quiz" },
  { value: "4", label: "roadmaps par profil" },
];

const sapSkills = [
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
  { label: "React 18" },
  { label: "Next.js 16" },
  { label: "Tailwind CSS v4" },
  { label: "Node.js / Express" },
  { label: "PostgreSQL / Neon" },
  { label: "Prisma ORM" },
  { label: "JWT Auth" },
  { label: "Vercel" },
];

const faqItems = [
  { q: "HanaFlow remplace-t-il les formations officielles SAP ?", a: "Non. HanaFlow est un complément pédagogique — il structure et vulgarise les concepts SAP pour aider à comprendre le \"pourquoi\" avant de plonger dans les formations officielles (SAP Learning Hub, S4F12, etc.). L'idéal est d'utiliser les deux en parallèle." },
  { q: "À qui s'adresse HanaFlow ?", a: "À toute personne qui souhaite comprendre l'écosystème SAP S/4HANA : étudiants en informatique, personnes en reconversion, consultants juniors, key users ou tout profil curieux des métiers ERP. Le contenu est conçu pour être accessible, même sans background SAP." },
  { q: "Le contenu est-il à jour avec S/4HANA 2024 ?", a: "Oui — les pages couvrent les concepts S/4HANA actuels : Universal Journal (ACDOCA), SAP Fiori, Joule (IA générative), MRP Live, RISE with SAP et la méthodologie SAP Activate. Le contenu est régulièrement revu et enrichi." },
  { q: "HanaFlow est-il open source ?", a: "Le code source est disponible sur GitHub. HanaFlow est un projet personnel de portfolio SAP, développé en React + Node.js + Tailwind CSS. N'hésitez pas à l'explorer ou à contribuer." },
  { q: "Comment contacter Wissam Tahiri ?", a: "Via LinkedIn (lien ci-dessus) ou via GitHub. Je suis ouvert aux échanges autour de SAP S/4HANA, de l'IA dans l'écosystème SAP, et des opportunités de missions consultant." },
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
      label="À propos"
      title="HanaFlow & Wissam Tahiri"
      description="HanaFlow est mon laboratoire de consultant SAP — un espace où je structure mes apprentissages sur S/4HANA, FI/CO, MM, SD et l'IA Joule, comme si je préparais une vraie mission."
      gradient="from-slate-900 via-sap-blue-dark to-sap-blue"
      badge="Portfolio SAP · Projet personnel · Open source"
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
          <p>HanaFlow est une plateforme pédagogique SAP que j'ai conçue pour structurer ma montée en compétences sur SAP S/4HANA — comme si je préparais une vraie mission chez un client. Chaque module (FI, CO, MM, SD, HCM, PP) est documenté avec le vocabulaire clé, les processus métier, les intégrations inter-modules et des quiz pour valider les acquis.</p>
          <p>L'objectif est double : me servir de base de révision pour mes futures certifications SAP, et montrer à un recruteur comment je raisonne sur un système ERP complet — du P2P au O2C jusqu'au R2R.</p>
          <p>HanaFlow ne remplace pas les formations officielles SAP. Il les complète avec mon propre regard de futur consultant junior : mini-quiz, checklists "prêt pour la mission", roadmaps personnalisées et module dédié à l'IA avec Joule.</p>
        </div>
      </Section>

      {/* Ce que couvre HanaFlow */}
      <Section title="Ce que couvre HanaFlow">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {[
            { title: "6 modules SAP", desc: "FI, CO, MM, SD, HCM, PP — chacun avec hero, concepts clés, processus, quiz et FAQ.", icon: <BookIcon /> },
            { title: "S/4HANA & IA Joule", desc: "Universal Journal, Fiori, migration, agents IA, Joule Studio et cas d'usage.", icon: <CpuIcon /> },
            { title: "Processus métier", desc: "P2P, O2C, R2R expliqués étape par étape avec t-codes et diagrammes de flux.", icon: <RefreshIcon /> },
            { title: "Quizzes interactifs", desc: "10 questions par module avec correction instantanée et explications détaillées.", icon: <CheckCircleIcon /> },
            { title: "Roadmaps personnalisées", desc: "4 parcours (Finance, Supply, Sales, Tech) avec étapes concrètes par profil.", icon: <MapIcon /> },
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
          <Link href="/roadmap" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sap-blue/40 text-sap-blue dark:text-sap-accent text-sm font-semibold hover:bg-sap-blue/5 transition-colors">
            Générer ma roadmap →
          </Link>
        </div>
      </Section>

      {/* À propos de moi */}
      <Section title="À propos de moi – Wissam Tahiri">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="flex-shrink-0 flex items-start">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-sap-blue-dark to-sap-accent flex items-center justify-center text-white text-2xl font-extrabold shadow-soft">
              W
            </div>
          </div>
          <div className="flex-1 space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>Je m'appelle <strong className="text-slate-800 dark:text-white">Wissam Tahiri</strong> et je suis en formation Bac+5 en informatique, en alternance comme technicien support IT à Paris. J'ai une base solide en développement (Java, web, SQL) et en support utilisateur, que je mets progressivement au service du monde SAP.</p>
            <p>En parallèle de mes études, je me spécialise sur S/4HANA avec un focus sur les modules FI, MM, SD et CO, tout en m'intéressant à l'IA générative dans l'écosystème SAP — Joule, agents IA et cas d'usage métier.</p>
            <p>Avec HanaFlow, je construis un véritable portfolio SAP : chaque page représente un module ou un processus, documenté comme si je devais l'expliquer à un client ou à un key user. J'y combine mon expérience IT (vulgariser le technique, documenter clairement, orientation solution) avec une approche résolument "consultant".</p>
          </div>
        </div>
        <div className="rounded-2xl border border-sap-blue/15 p-5 bg-sap-blue/5 dark:bg-sap-blue/10 mb-6">
          <p className="text-sm font-semibold text-sap-blue dark:text-sap-accent mb-2">Ce que je cherche</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            À court terme, je cherche à contribuer à des projets S/4HANA sur les processus P2P, O2C et R2R, en particulier autour de FI/CO, MM et SD. Mon objectif est de devenir consultant fonctionnel SAP S/4HANA, capable de naviguer entre la finance, la supply chain et les sujets d'IA embarquée.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="https://www.linkedin.com/in/wissam-tahiri" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
          <a href="https://github.com/WissamTahiri/HanaFlow" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </a>
        </div>
      </Section>

      {/* Compétences SAP */}
      <Section title="Compétences SAP">
        <div className="flex flex-wrap gap-2 mb-4">
          {sapSkills.map((s) => (
            <span key={s.code} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${s.color}`}>
              <span className="font-bold">{s.code}</span>
              <span className="opacity-70 hidden sm:inline">· {s.label}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Focus principal : FI · CO · MM · SD · S/4HANA Finance · IA Joule</p>
      </Section>

      {/* Stack technique */}
      <Section title="Stack technique — HanaFlow">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {techStack.map((t) => (
            <div key={t.label} className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-gray-50 dark:bg-slate-800">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Déployé sur <span className="font-semibold">Vercel</span> (frontend) + <span className="font-semibold">Render</span> (backend) + <span className="font-semibold">PostgreSQL Neon</span>
        </p>
      </Section>

      <FaqAccordion />

      {/* CTA recruteur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
        className="bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-accent rounded-3xl p-8 text-white text-center"
      >
        <p className="text-sm uppercase tracking-widest font-semibold text-white/60 mb-3">Contact</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Échangeons autour de SAP</h2>
        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
          Mon profil et HanaFlow vous parlent ? Je suis ouvert aux échanges autour de vos besoins projets, de mes axes de progression, ou simplement de la meilleure manière de démarrer une carrière de consultant SAP aujourd'hui.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://www.linkedin.com/in/wissam-tahiri" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-sap-blue-dark text-sm font-bold hover:bg-white/90 transition-colors">
            Me contacter sur LinkedIn
          </a>
          <Link href="/modules-sap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
            Explorer HanaFlow
          </Link>
        </div>
      </motion.div>
    </PageLayout>
  );
}
