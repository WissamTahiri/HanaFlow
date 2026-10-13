"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import FlowDiagram from "@/components/diagrams/FlowDiagram";
import ModuleLayout from "@/components/ModuleLayout";
import { certCode } from "@/lib/certCodes";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} aria-hidden="true">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ─── Concepts clés ─── */
const KEY_CONCEPTS = [
  { code: "BOM", label: "Bill of Materials", description: "Liste structurée de tous les composants nécessaires à la fabrication d'une unité de produit fini : quantités, unités de mesure et validité. Une BOM peut compter plusieurs niveaux — un sous-ensemble a sa propre BOM, et le système explose la structure jusqu'à la matière première.", color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-400" },
  { code: "ROUTING", label: "Gamme (Routing)", description: "Séquence des opérations de fabrication : pour chaque étape, le work center utilisé, une clé de contrôle qui pilote les mouvements de stock automatiques, et des valeurs standards (setup, temps machine, temps main-d'œuvre) qui servent à planifier la capacité et calculer le coût.", color: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400" },
  { code: "MRP", label: "Material Requirements Planning", description: "Calcul des besoins nets, matériau par matériau : demande moins stock disponible moins stock de sécurité. Génère automatiquement des ordres planifiés (fabrication interne) ou des demandes d'achat (approvisionnement externe) selon le type de MRP et le mode d'approvisionnement du matériau.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" },
  { code: "PrdOrd", label: "Production Order", description: "Ordre de fabrication : porte la BOM et la gamme chargées pour un lot donné, les coûts planifiés et réels, les confirmations d'opérations et l'historique des mouvements de stock jusqu'à la clôture (settlement).", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "CO-PC", label: "Product Cost Controlling", description: "Module CO lié à PP : calcule le coût standard du produit à partir de la BOM, de la gamme et des taux d'activité, valorise le work in progress en cours de mois et affecte les variances entre coûts réels et coûts cibles en clôture.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "PP/DS", label: "Embedded PP/DS", description: "Planification avancée intégrée à S/4HANA depuis la release 1610 : capacité finie, heuristiques d'optimisation et granularité temporelle fine (heures, minutes), pour les environnements où la seule contrainte matière ne suffit pas à construire un plan réaliste.", color: "bg-sap-blue/5 dark:bg-sap-blue/10 border-sap-blue/20 dark:border-sap-blue/30 text-sap-blue dark:text-sap-accent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les 6 notions fondamentales du module PP à maîtriser avant toute mission de planification de production.</p>
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

/* ─── Master data + exemple d'explosion de BOM ─── */
const MASTER_DATA_ITEMS = [
  { term: "Bill of Materials (BOM)", def: "Créée en CS01 (modifiée en CS02, affichée en CS03). Chaque poste porte une quantité, une unité de mesure et un indicateur de prélèvement (backflush ou sortie manuelle). Un sous-ensemble assemblé a sa propre BOM : le système explose récursivement la structure jusqu'à la matière première brute." },
  { term: "Routing (Gamme)", def: "Créée en CA01 (CA02, CA03). Pour chaque opération : le work center, une clé de contrôle qui détermine si l'opération déclenche un mouvement de stock ou une confirmation de coût, et des valeurs standards (temps de préparation, temps machine, temps main-d'œuvre par unité)." },
  { term: "Work Center", def: "Créé en CR01 : machine, ligne ou groupe d'opérateurs, rattaché à un cost center CO pour l'imputation des heures. Porte une catégorie de capacité (machine, main-d'œuvre), un calendrier d'usine et une formule de capacité disponible — la donnée de référence pour toute évaluation de charge." },
  { term: "Production Version", def: "Créée en C223 : combinaison figée d'une BOM et d'une gamme, valable pour une plage de quantités et de dates. Un même produit peut avoir plusieurs versions (ligne automatisée pour les gros volumes, ligne manuelle pour le dépannage) — MRP choisit celle qui s'applique." },
];

const BOM_EXPLOSION_ROWS = [
  { component: "Cadre aluminium 26″", level: "1", qtyUnit: "1", needed: "300" },
  { component: "Roue assemblée (sous-ensemble)", level: "1", qtyUnit: "2", needed: "600" },
  { component: "— Jante aluminium", level: "2", qtyUnit: "1 / roue", needed: "600" },
  { component: "— Pneu 26×2.1", level: "2", qtyUnit: "1 / roue", needed: "600" },
  { component: "— Rayons inox", level: "2", qtyUnit: "32 / roue", needed: "19 200" },
  { component: "Kit transmission (dérailleur + chaîne)", level: "1", qtyUnit: "1", needed: "300" },
  { component: "Guidon + potence", level: "1", qtyUnit: "1", needed: "300" },
];

const MasterData = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Master Data PP — construire des données fiables</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Un ordre de fabrication n&apos;est fiable que si les données qui le nourrissent le sont. Trois objets techniques, combinés dans une
      production version, déterminent tout : quels composants consommer, dans quel ordre travailler, et sur quelle ressource. Une erreur
      dans l&apos;un d&apos;eux se propage silencieusement à chaque ordre créé — jusqu&apos;à ce qu&apos;un planificateur la remarque sur le terrain.
    </p>
    <div className="grid sm:grid-cols-2 gap-4 mb-6">
      {MASTER_DATA_ITEMS.map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{term}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{def}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-teal-100 dark:border-teal-900/30 bg-teal-50/40 dark:bg-teal-900/10 p-4">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Explosion de BOM — un exemple chiffré</p>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        Un ordre de 300 vélos VTT doit exploser la BOM multi-niveau du produit fini. Au niveau 1, chaque composant est multiplié par sa quantité
        unitaire et par 300. Mais la &laquo; roue assemblée &raquo; est elle-même un sous-ensemble : sa propre BOM (niveau 2) doit être explosée à son
        tour, en tenant compte du fait qu&apos;un vélo utilise deux roues. C&apos;est cette explosion récursive, multipliée à chaque niveau, qui fait
        passer 300 vélos à plus de 19 000 rayons à approvisionner — et qui explique pourquoi une erreur de quantité sur un petit composant de
        niveau 2 peut créer une rupture difficile à diagnostiquer en MD04.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-teal-200/60 dark:border-teal-800/40">
              <th className="py-1.5 pr-3 font-semibold">Composant</th>
              <th className="py-1.5 pr-3 font-semibold">Niveau</th>
              <th className="py-1.5 pr-3 font-semibold">Qté unitaire</th>
              <th className="py-1.5 font-semibold">Besoin pour 300 vélos</th>
            </tr>
          </thead>
          <tbody>
            {BOM_EXPLOSION_ROWS.map((r) => (
              <tr key={r.component} className="border-b border-teal-100/60 dark:border-teal-900/20 last:border-0">
                <td className="py-1.5 pr-3 text-slate-700 dark:text-slate-300">{r.component}</td>
                <td className="py-1.5 pr-3 text-slate-500 dark:text-slate-400">{r.level}</td>
                <td className="py-1.5 pr-3 text-slate-500 dark:text-slate-400">{r.qtyUnit}</td>
                <td className="py-1.5 font-semibold text-teal-700 dark:text-teal-400">{r.needed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.section>
);

/* ─── MRP — planification des besoins ─── */
const MRP_TYPES = [
  { code: "PD", label: "Planification des besoins (MRP)", desc: "Prend en compte les besoins dépendants (issus des BOM), les commandes clients et les besoins prévisionnels indépendants. Ne se préoccupe pas du niveau de stock en tant que tel, seulement des besoins futurs — c'est le type par défaut pour les composants fabriqués ou consommés de façon irrégulière." },
  { code: "VB", label: "Point de commande manuel", desc: "Déclenche un réapprovisionnement dès que le stock disponible tombe sous un point de commande fixé manuellement (couvrant le délai de réapprovisionnement + stock de sécurité). N'intègre pas les besoins futurs (commandes clients, réservations) — adapté aux articles à consommation régulière et peu critiques." },
  { code: "VM", label: "Point de commande automatique", desc: "Même logique que VB, mais le point de commande et le stock de sécurité sont recalculés automatiquement par le système à partir de l'historique de consommation, au lieu d'être saisis à la main par le planificateur." },
  { code: "V1 / V2", label: "Point de commande + besoins externes", desc: "Variante de VB/VM qui réintroduit les commandes clients et réservations manuelles dans le calcul (paramétrable via OMDQ), pour les cas où le point de commande seul ne suffit pas à anticiper une demande exceptionnelle." },
];

const LOT_SIZING = [
  { code: "EX", label: "Lot pour lot", desc: "Une quantité d'approvisionnement par besoin net, sans regroupement — pas de stock excédentaire mais plus d'ordres à gérer." },
  { code: "FX", label: "Taille de lot fixe", desc: "Quantité fixe définie dans le matériel, indépendante du besoin réel ; utile pour les contraintes de conditionnement ou de cuve." },
  { code: "WB / MB", label: "Regroupement périodique", desc: "Cumule tous les besoins nets d'une semaine (WB) ou d'un mois (MB) en un seul ordre, pour réduire le nombre de lancements." },
  { code: "H1", label: "Reconstitution au niveau max.", desc: "Réapprovisionne jusqu'au stock maximal défini — procédure obligatoire sur les matériaux pilotés en DDMRP (type MRP D1)." },
];

const MrpPlanning = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.07 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">MRP — calculer les besoins nets</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Au cœur de PP : comparer, pour chaque matériau, ce qui est demandé à ce qui est disponible, puis proposer un plan de couverture. Le
      résultat dépend de trois paramètres du matériel : le type de MRP, la procédure de lot de taille et le mode d&apos;approvisionnement
      (fabriqué en interne ou acheté).
    </p>

    <div className="mb-5">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Types de MRP (consommation basée vs déterministe)</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {MRP_TYPES.map((t) => (
          <div key={t.code} className="rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-900/10 p-3">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">{t.code} — {t.label}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-5">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Procédures de taille de lot (exemples courants)</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {LOT_SIZING.map((l) => (
          <div key={l.code} className="rounded-xl border border-gray-100 dark:border-slate-700 p-3 bg-gray-50 dark:bg-slate-700/40">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{l.code} — {l.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{l.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-xl border border-gray-100 dark:border-slate-700 p-4">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Sortie du MRP : ordres planifiés ou demandes d&apos;achat</p>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        Quand un besoin net est détecté, MRP crée un <strong>ordre planifié</strong> si le matériau est fabriqué en interne, ou une
        <strong> demande d&apos;achat</strong> si le mode d&apos;approvisionnement est externe — ces deux objets sont ensuite consultables
        et modifiables dans la liste des besoins/stocks (transaction MD04), avec les messages d&apos;exception (retard, rupture, excédent) qui
        signalent au planificateur où intervenir manuellement.
      </p>
    </div>
  </motion.section>
);

/* ─── Flux de production ─── */
const ProductionFlow = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.09 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Flux de production discret — étape par étape</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Du calcul MRP à la clôture de l&apos;ordre, avec les impacts MM et CO à chaque étape.</p>

    <div className="mb-5">
      <FlowDiagram
        title="Flux de production discret"
        steps={[
          { label: "MRP", sublabel: "MD01N · PP" },
          { label: "Ordre créé", sublabel: "CO01 · PP" },
          { label: "Goods Issue", sublabel: "mvt 261 · MM" },
          { label: "Confirmation", sublabel: "CO11N · PP" },
          { label: "Goods Receipt", sublabel: "mvt 101 · MM" },
          { label: "Settlement", sublabel: "KO88 · CO" },
        ]}
      />
    </div>

    <div className="space-y-3">
      {[
        { step: "1", label: "Planification MRP", desc: "MRP calcule les besoins nets à partir de la demande (commandes client, prévisions) et de la BOM. Génère des Planned Orders et des Purchase Requisitions, visibles dans MD04." },
        { step: "2", label: "Conversion en Production Order", desc: "Le Planned Order est converti en ordre de fabrication (CO01/CO40). La BOM et la gamme de la production version active sont chargées, les coûts planifiés calculés à partir du coût standard." },
        { step: "3", label: "Goods Issue (mvt 261)", desc: "Sortie des composants vers l'atelier — manuelle (MB1A) ou automatique par backflush à la confirmation. Impact MM (réduction stock composants) et CO-PC (coûts matières imputés à l'ordre)." },
        { step: "4", label: "Confirmations d'opérations", desc: "Les opérateurs confirment via CO11N (ou CO15 pour la confirmation finale) les heures travaillées et les quantités produites, bonnes et rebutées. Impact CO : coûts de main-d'œuvre et machine valorisés aux taux d'activité du work center." },
        { step: "5", label: "Goods Receipt (mvt 101)", desc: "Entrée en stock du produit fini, automatique si le control key de la dernière opération l'autorise, sinon via MIGO. Impact MM (augmentation stock PF) et FI (valorisation au coût standard)." },
        { step: "6", label: "Order Settlement (KO88/CO88)", desc: "Clôture de l'ordre : WIP calculé (KKAO) sur les ordres encore ouverts, variances calculées (KKS1) une fois l'ordre livré, puis réglées — affectées à CO-PA, à un compte de résultat ou à un centre de coûts." },
      ].map(({ step, label, desc }) => (
        <div key={step} className="flex gap-4 p-4 rounded-xl bg-teal-50/50 dark:bg-teal-900/5 border border-teal-100 dark:border-teal-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center">{step}</span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-5 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-900/10 p-4">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Exemple chiffré — lancement d&apos;un ordre</p>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        Un ordre est lancé pour 500 unités d&apos;un sous-ensemble. La BOM demande 2 kg de résine par unité, soit 1 000 kg nécessaires. Le
        stock disponible du composant est de 600 kg : le goods issue couvre d&apos;abord ces 600 kg (mouvement 261), puis signale un manque de
        400 kg que MRP avait déjà anticipé en générant une demande d&apos;achat correspondante. À la confirmation, l&apos;opérateur déclare
        495 unités bonnes et 5 unités rebutées : les 495 déclenchent le goods receipt (mouvement 101) vers le stock de produit fini, tandis
        que le coût des 5 unités rebutées reste sur l&apos;ordre et apparaîtra comme variance de rebut (scrap variance) au moment du KKS1.
      </p>
    </div>
  </motion.section>
);

/* ─── Planification de capacité ─── */
const CapacityPlanning = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.11 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Planification de capacité — équilibrer charge et ressources</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      MRP planifie par défaut à capacité infinie : il crée les ordres nécessaires pour couvrir la demande sans vérifier si les work centers
      peuvent réellement absorber la charge. L&apos;évaluation et le lissage de capacité sont une étape distincte.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Évaluation de charge (CM01 – CM05)", desc: "CM01 affiche la charge, la capacité disponible et le taux d'utilisation d'un work center. CM02 liste les ordres associés, CM03 regroupe un pool de work centers, CM04 identifie le retard (backlog), CM05 les surcharges — les premiers signaux qu'un planificateur de capacité surveille." },
        { title: "Lissage de capacité (CM21 / CM25)", desc: "La planning table (CM21, ou CM25 pour plus de flexibilité de profil) permet de dispatcher manuellement les ordres sur un work center, de déplacer une opération en cas de surcharge, ou de la rebasculer sur une ressource alternative définie dans la gamme." },
        { title: "Prérequis techniques", desc: "Une évaluation de capacité fiable suppose un control key portant l'indicateur de besoin de capacité et de planification à capacité finie sur la gamme, et un work center correctement configuré : catégorie de capacité, calendrier d'usine, équipes (shifts)." },
        { title: "Embedded PP/DS — capacité finie en amont", desc: "Contrairement au CRP classique qui évalue la charge après coup, PP/DS planifie directement à capacité finie, avec un découpage temporel pouvant descendre à l'heure ou à la minute — utile quand une seule contrainte matière ne suffit pas à produire un plan exécutable." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800/40">
          <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Discrète / répétitive / process ─── */
const ManufacturingTypes = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.13 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Trois façons de produire</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      PP couvre plusieurs modèles de fabrication, choisis selon le type de produit et le rythme de la ligne — pas une hiérarchie, trois outils
      pour trois contextes industriels différents.
    </p>
    <div className="space-y-3">
      {[
        { tag: "DISCRÈTE", title: "Production discrète — ordres individuels", desc: "Un ordre de fabrication (CO01) par lot, avec sa propre BOM, sa gamme et son suivi de coût. Adapté aux produits variés ou complexes fabriqués en petites séries irrégulières — automobile, aéronautique, machines spéciales.", color: "bg-blue-600" },
        { tag: "RÉPÉTITIVE", title: "Production répétitive — planning sans ordre individuel", desc: "Pas d'ordre de fabrication par lot : un profil REM et une planning table pilotent des quantités sur une période, avec backflush systématique des composants et un product cost collector à la place d'un ordre pour cumuler les coûts. Adapté aux lignes à cadence stable et aux produits peu variés — électronique, biens de consommation.", color: "bg-emerald-600" },
        { tag: "PROCESS", title: "Process manufacturing — recettes et ordres process", desc: "Le routing est remplacé par une master recipe et des instructions de process (PI sheets) qui pilotent les étapes et les contrôles qualité ; la BOM peut produire des co-produits et sous-produits. Adapté aux industries chimie, pharma, agroalimentaire où le process compte autant que le produit.", color: "bg-purple-600" },
        { tag: "LEAN / KANBAN", title: "Réapprovisionnement Kanban", desc: "Pour les composants à faible valeur et forte régularité de consommation, un contrôle Kanban (cartes, zones d'approvisionnement) déclenche le réapprovisionnement par simple signal visuel, sans passer par le calcul MRP complet — souvent combiné à la production répétitive sur la même ligne.", color: "bg-amber-500" },
      ].map(({ tag, title, desc, color }) => (
        <div key={tag} className="p-4 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${color}`}>{tag}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Intégration PP-MM-CO ─── */
const SETTLEMENT_SEQUENCE = [
  { step: "1", label: "Coût standard (CK11N / CK40N / CK24)", desc: "Calculé à partir de la BOM, de la gamme et des taux d'activité planifiés sur les work centers. Marqué puis libéré, il devient le coût de référence de tous les ordres de la période." },
  { step: "2", label: "Overhead réel (KGI2 / CO43)", desc: "Les frais généraux de production sont imputés aux ordres selon les clés de calcul des frais généraux définies en Customizing." },
  { step: "3", label: "WIP (KKAX / KKAO)", desc: "Calculé uniquement sur les ordres au statut REL ou PREL (encore ouverts) : le work in progress reflète les coûts déjà engagés sur un ordre non encore livré." },
  { step: "4", label: "Variance (KKS1 / KKS2)", desc: "Calculée seulement sur les ordres livrés (DLV) ou techniquement clos (TECO), une fois la quantité livrée définitive connue. Le système ventile l'écart par catégorie : variance de prix, de quantité, de rebut, d'usage des ressources, variance résiduelle." },
  { step: "5", label: "Settlement (KO88 / CO88)", desc: "Poste le document de variance qui solde l'ordre : WIP ou variance (jamais les deux à la fois) part vers CO-PA, un centre de coûts ou un compte de résultat, et alimente l'Universal Journal (ACDOCA) en S/4HANA." },
];

const Integration = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration PP–MM–CO</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">PP n&apos;est jamais isolé : chaque événement de production a un impact logistique (MM) et financier (CO).</p>

    <div className="mb-5">
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">PP–MM : approvisionner les composants</p>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
        Le mode d&apos;approvisionnement défini dans le matériel (fabrication interne, achat externe, ou les deux) pilote ce que MRP génère :
        un ordre planifié pour un composant fabriqué, une demande d&apos;achat pour un composant acheté. Pour un composant en
        <strong> sous-traitance</strong> (clé de procurement spéciale 30), le flux est différent : les composants sont envoyés au
        sous-traitant via une sortie de stock spéciale, et le produit semi-fini ou fini revient en goods receipt contre une commande
        d&apos;achat de type sous-traitance, pas contre un ordre de fabrication classique.
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        Chaque sortie de composant (mouvement 261) réduit le stock MM et impute le coût matière à l&apos;ordre ; chaque entrée de produit
        fini (mouvement 101) augmente le stock MM et le valorise au coût standard défini par CO-PC.
      </p>
    </div>

    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">PP–CO : la séquence de clôture mensuelle</p>
      <div className="space-y-2">
        {SETTLEMENT_SEQUENCE.map(({ step, label, desc }) => (
          <div key={step} className="flex gap-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-900/5 border border-purple-100 dark:border-purple-900/20">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center mt-0.5">{step}</span>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">{label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.section>
);

/* ─── S/4HANA ─── */
const S4HANAFeatures = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.17 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">PP dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Ce que S/4HANA change concrètement pour la planification et l&apos;exécution de production.</p>
    <div className="space-y-3">
      {[
        { title: "MRP Live (MD01N)", desc: "Le moteur MRP conçu pour HANA : il lit les besoins et les ressources de couverture, calcule les écarts et crée les propositions d'approvisionnement en une seule procédure de base de données, au lieu de boucler matériau par matériau. MD01N remplace les anciennes transactions MD01/MD02/MD03 et apporte un gain de performance notable au-delà d'une centaine de matériaux planifiés — en dessous, le MRP classique reste comparable. Certains cas (point de commande VB avec lot périodique, planification spécifique à la commande client) doivent encore être forcés en MRP classique." },
        { title: "Embedded PP/DS", desc: "Depuis la release 1610, la planification avancée historiquement réservée à SAP APO est intégrée nativement à S/4HANA : planification à capacité finie, heuristiques de séquencement et d'optimisation, granularité temporelle fine. Les données et les ordres restent dans le même système, sans synchronisation entre deux plateformes séparées." },
        { title: "Demand-Driven MRP (DDMRP)", desc: "Approche de pilotage par buffers dynamiques plutôt que par prévisions pures : des points de découplage absorbent la variabilité de la demande et de l'approvisionnement via trois zones (rouge pour le stock de sécurité, jaune jusqu'au point de commande, verte au-delà). Configurée via le type MRP D1 et la procédure de lot H1 sur les matériaux concernés — à réserver aux références qui justifient un stock tampon, pas à l'ensemble du portefeuille." },
        { title: "Fiori apps pour ateliers", desc: "Confirmation de production, suivi des ordres, tableaux de pilotage de capacité — accessibles depuis des terminaux d'atelier sans SAP GUI, avec une UX pensée pour un usage debout, au poste de travail." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/40">
          <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── Débouchés ─── */
const CareerBenefits = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.19 }}
    className="bg-linear-to-br from-teal-900 to-teal-600 rounded-2xl p-6 text-white">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser PP ?</h2>
    <p className="text-sm text-white/70 mb-5">PP est incontournable dans les entreprises industrielles (automobile, aéronautique, chimie, agroalimentaire). La demande est forte et les profils qui tiennent les deux bouts — production et coûts — restent rares.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP PP", desc: "Paramètre le module PP (BOM, gammes, MRP, ordres, capacité) dans les projets d'implémentation ou de migration S/4HANA industriels." },
        { title: "Planificateur production SAP", desc: "Côté client — utilise MRP Live, MD04 et PP/DS au quotidien pour ajuster les plans de production et résoudre les ruptures et surcharges." },
        { title: "Consultant PP/CO-PC", desc: "Profil hybride très demandé : maîtrise l'exécution production ET le costing de produit, de la BOM au settlement. Rare et bien rémunéré." },
        { title: "Expert Supply Chain S/4HANA", desc: "Pilote les projets d'intégration PP–MM–SD pour fluidifier la chaîne de valeur industrielle, de la prévision de vente à la livraison." },
      ].map(({ title, desc }) => (
        <div key={title} className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-sm font-semibold mb-1">{title}</p>
          <p className="text-xs text-white/70 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── T-codes ─── */
const TCODES = [
  { code: "CS01", label: "Créer BOM", usage: "Définir la liste des composants d'un produit fini ou d'un sous-ensemble, avec quantités et validité." },
  { code: "CA01", label: "Créer routing", usage: "Définir la séquence d'opérations, les work centers et les valeurs standards de temps." },
  { code: "C223", label: "Créer production version", usage: "Figer la combinaison BOM + gamme utilisée par MRP pour une plage de quantités et de dates." },
  { code: "MD01N", label: "MRP Live", usage: "Lancer la planification des besoins sur un ou plusieurs plants, en profitant du moteur optimisé HANA." },
  { code: "MD04", label: "Liste des besoins/stocks", usage: "Vue par matériau de tous les éléments de besoin et de couverture, avec messages d'exception." },
  { code: "CO01", label: "Créer ordre de fabrication", usage: "Convertir un ordre planifié en ordre de fabrication exécutable, avec BOM et gamme chargées." },
  { code: "CO11N", label: "Confirmer un ordre", usage: "Saisir les heures et quantités réalisées à une opération ; déclenche souvent le goods issue par backflush." },
  { code: "CM01", label: "Charge du work center", usage: "Comparer la charge planifiée à la capacité disponible d'un work center sur une période." },
  { code: "KKS1", label: "Calcul des variances", usage: "Comparer coûts cibles et coûts réels sur les ordres livrés ou techniquement clos, par catégorie de variance." },
  { code: "KO88", label: "Règlement individuel d'ordre", usage: "Solder l'ordre : poste le WIP ou la variance vers CO-PA, un centre de coûts ou un compte de résultat." },
];

const PpTcodes = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.21 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">T-codes PP essentiels</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les transactions SAP GUI à connaître pour un consultant ou un planificateur de production junior.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {TCODES.map((t) => (
        <div key={t.code} className="border border-teal-500/20 rounded-xl p-4 bg-teal-50/60 dark:bg-teal-900/10">
          <p className="text-xs font-bold text-teal-700 dark:text-teal-400 mb-1">{t.code} — {t.label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{t.usage}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─── FAQ ─── */
const FAQ_ITEMS = [
  { q: "Quelle est la différence entre PP discret et PP répétitif ?", a: "La production discrète (discrete manufacturing) utilise des ordres de fabrication individuels pour chaque lot — typique dans l'automobile ou l'aéronautique. La production répétitive (repetitive manufacturing) est basée sur des plannings de production sans ordre individuel, avec backflush systématique et un product cost collector à la place d'un ordre — plus adaptée aux grandes séries continues." },
  { q: "Pourquoi le BOM et le Routing sont-ils si critiques en PP ?", a: "Le BOM détermine quels composants sont nécessaires (et en quelle quantité), tandis que le Routing définit comment et où le produit est fabriqué. Des erreurs dans ces données maîtres se propagent à tous les ordres de fabrication : mauvais composants, mauvais coûts, mauvais temps — et sur une BOM multi-niveau, l'erreur se démultiplie à chaque niveau explosé." },
  { q: "Comment PP et CO-PC interagissent-ils ?", a: "PP fournit les données d'exécution (heures réelles, consommations, quantités livrées) et CO-PC les valorise. Le coût standard, calculé par CO-PC à partir du BOM et du routing, sert de référence. En clôture, la séquence WIP (KKAO) → variance (KKS1) → settlement (KO88) compare les coûts réels aux coûts cibles et enregistre les écarts par catégorie." },
  { q: "Qu'est-ce que le MRP Live en S/4HANA ?", a: "MRP Live (MD01N) est la version S/4HANA du calcul des besoins en matières. Contrairement à l'ECC où le MRP classique traitait les matériaux en boucle, MRP Live s'appuie sur la base de données HANA pour calculer tout le périmètre en une procédure, avec une visibilité quasi temps réel sur les manques et les surcharges — un gain surtout net au-delà de la centaine de matériaux planifiés." },
  { q: "Quelle est la différence entre MRP classique et embedded PP/DS ?", a: "MRP (classique ou Live) planifie à capacité infinie : il garantit la couverture matière mais pas que le work center pourra absorber la charge. Embedded PP/DS ajoute une planification à capacité finie, avec des heuristiques de séquencement et un découpage temporel plus fin — utile quand la contrainte de capacité est aussi critique que la contrainte matière." },
  { q: "Qu'est-ce que le Demand-Driven MRP (DDMRP) apporte de différent ?", a: "Plutôt que de propager des prévisions à travers toute la chaîne, DDMRP positionne des points de découplage protégés par des buffers dynamiques (zones rouge, jaune, verte) qui absorbent la variabilité. Il se configure matériau par matériau (type MRP D1, lot H1) et ne remplace pas le MRP classique sur l'ensemble du portefeuille — seulement sur les références qui justifient ce stock tampon." },
  { q: "PP est-il difficile à apprendre en partant de zéro ?", a: "PP est parmi les modules les plus complexes car il est à l'intersection de la logistique, du paramétrage technique et du controlling. La clé est de commencer par le flux discret simple (BOM + Routing + MRP + Ordre + Settlement), de bien comprendre l'intégration avec MM (GI/GR) et CO-PC, avant d'aborder la capacité, la production répétitive ou process, et enfin PP/DS." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.23 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP PP.</p>
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

/* ─── Ressources ─── */
const RESOURCES = [
  { title: "SAP PP Module Overview — Documentation officielle", href: "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE", source: "SAP Help" },
  { title: "TS422 — SAP S/4HANA Production Planning and Manufacturing II", href: "https://training.sap.com/course/ts422-sap-s-4hana-production-planning-and-manufacturing-ii-classroom-026-us-en", source: "SAP Training" },
  { title: "Overview of Production Planning and Detailed Scheduling in embedded PP/DS", href: "https://blogs.sap.com/2019/04/10/overview-of-the-key-functionality-production-planning-and-detailed-scheduling-in-embedded-ppds-on-s4hana./", source: "SAP Community" },
  { title: "S/4HANA Demand Driven MRP (DDMRP) Functionality", href: "https://blogs.sap.com/2019/02/17/s4hana-demand-driven-mrp-ddmrp-functionality/", source: "SAP Community" },
  { title: "The Ultimate Guide to Product Costing in SAP S/4HANA", href: "https://community.sap.com/t5/technology-blog-posts-by-members/the-ultimate-guide-to-product-costing-in-sap-s-4hana/ba-p/14223308", source: "SAP Community" },
  { title: "SAP MRP Live — Planification en temps réel", href: "https://www.sap.com/products/scm/material-requirements-planning.html", source: "SAP.com" },
];

const PpResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Documentation et guides pour approfondir PP, la capacité, PP/DS et le Product Costing.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-teal-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-teal-500 dark:text-teal-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─── Prochaine étape ─── */
const NextStep = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.27 }}
    className="rounded-2xl border border-teal-500/20 dark:border-teal-400/30 bg-teal-500/[0.03] dark:bg-teal-400/[0.06] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-1">Étape suivante du parcours</p>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">PP acquis ? Passe à CO pour boucler le costing de production.</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        PP et CO-PC s&apos;articulent sur le settlement d&apos;ordre — comprendre comment un coût standard se construit et se solde
        est ce qu&apos;attend un recruteur en entretien PP/CO.
      </p>
    </div>
    <div className="flex gap-3 flex-shrink-0">
      <Link href="/certifications/pp/examen" className="btn-outline px-4 py-2.5 text-sm whitespace-nowrap">Examen blanc PP</Link>
      <Link href="/modules-sap/co" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">Module CO →</Link>
    </div>
  </motion.section>
);

/* ─── Page principale ─── */
const PP = () => (
  <ModuleLayout
    code="PP"
    title="Production Planning"
    description="Maîtrisez la planification et l'exécution de production SAP : BOM, gammes, MRP, capacité, ordres de fabrication, intégration CO-PC et S/4HANA."
    gradient="from-teal-900 via-teal-700 to-cyan-500"
    badge="Production · MRP · CO-PC"
    stats={["~27 min de lecture", "10 T-codes essentiels", `Certification ${certCode("pp")}`]}
    examHref="/certifications/pp/examen"
  >
    <KeyConcepts />
    <MasterData />
    <MrpPlanning />
    <ProductionFlow />
    <CapacityPlanning />
    <ManufacturingTypes />
    <Integration />
    <S4HANAFeatures />
    <CareerBenefits />
    <PpTcodes />

    <PpResources />
    <FaqAccordion />
    <NextStep />
  </ModuleLayout>
);

export default PP;
