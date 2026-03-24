import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle.jsx";
import { useAuth } from "../context/AuthContext";

const navLinkBase =
  "text-sm font-medium px-3 py-2 rounded-full transition-colors";
const navLinkActive = "bg-sapBlue text-white shadow-soft";
const navLinkInactive =
  "text-slate-700 dark:text-slate-200 hover:bg-sapBlue/10";

const moduleLinks = [
  { code: "FI", label: "Financial Accounting", path: "/modules-sap/fi" },
  { code: "CO", label: "Controlling", path: "/modules-sap/co" },
  { code: "MM", label: "Materials Management", path: "/modules-sap/mm" },
  { code: "SD", label: "Sales and Distribution", path: "/modules-sap/sd" },
  { code: "HCM", label: "Human Capital Management", path: "/modules-sap/hcm" },
  { code: "PP", label: "Production Planning", path: "/modules-sap/pp" },
];

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-sapBlue/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3">
        <Link to="/" className="flex items-center gap-2">
          {/* Icône logo */}
          <div
            className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sapBlue to-sapBlueDark
                  flex items-center justify-center text-xs font-bold text-white shadow-soft"
          >
            HF
          </div>
          {/* Nom du site */}
          <span className="text-sm sm:text-base font-semibold tracking-wide text-white">
            HanaFlow
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-1 relative">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Accueil
          </NavLink>

          <NavLink
            to="/modules-sap"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Vue modules
          </NavLink>

          {/* Mega-menu Modules */}
          <div
            className="relative"
            onMouseEnter={() => setOpenModules(true)}
            onMouseLeave={() => setOpenModules(false)}
          >
            <button
              type="button"
              className={`${navLinkBase} ${navLinkInactive} flex items-center gap-1`}
            >
              Modules SAP
              <span className="text-[10px]">▼</span>
            </button>

            {openModules && (
              <div className="absolute left-0 top-full mt-2 w-[520px] bg-white dark:bg-slate-900 border border-sapBlue/15 rounded-2xl shadow-soft p-4 grid grid-cols-2 gap-3 text-xs">
                {moduleLinks.map((m) => (
                  <Link
                    key={m.code}
                    to={m.path}
                    onClick={() => setOpenModules(false)}
                    className="flex flex-col items-start text-left rounded-xl px-3 py-2 hover:bg-sapBlue/5 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-[11px] font-semibold text-sapBlue mb-0.5">
                      Module {m.code}
                    </span>
                    <span className="text-[12px] text-slate-700 dark:text-slate-200">
                      {m.label}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/s4hana"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            S/4HANA
          </NavLink>

          <NavLink
            to="/ai-joule"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            IA & Joule
          </NavLink>

          <NavLink
            to="/processus-metier"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Processus métier
          </NavLink>

          <NavLink
            to="/roadmap"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            Roadmap consultant
          </NavLink>

          <NavLink
            to="/a-propos"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
          >
            À propos
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/dashboard" className={linkClasses}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Zone droite */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
