import { Link } from "react-router-dom";

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const cols = [
  {
    title: "Plateforme",
    links: [
      { to: "/",                 label: "Accueil" },
      { to: "/modules-sap",      label: "Modules SAP" },
      { to: "/s4hana",           label: "S/4HANA" },
      { to: "/ai-joule",         label: "IA & Joule" },
      { to: "/processus-metier", label: "Processus métier" },
      { to: "/roadmap",          label: "Roadmap" },
    ],
  },
  {
    title: "Modules",
    links: [
      { to: "/modules-sap/fi",  label: "FI — Finance" },
      { to: "/modules-sap/co",  label: "CO — Controlling" },
      { to: "/modules-sap/mm",  label: "MM — Achats" },
      { to: "/modules-sap/sd",  label: "SD — Ventes" },
      { to: "/modules-sap/hcm", label: "HCM — RH" },
      { to: "/modules-sap/pp",  label: "PP — Production" },
    ],
  },
  {
    title: "Certifications",
    links: [
      { to: "/certifications",     label: "Vue d'ensemble" },
      { to: "/certifications/fi",  label: "Prép. FI" },
      { to: "/certifications/co",  label: "Prép. CO" },
      { to: "/certifications/mm",  label: "Prép. MM" },
      { to: "/pricing",            label: "Tarifs" },
      { to: "/a-propos",           label: "À propos" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 overflow-hidden">
      {/* Glow subtil */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-sapBlue/10 blur-[80px]" />
      </div>

      {/* Ligne dégradée en haut */}
      <div className="gradient-line" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Branding */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <span className="font-display text-2xl font-bold tracking-display">
                <span className="text-sapAccent">Hana</span>
                <span className="text-white">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-[220px]">
              La référence pour apprendre SAP S/4HANA et préparer une carrière de consultant.
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { href: "https://www.linkedin.com/in/wissam-tahiri-730a47326", icon: <LinkedInIcon />, label: "LinkedIn" },
                { href: "https://github.com/WissamTahiri", icon: <GitHubIcon />, label: "GitHub" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="h-8 w-8 flex items-center justify-center rounded-lg
                             bg-white/6 border border-white/8 text-slate-500
                             hover:bg-white/12 hover:text-white hover:border-white/20
                             transition-all duration-150">
                  {icon}
                </a>
              ))}
              <a href="mailto:contact@hanaflow.fr"
                className="h-8 px-3 flex items-center gap-1.5 rounded-lg text-xs font-medium
                           bg-white/6 border border-white/8 text-slate-500
                           hover:bg-white/12 hover:text-white hover:border-white/20
                           transition-all duration-150">
                Contact
              </a>
            </div>
          </div>

          {/* Colonnes liens */}
          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to}
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} HanaFlow — par Wissam Tahiri
          </p>
          <p className="text-xs text-slate-700">
            Plateforme éducative · Non affilié à SAP SE
          </p>
        </div>
      </div>
    </footer>
  );
}
