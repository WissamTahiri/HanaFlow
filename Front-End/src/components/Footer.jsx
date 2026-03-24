import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-sapBlue/10 bg-sapGrayLight/70 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        {/* Bloc gauche : identité */}
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            HanaFlow – Portfolio SAP S/4HANA
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Par Wissam Tahiri – futur consultant SAP S/4HANA (FI/MM/SD/CO + IA &
            Joule).
          </p>
        </div>

        {/* Bloc centre : liens rapides */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
          <Link to="/" className="hover:text-sapBlue">
            Accueil
          </Link>
          <Link to="/modules" className="hover:text-sapBlue">
            Modules SAP
          </Link>
          <Link to="/processus-metier" className="hover:text-sapBlue">
            Processus métier
          </Link>
          <Link to="/roadmap" className="hover:text-sapBlue">
            Roadmap
          </Link>
          <Link to="/a-propos" className="hover:text-sapBlue">
            À propos
          </Link>
        </div>

        {/* Bloc droite : contact / réseaux (remplace par tes vrais liens plus tard) */}
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <p className="mb-1">Me contacter :</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:wisstahiri91@gmail.com"
              className="hover:text-sapBlue"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/wissam-tahiri-730a47326"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sapBlue"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/WissamTahiri"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sapBlue"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
