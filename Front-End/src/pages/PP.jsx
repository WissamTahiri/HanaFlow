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
  { code: "BOM", label: "Bill of Materials", description: "Liste structurée des composants nécessaires à la fabrication d'un produit fini. La BOM définit les quantités et la hiérarchie des matériaux.", color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400" },
  { code: "ROUTING", label: "Gamme (Routing)", description: "Séquence des opérations de fabrication : pour chaque étape, le work center utilisé, le temps standard et les ressources nécessaires.", color: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400" },
  { code: "MRP", label: "Material Requirements Planning", description: "Planification des besoins en matières : calcule automatiquement les ordres de fabrication et d'achat nécessaires pour satisfaire la demande.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" },
  { code: "PrdOrd", label: "Production Order", description: "Ordre de fabrication : porte la BOM, la gamme, les coûts, les confirmations et l'historique d'un lot de production en mode discret.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "CO-PC", label: "Product Cost Controlling", description: "Module CO lié à PP : calcule le coût standard des produits, suit le WIP (Work in Progress) et analyse les variances entre coûts planifiés et réels.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "PP/DS", label: "MRP Live / PP/DS", description: "En S/4HANA, MRP Live permet une planification temps réel avec prise en compte des contraintes capacitaires et feedback immédiat de l'exécution.", color: "bg-sapBlue/5 dark:bg-sapBlue/10 border-sapBlue/20 dark:border-sapBlue/30 text-sapBlue dark:text-sapAccent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 notions fondamentales du module PP à maîtriser.</p>
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

/* ─── Master data ─── */
const MasterData = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Master Data PP</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Un ordre de fabrication fiable repose sur des données maîtres propres et à jour.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Bill of Materials (BOM)", def: "Structure des composants du produit fini. Chaque niveau représente un assemblage ou un matériau avec sa quantité unitaire." },
        { term: "Routing (Gamme)", def: "Séquence d'opérations : quel work center pour quelle opération, avec les temps de setup et de traitement." },
        { term: "Work Center", def: "Machine, ligne ou atelier. Lié à un cost center CO pour l'imputation des coûts de capacité et de main-d'œuvre." },
        { term: "Production Version", def: "Combinaison BOM + Gamme valide pour une plage de quantités et de dates. Détermine quelle BOM et quel routing utiliser." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{term}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{def}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Flux de production ─── */
const ProductionFlow = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Flux de production discret — étape par étape</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Du calcul MRP à la clôture de l'ordre, avec les impacts CO à chaque étape.</p>
    <div className="space-y-3">
      {[
        { step: "1", label: "Planification MRP", desc: "MRP calcule les besoins nets à partir de la demande (commandes client, prévisions). Génère des Planned Orders et des Purchase Requisitions." },
        { step: "2", label: "Conversion en Production Order", desc: "Le Planned Order est converti en ordre de fabrication. La BOM et la gamme sont chargées. Les coûts planifiés sont calculés." },
        { step: "3", label: "Goods Issue (mvt 261)", desc: "Sortie des composants vers l'atelier. Impact MM (réduction stock) + CO-PC (consommation de matières sur l'ordre)." },
        { step: "4", label: "Confirmations d'opérations", desc: "Les opérateurs confirment les heures travaillées et les quantités produites. Impact CO : coûts de main-d'œuvre et machine imputés à l'ordre." },
        { step: "5", label: "Goods Receipt (mvt 101)", desc: "Entrée en stock du produit fini. Impact MM (augmentation stock PF) + FI (valorisation au coût standard)." },
        { step: "6", label: "Order Settlement", desc: "Clôture de l'ordre : les coûts réels sont comparés aux coûts planifiés. Les variances sont affectées au matériel ou à un compte de variance CO-PC." },
      ].map(({ step, label, desc }) => (
        <div key={step} className="flex gap-4 p-4 rounded-xl bg-teal-50/50 dark:bg-teal-900/5 border border-teal-100 dark:border-teal-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center">{step}</span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Intégration PP-CO ─── */
const Integration = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration PP–CO (Product Costing)</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">PP et CO-PC sont étroitement liés : chaque événement PP a un impact sur les coûts.</p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { phase: "Planification", desc: "CO-PC calcule le coût standard du produit fini à partir de la BOM et du routing. C'est la référence pour mesurer les écarts.", color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-400" },
        { phase: "Exécution", desc: "GI (matières) + confirmations (heures) alimentent l'ordre en coûts réels. Le WIP est calculé en fin de période.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400" },
        { phase: "Settlement", desc: "En clôture : coûts réels vs. planifiés → variances affectées au matériel ou à un compte de résultat CO-PA.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400" },
      ].map(({ phase, desc, color }) => (
        <div key={phase} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-xs font-bold mb-1">{phase}</p>
          <p className="text-xs leading-relaxed opacity-90">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── S/4HANA ─── */
const S4HANAFeatures = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">PP dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les apports de S/4HANA pour la planification et l'exécution de production.</p>
    <div className="space-y-3">
      {[
        { title: "MRP Live", desc: "Planification temps réel : MRP s'exécute en quelques secondes sur l'ensemble du périmètre, avec prise en compte des confirmations immédiate." },
        { title: "PP/DS (Advanced Planning)", desc: "Planification avec contraintes capacitaires (machines, main-d'œuvre). Permet l'ordonnancement fin et la simulation de scénarios." },
        { title: "Fiori apps pour ateliers", desc: "Confirmation de production, suivi des ordres, gestion des capacités — sans SAP GUI, accessibles depuis des terminaux d'atelier." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/40">
          <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Débouchés ─── */
const CareerBenefits = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
    className="bg-gradient-to-br from-teal-900 to-teal-600 rounded-2xl p-6 text-white">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser PP ?</h2>
    <p className="text-sm text-white/70 mb-5">PP est incontournable dans les entreprises industrielles (automobile, aéro, chimie, agroalimentaire). La demande est forte et les profils sont rares.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP PP", desc: "Paramètre le module PP (BOM, gammes, MRP, ordres) dans les projets S/4HANA industriels." },
        { title: "Planificateur production SAP", desc: "Côté client — utilise MRP Live et PP/DS pour optimiser les plans de production et les capacités." },
        { title: "Consultant PP/CO-PC", desc: "Profil hybride très demandé : maîtrise l'exécution production ET le costing de produit. Rare et bien rémunéré." },
        { title: "Expert Supply Chain S/4HANA", desc: "Pilote les projets d'intégration PP–MM–SD pour optimiser la chaîne de valeur industrielle de bout en bout." },
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
  { id: 1, question: "Quel est l'objectif principal du module PP dans SAP S/4HANA ?", options: ["Gérer la paie des employés", "Planifier et exécuter la production (MRP, ordres, capacités)", "Gérer les factures fournisseurs"], answer: 1, explanation: "PP gère la planification, l'ordonnancement et l'exécution de la production (MRP, ordres, capacités)." },
  { id: 2, question: "Dans un scénario de production discrète, quel est l'objet central qui pilote un lot de fabrication ?", options: ["Sales Order", "Production Order", "Purchase Requisition"], answer: 1, explanation: "En production discrète, chaque lot est piloté par un Production Order qui porte BOM, routing, coûts et historique." },
  { id: 3, question: "Quels master data sont essentiels pour un ordre de fabrication standard ?", options: ["BOM, Routing, Work Center, Production Version", "Vendor Master et Purchasing Info Record", "Customer Master et Pricing Conditions"], answer: 0, explanation: "Une production fiable dépend de BOM, routing, work centers et production versions propres." },
  { id: 4, question: "Quel est l'ordre logique typique en PP pour la production discrète ?", options: ["Planification MRP → Planned Order → Production Order → Confirmation → Goods Issue/Receipt → Settlement", "Sales Order → Billing → Payment", "Purchase Requisition → Purchase Order → Goods Receipt → Invoice"], answer: 0, explanation: "Le flux standard PP : MRP → planned order → conversion en ordre → exécution/confirmations → GI/GR → settlement." },
  { id: 5, question: "Quel mouvement de stock est typiquement utilisé pour la consommation de composants par un ordre de fabrication ?", options: ["101", "261", "601"], answer: 1, explanation: "Le mouvement 261 poste la consommation de composants pour un ordre de fabrication (goods issue)." },
  { id: 6, question: "Quel module CO est le plus étroitement lié à PP pour le suivi des coûts de fabrication ?", options: ["CO-PA (Profitability Analysis)", "Product Cost Controlling (CO-PC)", "Asset Accounting (AA)"], answer: 1, explanation: "CO-PC gère les coûts standards, WIP, variances et settlement des ordres de fabrication." },
  { id: 7, question: "Vrai ou Faux : les work centers en PP sont liés à des cost centers CO pour imputer les coûts d'activité.", options: ["Vrai", "Faux"], answer: 0, explanation: "Les work centers portent un cost center et des activity types pour imputer les coûts de main-d'œuvre/machine." },
  { id: 8, question: "Quel est l'intérêt de MRP Live / planning avancé en S/4HANA PP ?", options: ["Supprimer le besoin de BOM", "Planifier en temps réel avec prise en compte des contraintes et feedback d'exécution", "Remplacer le module FI"], answer: 1, explanation: "MRP Live et PP/DS offrent planification temps réel, contraintes capacités et feedback d'exécution." },
  { id: 9, question: "Quelle étape PP déclenche typiquement le Goods Receipt (101) du produit fini en stock ?", options: ["Création de l'ordre", "Confirmation finale de l'ordre", "Calcul du coût standard"], answer: 1, explanation: "La confirmation finale de l'ordre permet souvent de poster le GR 101 du produit fini." },
  { id: 10, question: "Quel est le rôle de la settlement d'ordre de fabrication dans l'intégration PP–CO ?", options: ["Envoyer les coûts réels vers le bon objet (produit, cost center, WBS) et analyser les variances", "Créer des factures clients", "Créer des demandes d'achat"], answer: 0, explanation: "La settlement en CO affecte les coûts réels et variances vers le matériel ou autres objets CO." },
];

const PpQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = QUIZ_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Quiz PP — 10 questions</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Valide tes connaissances sur la production discrète et l'intégration CO-PC.</p>
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{q.id}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                let cls = "w-full text-left text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ";
                if (!submitted) cls += selected ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-medium" : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-teal-400/60";
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
  { q: "Quelle est la différence entre PP discret et PP répétitif ?", a: "La production discrète (discrete manufacturing) utilise des ordres de fabrication individuels pour chaque lot — typique dans l'automobile ou l'aéronautique. La production répétitive (repetitive manufacturing) est basée sur des plannings de production sans ordre individuel, plus adaptée aux grandes séries continues." },
  { q: "Pourquoi le BOM et le Routing sont-ils si critiques en PP ?", a: "Le BOM détermine quels composants sont nécessaires (et en quelle quantité), tandis que le Routing définit comment et où le produit est fabriqué. Des erreurs dans ces données maîtres se propagent à tous les ordres de fabrication : mauvais composants, mauvais coûts, mauvais temps." },
  { q: "Comment PP et CO-PC interagissent-ils ?", a: "PP fournit les données d'exécution (heures réelles, consommations) et CO-PC les valorise. Le coût standard (calculé par CO-PC à partir du BOM et du routing) sert de référence. En fin d'ordre, la settlement compare les coûts réels aux coûts planifiés et enregistre les variances." },
  { q: "Qu'est-ce que le MRP Live en S/4HANA ?", a: "MRP Live est la version S/4HANA du calcul des besoins en matières. Contrairement à ECC où le MRP nécessitait des heures d'exécution, MRP Live s'appuie sur la base de données HANA pour des résultats en quelques secondes, avec une visibilité temps réel sur les manques et les surcharges." },
  { q: "PP est-il difficile à apprendre en partant de zéro ?", a: "PP est parmi les modules les plus complexes car il est à l'intersection de la logistique, du paramétrage technique et du controlling. La clé est de commencer par le flux discret simple (BOM + Routing + MRP + Ordre + Settlement), de bien comprendre l'intégration avec MM (GI/GR) et CO-PC, avant d'aborder les cas avancés." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP PP.</p>
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
  { title: "SAP PP Module Overview — Documentation officielle", href: "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE", source: "SAP Help" },
  { title: "The Ultimate Guide to Product Costing in SAP S/4HANA", href: "https://community.sap.com/t5/technology-blog-posts-by-members/the-ultimate-guide-to-product-costing-in-sap-s-4hana/ba-p/14223308", source: "SAP Community" },
  { title: "SAP MRP Live — Planification en temps réel", href: "https://www.sap.com/products/scm/material-requirements-planning.html", source: "SAP.com" },
];

const PpResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Documentation et guides pour approfondir PP et le Product Costing.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-teal-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-teal-500 dark:text-teal-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─── Page principale ─── */
const PP = () => (
  <ModuleLayout
    code="PP"
    title="Production Planning"
    description="Maîtrisez la planification et l'exécution de production SAP : BOM, gammes, MRP, ordres de fabrication, intégration CO-PC et S/4HANA."
    accent="#EF4444"
    badge="Production · MRP · CO-PC"
    seoTitle="Module SAP PP – Production Planning"
    seoDescription="Apprenez le module SAP PP (Production Planning) : BOM, routing, MRP, ordres de fabrication, intégration CO-PC, MRP Live et S/4HANA."
    seoPath="/pp"
  >
    <KeyConcepts />
    <MasterData />
    <ProductionFlow />
    <Integration />
    <S4HANAFeatures />
    <CareerBenefits />

    <PpQuiz />
    <PpResources />
    <FaqAccordion />
  </ModuleLayout>
);

export default PP;
