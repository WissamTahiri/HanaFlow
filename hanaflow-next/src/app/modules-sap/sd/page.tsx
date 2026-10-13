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
  { code: "O2C",      label: "Order-to-Cash",            description: "De la commande client à l'encaissement : Sales Order → Livraison → PGI → Billing → Payment. Chaque étape pivot déclenche une écriture FI miroir, exactement comme MM le fait côté achats pour le P2P.", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400" },
  { code: "VA01",     label: "Sales Order",               description: "Commande client avec prix, quantités, conditions de paiement et taxes. Déclenche la vérification de disponibilité (ATP) et le calcul du prix, mais aucune écriture FI à ce stade.", color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400" },
  { code: "PGI",      label: "Post Goods Issue",          description: "Sortie physique de stock lors de la livraison (VL02N). Transfert de propriété au client et écriture FI automatique : crédit stock / débit COGS (coût des marchandises vendues).", color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/50 text-pink-700 dark:text-pink-400" },
  { code: "VF01",     label: "Billing",                   description: "Facturation client (VF01). Crée le document FI AR correspondant : débit compte client / crédit revenus et TVA. Clé de voûte de l'intégration SD-FI, pilotée par la détermination de comptes (VKOA).", color: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400" },
  { code: "PRICING",  label: "Condition technique",       description: "Moteur de tarification SD : pricing procedure, condition types, access sequence et condition tables s'enchaînent pour déterminer prix, remises, frais de port et taxes ligne par ligne.", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400" },
  { code: "aATP",     label: "Advanced ATP",              description: "En S/4HANA, l'Available-to-Promise classique est enrichi par l'aATP : allocation produit, backorder processing basé sur des règles et substitution automatique de plant ou de matériau — embarqué nativement, sans système APO séparé.", color: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/50 text-cyan-700 dark:text-cyan-400" },
  { code: "UKM_BP",   label: "Credit Management (FSCM)",  description: "Depuis S/4HANA 1511, la Credit Management classique (FD32, tables KNKK/KNKA) est obsolète, remplacée par SAP Credit Management (FSCM), paramétrée via UKM_BP sur le rôle partenaire UKM000.", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400" },
  { code: "RAR",      label: "Revenue Accounting",        description: "Reconnaissance de revenus avancée selon IFRS 15 / ASC 606. Intégrée à SD et FI pour les contrats complexes ou multi-éléments (abonnements, projets, bundles logiciels).", color: "bg-sap-blue/5 dark:bg-sap-blue/10 border-sap-blue/20 dark:border-sap-blue/30 text-sap-blue dark:text-sap-accent" },
];

const KeyConcepts = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Concepts clés</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les notions fondamentales du module SD à maîtriser avant d'aborder le paramétrage ou l'examen de certification.</p>
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
   Structure d'organisation SD
───────────────────────────────────────────────────────────── */
const OrgStructure = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Structure d'organisation SD</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Avant tout paramétrage, la structure organisationnelle SD détermine qui vend, sur quel marché,
      et comment le revenu se rattache aux entités légales FI.
    </p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { term: "Sales Organization", def: "Unité principale de ventes, souvent alignée sur un pays ou une business unit. Rattachée à un Company Code FI — c'est elle qui porte la responsabilité du chiffre d'affaires." },
        { term: "Distribution Channel", def: "Canal de vente : vente directe, retail, e-commerce, revendeurs… Détermine les conditions tarifaires et les documents de vente applicables." },
        { term: "Division", def: "Ligne de produits ou famille d'activité. Permet de segmenter le reporting commercial par gamme ou marque." },
        { term: "Sales Area", def: "Combinaison Sales Org + Distribution Channel + Division — c'est le niveau auquel sont rattachés les clients, les conditions commerciales et la tarification." },
        { term: "Shipping Point", def: "Point de départ physique de la livraison (quai, entrepôt). Déterminé automatiquement selon le plant, le groupe de chargement du matériau et la condition de transport." },
        { term: "Sales Office / Sales Group", def: "Découpage commercial interne (agence, équipe de vente) utilisé pour le reporting et l'affectation des commerciaux, sans impact sur la comptabilité." },
      ].map(({ term, def }) => (
        <div key={term} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
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
   Sous-modules SD
───────────────────────────────────────────────────────────── */
const SUB_MODULES = [
  {
    code: "SD-SLS",
    title: "Sales (Ventes)",
    color: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/40",
    badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    desc: "Gère les documents de vente (demande de prix VA11, devis VA21, commande VA01, contrat-cadre VA41, accord de livraison planifiée) ainsi que les données maître client (XD01/BP) et matériau côté ventes. C'est le point d'entrée du cycle O2C : chaque document porte un type (OR pour commande standard, par exemple) qui pilote le schéma de copie vers les documents suivants.",
  },
  {
    code: "SD-SHP",
    title: "Shipping (Expédition)",
    color: "bg-sky-50 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800/40",
    badge: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400",
    desc: "Transforme la commande confirmée en livraison (VL01N), pilote le picking et le packing en entrepôt, puis déclenche le Post Goods Issue (VL02N). Le point d'expédition (shipping point) et la route sont déterminés automatiquement selon le plant, le groupe de chargement et la zone de transport du client.",
  },
  {
    code: "SD-BIL",
    title: "Billing (Facturation)",
    color: "bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/40",
    badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
    desc: "Crée la facture client (VF01) à partir de la livraison ou directement de la commande selon le type de facturation. Gère aussi les notes de crédit/débit (CR/DR), la facturation collective (plusieurs livraisons en une facture) et la facturation périodique pour les contrats. Chaque facture génère le document FI comptable via la détermination de comptes VKOA.",
  },
  {
    code: "SD-BF-PR",
    title: "Pricing & Conditions",
    color: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    desc: "Moteur de tarification basé sur la condition technique : condition types (prix, remise, surcharge, taxe), access sequence (ordre de recherche d'un enregistrement) et pricing procedure (schéma de calcul assigné à la combinaison client/document). Les prix et remises se maintiennent en VK11 (création), VK12 (modification) et VK13 (consultation).",
  },
  {
    code: "SD-BF-CM",
    title: "Credit & Risk Management",
    color: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40",
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    desc: "Contrôle le risque client à des points clés du cycle : création de commande, création de livraison, PGI. En S/4HANA, la Credit Management classique (FD32) est obsolète depuis la release 1511 — remplacée par SAP Credit Management (FSCM), configurée via UKM_BP sur le business partner, avec profil de crédit et segment de crédit distincts.",
  },
  {
    code: "ATP",
    title: "Availability Check (ATP / aATP)",
    color: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40",
    badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    desc: "Vérifie que le stock disponible (physique + réceptions planifiées − réservations) couvre la quantité demandée à la date souhaitée, via un backward puis forward scheduling. En S/4HANA, l'Advanced ATP (aATP, licence additionnelle) ajoute l'allocation produit, le backorder processing par règles et la substitution automatique de plant ou matériau.",
  },
];

const SubModules = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.07 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Les sous-modules de SAP SD</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      SD se découpe en six composants fonctionnels qui se succèdent — ou s'exécutent en arrière-plan —
      tout au long du cycle Order-to-Cash. Ce sont les repères de tout consultant ou gestionnaire ventes.
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
   Cycle O2C
───────────────────────────────────────────────────────────── */
const O2CCycle = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Cycle Order-to-Cash — étape par étape</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Du devis au paiement client, avec les T-codes réels et les impacts FI à chaque étape.</p>
    <div className="mb-5">
      <FlowDiagram
        title="Flux Order-to-Cash en SD"
        steps={[
          { label: "Devis", sublabel: "VA21" },
          { label: "Commande", sublabel: "VA01" },
          { label: "Livraison", sublabel: "VL01N" },
          { label: "Sortie stock", sublabel: "VL02N · PGI" },
          { label: "Facture", sublabel: "VF01" },
          { label: "Paiement", sublabel: "F-28" },
        ]}
      />
    </div>
    <div className="space-y-3">
      {[
        { step: "1", code: "VA21", label: "Inquiry / Quotation (optionnel)", desc: "Demande de prix ou devis client, avec une durée de validité. Document SD sans écriture FI, qui peut être converti en commande via la fonction de copie." },
        { step: "2", code: "VA01", label: "Sales Order", desc: "Commande client avec prix calculé par la pricing procedure, quantités, taxes et conditions de paiement. Vérification ATP automatique à la validation de chaque ligne." },
        { step: "3", code: "VL01N", label: "Delivery", desc: "Création du bon de livraison à partir de la commande confirmée. Déclenche le picking en entrepôt et, si géré, la gestion des entrepôts (WM/EWM)." },
        { step: "4", code: "VL02N", label: "Post Goods Issue (PGI)", desc: "Sortie physique de stock → écriture FI automatique : crédit stock / débit COGS. Transfert de propriété au client — étape pivot qui conditionne la facturation." },
        { step: "5", code: "VF01", label: "Billing", desc: "Facturation client, à partir de la livraison (standard) ou de la commande (facturation directe). Crée le document FI AR : débit compte client / crédit revenus et TVA." },
        { step: "6", code: "F-28", label: "Payment", desc: "Encaissement client (FI-AR). Écriture FI : débit banque / crédit client, avec lettrage automatique ou manuel du poste ouvert correspondant." },
      ].map(({ step, code, label, desc }) => (
        <div key={step} className="flex gap-4 p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/5 border border-purple-100 dark:border-purple-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center">{step}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{code}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
      Dans la pratique, une commande standard de type <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">OR</span> suit ce chemin complet.
      D'autres scénarios raccourcissent le cycle : la <span className="font-semibold">facturation directe</span> saute l'étape livraison (services, licences logicielles),
      et le <span className="font-semibold">cash sale</span> (type BV) facture et encaisse au moment même de la commande, typique du commerce de détail.
    </p>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Pricing — condition technique
───────────────────────────────────────────────────────────── */
const PRICING_LAYERS = [
  { title: "Condition Table", tcode: "V/03, V/05", desc: "Définit la combinaison de critères servant de clé pour stocker un prix — par exemple client + matériau, ou canal de distribution + groupe de matériau. Convention de nommage AN NN (ex. A304)." },
  { title: "Access Sequence", tcode: "V/07", desc: "Ordre dans lequel SAP recherche un enregistrement de condition valide pour un type de condition donné — du plus spécifique au plus général, et s'arrête à la première valeur trouvée." },
  { title: "Condition Type", tcode: "V/06", desc: "Un élément de prix unique : prix de base (PR00), remise client (K004, K007), frais de port (KF00), taxe (MWST), coût de revient (VPRS). Chacun porte son propre comportement de calcul (montant fixe, pourcentage, par quantité)." },
  { title: "Pricing Procedure", tcode: "V/08", desc: "Empile les types de condition dans l'ordre où ils doivent être calculés, avec les règles de base de calcul (from/to steps), les sous-totaux et le marquage des conditions statistiques (ex. VPRS, utilisé pour la marge mais pas pour le prix net)." },
  { title: "Condition Records", tcode: "VK11 / VK12 / VK13", desc: "Les valeurs réelles — prix, taux de remise — maintenues en données maître une fois la configuration posée. VK11 crée, VK12 modifie, VK13 consulte." },
];

const PricingProcedure = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Pricing — la condition technique</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Cinq briques s'enchaînent pour déterminer automatiquement le prix d'une ligne de commande. C'est la partie
      la plus riche — et la plus redoutée en certification — du module SD.
    </p>
    <div className="space-y-3 mb-5">
      {PRICING_LAYERS.map((l, i) => (
        <div key={l.title} className="flex gap-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/5 border border-blue-100 dark:border-blue-900/20">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{l.title}</span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{l.tcode}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{l.desc}</p>
          </div>
        </div>
      ))}
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
      Exemple simplifié d'un schéma de calcul pour une ligne de commande à 1 000 € de prix de base, avec 5 % de remise
      client et 20 % de TVA :
    </p>
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-gray-100 dark:border-slate-700">
            <th className="py-2 pr-4 font-semibold">Condition</th>
            <th className="py-2 pr-4 font-semibold">Rôle</th>
            <th className="py-2 pr-4 font-semibold">Base</th>
            <th className="py-2 font-semibold">Montant</th>
          </tr>
        </thead>
        <tbody>
          {[
            { cond: "PR00", role: "Prix brut", base: "—", amount: "1 000,00 €" },
            { cond: "K004", role: "Remise client (5 %)", base: "PR00", amount: "− 50,00 €" },
            { cond: "", role: "Sous-total net", base: "PR00 − K004", amount: "950,00 €" },
            { cond: "MWST", role: "TVA (20 %)", base: "Sous-total net", amount: "+ 190,00 €" },
            { cond: "VPRS", role: "Coût de revient (statistique, pour la marge)", base: "—", amount: "non facturé" },
          ].map((r, i) => (
            <tr key={i} className="border-b border-gray-50 dark:border-slate-700/50">
              <td className="py-2 pr-4 font-mono font-bold text-blue-600 dark:text-blue-400">{r.cond || "—"}</td>
              <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{r.role}</td>
              <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{r.base}</td>
              <td className="py-2 text-slate-700 dark:text-slate-300 font-semibold">{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
      Pour diagnostiquer un prix inattendu, l'outil de référence reste l'analyse de pricing dans la commande
      (Extras → Analyse dans le pricing) : elle montre condition par condition pourquoi une valeur a été trouvée,
      ignorée ou désactivée par le marquage d'exclusivité (requirement/exclusion) du schéma.
    </p>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Credit Management
───────────────────────────────────────────────────────────── */
const CreditManagement = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Credit Management : d'ECC à S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
      Le contrôle du risque client est un point de blocage classique du cycle O2C — et l'un des domaines où
      S/4HANA a le plus rompu avec l'ancien monde ECC.
    </p>
    <div className="grid sm:grid-cols-2 gap-4 mb-5">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 p-4">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Classic Credit Management (ECC)</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Limite de crédit maintenue par zone de contrôle de crédit via FD32, données stockées dans KNKA/KNKK.
          Blocage géré par VKM1 (libération des commandes bloquées). Obsolète depuis S/4HANA on-premise 1511.
        </p>
      </div>
      <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 p-4">
        <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-1">SAP Credit Management (FSCM)</p>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Paramétrage sur le Business Partner, rôle UKM000, via UKM_BP : un profil de crédit (règles, score, classe
          de risque) et un segment de crédit (limite, date de validité). Déblocage des commandes bloquées via VKM4.
        </p>
      </div>
    </div>
    <div className="space-y-3">
      {[
        { title: "Points de contrôle du cycle O2C", desc: "Le contrôle de crédit automatique peut s'activer à la création de la commande, à la création de la livraison et au Post Goods Issue — trois filets de sécurité successifs avant que la marchandise ne quitte réellement l'entreprise." },
        { title: "Intégration cross-système", desc: "Contrairement à la Credit Management classique, purement interne à FI, SAP Credit Management (FSCM) est pensée pour une vue de risque consolidée, y compris lorsque le client est partagé entre plusieurs systèmes SAP." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
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
   Intégration SD-FI / SD-MM
───────────────────────────────────────────────────────────── */
const Integration = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.16 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Intégration SD avec FI et MM</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">SD n'est jamais un module isolé : chaque document logistique a un impact comptable ou un besoin de disponibilité en amont.</p>
    <div className="grid sm:grid-cols-2 gap-4 mb-5">
      {[
        { pair: "SD – FI", desc: "Le PGI et la facturation génèrent chacun une écriture FI automatique via la détermination de comptes (table VKOA, clés d'imputation comme ERL pour les revenus ou ERF pour le coût des ventes).", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400" },
        { pair: "SD – MM", desc: "La vérification de disponibilité (ATP) sur une commande client consulte le stock MM en temps réel. En procurement tiers (third-party, item category TAS), la commande client déclenche directement un PO fournisseur en MM.", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400" },
      ].map(({ pair, desc, color }) => (
        <div key={pair} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-sm font-bold mb-1">{pair}</p>
          <p className="text-xs leading-relaxed opacity-90">{desc}</p>
        </div>
      ))}
    </div>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { event: "Post Goods Issue (PGI)", debit: "COGS (Coût des ventes)", credit: "Compte Stock", color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-400" },
        { event: "Billing (VF01)", debit: "Compte Client (AR)", credit: "Revenus + TVA", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400" },
        { event: "Payment (F-28)", debit: "Compte Banque", credit: "Compte Client (AR)", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400" },
      ].map(({ event, debit, credit, color }) => (
        <div key={event} className={`rounded-xl border p-4 ${color}`}>
          <p className="text-xs font-bold mb-2">{event}</p>
          <p className="text-xs">Débit : <span className="font-semibold">{debit}</span></p>
          <p className="text-xs">Crédit : <span className="font-semibold">{credit}</span></p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   SD dans S/4HANA
───────────────────────────────────────────────────────────── */
const S4HANAFeatures = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">SD dans S/4HANA</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Ce que le passage à S/4HANA change concrètement pour les équipes ventes et service client.</p>
    <div className="space-y-3">
      {[
        { title: "Advanced ATP (aATP)", desc: "Embarquée directement dans S/4HANA (pas de système APO séparé), elle ajoute le backorder processing par règles (segments + stratégies Win/Gain/Redistribute/Fill/Lose), l'allocation produit et la substitution automatique de plant ou matériau. Fonctionnalité sous licence additionnelle." },
        { title: "SAP Credit Management (FSCM)", desc: "Remplace la Credit Management classique côté FI-AR : profil et segment de crédit sur le Business Partner (UKM_BP), déblocage via VKM4, avec une vue de risque pensée pour fonctionner à travers plusieurs systèmes." },
        { title: "Fiori apps pour les ventes", desc: "Manage Sales Orders, Monitor Sales Orders — Items at Risk, Create Billing Documents : gestion des commandes, suivi des litiges de livraison et facturation sans SAP GUI, avec des KPIs O2C en temps réel pour les responsables ventes." },
        { title: "Vision temps réel O2C", desc: "Analytics sur commandes en cours, livraisons en retard, factures impayées et marges par produit ou client — directement sur l'Universal Journal (ACDOCA), sans extraction BW ni batch nocturne." },
        { title: "Revenue Accounting & Reporting (RAR)", desc: "Gestion de la reconnaissance de revenus selon IFRS 15 / ASC 606 pour les contrats complexes (abonnements, projets multi-éléments, bundles matériel + service)." },
      ].map(({ title, desc }) => (
        <div key={title} className="flex gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/40">
          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
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
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-linear-to-br from-purple-900 to-violet-700 rounded-2xl p-6 text-white">
    <h2 className="text-xl font-bold mb-1">Pourquoi maîtriser SD ?</h2>
    <p className="text-sm text-white/70 mb-5">SD est le module clé pour toutes les entreprises B2B ou B2C. La maîtrise de l'O2C et du pricing est un prérequis pour de nombreux projets S/4HANA.</p>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { title: "Consultant SAP SD", desc: "Pilote le paramétrage O2C, la tarification, les conditions de vente et l'intégration FI-SD dans les projets S/4HANA." },
        { title: "Analyste ventes SAP", desc: "Côté client — exploite les analytics SD pour suivre les KPIs commerciaux, les marges et les délais de livraison." },
        { title: "Consultant SD/MM", desc: "Profil intégrateur Supply Chain — maîtrise les deux cycles O2C et P2P pour des missions à fort enjeu." },
        { title: "Expert Revenue Recognition", desc: "Spécialiste RAR pour les secteurs à contrats complexes : software, services, construction, télécom." },
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
  { code: "VA01", label: "Créer commande client", usage: "Saisir une Sales Order : matériau, quantité, prix calculé par la pricing procedure, conditions de paiement." },
  { code: "VA02 / VA03", label: "Modifier / afficher commande", usage: "Consulter ou ajuster une commande existante — statut global, dates confirmées, conditions de prix ligne par ligne." },
  { code: "VL01N", label: "Créer livraison", usage: "Convertir une commande confirmée en bon de livraison, déclencher le picking et préparer le Post Goods Issue." },
  { code: "VL02N", label: "Modifier livraison / PGI", usage: "Finaliser le picking et poster le Post Goods Issue, qui génère l'écriture FI stock / COGS." },
  { code: "VF01", label: "Créer facture", usage: "Facturer une ou plusieurs livraisons, ou directement une commande selon le type de document." },
  { code: "VK11 / VK12 / VK13", label: "Gérer les conditions de prix", usage: "Créer, modifier ou consulter les enregistrements de condition (prix, remises) utilisés par la pricing procedure." },
  { code: "VKM4", label: "Déblocage crédit (FSCM)", usage: "Analyser et libérer les commandes bloquées par le contrôle de crédit SAP Credit Management." },
  { code: "CO09", label: "Vérification disponibilité", usage: "Consulter la situation ATP d'un matériau sur un plant donné : stock, réceptions planifiées, réservations." },
].map((t) => t);

const SdTcodes = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">T-codes SD essentiels</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les transactions SAP GUI à connaître pour un consultant, un gestionnaire ventes ou un service client junior.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {TCODES.map((t) => (
        <div key={t.code} className="border border-purple-200 dark:border-purple-800/40 rounded-xl p-4 bg-purple-50/60 dark:bg-purple-900/10">
          <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-1">{t.code} — {t.label}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{t.usage}</p>
        </div>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: "Quelle est la différence entre SD et MM dans SAP ?", a: "SD gère les ventes (côté client) : commande, livraison, facturation. MM gère les achats (côté fournisseur) : commande d'achat, réception, facturation. Ensemble, ils couvrent la supply chain : MM pour le P2P, SD pour l'O2C — et se croisent sur l'ATP et le procurement tiers." },
  { q: "Pourquoi le PGI (Post Goods Issue) est-il important en SD ?", a: "Le PGI est le moment du transfert de propriété au client. C'est lui qui réduit le stock physique et génère l'écriture COGS en FI. Sans PGI, pas de facturation standard possible — c'est un événement pivot du cycle O2C." },
  { q: "Comment fonctionne la détermination de comptes SD-FI ?", a: "SAP utilise des clés d'imputation (ERL pour revenus, ERF pour COGS, ERS pour taxes…) pour mapper automatiquement les lignes de la facture SD vers les comptes GL FI corrects. C'est configuré dans la table VKOA et les procédures de condition." },
  { q: "Qu'est-ce que l'ATP en SAP SD ?", a: "L'Available-to-Promise (ATP) est la vérification de disponibilité du stock lors de la création du Sales Order : SAP vérifie si le stock disponible, les réceptions planifiées et les réservations existantes peuvent couvrir la demande à la date souhaitée. En S/4HANA, l'aATP ajoute allocation produit, backorder processing et substitution automatique." },
  { q: "Comment fonctionne la condition technique en pricing SD ?", a: "Cinq briques s'enchaînent : la pricing procedure empile des condition types (prix, remise, taxe…), chacun cherchant une valeur via son access sequence dans les condition tables, où sont stockés les condition records (VK11). SAP parcourt l'access sequence du plus spécifique au plus général et s'arrête à la première valeur trouvée." },
  { q: "Pourquoi la Credit Management classique (FD32) est-elle obsolète en S/4HANA ?", a: "Depuis la release on-premise 1511, SAP a remplacé la Credit Management classique par SAP Credit Management (FSCM), paramétrée sur le Business Partner via UKM_BP. FD32 et les tables KNKA/KNKK ne sont plus utilisables — le nouveau modèle sépare profil de crédit et segment de crédit, et vise une vue de risque cross-système." },
  { q: "SAP SD est-il difficile à apprendre en partant de zéro ?", a: "SD est conceptuellement accessible car le cycle O2C est intuitif (commande → livraison → facture → paiement). La complexité vient du pricing (condition technique) et de la détermination de comptes FI. Commencer par le cycle O2C basique avant d'aborder le pricing avancé et l'aATP est la bonne approche." },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Questions fréquentes</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Les doutes les plus courants sur SAP SD.</p>
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
  { title: "SAP Order to Cash Process – SD", href: "https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-members/sap-order-to-cash-process-sd/ba-p/13551270", source: "SAP Community" },
  { title: "SAP SD–FI Integration and Account Determination", href: "https://www.saplogisticsexpert.com/sap-sd-fi-integration-and-account-determination/", source: "SAP Logistics Expert" },
  { title: "Advanced Available-to-Promise (aATP)", href: "https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/f132c385e0234fe68ae9ff35b2da178c/a004ec57a7b5bc12e10000000a4450e5.html", source: "SAP Help Portal" },
  { title: "SAP S/4HANA RAR Integration with SD and FI", href: "https://ageistechnova.com/sap-s-4-hana-rar-integration-with-sd-and-fi-modules/", source: "Ageist Technova" },
  { title: "SAP SD Order to Cash (O2C) Cycle — YouTube", href: "https://www.youtube.com/watch?v=0jiWgZpwtzM", source: "YouTube" },
  { title: "SAP Credit Management in SAP S/4HANA", href: "https://www.valantic.com/en/blog/sap-credit-management-in-sap-s4hana-recognize-default-risks-early-on/", source: "Valantic" },
];

const SdResources = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Ressources pour aller plus loin</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Contenus à jour pour approfondir SD, le cycle O2C et le pricing.</p>
    <div className="grid sm:grid-cols-2 gap-3">
      {RESOURCES.map((r) => (
        <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-purple-400/50 hover:shadow-md transition-all group">
          <span className="text-xs text-purple-500 dark:text-purple-400 font-medium">{r.source}</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors leading-snug">{r.title}</span>
        </a>
      ))}
    </div>
  </motion.section>
);

/* ─────────────────────────────────────────────────────────────
   Prochaine étape
───────────────────────────────────────────────────────────── */
const NextStep = () => (
  <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
    className="rounded-2xl border border-purple-300/40 dark:border-purple-700/40 bg-purple-50/50 dark:bg-purple-900/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">Étape suivante du parcours</p>
      <h2 className="text-base font-bold text-slate-900 dark:text-white">SD acquis ? Passe à FI pour voir comment la facture devient une écriture comptable.</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Le PGI et la facturation que tu viens d'étudier déclenchent chacun un document FI — comprendre la
        comptabilité générale et clients boucle la vision bout en bout de l'intégration SD-FI.
      </p>
    </div>
    <div className="flex gap-3 flex-shrink-0">
      <Link href="/certifications/sd/examen" className="btn-outline px-4 py-2.5 text-sm whitespace-nowrap">Examen blanc SD</Link>
      <Link href="/modules-sap/fi" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">Module FI →</Link>
    </div>
  </motion.section>
);

/* ─── Page principale ─── */
export default function SD() {
  return (
    <ModuleLayout
      code="SD"
      title="Sales & Distribution"
      description="Maîtrisez le cycle Order-to-Cash SAP : commande client, livraison, facturation, pricing, credit management et intégration FI-SD sur S/4HANA."
      gradient="from-purple-900 via-violet-700 to-purple-500"
      badge="Ventes · O2C · Facturation"
      stats={["8 concepts clés", "6 sous-modules", "~28 min de lecture", `Certification ${certCode("sd")}`]}
      examHref="/certifications/sd/examen"
    >
      <KeyConcepts />
      <OrgStructure />
      <SubModules />
      <O2CCycle />
      <PricingProcedure />
      <CreditManagement />
      <Integration />
      <S4HANAFeatures />
      <CareerBenefits />
      <SdTcodes />
      <SdResources />
      <FaqAccordion />
      <NextStep />
    </ModuleLayout>
  );
}
