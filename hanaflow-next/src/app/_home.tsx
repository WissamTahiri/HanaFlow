"use client";

import Link from "next/link";
import { motion } from "motion/react";
import certCatalog from "@/data/cert-catalog.json";
import TestimonialsSection from "@/components/TestimonialsSection";

/**
 * Home v6 — design d'origine HanaFlow polish + inspirations plateformes
 * de formation classiques.
 *
 * Restauré depuis la version d'origine :
 *  - Plus Jakarta Sans, palette sap-blue, cards rounded-xl, gradient hero
 *  - btn-primary / card / hero-gradient comme dans globals.css legacy
 *
 * Ajouts inspirés Udemy / SAP Learning / OpenClassrooms :
 *  - Section "Comment ça marche" 4 étapes avec icônes (style OpenClassrooms)
 *  - Section "Certifications préparées" avec les codes officiels SAP visibles
 *    (style SAP Learning Hub : trust signal pro fort)
 *  - Cards modules avec badge certification visible + meta (chapters / questions)
 *    style Udemy card
 *  - Trust line sous le hero (style OpenClassrooms "diplôme reconnu")
 */

const GraduationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const AwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const MapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const CertificateIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// Catalogue de modules + codes certifs : source de vérité dans
// src/data/cert-catalog.json (mis à jour automatiquement par le workflow
// scripts/sap-cert-watch.mjs déclenché chaque semaine via GitHub Actions).
const modules = certCatalog.modules;

const steps = [
  { num: "01", icon: <UserIcon />, title: "Crée ton compte", desc: "Inscription gratuite en 30 secondes, sans carte bancaire." },
  { num: "02", icon: <BookIcon />, title: "Étudie les modules", desc: "Sept chapitres progressifs par module, avec quiz à chaque étape." },
  { num: "03", icon: <TargetIcon />, title: "Passe le simulateur", desc: "40 questions en conditions réelles, corrections détaillées." },
  { num: "04", icon: <CertificateIcon />, title: "Obtiens ton certificat", desc: "Certificat PDF délivré dès 65 % de réussite au simulateur." },
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

      {/* ── HERO ── CTA refondu, dark-mode safe ─────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-400 py-20 sm:py-28">
        {/* Texture grid + bloom radial */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.08]" aria-hidden />
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.5), transparent 70%)" }} aria-hidden />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, rgba(147,197,253,0.5), transparent 70%)" }} aria-hidden />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* Eyebrow avec dot pulsant */}
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur-sm border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Plateforme SAP éducative · 100 % gratuit
            </span>

            {/* Headline : 1ère ligne en blanc, 2ème en italique + accent doux pour respiration */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.02] tracking-[-0.02em] mb-6 text-balance">
              Apprends SAP comme en école,
              <br className="hidden sm:block" />{" "}
              <span className="bg-linear-to-r from-white via-sky-100 to-blue-100 bg-clip-text text-transparent">
                obtiens un certificat reconnu.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              Modules FI, CO, MM, SD, PP, et désormais une certif IA générative. Cours structurés,
              simulateurs d&apos;examen alignés sur les certifications officielles SAP.
            </p>

            {/* CTA — primary button-in-button + secondary link discret */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 pl-7 pr-2 py-2 bg-white text-sap-blue-dark text-base font-bold rounded-full
                           shadow-[0_8px_24px_rgba(15,23,42,0.20)] hover:shadow-[0_12px_36px_rgba(15,23,42,0.30)]
                           transition-all duration-200 active:scale-[0.98]"
              >
                Commencer gratuitement
                <span className="ml-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-sap-blue text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:scale-105">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/modules-sap"
                className="inline-flex items-center gap-1.5 px-6 py-3 text-base text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Explorer les modules
                <span aria-hidden className="transition-transform duration-200 hover:translate-x-0.5">→</span>
              </Link>
            </div>

            {/* Micro proof line — sous les CTA, rassurant et concret */}
            <p className="text-sm text-white/60 mb-10">
              Compte créé en 30 secondes · sans carte bancaire · contenu certifiant officiel SAP
            </p>

            {/* Trust strip — codes officiels comme badges cliquables */}
            <div className="pt-8 mt-6 border-t border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60 mb-4">
                Aligné sur les certifications officielles SAP
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {modules.map((m) => (
                  <Link
                    key={m.cert}
                    href={m.href}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-sm border border-white/15 hover:border-white/30 transition-all"
                    title={m.certName}
                  >
                    <span className="text-[10px] font-bold text-white/80 group-hover:text-white">{m.code}</span>
                    <span className="text-[10px] text-white/40 group-hover:text-white/70 font-mono">{m.cert}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section className="bg-sap-blue border-b border-sap-blue-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-white text-center sm:text-left">
            {[
              { value: "6", label: "Modules SAP" },
              { value: "42", label: "Chapitres" },
              { value: "240+", label: "Questions d'examen" },
              { value: "100 %", label: "Gratuit" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline sm:items-center gap-2 justify-center sm:justify-start">
                <span className="text-2xl sm:text-3xl font-extrabold">{s.value}</span>
                <span className="text-sm text-white/80">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── style OpenClassrooms / Coursera ─────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
              Le parcours
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
              De zéro à consultant junior, en 4 étapes
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Un chemin clair, balisé, sans deviner ce que les recruteurs attendent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative card p-7 hover:shadow-medium transition-all duration-200"
              >
                {/* Ligne de connexion entre les étapes (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 w-6 h-0.5 bg-linear-to-r from-sap-blue/30 to-transparent" aria-hidden />
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold text-sap-blue/40 tracking-widest">{s.num}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULES SAP ── cards style Udemy ─────────────────────────── */}
      <section className="py-20 bg-sap-gray-light dark:bg-sap-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
              Les modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
              Six domaines fonctionnels SAP
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Chaque module prépare une certification officielle SAP. Cours, quiz et simulateur inclus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={mod.href} className="card-interactive group flex flex-col h-full p-6">
                  {/* En-tête : icône module + badge certif */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`h-14 w-14 rounded-2xl bg-linear-to-br ${mod.color} flex items-center justify-center text-white font-extrabold text-base shadow-soft`}>
                      {mod.code}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent">
                      {mod.cert}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{mod.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 flex-1">
                    {mod.desc}
                  </p>

                  {/* Meta-data : chapters + questions */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                      {mod.chapters} chapitres
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                      {mod.questions} questions
                    </span>
                  </div>

                  <span className="inline-flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700 text-sm font-bold text-sap-blue dark:text-sap-300">
                    Découvrir le module
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS PRÉPARÉES ── style SAP Learning Hub ───────── */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
                Certifications préparées
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 text-balance">
                Aligné sur les certifications officielles SAP
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Chaque module suit fidèlement le syllabus de la certification SAP
                correspondante. Le simulateur d&apos;examen reproduit les conditions
                réelles : 40 questions, scoring équivalent, corrections détaillées.
              </p>
              <Link href="/certifications" className="btn-primary">
                Voir les certifications →
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {modules.map((m) => (
                  <div
                    key={m.cert}
                    className="card p-4 hover:border-sap-blue/30 hover:shadow-soft transition-all duration-200"
                  >
                    <div className={`inline-flex h-10 w-10 rounded-lg bg-linear-to-br ${m.color} text-white text-sm font-bold items-center justify-center mb-3`}>
                      {m.code}
                    </div>
                    <p className="font-mono text-xs text-slate-900 dark:text-white font-semibold mb-0.5">{m.cert}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{m.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POURQUOI HANAFLOW ── features avec icônes ────────────────── */}
      <section className="py-20 bg-sap-gray-light dark:bg-sap-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
              Pourquoi HanaFlow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
              Tout ce dont tu as besoin, dans un seul endroit
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Une plateforme pensée pour aller vite et apprendre efficacement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 hover:shadow-soft transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-xl bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue dark:text-sap-accent flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages — affichés seulement s'il y en a en DB ──────── */}
      <TestimonialsSection />

      {/* ── CTA FINAL ── card gradient bleu propre ─────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-400 shadow-large">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 text-balance">
                Prêt à démarrer ta carrière SAP ?
              </h2>
              <p className="text-white/85 max-w-xl mx-auto mb-8 leading-relaxed">
                Inscription gratuite en 30 secondes. Aucune carte bancaire,
                aucune confirmation par étape.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-sap-blue font-bold text-base hover:bg-slate-100 transition-all duration-150 active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                Créer mon compte gratuit
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
