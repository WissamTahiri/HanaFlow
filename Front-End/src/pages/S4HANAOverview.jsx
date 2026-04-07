import React, { useState } from "react";
import { motion } from "motion/react";
import PageLayout from "../components/PageLayout";

/* ─── Données ─────────────────────────────────────────── */

const keyConcepts = [
  {
    code: "HANA",
    title: "SAP HANA",
    desc: "Base de données in-memory en colonnes. Traitement ultra-rapide des données, fondement technique de S/4HANA.",
    color: "blue",
  },
  {
    code: "ACDOCA",
    title: "Universal Journal",
    desc: "Table centrale fusionnant FI et CO (remplace BSEG + COEP). Une source de vérité unique pour la finance.",
    color: "indigo",
  },
  {
    code: "FIORI",
    title: "SAP Fiori",
    desc: "Interface UX moderne, role-based, tile-based et responsive. Accessible sur PC, mobile et tablette.",
    color: "violet",
  },
  {
    code: "SIMPLI",
    title: "Simplification",
    desc: "Modèle de données allégé : suppression des tables redondantes (BSEG, COEP, BSAD…), moins d'agrégats.",
    color: "purple",
  },
  {
    code: "RISE",
    title: "RISE with SAP",
    desc: "Offre cloud packagée pour migrer vers S/4HANA Cloud : ERP + BTP + services de transformation inclus.",
    color: "pink",
  },
  {
    code: "ACTIVATE",
    title: "SAP Activate",
    desc: "Méthodologie agile officielle SAP en 5 phases pour déployer S/4HANA : Discover, Prepare, Explore, Realize, Deploy.",
    color: "fuchsia",
  },
];

const colorMap = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
  pink: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/30",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30",
};

const eccVsS4 = [
  { critere: "Base de données", ecc: "Oracle, MSSQL, DB2…", s4: "SAP HANA uniquement" },
  { critere: "Interface utilisateur", ecc: "SAP GUI (SAPGUI)", s4: "SAP Fiori (+ GUI possible)" },
  { critere: "Comptabilité", ecc: "FI + CO séparés (BSEG, COEP)", s4: "Universal Journal ACDOCA" },
  { critere: "Analytique", ecc: "Reporting différé (BW, cubes)", s4: "Temps réel (embedded analytics)" },
  { critere: "Déploiement", ecc: "On-Premise uniquement", s4: "On-Premise / Cloud / RISE" },
  { critere: "Fin de maintenance", ecc: "2027 (extended 2030)", s4: "Actif — feuille de route longue" },
];

const migrationStrategies = [
  {
    name: "Greenfield",
    color: "emerald",
    icon: "🌱",
    desc: "Nouvelle implémentation from scratch sur S/4HANA. Permet de repartir sur des processus propres et optimisés.",
    avantages: ["Processus métier repensés", "Pas de dette technique ECC", "Adoption des best practices SAP"],
    risques: ["Perte des personnalisations existantes", "Durée et coût élevés", "Change management fort"],
  },
  {
    name: "Brownfield",
    color: "amber",
    icon: "🏗️",
    desc: "Conversion du système ECC existant vers S/4HANA (System Conversion). Les données et la config sont conservés.",
    avantages: ["Continuité des données", "Durée réduite", "Moins de disruption business"],
    risques: ["Migration des données complexe", "Personnalisations à vérifier", "Nettoyage de données nécessaire"],
  },
  {
    name: "Bluefield",
    color: "blue",
    icon: "💧",
    desc: "Selective Data Transition : migration sélective des données et entités. Combine le meilleur des deux approches.",
    avantages: ["Flexibilité maximale", "Migration par entité (société, pays)", "Processus optimisés + données conservées"],
    risques: ["Complexité élevée", "Coût et durée importants", "Coordination IT difficile"],
  },
];

const careerBenefits = [
  {
    role: "Consultant S/4HANA Finance",
    desc: "Intervenir sur des projets de migration FI/CO, ACDOCA, clôture S/4HANA.",
    tags: ["FI", "CO", "Migration"],
  },
  {
    role: "Architecte de solution SAP",
    desc: "Choisir la stratégie Greenfield/Brownfield, dimensionner RISE, BTP et les intégrations.",
    tags: ["Architecture", "RISE", "BTP"],
  },
  {
    role: "Chef de projet SAP Activate",
    desc: "Piloter les 5 phases, gérer le fit-gap, le data migration et le cutover.",
    tags: ["Projet", "Activate", "Cutover"],
  },
  {
    role: "Consultant Fiori / UX SAP",
    desc: "Configurer le Fiori Launchpad, créer des apps role-based pour les utilisateurs métier.",
    tags: ["Fiori", "UX", "UI5"],
  },
];


const quizQuestions = [
  {
    q: "Quelle table contient l'Universal Journal dans S/4HANA ?",
    choices: ["BKPF", "ACDOCA", "COEP", "BSEG"],
    answer: 1,
    expl: "ACDOCA est la table centrale de l'Universal Journal, fusionnant les écritures FI et CO en une seule source.",
  },
  {
    q: "Quel est le prérequis technique obligatoire pour SAP S/4HANA ?",
    choices: ["Oracle DB", "SAP HANA", "MSSQL", "PostgreSQL"],
    answer: 1,
    expl: "S/4HANA ne fonctionne qu'avec SAP HANA comme base de données — c'est une exigence non négociable.",
  },
  {
    q: "Qu'est-ce que SAP Fiori ?",
    choices: [
      "Un module comptable",
      "Un outil de migration",
      "L'interface UX moderne de SAP",
      "Une base de données",
    ],
    answer: 2,
    expl: "Fiori propose des apps tile-based, role-based, responsive — remplaçant progressivement le SAP GUI.",
  },
  {
    q: "Quelle stratégie de migration consiste à repartir from scratch sur S/4HANA ?",
    choices: ["Brownfield", "Bluefield", "Greenfield", "Sandbox"],
    answer: 2,
    expl: "La migration Greenfield est une nouvelle implémentation complète, sans reprendre le système ECC existant.",
  },
  {
    q: "Combien de phases compte la méthodologie SAP Activate ?",
    choices: ["3", "4", "5", "6"],
    answer: 2,
    expl: "SAP Activate compte 5 phases : Discover, Prepare, Explore, Realize, Deploy.",
  },
  {
    q: "Que signifie RISE with SAP ?",
    choices: [
      "Un programme de formation",
      "Une offre cloud packagée de migration S/4HANA",
      "Un outil de test",
      "Une certification SAP",
    ],
    answer: 1,
    expl: "RISE regroupe S/4HANA Cloud, BTP, et des services de transformation pour simplifier la migration cloud.",
  },
  {
    q: "Dans S/4HANA, quelle table remplace BSEG et COEP ?",
    choices: ["FAGLFLEXA", "ACDOCA", "BKPF", "MATDOC"],
    answer: 1,
    expl: "ACDOCA unifie en une table les écritures FI (BSEG) et CO (COEP), éliminant la réconciliation FI-CO.",
  },
  {
    q: "Quelle stratégie conserve le système ECC existant tout en le convertissant vers S/4HANA ?",
    choices: ["Greenfield", "Bluefield", "Brownfield", "Sandbox"],
    answer: 2,
    expl: "La migration Brownfield (System Conversion) convertit l'ECC sans repartir de zéro, en conservant les données.",
  },
  {
    q: "Qu'est-ce que le Fiori Launchpad ?",
    choices: [
      "Un outil de reporting",
      "Un point d'entrée unifié pour toutes les apps Fiori",
      "Un module PP",
      "Un service BTP",
    ],
    answer: 1,
    expl: "Le Fiori Launchpad est le portail central qui présente les apps SAP sous forme de tuiles, organisées par rôle.",
  },
  {
    q: "Quelle est la date de fin du mainstream maintenance pour SAP ECC ?",
    choices: ["2025", "2027", "2030", "2035"],
    answer: 1,
    expl: "SAP a fixé la fin de maintenance ECC à 2027 (extended 2030 avec option payante), forçant la migration vers S/4HANA.",
  },
];

const resources = [
  {
    label: "SAP S/4HANA – Documentation officielle",
    desc: "Help Portal SAP : toute la doc S/4HANA On-Premise",
    href: "https://help.sap.com/docs/SAP_S4HANA_ON-PREM",
  },
  {
    label: "SAP Activate Methodology",
    desc: "Guide officiel de la méthodologie SAP Activate",
    href: "https://www.sap.com/products/erp/s4hana/sap-activate-methodology.html",
  },
  {
    label: "Learning Journey S/4HANA Finance",
    desc: "Parcours d'apprentissage officiel SAP Learning",
    href: "https://learning.sap.com/learning-journeys/explore-sap-s-4hana",
  },
  {
    label: "SAP Best Practices Explorer",
    desc: "Scope items et processus S/4HANA pré-configurés",
    href: "https://rapid.sap.com/bp/",
  },
  {
    label: "RISE with SAP – Vue d'ensemble",
    desc: "Comprendre l'offre RISE et ses composantes",
    href: "https://www.sap.com/products/erp/rise.html",
  },
];

const faqItems = [
  {
    q: "Quelle est la différence entre SAP ECC et S/4HANA ?",
    a: "S/4HANA est la suite ERP de nouvelle génération basée exclusivement sur SAP HANA. Contrairement à ECC, il simplifie le modèle de données via l'Universal Journal (ACDOCA), apporte Fiori comme UX moderne, et offre l'analytique temps réel. SAP a annoncé la fin de maintenance ECC en 2027.",
  },
  {
    q: "Faut-il obligatoirement migrer vers le cloud avec S/4HANA ?",
    a: "Non. S/4HANA est disponible On-Premise, Private Cloud ou Public Cloud. RISE with SAP est une offre packagée pour faciliter la migration cloud, mais les entreprises peuvent choisir de rester on-premise avec leur propre infrastructure.",
  },
  {
    q: "Qu'est-ce que l'Universal Journal (ACDOCA) ?",
    a: "L'Universal Journal est la principale simplification de S/4HANA Finance. La table ACDOCA fusionne les écritures FI (anciennement BSEG) et CO (anciennement COEP) en une seule source de vérité, éliminant la réconciliation FI-CO et les problèmes de divergence.",
  },
  {
    q: "Qu'est-ce que SAP Activate et pourquoi l'utiliser ?",
    a: "SAP Activate est la méthodologie officielle de SAP pour déployer S/4HANA. En 5 phases (Discover, Prepare, Explore, Realize, Deploy), elle intègre les best practices SAP sous forme de scope items pré-configurés, accélérant la mise en œuvre tout en réduisant les risques.",
  },
  {
    q: "Quels sont les principaux avantages de SAP Fiori ?",
    a: "Fiori propose une UX moderne, cohérente et responsive. Les apps sont role-based (adaptées au rôle métier), accessibles sur tout device, regroupées dans un Fiori Launchpad personnalisable. Elles remplacent progressivement le SAP GUI et améliorent l'adoption utilisateur.",
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

const S4Quiz = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? quizQuestions.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <Section title="Quiz – SAP S/4HANA">
      <div className="space-y-6">
        {quizQuestions.map((q, i) => (
          <div key={i} className="border border-indigo-500/15 rounded-2xl p-4 bg-gray-50 dark:bg-slate-800">
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
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20";
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
          className="mt-6 px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Valider le quiz
        </button>
      ) : (
        <div className="mt-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-500/20">
          <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
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
          <div
            key={i}
            className="border border-indigo-500/15 rounded-2xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              <span>{item.q}</span>
              <span className="ml-2 text-indigo-500 text-base">
                {open === i ? "−" : "+"}
              </span>
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

const S4HANAOverview = () => {
  return (
    <PageLayout
      label="S/4HANA"
      title="SAP S/4HANA"
      description="L'ERP de nouvelle génération de SAP : in-memory, Fiori, Universal Journal et analytique temps réel. Comprendre S/4HANA, c'est comprendre l'avenir de tous les projets SAP."
      accent="#6366F1"
      badge="ERP nouvelle génération · SAP HANA · Fiori"
      seoTitle="SAP S/4HANA – Vue d'ensemble et concepts clés"
      seoDescription="Découvrez SAP S/4HANA : Universal Journal, SAP HANA in-memory, Fiori UX, stratégies de migration Greenfield/Brownfield et méthodologie SAP Activate."
      seoPath="/s4hana"
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

      {/* ECC vs S/4HANA */}
      <Section title="SAP ECC vs SAP S/4HANA">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-50 dark:bg-indigo-900/20">
                <th className="text-left px-4 py-3 rounded-tl-xl font-semibold text-indigo-800 dark:text-indigo-200 text-xs">
                  Critère
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs">
                  SAP ECC (ancien)
                </th>
                <th className="text-left px-4 py-3 rounded-tr-xl font-semibold text-indigo-700 dark:text-indigo-300 text-xs">
                  SAP S/4HANA (nouveau)
                </th>
              </tr>
            </thead>
            <tbody>
              {eccVsS4.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-800/60"}
                >
                  <td className="px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {row.critere}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                    {row.ecc}
                  </td>
                  <td className="px-4 py-2.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    {row.s4}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Universal Journal */}
      <Section title="Universal Journal – La simplification Finance">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Dans SAP ECC, les écritures financières (FI) et les écritures de contrôle
          de gestion (CO) étaient stockées dans des tables distinctes : BSEG pour FI
          et COEP pour CO. Cela générait des problèmes de réconciliation et de
          performance.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          S/4HANA Finance introduit la table <span className="font-semibold text-indigo-700 dark:text-indigo-300">ACDOCA</span> — l'Universal Journal — qui
          fusionne toutes les dimensions (FI, CO, Asset Accounting, ML) en une seule
          écriture. Résultat : plus de réconciliation, reporting instantané, et une
          vision financière unifiée.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "BSEG (FI)", old: true, desc: "Postes comptables FI — remplacée par ACDOCA" },
            { label: "COEP (CO)", old: true, desc: "Postes CO — remplacée par ACDOCA" },
            { label: "ACDOCA", old: false, desc: "Universal Journal — source unique FI + CO + AA + ML" },
          ].map((t) => (
            <div
              key={t.label}
              className={`rounded-2xl p-4 border text-center ${
                t.old
                  ? "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 opacity-70"
                  : "border-indigo-500/40 bg-indigo-50 dark:bg-indigo-900/20"
              }`}
            >
              <p className={`text-sm font-bold mb-1 font-mono ${t.old ? "line-through text-slate-400" : "text-indigo-700 dark:text-indigo-300"}`}>
                {t.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SAP Fiori */}
      <Section title="SAP Fiori – UX moderne et role-based">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          SAP Fiori est l'environnement UX de S/4HANA. Il remplace progressivement
          le SAP GUI par des applications web modernes, accessibles sur tous les
          appareils, organisées par rôle métier dans le <strong>Fiori Launchpad</strong>.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Fiori Launchpad",
              desc: "Point d'entrée unifié présentant les apps SAP sous forme de tuiles personnalisables par rôle.",
            },
            {
              title: "Apps Transactionnelles",
              desc: "Remplacent les transactions SAPGUI classiques (ex : F-01, ME21N) avec une UX simplifiée.",
            },
            {
              title: "Apps Analytiques",
              desc: "Tableaux de bord temps réel basés sur les données ACDOCA, sans BW ni cube.",
            },
            {
              title: "Apps Factsheets",
              desc: "Vue 360° sur les objets métier (fournisseur, client, matériel) directement depuis Fiori.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-indigo-500/15 p-4 bg-gray-50 dark:bg-slate-800"
            >
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                {item.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stratégies de migration */}
      <Section title="Stratégies de migration vers S/4HANA">
        <div className="space-y-4">
          {migrationStrategies.map((s) => (
            <div
              key={s.name}
              className={`rounded-2xl border p-5 ${
                s.color === "emerald"
                  ? "border-emerald-500/25 bg-emerald-50 dark:bg-emerald-900/10"
                  : s.color === "amber"
                  ? "border-amber-500/25 bg-amber-50 dark:bg-amber-900/10"
                  : "border-blue-500/25 bg-blue-50 dark:bg-blue-900/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{s.icon}</span>
                <h3 className="text-base font-bold">{s.name}</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{s.desc}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Avantages</p>
                  <ul className="space-y-0.5">
                    {s.avantages.map((a, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                        <span className="text-emerald-500 mt-0.5">✓</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">Risques</p>
                  <ul className="space-y-0.5">
                    {s.risques.map((r, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                        <span className="text-rose-400 mt-0.5">!</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* SAP Activate */}
      <Section title="Méthodologie SAP Activate">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          SAP Activate est la méthodologie officielle SAP pour déployer S/4HANA. Elle
          est basée sur des best practices pré-configurés (scope items) et une
          approche agile en 5 phases.
        </p>
        <div className="grid sm:grid-cols-5 gap-3">
          {[
            { phase: "Discover", desc: "Exploration des best practices, business case, ROI" },
            { phase: "Prepare", desc: "Setup projet, équipe, infrastructure, kick-off" },
            { phase: "Explore", desc: "Fit-gap analysis, design, configuration initiale" },
            { phase: "Realize", desc: "Réalisation, développements, tests UAT" },
            { phase: "Deploy", desc: "Go-live, cutover, hypercare, stabilisation" },
          ].map((p, i) => (
            <div key={i} className="text-center">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-2">
                {i + 1}
              </div>
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">{p.phase}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{p.desc}</p>
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
              className="rounded-2xl border border-indigo-500/15 p-4 bg-gray-50 dark:bg-slate-800"
            >
              <p className="text-sm font-semibold mb-1">{c.role}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{c.desc}</p>
              <div className="flex flex-wrap gap-1">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
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
      <S4Quiz />

      {/* Ressources */}
      <Section title="Ressources">
        <ul className="space-y-3">
          {resources.map((r) => (
            <li key={r.label} className="flex items-start gap-3">
              <span className="mt-0.5 text-indigo-500">→</span>
              <div>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:underline"
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
};

export default S4HANAOverview;
