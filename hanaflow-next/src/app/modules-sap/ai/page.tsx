"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import ModuleLayout from "@/components/ModuleLayout";

/* ─────────────────────────────────────────────────────────────
   Icônes SVG inline
───────────────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Concepts clés
───────────────────────────────────────────────────────────── */
const KEY_CONCEPTS = [
  { code: "LLM", label: "Large Language Model", description: "Réseau de neurones Transformer entraîné pour prédire le prochain token. Base de tous les copilotes modernes : GPT, Claude, Gemini, Llama. Hallucinations et context window sont ses deux limites fondamentales.", color: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-400" },
  { code: "RAG", label: "Retrieval Augmented Generation", description: "Injection de contexte issu d'une base de connaissances dans le prompt LLM. Résout l'hallucination et le cutoff date. Pipeline : loading → chunking → embedding → retrieval → generation.", color: "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-800/50 text-fuchsia-700 dark:text-fuchsia-400" },
  { code: "EMB", label: "Embeddings", description: "Vecteurs numériques (768-3072 dim) qui placent le texte dans un espace sémantique. La similarité cosinus mesure la proximité de sens. Indispensables pour la recherche et le RAG.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "GenAI Hub", label: "Generative AI Hub", description: "Couche d'abstraction SAP au-dessus des LLMs externes (OpenAI Azure, Google, Anthropic). Permet d'appeler n'importe quel LLM via une API unique, avec facturation et gouvernance SAP.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "Joule", label: "SAP Joule", description: "Copilote IA conversationnel SAP intégré dans S/4HANA, SuccessFactors, Ariba. Context-aware, vendor-grounded et compliance-by-design. Exécute des transactions avec confirmation utilisateur.", color: "bg-sap-blue/5 dark:bg-sap-blue/10 border-sap-blue/20 dark:border-sap-blue/30 text-sap-blue dark:text-sap-accent" },
  { code: "Resp AI", label: "Responsible AI", description: "5 principes SAP : Relevance, Transparency, Fairness, Accountability, Security & Privacy. Conformité EU AI Act. Tests de biais, explicabilité, audit complet sur les décisions sensibles.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" },
];

const KeyConcepts = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 notions fondamentales à maîtriser pour la certif C_AIG_2404.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {KEY_CONCEPTS.map((c) => (
        <div key={c.code} className={`rounded-xl border p-4 ${c.color.split(" ").filter((cls: string) => cls.startsWith("border")).join(" ")} bg-white dark:bg-slate-800`}>
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
   Stack SAP AI
───────────────────────────────────────────────────────────── */
const AIStack = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Stack SAP IA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      L&apos;empilement BTP au-dessus duquel se construisent les apps IA SAP — du bas (infra) vers le haut (UX).
    </p>
    <div className="space-y-3">
      {[
        { layer: "Couche UX", items: "Joule (S/4HANA, SuccessFactors), Custom Apps via SAP Build, Fiori AI components", role: "Interface utilisateur final" },
        { layer: "Couche Skills", items: "Skill Engine, Custom Skills, Orchestration Pipelines", role: "Exécution des actions métier — soumis aux autorisations PFCG" },
        { layer: "Couche Grounding", items: "Grounding Service, RAG Pipeline, HANA Vector Engine", role: "Injection du contexte tenant + RAG sur docs SAP/client" },
        { layer: "Couche Generative AI Hub", items: "API unifiée vers OpenAI Azure / Google / Anthropic / open-source", role: "Abstraction des LLMs externes, facturation centralisée" },
        { layer: "Couche AI Core", items: "Scenarios, Configurations, Deployments, Executions, Resource Groups", role: "Runtime d'exécution des workloads IA dans BTP" },
        { layer: "Couche AI Launchpad", items: "ML Ops, Generative AI Hub UI, Prompt Templates, Audit", role: "Interface web de gouvernance et observability" },
      ].map(({ layer, items, role }) => (
        <div key={layer} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{layer}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{items}</p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 italic">{role}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Processus IA
───────────────────────────────────────────────────────────── */
const Processes = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Processus IA standard</h2>
    <div className="space-y-6">
      {/* Pipeline RAG */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-600 text-white">RAG</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Pipeline RAG complet — ingestion + query</h3>
        </div>
        <ol className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Ingestion : loading (PDF/HTML/Confluence) → chunking 500-1500 tokens, overlap 10-20 %.",
            "Embedding via text-embedding-3-small / text-embedding-004 / SAP-Vector.",
            "Stockage dans vector store (HANA Vector Engine recommandé en env SAP).",
            "Query : embedding question avec le MÊME modèle → top-K similarity → re-ranking → assembly prompt.",
            "Génération LLM + citation des sources à l'user.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Déploiement modèle */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-sap-blue text-white">DEPLOY</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Déployer un LLM via AI Core dans BTP</h3>
        </div>
        <ol className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Provisionner AI Core (plan extended) dans le sub-account BTP.",
            "Créer un Resource Group (isolation par projet/tenant).",
            "Ajouter la clé provider (OpenAI/Anthropic/Google) au resource group via Launchpad.",
            "Créer une Configuration sur le scenario foundation-models → modèle cible (gpt-4o, claude-3-5).",
            "Déployer : URL stable d'inference générée. Consommation depuis l'app via SDK + XSUAA.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sap-blue/10 text-sap-blue text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Custom Joule Skill */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-fuchsia-600 text-white">SKILL</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Créer une Custom Joule Skill</h3>
        </div>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Modéliser l'intent business (ex: 'créer une facture pour le client X').",
            "Définir les inputs structurés (entités, paramètres) et leur validation.",
            "Implémenter l'action via SAP Build (low-code) ou code (CAP/RAP).",
            "Déclarer les autorisations PFCG requises — Joule respecte le modèle standard.",
            "Tester dans le playground Launchpad, puis publier dans Joule pour les end-users du tenant.",
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
   Intégration
───────────────────────────────────────────────────────────── */
const Integration = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">IA × autres modules SAP</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      L&apos;IA SAP est transversale : elle s&apos;intègre dans toutes les lignes de produits.
    </p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { pair: "IA – Finance (FI)", desc: "Joule analyse les écarts comptables, génère des prévisions de cash flow, automatise la justification d'écritures atypiques.", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
        { pair: "IA – Sales (SD)", desc: "Joule crée une commande client en langage naturel, propose des offres personnalisées par RAG sur l'historique du compte.", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40" },
        { pair: "IA – Procurement (MM)", desc: "Comparaison automatique des PO récentes, suggestion de fournisseurs alternatifs, anomaly detection sur les prix.", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" },
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
   Features S/4HANA AI
───────────────────────────────────────────────────────────── */
const S4HANAFeatures = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.14 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Specs S/4HANA AI</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les capacités IA embarquées dans S/4HANA Cloud à connaître.</p>
    <div className="space-y-3">
      {[
        { title: "Joule embedded", desc: "Copilote conversationnel dans le launchpad Fiori. Posez vos questions en français, créez des transactions, analysez des KPIs avec contexte automatique." },
        { title: "AI Agents (Q4 2024+)", desc: "Agents autonomes qui orchestrent plusieurs skills pour accomplir une tâche multi-étapes (ex: clôture mensuelle assistée, on-boarding fournisseur)." },
        { title: "Generative Reports", desc: "Générer un commentaire de variance, un memo de clôture ou un mail client à partir des données live S/4HANA." },
        { title: "AI-powered Master Data", desc: "Détection de doublons, suggestion de catégorisation, enrichissement automatique des fiches articles/clients/fournisseurs." },
        { title: "Smart Insights & Anomaly Detection", desc: "ML embarqué dans SAC (Analytics Cloud) et BW/4HANA — détection automatique d'écarts, prévisions, root cause analysis." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
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

/* ─────────────────────────────────────────────────────────────
   Débouchés métier
───────────────────────────────────────────────────────────── */
const CareerBenefits = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.16 }}
    className="bg-linear-to-br from-purple-700 via-violet-700 to-fuchsia-700 rounded-2xl p-6 text-white"
  >
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser SAP IA ?</h2>
    <p className="text-sm text-white/70 mb-5">L&apos;IA est la spécialité SAP la plus rare et la mieux rémunérée en 2026. Demande &gt; offre dans toutes les ESN.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP IA / Joule", desc: "Implémente Joule chez les clients, monte les premières custom skills, anime les ateliers UX-IA. TJM 800-1200 €." },
        { title: "Solution Architect IA SAP", desc: "Conçoit l'architecture AI Core + RAG + Joule en environnement entreprise. Combine compétences cloud, sécurité et IA." },
        { title: "Prompt / RAG Engineer SAP", desc: "Spécialiste de la couche orchestration : Prompt Templates, pipelines RAG, optimisation tokens/qualité. Profil hybride dev + métier." },
        { title: "AI Ops Engineer (SAP BTP)", desc: "Opérationnel des deployments IA : monitoring tokens, gestion des quotas providers, audit conformité EU AI Act." },
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
   Outils SAP IA
───────────────────────────────────────────────────────────── */
const TOOLS = [
  { code: "AI Launchpad", label: "console.ai.cloud.sap", usage: "Interface unifiée de gouvernance IA — gestion des deployments, prompts, observability." },
  { code: "AI Core CLI", label: "ai-core", usage: "CLI officiel pour scripter le cycle de vie (deployments, executions, configurations)." },
  { code: "BTP Cockpit", label: "BTP Cockpit", usage: "Provisioning AI Core, gestion des resource groups, lien tenant ↔ AI Core." },
  { code: "SDK", label: "sap-ai-sdk / sap-genai-hub-sdk", usage: "SDK officiels JavaScript et Python pour consommer Generative AI Hub depuis une app." },
];

const AiTools = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.18 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Outils SAP IA essentiels</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les interfaces et SDKs à connaître pour le poste de consultant IA SAP.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {TOOLS.map((t) => (
        <div key={t.code} className="border border-purple-500/20 rounded-xl p-4 bg-purple-500/5 dark:bg-purple-500/10">
          <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">{t.code} — {t.label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{t.usage}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "Faut-il être développeur pour faire du SAP IA ?",
    a: "Pas obligatoirement. Le rôle Consultant SAP IA peut être plus fonctionnel : design des custom skills, prompt engineering, gouvernance Responsible AI. Les profils techniques (ABAP/Node/Python) sont demandés pour les rôles Solution Architect ou Prompt Engineer.",
  },
  {
    q: "Joule remplace-t-il Fiori ?",
    a: "Non. Joule complète Fiori. Pour les tâches structurées (saisie commande, validation), Fiori reste plus rapide. Joule excelle sur les questions ad-hoc, l'analyse, la composition de plusieurs actions. Les deux coexistent.",
  },
  {
    q: "Quelle différence entre RAG et fine-tuning ?",
    a: "RAG = injecter du contexte au moment de la requête. Pas d'entraînement, pas de coût d'inférence supplémentaire significatif, mise à jour facile (juste ré-indexer). Fine-tuning = modifier les poids du modèle. Plus cher, plus complexe, mais peut intégrer un style/vocabulaire spécifique de manière plus profonde.",
  },
  {
    q: "Combien coûte Joule pour un tenant S/4HANA Cloud ?",
    a: "Joule est inclus dans S/4HANA Cloud Public Edition depuis Q4 2024 (avec quotas). Pour Private Edition et besoins extended, c'est une licence séparée. Coût variable selon volumétrie d'utilisation et nombre d'users actifs.",
  },
  {
    q: "Les modèles utilisés par Joule sont-ils sécurisés vis-à-vis de nos données ?",
    a: "Oui. SAP a des accords spécifiques avec les providers (OpenAI Azure, Google, Anthropic) : pas de training sur les données client, data residency dans le tenant BTP, audit complet. C'est la valeur clé du Generative AI Hub vs un appel direct au provider.",
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
    >
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP IA.</p>
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
   Ressources
───────────────────────────────────────────────────────────── */
const RESOURCES = [
  { title: "SAP Learning — SAP Generative AI Developer", href: "https://learning.sap.com/learning-journeys/develop-generative-ai-applications-with-sap", source: "SAP Learning" },
  { title: "SAP AI Core — Documentation officielle", href: "https://help.sap.com/docs/sap-ai-core", source: "SAP Help" },
  { title: "SAP Joule — Vue d'ensemble produit", href: "https://www.sap.com/products/artificial-intelligence/ai-assistant.html", source: "SAP.com" },
  { title: "SAP AI Launchpad — Documentation", href: "https://help.sap.com/docs/ai-launchpad", source: "SAP Help" },
  { title: "Generative AI Hub — Quickstart", href: "https://developers.sap.com/tutorials/ai-core-generative-ai.html", source: "SAP Developers" },
  { title: "SAP AI Ethics Policy — Code of Conduct", href: "https://www.sap.com/products/artificial-intelligence/ai-ethics.html", source: "SAP.com" },
];

const AiResources = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.26 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources officielles SAP</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Documentation et formations à jour (2024-2026) pour approfondir.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a
          key={r.href}
          href={r.href}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-purple-500/40 hover:shadow-md transition-all group"
        >
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
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
const AI = () => (
  <ModuleLayout
    code="AI"
    title="Generative AI Developer SAP"
    description="Maîtrise SAP AI Core, AI Launchpad, Joule, RAG et prompt engineering. Prépare la certification C_AIG_2404 — la spécialité SAP la mieux rémunérée en 2026."
    gradient="from-purple-700 via-violet-700 to-fuchsia-600"
    badge="LLMs · RAG · Joule · Responsible AI"
  >
    <KeyConcepts />
    <AIStack />
    <Processes />
    <Integration />
    <S4HANAFeatures />
    <CareerBenefits />
    <AiTools />
    <AiResources />
    <FaqAccordion />
  </ModuleLayout>
);

export default AI;
