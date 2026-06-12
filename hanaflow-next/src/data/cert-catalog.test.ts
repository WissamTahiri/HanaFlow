import { describe, expect, it } from "vitest";
import certCatalog from "./cert-catalog.json";
import { fiCertification } from "./certifications/fi.js";
import { coCertification } from "./certifications/co.js";
import { mmCertification } from "./certifications/mm.js";
import { sdCertification } from "./certifications/sd.js";
import { ppCertification } from "./certifications/pp.js";
import { aiCertification } from "./certifications/ai.js";

/**
 * Garde-fou anti-drift des codes de certification.
 *
 * cert-catalog.json est la source de vérité (mise à jour par
 * scripts/sap-cert-watch.mjs). certAccess.ts, les layouts modules et la page
 * /certifications lisent le catalogue à l'exécution, mais les data files
 * portent aussi un champ `code` : ces tests garantissent que tout reste
 * synchronisé — si SAP change un code, mettre à jour le catalogue ET les
 * data files (ou laisser ce test pointer ce qui a divergé).
 */

const EXPECTED_MODULES = ["FI", "CO", "MM", "SD", "PP", "AI"] as const;

const DATA_FILES: Record<string, { code: string; chapters: unknown[] }> = {
  FI: fiCertification,
  CO: coCertification,
  MM: mmCertification,
  SD: sdCertification,
  PP: ppCertification,
  AI: aiCertification,
};

describe("cert-catalog.json — invariants", () => {
  it("contient exactement les 6 modules attendus par certAccess (CERT_MAP)", () => {
    const codes = certCatalog.modules.map((m) => m.code).sort();
    expect(codes).toEqual([...EXPECTED_MODULES].sort());
  });

  it("a un code d'examen non vide pour chaque module", () => {
    for (const m of certCatalog.modules) {
      expect(m.cert, `module ${m.code}`).toMatch(/^C_[A-Z0-9_]+$/);
    }
  });

  it("est synchronisé avec le champ code des data files certifications/*.js", () => {
    for (const m of certCatalog.modules) {
      expect(DATA_FILES[m.code].code, `module ${m.code}`).toBe(m.cert);
    }
  });

  it("annonce le même nombre de chapitres que les data files", () => {
    for (const m of certCatalog.modules) {
      expect(DATA_FILES[m.code].chapters.length, `module ${m.code}`).toBe(m.chapters);
    }
  });
});
