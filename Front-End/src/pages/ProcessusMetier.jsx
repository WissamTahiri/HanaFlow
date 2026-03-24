import React from "react";

const MermaidBlock = ({ title, code }) => {
  return (
    <div className="mt-6 border border-sapBlue/20 rounded-2xl p-4 sm:p-5 bg-sapGrayLight/60 dark:bg-slate-800">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
        Schéma Mermaid simplifié du flux. Tu pourras l&apos;intégrer avec un
        renderer Mermaid plus tard.
      </p>
      <pre className="text-[11px] sm:text-xs bg-slate-900 text-slate-100 rounded-xl p-3 overflow-x-auto">
        {code}
      </pre>
    </div>
  );
};

const ProcessusMetier = () => {
  const p2pMermaid = String.raw`flowchart LR
  A[Besoin d'achat] --> B[PR - Purchase Requisition]
  B --> C[PO - Purchase Order (ME21N)]
  C --> D[Réception marchandises<br/>GR - MIGO]
  D --> E[Facture fournisseur<br/>IR - MIRO]
  E --> F[Paiement fournisseur<br/>F110 / F-53]
`;

  const o2cMermaid = String.raw`flowchart LR
  A[Demande client / Quotation] --> B[Sales Order<br/>VA01]
  B --> C[Livraison<br/>VL01N]
  C --> D[Post Goods Issue<br/>PGI]
  D --> E[Facturation<br/>VF01]
  E --> F[Paiement client<br/>F-28]
`;

  const r2rMermaid = String.raw`flowchart LR
  A[Transactions quotidiennes<br/>P2P, O2C, Paie, etc.] --> B[Ecritures FI / CO]
  B --> C[Rapprochements & ajustements]
  C --> D[Clôture période<br/>month-end / year-end]
  D --> E[Etat financier<br/>Bilan & P&L]
`;

  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Processus métier – P2P, O2C, R2R
        </h1>
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
    bg-emerald-500/10 text-emerald-700 dark:text-emerald-300
    border border-emerald-500/40"
          >
            Niveau : Débutant
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Point d’entrée pour comprendre P2P, O2C et R2R avant les modules.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Les processus end‑to‑end P2P (Procure‑to‑Pay), O2C (Order‑to‑Cash) et
          R2R (Record‑to‑Report) structurent la plupart des flux d&apos;une
          entreprise : achats, ventes et reporting
          financier.[web:214][web:215][web:221][web:222]
        </p>

        {/* P2P */}
        <h2 className="text-xl font-semibold mb-2">
          1. P2P – Procure‑to‑Pay (Achats)
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          P2P couvre toutes les étapes de l&apos;expression de besoin
          jusqu&apos;au paiement du fournisseur. Il contrôle comment
          l&apos;argent sort de l&apos;entreprise et implique surtout MM et
          FI.[web:149][web:219][web:215]
        </p>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>Besoin d&apos;achat identifié, demande interne.[web:219]</li>
          <li>Purchase Requisition (PR) et approvals.[web:215][web:219]</li>
          <li>Purchase Order (PO) envoyée au fournisseur.[web:215][web:219]</li>
          <li>
            Réception des biens/services (GR), contrôle
            qualité.[web:149][web:219]
          </li>
          <li>
            Facture fournisseur, rapprochement PO/GR/facture.[web:149][web:215]
          </li>
          <li>
            Paiement fournisseur et reporting des dépenses.[web:149][web:214]
          </li>
        </ol>

        <MermaidBlock title="Schéma P2P" code={p2pMermaid} />

        {/* O2C */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          2. O2C – Order‑to‑Cash (Ventes)
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          O2C décrit le flux depuis la commande client jusqu&apos;à
          l&apos;encaissement. Il contrôle comment le chiffre d&apos;affaires
          entre dans l&apos;entreprise, via SD et FI.[web:218][web:221][web:214]
        </p>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>
            Demande client, devis éventuel, création de Sales
            Order.[web:218][web:219]
          </li>
          <li>Vérification de crédit et disponibilité stock.[web:218]</li>
          <li>
            Préparation et expédition (livraison / exécution
            service).[web:218][web:219]
          </li>
          <li>
            Facturation (invoice) et comptabilisation des
            revenus.[web:215][web:221]
          </li>
          <li>
            Encaissement client, lettrage des postes ouverts.[web:221][web:214]
          </li>
        </ol>

        <MermaidBlock title="Schéma O2C" code={o2cMermaid} />

        {/* R2R */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          3. R2R – Record‑to‑Report (Finance)
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
          R2R regroupe tous les enregistrements comptables (P2P, O2C, paie…),
          leur consolidation et la production des états financiers. Il explique
          comment les chiffres sont produits.[web:221][web:214][web:222]
        </p>
        <ol className="list-decimal list-inside text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          <li>
            Enregistrement des transactions quotidiennes
            (FI/CO).[web:221][web:214]
          </li>
          <li>Rapprochements, provisions, amortissements.[web:221][web:222]</li>
          <li>
            Clôture de période, contrôles et ajustements.[web:221][web:214]
          </li>
          <li>
            Production des états : P&amp;L, bilan, annexes.[web:221][web:222]
          </li>
          <li>
            Reporting de gestion et analyses (CO‑PA,
            controlling).[web:221][web:224]
          </li>
        </ol>

        <MermaidBlock title="Schéma R2R" code={r2rMermaid} />

        {/* Lien avec tes modules */}
        <h2 className="text-xl font-semibold mb-2 mt-8">
          4. Lien avec tes modules HanaFlow
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Chaque processus end‑to‑end traverse plusieurs modules : P2P mobilise
          MM + FI + CO, O2C mobilise SD + FI + CO, et R2R consolide tous les
          flux dans FI/CO pour le reporting. L&apos;idée de HanaFlow est de
          t&apos;aider à raconter ces histoires de bout en bout devant un
          client, en t&apos;appuyant sur les pages FI, MM, SD, CO et
          IA/Joule.[web:214][web:221][web:227]
        </p>
      </div>
    </section>
  );
};

export default ProcessusMetier;
