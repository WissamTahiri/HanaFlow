import React, { useState } from "react";
import { motion } from "motion/react";
import ModuleLayout from "../components/ModuleLayout";

/* ─────────────────────────────────────────────────────────────
   Icônes
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
   Concepts clés CO
───────────────────────────────────────────────────────────── */
const KEY_CONCEPTS = [
  {
    code: "CCA",
    label: "Cost Center Accounting",
    description: "Suivi des coûts par unité de responsabilité (service IT, production, RH…). Permet de comparer coûts planifiés et réels.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400",
  },
  {
    code: "PCA",
    label: "Profit Center Accounting",
    description: "Suivi des profits par business unit, ligne de produits ou région. Donne une vision P&L interne par segment.",
    color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400",
  },
  {
    code: "IO",
    label: "Internal Orders",
    description: "Objets temporaires pour suivre les coûts d'un projet, d'une campagne ou d'un événement avant de les solder vers d'autres objets CO.",
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400",
  },
  {
    code: "CO-PC",
    label: "Product Cost Controlling",
    description: "Calcul du coût standard des produits fabriqués. Suit le WIP (Work in Progress) et les variances sur ordres de production.",
    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400",
  },
  {
    code: "CO-PA",
    label: "Profitability Analysis",
    description: "Analyse de la rentabilité par dimensions métier : client, produit, région, canal de vente. Cœur du reporting de marge.",
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400",
  },
  {
    code: "ACDOCA",
    label: "Universal Journal",
    description: "En S/4HANA, FI et CO partagent la même table ACDOCA. Fini la réconciliation — le reporting est temps réel.",
    color: "bg-sapBlue/5 dark:bg-sapBlue/10 border-sapBlue/20 dark:border-sapBlue/30 text-sapBlue dark:text-sapAccent",
  },
];

const KeyConcepts = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 piliers du Controlling SAP à connaître pour une mission CO.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {KEY_CONCEPTS.map((c) => (
        <div key={c.code} className="rounded-xl border border-gray-100 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
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
   Objets CO
───────────────────────────────────────────────────────────── */
const CoObjects = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Structure d'organisation CO</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">CO répond à la question : "où et pourquoi les coûts sont-ils consommés ?"</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Controlling Area", def: "Périmètre CO regroupant un ou plusieurs Company Codes FI. Définit la structure de reporting interne." },
        { term: "Cost Center", def: "Unité de responsabilité où les coûts sont collectés : service IT, atelier de production, département commercial." },
        { term: "Profit Center", def: "Unité génératrice de profit par BU, produit ou région. Aligne le reporting interne avec la structure managériale." },
        { term: "Internal Order", def: "Objet temporaire pour suivre des coûts spécifiques (campagne, projet, événement) avant de les clôturer." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
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
   Cost Center & Profit Center
───────────────────────────────────────────────────────────── */
const CostProfitCenters = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Cost Centers & Profit Centers</h2>
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white">CCA</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Cost Centers</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Chaque coût (salaires, loyers, fournitures) est affecté à un cost center. Les managers analysent les écarts entre budget et réalisé.
        </p>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {["Collecte des coûts par unité fonctionnelle.", "Comparaison plan / réel mensuelle.", "Allocations de coûts entre centers (clé de répartition).", "Base du reporting de performance par département."].map((i) => (
            <li key={i} className="flex gap-2"><CheckIcon />{i}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-600 text-white">PCA</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Profit Centers</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Les profit centers permettent de produire un P&L interne par ligne de produits, par région ou par business unit.
        </p>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {["Vision revenus ET coûts par segment.", "Reporting managérial aligné sur l'organisation.", "Base du calcul de contribution par BU.", "Complément au reporting légal FI."].map((i) => (
            <li key={i} className="flex gap-2"><CheckIcon />{i}</li>
          ))}
        </ul>
      </div>
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   CO-PA
───────────────────────────────────────────────────────────── */
const CoPaSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">CO-PA — Profitability Analysis</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      CO-PA permet d'analyser la rentabilité par dimensions métier : client, produit, région, canal de distribution.
    </p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { title: "Analyse de marge", desc: "Revenus nets − COGS − remises = marge contributionnelle par segment produit/client.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400" },
        { title: "COGS Split", desc: "Ventilation du coût des marchandises vendues : matière, main-d'œuvre, overhead — pour identifier où les marges se perdent.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400" },
        { title: "Account-based CO-PA", desc: "Recommandé en S/4HANA : aligné sur l'Universal Journal, temps réel, sans réconciliation avec FI.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400" },
      ].map(({ title, desc, color }) => (
        <div key={title} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-sm font-bold mb-1">{title}</p>
          <p className="text-xs leading-relaxed opacity-90">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   S/4HANA CO
───────────────────────────────────────────────────────────── */
const S4HANAFeatures = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">CO dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Ce que S/4HANA change concrètement pour les consultants CO.</p>
    <div className="space-y-3">
      {[
        { title: "Universal Journal (ACDOCA)", desc: "FI et CO sont dans la même table. Les analyses de coûts et de rentabilité sont disponibles en temps réel, sans réconciliation périodique." },
        { title: "Account-based CO-PA en standard", desc: "L'approche account-based est désormais la référence. Elle garantit la cohérence avec FI et facilite les audits." },
        { title: "Fiori apps pour Controllers", desc: "Cockpits d'analyse cost centers, profit centers, CO-PA et product costing — sans SAP GUI, accessibles depuis n'importe quel navigateur." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/40">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
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
   Débouchés
───────────────────────────────────────────────────────────── */
const CareerBenefits = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
    className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-2xl p-6 text-white"
  >
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser CO ?</h2>
    <p className="text-sm text-white/70 mb-5">CO est demandé dans tous les projets S/4HANA Finance. Les profils FI/CO bénéficient d'une prime salariale significative.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP FI/CO", desc: "Rôle central dans les projets de transformation Finance. FI et CO sont souvent confiés au même consultant junior." },
        { title: "Controller SAP", desc: "Côté client — exploite CO-PA et cost centers pour les reportings mensuels et les budgets annuels." },
        { title: "Analyste CO-PA", desc: "Spécialiste de la rentabilité produit/client. Profil très recherché dans l'industrie et la distribution." },
        { title: "Consultant Product Costing", desc: "Expert en valorisation des stocks et coûts de production. Forte demande dans les entreprises manufacturières." },
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
   Quiz
───────────────────────────────────────────────────────────── */
const QUIZ_QUESTIONS = [
  { id: 1, question: "Quel est l'objectif principal du module CO dans SAP S/4HANA ?", options: ["Gérer la comptabilité légale externe", "Piloter les coûts et la rentabilité interne", "Gérer les stocks physiques"], answer: 1, explanation: "CO est dédié au controlling interne : analyse des coûts, marges, rentabilité par centre, produit, client." },
  { id: 2, question: "Un Cost Center est avant tout utilisé pour :", options: ["Mesurer les revenus par client", "Suivre les coûts d'une unité ou fonction", "Gérer les stocks par entrepôt"], answer: 1, explanation: "Un centre de coûts regroupe les coûts pour une unité de responsabilité (service, atelier…)." },
  { id: 3, question: "Un Profit Center est principalement utilisé pour :", options: ["Analyser les profits d'une business unit / ligne de produits", "Stocker les écritures FI brutes", "Gérer la paie"], answer: 0, explanation: "Un profit center représente une unité génératrice de revenus et de coûts (BU, région, ligne de produits)." },
  { id: 4, question: "CO-PA (Profitability Analysis) sert à :", options: ["Analyser la rentabilité par dimensions (client, produit, région…)", "Configurer le plan de comptes", "Gérer les immobilisations"], answer: 0, explanation: "CO-PA permet d'analyser marges et contributions par multiples segments de marché." },
  { id: 5, question: "Dans S/4HANA, quel type de CO-PA est fortement recommandé ?", options: ["Costing-based uniquement", "Account-based uniquement", "Account-based CO-PA (avec possibilité de coexistence costing-based)"], answer: 2, explanation: "S/4HANA pousse l'account-based CO-PA, aligné sur l'Universal Journal, tout en permettant la coexistence avec le costing-based." },
  { id: 6, question: "Quel type d'objet est typiquement utilisé pour suivre les coûts d'un projet interne ou d'une campagne marketing ?", options: ["Cost Center", "Internal Order", "Profit Center"], answer: 1, explanation: "Les internal orders permettent de suivre des coûts temporaires ou spécifiques (projet, campagne) dans CO." },
  { id: 7, question: "Dans un flux de production PP, quel composant CO suit les coûts par ordre de production ?", options: ["Product Cost Controlling (CO-PC)", "Accounts Receivable", "Asset Accounting"], answer: 0, explanation: "CO-PC suit coûts planifiés/réels, WIP et variances sur les ordres de production." },
  { id: 8, question: "Vrai ou Faux : en S/4HANA, les écritures FI sont simultanément visibles en CO grâce à l'Universal Journal.", options: ["Vrai", "Faux"], answer: 0, explanation: "L'Universal Journal (ACDOCA) combine FI et CO, offrant une vue unique des coûts et revenus." },
  { id: 9, question: 'Pour quelle raison crée-t-on souvent un "dummy" profit center ?', options: ["Pour les tests uniquement", "Comme centre par défaut quand aucun profit center n'est dérivé", "Pour stocker les données historiques"], answer: 1, explanation: "Un dummy profit center reçoit les écritures sans dérivation correcte, à nettoyer en clôture." },
  { id: 10, question: "Quel bénéfice clé apporte le COGS split en CO-PA dans S/4HANA ?", options: ["Moins de détails sur le coût", "Répartition des COGS en composantes (matière, main-d'œuvre, overhead)", "Suppression des analyses de marge"], answer: 1, explanation: "Le COGS split permet de ventiler le coût des ventes par composantes pour une analyse de marge fine." },
];

const CoQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = QUIZ_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Quiz CO — 10 questions</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Valide tes connaissances sur les centres de coûts, profit centers et CO-PA.</p>
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{q.id}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                let cls = "w-full text-left text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ";
                if (!submitted) {
                  cls += selected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium" : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-400/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10";
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
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button type="button" onClick={() => setSubmitted(true)} className="btn-primary px-6 py-2.5">Valider mes réponses</button>
        ) : (
          <>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Score : <span className="gradient-text text-base">{score} / {QUIZ_QUESTIONS.length}</span></div>
            <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }} className="btn-outline px-6 py-2.5 text-sm">Recommencer</button>
          </>
        )}
      </div>
    </motion.section>
  );
};

/* ─────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: "Quelle est la différence entre FI et CO ?", a: "FI produit les états financiers légaux (bilan, compte de résultat) destinés à l'extérieur. CO fournit des analyses internes de coûts et de rentabilité pour la direction. En S/4HANA, les deux partagent le même Universal Journal (ACDOCA), ce qui élimine la réconciliation." },
  { q: "Faut-il connaître la comptabilité pour faire du SAP CO ?", a: "Les bases comptables sont utiles (débits/crédits, marges, charges), mais CO est plus proche du contrôle de gestion que de la comptabilité pure. Un profil finance ou gestion peut très bien exceller en CO sans être comptable." },
  { q: "Qu'est-ce que le COGS split et pourquoi c'est important ?", a: "Le COGS split décompose le coût des marchandises vendues en composantes (matière première, main-d'œuvre, overhead). Cette ventilation permet d'identifier précisément les leviers d'amélioration des marges par produit ou famille de produits." },
  { q: "CO-PA account-based vs costing-based : quelle différence ?", a: "L'account-based CO-PA est aligné sur les comptes GL, compatible avec l'Universal Journal, et produit des analyses toujours cohérentes avec FI. Le costing-based utilise des champs de valeur propres à CO-PA, plus flexibles mais qui nécessitent une réconciliation avec FI. En S/4HANA, l'account-based est recommandé." },
  { q: "SAP CO est-il difficile à apprendre en partant de zéro ?", a: "CO est plus conceptuel que FI. La clé est de comprendre la logique de controlling (objets de coûts, allocations, analyse de marge) avant de s'attaquer au paramétrage. Commencer par les cost centers, puis les profit centers, puis CO-PA est le chemin le plus naturel." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP CO.</p>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors" aria-expanded={openIndex === i}>
              <span>{item.q}</span>
              <ChevronIcon open={openIndex === i} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-3">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
};

/* ─────────────────────────────────────────────────────────────
   Ressources
───────────────────────────────────────────────────────────── */
const RESOURCES = [
  { title: "SAP CO Module Training Overview", href: "https://fr.scribd.com/document/438012163/Sap-Co-Tutorial", source: "Scribd" },
  { title: "CO-PA : simplifier l'analyse de rentabilité avec S/4HANA", href: "https://www.vc-erp.com/co-pa-simplifying-profitability-analysis-with-sap-s4hana/", source: "VC-ERP" },
  { title: "Profitability Analysis (CO-PA) — Documentation officielle SAP", href: "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/be96d7531a4d414de10000000a174cb4.html", source: "SAP Help" },
  { title: "The Ultimate Guide to Product Costing in SAP S/4HANA", href: "https://community.sap.com/t5/technology-blog-posts-by-members/the-ultimate-guide-to-product-costing-in-sap-s-4hana/ba-p/14223308", source: "SAP Community" },
  { title: "SAP S/4HANA Controlling Master Data — Guide", href: "https://community.sap.com/t5/supply-chain-management-blog-posts-by-members/the-ultimate-guide-to-sap-s-4hana-controlling-master-data/ba-p/13799414", source: "SAP Community" },
];

const CoResources = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Contenus à jour pour approfondir CO, CO-PA et Product Costing.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-emerald-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Page principale
───────────────────────────────────────────────────────────── */
const CO = () => (
  <ModuleLayout
    code="CO"
    title="Controlling"
    description="Maîtrisez l'analyse interne des coûts et de la rentabilité SAP : cost centers, profit centers, CO-PA et product costing sur S/4HANA."
    gradient="from-emerald-900 via-emerald-700 to-teal-500"
    badge="Controlling · Rentabilité · CO-PA"
    seoTitle="Module SAP CO – Controlling"
    seoDescription="Apprenez le module SAP CO (Controlling) : cost centers, profit centers, internal orders, CO-PA, product costing et Universal Journal S/4HANA."
    seoPath="/co"
  >
    <KeyConcepts />
    <CoObjects />
    <CostProfitCenters />
    <CoPaSection />
    <S4HANAFeatures />
    <CareerBenefits />

    <CoQuiz />
    <CoResources />
    <FaqAccordion />
  </ModuleLayout>
);

export default CO;
