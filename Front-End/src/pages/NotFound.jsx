import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

const NotFound = () => (
  <>
    <SEO title="Page introuvable" description="Cette page n'existe pas sur HanaFlow." />
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-sapBlue mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Page introuvable
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 bg-sapBlue text-white rounded-lg font-medium hover:bg-sapBlueDark transition-colors"
        >
          Retour à l'accueil
        </Link>
        <Link
          to="/modules-sap"
          className="px-5 py-2.5 border border-sapBlue text-sapBlue rounded-lg font-medium hover:bg-sapBlue/5 transition-colors"
        >
          Voir les modules SAP
        </Link>
      </div>
    </div>
  </>
);

export default NotFound;
