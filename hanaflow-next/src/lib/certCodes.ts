import certCatalog from "@/data/cert-catalog.json";

/**
 * Codes d'examen officiels par module — source de vérité cert-catalog.json
 * (mis à jour par scripts/sap-cert-watch.mjs).
 *
 * Module volontairement SANS "server-only" : le catalogue est déjà bundlé
 * côté client (home, comparateur, page certifications) ; certAccess.ts
 * (server-only) peut importer ce module neutre, l'inverse est interdit.
 */
const CODES = Object.fromEntries(
  certCatalog.modules.map((m) => [m.code.toLowerCase(), m.cert]),
) as Record<string, string>;

/** Code examen officiel d'un module — échoue fort si le catalogue diverge. */
export function certCode(moduleId: string): string {
  const code = CODES[moduleId.toLowerCase()];
  if (!code) {
    throw new Error(
      `cert-catalog.json ne contient pas le module "${moduleId}" — synchroniser le code appelant et le catalogue.`,
    );
  }
  return code;
}
