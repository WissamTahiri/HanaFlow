import React, { useState } from "react";
import { motion } from "motion/react";
import ModuleLayout from "../components/ModuleLayout";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─── Concepts clés ─── */
const KEY_CONCEPTS = [
  { code: "PA", label: "Personnel Administration", description: "Gestion administrative de l'employé : données personnelles, contrat, affectation, rémunération. Chaque employé a un numéro de personnel unique.", color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400" },
  { code: "OM", label: "Organizational Management", description: "Modélise la structure hiérarchique de l'entreprise : unités organisationnelles, postes, relations de reporting. Base du workflow d'approbation.", color: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400" },
  { code: "TM", label: "Time Management", description: "Suivi des heures travaillées, absences, quotas de congés et horaires. Les données temps alimentent directement le calcul de la paie.", color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/50 text-pink-700 dark:text-pink-400" },
  { code: "PY", label: "Payroll", description: "Calcul des salaires en tenant compte des heures, absences, primes et déductions. Génère des écritures FI (charges sociales, salaires nets, comptabilité).", color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400" },
  { code: "SF", label: "SuccessFactors", description: "Suite cloud RH de SAP pour les processus talent (recrutement, formation, évaluation, succession). Positionnée comme futur de HCM dans la stratégie SAP.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "EC", label: "Employee Central", description: "Core HR cloud dans SuccessFactors. Gère les données maîtres employés dans le cloud, souvent intégré à S/4HANA Finance et Payroll on-premise.", color: "bg-sapBlue/5 dark:bg-sapBlue/10 border-sapBlue/20 dark:border-sapBlue/30 text-sapBlue dark:text-sapAccent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 piliers du module HCM à maîtriser.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {KEY_CONCEPTS.map((c) => (
        <div key={c.code} className="rounded-xl border border-gray-100 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
          <div className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold mb-2 ${c.color}`}>{c.code}</div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{c.label}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.description}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── PA et OM ─── */
const PaOmSection = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Personnel Administration & Organizational Management</h2>
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">PA</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Personnel Administration</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">PA gère le cycle de vie administratif de chaque employé, de l'embauche à la sortie.</p>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {["Données personnelles (identité, coordonnées, statut marital).", "Contrat de travail (date d'embauche, type de contrat, statut).", "Affectation organisationnelle (poste, unité, grade, rémunération).", "Historique des changements (actions RH, promotions, transferts)."].map((i) => (
            <li key={i} className="flex gap-2"><CheckIcon />{i}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-600 text-white">OM</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Organizational Management</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">OM modélise la structure de l'organisation — base du reporting et des workflows d'approbation.</p>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {["Organigramme hiérarchique (unités organisationnelles).", "Postes et descriptions de poste.", "Relations de reporting et lignes hiérarchiques.", "Base du workflow d'approbation (congés, achats, notes de frais)."].map((i) => (
            <li key={i} className="flex gap-2"><CheckIcon />{i}</li>
          ))}
        </ul>
      </div>
    </div>
  </motion.section>
);

/* ─── Time & Payroll ─── */
const TimePayrollSection = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Time Management & Payroll</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">L'intégration Time → Payroll est critique pour la précision et la ponctualité des salaires.</p>
    <div className="space-y-3">
      {[
        { step: "1", label: "Time Recording", desc: "Saisie des heures travaillées, badgeage, télétravail. Les absences (maladie, congés) sont codifiées par des types d'absence spécifiques." },
        { step: "2", label: "Time Evaluation", desc: "Évaluation automatique des données temps : calcul des heures supplémentaires, primes de nuit, quotas de congés. Produit des wage types pour la paie." },
        { step: "3", label: "Payroll Run", desc: "Calcul des salaires nets : brut − cotisations − déductions + primes. Génère des documents FI (charges sociales, virements, comptabilité)." },
        { step: "4", label: "Post to FI", desc: "Le résultat de paie est posté en FI : débits charges salariales / crédits comptes de paie, banque et organismes sociaux." },
      ].map(({ step, label, desc }) => (
        <div key={step} className="flex gap-4 p-4 rounded-xl bg-red-50/50 dark:bg-red-900/5 border border-red-100 dark:border-red-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center">{step}</span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── SuccessFactors ─── */
const SuccessFactorsSection = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">SuccessFactors & Stratégie SAP HCM</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">SAP positionne SuccessFactors comme l'avenir de la gestion RH. HCM on-premise reste une option de continuité.</p>
    <div className="grid sm:grid-cols-3 gap-4 mb-5">
      {[
        { module: "Employee Central", desc: "Core HR cloud. Données maîtres employés, organigramme, mobilité. Remplace PA/OM on-premise.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400" },
        { module: "Talent Suite", desc: "Recrutement, formation (LMS), évaluation de performance, gestion de la succession — modules optionnels.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400" },
        { module: "Joule in SF", desc: "Intégration de l'IA générative : explication de la paie, assistance RH admin, analytics emploi.", color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40 text-orange-700 dark:text-orange-400" },
      ].map(({ module, desc, color }) => (
        <div key={module} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-xs font-bold mb-1">{module}</p>
          <p className="text-xs leading-relaxed opacity-90">{desc}</p>
        </div>
      ))}
    </div>
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Scénario hybride courant</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">Core Payroll + Time Management sur HCM S/4HANA (on-premise) + processus Talent et Employee Experience sur SuccessFactors (cloud). Les deux systèmes sont intégrés via SAP Integration Suite.</p>
    </div>
  </motion.section>
);

/* ─── Débouchés ─── */
const CareerBenefits = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
    className="grain relative bg-slate-950 rounded-2xl p-6 text-white overflow-hidden border border-white/8">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser HCM ?</h2>
    <p className="text-sm text-white/70 mb-5">Chaque entreprise a des employés — HCM est donc présent dans tous les secteurs. Les projets SuccessFactors sont en pleine croissance.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP HCM", desc: "Paramètre PA, OM, Time et Payroll dans les projets on-premise S/4HANA. Forte demande dans l'industrie et les services." },
        { title: "Consultant SuccessFactors", desc: "Implémente Employee Central, Recruiting, Learning ou Performance dans des projets cloud. Certification SF très valorisée." },
        { title: "Analyste RH SAP", desc: "Côté client — exploite les données HCM pour les reportings RH, le suivi des effectifs et les budgets salariaux." },
        { title: "Expert Payroll SAP", desc: "Spécialiste de la paie on-premise. Profil rare et très demandé pour la conformité sociale dans les grands groupes." },
      ].map(({ title, desc }) => (
        <div key={title} className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-sm font-semibold mb-1">{title}</p>
          <p className="text-xs text-white/70 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);


/* ─── Quiz ─── */
const QUIZ_QUESTIONS = [
  { id: 1, question: "Quel est l'objectif principal du module SAP HCM classique (on-premise) ?", options: ["Gérer les stocks et la logistique", "Gérer le cycle de vie des employés (données perso, organisation, temps, paie)", "Gérer la comptabilité externe"], answer: 1, explanation: "SAP HCM couvre la gestion administrative RH : Personnel Administration, Organizational Management, Time Management et Payroll." },
  { id: 2, question: "Quel sous-module HCM gère la structure hiérarchique de l'entreprise (postes, unités orga) ?", options: ["Personnel Administration (PA)", "Organizational Management (OM)", "Time Management"], answer: 1, explanation: "OM modélise l'organisation : unités, postes, relations hiérarchiques." },
  { id: 3, question: "Time Management dans SAP HCM sert principalement à :", options: ["Suivre les heures travaillées, absences et quotas", "Gérer les factures fournisseurs", "Planifier la production"], answer: 0, explanation: "Time Management gère horaires, pointages, absences, quotas de congés, et prépare les données pour la paie." },
  { id: 4, question: "Quel est le lien clé entre Time Management et Payroll en HCM ?", options: ["La Time Evaluation transforme les données temps en éléments paie", "Les factures fournisseurs", "Les ordres de fabrication"], answer: 0, explanation: "La Time Evaluation évalue les heures, primes, absences et génère des wage types pour la paie." },
  { id: 5, question: "Vrai ou Faux : dans la stratégie SAP actuelle, SuccessFactors est la solution HCM d'avenir pour S/4HANA.", options: ["Vrai", "Faux"], answer: 0, explanation: "SAP positionne SuccessFactors comme solution HCM stratégique, avec HCM for S/4HANA comme option de continuité on-premise." },
  { id: 6, question: "Quel composant SuccessFactors est souvent utilisé comme core RH (master data employés) dans les scénarios cloud ?", options: ["Employee Central", "Learning", "Compensation"], answer: 0, explanation: "Employee Central est le core HR cloud, souvent intégré à S/4HANA Finance et Payroll." },
  { id: 7, question: "Quelle est l'intégration typique dans un scénario hybride HCM S/4HANA + SuccessFactors ?", options: ["Tout HCM reste on-premise sans lien avec le cloud", "Core paie/temps on-premise, talent & expérience dans SuccessFactors", "Finance héberge les données RH"], answer: 1, explanation: "Un scénario courant : payroll/PA/Time sur HCM S/4HANA, Talent (Recruiting, Learning…) sur SuccessFactors." },
  { id: 8, question: "Vrai ou Faux : Joule commence à être intégré dans SuccessFactors pour des cas d'usage RH (ex : explain my pay).", options: ["Vrai", "Faux"], answer: 0, explanation: "Les releases SuccessFactors 2025 introduisent des fonctionnalités Joule pour expliquer la paie et assister les HR admins." },
  { id: 9, question: "Quelle combinaison est typiquement critique pour la conformité et la satisfaction des employés ?", options: ["FI + MM", "Time Management + Payroll intégrés", "SD + CO"], answer: 1, explanation: "L'intégration Temps/Paie impacte directement l'exactitude et la ponctualité des salaires." },
  { id: 10, question: "Quel avantage clé apporte l'intégration Time–Payroll selon les études récentes ?", options: ["Augmenter le stock de matières", "Réduire fortement la saisie manuelle et les erreurs de paie", "Supprimer le besoin de contrôles qualité"], answer: 1, explanation: "Les études montrent une réduction importante de la saisie manuelle, des erreurs et un gain de productivité RH." },
];

const HcmQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = QUIZ_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Quiz HCM — 10 questions</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Valide tes connaissances sur PA/OM, Time & Payroll et SuccessFactors.</p>
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{q.id}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                let cls = "w-full text-left text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ";
                if (!submitted) cls += selected ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium" : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-red-400/60";
                else if (isCorrect) cls += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium";
                else if (selected) cls += "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                else cls += "border-gray-100 dark:border-slate-700 text-slate-400 dark:text-slate-500";
                return <button key={idx} type="button" disabled={submitted} onClick={() => !submitted && setAnswers((p) => ({ ...p, [q.id]: idx }))} className={cls}>{opt}</button>;
              })}
            </div>
            {submitted && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">{q.explanation}</p>}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? <button type="button" onClick={() => setSubmitted(true)} className="btn-primary px-6 py-2.5">Valider mes réponses</button> : <>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Score : <span className="gradient-text text-base">{score} / {QUIZ_QUESTIONS.length}</span></div>
          <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="btn-outline px-6 py-2.5 text-sm">Recommencer</button>
        </>}
      </div>
    </motion.section>
  );
};

/* ─── FAQ ─── */
const FAQ_ITEMS = [
  { q: "Quelle est la différence entre SAP HCM et SuccessFactors ?", a: "SAP HCM (on-premise) est le module RH historique intégré à S/4HANA : PA, OM, Time, Payroll. SuccessFactors est la suite cloud RH de SAP, centrée sur l'expérience employé et les processus talent. La stratégie SAP est de migrer progressivement vers SuccessFactors, avec HCM on-premise maintenu comme option." },
  { q: "Faut-il connaître les RH pour faire du SAP HCM ?", a: "Les bases RH aident : comprendre un contrat de travail, les absences, les conventions collectives. Mais HCM est avant tout un projet IT et fonctionnel. La compétence clé est de traduire les besoins RH du client (paie, horaires, organisation) en paramétrage SAP." },
  { q: "Comment la paie SAP s'intègre-t-elle à la comptabilité FI ?", a: "À la fin d'un cycle de paie, un posting FI est généré : débits des comptes de charges salariales et cotisations, crédits des comptes de paie à payer et virements banque. Ce document FI est créé automatiquement par le système selon la configuration des règles d'affectation comptable." },
  { q: "Qu'est-ce que la Time Evaluation dans SAP HCM ?", a: "La Time Evaluation est un programme SAP qui traite les données de pointage/absence et applique les règles de temps (heures sup, primes, repos compensateur). Le résultat est un ensemble de wage types prêts à être consommés par le calcul de la paie." },
  { q: "Est-ce que SAP HCM est encore pertinent avec SuccessFactors ?", a: "Oui, notamment pour la paie on-premise (Payroll) et la gestion du temps complexe. De nombreuses grandes entreprises maintiennent HCM on-premise pour la paie locale réglementaire, tout en adoptant SuccessFactors pour les processus talent et l'expérience employé." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP HCM.</p>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors" aria-expanded={openIndex === i}>
              <span>{item.q}</span><ChevronIcon open={openIndex === i} />
            </button>
            {openIndex === i && <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-3">{item.a}</div>}
          </div>
        ))}
      </div>
    </motion.section>
  );
};

/* ─── Ressources ─── */
const RESOURCES = [
  { title: "SAP HCM Overview — Documentation officielle SAP", href: "https://help.sap.com/docs/SAP_ERP/91e75b86f79a419abf9fcea1b66a9f76/8fa7578035e24bce8b5cddbe04a8eadf.html", source: "SAP Help" },
  { title: "SAP SuccessFactors — Vue d'ensemble", href: "https://www.sap.com/products/hcm/successfactors-hxm.html", source: "SAP.com" },
  { title: "SAP HCM Training Path — Learning", href: "https://learning.sap.com/", source: "SAP Learning" },
];

const HcmResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Documentation et formations officielles SAP pour HCM et SuccessFactors.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-red-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-red-500 dark:text-red-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─── Page principale ─── */
const HCM = () => (
  <ModuleLayout
    code="HCM"
    title="Human Capital Management"
    description="Maîtrisez la gestion des ressources humaines SAP : administration du personnel, temps, paie, SuccessFactors et la stratégie cloud RH de SAP."
    accent="#EC4899"
    badge="RH · Paie · SuccessFactors"
    seoTitle="Module SAP HCM – Human Capital Management"
    seoDescription="Apprenez le module SAP HCM : Personnel Administration, Organizational Management, Time Management, Payroll et SuccessFactors Employee Central."
    seoPath="/hcm"
  >
    <KeyConcepts />
    <PaOmSection />
    <TimePayrollSection />
    <SuccessFactorsSection />
    <CareerBenefits />

    <HcmQuiz />
    <HcmResources />
    <FaqAccordion />
  </ModuleLayout>
);

export default HCM;
