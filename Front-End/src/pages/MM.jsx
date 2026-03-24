import React, { useState } from "react";

const MmQuiz = () => {
  const questions = [
    {
      id: 1,
      question:
        "Quel est l’objectif principal du processus Procure-to-Pay (P2P) en SAP MM ?",
      options: [
        "Planifier la production",
        "Acheter un bien/service et payer le fournisseur",
        "Gérer la paie des employés",
      ],
      answer: 1,
      explanation:
        "Le P2P couvre le cycle complet de l’achat jusqu’au paiement du fournisseur dans SAP MM/FI.[web:149][web:150]",
    },
    {
      id: 2,
      question:
        "Quel document interne déclenche généralement le P2P dans SAP MM ?",
      options: ["Sales Order", "Purchase Requisition (PR)", "Billing Document"],
      answer: 1,
      explanation:
        "Le P2P démarre souvent par une Purchase Requisition (ME51N) créée par un service interne.[web:150][web:151]",
    },
    {
      id: 3,
      question:
        "Dans l’enchaînement P2P standard, quel est l’ordre correct des étapes ?",
      options: [
        "PO → PR → GR → Invoice → Payment",
        "PR → PO → GR → Invoice → Payment",
        "PR → GR → PO → Payment → Invoice",
      ],
      answer: 1,
      explanation:
        "La séquence classique est PR → PO → GR → Invoice (MIRO) → Payment (FI).[web:150][web:151][web:156]",
    },
    {
      id: 4,
      question:
        "Quel document met à jour le stock et la valorisation d’inventaire dans MM ?",
      options: ["Purchase Order", "Goods Receipt (GR)", "Invoice Receipt (IR)"],
      answer: 1,
      explanation:
        "Le GR (MIGO) met à jour les quantités de stock, et en S/4HANA déclenche la valorisation via MATDOC/FI.[web:148][web:156]",
    },
    {
      id: 5,
      question:
        "Quel t-code est utilisé pour la vérification de facture fournisseur dans un flux P2P standard ?",
      options: ["MIRO", "FB50", "VA01"],
      answer: 0,
      explanation:
        "MIRO est utilisé pour l’Invoice Receipt (IR) et réalise le 3-way match PO–GR–Invoice.[web:150][web:151]",
    },
    {
      id: 6,
      question:
        "Quel est le rôle de la GR/IR (Goods Receipt / Invoice Receipt) dans l’intégration FI–MM ?",
      options: [
        "Enregistrer les ventes",
        "Faire le lien temporaire entre réception de marchandises et facture",
        "Gérer les coûts de production",
      ],
      answer: 1,
      explanation:
        "Le compte GR/IR sert à rapprocher GR et factures, au cœur de l’intégration FI–MM.[web:152][web:157]",
    },
    {
      id: 7,
      question:
        "Vrai ou Faux : la création de la Purchase Order (PO) génère automatiquement une écriture FI.",
      options: ["Vrai", "Faux"],
      answer: 1,
      explanation:
        "La PO est un document logistique MM, sans écriture FI tant qu’il n’y a pas de GR ou de facture.[web:148][web:158]",
    },
    {
      id: 8,
      question:
        "Quel t-code est typiquement utilisé pour la création d’une Purchase Requisition ?",
      options: ["ME51N", "ME21N", "MIGO"],
      answer: 0,
      explanation:
        "ME51N est le t-code standard pour créer une PR dans SAP MM.[web:150]",
    },
    {
      id: 9,
      question:
        "Dans S/4HANA, quel avantage clé apporte l’architecture P2P par rapport à ECC ?",
      options: [
        "Moins d’intégration avec FI",
        "Plus de tables redondantes",
        "Vue temps réel sur stocks, engagements et dettes fournisseurs",
      ],
      answer: 2,
      explanation:
        "S/4HANA fournit une visibilité temps réel sur inventaire, POs, GR/IR, dettes fournisseurs et cash-flow.[web:148][web:147]",
    },
    {
      id: 10,
      question:
        "Vrai ou Faux : le paiement final au fournisseur est géré dans FI, pas dans MM.",
      options: ["Vrai", "Faux"],
      answer: 0,
      explanation:
        "Le paiement (F110/F-53) est exécuté en FI-AP, même si MM a déclenché la facture.[web:148][web:151]",
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
        Quiz MM – Procure‑to‑Pay (P2P) pour consultants juniors
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Vérifie ta compréhension du cycle P2P et de l’intégration FI–MM.
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

const MmMiniProjectChecklist = () => {
  const items = [
    "Expliquer les 5 étapes clés du P2P dans tes mots (PR, PO, GR, Invoice, Payment).",
    "Être capable de décrire l’impact de chaque étape sur les stocks et la compta FI.",
    "Connaître les t‑codes principaux : ME51N, ME21N, MIGO, MIRO, FBL1N.",
    "Documenter un scénario P2P complet pour un achat de matière première.",
    "Comprendre le rôle du compte GR/IR et savoir l’expliquer au contrôleur.",
    "Identifier les principaux risques P2P (prix erronés, doublons factures, retards GR).",
    "Préparer 3 cas de test P2P (PO standard, service, facture sans PO).",
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
        Mini‑projet MM – Devenir opérationnel sur le P2P
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
        Utilise cette checklist comme fil rouge pour préparer une mission MM
        orientée P2P dans un projet S/4HANA.
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

const MmResources = () => {
  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/60 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Ressources P2P / SAP MM & intégration FI
      </h2>
      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <li>
          Article SAP officiel{" "}
          <span className="font-semibold">What is procure‑to‑pay (P2P)</span> –
          vue d’ensemble métier du P2P côté achats & finance –{" "}
          <a
            href="https://www.sap.com/products/spend-management/procure-to-pay/what-is-procure-to-pay.html"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:149]
        </li>
        <li>
          Guide détaillé{" "}
          <span className="font-semibold">
            Purchase Process in SAP S/4HANA [SAP MM] P2P Cycle
          </span>{" "}
          (PR → PO → GR → facture → paiement) –{" "}
          <a
            href="https://www.gauravconsulting.com/post/sapmmp2pcycle"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir le guide
          </a>
          .[web:148]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            FI–MM Integration with P2P Cycle in SAP S/4HANA
          </span>{" "}
          (comptes stock, GR/IR, configuration intégration FI) –{" "}
          <a
            href="https://sap96.com/fi-mm-integration-with-p2p-cycle-in-sap-s4-hana/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:152]
        </li>
        <li>
          Walkthrough visuel{" "}
          <span className="font-semibold">
            Procure‑to‑Pay Process in SAP MM – Best Visual Walkthrough 2025
          </span>{" "}
          –{" "}
          <a
            href="https://gtracademy.org/procure-to-pay-process-in-sap-mm/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir le walkthrough
          </a>
          .[web:101]
        </li>
        <li>
          Vidéos / posts LinkedIn récents expliquant le P2P en plusieurs étapes,
          avec t‑codes et écritures FI – par exemple :{" "}
          <a
            href="https://www.linkedin.com/posts/pratikgsadedar_procure-to-pay-p2p-cycle-in-sap-s4hana-activity-7419227644216475648-Hmlb"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            P2P cycle in SAP S/4HANA MM
          </a>{" "}
          ou{" "}
          <a
            href="https://www.linkedin.com/posts/prabhakaran-b-559157ba_what-is-p2p-procure-to-pay-in-sap-activity-7404848681041977349-zL5u"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            P2P in 5 steps
          </a>
          .[web:150][web:151]
        </li>
      </ul>
    </div>
  );
};

const MM = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Module MM – Materials Management & Procure‑to‑Pay (P2P)
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
            Comprendre le cycle P2P et l’intégration MM–FI sur S/4HANA.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Le module MM gère les achats, la gestion des stocks et la relation
          fournisseurs. Dans S/4HANA, il est au cœur du processus Procure‑to‑Pay
          (P2P), étroitement intégré avec FI (comptabilité fournisseurs, GR/IR,
          valorisation des stocks).[web:148][web:149][web:158]
        </p>

        {/* Plan de la page */}
        <div className="mb-6 border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/70 dark:bg-slate-800">
          <p className="text-xs font-semibold text-sapBlue mb-2">
            Plan de la page MM
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 grid sm:grid-cols-2 gap-y-1">
            <li>1. Rôle de MM et structure d’organisation</li>
            <li>2. Master data clé (matériaux, fournisseurs)</li>
            <li>3. Cycle P2P étape par étape</li>
            <li>4. Intégration MM–FI (GR/IR, valorisation)</li>
            <li>5. Spécificités S/4HANA pour P2P</li>
            <li>6. Mini‑projet & quiz P2P</li>
          </ul>
        </div>

        {/* 1. Rôle & structure */}
        <h2 className="text-xl font-semibold mb-2">
          1. Rôle de MM et structure d’organisation
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          MM couvre les processus d&apos;approvisionnement, de réception, de
          stockage et de consommation des matériaux. La structure d&apos;orga
          détermine comment les achats sont pilotés et comment les stocks sont
          valorisés.[web:148][web:149]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Plant</span> : unité
            organisationnelle où les stocks sont gérés (usine, entrepôt,
            site).[web:147]
          </li>
          <li>
            <span className="font-semibold">Storage Location</span> :
            emplacement de stockage détaillé à l&apos;intérieur d&apos;un
            plant.[web:147]
          </li>
          <li>
            <span className="font-semibold">Purchasing Organization</span> :
            entité qui négocie les conditions d&apos;achat.[web:149][web:150]
          </li>
          <li>
            <span className="font-semibold">Purchasing Group</span> : équipe /
            acheteur responsable d&apos;un portefeuille d&apos;achats.[web:149]
          </li>
        </ul>

        {/* 2. Master data */}
        <h2 className="text-xl font-semibold mb-2">2. Master data clé en MM</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              Material Master (MM01/MM03)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Décrit chaque article (type, unité, groupe de marchandises, vues
              achats, stocks, compta). C&apos;est la base de la planification et
              de la valorisation des stocks.[web:101][web:156]
            </p>
          </div>
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              Vendor Master / BP (Business Partner)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Gère les données fournisseurs (coordonnées, conditions de
              paiement, infos d&apos;achat) côté MM et FI‑AP.[web:148][web:152]
            </p>
          </div>
        </div>

        {/* 3. Cycle P2P */}
        <h2 className="text-xl font-semibold mb-2">
          3. Cycle Procure‑to‑Pay (P2P) – étape par étape
        </h2>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">
              Purchase Requisition (PR) – ME51N
            </span>{" "}
            : demande interne pour un matériel ou service (quantité, date,
            centre de coûts…).[web:150][web:156]
          </li>
          <li>
            <span className="font-semibold">Purchase Order (PO) – ME21N</span> :
            document externe envoyé au fournisseur, avec prix, quantité,
            conditions.[web:150][web:156]
          </li>
          <li>
            <span className="font-semibold">Goods Receipt (GR) – MIGO</span> :
            réception, mise à jour des stocks, déclenchement d&apos;écritures FI
            sur stock et GR/IR.[web:148][web:151][web:156]
          </li>
          <li>
            <span className="font-semibold">Invoice Receipt (IR) – MIRO</span> :
            vérification facture, 3‑way match PO–GR–Invoice, création écriture
            FI (fournisseur, GR/IR).[web:150][web:151]
          </li>
          <li>
            <span className="font-semibold">Payment – F110 / F‑53 (FI)</span> :
            traitement du paiement fournisseur et clearing des postes ouverts,
            clôture du cycle P2P.[web:150][web:151][web:158]
          </li>
        </ol>

        {/* 4. Intégration MM–FI */}
        <h2 className="text-xl font-semibold mb-2">
          4. Intégration MM–FI dans S/4HANA
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Chaque mouvement logistique (GR, IR) déclenche des écritures FI
          automatiques. L&apos;intégration FI–MM est basée sur la détermination
          de comptes (OBYC / équivalents S/4HANA Cloud) et sur le compte
          GR/IR.[web:152][web:157][web:154]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            GR : débit stock / crédit GR/IR (inventaire augmente, GR/IR en
            attente de facture).[web:151][web:156]
          </li>
          <li>
            Invoice (MIRO) : débit GR/IR / crédit fournisseur (création dette
            fournisseur, nettoyage GR/IR).[web:151][web:152]
          </li>
          <li>
            Paiement : débit fournisseur / crédit banque (sortie de trésorerie,
            clearing poste ouvert).[web:151][web:158]
          </li>
        </ul>

        {/* 5. Spécificités S/4HANA */}
        <h2 className="text-xl font-semibold mb-2">
          5. Spécificités S/4HANA pour MM / P2P
        </h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Table unique MATDOC pour les mouvements de stock, simplifiant le
            reporting.[web:148][web:147]
          </li>
          <li>
            Fiori apps pour les acheteurs (gestion des PR, POs, confirmations,
            workflows d&apos;approbation).[web:147][web:149]
          </li>
          <li>
            Intégration temps réel avec FI pour la visibilité sur les
            engagements, GR/IR et dettes
            fournisseurs.[web:148][web:152][web:154]
          </li>
        </ul>

        {/* Mini-projet, quiz, ressources */}
        <MmMiniProjectChecklist />
        <MmQuiz />
        <MmResources />
      </div>
    </section>
  );
};

export default MM;
