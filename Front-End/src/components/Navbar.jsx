import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle.jsx";

/* ─── Icônes ──────────────────────────────────────────────── */
const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─── Données ─────────────────────────────────────────────── */
const moduleLinks = [
  { code: "FI",  label: "Financial Accounting", path: "/modules-sap/fi",  color: "#3B82F6" },
  { code: "CO",  label: "Controlling",          path: "/modules-sap/co",  color: "#8B5CF6" },
  { code: "MM",  label: "Materials Management", path: "/modules-sap/mm",  color: "#10B981" },
  { code: "SD",  label: "Sales & Distribution", path: "/modules-sap/sd",  color: "#F59E0B" },
  { code: "HCM", label: "Human Capital Mgmt",   path: "/modules-sap/hcm", color: "#EC4899" },
  { code: "PP",  label: "Production Planning",  path: "/modules-sap/pp",  color: "#EF4444" },
];

/* ─── Pages avec hero dark (navbar transparente au top) ───── */
const DARK_HERO_PAGES = ["/"];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [openModules, setOpenModules] = useState(false);
  const [openUser,    setOpenUser]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  const modulesRef = useRef(null);
  const userRef    = useRef(null);

  const isOnDarkHero = DARK_HERO_PAGES.includes(location.pathname);
  const isTransparent = isOnDarkHero && !scrolled;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Ferme les dropdowns au clic extérieur */
  useEffect(() => {
    const handler = (e) => {
      if (modulesRef.current && !modulesRef.current.contains(e.target)) setOpenModules(false);
      if (userRef.current    && !userRef.current.contains(e.target))    setOpenUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Reset mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setOpenModules(false);
    setOpenUser(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* ── Styles dynamiques selon état ──────────────────────── */
  const headerClass = isTransparent
    ? // Transparent sur hero dark
      "fixed top-0 inset-x-0 z-40 transition-all duration-500"
    : scrolled
      ? // Floating pill au scroll
        "fixed top-3 inset-x-0 z-40 transition-all duration-500"
      : // Par défaut (pages sans hero dark)
        "fixed top-0 inset-x-0 z-40 transition-all duration-500";

  const innerClass = isTransparent
    ? "mx-auto flex items-center justify-between px-6 sm:px-10 h-[4.5rem] max-w-7xl"
    : scrolled
      ? // Pill flottante
        "mx-auto flex items-center justify-between px-5 h-14 max-w-5xl rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-gray-200/60 dark:border-slate-700/60"
      : "mx-auto flex items-center justify-between px-6 sm:px-10 h-[4.5rem] max-w-7xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800";

  const logoColor = isTransparent
    ? "text-white"
    : "text-slate-900 dark:text-white";

  const logoAccent = isTransparent
    ? "text-sapAccent"
    : "text-sapBlue dark:text-sapAccent";

  const linkBase = "text-sm font-medium px-3 py-1.5 rounded-xl transition-all duration-150 whitespace-nowrap";

  const linkInactive = isTransparent
    ? "text-white/70 hover:text-white hover:bg-white/10"
    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60";

  const linkActive = isTransparent
    ? "text-white font-semibold bg-white/15"
    : "bg-sapBlue/[0.08] text-sapBlue dark:bg-sapBlue/20 dark:text-sapAccent font-semibold";

  return (
    <>
      <header className={headerClass}>
        <div className={innerClass}>

          {/* ── Logo ─────────────────────────────────────── */}
          <Link to="/" className="flex-shrink-0 leading-none select-none">
            <span className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 ${logoColor}`}>
              <span className={`transition-colors duration-300 ${logoAccent}`}>Hana</span>Flow
            </span>
          </Link>

          {/* ── Navigation desktop ───────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navigation principale">

            <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
              Accueil
            </NavLink>

            {/* Dropdown Modules */}
            <div className="relative" ref={modulesRef}>
              <button
                type="button"
                onClick={() => setOpenModules((o) => !o)}
                className={`${linkBase} ${linkInactive} flex items-center gap-1.5`}
                aria-expanded={openModules}
              >
                Modules SAP
                <span className={`transition-transform duration-200 ${openModules ? "rotate-180" : ""}`}>
                  <ChevronDown />
                </span>
              </button>

              {openModules && (
                <div className="absolute left-0 top-full mt-3 w-[480px] bg-white dark:bg-slate-900
                                border border-gray-100 dark:border-slate-700/80 rounded-2xl
                                shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
                                p-3 grid grid-cols-2 gap-1 animate-slide-down z-50">
                  <p className="col-span-2 px-2 pb-2.5 mb-1 border-b border-gray-100 dark:border-slate-800
                                text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Modules SAP ERP
                  </p>
                  {moduleLinks.map((m) => (
                    <Link
                      key={m.code}
                      to={m.path}
                      onClick={() => setOpenModules(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 group
                                 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span
                        className="text-[10px] font-bold w-9 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ background: `${m.color}18`, color: m.color }}
                      >
                        {m.code}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {m.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/s4hana"           className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>S/4HANA</NavLink>
            <NavLink to="/ai-joule"         className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>IA & Joule</NavLink>
            <NavLink to="/processus-metier" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Processus</NavLink>
            <NavLink to="/roadmap"          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Roadmap</NavLink>

            <span className="mx-1.5 h-4 w-px bg-current opacity-10 flex-shrink-0" aria-hidden="true" />

            <NavLink to="/certifications" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive} flex items-center gap-1.5`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              Certifications
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>Tarifs</NavLink>
          </nav>

          {/* ── Zone droite ──────────────────────────────── */}
          <div className="flex items-center gap-2">
            <DarkModeToggle />

            {isAuthenticated ? (
              <div className="relative hidden lg:block" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setOpenUser((o) => !o)}
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl border text-sm font-medium
                              transition-all duration-150 ${
                    isTransparent
                      ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                      : "border-gray-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                  aria-expanded={openUser}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sapBlue to-sapBlueDark
                                  flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className="max-w-[80px] truncate">{user?.name}</span>
                  <span className={`transition-transform duration-200 opacity-50 ${openUser ? "rotate-180" : ""}`}>
                    <ChevronDown />
                  </span>
                </button>

                {openUser && (
                  <div className="absolute right-0 top-full mt-2.5 w-52 bg-white dark:bg-slate-900
                                  border border-gray-100 dark:border-slate-700 rounded-2xl
                                  shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]
                                  p-2 animate-slide-down z-50">
                    <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sapBlue to-sapBlueDark
                                      flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                    </div>
                    <hr className="border-gray-100 dark:border-slate-800 mx-2 mb-1" />
                    {[
                      { to: "/dashboard",    label: "Dashboard" },
                      { to: "/profil",       label: "Mon profil" },
                      { to: "/achievements", label: "Achievements" },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} onClick={() => setOpenUser(false)}
                        className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm
                                   text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800
                                   hover:text-slate-900 dark:hover:text-white transition-colors">
                        {label}
                      </Link>
                    ))}
                    <hr className="my-1 border-gray-100 dark:border-slate-800 mx-2" />
                    <button onClick={handleLogout}
                      className="flex w-full px-3 py-2.5 rounded-xl text-sm text-red-500
                                 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
                    isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60"
                  }`}>
                  Connexion
                </Link>
                <Link to="/register"
                  className={`btn-cta text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                    isTransparent
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-sapBlue text-white hover:bg-sapBlueDark shadow-sm"
                  }`}>
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className={`lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border transition-colors ${
                isTransparent
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Overlay mobile ───────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </div>
      )}

      {/* ── Menu mobile ──────────────────────────────────── */}
      <nav
        className={`fixed top-[4.5rem] inset-x-0 z-30 lg:hidden
                    bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800
                    shadow-large overflow-y-auto max-h-[calc(100vh-4.5rem)]
                    transition-all duration-300
                    ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
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
            { to: "/certifications",   label: "Certifications" },
            { to: "/pricing",          label: "Tarifs" },
          ].map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                 ${isActive
                   ? "bg-sapBlue/[0.08] text-sapBlue dark:text-sapAccent font-semibold"
                   : "text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"}`
              }>
              {label}
            </NavLink>
          ))}

          {/* Modules */}
          <div className="pt-3 pb-1">
            <p className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Modules SAP</p>
            <div className="grid grid-cols-2 gap-1">
              {moduleLinks.map((m) => (
                <Link key={m.code} to={m.path}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                             text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-[10px] font-bold w-8 h-6 flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ background: `${m.color}18`, color: m.color }}>
                    {m.code}
                  </span>
                  <span className="text-xs">{m.label.split(" ")[0]}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth mobile */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block w-full text-center btn-primary py-2.5">Dashboard</Link>
                <button onClick={handleLogout}
                  className="block w-full px-4 py-2.5 rounded-xl text-sm font-medium
                             text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-center transition-colors">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium
                             border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200
                             hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="block w-full text-center btn-primary py-2.5">
                  S'inscrire gratuitement
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
