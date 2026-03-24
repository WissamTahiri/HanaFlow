import React, { useState } from "react";

const SdQuiz = () => {
  const questions = [
    {
      id: 1,
      question:
        "Quel est l’objectif principal du processus Order‑to‑Cash (O2C) en SAP SD ?",
      options: [
        "Gérer le cycle complet de vente, de la commande client au paiement",
        "Planifier la production",
        "Gérer les achats fournisseurs",
      ],
      answer: 0,
      explanation:
        "L’O2C couvre tout le flux client : pré‑vente, commande, livraison, facturation, encaissement.[web:160][web:161][web:165]",
    },
    {
      id: 2,
      question: "Quel document démarre généralement le cycle O2C dans SAP SD ?",
      options: ["Purchase Order", "Sales Order (VA01)", "Delivery (VL01N)"],
      answer: 1,
      explanation:
        "Le cycle O2C commence avec la création d’un Sales Order (VA01) après l’inquiry/quotation éventuelle.[web:163][web:165]",
    },
    {
      id: 3,
      question:
        "Dans l’enchaînement standard, quel est l’ordre correct des étapes O2C ?",
      options: [
        "Delivery → Billing → Sales Order → Payment",
        "Sales Order → Billing → Delivery → Payment",
        "Sales Order → Delivery → Post Goods Issue → Billing → Payment",
      ],
      answer: 2,
      explanation:
        "Le flux typique : Sales Order → Delivery → PGI → Billing → Payment.[web:163][web:165][web:96]",
    },
    {
      id: 4,
      question:
        "Quel événement déclenche la sortie de stock et le COGS en FI ?",
      options: ["Sales Order", "Post Goods Issue (PGI)", "Billing"],
      answer: 1,
      explanation:
        "Le PGI (VL02N) réduit le stock et enregistre le COGS en FI.[web:96][web:168]",
    },
    {
      id: 5,
      question:
        "Quel t-code est utilisé pour créer une facture client à partir d’une livraison ou d’un ordre ?",
      options: ["VF01", "VA01", "F-28"],
      answer: 0,
      explanation:
        "VF01 crée le billing document qui génère un document FI (client, revenus, taxes).[web:96][web:102]",
    },
    {
      id: 6,
      question:
        "Quel est le rôle de l’intégration SD–FI au moment de la facturation ?",
      options: [
        "Mettre à jour les stocks",
        "Créer un document FI pour revenus et créances clients",
        "Créer des ordres de fabrication",
      ],
      answer: 1,
      explanation:
        "La facture SD déclenche un document FI : débit client / crédit revenus et taxes.[web:96][web:168]",
    },
    {
      id: 7,
      question:
        "Vrai ou Faux : la création du Sales Order crée immédiatement une écriture FI.",
      options: ["Vrai", "Faux"],
      answer: 1,
      explanation:
        "Le Sales Order est logistique ; c’est PGI et Billing qui génèrent les écritures FI.[web:160][web:171]",
    },
    {
      id: 8,
      question:
        "Quel t-code FI est typiquement utilisé pour enregistrer le paiement client et lettrer la facture ?",
      options: ["F-28", "MIRO", "F110"],
      answer: 0,
      explanation:
        "F‑28 sert à enregistrer les paiements entrants et à compenser les postes clients.[web:96][web:163]",
    },
    {
      id: 9,
      question:
        "Dans un projet S/4HANA, quel composant gère la reconnaissance de revenus avancée pour des contrats complexes ?",
      options: ["CO‑PA", "RAR (Revenue Accounting and Reporting)", "MM‑IM"],
      answer: 1,
      explanation:
        "RAR s’intègre à SD et FI pour automatiser la revenue recognition selon IFRS 15 / ASC 606.[web:166]",
    },
    {
      id: 10,
      question: "Quel bénéfice clé apporte S/4HANA à l’O2C par rapport à ECC ?",
      options: [
        "Moins d’intégration entre SD et FI",
        "Vision temps réel sur commandes, livraisons, revenus et marges",
        "Suppression de la facturation",
      ],
      answer: 1,
      explanation:
        "S/4HANA offre un O2C intégré avec analytics temps réel sur ventes, revenus et marges.[web:160][web:162][web:96]",
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
        Quiz SD – Order‑to‑Cash (O2C) pour consultants juniors
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Teste ta compréhension du flux O2C et de l’intégration SD–FI.
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

const SdMiniProjectChecklist = () => {
  const items = [
    "Être capable d’expliquer les étapes O2C : inquiry/quotation, sales order, delivery, PGI, billing, payment.",
    "Savoir décrire l’impact FI des étapes PGI et Billing (stock, COGS, revenus, client).",
    "Connaître les t‑codes principaux : VA01, VL01N, VL02N, VF01, F-28.",
    "Documenter un scénario O2C complet pour un produit physique (B2B).",
    "Comprendre la logique de détermination de comptes SD–FI (revenus, taxes, COGS).",
    "Identifier les principaux risques O2C (erreurs de pricing, livraison, facturation).",
    "Préparer 3 cas de test O2C (remise, retour, facture pro‑forma).",
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
        Mini‑projet SD – Devenir opérationnel sur l’O2C
      </h2>
      <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
        Utilise cette checklist comme plan d’entraînement pour une mission SD
        orientée ventes et intégration Finance.
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

const SdResources = () => {
  return (
    <div className="mt-8 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/60 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">
        Ressources O2C / SAP SD & intégration FI
      </h2>
      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
        <li>
          Guide{" "}
          <span className="font-semibold">
            SAP S/4HANA – Order‑to‑Cash Process (O2C) Simple Guide
          </span>{" "}
          – explication pas à pas avec t‑codes VA01, VL01N, VF01, F‑28 –{" "}
          <a
            href="https://ageistechnova.com/the-order-to-cash-o2c-process-in-sap-s-4-hana-a-simple-guide/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire le guide
          </a>
          .[web:163]
        </li>
        <li>
          Article SAP Community{" "}
          <span className="font-semibold">SAP Order to Cash Process – SD</span>{" "}
          – vue d’ensemble O2C et explications sur delivery, PGI, billing –{" "}
          <a
            href="https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-members/sap-order-to-cash-process-sd/ba-p/13551270"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir l&apos;article
          </a>
          .[web:102]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            Optimizing Sales Performance with the SAP SD Order to Cash Process
          </span>{" "}
          – focus sur les étapes clés et la performance commerciale –{" "}
          <a
            href="https://www.sapbwconsulting.com/blog/sap-sd-order-to-cash"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:96]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            SAP SD–FI Integration and Account Determination
          </span>{" "}
          – détail des écritures PGI et Billing (stock, COGS, revenus, taxes) –{" "}
          <a
            href="https://www.saplogisticsexpert.com/sap-sd-fi-integration-and-account-determination/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            voir l&apos;intégration
          </a>
          .[web:168]
        </li>
        <li>
          Article{" "}
          <span className="font-semibold">
            SAP S/4HANA RAR integration with SD and FI modules
          </span>{" "}
          – pour la reconnaissance de revenus avancée sur contrats –{" "}
          <a
            href="https://ageistechnova.com/sap-s-4-hana-rar-integration-with-sd-and-fi-modules/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            lire l&apos;article
          </a>
          .[web:166]
        </li>
        <li>
          Vidéos / posts récents expliquant O2C S/4HANA (diagrammes, démos) –
          par ex.{" "}
          <a
            href="https://www.youtube.com/watch?v=0jiWgZpwtzM"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            SAP SD Order to Cash (O2C) Cycle – YouTube
          </a>{" "}
          ou{" "}
          <a
            href="https://www.linkedin.com/posts/murali-karthik-ba7341268_sap-s4hana-sd-order-to-cash-o2c-process-activity-7420041543778136066-kk0b"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-sapBlue/70 hover:decoration-sapBlue"
          >
            SD O2C process overview
          </a>
          .[web:170][web:164]
        </li>
      </ul>
    </div>
  );
};

const SD = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Module SD – Sales & Distribution & Order‑to‑Cash (O2C)
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
            Bases du cycle O2C, pricing et intégration SD–FI/CO.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Le module SD gère la chaîne de vente, de la demande client à
          l’encaissement. Dans S/4HANA, il pilote le processus Order‑to‑Cash
          (O2C) en étroite intégration avec MM (stocks) et FI (revenus, COGS,
          créances clients).[web:160][web:161][web:162]
        </p>

        {/* Plan */}
        <div className="mb-6 border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/70 dark:bg-slate-800">
          <p className="text-xs font-semibold text-sapBlue mb-2">
            Plan de la page SD
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 grid sm:grid-cols-2 gap-y-1">
            <li>1. Rôle de SD et structure d’organisation</li>
            <li>2. Master data clé côté ventes</li>
            <li>3. Cycle O2C pas à pas</li>
            <li>4. Intégration SD–FI (revenus, COGS, client)</li>
            <li>5. Spécificités S/4HANA et RAR</li>
            <li>6. Mini‑projet & quiz O2C</li>
          </ul>
        </div>

        {/* 1. Rôle & structure */}
        <h2 className="text-xl font-semibold mb-2">
          1. Rôle de SD et structure d’organisation
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          SD couvre les activités de pré‑vente, de vente, de livraison et de
          facturation. La structure d’organisation détermine comment les ventes
          sont segmentées par marché et comment les documents SD sont liés aux
          entités légales.[web:160][web:165]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Sales Organization</span> : unité
            principale de ventes, souvent alignée sur un pays ou une
            BU.[web:162][web:165]
          </li>
          <li>
            <span className="font-semibold">Distribution Channel</span> : canal
            (B2B, B2C, online, retail…).[web:165]
          </li>
          <li>
            <span className="font-semibold">Division</span> : ligne de
            produits.[web:162][web:165]
          </li>
          <li>
            <span className="font-semibold">Sales Area</span> : combinaison
            Sales Org + Distribution Channel + Division, base des conditions
            commerciales.[web:162]
          </li>
        </ul>

        {/* 2. Master data */}
        <h2 className="text-xl font-semibold mb-2">
          2. Master data côté ventes
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              Customer Master / Business Partner
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Données clients (coordonnées, conditions de paiement, conditions
              de vente). Synchronisé avec FI‑AR pour les comptes
              clients.[web:165][web:171]
            </p>
          </div>
          <div className="border border-sapBlue/15 rounded-2xl p-4 bg-sapGrayLight/60 dark:bg-slate-800">
            <h3 className="text-base font-semibold mb-2">
              Material Master côté SD
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Données produits vues Sales (groupe de tarifs, hiérarchie, unité
              de vente) et lien avec la valorisation stock /
              COGS.[web:96][web:171]
            </p>
          </div>
        </div>

        {/* 3. Cycle O2C */}
        <h2 className="text-xl font-semibold mb-2">
          3. Cycle Order‑to‑Cash (O2C) – étape par étape
        </h2>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            <span className="font-semibold">Inquiry / Quotation</span> :
            pré‑vente, devis au client (facultatif). T‑codes :
            VA11/VA21.[web:163][web:165]
          </li>
          <li>
            <span className="font-semibold">Sales Order – VA01</span> : création
            de la commande client avec prix, quantités, taxes, conditions de
            paiement.[web:163][web:165]
          </li>
          <li>
            <span className="font-semibold">Availability Check / ATP</span> :
            vérification du stock et promesse de date de
            livraison.[web:165][web:160]
          </li>
          <li>
            <span className="font-semibold">Delivery – VL01N</span> : création
            de la livraison, préparation logistique.[web:163][web:96]
          </li>
          <li>
            <span className="font-semibold">
              Post Goods Issue (PGI) – VL02N
            </span>{" "}
            : sortie de stock, transfert de propriété, enregistrement COGS en
            FI.[web:96][web:168]
          </li>
          <li>
            <span className="font-semibold">Billing – VF01</span> : génération
            de la facture client (revenus, taxes) et création du document FI
            AR.[web:96][web:102]
          </li>
          <li>
            <span className="font-semibold">Payment – F‑28 (FI)</span> :
            enregistrement du paiement client et clearing de la
            facture.[web:96][web:163]
          </li>
        </ol>

        {/* 4. Intégration SD–FI */}
        <h2 className="text-xl font-semibold mb-2">
          4. Intégration SD–FI dans S/4HANA
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          Le module SD est étroitement intégré à FI : les événements PGI et
          Billing déclenchent des écritures FI via la détermination de comptes
          (pricing, account keys, etc.).[web:96][web:168][web:171]
        </p>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            PGI : crédit stock / débit COGS (coût des marchandises
            vendues).[web:96][web:168]
          </li>
          <li>
            Billing : débit client / crédit revenus et taxes, avec clé
            d&apos;imputation ERL/ERF/ERS selon les conditions
            tarifaires.[web:168][web:171]
          </li>
          <li>
            Payment : débit banque / crédit client (clôture du poste
            client).[web:96][web:165]
          </li>
        </ul>

        {/* 5. Spécificités S/4HANA & RAR */}
        <h2 className="text-xl font-semibold mb-2">
          5. Spécificités S/4HANA pour SD & revenus
        </h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5">
          <li>
            Fiori apps SD pour la gestion des commandes, livraisons, factures et
            KPIs O2C.[web:162][web:160]
          </li>
          <li>
            Intégration native avec{" "}
            <span className="font-semibold">
              RAR (Revenue Accounting and Reporting)
            </span>{" "}
            pour la reconnaissance de revenus sur contrats complexes.[web:166]
          </li>
          <li>
            Vision temps réel sur pipeline de ventes, revenus, marge et
            cash‑flow via les analytics S/4HANA.[web:160][web:161][web:96]
          </li>
        </ul>

        {/* Mini-projet, quiz, ressources */}
        <SdMiniProjectChecklist />
        <SdQuiz />
        <SdResources />
      </div>
    </section>
  );
};

export default SD;
