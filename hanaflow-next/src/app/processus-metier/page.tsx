"use client";

import { useState } from "react";
import { motion } from "motion/react";
import PageLayout from "@/components/PageLayout";

const MermaidBlock = ({ title, code }: { title: string; code: string }) => (
  <div className="mt-5 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 bg-slate-900">
    <p className="text-xs font-semibold text-cyan-400 mb-3">{title}</p>
    <pre className="text-[11px] sm:text-xs text-slate-100 overflow-x-auto leading-relaxed">{code}</pre>
  </div>
);

const p2pMermaid = String.raw`flowchart LR
  A[Besoin d'achat] --> B[PR – Purchase Requisition]
  B --> C[PO – Purchase Order (ME21N)]
  C --> D[Réception marchandises GR (MIGO)]
  D --> E[Facture fournisseur IR (MIRO)]
  E --> F[Paiement fournisseur F110 / F-53]
`;

const o2cMermaid = String.raw`flowchart LR
  A[Demande client / Quotation] --> B[Sales Order VA01]
  B --> C[Livraison VL01N]
  C --> D[Post Goods Issue PGI]
  D --> E[Facturation VF01]
  E --> F[Paiement client F-28]
`;

const r2rMermaid = String.raw`flowchart LR
  A[Transactions quotidiennes P2P, O2C, Paie...] --> B[Écritures FI / CO]
  B --> C[Rapprochements et ajustements]
  C --> D[Clôture période month-end / year-end]
  D --> E[État financier Bilan & P&L]
`;

const p2pSteps = [
  { step: 1, title: "Expression de besoin", desc: "Le département identifie un besoin d'achat et le formalise en interne.", tcodes: [] },
  { step: 2, title: "Purchase Requisition (PR)", desc: "Création d'une demande d'achat interne, validée par les approbateurs.", tcodes: ["ME51N", "ME54N"] },
  { step: 3, title: "Purchase Order (PO)", desc: "Transformation de la PR en commande officielle envoyée au fournisseur.", tcodes: ["ME21N", "ME22N"] },
  { step: 4, title: "Goods Receipt (GR)", desc: "Réception des marchandises ou services, contrôle qualité, mouvement de stock.", tcodes: ["MIGO"] },
  { step: 5, title: "Invoice Receipt (IR)", desc: "Saisie de la facture fournisseur et rapprochement PO/GR/facture (3-way match).", tcodes: ["MIRO"] },
  { step: 6, title: "Paiement fournisseur", desc: "Lancement du paiement automatique ou manuel, lettrage des postes ouverts.", tcodes: ["F110", "F-53"] },
];

const o2cSteps = [
  { step: 1, title: "Demande client / Quotation", desc: "Réception de la demande client, création éventuelle d'une offre de prix.", tcodes: ["VA11", "VA21"] },
  { step: 2, title: "Sales Order (SO)", desc: "Création de la commande de vente, vérification du crédit client et du stock.", tcodes: ["VA01"] },
  { step: 3, title: "Livraison (Delivery)", desc: "Préparation, picking et expédition des marchandises au client.", tcodes: ["VL01N"] },
  { step: 4, title: "Post Goods Issue (PGI)", desc: "Validation de la sortie de stock — génère l'écriture COGS en FI/CO.", tcodes: ["VL02N"] },
  { step: 5, title: "Facturation (Billing)", desc: "Création de la facture client et comptabilisation des revenus en FI.", tcodes: ["VF01"] },
  { step: 6, title: "Paiement client", desc: "Encaissement, lettrage des postes ouverts AR, clôture du cycle O2C.", tcodes: ["F-28"] },
];

const r2rSteps = [
  { step: 1, title: "Enregistrement des transactions", desc: "Toutes les transactions quotidiennes (P2P, O2C, paie, actifs) génèrent des écritures FI/CO." },
  { step: 2, title: "Rapprochements", desc: "Rapprochements bancaires, comptes intercos, provisions, amortissements." },
  { step: 3, title: "Clôture de période", desc: "Contrôles, ajustements, répartitions CO, clôture des périodes FI et CO." },
  { step: 4, title: "États financiers", desc: "Production du P&L, bilan, tableau de flux, annexes — via Fiori ou BW." },
  { step: 5, title: "Reporting de gestion", desc: "Analyses CO-PA, contrôle budgétaire, reporting direction et actionnaires." },
];

const faqItems = [
  { q: "Quelle est la différence entre P2P et O2C ?", a: "P2P (Procure-to-Pay) décrit les achats — comment l'argent sort de l'entreprise via les fournisseurs. O2C (Order-to-Cash) décrit les ventes — comment le chiffre d'affaires entre dans l'entreprise via les clients. Les deux cycles se recoupent dans FI/CO lors de la clôture." },
  { q: "Pourquoi R2R est-il important pour un consultant SAP ?", a: "R2R est le cycle qui consolide tous les flux (P2P, O2C, paie, actifs) en états financiers. Comprendre R2R permet de faire le lien entre les opérations quotidiennes et le bilan/P&L — une compétence clé pour les consultants FI, CO et les chefs de projet." },
  { q: "Qu'est-ce que le 3-way match dans P2P ?", a: "Le 3-way match est la vérification automatique de cohérence entre le Purchase Order (PO), le Goods Receipt (GR) et la facture fournisseur (IR). SAP bloque le paiement si les 3 documents ne correspondent pas, protégeant l'entreprise contre les paiements frauduleux ou erronés." },
  { q: "Quels modules SAP sont impliqués dans O2C ?", a: "Le cycle O2C implique principalement SD (création de commande, livraison, facturation) et FI (comptabilisation des revenus, postes clients AR, paiements). CO est aussi impliqué pour l'analyse de marge (CO-PA) lors de la facturation." },
  { q: "Comment ces processus sont-ils liés dans S/4HANA ?", a: "Dans S/4HANA, l'Universal Journal (ACDOCA) unifie toutes les écritures FI/CO générées par P2P, O2C et R2R en une source unique. Cela élimine les réconciliations inter-modules et permet un reporting temps réel sur tous les cycles." },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
    className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-soft border border-cyan-500/10"
  >
    <h2 className="text-xl sm:text-2xl font-bold mb-5">{title}</h2>
    {children}
  </motion.section>
);

const ProcessSteps = ({ steps, accentColor }: { steps: { step: number; title: string; desc: string; tcodes?: string[] }[]; accentColor: string }) => (
  <div className="space-y-3">
    {steps.map((s) => (
      <div key={s.step} className="flex gap-4 items-start">
        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${accentColor}`}>
          {s.step}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{s.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
          {s.tcodes && s.tcodes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {s.tcodes.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

const FaqAccordion = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section title="FAQ – Questions fréquentes">
      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <div key={i} className="border border-cyan-500/15 rounded-2xl overflow-hidden">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors">
              <span>{item.q}</span>
              <span className="ml-2 text-cyan-500 text-base">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default function ProcessusMetierPage() {
  return (
    <PageLayout
      label="Processus Métier"
      title="Processus Métier – P2P, O2C, R2R"
      description="Les trois grands cycles end-to-end qui structurent les flux d'une entreprise : achats, ventes et reporting financier. Le point de départ pour comprendre comment les modules SAP se connectent."
      gradient="from-cyan-900 via-teal-700 to-emerald-500"
      badge="Débutant · Point d'entrée · Cross-modules"
    >
      {/* Vue d'ensemble */}
      <Section title="Vue d'ensemble des 3 cycles">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          Les processus P2P, O2C et R2R structurent la majorité des flux d'une entreprise. Comprendre ces cycles avant d'étudier les modules SAP individuels permet de voir comment FI, MM, SD et CO s'articulent dans un vrai projet.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { code: "P2P", title: "Procure-to-Pay", subtitle: "Achats", desc: "De l'expression du besoin au paiement fournisseur. Modules : MM + FI", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
            { code: "O2C", title: "Order-to-Cash", subtitle: "Ventes", desc: "De la commande client à l'encaissement. Modules : SD + FI", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30" },
            { code: "R2R", title: "Record-to-Report", subtitle: "Finance", desc: "De l'enregistrement comptable aux états financiers. Modules : FI + CO", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30" },
          ].map((c) => (
            <div key={c.code} className="rounded-2xl border p-5 bg-gray-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border mb-3 ${c.color}`}>{c.code}</span>
              <p className="text-sm font-bold mb-0.5">{c.title}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{c.subtitle}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="1. P2P – Procure-to-Pay (Achats)">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          P2P couvre toutes les étapes de l'expression de besoin jusqu'au paiement fournisseur. Il contrôle comment l'argent sort de l'entreprise et mobilise principalement les modules MM et FI.
        </p>
        <ProcessSteps steps={p2pSteps} accentColor="bg-amber-500" />
        <MermaidBlock title="Schéma P2P" code={p2pMermaid} />
      </Section>

      <Section title="2. O2C – Order-to-Cash (Ventes)">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          O2C décrit le flux depuis la commande client jusqu'à l'encaissement. Il contrôle comment le chiffre d'affaires entre dans l'entreprise, via les modules SD et FI.
        </p>
        <ProcessSteps steps={o2cSteps} accentColor="bg-purple-500" />
        <MermaidBlock title="Schéma O2C" code={o2cMermaid} />
      </Section>

      <Section title="3. R2R – Record-to-Report (Finance)">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          R2R regroupe tous les enregistrements comptables (P2P, O2C, paie…), leur consolidation et la production des états financiers. Il explique comment les chiffres sont produits dans FI et CO.
        </p>
        <ProcessSteps steps={r2rSteps} accentColor="bg-blue-500" />
        <MermaidBlock title="Schéma R2R" code={r2rMermaid} />
      </Section>

      <Section title="4. Lien avec les modules HanaFlow">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          Chaque processus end-to-end traverse plusieurs modules SAP. Savoir raconter ces histoires de bout en bout — en citant les t-codes, les écritures générées et les modules impliqués — est ce qui différencie un consultant junior compétent d'un simple utilisateur SAP.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { cycle: "P2P", modules: ["MM (PR, PO, GR)", "FI (IR, paiement)", "CO (imputation)"], color: "border-amber-500/20 bg-amber-50 dark:bg-amber-900/10", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
            { cycle: "O2C", modules: ["SD (Sales Order, Delivery, Billing)", "FI (revenus, AR)", "CO (CO-PA, marge)"], color: "border-purple-500/20 bg-purple-50 dark:bg-purple-900/10", badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30" },
            { cycle: "R2R", modules: ["FI (clôture, états)", "CO (reporting gestion)", "BI/Fiori (analytique)"], color: "border-blue-500/20 bg-blue-50 dark:bg-blue-900/10", badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30" },
          ].map((m) => (
            <div key={m.cycle} className={`rounded-2xl border p-4 ${m.color}`}>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border mb-3 ${m.badge}`}>{m.cycle}</span>
              <ul className="space-y-1">
                {m.modules.map((mod) => (
                  <li key={mod} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                    <span className="mt-0.5 text-slate-400">•</span>
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <FaqAccordion />
    </PageLayout>
  );
}
