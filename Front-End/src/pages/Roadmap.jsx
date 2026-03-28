import React, { useState } from "react";
import { motion } from "motion/react";
import PageLayout from "../components/PageLayout";

/* ─── Données Roadmap ─────────────────────────────────── */

const sections = {
  finance: {
    title: "Profil Finance / Contrôle de gestion – Roadmap FI/CO",
    color: "blue",
    steps: [
      {
        title: "Étape 1 – Bases SAP & métier finance",
        bullets: [
          "Comprendre les états financiers (bilan, P&L, cash-flow) et les grands cycles finance (P2P, O2C, R2R).",
          "Suivre une intro SAP S/4HANA + module FI sur HanaFlow (page FI + Processus métier).",
          "Regarder un learning journey SAP S/4HANA Finance / FI (S4F12, S4F13 ou équivalent).",
        ],
      },
      {
        title: "Étape 2 – Spécialisation FI/CO & intégration",
        bullets: [
          "Approfondir FI (GL, AP, AR, AA) + CO (Cost Centers, Profit Centers, CO-PA) via tes pages FI et CO.",
          "Maîtriser P2P (MM+FI) et O2C (SD+FI) avec les modules MM, SD et la page Processus métier.",
          "Commencer à travailler des cas réels : factures, clôture, analyse de marge simple.",
        ],
      },
      {
        title: "Étape 3 – Projets S/4HANA Finance & CO-PA",
        bullets: [
          "Participer à des ateliers de design FI/CO et à des cycles de test (UAT) sur un projet.",
          "Travailler sur CO-PA, product costing et reporting (Fiori, Universal Journal).",
          "Se familiariser avec Joule pour la finance (analyses, explain-my-numbers).",
        ],
      },
      {
        title: "Étape 4 – Certification & rôle confirmé FI/CO",
        bullets: [
          "Préparer une certification S/4HANA Finance (C_TS4FI_xxx ou équivalent).",
          "Contribuer à des missions de migration S/4HANA / optimisation clôture.",
          "Développer ta capacité à raconter les flux end-to-end à un CFO ou contrôleur.",
        ],
      },
    ],
  },
  supply: {
    title: "Profil Supply Chain / Logistique – Roadmap MM / SD / PP",
    color: "orange",
    steps: [
      {
        title: "Étape 1 – Bases Supply Chain & SAP",
        bullets: [
          "Comprendre les grands flux : approvisionnement, stock, transport, service client.",
          "Parcourir les modules MM, SD et PP sur HanaFlow + page Processus métier (P2P, O2C).",
          "Regarder une intro S/4HANA Manufacturing / Supply Chain (vidéos ou learning journey).",
        ],
      },
      {
        title: "Étape 2 – P2P, O2C et production discrète",
        bullets: [
          "Maîtriser le cycle P2P MM–FI (PR, PO, GR, facture, paiement) et O2C SD–FI.",
          "Approfondir PP pour la production discrète : ordres, BOM, routings, confirmations.",
          "Comprendre l'intégration avec FI/CO (stocks, GR/IR, COGS, coûts de prod).",
        ],
      },
      {
        title: "Étape 3 – S/4HANA Supply Chain & optimisation",
        bullets: [
          "Découvrir MRP Live, PP/DS et les Fiori apps supply chain.",
          "Participer à un projet d'optimisation P2P/O2C ou de déploiement S/4HANA Supply Chain.",
          "Explorer les premiers cas d'usage IA/Joule pour la supply (prévision, risques de rupture).",
        ],
      },
      {
        title: "Étape 4 – Spécialisation (MM, SD ou PP)",
        bullets: [
          "Choisir un module principal (MM, SD ou PP) et viser un niveau \"référent junior\".",
          "Travailler sur des projets internationaux / multi-sites.",
          "Préparer une certification ou un parcours avancé (S/4HANA Supply Chain).",
        ],
      },
    ],
  },
  sales: {
    title: "Profil Sales / Marketing / Relation client – Roadmap SD / CX",
    color: "purple",
    steps: [
      {
        title: "Étape 1 – Bases O2C & ventes",
        bullets: [
          "Comprendre le cycle Order-to-Cash et les indicateurs commerciaux (CA, marge, DSO).",
          "Travailler la page SD (O2C) et Processus métier sur HanaFlow.",
          "Se familiariser avec les notions de pricing, conditions, remises.",
        ],
      },
      {
        title: "Étape 2 – SD & intégration FI/CO",
        bullets: [
          "Approfondir SD : Sales area, master data client, documents de vente, livraisons, factures.",
          "Bien comprendre l'intégration SD–FI (revenus, COGS, taxes) et l'impact sur la marge.",
          "Pratiquer des scénarios de remises, retours, factures pro-forma.",
        ],
      },
      {
        title: "Étape 3 – CX, Analytics & Joule",
        bullets: [
          "Explorer les solutions CX (Sales Cloud, Service) et leur intégration avec S/4HANA.",
          "Travailler sur des dashboards de performance vente (Fiori, CO-PA, analytics).",
          "Utiliser Joule pour analyser les ventes, expliquer les écarts, identifier les opportunités.",
        ],
      },
      {
        title: "Étape 4 – Rôle confirmé sur O2C / CX",
        bullets: [
          "Participer à des projets de transformation commerciale (digitalisation du cycle de vente).",
          "Aider les sales managers à traduire leurs besoins en processus SAP.",
          "Préparer une certification orientée SD / Sales Cloud / CX selon ton contexte.",
        ],
      },
    ],
  },
  tech: {
    title: "Profil IT / Technique / Data / IA – Roadmap Tech & Intégration",
    color: "emerald",
    steps: [
      {
        title: "Étape 1 – Bases fonctionnelles + technique SAP",
        bullets: [
          "Comprendre les grands processus P2P, O2C, R2R via la page Processus métier.",
          "Parcourir tous les modules HanaFlow pour avoir une vision globale FI/MM/SD/CO/PP/HCM.",
          "Se former sur les bases techniques : ABAP, CDS views, Fiori / UI5 ou au moins OData & APIs.",
        ],
      },
      {
        title: "Étape 2 – S/4HANA technique & intégration",
        bullets: [
          "Travailler sur S/4HANA (extensions in-app, RAP, BTP), intégrations (API, IDoc, events).",
          "Comprendre comment exposer les données FI/MM/SD/CO pour l'analytics et les IA.",
          "Mettre en place des petits POCs d'automatisation (par ex. n8n, BTP, Joule).",
        ],
      },
      {
        title: "Étape 3 – Data, Analytics & IA dans SAP",
        bullets: [
          "Explorer les outils analytics SAP (Embedded analytics, SAC, Datasphere).",
          "Comprendre la SAP AI Foundation, Joule, et les cas d'usage d'IA embarquée.",
          "Contribuer à des projets où tu relies données SAP et outils IA externes.",
        ],
      },
      {
        title: "Étape 4 – Rôle Tech / Architecte SAP",
        bullets: [
          "Évoluer vers un rôle de Tech Lead / Architecte intégration / Data dans l'écosystème SAP.",
          "Aider les clients à choisir les bons patterns (extensions, intégration, IA).",
          "Préparer des certifications techniques S/4HANA / BTP / Analytics selon ton orientation.",
        ],
      },
    ],
  },
};

const profileCards = [
  {
    key: "finance",
    title: "Finance / Contrôle de gestion",
    desc: "Tu aimes les chiffres, la compta, le contrôle de gestion — tu vises FI/CO.",
    icon: "💰",
    color: "blue",
  },
  {
    key: "supply",
    title: "Supply Chain / Logistique / Industrie",
    desc: "Tu t'intéresses aux flux physiques, stocks, production, P2P/O2C.",
    icon: "📦",
    color: "orange",
  },
  {
    key: "sales",
    title: "Sales / Marketing / Relation client",
    desc: "Tu es orienté business, relation client, croissance du CA.",
    icon: "📈",
    color: "purple",
  },
  {
    key: "tech",
    title: "IT / Technique / Data / IA",
    desc: "Tu aimes développer, intégrer, travailler la data et l'IA.",
    icon: "⚙️",
    color: "emerald",
  },
];

const profileColorMap = {
  blue: {
    selected: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    unselected: "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    step: "bg-blue-600",
    section: "border-blue-500/10",
  },
  orange: {
    selected: "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    unselected: "border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20",
    badge: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
    step: "bg-orange-500",
    section: "border-orange-500/10",
  },
  purple: {
    selected: "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    unselected: "border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    step: "bg-purple-600",
    section: "border-purple-500/10",
  },
  emerald: {
    selected: "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    unselected: "border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    step: "bg-emerald-600",
    section: "border-emerald-500/10",
  },
};

/* ─── Sous-composants ─────────────────────────────────── */

const Section = ({ title, accent, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-soft border ${accent || "border-sapBlue/10"}`}
  >
    <h2 className="text-xl sm:text-2xl font-bold mb-5">{title}</h2>
    {children}
  </motion.section>
);

const RoadmapResult = ({ profileKey }) => {
  if (!profileKey || !sections[profileKey]) return null;

  const profile = sections[profileKey];
  const colors = profileColorMap[profile.color];

  return (
    <motion.div
      key={profileKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-soft border ${colors.section}`}
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-2">{profile.title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Cette roadmap est indicative : l'objectif est de te donner un fil conducteur
        pour structurer tes apprentissages et tes premières missions.
      </p>
      <div className="space-y-4">
        {profile.steps.map((step, idx) => (
          <div
            key={idx}
            className="flex gap-4 items-start"
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${colors.step}`}
            >
              {idx + 1}
            </div>
            <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-gray-50 dark:bg-slate-800">
              <h3 className="text-sm font-semibold mb-2">{step.title}</h3>
              <ul className="space-y-1.5">
                {step.bullets.map((b, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="mt-0.5 text-slate-400">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Page principale ─────────────────────────────────── */

const Roadmap = () => {
  const [profile, setProfile] = useState("");
  const [submittedProfile, setSubmittedProfile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedProfile(profile);
  };

  return (
    <PageLayout
      label="Roadmap"
      title="Roadmap consultant SAP"
      description="Choisis ton profil et obtiens une roadmap personnalisée pour structurer tes apprentissages SAP — de débutant à consultant confirmé."
      gradient="from-slate-900 via-sapBlueDark to-sapBlue"
      badge="Tous niveaux · Finance · Supply · Sales · Tech"
      seoTitle="Roadmap Consultant SAP – Personnalisée par profil"
      seoDescription="Obtiens une roadmap SAP personnalisée selon ton profil : Finance/FI-CO, Supply Chain/MM-SD-PP, Sales/CX ou IT/Tech. Guide étape par étape vers le rôle de consultant SAP."
      seoPath="/roadmap"
    >
      {/* Légende des niveaux */}
      <Section title="Légende des niveaux HanaFlow" accent="border-sapBlue/10">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              level: "Débutant",
              desc: "Découverte du module, vocabulaire de base, compréhension des grands flux.",
              color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
            },
            {
              level: "Intermédiaire",
              desc: "Compréhension des processus end-to-end et de l'intégration entre modules SAP.",
              color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
            },
            {
              level: "Avancé",
              desc: "Design de solutions, optimisation, participation active aux projets S/4HANA.",
              color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
            },
          ].map((l) => (
            <div key={l.level} className={`rounded-2xl border p-4 ${l.color}`}>
              <p className="text-sm font-bold mb-1">{l.level}</p>
              <p className="text-xs leading-relaxed opacity-80">{l.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Formulaire */}
      <Section title="Génère ta roadmap personnalisée" accent="border-sapBlue/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm font-semibold mb-3">Choisis ton profil cible :</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {profileCards.map((p) => {
                const colors = profileColorMap[p.color];
                const isSelected = profile === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setProfile(p.key)}
                    className={`text-left px-4 py-4 rounded-2xl border transition-colors ${
                      isSelected ? colors.selected : colors.unselected
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-sm font-semibold">{p.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-7">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!profile}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sapBlue text-white text-sm font-semibold shadow-soft hover:bg-sapBlueDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Générer ma roadmap
              <span>→</span>
            </button>
          </div>
        </form>
      </Section>

      {/* Résultat */}
      {submittedProfile && <RoadmapResult profileKey={submittedProfile} />}
    </PageLayout>
  );
};

export default Roadmap;
