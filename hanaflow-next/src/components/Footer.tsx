import Link from "next/link";
import { CONTACT } from "@/config/contact";

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
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const courses = [
  { href: "/modules-sap/fi",  label: "FI — Finance" },
  { href: "/modules-sap/co",  label: "CO — Controlling" },
  { href: "/modules-sap/mm",  label: "MM — Achats" },
  { href: "/modules-sap/sd",  label: "SD — Ventes" },
  { href: "/modules-sap/ai",  label: "AI — IA Générative" },
  { href: "/modules-sap/pp",  label: "PP — Production" },
];

// Navigation secondaire : ces pages ne sont volontairement pas dans la navbar
// (allégée à 5 entrées) — le footer est leur point d'accès permanent.
const platform = [
  { href: "/",                        label: "Accueil" },
  { href: "/modules-sap",             label: "Vue des modules" },
  { href: "/s4hana",                  label: "S/4HANA" },
  { href: "/ai-joule",                label: "IA & Joule" },
  { href: "/processus-metier",        label: "Processus métier" },
  { href: "/roadmap",                 label: "Roadmap consultant" },
  { href: "/certifications/comparer", label: "Comparer les certifications" },
];

const about = [
  { href: "/a-propos",    label: "Le projet" },
  { href: "/ecoles",      label: "Pour les écoles" },
  { href: "/entreprises", label: "Pour les entreprises" },
  { href: "/contact",     label: "Contact" },
  { href: "/register",    label: "S'inscrire gratuitement" },
  { href: "/login",       label: "Se connecter" },
];

const legal = [
  { href: "/cgu",              label: "CGU" },
  { href: "/confidentialite",  label: "Confidentialité" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/contact",          label: "Contact" },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 relative inline-block">
        {title}
        <span className="absolute -bottom-1.5 left-0 h-0.5 w-6 rounded-full bg-sap-blue dark:bg-sap-accent" aria-hidden="true" />
      </h3>
      <ul className="space-y-3 mt-5">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-sap-blue dark:hover:text-sap-accent transition-colors"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-slate-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-sap-blue via-sap-accent to-sap-blue-dark" aria-hidden="true" />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 sm:py-16">

        {/* Marque + accroche */}
        <div className="flex flex-col gap-6 pb-10 border-b border-gray-200 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sap-blue to-sap-blue-dark text-[12px] font-bold text-white shadow-sm">
                HF
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">HanaFlow</span>
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
              Apprendre SAP S/4HANA, préparer ses certifications et construire une carrière de consultant.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer"
               aria-label="LinkedIn de Wissam Tahiri"
               className="h-9 w-9 flex items-center justify-center rounded-lg bg-sap-blue/10 dark:bg-sap-blue/15 text-sap-blue dark:text-sap-accent hover:bg-sap-blue hover:text-white transition-all duration-150">
              <LinkedInIcon />
            </a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer"
               aria-label="GitHub de Wissam Tahiri"
               className="h-9 w-9 flex items-center justify-center rounded-lg bg-sap-blue/10 dark:bg-sap-blue/15 text-sap-blue dark:text-sap-accent hover:bg-slate-800 hover:text-white transition-all duration-150">
              <GitHubIcon />
            </a>
            <a href={`mailto:${CONTACT.email}`} aria-label="Envoyer un email"
               className="h-9 w-9 flex items-center justify-center rounded-lg bg-sap-blue/10 dark:bg-sap-blue/15 text-sap-blue dark:text-sap-accent hover:bg-sap-blue hover:text-white transition-all duration-150">
              <MailIcon />
            </a>
          </div>
        </div>

        {/* Colonnes de navigation */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 sm:grid-cols-3">
          <FooterColumn title="Plateforme" links={platform} />
          <FooterColumn title="Modules SAP" links={courses} />
          <FooterColumn title="À propos" links={about} />
        </div>

        {/* Bas de page */}
        <div className="pt-6 border-t border-gray-200 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400 order-2 sm:order-1">
            © {new Date().getFullYear()} HanaFlow — Par Wissam Tahiri · Non affilié à SAP SE
          </p>
          <nav aria-label="Liens légaux" className="order-1 sm:order-2 flex flex-wrap items-center gap-x-5 gap-y-2">
            {legal.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-sap-blue dark:hover:text-sap-accent transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
