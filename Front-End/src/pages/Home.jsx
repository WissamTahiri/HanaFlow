import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="mt-6 sm:mt-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-soft border border-sapBlue/10"
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sapBlue mb-3">
          HanaFlow · Plateforme SAP de Wissam Tahiri
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          HanaFlow&nbsp;: de l’ESGI à consultant SAP S/4HANA, ton hub
          d’apprentissage complet.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 max-w-2xl">
          Site éducatif pensé pour les consultants SAP juniors : modules
          fonctionnels (FI, CO, MM, SD, HCM, PP), S/4HANA Finance, projets ERP,
          certifications et carrière. 100 % orienté mission client.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link
            to="/modules-sap"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-sapBlue text-white text-sm font-semibold shadow-soft hover:bg-sapBlueDark transition-colors"
          >
            Explorer les modules SAP
          </Link>
          <Link
            to="/s4hana"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-sapBlue/40 text-sapBlue text-sm font-semibold hover:bg-sapBlue/5 transition-colors"
          >
            Comprendre S/4HANA Finance
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="bg-sapGrayLight dark:bg-slate-800 rounded-2xl p-4">
            <p className="text-sapBlue font-bold text-lg">FI / CO</p>
            <p className="text-slate-600 dark:text-slate-300">
              Cœur Finance & Controlling pour S/4HANA.
            </p>
          </div>
          <div className="bg-sapGrayLight dark:bg-slate-800 rounded-2xl p-4">
            <p className="text-sapBlue font-bold text-lg">MM / SD</p>
            <p className="text-slate-600 dark:text-slate-300">
              Procure‑to‑Pay et Order‑to‑Cash intégrés.
            </p>
          </div>
          <div className="bg-sapGrayLight dark:bg-slate-800 rounded-2xl p-4">
            <p className="text-sapBlue font-bold text-lg">S/4HANA</p>
            <p className="text-slate-600 dark:text-slate-300">
              Universal Journal, Fiori UX, embedded analytics.
            </p>
          </div>
          <div className="bg-sapGrayLight dark:bg-slate-800 rounded-2xl p-4">
            <p className="text-sapBlue font-bold text-lg">Carrière</p>
            <p className="text-slate-600 dark:text-slate-300">
              CV, entretiens, certifications & missions de conseil.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
