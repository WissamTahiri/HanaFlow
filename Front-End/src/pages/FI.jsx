import React, { useState } from "react";
import { motion } from "motion/react";
import ModuleLayout from "../components/ModuleLayout";

/* ─────────────────────────────────────────────────────────────
   Icônes SVG inline
───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   Concepts clés
───────────────────────────────────────────────────────────── */
const KEY_CONCEPTS = [
  {
    code: "GL",
    label: "General Ledger",
    description: "Le grand livre centralise toutes les écritures financières. En S/4HANA, il repose sur l'Universal Journal (ACDOCA) — une table unique FI + CO.",
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400",
  },
  {
    code: "AP",
    label: "Accounts Payable",
    description: "Comptabilité fournisseurs : enregistrement des factures, gestion des échéances, paiements et relances. Étroitement lié à MM pour les achats.",
    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400",
  },
  {
    code: "AR",
    label: "Accounts Receivable",
    description: "Comptabilité clients : factures de vente, suivi des encaissements, limites de crédit. Intégré à SD pour tout le flux Order-to-Cash.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400",
  },
  {
    code: "AA",
    label: "Asset Accounting",
    description: "Suivi complet des immobilisations : acquisition, mise en service, calcul des amortissements, cession. Impact direct sur les comptes GL.",
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400",
  },
  {
    code: "P2P",
    label: "Procure-to-Pay",
    description: "Commande → Réception → Facture (MIRO) → Paiement. Chaque étape génère une écriture FI qui alimente le grand livre et les comptes fournisseurs.",
    color: "bg-sapBlue/5 dark:bg-sapBlue/10 border-sapBlue/20 dark:border-sapBlue/30 text-sapBlue dark:text-sapAccent",
  },
  {
    code: "O2C",
    label: "Order-to-Cash",
    description: "Commande client → Livraison → Facturation SD → Encaissement. La facturation crée automatiquement un document FI avec TVA, revenus et poste client.",
    color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400",
  },
];

const KeyConcepts = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 notions fondamentales à maîtriser avant toute mission FI.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {KEY_CONCEPTS.map((c) => (
        <div key={c.code} className={`rounded-xl border p-4 ${c.color.split(" ").filter(cls => cls.startsWith("border")).join(" ")} bg-white dark:bg-slate-800`}>
          <div className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold mb-2 ${c.color}`}>
            {c.code}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{c.label}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.description}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Structure d'organisation FI
───────────────────────────────────────────────────────────── */
const OrgStructure = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Structure d'organisation FI</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Avant toute configuration, le consultant FI cartographie la structure financière du client.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Company Code", def: "Entité légale pour laquelle on produit bilan et compte de résultat." },
        { term: "Chart of Accounts", def: "Plan de comptes (commun ou spécifique) qui structure tous les comptes GL." },
        { term: "Fiscal Year Variant", def: "Définition de l'exercice comptable : périodes, calendrier, durée." },
        { term: "Posting Period Variant", def: "Contrôle de l'ouverture et fermeture des périodes comptables." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-sapBlue mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{term}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{def}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Processus métier
───────────────────────────────────────────────────────────── */
const Processes = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Processus métier FI</h2>

    <div className="space-y-6">
      {/* P2P */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-sapBlue text-white">P2P</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Procure-to-Pay — Achats intégrés FI/MM</h3>
        </div>
        <ol className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Demande d'achat et commande créées dans MM.",
            "Réception de marchandises (MM) — mise à jour du stock.",
            "Facture fournisseur (MIRO) — écriture FI : compte fournisseur + charge/stock.",
            "Paiement fournisseur (FI-AP) — écriture sur compte bancaire.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sapBlue/10 text-sapBlue text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* O2C */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-600 text-white">O2C</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Order-to-Cash — Ventes intégrées FI/SD</h3>
        </div>
        <ol className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Création de la commande client dans SD.",
            "Livraison et sortie de stock (PGI) — impact comptes stock et COGS.",
            "Facturation SD — document FI client créé automatiquement (AR, TVA, revenus).",
            "Encaissement client et lettrage du poste ouvert.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Clôture */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-600 text-white">CLOTURE</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Clôture comptable mensuelle</h3>
        </div>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Contrôle des périodes ouvertes et blocage des nouvelles écritures.",
            "Provisions, écritures d'ajustement, calcul des amortissements.",
            "Rapprochement des comptes (clients, fournisseurs, banques).",
            "Génération des états financiers : bilan, compte de résultat.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Intégration FI
───────────────────────────────────────────────────────────── */
const Integration = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration FI avec MM, SD et CO</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      FI n'est jamais isolé : chaque écriture est liée à un flux logistique ou à un objet de controlling.
    </p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { pair: "FI – MM", desc: "Comptes stock, GR/IR, TVA d'achat, charges directes. La facture MIRO génère l'écriture FI-AP.", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
        { pair: "FI – SD", desc: "Comptes clients, revenus, COGS, taxes. La facturation SD déclenche automatiquement le document FI-AR.", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" },
        { pair: "FI – CO", desc: "Chaque écriture FI peut être imputée sur un centre de coûts, un ordre interne ou un WBS pour l'analyse de rentabilité.", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40" },
      ].map(({ pair, desc, color }) => (
        <div key={pair} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-sm font-bold mb-1">{pair}</p>
          <p className="text-xs leading-relaxed opacity-90">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   S/4HANA Finance
───────────────────────────────────────────────────────────── */
const S4HANAFeatures = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.14 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Spécificités S/4HANA Finance</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Ce que S/4HANA change concrètement pour les consultants FI.</p>
    <div className="space-y-3">
      {[
        { title: "Universal Journal (ACDOCA)", desc: "Une seule table pour FI et CO — fini la réconciliation entre les deux modules. Reporting temps réel sans tables agrégées." },
        { title: "Fiori apps Finance", desc: "Tableaux de bord pour le CFO, cockpits de clôture, listes analytiques pour les comptables. Remplacement progressif du SAP GUI." },
        { title: "Clôture accélérée", desc: "Les analyses sont disponibles en temps réel. La durée de la clôture mensuelle est réduite de façon significative par rapport à l'ECC." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-sapBlue/5 dark:bg-sapBlue/10 border border-sapBlue/20">
          <div className="w-2 h-2 rounded-full bg-sapBlue mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Débouchés métier
───────────────────────────────────────────────────────────── */
const CareerBenefits = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.16 }}
    className="bg-gradient-to-br from-sapBlueDark to-sapBlue rounded-2xl p-6 text-white"
  >
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser FI ?</h2>
    <p className="text-sm text-white/70 mb-5">FI est le module le plus demandé en consulting SAP — il est présent dans chaque projet S/4HANA.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP FI/CO", desc: "Rôle phare en ESN et en cabinet. Intervient sur les phases de conception, paramétrage, tests et formation." },
        { title: "Analyste Finance SAP", desc: "Côté client — optimise les processus comptables et accompagne les équipes dans l'utilisation de S/4HANA Finance." },
        { title: "Chef de projet Finance", desc: "Coordination des flux FI dans un programme S/4HANA : pilotage des équipes, validation des KPIs de clôture." },
        { title: "Contrôleur de gestion SAP", desc: "Exploite l'Universal Journal pour produire des analyses de rentabilité et des reportings de direction." },
      ].map(({ title, desc }) => (
        <div key={title} className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm font-semibold mb-1">{title}</p>
          <p className="text-xs text-white/70 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   T-codes
───────────────────────────────────────────────────────────── */
const TCODES = [
  { code: "FB50", label: "Saisie écriture GL", usage: "Enregistrer une écriture comptable manuelle : ajustement, provision, reclassement." },
  { code: "FBL1N", label: "Liste postes fournisseurs", usage: "Analyser les postes ouverts/compensés d'un fournisseur. Utile en P2P et en clôture." },
  { code: "FBL5N", label: "Liste postes clients", usage: "Analyser les postes ouverts clients, suivi des encaissements en O2C." },
  { code: "FAGLL03", label: "Affichage écritures GL", usage: "Voir le détail des écritures sur un compte de bilan ou de résultat." },
];

const FiTcodes = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.18 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">T-codes FI essentiels</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les transactions SAP GUI à connaître pour un consultant ou un comptable junior.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {TCODES.map((t) => (
        <div key={t.code} className="border border-sapBlue/20 rounded-xl p-4 bg-sapBlue/5 dark:bg-sapBlue/10">
          <p className="text-xs font-bold text-sapBlue dark:text-sapAccent mb-1">{t.code} — {t.label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{t.usage}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   FAQ accordion
───────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "Quelle est la différence entre FI et CO ?",
    a: "FI (Financial Accounting) produit les états financiers légaux (bilan, compte de résultat). CO (Controlling) fournit des analyses internes de coûts et de rentabilité. En S/4HANA, les deux s'appuient sur l'Universal Journal, ce qui supprime la réconciliation.",
  },
  {
    q: "Faut-il connaître la comptabilité pour faire du SAP FI ?",
    a: "Oui, les bases sont indispensables : débits/crédits, bilan, compte de résultat, TVA. Un consultant FI traduit les exigences comptables du client en paramétrage SAP. Sans cette base, il est difficile de comprendre pourquoi une configuration est nécessaire.",
  },
  {
    q: "Qu'est-ce que l'Universal Journal (ACDOCA) concrètement ?",
    a: "C'est la table centrale de S/4HANA Finance. Chaque écriture (FI ou CO) est enregistrée dans ACDOCA avec tous ses attributs (centre de profit, segment, devise, etc.). Plus besoin de tables séparées FI et CO — le reporting est immédiat.",
  },
  {
    q: "Comment le module FI interagit-il avec MM ?",
    a: "Quand une marchandise est reçue (Good Receipt), une écriture stock est créée. Quand la facture fournisseur est enregistrée via MIRO, une écriture FI est générée : débit compte fournisseur, crédit compte charges/stock. L'intégration est automatique.",
  },
  {
    q: "SAP FI est-il toujours pertinent avec S/4HANA ?",
    a: "Absolument. S/4HANA Finance est une évolution de FI, pas un remplacement. Les fondements (GL, AP, AR, AA) restent identiques. Ce qui change : la table de données (ACDOCA), l'interface (Fiori) et les performances (temps réel). La demande de consultants FI reste très forte.",
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP FI.</p>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{item.q}</span>
              <ChevronIcon open={openIndex === i} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
};

/* ─────────────────────────────────────────────────────────────
   Mini-projet checklist
───────────────────────────────────────────────────────────── */
const CHECKLIST_ITEMS = [
  "Cartographier la structure FI (Company Codes, plan de comptes, fiscal year).",
  "Documenter le flux Procure-to-Pay côté FI (comptes impactés à chaque étape).",
  "Documenter le flux Order-to-Cash côté FI (clients, revenus, COGS, TVA).",
  "Préparer 5 cas de test FI : P2P, O2C, immobilisation, écriture GL manuelle, clôture simple.",
  "Comprendre les impacts de l'Universal Journal sur le reporting FI/CO.",
  "Identifier les principales Fiori apps Finance utilisées par les comptables.",
  "Expliquer à un key user la différence GL / AP / AR / AA.",
  "Être capable de lire et expliquer un document FI complet (en-tête + positions).",
];

const FiMiniProjectChecklist = () => {
  const [done, setDone] = useState(Array(CHECKLIST_ITEMS.length).fill(false));
  const completedCount = done.filter(Boolean).length;
  const progress = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 shadow-card p-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Mini-projet FI</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Simule une mission de déploiement S/4HANA Finance. Coche chaque compétence au fur et à mesure.
      </p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Progression</span>
          <span>{completedCount} / {CHECKLIST_ITEMS.length} ({progress}%)</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ul className="space-y-2">
        {CHECKLIST_ITEMS.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setDone((prev) => { const c = [...prev]; c[idx] = !c[idx]; return c; })}
              className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                done[idx] ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 dark:border-slate-600"
              }`}
            >
              {done[idx] && <CheckIcon />}
            </button>
            <span className={`text-sm ${done[idx] ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

/* ─────────────────────────────────────────────────────────────
   Quiz interactif
───────────────────────────────────────────────────────────── */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Quel objet représente une entité légale pour laquelle on produit un bilan et un compte de résultat ?",
    options: ["Controlling Area", "Company Code", "Profit Center"],
    answer: 1,
    explanation: "Le Company Code est l'unité légale de base pour les états financiers dans SAP FI.",
  },
  {
    id: 2,
    question: "Dans un processus P2P standard (MIRO), quels comptes FI sont généralement impactés ?",
    options: ["Compte client et compte de revenus", "Compte fournisseur et compte de charges/stock", "Compte d'immobilisation et compte d'amortissement"],
    answer: 1,
    explanation: "La facture fournisseur impacte le compte fournisseur (AP) et un compte de charges ou de stock selon la nature de l'achat.",
  },
  {
    id: 3,
    question: "Quel est l'apport principal de l'Universal Journal (ACDOCA) en S/4HANA Finance ?",
    options: ["Séparer FI et CO dans deux tables", "Fusionner FI et CO dans une seule table", "Supprimer la comptabilité fournisseurs"],
    answer: 1,
    explanation: "ACDOCA centralise FI et CO, ce qui simplifie le reporting temps réel FI/CO.",
  },
  {
    id: 4,
    question: "Quel sous-module FI gère les immobilisations et leurs amortissements ?",
    options: ["Accounts Receivable (AR)", "Asset Accounting (AA)", "General Ledger (GL)"],
    answer: 1,
    explanation: "AA gère tout le cycle de vie des immobilisations (acquisition, mise en service, amortissement, cession).",
  },
  {
    id: 5,
    question: "Vrai ou Faux : dans un flux Order-to-Cash, la facturation SD crée automatiquement un document FI client.",
    options: ["Vrai", "Faux"],
    answer: 0,
    explanation: "La facture SD génère un document FI en clients (AR) avec TVA, revenus et comptes clients.",
  },
  {
    id: 6,
    question: "La Fiscal Year Variant sert principalement à :",
    options: ["Définir les devises utilisées", "Définir la structure de l'exercice comptable", "Définir les organisations d'achat"],
    answer: 1,
    explanation: "La Fiscal Year Variant définit la longueur de l'exercice, les périodes et leur calendrier.",
  },
  {
    id: 7,
    question: "Quel sous-module FI gère la relance des fournisseurs et les lots de paiements ?",
    options: ["GL", "AP", "AR"],
    answer: 1,
    explanation: "AP (Accounts Payable) couvre la gestion des fournisseurs, des échéances et des paiements.",
  },
  {
    id: 8,
    question: "Dans un contexte S/4HANA Finance, quelles applications améliorent l'expérience utilisateur Finance ?",
    options: ["SAP GUI uniquement", "Fiori apps Finance", "BW on HANA uniquement"],
    answer: 1,
    explanation: "Les Fiori apps Finance offrent des cockpits et listes analytiques temps réel pour les rôles Finance.",
  },
  {
    id: 9,
    question: "Vrai ou Faux : chaque écriture FI peut porter un objet de controlling (centre de coûts, ordre interne…).",
    options: ["Vrai", "Faux"],
    answer: 0,
    explanation: "C'est un point clé d'intégration FI–CO : les écritures FI peuvent être imputées sur des objets CO.",
  },
  {
    id: 10,
    question: "Dans la clôture mensuelle FI, quelle activité est typiquement réalisée ?",
    options: ["Création de commandes d'achat", "Planification MRP", "Provisions et écritures d'ajustement"],
    answer: 2,
    explanation: "La clôture FI implique souvent des provisions, ajustements et contrôles de cohérence avant les états financiers.",
  },
];

const FiQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = QUIZ_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.24 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Quiz FI — 10 questions</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Valide tes connaissances comme si tu préparais un entretien consultant FI/CO junior.
      </p>

      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {q.id}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                let cls = "w-full text-left text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ";
                if (!submitted) {
                  cls += selected
                    ? "border-sapBlue bg-sapBlue/10 text-sapBlue dark:text-sapAccent font-medium"
                    : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-sapBlue/40 hover:bg-sapBlue/5";
                } else if (isCorrect) {
                  cls += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium";
                } else if (selected) {
                  cls += "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                } else {
                  cls += "border-gray-100 dark:border-slate-700 text-slate-400 dark:text-slate-500";
                }
                return (
                  <button key={idx} type="button" disabled={submitted} onClick={() => !submitted && setAnswers((p) => ({ ...p, [q.id]: idx }))} className={cls}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button type="button" onClick={() => setSubmitted(true)} className="btn-primary px-6 py-2.5">
            Valider mes réponses
          </button>
        ) : (
          <>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Score : <span className="gradient-text text-base">{score} / {QUIZ_QUESTIONS.length}</span>
            </div>
            <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="btn-outline px-6 py-2.5 text-sm">
              Recommencer
            </button>
          </>
        )}
      </div>
    </motion.section>
  );
};

/* ─────────────────────────────────────────────────────────────
   Ressources
───────────────────────────────────────────────────────────── */
const RESOURCES = [
  { title: "S4F12 – Basics of Customizing for Financial Accounting", href: "https://training.sap.com/course/s4f12-basics-of-customizing-for-financial-accounting-gl-ap-ar-in-sap-s4hana-classroom-026-pt-en", source: "SAP Training" },
  { title: "Training Path – Financial Accounting in SAP S/4HANA", href: "https://training.sap.com/trainingpath/Applications-Financial+Accounting-SAP+S4HANA", source: "SAP Training" },
  { title: "Customizing Core Settings in FI – SAP S/4HANA", href: "https://learning.sap.com/courses/customizing-core-settings-in-financial-accounting-in-sap-s4hana", source: "SAP Learning" },
  { title: "SAP FICO Guide 2025", href: "https://skillstek.com/sap-fico/", source: "Skillstek" },
  { title: "SAP S/4HANA FICO Online Training", href: "https://www.proexcellency.com/products/s4hana-fico-online-training", source: "Pro Excellency" },
  { title: "Finance (FI) Overview – GL, AP, AR, AA (vidéo)", href: "https://www.youtube.com/watch?v=gUfrn0jHvHs", source: "YouTube" },
];

const FiResources = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.26 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Contenus à jour (2024–2026) pour approfondir FI et S/4HANA Finance.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a
          key={r.href}
          href={r.href}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-sapBlue/40 hover:shadow-md transition-all group"
        >
          <span className="text-xs text-sapBlue dark:text-sapAccent font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-sapBlue dark:group-hover:text-sapAccent transition-colors leading-snug">
            {r.title}
          </span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────────── */
const FI = () => (
  <ModuleLayout
      code="FI"
      title="Financial Accounting"
      description="Maîtrisez la comptabilité externe SAP : grand livre, fournisseurs, clients, immobilisations et clôture financière sur S/4HANA."
      gradient="from-sapBlueDark via-sapBlue to-blue-500"
      badge="Comptabilité · Clôture · Reporting"
      seoTitle="Module SAP FI – Financial Accounting"
      seoDescription="Apprenez le module SAP FI (Financial Accounting) : GL, AP, AR, AA, flux P2P et O2C, clôture, Universal Journal S/4HANA et T-codes essentiels."
      seoPath="/fi"
    >
      <KeyConcepts />
      <OrgStructure />
      <Processes />
      <Integration />
      <S4HANAFeatures />
      <CareerBenefits />
      <FiTcodes />
      <FiMiniProjectChecklist />
      <FiQuiz />
      <FiResources />
      <FaqAccordion />
    </ModuleLayout>
);

export default FI;
