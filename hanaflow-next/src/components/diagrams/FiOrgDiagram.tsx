/**
 * Arbre de la structure d'organisation FI :
 * Client SAP → Company Code → (Chart of Accounts, Fiscal Year Variant,
 * Posting Period Variant). Lignes de connexion en CSS (borders), pas de JS.
 */

const LEAVES = [
  { label: "Chart of Accounts", desc: "Plan de comptes GL" },
  { label: "Fiscal Year Variant", desc: "Exercice & périodes" },
  { label: "Posting Period Variant", desc: "Ouverture / clôture" },
];

export default function FiOrgDiagram() {
  return (
    <div
      role="img"
      aria-label="Structure FI : le Client SAP contient le Company Code (entité légale), auquel sont rattachés le Chart of Accounts, le Fiscal Year Variant et le Posting Period Variant."
      className="py-4 px-3 rounded-xl bg-gray-50/80 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700"
    >
      {/* Racine */}
      <div className="flex justify-center">
        <div className="px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold">
          Client SAP <span className="font-normal opacity-70">(mandant)</span>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" aria-hidden />
      </div>

      {/* Company Code */}
      <div className="flex justify-center">
        <div className="px-4 py-2 rounded-lg bg-sap-blue text-white text-xs font-bold">
          Company Code <span className="font-normal opacity-80">(entité légale)</span>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" aria-hidden />
      </div>

      {/* Connecteur horizontal vers les 3 feuilles */}
      <div className="mx-auto max-w-md border-t border-slate-300 dark:border-slate-600 relative" aria-hidden>
        <div className="absolute left-[16.66%] -translate-x-1/2 w-px h-3 bg-slate-300 dark:bg-slate-600" />
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-3 bg-slate-300 dark:bg-slate-600" />
        <div className="absolute left-[83.33%] -translate-x-1/2 w-px h-3 bg-slate-300 dark:bg-slate-600" />
      </div>

      <div className="mx-auto max-w-md grid grid-cols-3 gap-2 pt-3">
        {LEAVES.map((leaf) => (
          <div
            key={leaf.label}
            className="px-2 py-2 rounded-lg border border-sap-blue/30 bg-sap-blue/5 dark:bg-sap-blue/15 text-center"
          >
            <p className="text-[11px] font-semibold text-sap-blue dark:text-sap-accent leading-tight">
              {leaf.label}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{leaf.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
