import Link from "next/link";

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const courses = [
  { href: "/modules-sap/fi",  label: "FI — Finance" },
  { href: "/modules-sap/co",  label: "CO — Controlling" },
  { href: "/modules-sap/mm",  label: "MM — Achats" },
  { href: "/modules-sap/sd",  label: "SD — Ventes" },
  { href: "/modules-sap/hcm", label: "HCM — RH" },
  { href: "/modules-sap/pp",  label: "PP — Production" },
];

const platform = [
  { href: "/",                 label: "Accueil" },
  { href: "/modules-sap",      label: "Vue des modules" },
  { href: "/s4hana",           label: "S/4HANA" },
  { href: "/ai-joule",         label: "IA & Joule" },
  { href: "/processus-metier", label: "Processus métier" },
  { href: "/roadmap",          label: "Roadmap consultant" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Branding */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-xl bg-linear-to-br from-sap-blue to-sap-blue-dark
                              flex items-center justify-center text-[11px] font-bold text-white">
                HF
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">HanaFlow</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Master SAP Learning Platform — la référence pour apprendre SAP S/4HANA et se préparer à une carrière de consultant.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/in/wissam-tahiri-730a47326" target="_blank" rel="noreferrer"
                 aria-label="LinkedIn de Wissam Tahiri"
                 className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800
                            text-slate-500 hover:bg-sap-blue hover:text-white transition-all duration-150">
                <LinkedInIcon />
              </a>
              <a href="https://github.com/WissamTahiri" target="_blank" rel="noreferrer"
                 aria-label="GitHub de Wissam Tahiri"
                 className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800
                            text-slate-500 hover:bg-slate-800 hover:text-white transition-all duration-150">
                <GitHubIcon />
              </a>
              <a href="mailto:wisstahiri91@gmail.com" aria-label="Envoyer un email"
                 className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800
                            text-slate-500 hover:bg-sap-blue hover:text-white transition-all duration-150">
                <MailIcon />
              </a>
            </div>
          </div>

          {/* Plateforme */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Plateforme</h3>
            <ul className="space-y-2.5">
              {platform.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-sap-blue dark:hover:text-sap-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Modules SAP */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Modules SAP</h3>
            <ul className="space-y-2.5">
              {courses.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-sap-blue dark:hover:text-sap-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">À propos</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/a-propos", label: "Le projet" },
                { href: "/contact",  label: "Contact" },
                { href: "/register", label: "S'inscrire gratuitement" },
                { href: "/login",    label: "Se connecter" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-sap-blue dark:hover:text-sap-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-4">
          <nav aria-label="Liens légaux" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { href: "/cgu",              label: "CGU" },
              { href: "/confidentialite",  label: "Confidentialité" },
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/contact",          label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-sap-blue transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} HanaFlow — Par Wissam Tahiri.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Plateforme éducative SAP · Non affilié à SAP SE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
