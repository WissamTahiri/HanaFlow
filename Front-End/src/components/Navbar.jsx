import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle.jsx";

// --- Icônes ---
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

// --- Modules SAP ---
const moduleLinks = [
  { code: "FI",  label: "Financial Accounting",  path: "/modules-sap/fi",  color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20" },
  { code: "CO",  label: "Controlling",            path: "/modules-sap/co",  color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  { code: "MM",  label: "Materials Management",   path: "/modules-sap/mm",  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { code: "SD",  label: "Sales & Distribution",   path: "/modules-sap/sd",  color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { code: "HCM", label: "Human Capital Mgmt",     path: "/modules-sap/hcm", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { code: "PP",  label: "Production Planning",    path: "/modules-sap/pp",  color: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-900/20" },
];

// --- Styles partagés ---
const navLinkBase = "text-sm font-medium px-4 py-2 rounded-xl transition-all duration-150 whitespace-nowrap";
const navLinkActive = "bg-sapBlue/[0.08] text-sapBlue dark:bg-sapBlue/20 dark:text-sapAccent font-semibold";
const navLinkInactive = "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [openModules, setOpenModules] = useState(false);
  const [openUser, setOpenUser]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);

  const modulesRef = useRef(null);
  const userRef    = useRef(null);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (modulesRef.current && !modulesRef.current.contains(e.target)) setOpenModules(false);
      if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
                    ${scrolled ? "shadow-[0_1px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_1px_20px_rgba(0,0,0,0.25)]" : ""}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 h-[4.5rem]">

          {/* ── Logo texte ── */}
          <Link to="/" onClick={handleNavClick} className="flex-shrink-0 leading-none select-none">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-sapBlue dark:text-sapAccent">Hana</span>
              <span className="text-slate-900 dark:text-white">Flow</span>
            </span>
          </Link>

          {/* ── Navigation desktop ── */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navigation principale">

            <NavLink to="/" end className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              Accueil
            </NavLink>

            {/* Dropdown Modules SAP */}
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
                <div className="absolute left-0 top-full mt-2.5 w-[520px] bg-white dark:bg-slate-900
                                border border-gray-100 dark:border-slate-700 rounded-2xl
                                shadow-[0_8px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)]
                                p-4 grid grid-cols-2 gap-1 animate-slide-down z-50">
                  <div className="col-span-2 px-2 pb-3 mb-1 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em]">
                      Modules SAP ERP
                    </p>
                  </div>
                  {moduleLinks.map((m) => (
                    <Link
                      key={m.code}
                      to={m.path}
                      onClick={() => { setOpenModules(false); handleNavClick(); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-3
                                 hover:bg-gray-50/80 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <span className={`text-[10px] font-bold w-9 h-7 flex items-center justify-center
                                        rounded-lg flex-shrink-0 ${m.color} ${m.bg}`}>
                        {m.code}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900
                                       dark:group-hover:text-white transition-colors">
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

            {/* Séparateur visuel */}
            <span className="mx-2 h-5 w-px bg-gray-200 dark:bg-slate-700 flex-shrink-0" aria-hidden="true" />

            <NavLink to="/certifications" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive} flex items-center gap-1.5`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Certifications
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`}>
              Tarifs
            </NavLink>
          </nav>

          {/* ── Zone droite ── */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />

            {/* Authentifié → user dropdown */}
            {isAuthenticated ? (
              <div className="relative hidden lg:block" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setOpenUser((o) => !o)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200/80
                             dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm font-medium
                             text-slate-700 dark:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600
                             hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-150"
                  aria-expanded={openUser}
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sapBlue to-sapBlueDark
                                  flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className="max-w-[90px] truncate">{user?.name}</span>
                  <span className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${openUser ? "rotate-180" : ""}`}>
                    <ChevronDown />
                  </span>
                </button>

                {openUser && (
                  <div className="absolute right-0 top-full mt-2.5 w-56 bg-white dark:bg-slate-900
                                  border border-gray-100 dark:border-slate-700 rounded-2xl
                                  shadow-[0_8px_40px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.35)]
                                  p-2 animate-slide-down z-50">
                    {/* Identité */}
                    <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sapBlue to-sapBlueDark
                                      flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-tight">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">{user?.email}</p>
                      </div>
                    </div>
                    <hr className="border-gray-100 dark:border-slate-800 mx-2 mb-1" />
                    {[
                      { to: "/dashboard",    label: "Dashboard" },
                      { to: "/profil",       label: "Mon profil" },
                      { to: "/achievements", label: "🏅 Achievements" },
                    ].map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => { setOpenUser(false); handleNavClick(); }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm
                                   text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800
                                   hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <hr className="my-1 border-gray-100 dark:border-slate-800 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm
                                 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900
                             dark:hover:text-white px-4 py-2 rounded-xl hover:bg-gray-100/80
                             dark:hover:bg-slate-800/60 transition-all"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-sapBlue text-white px-4 py-2 rounded-xl
                             hover:bg-sapBlueDark transition-colors shadow-sm"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl
                         border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400
                         hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Menu mobile */}
      <nav
        className={`fixed top-[4.5rem] inset-x-0 z-30 lg:hidden bg-white dark:bg-slate-900 border-b
                    border-gray-100 dark:border-slate-800 shadow-large overflow-y-auto max-h-[calc(100vh-4.5rem)]
                    transition-all duration-300 ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        aria-label="Navigation mobile"
      >
        <div className="px-4 py-5 space-y-0.5">
          {[
            { to: "/",                 label: "Accueil",           end: true },
            { to: "/modules-sap",      label: "Vue modules" },
            { to: "/s4hana",           label: "S/4HANA" },
            { to: "/ai-joule",         label: "IA & Joule" },
            { to: "/processus-metier", label: "Processus métier" },
            { to: "/roadmap",          label: "Roadmap consultant" },
            { to: "/a-propos",         label: "À propos" },
            { to: "/certifications",   label: "Certifications" },
            { to: "/pricing",          label: "Tarifs" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                 ${isActive
                   ? "bg-sapBlue/[0.08] text-sapBlue dark:text-sapAccent font-semibold"
                   : "text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                 }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Modules SAP section */}
          <div className="pt-4 pb-1">
            <p className="px-4 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] mb-2">
              Modules SAP
            </p>
            <div className="grid grid-cols-2 gap-1">
              {moduleLinks.map((m) => (
                <Link
                  key={m.code}
                  to={m.path}
                  onClick={handleNavClick}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                             text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className={`text-[10px] font-bold w-8 h-6 flex items-center justify-center rounded-lg flex-shrink-0 ${m.color} ${m.bg}`}>
                    {m.code}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{m.label.split(" ")[0]}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth mobile */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={handleNavClick} className="block w-full text-center btn-primary py-2.5">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500
                             hover:bg-red-50 dark:hover:bg-red-900/20 text-center transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium
                             border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200
                             hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Connexion
                </Link>
                <Link to="/register" onClick={handleNavClick} className="block w-full text-center btn-primary py-2.5">
                  S'inscrire gratuitement
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
