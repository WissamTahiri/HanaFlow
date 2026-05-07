import type { ReactNode } from "react";

export default function LegalPage({
  title,
  subtitle,
  lastUpdated,
  children,
}: {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-sap-dark">
      <div className="bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-400 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
            Informations légales
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{title}</h1>
          {subtitle && <p className="text-white/80 text-base sm:text-lg">{subtitle}</p>}
          <p className="mt-4 text-xs text-white/60">
            Dernière mise à jour : <span className="font-semibold text-white/80">{lastUpdated}</span>
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 legal-content">
        {children}
      </article>
    </div>
  );
}
