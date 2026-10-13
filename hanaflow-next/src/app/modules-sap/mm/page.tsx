"use client";

import { useState } from "react";
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

/* ─────────────────────────────────────────────────────────────
   Concepts clés
───────────────────────────────────────────────────────────── */
const KEY_CONCEPTS = [
  { code: "P2P",     label: "Procure-to-Pay",                description: "Du besoin d'achat au paiement fournisseur : PR → PO → GR → MIRO → F110. Chaque étape génère un document MM et, dès qu'un stock ou une facture est concerné, une écriture FI miroir.", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400" },
  { code: "ME51N",   label: "Purchase Requisition (PR)",      description: "Demande d'achat interne : création manuelle par un service, ou génération automatique par le MRP (PP) quand un besoin de matière première est détecté. Pas d'engagement externe à ce stade.", color: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/50 text-sky-700 dark:text-sky-400" },
  { code: "GR",      label: "Goods Receipt (MIGO)",           description: "Réception physique de la marchandise, le plus souvent en mouvement 101 (avec référence PO). Met à jour le stock et déclenche une écriture FI : débit stock, crédit compte GR/IR.", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400" },
  { code: "GR/IR",   label: "Compte de régularisation",        description: "Compte transitoire FI-MM piloté via OBYC. Crédité au GR (marchandise reçue, facture pas encore reçue), débité au MIRO — c'est le pont comptable entre logistique et facturation.", color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400" },
  { code: "MM01",    label: "Material Master",                 description: "Fiche article pivot : vues Achats, MRP, Stocks, Compta 1/2, Calcul du coût. Chaque vue porte des données différentes (unité, groupe de marchandises, classe de valorisation, indicateur de prix).", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "MIRO",    label: "Logistics Invoice Verification",  description: "Vérification de facture avec contrôle à 3 voies (PO + GR + facture). Un écart hors tolérance (clés PP, BR…) bloque le paiement — géré ensuite via MRBR.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "OBYC",    label: "Classe de valorisation",          description: "Associée au matériau, elle pilote — avec le type de mouvement — la détermination automatique des comptes GL (clés de transaction BSX, WRX, GBB, PRD) via la transaction OBYC.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" },
  { code: "MATDOC",  label: "Material Document",                description: "En S/4HANA, la table unique MATDOC remplace MKPF/MSEG et élimine une vingtaine de tables ECC pour les mouvements de stock — reporting consolidé et temps réel.", color: "bg-sap-blue/5 dark:bg-sap-blue/10 border-sap-blue/20 dark:border-sap-blue/30 text-sap-blue dark:text-sap-accent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les notions fondamentales du module MM à maîtriser avant d'aborder le paramétrage ou l'examen de certification.</p>
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

/* ─────────────────────────────────────────────────────────────
   Structure d'organisation MM
───────────────────────────────────────────────────────────── */
const OrgStructure = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Structure d'organisation MM</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Avant tout paramétrage, la structure organisationnelle MM détermine qui achète, où le stock est géré,
      et à quel niveau un matériau est valorisé financièrement.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Plant (Usine)", def: "Unité organisationnelle logistique centrale : gestion des stocks, MRP, et dans la grande majorité des cas niveau de valorisation des matériaux." },
        { term: "Storage Location", def: "Emplacement de stockage détaillé à l'intérieur d'un plant (rack, zone, entrepôt logique) — pas de valorisation propre." },
        { term: "Purchasing Organization", def: "Entité qui négocie les conditions d'achat (prix, délais) et à laquelle tous les PO sont rattachés." },
        { term: "Purchasing Group", def: "Acheteur ou équipe responsable d'un portefeuille de matériaux ou de catégories d'achats au quotidien." },
        { term: "Valuation Area", def: "Niveau auquel la valorisation financière est pilotée — en standard aligné sur le plant. Porte aussi le type de Material Ledger, obligatoire en S/4HANA." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
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
   Sous-modules MM
───────────────────────────────────────────────────────────── */
const SUB_MODULES = [
  {
    code: "MM-PUR",
    title: "Purchasing (Achats)",
    color: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40",
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    desc: "Pilote l'ensemble du cycle d'achat : demande (ME51N), appel d'offres fournisseur (ME41 RFQ, comparaison des offres via ME49), commande (ME21N), et accords-cadres — contrat (ME31K) ou accord de livraison planifiée (ME31L). S'appuie sur le fichier fournisseurs (vendor master), les enregistrements d'informations d'achat (ME11, prix et délai négociés par couple matériau-fournisseur) et les conditions de prix.",
  },
  {
    code: "MM-IM",
    title: "Inventory Management (Gestion des stocks)",
    color: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    desc: "Trace chaque entrée, sortie et transfert de stock via des types de mouvement à 3 chiffres (101 réception sur PO, 201 sortie sur centre de coûts, 301 transfert entre plants, 561 reprise de stock initial…), saisis dans la transaction universelle MIGO. Gère aussi les réservations, l'inventaire physique (MI01 à MI07) et la consultation de stock (MMBE, MB52).",
  },
  {
    code: "MM-IV",
    title: "Invoice Verification (Vérification de factures)",
    color: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/40",
    badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    desc: "Appelée aussi Logistics Invoice Verification (LIV). Rapproche la facture fournisseur du PO et du GR (contrôle à 3 voies) via MIRO. Les écarts hors tolérance (clés PP pour le prix, BR pour la quantité en IR-avant-GR, configurées en OMR6) bloquent le paiement ; les factures bloquées se débloquent en MRBR après analyse.",
  },
  {
    code: "MM-VAL",
    title: "Material Valuation (Valorisation)",
    color: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40",
    badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    desc: "Détermine comment un matériau est valorisé en stock — prix standard (S) ou prix moyen pondéré (V) — et quels comptes GL sont impactés via la classe de valorisation (OBYC). En S/4HANA, le Material Ledger est obligatoire pour tout matériau valorisé, même sans activer le costing réel.",
  },
  {
    code: "Source List",
    title: "Source List & Release Strategy",
    color: "bg-sky-50 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800/40",
    badge: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400",
    desc: "La liste des sources (ME01) fixe, pour un couple matériau-plant, les fournisseurs autorisés, bloqués ou préférés sur une période — pertinente pour le MRP. La stratégie de libération (release strategy) impose une chaîne d'approbation hiérarchique avant qu'une PR (ME54N) ou un PO (ME29N) ne devienne exploitable, selon des seuils de montant.",
  },
];

const SubModules = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.07 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Les sous-modules de SAP MM</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      MM se découpe en cinq composants fonctionnels. En S/4HANA, ils sont regroupés sous le terme
      « Sourcing and Procurement », mais ces briques restent les repères de tout consultant ou acheteur.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {SUB_MODULES.map((m) => (
        <div key={m.code} className={`rounded-xl border p-4 ${m.color}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${m.badge}`}>{m.code}</span>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{m.title}</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{m.desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Cycle Procure-to-Pay
───────────────────────────────────────────────────────────── */
const P2PCycle = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cycle Procure-to-Pay — étape par étape</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Du besoin interne au paiement fournisseur, avec les T-codes réels et les impacts FI à chaque étape.</p>
    <div className="mb-5">
      <FlowDiagram
        title="Flux Procure-to-Pay en MM"
        steps={[
          { label: "Demande d'achat", sublabel: "ME51N" },
          { label: "Libération PR", sublabel: "ME54N" },
          { label: "Commande", sublabel: "ME21N" },
          { label: "Réception", sublabel: "MIGO · 101" },
          { label: "Facture", sublabel: "MIRO" },
          { label: "Paiement", sublabel: "F110" },
        ]}
      />
    </div>
    <div className="space-y-3">
      {[
        { step: "1", code: "ME51N", label: "Purchase Requisition (PR)", desc: "Demande interne de matériel ou service : quantité, date de besoin, centre de coûts ou commande client en imputation. Création manuelle ou automatique via le MRP (PP). Aucune écriture FI à ce stade." },
        { step: "2", code: "ME54N", label: "Release Strategy (si configurée)", desc: "Si le montant ou la catégorie d'imputation déclenche une stratégie de libération, la PR reste bloquée tant qu'elle n'est pas approuvée par le ou les niveaux hiérarchiques requis." },
        { step: "3", code: "ME21N", label: "Purchase Order (PO)", desc: "Document externe envoyé au fournisseur avec prix, quantités et conditions — converti depuis la PR ou créé directement. Crée un engagement budgétaire visible dans le reporting d'achat." },
        { step: "4", code: "MIGO",  label: "Goods Receipt (GR)", desc: "Réception physique, mouvement 101 avec référence PO : mise à jour du stock + écriture FI automatique (débit stock / crédit compte GR/IR)." },
        { step: "5", code: "MIRO",  label: "Invoice Receipt", desc: "Contrôle à 3 voies PO–GR–Facture. Si l'écart dépasse les tolérances (clé PP sur le prix, BR sur la quantité), la facture est postée mais bloquée pour paiement — à débloquer en MRBR. Écriture FI : débit GR/IR / crédit fournisseur." },
        { step: "6", code: "F110",  label: "Payment", desc: "Traitement du paiement fournisseur (FI-AP), seulement pour les factures non bloquées. Écriture FI : débit fournisseur / crédit banque. Clôture du cycle P2P." },
      ].map(({ step, code, label, desc }) => (
        <div key={step} className="flex gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/5 border border-amber-100 dark:border-amber-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center">{step}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{code}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Procurement spécial
───────────────────────────────────────────────────────────── */
const SPECIAL_PROCUREMENT = [
  { title: "Consignation", code: "Stock K", desc: "Le matériau est stocké chez le client mais reste la propriété du fournisseur jusqu'à sa consommation (mouvement 101, stock spécial K). Le règlement avec le fournisseur se fait par période via MRKO, sur les seules quantités réellement consommées." },
  { title: "Sous-traitance", code: "Item L", desc: "Le fournisseur reçoit des composants (catégorie d'imputation L, déterminés via la nomenclature) et renvoie le produit fini, réceptionné par GR. Le PO porte à la fois le produit fini commandé et les composants fournis." },
  { title: "Transfert de stock (STO)", code: "Doc. UB", desc: "Un plant commande en interne à un autre plant via un ordre de transfert de stock (document UB, ME21N). Livraison et réception se font en MIGO, en une ou deux étapes selon le flux logistique retenu." },
  { title: "Procurement tiers (Third-Party)", code: "Item S", desc: "La commande client déclenche un achat direct chez un fournisseur qui livre le client final — le PO ne transite jamais physiquement par l'entreprise. Utilisé pour le dropshipping ou les produits non stockés." },
];

const SpecialProcurement = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Procurement spécial</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Au-delà du PO standard, MM couvre des scénarios où la marchandise ne circule pas de façon classique
      fournisseur → entreprise → client. Quatre cas reviennent systématiquement dans les projets industriels.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {SPECIAL_PROCUREMENT.map((sp) => (
        <div key={sp.title} className="rounded-xl border border-gray-100 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-700/50">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">{sp.code}</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{sp.title}</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{sp.desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Valorisation des matériaux
───────────────────────────────────────────────────────────── */
const MaterialValuation = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Valorisation des matériaux</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Chaque matériau porte un mode de valorisation défini dans la vue Comptabilité 1 du Material Master.
      C'est ce qui détermine la valeur du stock au bilan — et donc la justesse des comptes GL.
    </p>
    <div className="grid sm:grid-cols-2 gap-4 mb-5">
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/10 p-4">
        <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">Prix standard (indicateur S)</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Valeur fixe, mise à jour en général via une estimation de coût standard. Les écarts entre prix d'achat réel
          et prix standard sont isolés sur un compte d'écart de prix (clé PRD) — la valeur du stock ne bouge pas.
          Utilisé typiquement pour les produits finis et semi-finis.
        </p>
      </div>
      <div className="rounded-xl border border-purple-200 dark:border-purple-800/40 bg-purple-50 dark:bg-purple-900/10 p-4">
        <p className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">Prix moyen pondéré (indicateur V)</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Recalculé automatiquement à chaque réception ou facture : valeur totale du stock divisée par la quantité totale.
          Absorbe les écarts de prix fournisseur directement dans la valeur du stock. Recommandé pour les matières
          premières dont le prix fluctue.
        </p>
      </div>
    </div>
    <div className="space-y-3">
      {[
        { title: "Classe de valorisation et OBYC", desc: "La classe de valorisation, combinée au type de mouvement, détermine les comptes GL via les clés de transaction (BSX pour le compte de stock, WRX pour le GR/IR, GBB pour la consommation, PRD pour l'écart de prix), paramétrées en transaction OBYC." },
        { title: "Material Ledger obligatoire en S/4HANA", desc: "L'activation du Material Ledger (types définis en OMX2, affectés aux zones de valorisation en OMX3, activés en OMX1) est obligatoire depuis S/4HANA — il remplace les anciennes tables de valorisation ECC et s'intègre à l'Universal Journal (ACDOCA). Le costing réel (actual costing), lui, reste optionnel." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Blocages de facture
───────────────────────────────────────────────────────────── */
const TOLERANCE_KEYS = [
  { key: "PP", label: "Écart de prix", rule: "Écart entre prix facturé et prix PO. Blocage si la limite supérieure est dépassée (défaut usuel 5 %) ; la limite inférieure ne déclenche qu'un avertissement." },
  { key: "BR", label: "Écart quantité (IR avant GR)", rule: "S'applique quand la facture arrive avant la réception physique. Tolérance en pourcentage, haute et basse (défaut usuel 5 %)." },
  { key: "DQ", label: "Écart de quantité", rule: "Écart entre quantité facturée et quantité réceptionnée. Tolérance nulle par défaut — tout écart bloque la facture." },
  { key: "VP", label: "Écart sur prix moyen pondéré", rule: "Vérifie l'impact de la facture sur le prix moyen pondéré du matériau. Pas de contrôle en standard dans la plupart des configurations." },
];

const InvoiceBlocking = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Tolérances et blocage de factures</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Le contrôle à 3 voies ne suffit pas toujours : des clés de tolérance, configurées par société en OMR6,
      décident si un écart déclenche un simple avertissement ou un vrai blocage de paiement.
    </p>
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
            <th className="py-2 pr-4 font-semibold">Clé</th>
            <th className="py-2 pr-4 font-semibold">Contrôle</th>
            <th className="py-2 font-semibold">Comportement</th>
          </tr>
        </thead>
        <tbody>
          {TOLERANCE_KEYS.map((t) => (
            <tr key={t.key} className="border-b border-gray-50 dark:border-slate-700/50">
              <td className="py-2 pr-4 font-mono font-bold text-purple-600 dark:text-purple-400">{t.key}</td>
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{t.label}</td>
              <td className="py-2 text-slate-500 dark:text-slate-400">{t.rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
      Une facture bloquée est tout de même postée en MM et en FI, mais le poste fournisseur porte un indicateur
      de blocage qui empêche son inclusion dans la prochaine proposition de paiement F110. Le déblocage, après
      vérification, se fait via la transaction <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">MRBR</span>.
    </p>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Intégration MM
───────────────────────────────────────────────────────────── */
const Integration = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration MM avec FI, PP et SD</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">MM n'est jamais un module isolé : chaque mouvement logistique a un impact comptable ou de planification en aval.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { pair: "MM – FI", desc: "Chaque GR et chaque MIRO génère une écriture FI automatique via la classe de valorisation (OBYC) : stock, GR/IR, fournisseur, écart de prix.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400" },
        { pair: "MM – PP", desc: "Le MRP (PP) génère automatiquement des PR pour les matières premières manquantes. En sous-traitance, la consommation des composants est pilotée par la nomenclature.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400" },
        { pair: "MM – SD", desc: "La vérification de disponibilité (ATP) sur une commande client consulte le stock MM en temps réel. En procurement tiers, la commande client déclenche directement un PO.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400" },
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
   MM dans S/4HANA
───────────────────────────────────────────────────────────── */
const S4HANAFeatures = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">MM dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Ce que le passage à S/4HANA change concrètement pour les achats et la gestion des stocks.</p>
    <div className="space-y-3">
      {[
        { title: "Table MATDOC unifiée", desc: "MKPF (en-tête) et MSEG (lignes) deviennent des vues de compatibilité : les mouvements de stock sont écrits dans MATDOC, ce qui élimine une vingtaine de tables ECC et simplifie le reporting en temps réel." },
        { title: "Material Ledger obligatoire", desc: "Impossible de désactiver le Material Ledger en S/4HANA — il porte désormais la valorisation du stock et s'intègre à l'Universal Journal. Le costing réel reste, lui, un choix métier." },
        { title: "Fiori apps pour acheteurs", desc: "Manage Purchase Orders, Monitor Purchase Order Items, My Purchasing Document Items — gestion des PR, approbation de PO, suivi fournisseurs sans SAP GUI." },
        { title: "Visibilité temps réel", desc: "Vue consolidée sur stocks, engagements budgétaires, compte GR/IR et dettes fournisseurs — sans attendre les batchs de reporting nocturnes de l'ECC." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40">
          <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Débouchés métier
───────────────────────────────────────────────────────────── */
const CareerBenefits = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
    className="bg-linear-to-br from-amber-900 to-amber-700 rounded-2xl p-6 text-white">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser MM ?</h2>
    <p className="text-sm text-white/70 mb-5">MM est présent dans chaque projet S/4HANA industriel ou de distribution — le P2P est l'un des processus les plus déployés en consulting.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP MM", desc: "Pilote le paramétrage P2P, la gestion des stocks, la valorisation et l'intégration FI-MM dans les projets S/4HANA." },
        { title: "Responsable achats SAP", desc: "Côté client — optimise les processus P2P, les workflows d'approbation et les conditions négociées avec les fournisseurs." },
        { title: "Consultant SD/MM", desc: "Profil intégrateur très demandé : maîtrise les deux cycles P2P et O2C pour les projets Supply Chain complets." },
        { title: "Expert Supply Chain S/4HANA", desc: "Pilote les projets d'optimisation de la chaîne d'approvisionnement en intégrant MM, PP et SD." },
      ].map(({ title, desc }) => (
        <div key={title} className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-sm font-semibold mb-1">{title}</p>
          <p className="text-xs text-white/70 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   T-codes essentiels
───────────────────────────────────────────────────────────── */
const TCODES = [
  { code: "ME51N", label: "Créer PR", usage: "Saisir une demande d'achat : matériau, quantité, date de besoin, imputation (centre de coûts, ordre, commande client)." },
  { code: "ME21N", label: "Créer PO", usage: "Convertir une PR libérée en commande fournisseur, ou créer un PO directement avec prix et conditions négociées." },
  { code: "MIGO", label: "Mouvement de marchandises", usage: "Transaction universelle de réception, sortie, transfert et annulation de stock — tous les types de mouvement y transitent." },
  { code: "MIRO", label: "Vérification de facture", usage: "Saisir la facture fournisseur et déclencher le contrôle à 3 voies PO–GR–Facture." },
  { code: "MRBR", label: "Déblocage de facture", usage: "Analyser et libérer pour paiement les factures bloquées par une clé de tolérance dépassée." },
  { code: "ME01", label: "Liste des sources", usage: "Définir, pour un matériau et un plant, les fournisseurs autorisés, préférés ou bloqués sur une période." },
  { code: "ME11", label: "Enregistrement d'info d'achat", usage: "Rattacher à un couple matériau-fournisseur le prix, le délai de livraison et le numéro d'article côté fournisseur." },
  { code: "MMBE", label: "Vue d'ensemble du stock", usage: "Consulter en un écran le stock utilisable, bloqué et en transit d'un matériau, par plant et magasin." },
].map((t) => t);

const MmTcodes = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">T-codes MM essentiels</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les transactions SAP GUI à connaître pour un consultant, un acheteur ou un gestionnaire de stocks junior.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {TCODES.map((t) => (
        <div key={t.code} className="border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 bg-amber-50/60 dark:bg-amber-900/10">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">{t.code} — {t.label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{t.usage}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   FAQ accordion
───────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: "Quelle est la différence entre PR et PO en SAP MM ?", a: "La Purchase Requisition (PR, ME51N) est un document interne : un service ou le MRP signale un besoin. La Purchase Order (PO, ME21N) est le document externe envoyé au fournisseur après conversion de la PR — automatique ou manuelle, parfois après une étape de libération (release strategy)." },
  { q: "Pourquoi le compte GR/IR est-il si important dans MM ?", a: "C'est un compte d'attente qui fait le pont entre la réception physique (GR) et la facture fournisseur (MIRO). Il garantit que la comptabilité reflète fidèlement ce qui a été reçu mais pas encore facturé, et inversement — un déséquilibre durable sur ce compte est un signal classique de process cassé en P2P." },
  { q: "Qu'est-ce que le contrôle à 3 voies dans MIRO, et quand bloque-t-il la facture ?", a: "Le contrôle compare la PO (prix et quantité négociés), le GR (ce qui a été physiquement reçu) et la facture fournisseur. Si l'écart dépasse les tolérances configurées (clé PP pour le prix, BR pour la quantité en IR avant GR), la facture est postée mais bloquée pour paiement — à débloquer en MRBR après vérification." },
  { q: "Quelle différence entre prix standard et prix moyen pondéré ?", a: "Le prix standard (S) est fixe : les écarts entre prix d'achat et prix standard partent sur un compte d'écart de prix, la valeur du stock ne bouge pas. Le prix moyen pondéré (V) se recalcule à chaque mouvement — il absorbe directement les variations de prix fournisseur dans la valeur du stock. Le premier convient aux produits finis, le second aux matières premières." },
  { q: "Pourquoi le Material Ledger est-il obligatoire en S/4HANA ?", a: "Depuis S/4HANA, le Material Ledger remplace les anciennes tables de valorisation ECC et s'intègre à l'Universal Journal (ACDOCA) — son activation (OMX1/OMX2/OMX3) n'est donc plus un choix. En revanche, activer le costing réel (actual costing) par-dessus reste optionnel et dépend du besoin métier." },
  { q: "SAP MM peut-il fonctionner sans FI ?", a: "Techniquement non — dès qu'un mouvement de stock a une valorisation financière (GR, facture), des écritures FI sont générées automatiquement via la classe de valorisation et OBYC. Paramétrer correctement cette intégration FI-MM est une étape clé et souvent sous-estimée de tout projet MM." },
  { q: "Qu'est-ce que le Source List et à quoi sert la stratégie de libération ?", a: "La liste des sources (ME01) définit, pour un matériau et un plant, quels fournisseurs sont autorisés, préférés ou bloqués sur une période — elle peut rendre une PR impossible à convertir en PO sans source valide. La stratégie de libération, elle, impose une chaîne d'approbation (souvent par seuil de montant) avant que la PR ou le PO ne devienne exploitable." },
  { q: "En quoi S/4HANA change-t-il concrètement les processus MM ?", a: "La table MATDOC unifie les mouvements de stock et élimine une vingtaine de tables ECC, ce qui simplifie le reporting. Le Material Ledger devient obligatoire. Les Fiori apps remplacent progressivement le SAP GUI pour les acheteurs. Résultat : une visibilité temps réel sur stocks et engagements qui aide à mieux piloter achats et trésorerie." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP MM.</p>
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

/* ─────────────────────────────────────────────────────────────
   Ressources
───────────────────────────────────────────────────────────── */
const RESOURCES = [
  { title: "Purchase Process in SAP S/4HANA — P2P Cycle complet", href: "https://www.gauravconsulting.com/post/sapmmp2pcycle", source: "Gaurav Consulting" },
  { title: "FI-MM Integration with P2P Cycle in SAP S/4HANA", href: "https://sap96.com/fi-mm-integration-with-p2p-cycle-in-sap-s4-hana/", source: "SAP96" },
  { title: "What is Procure-to-Pay? — SAP Officiel", href: "https://www.sap.com/products/spend-management/procure-to-pay/what-is-procure-to-pay.html", source: "SAP.com" },
  { title: "Valuation with the Moving Average Price", href: "https://help.sap.com/docs/SAP_ERP_SPV/56f7319a9048445eb86221af73cab72b/bef1d353ca9f4408e10000000a174cb4.html", source: "SAP Help Portal" },
  { title: "Material Ledger is mandatory in SAP S/4HANA", href: "https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/material-ledger-is-mandatory-in-sap-s-4hana-what-do-you-need-to-know/ba-p/13398678", source: "SAP Community" },
  { title: "Managing Special Stocks (MM-IM)", href: "https://help.sap.com/docs/SAP_ERP/b704a8db767040a08100adc846218964/00e8b853dcfcb44ce10000000a174cb4.html", source: "SAP Help Portal" },
];

const MmResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Contenus à jour pour approfondir MM, le cycle P2P et la valorisation des stocks.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-amber-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug">{r.title}</span>
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
    className="rounded-2xl border border-amber-300/40 dark:border-amber-700/40 bg-amber-50/50 dark:bg-amber-900/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">Étape suivante du parcours</p>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">MM acquis ? Passe à PP pour voir comment le MRP déclenche les achats.</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Les PR générées automatiquement, les besoins en composants de sous-traitance et les transferts de stock
        trouvent leur origine côté planification de production — comprendre PP boucle la chaîne.
      </p>
    </div>
    <div className="flex gap-3 flex-shrink-0">
      <Link href="/certifications/mm/examen" className="btn-outline px-4 py-2.5 text-sm whitespace-nowrap">Examen blanc MM</Link>
      <Link href="/modules-sap/pp" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">Module PP →</Link>
    </div>
  </motion.section>
);

export default function MM() {
  return (
    <ModuleLayout
      code="MM"
      title="Materials Management"
      description="Maîtrisez le cycle Procure-to-Pay SAP : achats, réception des marchandises, vérification de factures, valorisation des stocks et intégration FI-MM sur S/4HANA."
      gradient="from-amber-900 via-amber-600 to-amber-400"
      badge="Achats · Stocks · P2P"
      stats={["8 concepts clés", "5 sous-modules", "~30 min de lecture", `Certification ${certCode("mm")}`]}
      examHref="/certifications/mm/examen"
    >
      <KeyConcepts />
      <OrgStructure />
      <SubModules />
      <P2PCycle />
      <SpecialProcurement />
      <MaterialValuation />
      <InvoiceBlocking />
      <Integration />
      <S4HANAFeatures />
      <CareerBenefits />
      <MmTcodes />
      <MmResources />
      <FaqAccordion />
      <NextStep />
    </ModuleLayout>
  );
}
