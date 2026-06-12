/**
 * Diagramme de flux SAP générique (P2P, O2C, R2R…).
 *
 * Server-component-safe : pas de hook, pas d'état. Les étapes sont rendues en
 * chips reliées par des flèches SVG ; le layout passe automatiquement en
 * vertical sur mobile (< sm) pour rester lisible à 375 px.
 */

export type FlowStep = {
  /** Libellé principal (ex: "Commande MM"). */
  label: string;
  /** Précision optionnelle (T-code, module : "ME21N", "FI-AP"…). */
  sublabel?: string;
  /** Classes Tailwind du chip — par défaut bleu SAP. */
  color?: string;
};

const DEFAULT_CHIP =
  "bg-sap-blue/10 border-sap-blue/30 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent";

const ArrowRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="hidden sm:block text-slate-300 dark:text-slate-600 flex-shrink-0"
  >
    <line x1="4" y1="12" x2="20" y2="12" />
    <polyline points="14 6 20 12 14 18" />
  </svg>
);

const ArrowDown = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="sm:hidden text-slate-300 dark:text-slate-600"
  >
    <line x1="12" y1="4" x2="12" y2="20" />
    <polyline points="6 14 12 20 18 14" />
  </svg>
);

export default function FlowDiagram({
  steps,
  title,
}: {
  steps: FlowStep[];
  /** Description accessible du diagramme (aria-label). */
  title: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${title} : ${steps.map((s) => s.label).join(" → ")}`}
      className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-2 sm:gap-1.5 py-4 px-3
                 rounded-xl bg-gray-50/80 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700"
    >
      {steps.map((step, i) => (
        <div key={step.label} className="contents">
          {i > 0 && (
            <>
              <ArrowRight />
              <ArrowDown />
            </>
          )}
          <div
            className={`flex flex-col items-center justify-center text-center px-3 py-2 rounded-lg border
                        min-w-[7.5rem] ${step.color ?? DEFAULT_CHIP}`}
          >
            <span className="text-xs font-semibold leading-tight">{step.label}</span>
            {step.sublabel && (
              <span className="text-[10px] font-mono opacity-70 mt-0.5">{step.sublabel}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
