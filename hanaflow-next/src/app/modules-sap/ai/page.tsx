"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import ModuleLayout from "@/components/ModuleLayout";
import { certCode } from "@/lib/certCodes";

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
  { code: "LLM", label: "Large Language Model", description: "Réseau de neurones de type Transformer entraîné à prédire le prochain token. Base de tous les copilotes modernes : GPT-4o, Claude, Gemini, Llama. Hallucinations et taille de fenêtre de contexte restent ses deux limites structurelles — c'est précisément ce que le grounding et le RAG viennent corriger côté SAP.", color: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-400" },
  { code: "RAG", label: "Retrieval Augmented Generation", description: "Injection de contexte extrait d'une base de connaissances dans le prompt, au moment de la requête — sans ré-entraîner le modèle. Réduit les hallucinations et le \"cutoff\" de connaissance. Chez SAP, ce pipeline porte un nom précis : Document Grounding, module de l'Orchestration Service.", color: "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-800/50 text-fuchsia-700 dark:text-fuchsia-400" },
  { code: "EMB", label: "Embeddings", description: "Vecteurs numériques qui placent un texte dans un espace sémantique ; la similarité cosinus mesure la proximité de sens entre deux fragments. Dans le Document Grounding SAP, cette étape est gérée par le module lui-même et les vecteurs sont stockés dans le HANA Vector Engine.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "GenAI Hub", label: "Generative AI Hub", description: "Couche d'accès unifiée de SAP AI Core vers des modèles de fournisseurs multiples — GPT-4o (Azure OpenAI), Claude (Anthropic, via AWS Bedrock), Gemini (Google Vertex AI), Llama, Mistral, SAP-RPT-1 — avec gouvernance, suivi d'usage et facturation centralisés côté SAP, sans clé API personnelle ni appel direct au fournisseur.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "Orchestration", label: "Orchestration Service", description: "Module du Generative AI Hub qui compose, côté serveur, le prompt templating, le Document Grounding (RAG), le data masking et le content filtering — sans dupliquer cette logique dans chaque application cliente. C'est la brique la plus pondérée de l'examen C_AIG.", color: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/50 text-sky-700 dark:text-sky-400" },
  { code: "Joule", label: "SAP Joule", description: "Copilote conversationnel de SAP, intégré nativement dans S/4HANA, SuccessFactors, Ariba et le reste du cloud SAP. En 2026, il orchestre plus de 2 400 \"Joule Skills\" et une quarantaine d'agents spécialisés, avec Joule Studio comme atelier low-code pour en créer de nouveaux.", color: "bg-sap-blue/5 dark:bg-sap-blue/10 border-sap-blue/20 dark:border-sap-blue/30 text-sap-blue dark:text-sap-accent" },
  { code: "Agent IA", label: "Agent IA / AI Agent", description: "Enchaîne plusieurs skills et décisions pour accomplir une tâche multi-étapes sans intervention à chaque étape (ex. clôture mensuelle assistée), à la différence d'une skill unique qui répond à une seule intention. Le protocole A2A permet même à un agent Joule de déléguer une sous-tâche à un agent d'un autre écosystème.", color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400" },
  { code: "Prompt Eng.", label: "Prompt Engineering", description: "Structurer un prompt (rôle, contexte métier, contraintes, format de sortie attendu) pour obtenir une réponse exploitable et reproductible plutôt qu'un texte libre. Le Generative AI Hub conserve ces prompts dans un Prompt Registry versionné, réutilisable entre applications.", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400" },
  { code: "Resp AI", label: "Responsible AI", description: "Chez SAP, trois piliers encadrent toute fonctionnalité IA : Relevant (impact métier réel), Reliable (ancrée dans les données de l'entreprise, traçable) et Responsible (éthique, sécurité, conformité — dix principes directeurs publiés, alignés sur la recommandation de l'UNESCO). Engagement explicite : aucune donnée client n'entraîne les modèles tiers.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" },
];

const KeyConcepts = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les notions fondamentales à maîtriser pour la certification {certCode("ai")} — et pour distinguer ce qui relève de Joule (le produit) de ce qui relève du développement IA sur BTP (ce que couvre la certification).</p>
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
      L&apos;empilement BTP au-dessus duquel se construisent les fonctionnalités IA SAP — du bas (infrastructure)
      vers le haut (expérience utilisateur). Joule n&apos;est que la couche la plus visible : tout développeur
      IA SAP travaille principalement dans les trois couches du milieu (AI Core, Generative AI Hub,
      Orchestration Service), celles couvertes par la certification {certCode("ai")}.
    </p>
    <div className="space-y-3">
      {[
        { layer: "Couche UX", items: "Joule (S/4HANA, SuccessFactors, Ariba, BTP), applications custom via SAP Build, composants Fiori enrichis d'IA", role: "Interface utilisateur final — ne requiert pas de code pour l'usage courant" },
        { layer: "Couche Skills & Agents", items: "Joule Skills (~2 400 en 2026), Joule Agents (~40 agents spécialisés), Joule Studio pour en créer de nouveaux", role: "Exécution des actions métier — soumise aux autorisations PFCG standard" },
        { layer: "Couche Orchestration Service", items: "Prompt templating, Document Grounding (RAG), Data Masking, Content Filtering", role: "Compose plusieurs capacités IA en une seule configuration réutilisable" },
        { layer: "Couche Generative AI Hub", items: "Accès unifié à GPT-4o (Azure), Claude (Anthropic/Bedrock), Gemini (Vertex AI), Llama, Mistral, SAP-RPT-1", role: "Abstraction des fournisseurs de LLM externes, gouvernance et facturation centralisées" },
        { layer: "Couche AI Core", items: "Scenarios, Configurations, Deployments, Executions, Resource Groups — sur cluster Kubernetes isolé par resource group", role: "Runtime d'exécution des workloads IA (modèles custom et foundation models) dans BTP" },
        { layer: "Couche AI Launchpad", items: "Gestion des runtimes AI Core connectés, Prompt Registry, statistiques d'usage, administration et audit", role: "Interface web SaaS de gouvernance — ne remplace pas AI Core, elle le pilote" },
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
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Processus IA standard</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Quatre processus que la certification {certCode("ai")} attend en pratique — avec un scénario métier
      concret pour chacun, plutôt qu'une liste d'étapes abstraites.
    </p>
    <div className="space-y-6">
      {/* Pipeline RAG */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-600 text-white">RAG</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Document Grounding — RAG appliqué à un litige fournisseur</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          <span className="font-medium text-slate-800 dark:text-slate-100">Scénario :</span> un acheteur demande à Joule
          « Pourquoi la facture du fournisseur Atlas Composants a-t-elle été bloquée ? ». Sans grounding, le LLM
          invente une réponse plausible. Avec Document Grounding, la réponse cite la pièce exacte.
        </p>
        <ol className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Indexation en amont : les documents du dossier fournisseur (bons de commande, conditions d'achat, historique de litiges, contrats PDF) sont découpés en fragments, transformés en embeddings et stockés dans le HANA Vector Engine via le module Grounding Storage de l'Orchestration Service.",
            "À la question posée, le module Grounding Retrieval génère l'embedding de la requête et recherche les fragments les plus proches sémantiquement — pas seulement par mot-clé.",
            "Les fragments retenus (ex. la clause de tolérance de prix du contrat, l'historique des 3 derniers écarts) sont injectés dans le prompt envoyé au LLM, avec le Content Filtering et le Data Masking appliqués au passage pour ne pas exposer de données sensibles non pertinentes.",
            "Le LLM génère la réponse en citant ses sources, que Joule affiche à l'acheteur sous forme de liens vers les documents d'origine — condition de confiance indispensable en contexte métier.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Prompt engineering */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-600 text-white">PROMPT</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Prompt engineering — générer un commentaire de variance FI</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          <span className="font-medium text-slate-800 dark:text-slate-100">Scénario :</span> un contrôleur de
          gestion veut qu'un prompt réutilisable, stocké dans le Prompt Registry du Generative AI Hub, transforme
          chaque mois les écarts budgétaires bruts en commentaire prêt à partager — sans réinventer la formulation
          à chaque fois ni obtenir un texte verbeux et inexploitable.
        </p>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700 p-3 text-xs font-mono text-slate-600 dark:text-slate-300 mb-2 leading-relaxed whitespace-pre-wrap">
{`Rôle : contrôleur de gestion senior, ton factuel, pas de jugement de valeur.
Contexte : {données CO-PA du centre de coûts, écarts réel vs budget du mois, M-1 et M-12}.
Contrainte : 4 phrases maximum, aucune donnée hors du contexte fourni, devise en EUR.
Format de sortie : 1) écart principal et montant, 2) cause probable si déductible des données,
  3) tendance vs M-1, 4) action recommandée si l'écart dépasse 10 %.
Interdit : extrapoler une cause non présente dans les données, donner un avis personnel.`}
        </div>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Séparer explicitement rôle, contexte, contraintes et format de sortie — un prompt qui mélange tout produit des réponses inconsistantes d'une exécution à l'autre.",
            "Fixer une limite de format (ici 4 phrases, structure numérotée) pour que la sortie s'intègre directement dans un rapport sans retraitement manuel.",
            "Interdire explicitement l'extrapolation hors du contexte fourni : c'est la différence entre un prompt robuste et un prompt qui hallucine dès que les données sont incomplètes.",
            "Versionner ce prompt dans le Prompt Registry plutôt que de le coder en dur dans l'application — il devient réutilisable par d'autres équipes CO sans dépendre du développeur initial.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700" />

      {/* Déploiement modèle */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-sap-blue text-white">DEPLOY</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Consommer un LLM via AI Core dans BTP</h3>
        </div>
        <ol className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Provisionner l'instance SAP AI Core (plan extended pour accéder au Generative AI Hub) dans le sub-account BTP, puis la connecter à SAP AI Launchpad.",
            "Créer un Resource Group — l'isolation technique par projet ou tenant repose sur un namespace Kubernetes dédié, pas seulement une convention de nommage.",
            "Choisir le scenario adapté : foundation-models pour un accès direct à un LLM, orchestration pour composer templating + grounding + masking + content filtering en une seule configuration.",
            "Créer une Configuration pointant vers le modèle cible (ex. gpt-4o, anthropic--claude-3.5-sonnet, gemini-2.5-flash selon la région BTP) puis lancer le Deployment.",
            "Consommer l'URL d'inférence générée depuis l'application via le SDK officiel — @sap-ai-sdk/* en JavaScript/TypeScript, sap-ai-sdk-gen (ex-generative-ai-hub-sdk) en Python — authentifié par XSUAA.",
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
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Créer une Joule Skill ou un agent custom</h3>
        </div>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Modéliser l'intention métier visée (ex. « créer une facture pour le client X ») et distinguer une skill simple (une action, une réponse) d'un agent (plusieurs étapes enchaînées avec décisions intermédiaires).",
            "Définir les entités et paramètres structurés attendus en entrée, avec leur validation — un agent mal cadré en amont improvise sur des données incomplètes.",
            "Construire la skill ou l'agent dans Joule Studio (l'atelier low-code de SAP Build dédié, en disponibilité générale depuis le premier trimestre 2026), ou par code pour une logique plus poussée (CAP/RAP côté SAP, intégration externe via la passerelle MCP de SAP Integration Suite pour les systèmes non-SAP).",
            "Déclarer les autorisations PFCG requises — Joule n'introduit pas de modèle de permissions parallèle, il respecte les rôles déjà en place dans le tenant.",
            "Tester dans l'environnement Launchpad / Joule Studio, puis publier pour les utilisateurs finaux du tenant, avec une journalisation de chaque action de l'agent pour la traçabilité.",
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
      L&apos;IA SAP n&apos;est pas un module isolé : Joule et les mêmes briques Generative AI Hub se déclinent
      différemment selon la ligne métier qu&apos;elles assistent.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { pair: "IA – Finance (FI)", desc: "Joule explique un écart de clôture en citant les documents comptables sources (Document Grounding), génère un brouillon de commentaire de variance à partir des données CO-PA réelles — le contrôleur valide, Joule ne poste jamais d'écriture sans confirmation.", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
        { pair: "IA – Ventes (SD)", desc: "Création de commande client en langage naturel via une Joule Skill transactionnelle, suggestion d'offres personnalisées en s'appuyant sur l'historique du compte via RAG plutôt que sur des règles de tarification statiques.", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40" },
        { pair: "IA – Achats (MM)", desc: "Comparaison automatique des bons de commande récents, détection d'anomalies de prix fournisseur, et — cas réel détaillé plus haut — explication d'un blocage de facture en citant la clause contractuelle exacte.", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" },
        { pair: "IA – RH (SuccessFactors)", desc: "Agents Joule pré-construits pour le support RH de premier niveau (congés, avantages) et l'aide à la décision sur les effectifs ; SAP a annoncé une intégration renforcée des modèles Claude d'Anthropic pour ces scénarios RH et achats dans sa pile « Autonomous Enterprise ».", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40" },
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
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Joule en 2026 — ce qui a vraiment changé</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les évolutions les plus significatives du copilote dans S/4HANA Cloud et au-delà, pour éviter de décrire un Joule figé à son lancement 2023.</p>
    <div className="space-y-3">
      {[
        { title: "Joule Studio (disponibilité générale — T1 2026)", desc: "Atelier low-code intégré à SAP Build pour concevoir des Joule Skills et Joule Agents custom en s'appuyant sur les connaissances métier et services IA déjà intégrés à SAP — c'est l'outil par lequel une entreprise étend Joule sans écrire de code bas niveau." },
        { title: "Assistants IA par rôle (T4 2025)", desc: "Plutôt qu'un copilote générique, Joule propose désormais des assistants adaptés à un rôle précis (finance, RH, achats…) qui sollicitent automatiquement le bon agent spécialisé — l'utilisateur n'a plus à savoir lequel invoquer." },
        { title: "Deep Research", desc: "Capacité de recherche approfondie permettant à Joule de synthétiser des données internes SAP et de l'intelligence externe pour répondre à des questions multi-domaines plus stratégiques qu'une simple requête transactionnelle." },
        { title: "Interopérabilité agent-à-agent (A2A, Sapphire 2026)", desc: "Les agents Joule Studio et les agents Microsoft Copilot Studio peuvent se déléguer des tâches via le protocole ouvert A2A — par exemple un agent de service client Microsoft qui interroge un agent Joule pour vérifier le statut d'une commande SAP." },
        { title: "Passerelle MCP (Model Context Protocol)", desc: "Nouvelle fonctionnalité de SAP Integration Suite qui connecte les Joule Agents à des données de systèmes non-SAP via des serveurs MCP tiers — simplifie l'intégration IA au-delà du seul périmètre SAP." },
        { title: "Agents métier pré-construits", desc: "SAP livre désormais des agents prêts à l'emploi pour la finance, la supply chain et les RH (gestion de litiges, support sourcing, planification de maintenance) plutôt que de tout laisser à construire au client." },
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
   Responsible AI
───────────────────────────────────────────────────────────── */
const ResponsibleAI = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.15 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Responsible AI chez SAP</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Un sujet d&apos;examen à part entière de la certification {certCode("ai")} — et pas une simple formule
      marketing : SAP a publié ses premiers principes d&apos;éthique IA en 2018, avant la plupart des éditeurs,
      et a formé un comité d&apos;éthique IA interne (AI Ethics Committee) chargé de revoir les cas d&apos;usage à risque.
    </p>
    <div className="grid sm:grid-cols-3 gap-4 mb-5">
      {[
        { title: "Relevant", desc: "L'IA doit produire un impact métier mesurable — ERP, finance, supply chain, RH, expérience client — pas une fonctionnalité gadget déconnectée du processus réel.", color: "border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" },
        { title: "Reliable", desc: "Les réponses doivent être ancrées dans les données de l'entreprise (grounding), explicables et traçables — c'est la justification technique directe du Document Grounding.", color: "border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" },
        { title: "Responsible", desc: "Conformité réglementaire (dont l'EU AI Act), sécurité, protection des données et respect des droits humains — avec des lignes rouges explicites (surveillance de masse, scoring social, discrimination).", color: "border-fuchsia-200 dark:border-fuchsia-800/40 bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400" },
      ].map(({ title, desc, color }) => (
        <div key={title} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-sm font-bold mb-1">{title}</p>
          <p className="text-xs leading-relaxed opacity-90">{desc}</p>
        </div>
      ))}
    </div>
    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
      <p>
        Ces trois piliers s&apos;appuient sur une Global AI Ethics Policy (2022, mise à jour en 2024 pour
        s&apos;aligner sur la recommandation de l&apos;UNESCO sur l&apos;éthique de l&apos;IA) et une dizaine de
        principes directeurs — parmi lesquels la proportionnalité (ne pas créer de risque disproportionné par
        rapport au bénéfice), la supervision humaine sur les décisions automatisées, les tests de biais et la
        possibilité pour un utilisateur de contester une sortie IA qu&apos;il juge injuste.
      </p>
      <p>
        Pour un développeur IA SAP, ça se traduit concrètement en trois réflexes : (1) toujours grounder une
        réponse métier sensible plutôt que de laisser le LLM improviser, (2) activer le Content Filtering et le
        Data Masking de l&apos;Orchestration Service sur tout flux qui traite des données personnelles ou
        commercialement sensibles, (3) ne jamais laisser un agent exécuter une action irréversible (poster une
        facture, valider un paiement) sans confirmation humaine explicite — c&apos;est le modèle que Joule suit
        par défaut sur ses fonctions transactionnelles.
      </p>
      <p>
        Sur la confidentialité des données : SAP s&apos;engage publiquement à ne pas partager les données client
        avec les fournisseurs de LLM tiers (OpenAI, Anthropic, Google…) à des fins d&apos;entraînement de leurs
        modèles — c&apos;est l&apos;argument central du Generative AI Hub face à un appel direct, non gouverné, à
        l&apos;API d&apos;un fournisseur.
      </p>
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
    <h2 className="text-xl font-bold mb-1">Pourquoi se former à l&apos;IA SAP ?</h2>
    <p className="text-sm text-white/70 mb-5">
      C&apos;est la spécialité SAP la plus récente et, selon la plupart des retours d&apos;ESN et de cabinets de
      recrutement SAP, la plus en tension à date — les profils capables de combiner le fonctionnel SAP et l&apos;IA
      générative restent rares. Les niveaux de rémunération précis varient trop selon le client, la région et le
      type de contrat pour être généralisés ici ; les intitulés ci-dessous donnent le périmètre réel des postes.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP IA / Joule", desc: "Déploie Joule chez les clients, cadre et monte les premières Joule Skills avec Joule Studio, anime les ateliers de cadrage des cas d'usage IA avec les métiers." },
        { title: "Solution Architect IA SAP", desc: "Conçoit l'architecture AI Core + Generative AI Hub + Joule en environnement entreprise — un profil qui combine compétences cloud BTP, sécurité (XSUAA, PFCG) et IA générative." },
        { title: "Prompt / RAG Engineer SAP", desc: "Spécialiste de l'Orchestration Service : prompt templates versionnés, pipelines de Document Grounding, optimisation du rapport coût/qualité des réponses. Profil hybride développeur + métier." },
        { title: "AI Ops / Governance Engineer (SAP BTP)", desc: "Suit les deployments IA en production : consommation de capacity units, gestion des quotas fournisseurs, audit de conformité au regard de l'EU AI Act et des principes Responsible AI de SAP." },
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
  { code: "AI Launchpad", label: "SaaS multitenant sur BTP", usage: "Interface de gouvernance IA — connexion aux runtimes AI Core, gestion des resource groups, Prompt Registry, statistiques de consommation." },
  { code: "AI API", label: "API de cycle de vie", usage: "Interface standard pour piloter scenarios, configurations, deployments et executions — identique que le runtime soit SAP ou partenaire (AWS, GCP)." },
  { code: "BTP Cockpit", label: "Provisioning", usage: "Souscription à l'instance AI Core (plan extended pour le Generative AI Hub), lien entre le sub-account BTP et le tenant." },
  { code: "SDK JavaScript/TS", label: "@sap-ai-sdk/*", usage: "Packages npm officiels (foundation-models, orchestration, document-grounding, prompt-registry…) — le SDK Node/TS pour consommer le Generative AI Hub." },
  { code: "SDK Python", label: "sap-ai-sdk-gen", usage: "Successeur officiel de generative-ai-hub-sdk (désormais déprécié) — l'import reste gen_ai_hub, seul le nom du paquet installé a changé." },
  { code: "Joule Studio", label: "SAP Build", usage: "Atelier low-code pour créer et publier des Joule Skills et Joule Agents custom, en disponibilité générale depuis début 2026." },
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
    a: "Pas obligatoirement. Le rôle Consultant SAP IA peut rester fonctionnel : cadrage des cas d'usage, création de Joule Skills dans Joule Studio (low-code), gouvernance Responsible AI. Les profils techniques (TypeScript/Python, API REST) sont attendus pour les rôles Solution Architect ou Prompt/RAG Engineer qui manipulent directement l'Orchestration Service et les SDK @sap-ai-sdk / sap-ai-sdk-gen.",
  },
  {
    q: "Joule remplace-t-il Fiori ?",
    a: "Non. Pour les tâches structurées et répétitives (saisie de commande, validation d'un workflow), Fiori reste plus rapide et plus prévisible. Joule excelle sur les questions ad-hoc, l'analyse transverse et l'enchaînement de plusieurs actions en langage naturel via ses agents. Les deux coexistent dans le même launchpad.",
  },
  {
    q: "Quelle différence entre RAG et fine-tuning ?",
    a: "Le RAG (Document Grounding chez SAP) injecte du contexte au moment de la requête, sans entraînement : mise à jour facile en ré-indexant les documents, pas de coût d'entraînement. Le fine-tuning modifie les poids du modèle — plus coûteux et plus complexe à maintenir, mais peut ancrer un style ou un vocabulaire métier de façon plus profonde. En pratique, l'écrasante majorité des cas d'usage SAP passent par le RAG plutôt que par le fine-tuning.",
  },
  {
    q: "L'examen C_AIG est-il un QCM classique ?",
    a: "Non, plus depuis la bascule annoncée fin 2025 : la certification est passée d'un format QCM (60 questions, 2h) à une System-Based Assessment — une activité pratique unique, réalisée dans un environnement SAP configuré, où le candidat est évalué sur des tâches réellement exécutées (prompt engineering, orchestration, grounding) plutôt que sur des questions à choix multiples. Des sources tierces continuent de décrire l'ancien format QCM ; vérifier la page officielle SAP Learning avant de s'inscrire reste indispensable.",
  },
  {
    q: "Les modèles utilisés par Joule et le Generative AI Hub sont-ils sûrs pour nos données ?",
    a: "SAP s'engage à ne pas transmettre les données client aux fournisseurs de LLM tiers (Azure OpenAI, Anthropic via AWS Bedrock, Google Vertex AI…) à des fins d'entraînement de leurs modèles, et gère l'authentification, la gouvernance et l'audit de façon centralisée dans le Generative AI Hub. C'est précisément l'argument qui justifie de ne jamais appeler l'API d'un fournisseur en direct depuis une application SAP, au profit du Generative AI Hub.",
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
  { title: "SAP Learning — SAP Generative AI Developer (parcours C_AIG)", href: "https://learning.sap.com/learning-journeys/develop-generative-ai-applications-with-sap", source: "SAP Learning" },
  { title: "SAP Certified Associate — SAP Generative AI Developer", href: "https://learning.sap.com/certifications/sap-certified-associate-sap-generative-ai-developer", source: "SAP Learning" },
  { title: "SAP AI Core — Documentation officielle", href: "https://help.sap.com/docs/sap-ai-core", source: "SAP Help" },
  { title: "SAP AI Launchpad — Documentation", href: "https://help.sap.com/docs/ai-launchpad", source: "SAP Help" },
  { title: "Document Grounding (RAG) — référence SDK", href: "https://help.sap.com/doc/generative-ai-hub-sdk/CLOUD/en-US/_reference/document-grounding.html", source: "SAP Help" },
  { title: "SAP Joule — Vue d'ensemble produit", href: "https://www.sap.com/products/artificial-intelligence/ai-assistant.html", source: "SAP.com" },
  { title: "Generative AI Hub — Quickstart AI Core", href: "https://developers.sap.com/tutorials/ai-core-generative-ai.html", source: "SAP Developers" },
  { title: "SAP AI Ethics Policy & Responsible AI", href: "https://www.sap.com/products/artificial-intelligence/ai-ethics.html", source: "SAP.com" },
];

const AiResources = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.26 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources officielles SAP</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Documentation, parcours de certification et référence SDK à jour pour approfondir.</p>
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
    description="Maîtrise SAP AI Core, AI Launchpad, le Generative AI Hub, Joule et le prompt engineering responsable. Prépare la certification SAP Certified Associate — SAP Generative AI Developer."
    gradient="from-purple-700 via-violet-700 to-fuchsia-600"
    badge="LLMs · RAG · Joule · Responsible AI"
    stats={["~30 min de lecture", "9 concepts clés", `Certification ${certCode("ai")}`]}
  >
    <KeyConcepts />
    <AIStack />
    <Processes />
    <Integration />
    <S4HANAFeatures />
    <ResponsibleAI />
    <CareerBenefits />
    <AiTools />
    <AiResources />
    <FaqAccordion />
  </ModuleLayout>
);

export default AI;
