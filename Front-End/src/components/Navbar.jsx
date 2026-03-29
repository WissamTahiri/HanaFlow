import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle.jsx";

// --- Icônes SVG inline ---
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// --- Modules SAP ---
const moduleLinks = [
  { code: "FI",  label: "Financial Accounting",  path: "/modules-sap/fi",  color: "text-blue-600 dark:text-blue-400" },
  { code: "CO",  label: "Controlling",            path: "/modules-sap/co",  color: "text-indigo-600 dark:text-indigo-400" },
  { code: "MM",  label: "Materials Management",   path: "/modules-sap/mm",  color: "text-emerald-600 dark:text-emerald-400" },
  { code: "SD",  label: "Sales & Distribution",   path: "/modules-sap/sd",  color: "text-orange-600 dark:text-orange-400" },
  { code: "HCM", label: "Human Capital Mgmt",     path: "/modules-sap/hcm", color: "text-purple-600 dark:text-purple-400" },
  { code: "PP",  label: "Production Planning",    path: "/modules-sap/pp",  color: "text-rose-600 dark:text-rose-400" },
];

// --- Styles partagés ---
const navLinkBase = "text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-150";
const navLinkActive = "bg-sapBlue/10 text-sapBlue dark:bg-sapBlue/20 dark:text-sapAccent";
const navLinkInactive = "text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-sapBlue dark:hover:text-white";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [openModules, setOpenModules]   = useState(false);
  const [openUser, setOpenUser]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [scrolled, setScrolled]         = useState(false);

  const modulesRef = useRef(null);
  const userRef    = useRef(null);

  // Ombrer la navbar au scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer les menus en cliquant dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (modulesRef.current && !modulesRef.current.contains(e.target)) setOpenModules(false);
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fermer le menu mobile au changement de route
  const handleNavClick = () => {
    setMobileOpen(false);
    setOpenModules(false);
    setOpenUser(false);
  };

  const handleLogout = async () => {
    handleNavClick();
    await logout();
    navigate("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md
                    border-b border-gray-100 dark:border-slate-800 transition-shadow duration-300
                    ${scrolled ? "shadow-card" : ""}`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">

          {/* Logo */}
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sapBlue to-sapBlueDark
                            flex items-center justify-center text-[11px] font-bold text-white shadow-soft">
              HF
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              HanaFlow
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            <NavLink to="/" end className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              Accueil
            </NavLink>
            <NavLink to="/modules-sap" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              Vue modules
            </NavLink>

            {/* Mega-menu Modules SAP */}
            <div className="relative" ref={modulesRef}>
              <button
                type="button"
                onClick={() => setOpenModules((o) => !o)}
                className={`${navLinkBase} ${navLinkInactive} flex items-center gap-1.5`}
                aria-expanded={openModules}
                aria-haspopup="true"
              >
                Modules SAP
                <span className={`transition-transform duration-200 ${openModules ? "rotate-180" : ""}`}>
                  <ChevronDown />
                </span>
              </button>

              {openModules && (
                <div className="absolute left-0 top-full mt-2 w-[480px] bg-white dark:bg-slate-900
                                border border-gray-100 dark:border-slate-700 rounded-2xl shadow-large
                                p-3 grid grid-cols-2 gap-1 animate-slide-down z-50">
                  {moduleLinks.map((m) => (
                    <Link
                      key={m.code}
                      to={m.path}
                      onClick={() => { setOpenModules(false); handleNavClick(); }}
                      className="flex items-start gap-3 rounded-xl px-3 py-2.5
                                 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <span className={`text-xs font-bold mt-0.5 w-8 flex-shrink-0 ${m.color}`}>
                        {m.code}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {m.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/s4hana" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              S/4HANA
            </NavLink>
            <NavLink to="/ai-joule" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              IA & Joule
            </NavLink>
            <NavLink to="/processus-metier" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              Processus
            </NavLink>
            <NavLink to="/roadmap" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              Roadmap
            </NavLink>
            <NavLink to="/certifications" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} flex items-center gap-1.5`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Certifications
            </NavLink>
          </nav>

          {/* Zone droite */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {/* Authentifié → avatar dropdown */}
            {isAuthenticated ? (
              <div className="relative hidden lg:block" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setOpenUser((o) => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200
                             dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium
                             text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700
                             transition-colors"
                  aria-expanded={openUser}
                >
                  <div className="h-6 w-6 rounded-full bg-sapBlue flex items-center justify-center">
                    <UserIcon />
                  </div>
                  <span className="max-w-[100px] truncate text-white">{user?.name}</span>
                  <span className={`transition-transform duration-200 ${openUser ? "rotate-180" : ""}`}>
                    <ChevronDown />
                  </span>
                </button>

                {openUser && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900
                                  border border-gray-100 dark:border-slate-700 rounded-2xl shadow-large
                                  p-1.5 animate-slide-down z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => { setOpenUser(false); handleNavClick(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm
                                 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profil"
                      onClick={() => { setOpenUser(false); handleNavClick(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm
                                 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                      Mon profil
                    </Link>
                    <hr className="my-1 border-gray-100 dark:border-slate-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm
                                 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login" className="btn-ghost px-4 py-2 text-sm font-medium rounded-xl">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Bouton hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl
                         border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300
                         hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        </div>
      )}

      <nav
        className={`fixed top-16 inset-x-0 z-30 lg:hidden bg-white dark:bg-slate-900 border-b
                    border-gray-100 dark:border-slate-800 shadow-large overflow-y-auto max-h-[calc(100vh-4rem)]
                    transition-all duration-300 ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        aria-label="Navigation mobile"
      >
        <div className="px-4 py-4 space-y-1">
          {[
            { to: "/",                 label: "Accueil",          end: true },
            { to: "/modules-sap",      label: "Vue modules" },
            { to: "/s4hana",           label: "S/4HANA" },
            { to: "/ai-joule",         label: "IA & Joule" },
            { to: "/processus-metier", label: "Processus métier" },
            { to: "/roadmap",          label: "Roadmap consultant" },
            { to: "/a-propos",         label: "À propos" },
            { to: "/certifications",   label: "Certifications" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                 ${isActive ? "bg-sapBlue/10 text-sapBlue dark:text-sapAccent" : "text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"}`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Modules SAP section */}
          <div className="pt-2 pb-1">
            <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Modules SAP
            </p>
            <div className="grid grid-cols-2 gap-1">
              {moduleLinks.map((m) => (
                <Link
                  key={m.code}
                  to={m.path}
                  onClick={handleNavClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm
                             text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  <span className={`text-xs font-bold ${m.color}`}>{m.code}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{m.label.split(" ")[0]}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth mobile */}
          <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={handleNavClick} className="block w-full text-center btn-primary">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-center">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleNavClick} className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  Connexion
                </Link>
                <Link to="/register" onClick={handleNavClick} className="block w-full text-center btn-primary">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
