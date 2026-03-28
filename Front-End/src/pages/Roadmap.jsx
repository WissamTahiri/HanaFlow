import React, { useState } from "react";

const RoadmapResult = ({ profile }) => {
  if (!profile) {
    return (
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
        Renseigne ton profil ci‑dessus puis clique sur “Générer ma roadmap” pour
        voir un plan personnalisé.
      </p>
    );
  }

  const baseIntro =
    "Cette roadmap est indicative : l’objectif est de te donner un fil conducteur pour structurer tes apprentissages et tes premières missions.";

  const sections = {
    finance: {
      title: "Profil Finance / Comptabilité – Roadmap FI/CO",
      steps: [
        {
          title: "Étape 1 – Bases SAP & métier finance",
          bullets: [
            "Comprendre les états financiers (bilan, P&L, cash‑flow) et les principaux cycles finance (P2P, O2C, R2R).",
            "Suivre une intro SAP S/4HANA + module FI sur HanaFlow (page FI + Processus métier).",
            "Regarder un learning journey SAP S/4HANA Finance / FI (S4F12, S4F13 ou équivalent).",
          ],
        },
        {
          title: "Étape 2 – Spécialisation FI/CO & intégration",
          bullets: [
            "Approfondir FI (GL, AP, AR, AA) + CO (Cost Centers, Profit Centers, CO‑PA) via tes pages FI et CO.",
            "Maîtriser P2P (MM+FI) et O2C (SD+FI) avec les modules MM, SD et la page Processus métier.",
            "Commencer à travailler des cas réels : factures, clôture, analyse de marge simple.",
          ],
        },
        {
          title: "Étape 3 – Projets S/4HANA Finance & CO‑PA",
          bullets: [
            "Participer à des ateliers de design FI/CO et à des cycles de test (UAT) sur un projet.",
            "Travailler sur CO‑PA, product costing et reporting (Fiori, Universal Journal).",
            "Te familiariser avec Joule pour la finance (analyses, explain‑my‑numbers).",
          ],
        },
        {
          title: "Étape 4 – Certification & rôle confirmé FI/CO",
          bullets: [
            "Préparer une certification S/4HANA Finance (C_TS4FI_xxx ou équivalent).",
            "Contribuer à des missions de migration S/4HANA / optimisation clôture.",
            "Développer ta capacité à raconter les flux end‑to‑end à un CFO ou contrôleur.",
          ],
        },
      ],
    },
    supply: {
      title: "Profil Supply Chain / Logistique – Roadmap MM / SD / PP",
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
            "Maîtriser le cycle P2P MM–FI (PR, PO, GR, facture, paiement) et O2C SD–FI (Sales Order, delivery, PGI, billing, payment).",
            "Approfondir PP pour la production discrète : ordres, BOM, routings, confirmations.",
            "Comprendre l’intégration avec FI/CO (stocks, GR/IR, COGS, coûts de prod).",
          ],
        },
        {
          title: "Étape 3 – S/4HANA Supply Chain & optimisation",
          bullets: [
            "Découvrir MRP Live, PP/DS et les Fiori apps supply chain.",
            "Participer à un projet d’optimisation P2P/O2C ou de déploiement S/4HANA Supply Chain.",
            "Explorer les premiers cas d’usage IA/Joule pour la supply (prévision, risques de rupture, recommandations).",
          ],
        },
        {
          title: "Étape 4 – Spécialisation (MM, SD ou PP)",
          bullets: [
            "Choisir un module principal (MM, SD ou PP) et viser un niveau “référent junior”.",
            "Travailler sur des projets internationaux / multi‑sites.",
            "Préparer une certification ou un parcours avancé (S/4HANA Supply Chain).",
          ],
        },
      ],
    },
    sales: {
      title: "Profil Sales / Marketing / Relation client – Roadmap SD / CX",
      steps: [
        {
          title: "Étape 1 – Bases O2C & ventes",
          bullets: [
            "Comprendre le cycle Order‑to‑Cash et les indicateurs commerciaux (CA, marge, DSO).",
            "Travailler la page SD (O2C) et Processus métier sur HanaFlow.",
            "Se familiariser avec les notions de pricing, conditions, remises.",
          ],
        },
        {
          title: "Étape 2 – SD & intégration FI/CO",
          bullets: [
            "Approfondir SD : Sales area, master data client, documents de vente, livraisons, factures.",
            "Bien comprendre l’intégration SD–FI (revenus, COGS, taxes) et l’impact sur la marge.",
            "Pratiquer des scénarios de remises, retours, factures pro‑forma.",
          ],
        },
        {
          title: "Étape 3 – CX, Analytics & Joule",
          bullets: [
            "Explorer les solutions CX (Sales Cloud, Service) et leur intégration avec S/4HANA.",
            "Travailler sur des dashboards de performance vente (Fiori, CO‑PA, analytics).",
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
      title: "Profil IT / Technique / Dev – Roadmap Tech / Intégration / IA",
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
            "Travailler sur S/4HANA (extensions in‑app, RAP, BTP), intégrations (API, IDoc, events).",
            "Comprendre comment exposer les données FI/MM/SD/CO pour l’analytics et les IA.",
            "Mettre en place des petits POCs d’automatisation (par ex. n8n, BTP, Joule).",
          ],
        },
        {
          title: "Étape 3 – Data, Analytics & IA dans SAP",
          bullets: [
            "Explorer les outils analytics SAP (Embedded analytics, SAC, Datasphere).",
            "Comprendre la SAP AI Foundation, Joule, et les cas d’usage d’IA embarquée.",
            "Contribuer à des projets où tu relies données SAP et outils IA externes.",
          ],
        },
        {
          title: "Étape 4 – Rôle Tech/Architecte SAP",
          bullets: [
            "Évoluer vers un rôle de Tech Lead / Architecte intégration / Data dans l’écosystème SAP.",
            "Aider les clients à choisir les bons patterns (extensions, intégration, IA).",
            "Préparer des certifs techniques S/4HANA / BTP / Analytics selon ton orientation.",
          ],
        },
      ],
    },
  };

  const current = sections[profile];

  return (
    <div className="mt-6 border border-sapBlue/20 rounded-2xl p-4 sm:p-6 bg-sapGrayLight/60 dark:bg-slate-800">
      <h2 className="text-xl font-semibold mb-2">{current.title}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        {baseIntro}
      </p>
      <div className="space-y-4">
        {current.steps.map((step, idx) => (
          <div
            key={idx}
            className="border border-sapBlue/15 rounded-2xl p-3 sm:p-4 bg-white/80 dark:bg-slate-900/80"
          >
            <h3 className="text-sm sm:text-base font-semibold mb-2">
              {step.title}
            </h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
              {step.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const Roadmap = () => {
  const [experience, setExperience] = useState("");
  const [profile, setProfile] = useState("");
  const [targetProfile, setTargetProfile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTargetProfile(profile || "");
  };

  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Roadmap consultant SAP – Personnalisée par profil
        </h1>
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold
    bg-purple-500/10 text-purple-700 dark:text-purple-300
    border border-purple-500/40"
          >
            Niveau : Tous niveaux
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Outil d’orientation pour débutants, juniors et consultants
            confirmés.
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Réponds à quelques questions rapides sur ton profil, et HanaFlow te
          propose une roadmap de consultant SAP adaptée à ton orientation
          (Finance, Supply Chain, Ventes,
          Tech).[web:229][web:231][web:235][web:242]
        </p>

        <div className="mb-4 border border-sapBlue/15 rounded-2xl p-3 bg-sapGrayLight/60 dark:bg-slate-800">
          <p className="text-xs font-semibold text-sapBlue mb-1">
            Légende des niveaux HanaFlow
          </p>
          <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
            <li>
              <span className="font-semibold">Débutant</span> : découverte du
              module, vocabulaire, grands flux.
            </li>
            <li>
              <span className="font-semibold">Intermédiaire</span> :
              compréhension des processus end‑to‑end et intégration entre
              modules.
            </li>
            <li>
              <span className="font-semibold">Avancé</span> : design de
              solutions, optimisation, participation active aux projets S/4HANA.
            </li>
          </ul>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="border border-sapBlue/20 rounded-2xl p-4 sm:p-6 bg-sapGrayLight/60 dark:bg-slate-800"
        >
          <h2 className="text-lg font-semibold mb-3">1. Ton profil actuel</h2>

          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Niveau / expérience SAP
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-xl border border-sapBlue/30 bg-white dark:bg-slate-900 text-xs sm:text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sapBlue"
            >
              <option value="">Sélectionne une option</option>
              <option value="debutant">
                Débutant complet (aucune expérience projet)
              </option>
              <option value="junior">
                Junior (0–2 ans d&apos;expérience ou alternance)
              </option>
              <option value="confirme">
                Confirmé (2–5 ans ou plus, déjà sur projet)
              </option>
            </select>
          </div>

          <h2 className="text-lg font-semibold mb-2">
            2. Type de profil cible
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mb-2">
            Choisis l’orientation qui te correspond le plus aujourd’hui.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setProfile("finance")}
              className={`text-left text-xs sm:text-sm px-3 py-2 rounded-2xl border ${
                profile === "finance"
                  ? "border-sapBlue bg-sapBlue/10 text-sapBlue"
                  : "border-sapBlue/20 hover:border-sapBlue/60 hover:bg-sapBlue/5"
              }`}
            >
              <span className="font-semibold">
                Finance / Contrôle de gestion
              </span>
              <br />
              Tu aimes les chiffres, la compta, le contrôle de gestion, tu vises
              FI/CO.
            </button>

            <button
              type="button"
              onClick={() => setProfile("supply")}
              className={`text-left text-xs sm:text-sm px-3 py-2 rounded-2xl border ${
                profile === "supply"
                  ? "border-sapBlue bg-sapBlue/10 text-sapBlue"
                  : "border-sapBlue/20 hover:border-sapBlue/60 hover:bg-sapBlue/5"
              }`}
            >
              <span className="font-semibold">
                Supply Chain / Logistique / Industrie
              </span>
              <br />
              Tu t’intéresses aux flux physiques, stocks, production, P2P/O2C.
            </button>

            <button
              type="button"
              onClick={() => setProfile("sales")}
              className={`text-left text-xs sm:text-sm px-3 py-2 rounded-2xl border ${
                profile === "sales"
                  ? "border-sapBlue bg-sapBlue/10 text-sapBlue"
                  : "border-sapBlue/20 hover:border-sapBlue/60 hover:bg-sapBlue/5"
              }`}
            >
              <span className="font-semibold">
                Sales / Marketing / Relation client
              </span>
              <br />
              Tu es orienté business, relation client, croissance du CA.
            </button>

            <button
              type="button"
              onClick={() => setProfile("tech")}
              className={`text-left text-xs sm:text-sm px-3 py-2 rounded-2xl border ${
                profile === "tech"
                  ? "border-sapBlue bg-sapBlue/10 text-sapBlue"
                  : "border-sapBlue/20 hover:border-sapBlue/60 hover:bg-sapBlue/5"
              }`}
            >
              <span className="font-semibold">IT / Technique / Data / IA</span>
              <br />
              Tu aimes développer, intégrer, travailler la data et l’IA.
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-sapBlue text-white text-sm font-semibold shadow-soft hover:bg-sapBlueDark transition-colors"
            >
              Générer ma roadmap
            </button>
          </div>
        </form>

        {/* Résultat */}
        <RoadmapResult profile={targetProfile} />
      </div>
    </section>
  );
};

export default Roadmap;
