import { motion } from "motion/react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const NotFound = () => (
  <>
    <SEO title="Page introuvable" description="Cette page n'existe pas sur HanaFlow." />

    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 bg-gray-50 dark:bg-sapDark">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* 404 */}
        <div className="relative mb-8 inline-block">
          <p className="text-[8rem] sm:text-[10rem] font-extrabold leading-none gradient-text select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-sapBlue/5 dark:bg-sapBlue/10 blur-2xl" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Page introuvable
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          La page que tu cherches n'existe pas ou a été déplacée.<br />
          Retourne à l'accueil ou explore les modules SAP.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary w-full sm:w-auto justify-center py-3"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/modules-sap"
            className="btn-outline w-full sm:w-auto justify-center py-3"
          >
            Voir les modules SAP
          </Link>
        </div>
      </motion.div>
    </div>
  </>
);

export default NotFound;
