"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import FlowDiagram from "@/components/diagrams/FlowDiagram";
import ModuleLayout from "@/components/ModuleLayout";
import { certCode } from "@/lib/certCodes";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Introduction — le rôle du Controlling
───────────────────────────────────────────────────────────── */
const CoIntro = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Le rôle du Controlling dans l'entreprise</h2>
    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
      <p>
        FI répond à une obligation légale : produire un bilan et un compte de résultat opposables aux tiers (actionnaires,
        administration fiscale, banques). CO répond à une question managériale, sans contrainte réglementaire externe :
        où les coûts sont-ils réellement engagés, par qui, pour quoi faire, et quelle rentabilité génère chaque segment
        d'activité une fois ces coûts imputés ? Un même euro de charge — un salaire, une facture de sous-traitance, une
        dotation aux amortissements — est d'abord comptabilisé en FI sur un compte de charge, puis immédiatement imputé
        en CO sur un objet de coût : un centre de coûts, un ordre interne, un ordre de fabrication ou un segment de
        marché. FI dit "combien l'entreprise a dépensé" ; CO dit "pourquoi, et si c'était justifié".
      </p>
      <p>
        Avant S/4HANA, cette distinction se payait en complexité technique. FI écrivait dans les tables BKPF/BSEG, CO
        dans ses propres tables de totaux et de postes (COSP, COSS, COEP), et un programme de réconciliation périodique
        (le report de clôture RKALC, par exemple) devait vérifier que les deux univers restaient alignés — un chantier
        récurrent de fin de mois, source classique d'écarts inexpliqués entre comptabilité et contrôle de gestion.
        L'Universal Journal change la donne : en S/4HANA, FI et CO partagent la même table de lignes d'écriture
        (ACDOCA), ce qui supprime structurellement ce risque de divergence plutôt que de le corriger après coup.
      </p>
      <p>
        Sur le terrain, CO est le module du contrôleur de gestion et, côté conseil, le pendant naturel de FI : un
        consultant junior en finance démarre très souvent sur un périmètre FI/CO combiné, avant de se spécialiser sur
        l'un des deux. CO est aussi le module qui exige le plus de compréhension métier avant tout paramétrage — un
        Customizing techniquement correct mais mal aligné sur l'organisation réelle des responsabilités produit des
        rapports de gestion que personne n'utilise.
      </p>
    </div>
  </motion.section>
);

const KEY_CONCEPTS = [
  { code: "CCA", label: "Cost Center Accounting", description: "Suit les coûts par unité de responsabilité (atelier, service IT, direction commerciale…). Compare chaque mois coûts planifiés et coûts réels, poste par poste.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" },
  { code: "PCA", label: "Profit Center Accounting", description: "Produit un P&L interne par business unit, ligne de produits ou région — intégré nativement à ACDOCA depuis S/4HANA, sans module séparé.", color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400" },
  { code: "IO",  label: "Internal Orders", description: "Objets temporaires pour suivre les coûts d'un projet, d'une campagne ou d'un événement, avec budget et contrôle de disponibilité, avant règlement vers d'autres objets CO.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "CO-PC", label: "Product Cost Controlling", description: "Calcule le coût standard des produits fabriqués à partir de la nomenclature et de la gamme, suit le WIP (Work in Process) et analyse les écarts à la clôture des ordres de production.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "CO-PA", label: "Profitability Analysis", description: "Analyse la rentabilité par dimensions métier (client, produit, canal, région). Le cœur du reporting de marge, aujourd'hui recommandé en version account-based (Margin Analysis).", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400" },
  { code: "ACDOCA", label: "Universal Journal", description: "En S/4HANA, FI et CO partagent la même table de lignes d'écriture. Fini la réconciliation périodique — le reporting de coûts et de rentabilité est disponible en temps réel.", color: "bg-sap-blue/5 dark:bg-sap-blue/10 border-sap-blue/20 dark:border-sap-blue/30 text-sap-blue dark:text-sap-accent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.02 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 piliers du Controlling SAP à connaître pour une mission CO.</p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {KEY_CONCEPTS.map((c) => (
        <div key={c.code} className="rounded-xl border border-gray-100 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
          <div className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold mb-2 ${c.color}`}>{c.code}</div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{c.label}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.description}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

const CoObjects = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.04 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Structure d'organisation CO</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Avant tout paramétrage, le consultant CO cartographie qui dépense quoi, pour quel objectif. Ce sont les objets
      sur lesquels toute la suite du module s'appuie.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Controlling Area", def: "Périmètre CO regroupant un ou plusieurs Company Codes FI qui partagent le même plan de comptes de coûts. Définit la structure de reporting interne du groupe." },
        { term: "Cost Center", def: "Unité de responsabilité où les coûts sont collectés : atelier de production, service IT, département commercial. Rattachée à un responsable identifié." },
        { term: "Profit Center", def: "Unité génératrice de profit par business unit, ligne de produits ou région. Aligne le reporting interne sur la structure managériale réelle de l'entreprise." },
        { term: "Internal Order", def: "Objet temporaire pour suivre des coûts spécifiques — campagne, projet, événement — avant de les clôturer et de les régler vers un objet définitif." },
        { term: "Cost Element", def: "Compte de coûts, lui-même toujours rattaché à un compte GL. Primaire pour une charge externe (loyer, salaire) ; secondaire pour un flux interne (allocation, activité)." },
        { term: "Operating Concern", def: "Structure la plus large de CO-PA : définit les dimensions d'analyse (client, produit, canal…) et les champs de valeur partagés par toutes les sociétés qui l'utilisent." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{term}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{def}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Les 5 sous-modules réels de CO
───────────────────────────────────────────────────────────── */
const SUBMODULES = [
  {
    code: "CCA",
    title: "Cost Center Accounting",
    color: "bg-emerald-600",
    desc: "Le plus ancien et le plus transversal des sous-modules. Chaque charge indirecte — salaires, loyers, énergie, amortissements — est imputée à un centre de coûts dès sa comptabilisation en FI. Le responsable du centre compare ensuite, chaque mois, le réalisé au plan grâce aux rapports standard et peut répartir les coûts non directement affectables (maintenance générale, services supports) vers les centres consommateurs via des cycles d'allocation. C'est le socle sur lequel reposent presque tous les autres sous-modules CO.",
  },
  {
    code: "PCA",
    title: "Profit Center Accounting",
    color: "bg-teal-600",
    desc: "Historiquement un module distinct (EC-PCA) dans ECC, avec ses propres tables de totaux (GLPCT). En S/4HANA, le profit center est devenu une dimension native de l'Universal Journal : chaque ligne d'ACDOCA porte directement un profit center, ce qui permet de produire un compte de résultat par business unit ou par région sans traitement de clôture dédié. L'objectif reste le même — donner à chaque patron de BU sa propre vision P&L — mais l'exécution technique est radicalement simplifiée.",
  },
  {
    code: "IO",
    title: "Internal Orders (Overhead Cost Orders)",
    color: "bg-blue-600",
    desc: "Objet de coût temporaire, plus souple qu'un centre de coûts car créé et clos à la demande : campagne marketing, événement, petit projet interne, réparation exceptionnelle. Un ordre interne peut être statistique (simple mémo parallèle à une imputation réelle ailleurs, sans impact sur le flux de valeurs) ou réel (porteur de coûts, budgétisable, et soldé en fin de vie vers un centre de coûts, une immobilisation en cours ou un autre objet CO).",
  },
  {
    code: "CO-PC",
    title: "Product Cost Controlling",
    color: "bg-purple-600",
    desc: "Calcule combien coûte réellement la fabrication d'un produit, en s'appuyant sur la nomenclature (BOM) et la gamme (routing) issues de PP. Produit un coût standard utilisé pour valoriser les stocks toute l'année, puis compare ce standard aux coûts réels des ordres de fabrication à la clôture pour isoler des écarts de prix matière, de quantité et de rendement. Indispensable dans toute entreprise qui transforme de la matière plutôt que de la revendre en l'état.",
  },
  {
    code: "CO-PA",
    title: "Profitability Analysis",
    color: "bg-amber-600",
    desc: "Le point d'arrivée du reporting de rentabilité : chaque revenu et chaque coût qui touche un segment de marché (client, produit, canal, zone géographique) y converge pour produire une marge contributionnelle par segment. Deux approches coexistent — account-based (dite Margin Analysis, alignée sur l'Universal Journal) et costing-based (par champs de valeur, plus flexible mais déconnectée de la comptabilité) — avec une préconisation claire de SAP pour la première en S/4HANA.",
  },
];

const CoSubmodules = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Les 5 sous-modules réels de CO</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      CO n'est pas un module monolithique : c'est une famille de cinq composants, chacun avec son propre objet de
      coût, son propre cycle de vie et ses propres rapports. Comprendre leur articulation est le vrai prérequis avant
      d'ouvrir SAP GUI ou Fiori.
    </p>
    <div className="space-y-4">
      {SUBMODULES.map((m) => (
        <div key={m.code} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <span className={`flex-shrink-0 px-2 py-0.5 h-fit rounded text-xs font-bold text-white ${m.color}`}>{m.code}</span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{m.title}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{m.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

const CostProfitCenters = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cost Center Accounting & Profit Center Accounting en pratique</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Deux granularités du même besoin : CCA raisonne par unité de responsabilité, PCA par unité de profit.
    </p>
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white">CCA</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Cost Centers</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Chaque charge (salaires, loyers, fournitures, énergie) est affectée à un centre de coûts dès sa saisie en
          FI. Exemple : le centre 4100 "Atelier Usinage" collecte en janvier 118 400 € de charges — 72 000 € de
          salaires, 21 000 € d'amortissements machines, 15 400 € de fournitures, 10 000 € d'énergie — contre un plan
          de 112 000 €, soit un écart défavorable de 6 400 € (+5,7 %) détaillé poste par poste via KSB1.
        </p>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {["Collecte des coûts par unité fonctionnelle (KS01 à la création).", "Planification par nature de coût via KP06 (coûts) et KP26 (prix d'activité).", "Allocation des coûts non directement affectables via cycles de distribution (KSV1) ou d'assessment (KSU1).", "Comparaison plan / réel mensuelle, base du reporting de performance par département."].map((i) => (
            <li key={i} className="flex gap-2"><CheckIcon />{i}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-600 text-white">PCA</span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Profit Centers</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Les profit centers produisent un P&L interne par ligne de produits, région ou business unit. Exemple :
          avec trois profit centers (Électronique, Mécanique, Services), "Ligne Électronique" affiche directement
          depuis ACDOCA 2,4 M€ de chiffre d'affaires et 1,65 M€ de coût des ventes ; après 310 K€ de frais
          commerciaux directs, la contribution s'établit à 440 K€, soit 18,3 % du CA, avant les frais de structure
          non affectés.
        </p>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {["Vision revenus ET coûts par segment, y compris le stock à la valeur du profit center.", "Reporting managérial directement aligné sur l'organigramme opérationnel.", "Base du calcul de contribution par BU, sans retraitement de clôture dédié en S/4HANA.", "Complément au reporting légal FI — jamais un substitut."].map((i) => (
            <li key={i} className="flex gap-2"><CheckIcon />{i}</li>
          ))}
        </ul>
      </div>
    </div>
    <div className="mt-5 grid sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10 p-4">
        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-1">Distribution (KSV1 / KSV5)</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Transfère les coûts primaires tels quels : le compte de coûts d'origine reste visible chez le receveur.
          Utile quand la traçabilité du poste source compte plus que la simplicité du reporting.
        </p>
      </div>
      <div className="rounded-xl border border-teal-200 dark:border-teal-800/40 bg-teal-50 dark:bg-teal-900/10 p-4">
        <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mb-1">Assessment (KSU1 / KSU5)</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Regroupe plusieurs coûts primaires sous un cost élément secondaire dédié côté receveur (ex. 9500 "Frais de
          maintenance imputés"). Exemple : les 18 000 € du centre "Maintenance Générale" sont répartis au prorata des
          heures d'intervention — 60 % Atelier Usinage, 25 % Atelier Peinture, 15 % Conditionnement.
        </p>
      </div>
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Internal Orders
───────────────────────────────────────────────────────────── */
const InternalOrders = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Internal Orders — suivre un coût temporaire</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Un ordre interne (KO01) sert à isoler des coûts qui n'ont pas vocation à vivre durablement sur un centre de
      coûts : une campagne, un salon professionnel, une réparation exceptionnelle, un petit projet interne non géré
      en PS.
    </p>
    <div className="grid sm:grid-cols-2 gap-4 mb-5">
      <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4">
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Ordre statistique</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Simple mémo parallèle à une imputation réelle effectuée ailleurs (sur un centre de coûts par exemple). Ne
          porte pas de budget contraignant et n'est jamais soldé — il sert uniquement à analyser une dépense sous un
          angle transversal (par projet, par événement) sans dupliquer le flux de valeurs.
        </p>
      </div>
      <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4">
        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Ordre réel</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Porte réellement les coûts : budgétisable (KO22), contrôlable en disponibilité (activation via KO30, avec
          des seuils d'alerte configurables, par exemple un avertissement automatique à 95 % du budget consommé), et
          soldé en fin de vie vers sa destination finale.
        </p>
      </div>
    </div>
    <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/10 p-4">
      <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">Exemple de cycle de vie complet</p>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        L'ordre interne 500234 "Salon Industrie Paris" est créé avec un budget KO22 de 25 000 €. Les dépenses réelles
        — location de stand, supports de communication, déplacements — sont imputées au fil de l'eau et consultables
        via KOB1 ; elles atteignent 23 410 € à la clôture de l'événement. KO88 règle ensuite la totalité du solde vers
        le centre de coûts Marketing ; si une partie des dépenses concerne le lancement d'un produit spécifique, elle
        peut être réglée séparément vers l'ordre de développement correspondant plutôt que vers un centre de coûts.
      </p>
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Product Cost Controlling (CO-PC)
───────────────────────────────────────────────────────────── */
const ProductCostControlling = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Product Cost Controlling — valoriser ce qu'on fabrique</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      CO-PC répond à une question très concrète : combien coûte réellement une unité produite, et où se perd la
      marge quand le réel diverge du standard ?
    </p>
    <div className="mb-5">
      <FlowDiagram
        title="Cycle de costing produit"
        steps={[
          { label: "Coût estimatif standard", sublabel: "CK11N" },
          { label: "Libération du prix", sublabel: "CK24" },
          { label: "Ordre de fabrication", sublabel: "CO01 · PP" },
          { label: "Confirmation production", sublabel: "CO11N · PP" },
          { label: "Calcul des écarts", sublabel: "KKS1" },
          { label: "Règlement", sublabel: "CO88" },
        ]}
      />
    </div>
    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
      <p>
        Tout démarre par l'estimation de coût standard (CK11N) : à partir de la nomenclature (BOM) et de la gamme
        (routing) du produit, le système calcule un coût théorique décomposé en composants — matière, main-d'œuvre,
        frais généraux de production. Ce coût est ensuite figé et diffusé sur le matériau (CK24), et c'est lui qui
        valorise le stock toute la période suivante, indépendamment des fluctuations réelles de prix ou de
        rendement.
      </p>
      <p>
        Pendant la production, chaque ordre de fabrication (CO01, côté PP) consomme des composants et des heures
        machine/main-d'œuvre, confirmées via CO11N. En fin de période, pour les ordres non encore clos, le WIP (Work
        in Process) est calculé — individuellement (KKAX) ou collectivement par usine (KKAO) — afin de ne pas
        considérer comme perdue la valeur d'un produit encore en cours de fabrication.
      </p>
      <p>
        À la clôture de l'ordre, KKS1 (traitement collectif) ou KKS2 (traitement individuel) compare le coût réel
        constaté au coût cible et répartit l'écart par catégorie : écart de prix, de quantité, de rendement ou de
        reste. Exemple : la vanne DN50 a un coût standard de 42,50 € (24,80 € de matière, 11,20 € de main-d'œuvre,
        6,50 € de frais généraux) ; le coût réel ressort à 46,80 €, soit un écart de 4,30 € par unité — 3,10 € dus à
        la hausse du cours de l'acier (écart de prix matière) et 1,20 € dus à un taux de rebut supérieur à la
        nomenclature (écart de rendement). CO88 règle ensuite ces écarts vers la comptabilité financière et, selon la
        configuration, vers CO-PA pour refléter l'impact réel sur la marge du produit.
      </p>
    </div>
  </motion.section>
);

const CoPaSection = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">CO-PA — Profitability Analysis</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      CO-PA analyse la rentabilité par dimensions métier : client, produit, région, canal de distribution — l'endroit
      où tous les flux CO convergent pour répondre à "est-ce qu'on gagne de l'argent sur ce segment ?".
    </p>
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 p-4 mb-5">
      <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-1">Exemple de cascade de marge (rapport KE30)</p>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        Segment "Client Grande Distribution — Gamme Premium" : chiffre d'affaires brut 850 000 €, remises et
        ristournes -45 000 €, soit un CA net de 805 000 €. Le COGS absorbe 510 000 € (340 000 € de matière, 170 000 €
        de conversion), les frais de transport et logistique 38 000 € supplémentaires — pour une marge
        contributionnelle de 257 000 €, soit 31,9 % du CA net. C'est cette granularité, impossible à obtenir
        directement depuis le grand livre FI, que CO-PA rend disponible segment par segment.
      </p>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Account-based CO-PA (Margin Analysis)", desc: "Recommandé en S/4HANA : les revenus et coûts sont stockés avec les mêmes comptes (cost/revenue elements) que le grand livre, directement dans ACDOCA. Réconciliation permanente avec FI, sans conversion de champs de valeur. Consultation via KE24 (postes réels) ou les rapports Fiori de Margin Analysis.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400" },
        { title: "Costing-based CO-PA", desc: "Utilise des champs de valeur propres (ex. matière, remise, fret) définis dans l'Operating Concern (KEA0), plus flexibles pour des schémas de marge sur mesure, mais nécessitant une conversion/réconciliation périodique avec FI — SAP n'investit plus sur cette variante en S/4HANA.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400" },
      ].map(({ title, desc, color }) => (
        <div key={title} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-sm font-bold mb-1">{title}</p>
          <p className="text-xs leading-relaxed opacity-90">{desc}</p>
        </div>
      ))}
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
      Autre évolution notable : l'Universal Allocation (apparue à partir de S/4HANA 1809, enrichie à chaque release)
      permet désormais de répartir des coûts directement vers des segments de Margin Analysis — comme des frais
      commerciaux par canal — depuis une app unique, là où ECC exigeait des transactions séparées pour chaque type
      d'allocation (cost centers, profit centers, top-down CO-PA).
    </p>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Intégration CO avec FI, MM, PP, SD
───────────────────────────────────────────────────────────── */
const Integration = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration CO avec FI, MM, PP et SD</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      CO n'existe jamais isolé : il reçoit des flux de valeur de chaque module logistique et renvoie des analyses de
      rentabilité au reporting financier.
    </p>
    <div className="mb-5">
      <FlowDiagram
        title="Flux d'une charge primaire vers la marge"
        steps={[
          { label: "Facture fournisseur", sublabel: "MIRO · FI/MM", color: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" },
          { label: "Cost Center", sublabel: "CCA", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" },
          { label: "Cycle d'assessment", sublabel: "KSU5", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" },
          { label: "Ordre de fabrication", sublabel: "CO-PC", color: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300" },
          { label: "Segment de marge", sublabel: "CO-PA", color: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" },
        ]}
      />
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { pair: "CO – FI", desc: "Chaque écriture FI porteuse d'une charge (salaire, achat, amortissement) exige un objet CO de destination — c'est la \"dérivation de compte\" (account assignment). Sans objet CO valide, l'écriture FI est rejetée.", color: "bg-sap-blue/5 dark:bg-sap-blue/10 text-sap-blue dark:text-sap-accent border-sap-blue/20" },
        { pair: "CO – MM", desc: "Une commande d'achat ou une sortie de stock pour consommation (mouvement 201/261) impute directement un centre de coûts ou un ordre de fabrication, qui remonte ensuite dans CCA ou CO-PC.", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
        { pair: "CO – PP", desc: "L'ordre de fabrication est à la fois un objet PP (planification, confirmation) et un objet de coût CO-PC (collecte des coûts réels, calcul de WIP et d'écarts à la clôture).", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40" },
        { pair: "CO – SD", desc: "La facturation SD transfère automatiquement revenus, remises et COGS vers CO-PA par segment client/produit — c'est le point d'entrée de la plupart des flux de Margin Analysis.", color: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800/40" },
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
   Clôture mensuelle CO
───────────────────────────────────────────────────────────── */
const ClotureMensuelle = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Clôture mensuelle côté Controlling</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      La séquence ci-dessous est l'ordre logique le plus courant — chaque étape dépend du résultat de la précédente.
    </p>
    <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
      {[
        { title: "Reposting / corrections", desc: "Reclassement de charges mal imputées via KB11N (répartition manuelle) avant de lancer les cycles automatiques, pour ne pas propager une erreur de saisie." },
        { title: "Cycles de distribution et d'assessment", desc: "Exécution des cycles définis en KSV1/KSU1 (KSV5/KSU5) pour répartir les coûts des centres de support vers les centres consommateurs et les ordres." },
        { title: "Calcul du WIP", desc: "KKAX (ordre par ordre) ou KKAO (par usine) pour valoriser la production en cours sur les ordres de fabrication non encore clos." },
        { title: "Calcul des écarts", desc: "KKS1/KKS2 comparent coût réel et coût cible sur les ordres soldés, et isolent les écarts de prix, quantité et rendement." },
        { title: "Règlement", desc: "KO88 pour les ordres internes, CO88 pour les ordres de fabrication : transfert des soldes vers leur destination finale (centre de coûts, immobilisation, CO-PA)." },
        { title: "Contrôle de cohérence et reporting", desc: "Vérification que chaque objet CO a bien été soldé à zéro, puis diffusion des rapports de centres de coûts, de profit centers et de rentabilité (KE30)." },
      ].map((step, i) => (
        <li key={step.title} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{step.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  </motion.section>
);

const S4HANAFeatures = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">CO dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Ce que S/4HANA change concrètement pour les consultants et contrôleurs CO.</p>
    <div className="space-y-3">
      {[
        { title: "Universal Journal (ACDOCA)", desc: "FI et CO écrivent dans la même table de lignes d'écriture, avec profit center, segment et champs CO-PA directement disponibles. Les analyses de coûts et de rentabilité sont utilisables en temps réel, sans batch de réconciliation ni tables agrégées séparées (COSP/COSS n'existent plus comme tables physiques)." },
        { title: "Account-based CO-PA en standard", desc: "Margin Analysis (nom officiel de l'account-based CO-PA en S/4HANA) est désormais la référence recommandée par SAP, aux dépens du costing-based historique — qui reste disponible mais n'est plus enrichi." },
        { title: "Universal Allocation", desc: "Un ensemble d'apps Fiori (Manage Allocations, Run Allocations, Allocation Results…) harmonise ce qui exigeait auparavant des transactions séparées par type d'allocation — cost centers, profit centers, top-down CO-PA — avec une simulation avant exécution réelle." },
        { title: "Fiori apps pour Controllers", desc: "Cockpits d'analyse cost centers, profit centers, CO-PA et product costing accessibles depuis n'importe quel navigateur, en complément (pas en remplacement complet) des transactions SAP GUI historiques comme KSB1 ou KE24." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/40">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

const CareerBenefits = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
    className="bg-linear-to-br from-emerald-900 to-emerald-700 rounded-2xl p-6 text-white">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser CO ?</h2>
    <p className="text-sm text-white/70 mb-5">CO est demandé dans tous les projets S/4HANA Finance. Les profils FI/CO bénéficient d'une prime salariale significative, et le contrôle de gestion reste l'un des métiers finance les moins automatisables à court terme.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP FI/CO", desc: "Rôle central dans les projets de transformation Finance. FI et CO sont souvent confiés au même consultant junior avant une spécialisation progressive." },
        { title: "Contrôleur de gestion SAP", desc: "Côté client — exploite CO-PA et cost centers pour les reportings mensuels, les budgets annuels et les analyses d'écarts remontées à la direction." },
        { title: "Analyste CO-PA / Pricing", desc: "Spécialiste de la rentabilité produit/client. Profil très recherché dans l'industrie, la distribution et tout secteur à forte variété de références." },
        { title: "Consultant Product Costing", desc: "Expert en valorisation des stocks et coûts de production. Forte demande dans les entreprises manufacturières, en lien étroit avec PP et MM." },
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
   T-codes CO essentiels
───────────────────────────────────────────────────────────── */
const TCODES = [
  { code: "KS01 / KSB1", label: "Centre de coûts : création / postes réels", usage: "Créer un centre de coûts (KS01) et consulter les charges réelles qui y sont imputées, poste par poste (KSB1)." },
  { code: "KSU1 / KSU5", label: "Cycle d'assessment : définition / exécution", usage: "Définir (KSU1) puis exécuter (KSU5) la répartition périodique des coûts d'un centre de support vers les centres consommateurs." },
  { code: "KO01 / KO88", label: "Ordre interne : création / règlement réel", usage: "Créer un ordre interne (KO01) et solder ses coûts réels en fin de vie vers sa destination finale (KO88)." },
  { code: "CK11N / CK24", label: "Coût estimatif matière / libération du prix", usage: "Calculer le coût standard d'un produit à partir de sa nomenclature et de sa gamme, puis diffuser ce prix sur le matériau." },
  { code: "KKS1 / CO88", label: "Calcul des écarts / règlement de l'ordre", usage: "Comparer coût réel et coût cible sur un ordre de fabrication, puis solder les écarts vers FI et CO-PA." },
  { code: "KE24 / KE30", label: "CO-PA : postes réels / rapport de rentabilité", usage: "Afficher le détail des postes CO-PA (KE24) ou exécuter un rapport de marge par segment (KE30)." },
];

const CoTcodes = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">T-codes CO essentiels</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les transactions SAP GUI à connaître pour un consultant ou un contrôleur de gestion junior — y compris sous Fiori, elles restent la référence des rapports de détail.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {TCODES.map((t) => (
        <div key={t.code} className="border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/10">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">{t.code} — {t.label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{t.usage}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

const FAQ_ITEMS = [
  { q: "Quelle est la différence entre FI et CO ?", a: "FI produit les états financiers légaux (bilan, compte de résultat) destinés à l'extérieur de l'entreprise. CO fournit des analyses internes de coûts et de rentabilité à destination de la direction et des managers, sans contrainte réglementaire externe. En S/4HANA, les deux partagent le même Universal Journal (ACDOCA), ce qui élimine la réconciliation périodique entre les deux univers." },
  { q: "Faut-il connaître la comptabilité pour faire du SAP CO ?", a: "Les bases comptables sont utiles (débits/crédits, marges, charges), mais CO est plus proche du contrôle de gestion que de la comptabilité générale. Un profil finance ou gestion peut très bien exceller en CO sans être comptable — l'essentiel est de comprendre la logique de responsabilité (qui engage le coût) et d'allocation (comment il se répartit)." },
  { q: "Qu'est-ce que le COGS split et pourquoi c'est important ?", a: "Le COGS split décompose le coût des marchandises vendues en composantes (matière première, main-d'œuvre, frais généraux de production). Cette ventilation, produite par CO-PC et reprise dans CO-PA, permet d'identifier précisément où se perdent les marges par produit ou famille de produits plutôt que de constater un seul chiffre agrégé." },
  { q: "CO-PA account-based vs costing-based : quelle différence ?", a: "L'account-based CO-PA (Margin Analysis) est aligné sur les comptes GL, compatible nativement avec l'Universal Journal, et produit des analyses toujours réconciliées avec FI. Le costing-based utilise des champs de valeur propres à l'Operating Concern, plus flexibles pour des schémas de marge personnalisés, mais qui nécessitent une conversion et une réconciliation avec FI. En S/4HANA, l'account-based est recommandé par SAP pour tout nouveau déploiement." },
  { q: "SAP CO est-il difficile à apprendre en partant de zéro ?", a: "CO est plus conceptuel que FI : il n'y a pas de référentiel légal externe à respecter, donc la logique dépend entièrement de l'organisation du client. La clé est de comprendre l'articulation des objets de coûts (centre, ordre, segment de marge) avant de s'attaquer au Customizing. Commencer par les cost centers, puis les profit centers, puis CO-PA, est le chemin le plus naturel." },
  { q: "Quelle différence entre un ordre interne statistique et un ordre interne réel ?", a: "Un ordre statistique sert uniquement à analyser une dépense sous un angle transversal, en parallèle d'une imputation réelle effectuée ailleurs (sur un centre de coûts par exemple) — il n'est jamais soldé et ne porte pas de budget contraignant. Un ordre réel porte véritablement les coûts, peut être budgétisé avec contrôle de disponibilité, et doit être réglé (KO88) vers un objet CO de destination à la fin de son cycle de vie." },
  { q: "Qu'est-ce que l'Universal Allocation apporté par S/4HANA ?", a: "C'est un cadre unique qui remplace, app Fiori par app Fiori (Manage Allocations, Run Allocations, Allocation Results), les multiples transactions séparées d'ECC pour les cycles de distribution, d'assessment, de répartition de profit centers et de top-down CO-PA. Il s'appuie sur les mêmes tables que l'Universal Journal (ACDOCA pour le réel, ACDOCP pour le plan) et permet de simuler une allocation avant de l'exécuter réellement." },
  { q: "Comment se calcule concrètement un écart de coût de production ?", a: "Le coût standard (fixé via CK11N à partir de la nomenclature et de la gamme) est comparé, à la clôture de l'ordre de fabrication, au coût réel constaté — matière effectivement consommée, heures réellement passées. KKS1 (ou KKS2 en individuel) décompose l'écart total par catégorie : écart de prix (le cours d'achat a changé), de quantité ou de rendement (plus de matière ou de temps consommé que prévu pour la même quantité produite), et de reste. Ces écarts sont ensuite réglés vers FI et, selon la configuration, vers CO-PA." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP CO.</p>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors" aria-expanded={openIndex === i}>
              <span>{item.q}</span><ChevronIcon open={openIndex === i} />
            </button>
            {openIndex === i && <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-gray-100 dark:border-slate-700 pt-3">{item.a}</div>}
          </div>
        ))}
      </div>
    </motion.section>
  );
};

const RESOURCES = [
  { title: "Cost Center and Internal Order Accounting in SAP S/4HANA", href: "https://learning.sap.com/courses/cost-center-and-internal-order-accounting-in-sap-s-4hana", source: "SAP Learning" },
  { title: "CO-PA : simplifier l'analyse de rentabilité avec S/4HANA", href: "https://www.vc-erp.com/co-pa-simplifying-profitability-analysis-with-sap-s4hana/", source: "VC-ERP" },
  { title: "Profitability Analysis (CO-PA) — Documentation officielle SAP", href: "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/5e23dc8fe9be4fd496f8ab556667ea05/be96d7531a4d414de10000000a174cb4.html", source: "SAP Help" },
  { title: "The Ultimate Guide to Product Costing in SAP S/4HANA", href: "https://community.sap.com/t5/technology-blog-posts-by-members/the-ultimate-guide-to-product-costing-in-sap-s-4hana/ba-p/14223308", source: "SAP Community" },
  { title: "SAP S/4HANA Controlling Master Data — Guide", href: "https://community.sap.com/t5/supply-chain-management-blog-posts-by-members/the-ultimate-guide-to-sap-s-4hana-controlling-master-data/ba-p/13799414", source: "SAP Community" },
  { title: "Universal Allocation in SAP S/4HANA : A Smarter Approach", href: "https://blog.sap-press.com/universal-allocation-in-sap-s4hana", source: "SAP PRESS" },
  { title: "Understanding the Universal Journal in SAP S/4HANA", href: "https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/understanding-the-universal-journal-in-sap-s-4hana/ba-p/13345726", source: "SAP Community" },
];

const CoResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Contenus à jour pour approfondir CO, CO-PA, Product Costing et les allocations S/4HANA.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-emerald-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Prochaine étape
───────────────────────────────────────────────────────────── */
const NextStep = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
    className="rounded-2xl border border-emerald-500/20 dark:border-emerald-400/30 bg-emerald-500/[0.03] dark:bg-emerald-400/[0.06] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 mb-1">Étape suivante du parcours</p>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">CO acquis ? Passe à MM pour voir d'où viennent les coûts imputés.</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Une bonne partie des coûts que CO analyse — matière, sous-traitance, consommation d'articles — naît dans MM.
        Comprendre les deux côtés du flux est ce qu'attend un recruteur en entretien.
      </p>
    </div>
    <div className="flex gap-3 flex-shrink-0">
      <Link href="/certifications/co/examen" className="btn-outline px-4 py-2.5 text-sm whitespace-nowrap">Examen blanc CO</Link>
      <Link href="/modules-sap/mm" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">Module MM →</Link>
    </div>
  </motion.section>
);

export default function CO() {
  return (
    <ModuleLayout
      code="CO"
      title="Controlling"
      description="Maîtrisez l'analyse interne des coûts et de la rentabilité SAP : cost centers, profit centers, internal orders, product costing et CO-PA sur S/4HANA."
      gradient="from-emerald-900 via-emerald-700 to-teal-500"
      badge="Controlling · Rentabilité · CO-PA"
      stats={["~30 min de lecture", "5 sous-modules détaillés", `Certification ${certCode("co")}`]}
      examHref="/certifications/co/examen"
    >
      <CoIntro />
      <KeyConcepts />
      <CoObjects />
      <CoSubmodules />
      <CostProfitCenters />
      <InternalOrders />
      <ProductCostControlling />
      <CoPaSection />
      <Integration />
      <ClotureMensuelle />
      <S4HANAFeatures />
      <CareerBenefits />
      <CoTcodes />
      <CoResources />
      <FaqAccordion />
      <NextStep />
    </ModuleLayout>
  );
}
