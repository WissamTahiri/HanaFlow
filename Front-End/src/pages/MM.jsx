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
  { code: "P2P", label: "Procure-to-Pay", description: "Du besoin d'achat au paiement fournisseur : PR → PO → GR → MIRO → F110. Chaque étape génère des impacts dans MM et FI.", color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400" },
  { code: "GR", label: "Goods Receipt", description: "Réception de marchandises (MIGO). Met à jour le stock physique et déclenche une écriture FI : débit stock, crédit GR/IR.", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400" },
  { code: "GR/IR", label: "Goods Receipt / Invoice Receipt", description: "Compte transitoire FI-MM. Il se créédite au GR (attente facture) et se débite à la réception de la facture MIRO — clé de l'intégration.", color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400" },
  { code: "MM01", label: "Material Master", description: "Fiche article centrale : type de matériel, unité, groupe de marchandises, vues achats/stock/compta. Base de la valorisation.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "MIRO", label: "Invoice Receipt", description: "Vérification de facture fournisseur avec 3-way match (PO + GR + Facture). Crée l'écriture FI-AP : débit GR/IR, crédit fournisseur.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "MATDOC", label: "Material Document", description: "En S/4HANA, table unique MATDOC remplace plusieurs tables ECC pour les mouvements de stock. Reporting simplifié et temps réel.", color: "bg-sapBlue/5 dark:bg-sapBlue/10 border-sapBlue/20 dark:border-sapBlue/30 text-sapBlue dark:text-sapAccent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 notions fondamentales du module MM à maîtriser.</p>
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

/* ─── Structure d'organisation ─── */
const OrgStructure = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Structure d'organisation MM</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">La structure MM détermine comment les achats sont pilotés et les stocks valorisés.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Plant", def: "Unité organisationnelle de gestion des stocks (usine, entrepôt, site). Clé de voûte de la valorisation des matériaux." },
        { term: "Storage Location", def: "Emplacement de stockage détaillé à l'intérieur d'un plant (rack, zone, entrepôt logique)." },
        { term: "Purchasing Organization", def: "Entité qui négocie les conditions d'achat et à laquelle les PO sont rattachés." },
        { term: "Purchasing Group", def: "Équipe ou acheteur responsable d'un portefeuille de matériaux ou catégories d'achats." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{term}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{def}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Cycle P2P ─── */
const P2PCycle = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cycle Procure-to-Pay — étape par étape</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Du besoin interne au paiement fournisseur, avec les t-codes et impacts FI à chaque étape.</p>
    <div className="space-y-3">
      {[
        { step: "1", code: "ME51N", label: "Purchase Requisition (PR)", desc: "Demande interne de matériel ou service. Contient quantité, date souhaitée, centre de coûts. Pas d'écriture FI." },
        { step: "2", code: "ME21N", label: "Purchase Order (PO)", desc: "Document externe envoyé au fournisseur, avec prix, quantités et conditions. Crée un engagement budgétaire." },
        { step: "3", code: "MIGO", label: "Goods Receipt (GR)", desc: "Réception physique → mise à jour stock + écriture FI : débit stock / crédit compte GR/IR (attente facture)." },
        { step: "4", code: "MIRO", label: "Invoice Receipt", desc: "3-way match PO–GR–Facture. Écriture FI : débit GR/IR / crédit fournisseur (création de la dette fournisseur)." },
        { step: "5", code: "F110", label: "Payment", desc: "Traitement du paiement fournisseur (FI-AP). Écriture FI : débit fournisseur / crédit banque. Clôture du cycle P2P." },
      ].map(({ step, code, label, desc }) => (
        <div key={step} className="flex gap-4 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-900/5 border border-orange-100 dark:border-orange-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center justify-center">{step}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{code}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Intégration MM-FI ─── */
const Integration = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration MM–FI</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Chaque mouvement logistique déclenche automatiquement des écritures FI. Voici la mécanique.</p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { event: "Goods Receipt", debit: "Compte Stock", credit: "Compte GR/IR", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400" },
        { event: "Invoice (MIRO)", debit: "Compte GR/IR", credit: "Compte Fournisseur", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400" },
        { event: "Payment (F110)", debit: "Compte Fournisseur", credit: "Compte Banque", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400" },
      ].map(({ event, debit, credit, color }) => (
        <div key={event} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-xs font-bold mb-2">{event}</p>
          <p className="text-xs">Débit : <span className="font-semibold">{debit}</span></p>
          <p className="text-xs">Crédit : <span className="font-semibold">{credit}</span></p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── S/4HANA ─── */
const S4HANAFeatures = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">MM dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les apports de S/4HANA pour le Procurement et la gestion des stocks.</p>
    <div className="space-y-3">
      {[
        { title: "Table MATDOC unifiée", desc: "Tous les mouvements de stock dans une seule table. Reporting temps réel sans tables agrégées séparées." },
        { title: "Fiori apps pour acheteurs", desc: "Gestion des PR, approbation de PO, confirmations fournisseurs, workflows d'achat — sans SAP GUI." },
        { title: "Visibilité temps réel", desc: "Vue consolidée sur les stocks, engagements budgétaires, compte GR/IR, dettes fournisseurs et cash-flow prévu." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/40">
          <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
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
    className="bg-gradient-to-br from-orange-900 to-amber-700 rounded-2xl p-6 text-white">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser MM ?</h2>
    <p className="text-sm text-white/70 mb-5">MM est présent dans chaque projet S/4HANA industriel ou de distribution. Le P2P est l'un des processus les plus déployés.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP MM", desc: "Pilote le paramétrage P2P, la gestion des stocks et l'intégration FI-MM dans les projets S/4HANA." },
        { title: "Responsable achats SAP", desc: "Côté client — optimise les processus P2P, les workflows d'approbation et les conditions fournisseurs." },
        { title: "Consultant SD/MM", desc: "Profil intégrateur très demandé : maîtrise les deux cycles P2P et O2C pour les projets Supply Chain." },
        { title: "Expert Supply Chain S/4HANA", desc: "Pilote les projets d'optimisation de la chaîne d'approvisionnement en intégrant MM, SD et PP." },
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
  { id: 1, question: "Quel est l'objectif principal du processus Procure-to-Pay (P2P) en SAP MM ?", options: ["Planifier la production", "Acheter un bien/service et payer le fournisseur", "Gérer la paie des employés"], answer: 1, explanation: "Le P2P couvre le cycle complet de l'achat jusqu'au paiement du fournisseur dans SAP MM/FI." },
  { id: 2, question: "Quel document interne déclenche généralement le P2P dans SAP MM ?", options: ["Sales Order", "Purchase Requisition (PR)", "Billing Document"], answer: 1, explanation: "Le P2P démarre souvent par une Purchase Requisition (ME51N) créée par un service interne." },
  { id: 3, question: "Dans l'enchaînement P2P standard, quel est l'ordre correct des étapes ?", options: ["PO → PR → GR → Invoice → Payment", "PR → PO → GR → Invoice → Payment", "PR → GR → PO → Payment → Invoice"], answer: 1, explanation: "La séquence classique est PR → PO → GR → Invoice (MIRO) → Payment (FI)." },
  { id: 4, question: "Quel document met à jour le stock et la valorisation d'inventaire dans MM ?", options: ["Purchase Order", "Goods Receipt (GR)", "Invoice Receipt (IR)"], answer: 1, explanation: "Le GR (MIGO) met à jour les quantités de stock, et déclenche la valorisation via FI." },
  { id: 5, question: "Quel t-code est utilisé pour la vérification de facture fournisseur dans un flux P2P standard ?", options: ["MIRO", "FB50", "VA01"], answer: 0, explanation: "MIRO est utilisé pour l'Invoice Receipt et réalise le 3-way match PO–GR–Invoice." },
  { id: 6, question: "Quel est le rôle de la GR/IR dans l'intégration FI–MM ?", options: ["Enregistrer les ventes", "Faire le lien temporaire entre réception de marchandises et facture", "Gérer les coûts de production"], answer: 1, explanation: "Le compte GR/IR sert à rapprocher GR et factures, au cœur de l'intégration FI–MM." },
  { id: 7, question: "Vrai ou Faux : la création de la Purchase Order (PO) génère automatiquement une écriture FI.", options: ["Vrai", "Faux"], answer: 1, explanation: "La PO est un document logistique MM, sans écriture FI tant qu'il n'y a pas de GR ou de facture." },
  { id: 8, question: "Quel t-code est typiquement utilisé pour la création d'une Purchase Requisition ?", options: ["ME51N", "ME21N", "MIGO"], answer: 0, explanation: "ME51N est le t-code standard pour créer une PR dans SAP MM." },
  { id: 9, question: "Dans S/4HANA, quel avantage clé apporte l'architecture P2P par rapport à ECC ?", options: ["Moins d'intégration avec FI", "Plus de tables redondantes", "Vue temps réel sur stocks, engagements et dettes fournisseurs"], answer: 2, explanation: "S/4HANA fournit une visibilité temps réel sur inventaire, POs, GR/IR, dettes fournisseurs et cash-flow." },
  { id: 10, question: "Vrai ou Faux : le paiement final au fournisseur est géré dans FI, pas dans MM.", options: ["Vrai", "Faux"], answer: 0, explanation: "Le paiement (F110/F-53) est exécuté en FI-AP, même si MM a déclenché la facture." },
];

const MmQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = QUIZ_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Quiz MM — 10 questions</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Valide ta compréhension du cycle P2P et de l'intégration FI–MM.</p>
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{q.id}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                let cls = "w-full text-left text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ";
                if (!submitted) cls += selected ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-medium" : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-orange-400/60";
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
  { q: "Quelle est la différence entre PR et PO en SAP MM ?", a: "La Purchase Requisition (PR) est un document interne : un service demande un achat. La Purchase Order (PO) est le document externe envoyé au fournisseur après validation. La PR peut être convertie en PO automatiquement ou manuellement." },
  { q: "Pourquoi le compte GR/IR est-il si important dans MM ?", a: "Le compte GR/IR est un compte d'attente qui fait le pont entre la réception physique (GR) et la facture fournisseur (MIRO). Il assure que la comptabilité reflète fidèlement ce qui a été reçu mais pas encore facturé, et vice versa." },
  { q: "Qu'est-ce que le 3-way match dans MIRO ?", a: "Le 3-way match compare la PO (prix/quantité négociés), le GR (ce qui a été physiquement reçu) et la facture fournisseur. Si tout concorde, la facture est validée automatiquement. Tout écart déclenche un blocage et une analyse manuelle." },
  { q: "SAP MM peut-il fonctionner sans FI ?", a: "Techniquement non — dès qu'il y a un mouvement de stock avec valorisation financière (GR, IR), des écritures FI sont générées. La configuration de l'intégration FI-MM (compte stock, GR/IR, charges) est une étape clé de tout projet MM." },
  { q: "En quoi S/4HANA change-t-il les processus MM ?", a: "La table MATDOC unifie tous les mouvements de stock, ce qui simplifie le reporting. Les Fiori apps remplacent les écrans SAP GUI pour les acheteurs. La visibilité temps réel sur stocks et engagements aide à mieux piloter les achats et la trésorerie." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP MM.</p>
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
  { title: "Purchase Process in SAP S/4HANA — P2P Cycle complet", href: "https://www.gauravconsulting.com/post/sapmmp2pcycle", source: "Gaurav Consulting" },
  { title: "FI-MM Integration with P2P Cycle in SAP S/4HANA", href: "https://sap96.com/fi-mm-integration-with-p2p-cycle-in-sap-s4-hana/", source: "SAP96" },
  { title: "Procure-to-Pay Process — Best Visual Walkthrough 2025", href: "https://gtracademy.org/procure-to-pay-process-in-sap-mm/", source: "GTR Academy" },
  { title: "What is Procure-to-Pay? — SAP Officiel", href: "https://www.sap.com/products/spend-management/procure-to-pay/what-is-procure-to-pay.html", source: "SAP.com" },
];

const MmResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Contenus à jour pour approfondir MM et le cycle P2P.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-orange-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-orange-500 dark:text-orange-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─── Page principale ─── */
const MM = () => (
  <ModuleLayout
    code="MM"
    title="Materials Management"
    description="Maîtrisez le cycle Procure-to-Pay SAP : achats, réception des marchandises, vérification de factures et intégration FI-MM sur S/4HANA."
    accent="#10B981"
    badge="Achats · Stocks · P2P"
    seoTitle="Module SAP MM – Materials Management"
    seoDescription="Apprenez le module SAP MM (Materials Management) : cycle P2P, Purchase Requisition, PO, Goods Receipt, MIRO, GR/IR et intégration FI-MM sur S/4HANA."
    seoPath="/mm"
  >
    <KeyConcepts />
    <OrgStructure />
    <P2PCycle />
    <Integration />
    <S4HANAFeatures />
    <CareerBenefits />

    <MmQuiz />
    <MmResources />
    <FaqAccordion />
  </ModuleLayout>
);

export default MM;
