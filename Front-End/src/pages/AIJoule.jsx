import React, { useState } from "react";
import { motion } from "motion/react";
import PageLayout from "../components/PageLayout";

/* ─── Données ─────────────────────────────────────────── */

const keyConcepts = [
  {
    code: "JOULE",
    title: "Joule",
    desc: "Assistant d'IA générative de SAP intégré dans S/4HANA Cloud, BTP et SuccessFactors. Répond en langage naturel.",
    color: "violet",
  },
  {
    code: "AGENTS",
    title: "Agents IA",
    desc: "Agents semi-autonomes préconfigurés (Finance, Supply, RH…) qui automatisent les tâches et exécutent des actions SAP.",
    color: "purple",
  },
  {
    code: "STUDIO",
    title: "Joule Studio",
    desc: "Outil low-code sur SAP BTP pour construire des agents Joule personnalisés alignés sur les processus métier.",
    color: "pink",
  },
  {
    code: "BTP AI",
    title: "BTP AI Foundation",
    desc: "Plateforme IA de SAP sur BTP : héberge les LLMs, orchestre les agents et connecte Joule aux données SAP.",
    color: "fuchsia",
  },
  {
    code: "BDC",
    title: "Business Data Cloud",
    desc: "Couche d'unification des données SAP (et tierces) pour alimenter Joule en contexte métier pertinent.",
    color: "rose",
  },
  {
    code: "COPILOT",
    title: "Microsoft Copilot",
    desc: "Intégration de Joule dans Microsoft 365 (Teams, Outlook) — Joule accessible sans quitter l'environnement M365.",
    color: "indigo",
  },
];

const colorMap = {
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
  pink: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/30",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
};

const useCases = [
  {
    domain: "Finance (FI/CO)",
    icon: "💰",
    color: "blue",
    cases: [
      "\"Montre-moi le profit du trimestre par région vs budget\"",
      "Validation automatique de factures et détection d'anomalies",
      "Accélération de la clôture financière mensuelle",
      "Analyse des écarts EBITDA avec explications en langage naturel",
    ],
  },
  {
    domain: "Supply Chain (MM/SD/PP)",
    icon: "📦",
    color: "orange",
    cases: [
      "\"Quels Purchase Orders sont en retard aujourd'hui ?\"",
      "Détection proactive des risques de rupture de stock",
      "Recommandations de réapprovisionnement automatisées",
      "Suivi du cycle O2C et alertes de livraison",
    ],
  },
  {
    domain: "RH (HCM / SuccessFactors)",
    icon: "👥",
    color: "red",
    cases: [
      "Gestion assistée des demandes de congés et approbations",
      "Onboarding guidé pour les nouveaux collaborateurs",
      "Analyse des données de talent et recommandations RH",
      "Suivi des formations et du développement des compétences",
    ],
  },
  {
    domain: "IT / Technique",
    icon: "⚙️",
    color: "emerald",
    cases: [
      "Joule Studio pour créer des agents IA sur mesure",
      "BTP AI Foundation pour déployer ses propres LLMs",
      "Intégration Joule dans Microsoft 365 (Teams, Outlook)",
      "APIs Joule pour connecter des applications externes",
    ],
  },
];

const domainColors = {
  blue: "border-blue-500/20 bg-blue-50 dark:bg-blue-900/10",
  orange: "border-orange-500/20 bg-orange-50 dark:bg-orange-900/10",
  red: "border-rose-500/20 bg-rose-50 dark:bg-rose-900/10",
  emerald: "border-emerald-500/20 bg-emerald-50 dark:bg-emerald-900/10",
};

const domainTitleColors = {
  blue: "text-blue-700 dark:text-blue-300",
  orange: "text-orange-700 dark:text-orange-300",
  red: "text-rose-700 dark:text-rose-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
};

const careerBenefits = [
  {
    role: "Consultant IA SAP / Joule Specialist",
    desc: "Implémenter Joule, configurer les agents, former les utilisateurs métier aux use cases IA.",
    tags: ["Joule", "Agents", "IA générative"],
  },
  {
    role: "Consultant FI/CO + IA",
    desc: "Combiner expertise Finance et IA pour déployer les use cases Joule dans la clôture et le reporting.",
    tags: ["FI", "CO", "Joule Finance"],
  },
  {
    role: "Architecte BTP / IA SAP",
    desc: "Concevoir l'architecture IA SAP : BTP AI Foundation, Joule Studio, intégrations tierces.",
    tags: ["BTP", "Architecture", "LLM"],
  },
  {
    role: "Business Analyst augmenté",
    desc: "Exploiter Joule pour l'analyse métier, la rédaction de specs et le support décisionnel.",
    tags: ["Analyse", "Reporting", "Joule"],
  },
];

const quizQuestions = [
  {
    q: "Quel est le nom de l'assistant IA générative de SAP ?",
    choices: ["CoPilot", "Joule", "HAL", "Einstein"],
    answer: 1,
    expl: "Joule est l'assistant d'IA générative de SAP, intégré dans S/4HANA Cloud, BTP, SuccessFactors et d'autres solutions.",
  },
  {
    q: "Sur quelle plateforme SAP repose Joule pour l'exécution de l'IA ?",
    choices: ["S/4HANA uniquement", "BTP AI Foundation", "SAP ECC", "ABAP Workbench"],
    answer: 1,
    expl: "BTP AI Foundation est l'infrastructure IA de SAP qui héberge les LLMs et orchestre les agents Joule.",
  },
  {
    q: "Quel outil permet de créer des agents Joule personnalisés ?",
    choices: ["Joule Factory", "ABAP Studio", "Joule Studio", "SAP Build Apps"],
    answer: 2,
    expl: "Joule Studio est l'outil low-code sur BTP pour construire des agents Joule adaptés aux processus métier.",
  },
  {
    q: "Comment Joule interagit-il avec les utilisateurs SAP ?",
    choices: [
      "Via des formules Excel",
      "En langage naturel, directement dans les apps Fiori",
      "Via des transactions SAP GUI",
      "Via du code ABAP uniquement",
    ],
    answer: 1,
    expl: "Joule s'utilise en langage naturel dans les apps Fiori — pas besoin de connaître les transactions ou le code SAP.",
  },
  {
    q: "Quelle solution SAP unifie les données pour alimenter Joule en contexte métier ?",
    choices: ["SAP Datasphere", "Business Data Cloud", "SAP Analytics Cloud", "HANA Cloud"],
    answer: 1,
    expl: "Business Data Cloud unifie les données SAP (et tierces) pour que Joule ait un contexte métier pertinent et précis.",
  },
  {
    q: "Dans quel contexte Joule peut-il automatiser la validation de factures ?",
    choices: [
      "Seulement dans SD",
      "Seulement dans HCM",
      "Dans Finance/FI via les agents IA",
      "Dans ABAP uniquement",
    ],
    answer: 2,
    expl: "Les agents Joule Finance automatisent des tâches FI comme la validation de factures et la détection d'anomalies.",
  },
  {
    q: "Avec quel outil Microsoft Joule est-il intégré ?",
    choices: ["Azure DevOps", "Microsoft Teams / Copilot M365", "Excel uniquement", "Power BI"],
    answer: 1,
    expl: "Joule est intégré à Microsoft Teams et Copilot M365, permettant de l'utiliser sans quitter l'environnement Microsoft.",
  },
  {
    q: "Quelle est la différence principale entre Joule et un chatbot classique ?",
    choices: [
      "Joule est plus lent",
      "Joule accède aux données SAP en temps réel et exécute des actions",
      "Joule est uniquement textuel",
      "Joule nécessite une connexion VPN",
    ],
    answer: 1,
    expl: "Contrairement à un chatbot générique, Joule accède aux données SAP en temps réel et peut exécuter des actions métier directement.",
  },
  {
    q: "Qu'est-ce qu'un \"agent Joule\" ?",
    choices: [
      "Un consultant SAP humain",
      "Un système semi-autonome qui automatise des tâches SAP",
      "Un module SAP spécifique",
      "Un outil de test SAP",
    ],
    answer: 1,
    expl: "Un agent Joule est un système semi-autonome basé sur un LLM, préconfiguré pour automatiser des tâches métier spécifiques (Finance, RH, Supply…).",
  },
  {
    q: "Quel rôle émergent est directement lié à Joule et l'IA dans SAP ?",
    choices: [
      "Opérateur SAP GUI",
      "Consultant SAP Basis",
      "Consultant IA SAP / Joule Specialist",
      "Développeur COBOL",
    ],
    answer: 2,
    expl: "Le rôle de Consultant IA SAP / Joule Specialist émerge pour implémenter Joule, créer des agents et former les métiers aux use cases IA.",
  },
];

const resources = [
  {
    label: "Page officielle Joule – SAP (FR)",
    desc: "Découvrir Joule : fonctionnalités, cas d'usage, disponibilité",
    href: "https://www.sap.com/france/products/artificial-intelligence/ai-assistant.html",
  },
  {
    label: "SAP's AI Copilot Joule: Implications for Finance",
    desc: "Analyse approfondie des use cases Finance et contrôleurs",
    href: "https://sapinsider.org/analyst-insights/saps-ai-copilot-joule-implications-for-finance/",
  },
  {
    label: "SAP AI Joule – The Ultimate Guide",
    desc: "Fonctionnement, cas d'usage et intégration S/4HANA",
    href: "https://nav-it.com/sap-ai-joule-driving-collaborative-productivity-in-the-intelligent-enterprise/",
  },
  {
    label: "SAP S/4HANA Finance + Joule – Use Cases",
    desc: "Exemples concrets FICO + Joule (SAP Community)",
    href: "https://community.sap.com/t5/financial-management-blog-posts-by-members/sap-s4-hana-finance-integration-and-use-case-with-sap-joule/ba-p/13864939",
  },
  {
    label: "SAP renforce son assistant GenAI Joule",
    desc: "Actualité et roadmap Joule (Le Monde Informatique)",
    href: "https://www.lemondeinformatique.fr/actualites/lire-sap-renforce-son-assistant-genai-joule-93972.html",
  },
];

const faqItems = [
  {
    q: "Joule est-il disponible sur tous les produits SAP ?",
    a: "Joule est disponible sur SAP S/4HANA Cloud, SuccessFactors, BTP, SAP Ariba et d'autres solutions cloud SAP. Il s'étend progressivement à l'ensemble de l'écosystème SAP. La disponibilité on-premise est plus limitée.",
  },
  {
    q: "Quelle est la différence entre Joule et ChatGPT ?",
    a: "ChatGPT est un LLM généraliste sans accès aux données d'entreprise. Joule est spécifiquement conçu pour SAP : il accède aux données SAP en temps réel, connaît les processus SAP (FI, MM, SD…) et peut exécuter des actions directement dans les systèmes SAP.",
  },
  {
    q: "Peut-on créer ses propres agents Joule ?",
    a: "Oui, avec Joule Studio sur SAP BTP. Il permet de construire des agents personnalisés en low-code, alignés sur les processus et données spécifiques de l'entreprise. Ces agents peuvent être déployés dans les apps Fiori existantes.",
  },
  {
    q: "Joule remplace-t-il les consultants SAP ?",
    a: "Non — Joule augmente les consultants et les utilisateurs métier. Il automatise les tâches répétitives et simplifie l'accès aux données, mais la configuration, le design de processus et l'expertise métier restent le domaine des consultants. Le rôle évolue vers plus d'analyse et moins de saisie.",
  },
  {
    q: "Quels prérequis pour utiliser Joule dans mon organisation ?",
    a: "Joule nécessite SAP S/4HANA Cloud ou une solution SAP cloud compatible. La configuration implique BTP AI Foundation, l'intégration des données via Business Data Cloud, et la configuration des rôles et autorisations. Un partenaire SAP ou consultant Joule peut accompagner l'implémentation.",
  },
];

/* ─── Sous-composants ─────────────────────────────────── */

const Section = ({ title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800"
  >
    <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight-xl text-slate-900 dark:text-white mb-5">{title}</h2>
    {children}
  </motion.section>
);

const JouleQuiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? quizQuestions.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <Section title="Quiz – IA & Joule SAP">
      <div className="space-y-6">
        {quizQuestions.map((q, i) => (
          <div key={i} className="border border-violet-500/15 rounded-2xl p-4 bg-gray-50 dark:bg-slate-800">
            <p className="text-sm font-semibold mb-3">
              {i + 1}. {q.q}
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.choices.map((c, ci) => {
                let cls =
                  "text-left text-xs px-3 py-2 rounded-xl border transition-colors ";
                if (!submitted) {
                  cls +=
                    answers[i] === ci
                      ? "border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                      : "border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20";
                } else {
                  if (ci === q.answer)
                    cls += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300";
                  else if (answers[i] === ci)
                    cls += "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                  else
                    cls += "border-slate-200 dark:border-slate-700 opacity-50";
                }
                return (
                  <button
                    key={ci}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((p) => ({ ...p, [i]: ci }))}
                    className={cls}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                {q.expl}
              </p>
            )}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="mt-6 px-5 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Valider le quiz
        </button>
      ) : (
        <div className="mt-6 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-500/20">
          <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">
            Score : {score} / {quizQuestions.length}
            {score === quizQuestions.length
              ? " — Parfait !"
              : score >= 7
              ? " — Très bien !"
              : " — Continue à réviser."}
          </p>
        </div>
      )}
    </Section>
  );
};

const FaqAccordion = () => {
  const [open, setOpen] = useState(null);
  return (
    <Section title="FAQ – Questions fréquentes">
      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <div key={i} className="border border-violet-500/15 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
            >
              <span>{item.q}</span>
              <span className="ml-2 text-violet-500 text-base">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ─── Page principale ─────────────────────────────────── */

const AIJoule = () => (
  <PageLayout
    label="IA & Joule"
    title="IA & Joule – L'IA générative de SAP"
    description="Joule est l'assistant IA de SAP intégré dans toutes les apps cloud. Il répond en langage naturel, automatise les tâches métier et transforme la façon de travailler sur S/4HANA."
    accent="#8B5CF6"
    badge="Tous niveaux · IA générative · Agents SAP"
    seoTitle="IA & Joule SAP – Cas d'usage et concepts"
    seoDescription="Découvrez Joule, l'assistant IA générative de SAP : agents IA, Joule Studio, use cases par module (Finance, Supply Chain, RH) et perspectives de carrière."
    seoPath="/ai-joule"
  >
    {/* Concepts clés */}
    <Section title="Concepts clés">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {keyConcepts.map((k) => (
          <div
            key={k.code}
            className="rounded-2xl border p-4 bg-gray-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border mb-2 ${colorMap[k.color]}`}
            >
              {k.code}
            </span>
            <p className="text-sm font-semibold mb-1">{k.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{k.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Ce que fait Joule */}
    <Section title="Ce que fait Joule concrètement">
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
        Joule est intégré directement dans les apps SAP Fiori. L'utilisateur pose une
        question ou formule une demande en langage naturel — Joule va chercher les
        données SAP pertinentes, les analyse et propose une réponse ou exécute une
        action.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            title: "Assistant conversationnel",
            desc: "Pose une question en langage naturel dans n'importe quelle app Fiori. Joule combine les données S/4HANA, CO-PA, SuccessFactors en quelques secondes.",
            icon: "💬",
          },
          {
            title: "Agents IA métier",
            desc: "Des agents spécialisés (Finance, Achats, Supply, RH) automatisent des tâches comme la validation de factures, l'analyse de variance ou la détection d'anomalies.",
            icon: "🤖",
          },
          {
            title: "Requêtes temps réel",
            desc: "Accès instantané aux données FI/CO, ventes, stocks, RH via SAP HANA et Business Data Cloud — sans quitter son application.",
            icon: "⚡",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-violet-500/15 p-4 bg-gray-50 dark:bg-slate-800"
          >
            <span className="text-2xl mb-3 block">{item.icon}</span>
            <p className="text-sm font-semibold mb-2">{item.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Cas d'usage par domaine */}
    <Section title="Cas d'usage par domaine métier">
      <div className="grid sm:grid-cols-2 gap-4">
        {useCases.map((uc) => (
          <div
            key={uc.domain}
            className={`rounded-2xl border p-4 ${domainColors[uc.color]}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{uc.icon}</span>
              <h3 className={`text-sm font-bold ${domainTitleColors[uc.color]}`}>
                {uc.domain}
              </h3>
            </div>
            <ul className="space-y-1.5">
              {uc.cases.map((c, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-slate-400 mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>

    {/* Joule Studio & Agents */}
    <Section title="Joule Studio & Écosystème Agents">
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
        SAP développe une stratégie d'agents Joule : des systèmes semi-autonomes basés
        sur des LLMs, préconfigurés ou personnalisés via Joule Studio.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            title: "Agents préconfigurés",
            desc: "SAP livre plusieurs centaines d'agents prêts à l'emploi couvrant les processus Finance, Supply Chain, RH, IT — directement activables dans S/4HANA Cloud.",
          },
          {
            title: "Joule Studio (custom agents)",
            desc: "Permet aux clients de construire leurs propres agents (skills) via une interface low-code sur BTP, alignés sur leurs données et processus spécifiques.",
          },
          {
            title: "Intégration Microsoft M365",
            desc: "Joule est disponible dans Microsoft Teams, Outlook et Copilot M365 — l'utilisateur accède aux données SAP sans changer d'environnement de travail.",
          },
          {
            title: "SAP AI Foundation & BDC",
            desc: "L'infrastructure IA sur BTP orchestre les modèles et les agents. Business Data Cloud unifie les données SAP et tierces pour donner à Joule un contexte complet.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-violet-500/15 p-4 bg-gray-50 dark:bg-slate-800"
          >
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">
              {item.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Débouchés */}
    <Section title="Débouchés métier">
      <div className="grid sm:grid-cols-2 gap-4">
        {careerBenefits.map((c) => (
          <div
            key={c.role}
            className="rounded-2xl border border-violet-500/15 p-4 bg-gray-50 dark:bg-slate-800"
          >
            <p className="text-sm font-semibold mb-1">{c.role}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{c.desc}</p>
            <div className="flex flex-wrap gap-1">
              {c.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>

    {/* Quiz */}
    <JouleQuiz />

    {/* Ressources */}
    <Section title="Ressources">
      <ul className="space-y-3">
        {resources.map((r) => (
          <li key={r.label} className="flex items-start gap-3">
            <span className="mt-0.5 text-violet-500">→</span>
            <div>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-violet-700 dark:text-violet-300 hover:underline"
              >
                {r.label}
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400">{r.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>

    {/* FAQ */}
    <FaqAccordion />
  </PageLayout>
);

export default AIJoule;
