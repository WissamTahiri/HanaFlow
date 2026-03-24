import React from "react";
import { Link } from "react-router-dom";

const ModulesOverview = () => {
  const modules = [
    {
      code: "FI",
      title: "Financial Accounting",
      description:
        "Comptabilité générale, clients, fournisseurs, immobilisations, intégration forte avec MM et SD.",
      path: "/modules-sap/fi",
    },
    {
      code: "CO",
      title: "Controlling",
      description:
        "Centres de coûts, centres de profit, CO‑PA, analyse de marge et pilotage de la performance.",
      path: "/modules-sap/co",
    },
    {
      code: "MM",
      title: "Materials Management",
      description:
        "Approvisionnements, gestion de stock, inventaires, MRP, base du flux Procure‑to‑Pay.",
      path: "/modules-sap/mm",
    },
    {
      code: "SD",
      title: "Sales and Distribution",
      description:
        "Devis, commandes, livraisons, facturation, pricing et intégration Order‑to‑Cash.",
      path: "/modules-sap/sd",
    },
    {
      code: "HCM",
      title: "Human Capital Management",
      description:
        "Gestion administrative, temps, paie et organisation RH, intégré avec FI/CO.",
      path: "/modules-sap/hcm",
    },
    {
      code: "PP",
      title: "Production Planning",
      description:
        "Planification, ordres de fabrication, suivi d’atelier, intégration avec MM et CO.",
      path: "/modules-sap/pp",
    },
  ];

  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Panorama des modules SAP
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 max-w-3xl">
          Cette section présente les principaux modules fonctionnels SAP que tu
          rencontreras en projet. Clique sur un module pour accéder à sa page
          dédiée.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <Link
              key={m.code}
              to={m.path}
              className="bg-sapGrayLight dark:bg-slate-800 rounded-2xl p-4 border border-sapBlue/10 hover:border-sapBlue/40 hover:bg-sapBlue/5 dark:hover:bg-slate-700 transition-colors block"
            >
              <p className="text-xs font-semibold text-sapBlue mb-1">
                Module {m.code}
              </p>
              <h2 className="text-base font-bold mb-2 text-slate-900 dark:text-white">
                {m.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {m.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesOverview;
