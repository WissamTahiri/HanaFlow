"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import ModuleLayout from "@/components/ModuleLayout";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─── Concepts clés ─── */
const KEY_CONCEPTS = [
  { code: "O2C", label: "Order-to-Cash", description: "De la commande client à l'encaissement : Sales Order → Livraison → PGI → Billing → Payment. Chaque étape impacte MM ou FI.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "VA01", label: "Sales Order", description: "Commande client avec prix, quantités, conditions de paiement et taxes. Déclenche l'ATP (vérification disponibilité) mais pas encore d'écriture FI.", color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400" },
  { code: "PGI", label: "Post Goods Issue", description: "Sortie de stock lors de la livraison (VL02N). Génère l'écriture FI : crédit stock / débit COGS (coût des marchandises vendues).", color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/50 text-pink-700 dark:text-pink-400" },
  { code: "VF01", label: "Billing", description: "Facturation client (VF01). Crée le document FI AR : débit client / crédit revenus et TVA. Clé de voûte de l'intégration SD-FI.", color: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400" },
  { code: "PRICING", label: "Condition Technique", description: "Moteur de pricing SD : détermine prix, remises, taxes et surcharges. Lié à la détermination de comptes FI via les clés d'imputation (ERL, ERF).", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "RAR", label: "Revenue Accounting", description: "Reconnaissance de revenus avancée selon IFRS 15 / ASC 606. Intégré à SD et FI pour les contrats complexes ou multi-éléments.", color: "bg-sap-blue/5 dark:bg-sap-blue/10 border-sap-blue/20 dark:border-sap-blue/30 text-sap-blue dark:text-sap-accent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 notions fondamentales du module SD à maîtriser.</p>
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
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Structure d'organisation SD</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">La structure SD détermine comment les ventes sont segmentées par marché et liées aux entités légales FI.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Sales Organization", def: "Unité principale de ventes, souvent alignée sur un pays ou une business unit. Rattachée à un Company Code FI." },
        { term: "Distribution Channel", def: "Canal de vente : B2B, B2C, online, retail, etc. Détermine les conditions tarifaires applicables." },
        { term: "Division", def: "Ligne de produits. Permet de segmenter le reporting par famille de produits ou marque." },
        { term: "Sales Area", def: "Combinaison Sales Org + Distribution Channel + Division — base des conditions commerciales et de la tarification." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{term}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{def}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Cycle O2C ─── */
const O2CCycle = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cycle Order-to-Cash — étape par étape</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Du devis au paiement client, avec les t-codes et impacts FI à chaque étape.</p>
    <div className="space-y-3">
      {[
        { step: "1", code: "VA21", label: "Inquiry / Quotation (optionnel)", desc: "Demande de prix ou devis client. Document SD sans écriture FI. Peut être converti en Sales Order." },
        { step: "2", code: "VA01", label: "Sales Order", desc: "Commande client avec prix, quantités, taxes et conditions de paiement. Vérification ATP automatique." },
        { step: "3", code: "VL01N", label: "Delivery", desc: "Création du bon de livraison. Déclenche la préparation logistique et le picking en entrepôt." },
        { step: "4", code: "VL02N", label: "Post Goods Issue (PGI)", desc: "Sortie physique de stock → écriture FI : crédit stock / débit COGS. Transfert de propriété au client." },
        { step: "5", code: "VF01", label: "Billing", desc: "Facturation client → document FI AR créé : débit compte client / crédit revenus et TVA." },
        { step: "6", code: "F-28", label: "Payment", desc: "Encaissement client (FI-AR). Écriture FI : débit banque / crédit client. Lettrage du poste ouvert." },
      ].map(({ step, code, label, desc }) => (
        <div key={step} className="flex gap-4 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/5 border border-purple-100 dark:border-purple-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center">{step}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{code}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Intégration SD-FI ─── */
const Integration = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration SD–FI</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Deux événements SD génèrent des écritures FI : le PGI et la facturation.</p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { event: "Post Goods Issue (PGI)", debit: "COGS (Coût des ventes)", credit: "Compte Stock", color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-400" },
        { event: "Billing (VF01)", debit: "Compte Client (AR)", credit: "Revenus + TVA", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400" },
        { event: "Payment (F-28)", debit: "Compte Banque", credit: "Compte Client (AR)", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400" },
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
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">SD dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les apports de S/4HANA pour la gestion des ventes.</p>
    <div className="space-y-3">
      {[
        { title: "Fiori apps SD", desc: "Gestion des commandes, livraisons, factures et KPIs O2C depuis n'importe quel navigateur. Tableaux de bord temps réel pour les responsables ventes." },
        { title: "Revenue Accounting & Reporting (RAR)", desc: "Gestion de la reconnaissance de revenus selon IFRS 15 / ASC 606 pour les contrats complexes (abonnements, projets multi-éléments)." },
        { title: "Vision temps réel O2C", desc: "Analytics sur commandes en cours, livraisons, factures impayées, marges par produit/client — sans extraction BW." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/40">
          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
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
    className="bg-linear-to-br from-purple-900 to-violet-700 rounded-2xl p-6 text-white">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser SD ?</h2>
    <p className="text-sm text-white/70 mb-5">SD est le module clé pour toutes les entreprises B2B ou B2C. La maîtrise de l'O2C est un prérequis pour de nombreux projets S/4HANA.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP SD", desc: "Pilote le paramétrage O2C, la tarification, les conditions de vente et l'intégration FI-SD dans les projets S/4HANA." },
        { title: "Analyste ventes SAP", desc: "Côté client — exploite les analytics SD pour suivre les KPIs commerciaux, les marges et les délais de livraison." },
        { title: "Consultant SD/MM", desc: "Profil intégrateur Supply Chain — maîtrise les deux cycles O2C et P2P pour des missions à fort enjeu." },
        { title: "Expert Revenue Recognition", desc: "Spécialiste RAR pour les secteurs à contrats complexes : software, services, construction, télécom." },
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
  { id: 1, question: "Quel est l'objectif principal du processus Order-to-Cash (O2C) en SAP SD ?", options: ["Gérer le cycle complet de vente, de la commande client au paiement", "Planifier la production", "Gérer les achats fournisseurs"], answer: 0, explanation: "L'O2C couvre tout le flux client : pré-vente, commande, livraison, facturation, encaissement." },
  { id: 2, question: "Quel document démarre généralement le cycle O2C dans SAP SD ?", options: ["Purchase Order", "Sales Order (VA01)", "Delivery (VL01N)"], answer: 1, explanation: "Le cycle O2C commence avec la création d'un Sales Order (VA01) après l'inquiry/quotation éventuelle." },
  { id: 3, question: "Dans l'enchaînement standard, quel est l'ordre correct des étapes O2C ?", options: ["Delivery → Billing → Sales Order → Payment", "Sales Order → Billing → Delivery → Payment", "Sales Order → Delivery → Post Goods Issue → Billing → Payment"], answer: 2, explanation: "Le flux typique : Sales Order → Delivery → PGI → Billing → Payment." },
  { id: 4, question: "Quel événement déclenche la sortie de stock et le COGS en FI ?", options: ["Sales Order", "Post Goods Issue (PGI)", "Billing"], answer: 1, explanation: "Le PGI (VL02N) réduit le stock et enregistre le COGS en FI." },
  { id: 5, question: "Quel t-code est utilisé pour créer une facture client à partir d'une livraison ou d'un ordre ?", options: ["VF01", "VA01", "F-28"], answer: 0, explanation: "VF01 crée le billing document qui génère un document FI (client, revenus, taxes)." },
  { id: 6, question: "Quel est le rôle de l'intégration SD–FI au moment de la facturation ?", options: ["Mettre à jour les stocks", "Créer un document FI pour revenus et créances clients", "Créer des ordres de fabrication"], answer: 1, explanation: "La facture SD déclenche un document FI : débit client / crédit revenus et taxes." },
  { id: 7, question: "Vrai ou Faux : la création du Sales Order crée immédiatement une écriture FI.", options: ["Vrai", "Faux"], answer: 1, explanation: "Le Sales Order est logistique — c'est PGI et Billing qui génèrent les écritures FI." },
  { id: 8, question: "Quel t-code FI est typiquement utilisé pour enregistrer le paiement client et lettrer la facture ?", options: ["F-28", "MIRO", "F110"], answer: 0, explanation: "F-28 sert à enregistrer les paiements entrants et à compenser les postes clients." },
  { id: 9, question: "Dans un projet S/4HANA, quel composant gère la reconnaissance de revenus avancée pour des contrats complexes ?", options: ["CO-PA", "RAR (Revenue Accounting and Reporting)", "MM-IM"], answer: 1, explanation: "RAR s'intègre à SD et FI pour automatiser la revenue recognition selon IFRS 15 / ASC 606." },
  { id: 10, question: "Quel bénéfice clé apporte S/4HANA à l'O2C par rapport à ECC ?", options: ["Moins d'intégration entre SD et FI", "Vision temps réel sur commandes, livraisons, revenus et marges", "Suppression de la facturation"], answer: 1, explanation: "S/4HANA offre un O2C intégré avec analytics temps réel sur ventes, revenus et marges." },
];

const SdQuiz = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = QUIZ_QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Quiz SD — 10 questions</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Valide ta compréhension du cycle O2C et de l'intégration SD–FI.</p>
      <div className="space-y-4">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{q.id}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                let cls = "w-full text-left text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 ";
                if (!submitted) cls += selected ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-medium" : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400/60";
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
  { q: "Quelle est la différence entre SD et MM dans SAP ?", a: "SD gère les ventes (côté client) : commande, livraison, facturation. MM gère les achats (côté fournisseur) : commande d'achat, réception, facturation. Ensemble, ils couvrent la supply chain : MM pour le P2P, SD pour l'O2C." },
  { q: "Pourquoi le PGI (Post Goods Issue) est-il important en SD ?", a: "Le PGI est le moment du transfert de propriété au client. C'est lui qui réduit le stock physique et génère l'écriture COGS en FI. Sans PGI, pas de facturation possible — c'est un événement pivot du cycle O2C." },
  { q: "Comment fonctionne la détermination de comptes SD-FI ?", a: "SAP utilise des clés d'imputation (ERL pour revenus, ERF pour COGS, ERS pour taxes…) pour mapper automatiquement les lignes de la facture SD vers les comptes GL FI corrects. C'est configuré dans la table VKOA et les procédures de condition." },
  { q: "Qu'est-ce que l'ATP en SAP SD ?", a: "L'Available-to-Promise (ATP) est la vérification de disponibilité du stock lors de la création du Sales Order. SAP vérifie si le stock disponible peut couvrir la demande à la date souhaitée, et propose une date de livraison réaliste." },
  { q: "SAP SD est-il difficile à apprendre en partant de zéro ?", a: "SD est conceptuellement accessible car le cycle O2C est intuitif (commande → livraison → facture → paiement). La complexité vient du pricing et de la détermination de comptes FI. Commencer par le cycle O2C basique avant d'aborder le pricing avancé est la bonne approche." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP SD.</p>
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
  { title: "SAP Order to Cash Process – SD", href: "https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-members/sap-order-to-cash-process-sd/ba-p/13551270", source: "SAP Community" },
  { title: "SAP SD–FI Integration and Account Determination", href: "https://www.saplogisticsexpert.com/sap-sd-fi-integration-and-account-determination/", source: "SAP Logistics Expert" },
  { title: "Optimizing Sales Performance with SAP SD O2C", href: "https://www.sapbwconsulting.com/blog/sap-sd-order-to-cash", source: "SAP BW Consulting" },
  { title: "SAP S/4HANA RAR Integration with SD and FI", href: "https://ageistechnova.com/sap-s-4-hana-rar-integration-with-sd-and-fi-modules/", source: "Ageist Technova" },
  { title: "SAP SD Order to Cash (O2C) Cycle — YouTube", href: "https://www.youtube.com/watch?v=0jiWgZpwtzM", source: "YouTube" },
];

const SdResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Contenus à jour pour approfondir SD et le cycle O2C.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-purple-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-purple-500 dark:text-purple-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─── Page principale ─── */
const SD = () => (
  <ModuleLayout
    code="SD"
    title="Sales & Distribution"
    description="Maîtrisez le cycle Order-to-Cash SAP : commande client, livraison, facturation, intégration FI-SD et reconnaissance de revenus sur S/4HANA."
    gradient="from-purple-900 via-violet-700 to-purple-500"
    badge="Ventes · O2C · Facturation"
  >
    <KeyConcepts />
    <OrgStructure />
    <O2CCycle />
    <Integration />
    <S4HANAFeatures />
    <CareerBenefits />

    <SdQuiz />
    <SdResources />
    <FaqAccordion />
  </ModuleLayout>
);

export default SD;
