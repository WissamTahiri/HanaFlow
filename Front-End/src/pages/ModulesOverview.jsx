import { motion } from "motion/react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const modules = [
  {
    code: "FI",
    title: "Financial Accounting",
    description: "Comptabilité générale, clients, fournisseurs, immobilisations. Intégration forte avec MM et SD via le Universal Journal.",
    path: "/modules-sap/fi",
    gradient: "from-blue-500 to-blue-700",
    tags: ["Comptabilité", "Clôture", "Bilan"],
  },
  {
    code: "CO",
    title: "Controlling",
    description: "Centres de coûts et de profit, CO-PA, analyse de marge et pilotage de la performance financière.",
    path: "/modules-sap/co",
    gradient: "from-indigo-500 to-indigo-700",
    tags: ["Contrôle de gestion", "CO-PA", "Marges"],
  },
  {
    code: "MM",
    title: "Materials Management",
    description: "Approvisionnements, gestion de stock, inventaires, MRP. Base du flux Procure-to-Pay intégré avec FI.",
    path: "/modules-sap/mm",
    gradient: "from-emerald-500 to-emerald-700",
    tags: ["Achats", "Stock", "P2P"],
  },
  {
    code: "SD",
    title: "Sales and Distribution",
    description: "Devis, commandes clients, livraisons, facturation, pricing conditionnel et flux Order-to-Cash complet.",
    path: "/modules-sap/sd",
    gradient: "from-orange-500 to-orange-700",
    tags: ["Ventes", "Livraison", "O2C"],
  },
  {
    code: "HCM",
    title: "Human Capital Management",
    description: "Gestion administrative RH, temps, paie et organisation. Intégration avec FI/CO pour les écritures salariales.",
    path: "/modules-sap/hcm",
    gradient: "from-purple-500 to-purple-700",
    tags: ["RH", "Paie", "Temps"],
  },
  {
    code: "PP",
    title: "Production Planning",
    description: "Planification des besoins, ordres de fabrication, suivi d'atelier MES, intégration avec MM et CO.",
    path: "/modules-sap/pp",
    gradient: "from-rose-500 to-rose-700",
    tags: ["Fabrication", "MRP", "Atelier"],
  },
];

const ModulesOverview = () => (
  <>
    <SEO
      title="Modules SAP"
      description="Panorama complet des modules SAP : FI, CO, MM, SD, HCM, PP. Accède aux fiches détaillées de chaque module fonctionnel."
      path="/modules-sap"
    />

    {/* Header */}
    <div className="bg-gradient-to-br from-sapBlueDark to-sapBlue py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3"
        >
          Catalogue
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
        >
          Modules SAP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-blue-100 max-w-xl mx-auto text-base"
        >
          Les 6 modules fonctionnels clés que tu rencontreras sur les projets SAP. Clique pour accéder à la fiche complète.
        </motion.p>
      </div>
    </div>

    {/* Grille */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m, i) => (
          <motion.div
            key={m.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i }}
          >
            <Link
              to={m.path}
              className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border
                         border-gray-100 dark:border-slate-700 overflow-hidden
                         hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header coloré */}
              <div className={`bg-gradient-to-r ${m.gradient} px-6 py-5 flex items-center gap-4`}>
                <span className="text-3xl font-extrabold text-white/90 font-mono">{m.code}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight truncate">{m.title}</p>
                </div>
              </div>

              {/* Corps */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1">
                  {m.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.tags.map((tag) => (
                    <span key={tag} className="badge-blue text-xs">{tag}</span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sapBlue dark:text-sapAccent group-hover:gap-2.5 transition-all">
                  Voir le module <ArrowRight />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </>
);

export default ModulesOverview;
