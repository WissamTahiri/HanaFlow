import React, { useState } from "react";

const FiQuiz = () => {
  const questions = [
    {
      id: 1,
      question:
        "Quel objet représente une entité légale pour laquelle on produit un bilan et un compte de résultat ?",
      options: ["Controlling Area", "Company Code", "Profit Center"],
      answer: 1,
      explanation:
        "Le Company Code est l’unité légale de base pour les états financiers dans SAP FI.",
    },
    {
      id: 2,
      question:
        "Dans un processus P2P standard (MIRO), quels comptes FI sont généralement impactés ?",
      options: [
        "Compte client et compte de revenus",
        "Compte fournisseur et compte de charges/stock",
        "Compte d’immobilisation et compte d’amortissement",
      ],
      answer: 1,
      explanation:
        "La facture fournisseur impacte le compte fournisseur (AP) et un compte de charges ou de stock selon la nature de l’achat.",
    },
    {
      id: 3,
      question:
        "Quel est l’apport principal de l’Universal Journal (ACDOCA) en S/4HANA Finance ?",
      options: [
        "Séparer FI et CO dans deux tables",
        "Fusionner FI et CO dans une seule table",
        "Supprimer la comptabilité fournisseurs",
      ],
      answer: 1,
      explanation:
        "ACDOCA centralise FI et CO, ce qui simplifie le reporting temps réel FI/CO.",
    },
    {
      id: 4,
      question:
        "Quel sous-module FI gère les immobilisations et leurs amortissements ?",
      options: [
        "Accounts Receivable (AR)",
        "Asset Accounting (AA)",
        "General Ledger (GL)",
      ],
      answer: 1,
      explanation:
        "AA gère tout le cycle de vie des immobilisations (acquisition, mise en service, amortissement, cession).",
    },
    {
      id: 5,
      question:
        "Vrai ou Faux : dans un flux Order-to-Cash, la facturation SD crée automatiquement un document FI client.",
      options: ["Vrai", "Faux"],
      answer: 0,
      explanation:
        "La facture SD génère un document FI en clients (AR) avec TVA, revenus et comptes clients.",
    },
    {
      id: 6,
      question: "La Fiscal Year Variant sert principalement à :",
      options: [
        "Définir les devises utilisées",
        "Définir la structure de l’exercice comptable",
        "Définir les organisations d’achat",
      ],
      answer: 1,
      explanation:
        "La Fiscal Year Variant définit la longueur de l’exercice, les périodes et leur calendrier.",
    },
    {
      id: 7,
      question:
        "Quel sous-module FI gère la relance des fournisseurs et les lots de paiements ?",
      options: ["GL", "AP", "AR"],
      answer: 1,
      explanation:
        "AP (Accounts Payable) couvre la gestion des fournisseurs, des échéances et des paiements.",
    },
    {
      id: 8,
      question:
        "Dans un contexte S/4HANA Finance, quelles applications améliorent l’expérience utilisateur Finance ?",
      options: [
        "SAP GUI uniquement",
        "Fiori apps Finance",
        "BW on HANA uniquement",
      ],
      answer: 1,
      explanation:
        "Les Fiori apps Finance offrent des cockpits et listes analytiques temps réel pour les rôles Finance.[web:113]",
    },
    {
      id: 9,
      question:
        "Vrai ou Faux : chaque écriture FI peut porter un objet de controlling (centre de coûts, ordre interne…).",
      options: ["Vrai", "Faux"],
      answer: 0,
      explanation:
        "C’est un point clé d’intégration FI–CO : les écritures FI peuvent être imputées sur des objets CO.[web:90]",
    },
    {
      id: 10,
      question:
        "Dans la clôture mensuelle FI, quelle activité est typiquement réalisée ?",
      options: [
        "Création de commandes d’achat",
        "Planification MRP",
        "Provisions et écritures d’ajustement",
      ],
      answer: 2,
      explanation:
        "La clôture FI implique souvent des provisions, ajustements et contrôles de cohérence avant les états financiers.[web:90]",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (qid, index) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

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
        Quiz FI – 10 questions pour valider les bases
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Réponds aux questions ci-dessous comme si tu préparais un entretien
        junior FI/CO. Tu verras ton score et des explications après validation.
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
                let optionClasses =
                  "w-full text-left text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-colors";

                // Effet visuel dès la sélection (bord + fond léger)
                if (!showColors) {
                  optionClasses += selected
                    ? " border-sapBlue bg-sapBlue/10 text-sapBlue"
                    : " border-sapBlue/20 hover:border-sapBlue/60 hover:bg-sapBlue/5";
                } else if (showColors && isCorrect) {
                  optionClasses +=
                    " border-emerald-500 bg-emerald-500/10 text-emerald-200";
                } else if (showColors && selected && !isCorrect) {
                  optionClasses +=
                    " border-rose-500 bg-rose-500/10 text-rose-200";
                } else {
                  optionClasses += " border-sapBlue/10";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChange(q.id, idx)}
                    className={optionClasses}
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

const FiMiniProjectChecklist = () => {
  const items = [
    "Cartographier la structure FI (Company Codes, plan de comptes, fiscal year).",
    "Documenter le flux Procure-to-Pay côté FI (comptes impactés à chaque étape).",
    "Documenter le flux Order-to-Cash côté FI (clients, revenus, COGS, TVA).",
    "Préparer 5 cas de test FI : P2P, O2C, immobilisation, écriture GL manuelle, clôture simple.",
    "Comprendre les impacts de l’Universal Journal sur le reporting FI/CO.",
    "Identifier les principales Fiori apps Finance utilisées par les comptables.",
    "Expliquer à un key user la différence GL / AP / AR / AA.",
    "Être capable de lire et expliquer un document FI complet (en-tête + positions).",
  ];

  const [done, setDone] = useState(Array(items.length).fill(false));

  const completedCount = done.filter(Boolean).length;
  const progress = Math.round((completedCount / items.length) * 100);

  const toggle = (index) => {
    setDone((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  return (
    <div className="mt-8 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 bg-emerald-500/5">
      <h2 className="text-xl font-semibold mb-2">
        Mini‑projet FI – Es-tu prêt pour une mission junior ?
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
        Imagine une mission de déploiement S/4HANA Finance dans un groupe
        industriel européen. Ce mini‑projet FI liste les compétences concrètes à
        cocher au fur et à mesure de tes révisions.
      </p>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
          <span>Progression</span>
          <span>
            {completedCount} / {items.length} ({progress}%)
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

const FiTcodes = () => {
  const tcodes = [
    {
      code: "FB50",
      label: "Saisie d’écritures GL",
      usage:
        "Enregistrer une écriture comptable manuelle (ajustement, provision, reclassement).",
    },
    {
      code: "FBL1N",
      label: "Liste postes fournisseurs",
      usage:
        "Analyser les postes ouverts/compensés d’un fournisseur, utile en P2P et en clôture.",
    },
    {
      code: "FBL5N",
      label: "Liste postes clients",
      usage:
        "Analyser les postes ouverts clients, suivi des encaissements en O2C.",
    },
    {
      code: "FAGLL03",
      label: "Affichage écritures GL",
      usage:
        "Voir le détail des écritures sur un compte de bilan/compte de résultat.",
    },
  ];

  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/70 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        T‑codes FI à connaître pour une mission junior
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
        Quelques transactions classiques pour les consultants FI/CO et les
        comptables. L’objectif n’est pas de tout mémoriser, mais de savoir dans
        quel contexte les utiliser.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        {tcodes.map((t) => (
          <div
            key={t.code}
            className="border border-sapBlue/15 rounded-xl p-3 bg-white/80 dark:bg-slate-900/80"
          >
            <p className="text-xs font-semibold text-sapBlue mb-1">
              {t.code} – {t.label}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.usage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FiResources = () => {
  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/60 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Ressources récentes pour aller plus loin en SAP FI / S/4HANA Finance
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
        Quelques liens concrets pour approfondir FI et S/4HANA Finance avec des
        contenus à jour (2024–2026).
      </p>

      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <li>
          Cours officiel{" "}
          <span className="font-semibold">
            S4F12 – Basics of Customizing for Financial Accounting
          </span>{" "}
          (GL, AP, AR) –{" "}
          <a
            href="https://training.sap.com/course/s4f12-basics-of-customizing-for-financial-accounting-gl-ap-ar-in-sap-s4hana-classroom-026-pt-en"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir la fiche SAP Training
          </a>
          .
        </li>

        <li>
          Parcours{" "}
          <span className="font-semibold">
            Training for SAP S/4HANA in Financial Accounting
          </span>{" "}
          (chemin de formation FI sur S/4HANA) –{" "}
          <a
            href="https://training.sap.com/trainingpath/Applications-Financial+Accounting-SAP+S4HANA"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir le training path
          </a>
          .
        </li>

        <li>
          Learning Journey en ligne{" "}
          <span className="font-semibold">
            Customizing Core Settings in Financial Accounting in SAP S/4HANA
          </span>{" "}
          –{" "}
          <a
            href="https://learning.sap.com/courses/customizing-core-settings-in-financial-accounting-in-sap-s4hana"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            accéder au cours
          </a>
          .
        </li>

        <li>
          Article <span className="font-semibold">SAP FICO Guide 2025</span>{" "}
          (FAQ, scope FI/CO, conseils formation) –{" "}
          <a
            href="https://skillstek.com/sap-fico/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire le guide
          </a>
          .
        </li>

        <li>
          Formation pratique{" "}
          <span className="font-semibold">
            SAP S/4HANA FICO Online Training
          </span>{" "}
          (vue d’ensemble FI/CO sur S/4HANA) –{" "}
          <a
            href="https://www.proexcellency.com/products/s4hana-fico-online-training"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir la formation
          </a>
          .
        </li>

        <li>
          Vidéo YouTube{" "}
          <span className="font-semibold">
            Finance (FI) Overview – GL, AP, AR, AA (SAP S/4HANA)
          </span>{" "}
          –{" "}
          <a
            href="https://www.youtube.com/watch?v=gUfrn0jHvHs"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            regarder la vidéo
          </a>
          .
        </li>
      </ul>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Tu pourras enrichir cette liste avec tes propres liens (docs cours,
        playlists, articles) et les marquer par niveau : débutant,
        intermédiaire, préparation certification FI.
      </p>
    </div>
  );
};

const FI = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        {/* Titre & intro */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Module FI – Financial Accounting (SAP S/4HANA Finance)
        </h1>
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
    bg-emerald-500/10 text-emerald-700 dark:text-emerald-300
    border border-emerald-500/40"
          >
            Niveau : Débutant → Intermédiaire
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Bases FI + intégration avec MM/SD/CO pour une première mission.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Le module FI couvre la comptabilité externe de l’entreprise (bilan,
          compte de résultat, obligations légales) et constitue le cœur
          financier d’un système SAP S/4HANA. Il enregistre toutes les écritures
          issues des processus métier (achats, ventes, immobilisations,
          trésorerie) et alimente le reporting de la direction financière.
        </p>

        {/* Sommaire */}
        <div className="mb-6 border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/70 dark:bg-slate-800">
          <p className="text-xs font-semibold text-sapBlue mb-2">
            Plan de la page FI
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 grid sm:grid-cols-2 gap-y-1">
            <li>1. Structure d’organisation FI</li>
            <li>2. Sous-modules : GL, AP, AR, AA</li>
            <li>3. Processus clés (P2P, O2C, clôture)</li>
            <li>4. Intégration FI avec MM/SD/CO</li>
            <li>5. Spécificités S/4HANA Finance</li>
            <li>6. Objectifs & mini‑projet FI</li>
          </ul>
        </div>

        {/* 1. Structure d'organisation */}
        <h2 className="text-xl font-semibold mb-2">
          1. Structure d’organisation FI
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Avant toute configuration, le consultant FI doit comprendre la
          structure d’organisation financière du client. Elle définit comment
          les états financiers seront produits et consolidés.
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Company Code</span> : entité légale
            pour laquelle on produit bilan et compte de résultat.
          </li>
          <li>
            <span className="font-semibold">Chart of Accounts</span> : plan de
            comptes commun ou spécifique, structure tous les comptes GL.
          </li>
          <li>
            <span className="font-semibold">Fiscal Year Variant</span> :
            définition de l’exercice comptable (périodes, calendrier).
          </li>
          <li>
            <span className="font-semibold">Posting Period Variant</span> :
            contrôle de l’ouverture/fermeture des périodes comptables.
          </li>
        </ul>

        {/* 2. Sous-modules FI */}
        <h2 className="text-xl font-semibold mb-2">
          2. Sous-modules FI : GL, AP, AR, AA
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              GL – General Ledger
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Le Grand Livre enregistre toutes les écritures financières
              (ventes, achats, paie, amortissements). En S/4HANA, il est
              directement basé sur l’Universal Journal, ce qui permet une vue
              unique FI/CO.
            </p>
          </div>
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              AP – Accounts Payable
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Gestion des fournisseurs : enregistrement des factures, gestion
              des échéances, paiements, relances. Étroitement lié au module MM
              pour les factures d’achats.
            </p>
          </div>
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              AR – Accounts Receivable
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Gestion des clients : factures de vente, encaissements, limites de
              crédit. Intégré au module SD pour le flux Order‑to‑Cash.
            </p>
          </div>
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              AA – Asset Accounting
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Suivi des immobilisations (achats, mises en service,
              amortissements, cessions). Les mouvements impactent directement
              les comptes GL d’immobilisations et d’amortissement.
            </p>
          </div>
        </div>

        {/* 3. Processus métier clés */}
        <h2 className="text-xl font-semibold mb-2">
          3. Processus métier FI clés
        </h2>

        <h3 className="text-base font-semibold mb-1">
          3.1 Procure‑to‑Pay (P2P) – Achats intégrés FI/MM
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-2">
          Exemple : une facture fournisseur de matières premières.
        </p>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>Demande d’achat et commande (MM) créées par les achats.</li>
          <li>Réception de marchandises (MM) → mise à jour du stock.</li>
          <li>
            Réception de la facture (MM/FI) : MIRO crée une écriture FI sur le
            compte fournisseur et un compte de charges ou de stock.
          </li>
          <li>
            Paiement fournisseur (FI‑AP) : génération de paiements et écriture
            sur comptes bancaires.
          </li>
        </ol>

        <h3 className="text-base font-semibold mb-1">
          3.2 Order‑to‑Cash (O2C) – Ventes intégrées FI/SD
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-2">
          Exemple : une commande client de produits finis.
        </p>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>Création de la commande client dans SD.</li>
          <li>
            Livraison et sortie de stock (PGI) → impact sur les comptes de stock
            et coût des marchandises vendues (COGS).
          </li>
          <li>
            Facturation SD → création automatique d’un document FI client (AR)
            avec TVA, revenus, comptes clients.
          </li>
          <li>Encaissement client et lettrage du poste ouvert.</li>
        </ol>

        <h3 className="text-base font-semibold mb-1">
          3.3 Clôture comptable & reporting
        </h3>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Contrôle des périodes ouvertes et blocage des nouvelles écritures.
          </li>
          <li>Provisions, écritures d’ajustement, amortissements.</li>
          <li>
            Rapprochement des comptes (clients, fournisseurs, banques) et
            génération des états financiers.
          </li>
        </ul>

        {/* 4. Intégration */}
        <h2 className="text-xl font-semibold mb-2">
          4. Intégration FI avec CO, MM et SD
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          FI n’est jamais isolé : chaque écriture est souvent liée à un objet de
          controlling (centre de coûts, ordre interne, etc.) et à un flux
          logistique.
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">FI–MM</span> : comptes stock, GR/IR,
            TVA, charges d’achats.
          </li>
          <li>
            <span className="font-semibold">FI–SD</span> : comptes clients,
            revenus, COGS, taxes.
          </li>
          <li>
            <span className="font-semibold">FI–CO</span> : imputation des
            écritures sur des objets de coûts (centres de coûts, ordres, WBS)
            pour l’analyse de rentabilité.
          </li>
        </ul>

        {/* 5. Spécificités S/4HANA */}
        <h2 className="text-xl font-semibold mb-2">
          5. Spécificités de S/4HANA Finance
        </h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Universal Journal (ACDOCA)</span> :
            une seule table pour FI et CO, simplifiant le reporting et les
            analyses temps réel.
          </li>
          <li>
            <span className="font-semibold">Fiori apps Finance</span> : tableaux
            de bord pour le CFO, les comptables et les contrôleurs.
          </li>
          <li>
            Simplification du New GL, meilleure intégration avec les analytics
            embarqués et les scenarios de clôture accélérée.
          </li>
        </ul>

        {/* 6. Objectifs & mini-projet */}
        <h2 className="text-xl font-semibold mb-2">
          6. Objectifs d’apprentissage FI pour toi
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          En tant que futur consultant SAP FI/CO junior, ton objectif n’est pas
          seulement de connaître les écrans, mais surtout de pouvoir expliquer
          la logique métier au client et de participer à un projet S/4HANA
          Finance.
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>Expliquer clairement GL, AP, AR, AA et leurs liens.</li>
          <li>
            Décrire la structure FI d’un client (Company Code, plan de comptes,
            fiscal year).
          </li>
          <li>
            Raconter un flux P2P ou O2C en montrant les impacts FI à chaque
            étape.
          </li>
          <li>
            Présenter à un manager ce que S/4HANA Finance change via l’Universal
            Journal et Fiori.
          </li>
        </ul>

        {/* T-codes, mini-projet, quiz et ressources */}
        <FiTcodes />
        <FiMiniProjectChecklist />
        <FiQuiz />
        <FiResources />
      </div>
    </section>
  );
};

export default FI;
