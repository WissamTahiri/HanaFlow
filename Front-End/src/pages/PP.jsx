import React, { useState } from "react";

const PpQuiz = () => {
  const questions = [
    {
      id: 1,
      question: "Quel est l’objectif principal du module PP dans SAP S/4HANA ?",
      options: [
        "Gérer la paie des employés",
        "Planifier et exécuter la production (MRP, ordres, capacités)",
        "Gérer les factures fournisseurs",
      ],
      answer: 1,
      explanation:
        "PP gère la planification, l’ordonnancement et l’exécution de la production (MRP, ordres, capacités).[web:98][web:202][web:207]",
    },
    {
      id: 2,
      question:
        "Dans un scénario de production discrète, quel est l’objet central qui pilote un lot de fabrication ?",
      options: ["Sales Order", "Production Order", "Purchase Requisition"],
      answer: 1,
      explanation:
        "En production discrète, chaque lot est piloté par un Production Order qui porte BOM, routing, coûts et historique.[web:205][web:208]",
    },
    {
      id: 3,
      question:
        "Quels master data sont essentiels pour un ordre de fabrication standard ?",
      options: [
        "BOM, Routing, Work Center, Production Version",
        "Vendor Master et Purchasing Info Record",
        "Customer Master et Pricing Conditions",
      ],
      answer: 0,
      explanation:
        "Une production fiable dépend de BOM, routing, work centers et production versions propres.[web:205][web:208][web:211]",
    },
    {
      id: 4,
      question:
        "Quel est l’ordre logique typique en PP pour la production discrète ?",
      options: [
        "Planification MRP → Planned Order → Production Order → Confirmation → Goods Issue/Receipt → Settlement",
        "Sales Order → Billing → Payment",
        "Purchase Requisition → Purchase Order → Goods Receipt → Invoice",
      ],
      answer: 0,
      explanation:
        "Le flux standard PP : MRP → planned order → conversion en ordre → exécution/confirmations → GI/GR → settlement.[web:205][web:208][web:211]",
    },
    {
      id: 5,
      question:
        "Quel mouvement de stock est typiquement utilisé pour la consommation de composants par un ordre de fabrication ?",
      options: ["101", "261", "601"],
      answer: 1,
      explanation:
        "Le mouvement 261 poste la consommation de composants pour un ordre de fabrication (goods issue).[web:205][web:211]",
    },
    {
      id: 6,
      question:
        "Quel module CO est le plus étroitement lié à PP pour le suivi des coûts de fabrication ?",
      options: [
        "CO‑PA (Profitability Analysis)",
        "Product Cost Controlling (CO‑PC)",
        "Asset Accounting (AA)",
      ],
      answer: 1,
      explanation:
        "CO‑PC gère les coûts standards, WIP, variances et settlement des ordres de fabrication.[web:100][web:180][web:209]",
    },
    {
      id: 7,
      question:
        "Vrai ou Faux : les work centers en PP sont liés à des cost centers CO pour imputer les coûts d’activité.",
      options: ["Vrai", "Faux"],
      answer: 0,
      explanation:
        "Les work centers portent un cost center et des activity types pour imputer les coûts de main‑d’œuvre/machine.[web:206][web:209]",
    },
    {
      id: 8,
      question:
        "Quel est l’intérêt de MRP Live / planning avancé en S/4HANA PP ?",
      options: [
        "Supprimer le besoin de BOM",
        "Planifier en temps réel avec prise en compte des contraintes et feedback d’exécution",
        "Remplacer le module FI",
      ],
      answer: 1,
      explanation:
        "MRP Live et PP/DS offrent planification temps réel, contraintes capacités et feedback d’exécution.[web:201][web:203][web:204]",
    },
    {
      id: 9,
      question:
        "Quelle étape PP déclenche typiquement le Goods Receipt (101) du produit fini en stock ?",
      options: [
        "Création de l’ordre",
        "Confirmation finale de l’ordre",
        "Calcul du coût standard",
      ],
      answer: 1,
      explanation:
        "La confirmation finale de l’ordre permet souvent de poster le GR 101 du produit fini.[web:205][web:208][web:213]",
    },
    {
      id: 10,
      question:
        "Quel est le rôle de la settlement d’ordre de fabrication dans l’intégration PP–CO ?",
      options: [
        "Envoyer les coûts réels vers le bon objet (produit, cost center, WBS) et analyser les variances",
        "Créer des factures clients",
        "Créer des demandes d’achat",
      ],
      answer: 0,
      explanation:
        "La settlement en CO affecte les coûts réels et variances vers le matériel ou autres objets CO.[web:206][web:209][web:180]",
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
        Quiz PP – Production discrète & intégration CO
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Vérifie ta compréhension des bases PP / CO‑PC en S/4HANA.
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

const PpMiniProjectChecklist = () => {
  const items = [
    "Comprendre le rôle de PP dans une entreprise industrielle (planification & exécution).",
    "Être capable de décrire le flux PP : MRP → Planned Order → Production Order → Confirmation → GI/GR → Settlement.",
    "Connaître les master data clés : BOM, Routing, Work Center, Production Version.",
    "Comprendre comment PP s’intègre avec CO‑PC (coût standard, WIP, variances).",
    "Identifier 2–3 Fiori apps clés pour un planificateur ou responsable d’atelier.",
    "Préparer 2–3 cas de test : ordre standard, rework, sous‑traitance.",
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
        Mini‑projet PP – Devenir opérationnel sur la production discrète
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
        Utilise cette checklist pour structurer ton apprentissage PP / CO‑PC en
        mode mission sur un site de production.
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

const PpResources = () => {
  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/60 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Ressources Production Planning / PP & CO‑PC
      </h2>
      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <li>
          Cours{" "}
          <span className="font-semibold">
            Exploring Production Planning in SAP S/4HANA
          </span>{" "}
          (FR) – introduction complète au PP S/4HANA, MRP Live, pMRP –{" "}
          <a
            href="https://learning.sap.com/courses/exploring-production-planning-in-sap-s-4hana-fr"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir le cours
          </a>
          .[web:201]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            Introduction to SAP PP (Production Planning) in S/4HANA
          </span>{" "}
          – vue d’ensemble des fonctionnalités PP –{" "}
          <a
            href="https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-members/introduction-to-sap-pp-production-planning-in-sap-s-4hana-cloud-public-edition/ba-p/13761865"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:98]
        </li>
        <li>
          Blog{" "}
          <span className="font-semibold">
            SAP PP Discrete Production: A Practical Guide
          </span>{" "}
          – processus complet pour production discrète (orders, GI/GR, costing)
          –{" "}
          <a
            href="https://portsapblogging.com/2024/06/14/sap-pp-discrete-production-a-practical-guide/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire le guide
          </a>
          .[web:205]
        </li>
        <li>
          Article LinkedIn{" "}
          <span className="font-semibold">SAP CO and PP Integration</span> –
          résumé de l’intégration PP–CO (cost centers, activity types,
          variances) –{" "}
          <a
            href="https://www.linkedin.com/posts/ramesh-b-22500513b_sap-co-controlling-and-pp-production-planning-activity-7288732390292606976-AnS5"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir l&apos;article
          </a>
          .[web:206]
        </li>
        <li>
          Guide{" "}
          <span className="font-semibold">
            The Ultimate Guide to Product Costing in SAP S/4HANA
          </span>{" "}
          – liens PP–CO‑PC, standard cost, variances, COGM/COGS –{" "}
          <a
            href="https://community.sap.com/t5/technology-blog-posts-by-members/the-ultimate-guide-to-product-costing-in-sap-s-4hana/ba-p/14223308"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire le guide
          </a>
          .[web:180][web:209]
        </li>
        <li>
          Vidéo{" "}
          <span className="font-semibold">
            SAP S/4HANA Manufacturing (PP) Full Course
          </span>{" "}
          – formation vidéo longue avec démos MRP, ordres, confirmations –{" "}
          <a
            href="https://www.youtube.com/watch?v=sF5k5MBbT-0"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            regarder la vidéo
          </a>
          .[web:212]
        </li>
      </ul>
    </div>
  );
};

const PP = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Module PP – Production Planning & Manufacturing
        </h1>
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
    bg-sapBlue/10 text-sapBlue border border-sapBlue/40"
          >
            Niveau : Intermédiaire
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Production discrète + intégration CO‑PC (coûts de fabrication).
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Le module PP gère la planification et l&apos;exécution de la
          production. En S/4HANA, il s&apos;appuie sur MRP Live, PP/DS et une
          intégration forte avec MM pour les composants et CO‑PC pour les coûts
          de fabrication.[web:98][web:201][web:202]
        </p>

        {/* Plan */}
        <div className="mb-6 border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/70 dark:bg-slate-800">
          <p className="text-xs font-semibold text-sapBlue mb-2">
            Plan de la page PP
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 grid sm:grid-cols-2 gap-y-1">
            <li>1. Rôle de PP & master data</li>
            <li>2. MRP et planification</li>
            <li>3. Cycle ordre de fabrication</li>
            <li>4. Intégration PP–CO‑PC & coûts</li>
            <li>5. Spécificités S/4HANA (MRP Live, PP/DS)</li>
            <li>6. Mini‑projet & quiz PP</li>
          </ul>
        </div>

        {/* 1. Rôle & master data */}
        <h2 className="text-xl font-semibold mb-2">
          1. Rôle de PP et master data de base
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          PP orchestre la transformation de la demande (prévisions, commandes
          clients) en ordres de fabrication exécutables, en s’appuyant sur des
          master data solides.[web:202][web:207]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Material Master</span> : vues MRP,
            work scheduling, costing.[web:205][web:210]
          </li>
          <li>
            <span className="font-semibold">Bill of Materials (BOM)</span> :
            liste des composants nécessaires.[web:205][web:208]
          </li>
          <li>
            <span className="font-semibold">Routing / Master Recipe</span> :
            opérations, work centers, temps
            standards.[web:205][web:208][web:211]
          </li>
          <li>
            <span className="font-semibold">Work Centers</span> : capacités,
            lien avec cost centers CO.[web:202][web:206]
          </li>
        </ul>

        {/* 2. MRP & planification */}
        <h2 className="text-xl font-semibold mb-2">2. Planification & MRP</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          MRP calcule les besoins en composants et capacités à partir des
          demandes (prévisions, commandes) pour proposer des planned orders et
          approvisionnements.[web:201][web:202][web:207]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            MRP Live en S/4HANA : calcul haute performance, prise en compte de
            la situation temps réel.[web:201][web:203][web:204]
          </li>
          <li>
            Planned Orders : propositions convertibles en ordres de fabrication
            ou achats.[web:205][web:210]
          </li>
          <li>
            Intégration avec PP/DS pour la planification détaillée contrainte en
            capacités.[web:204][web:213]
          </li>
        </ul>

        {/* 3. Cycle ordre de fabrication */}
        <h2 className="text-xl font-semibold mb-2">
          3. Cycle d’un ordre de fabrication (production discrète)
        </h2>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Création / conversion de l’ordre à partir d’un planned order ou
            manuellement.[web:205][web:208]
          </li>
          <li>
            Ordonnancement et planification des capacités sur work
            centers.[web:202][web:208]
          </li>
          <li>
            Release de l’ordre : mise à disposition pour
            l’atelier.[web:205][web:208]
          </li>
          <li>
            Exécution & confirmations d’opérations (temps, quantités,
            scrap).[web:205][web:208][web:213]
          </li>
          <li>
            Post Goods Issue (261) pour les composants, Post Goods Receipt (101)
            pour le produit fini.[web:205][web:211]
          </li>
          <li>
            Settlement de l’ordre vers le matériel / autres objets CO, analyse
            des variances.[web:206][web:209][web:180]
          </li>
        </ol>

        {/* 4. Intégration PP–CO‑PC */}
        <h2 className="text-xl font-semibold mb-2">
          4. Intégration PP avec CO‑PC (Product Cost Controlling)
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Chaque ordre de fabrication est un objet de coût CO‑PC. Les coûts
          planifiés sont dérivés du coût standard ; les coûts réels viennent des
          consommations matières, activités et
          overheads.[web:100][web:180][web:206]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Coût standard : basé sur BOM, routing, work centers, activity
            types.[web:100][web:209]
          </li>
          <li>
            WIP & variances : calculés et analysés lors de la
            clôture.[web:180][web:209]
          </li>
          <li>
            Intégration CO‑PA : COGM → COGS → marge dans
            CO‑PA.[web:180][web:209]
          </li>
        </ul>

        {/* 5. Spécificités S/4HANA */}
        <h2 className="text-xl font-semibold mb-2">
          5. Spécificités S/4HANA pour PP
        </h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            MRP Live & pMRP pour la planification
            prévisionnelle.[web:201][web:203]
          </li>
          <li>
            Intégration forte avec SAP S/4HANA Manufacturing for planning and
            scheduling pour le finite scheduling.[web:204][web:213]
          </li>
          <li>
            Fiori apps PP pour le suivi en temps réel des ordres, capacités,
            retards et coûts.[web:201][web:203]
          </li>
        </ul>

        {/* Mini-projet, quiz, ressources */}
        <PpMiniProjectChecklist />
        <PpQuiz />
        <PpResources />
      </div>
    </section>
  );
};

export default PP;
