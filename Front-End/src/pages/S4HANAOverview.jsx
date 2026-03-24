import React from "react";

const S4HANAOverview = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          Introduction à SAP S/4HANA
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          SAP S/4HANA est la suite ERP de nouvelle génération de SAP, conçue
          pour tourner sur la base de données in‑memory SAP HANA. Elle simplifie
          les modèles de données, apporte une UX moderne avec Fiori et offre des
          capacités d’analytique temps réel.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4">
          Côté finance, S/4HANA Finance introduit notamment l’Universal Journal
          (table ACDOCA), qui fusionne les écritures FI et CO dans une vision
          unique, et renforce l’intégration avec les autres modules (MM, SD, PP)
          pour des processus bout‑en‑bout plus fluides.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Dans les prochaines sections, tu verras en détail les différences
          entre ECC et S/4HANA, les stratégies de migration possibles, le rôle
          de Fiori et les impacts sur les projets de déploiement FI/CO (SAP
          Activate, agilité, data migration, tests, cutover).
        </p>
      </div>
    </section>
  );
};

export default S4HANAOverview;
