import React, { useState } from "react";

const CoQuiz = () => {
  const questions = [
    {
      id: 1,
      question: "Quel est l’objectif principal du module CO dans SAP S/4HANA ?",
      options: [
        "Gérer la comptabilité légale externe",
        "Piloter les coûts et la rentabilité interne",
        "Gérer les stocks physiques",
      ],
      answer: 1,
      explanation:
        "CO est dédié au controlling interne : analyse des coûts, marges, rentabilité par centre, produit, client.[web:184][web:185]",
    },
    {
      id: 2,
      question: "Un Cost Center est avant tout utilisé pour :",
      options: [
        "Mesurer les revenus par client",
        "Suivre les coûts d’une unité ou fonction",
        "Gérer les stocks par entrepôt",
      ],
      answer: 1,
      explanation:
        "Un centre de coûts regroupe les coûts pour une unité de responsabilité (service, atelier…).[web:173][web:181]",
    },
    {
      id: 3,
      question: "Un Profit Center est principalement utilisé pour :",
      options: [
        "Analyser les profits d’une business unit / ligne de produits",
        "Stocker les écritures FI brutes",
        "Gérer la paie",
      ],
      answer: 0,
      explanation:
        "Un profit center représente une unité génératrice de revenus et de coûts (BU, région, ligne de produits). [web:94][web:174]",
    },
    {
      id: 4,
      question: "CO‑PA (Profitability Analysis) sert à :",
      options: [
        "Analyser la rentabilité par dimensions (client, produit, région…)",
        "Configurer le plan de comptes",
        "Gérer les immobilisations",
      ],
      answer: 0,
      explanation:
        "CO‑PA permet d’analyser marges et contributions par multiples segments de marché.[web:177][web:185][web:182]",
    },
    {
      id: 5,
      question: "Dans S/4HANA, quel type de CO‑PA est fortement recommandé ?",
      options: [
        "Costing‑based uniquement",
        "Account‑based uniquement",
        "Account‑based CO‑PA (avec possibilité de coexistence costing‑based)",
      ],
      answer: 2,
      explanation:
        "S/4HANA pousse l’account‑based CO‑PA, aligné sur l’Universal Journal, tout en permettant la coexistence avec le costing‑based.[web:177][web:185]",
    },
    {
      id: 6,
      question:
        "Quel type d’objet est typiquement utilisé pour suivre les coûts d’un projet interne ou d’une campagne marketing ?",
      options: ["Cost Center", "Internal Order", "Profit Center"],
      answer: 1,
      explanation:
        "Les internal orders permettent de suivre des coûts temporaires ou spécifiques (projet, campagne) dans CO.[web:184]",
    },
    {
      id: 7,
      question:
        "Dans un flux de production PP, quel composant CO suit les coûts par ordre de production ?",
      options: [
        "Product Cost Controlling (CO‑PC)",
        "Accounts Receivable",
        "Asset Accounting",
      ],
      answer: 0,
      explanation:
        "CO‑PC suit coûts planifiés/réels, WIP et variances sur les ordres de production.[web:100][web:178][web:180]",
    },
    {
      id: 8,
      question:
        "Vrai ou Faux : en S/4HANA, les écritures FI sont simultanément visibles en CO grâce à l’Universal Journal.",
      options: ["Vrai", "Faux"],
      answer: 0,
      explanation:
        "L’Universal Journal (ACDOCA) combine FI et CO, offrant une vue unique des coûts et revenus.[web:177][web:185]",
    },
    {
      id: 9,
      question:
        'Pour quelle raison crée‑t‑on souvent un "dummy" profit center ?',
      options: [
        "Pour les tests uniquement",
        "Comme centre par défaut quand aucun profit center n’est dérivé",
        "Pour stocker les données historiques",
      ],
      answer: 1,
      explanation:
        "Un dummy profit center reçoit les écritures sans dérivation correcte, à nettoyer en clôture.[web:100]",
    },
    {
      id: 10,
      question:
        "Quel bénéfice clé apporte le COGS split en CO‑PA dans S/4HANA ?",
      options: [
        "Moins de détails sur le coût",
        "Répartition des COGS en composantes (matière, main‑d’œuvre, overhead)",
        "Suppression des analyses de marge",
      ],
      answer: 1,
      explanation:
        "Le COGS split permet de ventiler le coût des ventes par composantes pour une analyse de marge fine.[web:177][web:180]",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (qid, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = () => setSubmitted(true);
  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = questions.reduce((acc, q) => {
    const a = answers[q.id];
    return acc + (a === q.answer ? 1 : 0);
  }, 0);

  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/70 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Quiz CO – Centres de coûts, centres de profit et CO‑PA
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Vérifie ta compréhension des objets de controlling et de la logique
        CO‑PA en S/4HANA.
      </p>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="border border-sapBlue/10 rounded-xl p-3">
            <p className="text-sm font-semibold mb-2">
              {q.id}. {q.question}
            </p>
            <div className="space-y-1">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                const isCorrect = q.answer === idx;
                const showColors = submitted;
                let cls =
                  "w-full text-left text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-colors";

                if (!showColors) {
                  cls += selected
                    ? " border-sapBlue bg-sapBlue/10 text-sapBlue"
                    : " border-sapBlue/20 hover:border-sapBlue/60 hover:bg-sapBlue/5";
                } else if (showColors && isCorrect) {
                  cls +=
                    " border-emerald-500 bg-emerald-500/10 text-emerald-200";
                } else if (showColors && selected && !isCorrect) {
                  cls += " border-rose-500 bg-rose-500/10 text-rose-200";
                } else {
                  cls += " border-sapBlue/10";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChange(q.id, idx)}
                    className={cls}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                Explication : {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-sapBlue text-white text-sm font-semibold shadow-soft hover:bg-sapBlueDark transition-colors"
        >
          Valider mes réponses
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sapBlue/40 text-sapBlue text-sm font-semibold hover:bg-sapBlue/5 transition-colors"
        >
          Recommencer le quiz
        </button>
        {submitted && (
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
            Score : {score} / {questions.length}
          </p>
        )}
      </div>
    </div>
  );
};

const CoMiniProjectChecklist = () => {
  const items = [
    "Être capable d’expliquer la différence Cost Center / Profit Center à un manager.",
    "Comprendre comment les coûts FI sont imputés sur des Cost Centers et Internal Orders.",
    "Savoir décrire un scénario de marge produit dans CO‑PA (revenus, COGS, remises).",
    "Comprendre le lien entre Product Costing (CO‑PC) et COGS dans CO‑PA.",
    "Identifier les Fiori apps clés pour les controllers (Cost Center Plan/Actual, Profit Center, CO‑PA).",
    "Préparer 3 cas de test CO : allocation coûts, analyse marge, ordre interne.",
  ];

  const [done, setDone] = useState(Array(items.length).fill(false));
  const completed = done.filter(Boolean).length;
  const progress = Math.round((completed / items.length) * 100);

  const toggle = (idx) => {
    setDone((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <div className="mt-8 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 bg-emerald-500/5">
      <h2 className="text-xl font-semibold mb-2">
        Mini‑projet CO – Devenir opérationnel sur le controlling
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
        Utilise cette checklist pour structurer ton apprentissage CO en vue
        d’une mission FI/CO ou CO‑PA sur S/4HANA.
      </p>
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
          <span>Progression</span>
          <span>
            {completed} / {items.length} ({progress}%)
          </span>
        </div>
        <div className="h-2 rounded-full bg-emerald-500/10 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                done[idx]
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-emerald-500/60 bg-transparent"
              }`}
            >
              {done[idx] ? "✓" : ""}
            </button>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CoResources = () => {
  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/60 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Ressources CO / CO‑PA / Product Costing
      </h2>
      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <li>
          Tutoriel{" "}
          <span className="font-semibold">SAP CO Module Training Overview</span>{" "}
          (bases Cost Center Accounting, Profit Center, Internal Orders) –{" "}
          <a
            href="https://fr.scribd.com/document/438012163/Sap-Co-Tutorial"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir le document
          </a>
          .[web:175]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            What is CO‑PA? Simplifying Profitability Analysis with SAP S/4HANA
          </span>{" "}
          – focus sur l’account‑based CO‑PA, COGS split et analyses de marge –{" "}
          <a
            href="https://www.vc-erp.com/co-pa-simplifying-profitability-analysis-with-sap-s4hana/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:177]
        </li>
        <li>
          SAP Help{" "}
          <span className="font-semibold">Profitability Analysis (CO‑PA)</span>{" "}
          – documentation officielle sur les concepts CO‑PA –{" "}
          <a
            href="https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/be96d7531a4d414de10000000a174cb4.html"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire la doc
          </a>
          .[web:182]
        </li>
        <li>
          Guide pratique{" "}
          <span className="font-semibold">
            Product Cost Controlling (CO‑PC) in SAP S/4HANA
          </span>{" "}
          – gestion des coûts standards, WIP, variances –{" "}
          <a
            href="https://et.training/books/1240"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir le livre
          </a>
          .[web:100]
        </li>
        <li>
          Blog{" "}
          <span className="font-semibold">
            The Ultimate Guide to Product Costing in SAP S/4HANA
          </span>{" "}
          – configuration du costing engine, cost component structure, COGS
          split –{" "}
          <a
            href="https://community.sap.com/t5/technology-blog-posts-by-members/the-ultimate-guide-to-product-costing-in-sap-s-4hana/ba-p/14223308"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire le guide
          </a>
          .[web:180][web:183]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            The Ultimate Guide to SAP S/4HANA Controlling Master Data
          </span>{" "}
          – design des cost centers, profit centers, etc. –{" "}
          <a
            href="https://community.sap.com/t5/supply-chain-management-blog-posts-by-members/the-ultimate-guide-to-sap-s-4hana-controlling-master-data/ba-p/13799414"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir l&apos;article
          </a>
          .[web:184]
        </li>
      </ul>
    </div>
  );
};

const CO = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Module CO – Controlling (Cost Centers, Profit Centers, CO‑PA)
        </h1>
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
    bg-sapBlue/10 text-sapBlue border border-sapBlue/40"
          >
            Niveau : Intermédiaire
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Pour profils finance qui veulent aller plus loin sur CO‑PA et coûts.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Le module CO complète FI en offrant une vision interne des coûts et de
          la rentabilité. En S/4HANA, CO s’appuie sur l’Universal Journal et
          CO‑PA pour fournir des analyses de marge en temps réel par produit,
          client ou région.[web:177][web:185][web:184]
        </p>

        {/* Plan */}
        <div className="mb-6 border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/70 dark:bg-slate-800">
          <p className="text-xs font-semibold text-sapBlue mb-2">
            Plan de la page CO
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 grid sm:grid-cols-2 gap-y-1">
            <li>1. Rôle de CO & objets de base</li>
            <li>2. Cost Centers & Profit Centers</li>
            <li>3. Internal Orders & Product Costing</li>
            <li>4. CO‑PA & analyse de rentabilité</li>
            <li>5. Spécificités S/4HANA pour CO</li>
            <li>6. Mini‑projet & quiz CO</li>
          </ul>
        </div>

        {/* 1. Rôle & objets */}
        <h2 className="text-xl font-semibold mb-2">
          1. Rôle de CO et objets de base
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          CO répond à la question : “où et pourquoi les coûts sont‑ils
          consommés, et avec quelle rentabilité ?” Il travaille main dans la
          main avec FI et les modules logistiques (MM, SD,
          PP).[web:184][web:185]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Controlling Area</span> : périmètre
            CO regroupant un ensemble de company codes.[web:184]
          </li>
          <li>
            <span className="font-semibold">Cost Center</span> : unité de
            responsabilité où les coûts sont collectés.[web:173][web:181]
          </li>
          <li>
            <span className="font-semibold">Profit Center</span> : unité
            génératrice de profits (BU, région, produit).[web:94][web:174]
          </li>
          <li>
            <span className="font-semibold">Internal Order</span> : suivi
            temporaire de coûts sur un projet/campagne.[web:184]
          </li>
        </ul>

        {/* 2. Cost Centers & Profit Centers */}
        <h2 className="text-xl font-semibold mb-2">
          2. Cost Center Accounting & Profit Center Accounting
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              Cost Centers – “où les coûts sont‑ils consommés ?”
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Les cost centers représentent des services ou fonctions (IT, RH,
              production, ventes…). Ils permettent de suivre les coûts
              planifiés/réels et d&apos;effectuer des allocations vers
              d&apos;autres objets CO.[web:173][web:181][web:184]
            </p>
          </div>
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              Profit Centers – “quelles unités créent du profit ?”
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Les profit centers suivent les profits par BU, produit ou région.
              Ils sont souvent alignés avec la structure de reporting managérial
              (P&L par BU).[web:94][web:173][web:100]
            </p>
          </div>
        </div>

        {/* 3. Internal Orders & Product Costing */}
        <h2 className="text-xl font-semibold mb-2">
          3. Internal Orders et Product Cost Controlling (CO‑PC)
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          CO‑PC se concentre sur les coûts de production et la rentabilité au
          niveau des produits. Les internal orders complètent le dispositif pour
          des objets temporaires.[web:100][web:178][web:180]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Internal Orders</span> : utilisés
            pour suivre des coûts spécifiques (projets marketing, initiatives
            IT) et les solder vers d&apos;autres objets.[web:184]
          </li>
          <li>
            <span className="font-semibold">Product Costing (CO‑PC)</span> :
            calcule le coût standard des produits, suit WIP et variances sur
            ordres de fabrication.[web:100][web:178][web:180]
          </li>
        </ul>

        {/* 4. CO-PA */}
        <h2 className="text-xl font-semibold mb-2">
          4. CO‑PA – Profitability Analysis
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          CO‑PA permet d&apos;analyser la rentabilité par dimensions métier
          (client, produit, région, canal…). En S/4HANA, l&apos;account‑based
          CO‑PA devient la référence.[web:177][web:179][web:185]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Analyse de marge contributionnelle à partir des revenus, COGS et
            remises.[web:177][web:182]
          </li>
          <li>
            COGS split : ventilation du coût de vente par composantes (matière,
            main‑d’œuvre, overhead).[web:177][web:180]
          </li>
          <li>
            Drill‑down par client, produit, région, canal, etc. pour identifier
            les segments les plus rentables.[web:177][web:185]
          </li>
        </ul>

        {/* 5. S/4HANA spécificités */}
        <h2 className="text-xl font-semibold mb-2">
          5. Spécificités S/4HANA pour CO
        </h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Universal Journal : FI et CO dans ACDOCA, permettant des analyses
            temps réel plan/réel sur les mêmes structures.[web:177][web:185]
          </li>
          <li>
            Account‑based CO‑PA recommandé, avec possibilité de garder
            costing‑based pendant la transition.[web:177][web:185]
          </li>
          <li>
            Fiori apps pour les controllers : analyse cost centers, profit
            centers, CO‑PA, product costing.[web:177][web:184]
          </li>
        </ul>

        {/* Mini-projet, quiz, ressources */}
        <CoMiniProjectChecklist />
        <CoQuiz />
        <CoResources />
      </div>
    </section>
  );
};

export default CO;
