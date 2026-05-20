#!/usr/bin/env node
/**
 * sap-cert-watch.mjs — Veille des codes de certification SAP.
 *
 * Pour chaque module SAP de src/data/cert-catalog.json :
 *  1. fetch les pages officielles SAP + 1-2 sources tierces fiables
 *  2. extrait par regex les codes de certif (C_TS4xx_yyyy, C_S4Cxx_yyyy, etc.)
 *  3. compare avec le code actuel du catalogue
 *  4. produit un report (stdout) et un fichier `cert-watch-report.json`
 *  5. exit 0 si tout est OK, exit 1 si au moins un changement détecté
 *     → c'est le signal pour la GitHub Action d'ouvrir une PR
 *
 * Sources scrapées :
 *  - learning.sap.com (URL slug + page HTML, sert au moins de URL canonique)
 *  - community.sap.com (blog posts récents qui mentionnent les codes)
 *  - erpprep.com (3rd party qui suit les codes activement)
 *
 * Limites : les pages SAP sont JS-rendered, donc on capte souvent juste
 * le titre/slug. Les sources tierces compensent quand SAP n'expose pas
 * le code en HTML statique.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.resolve(__dirname, "..", "src", "data", "cert-catalog.json");
const REPORT_PATH = path.resolve(__dirname, "..", "cert-watch-report.json");

// Regex : codes SAP S/4HANA modernes
//   C_TS4FI_2023, C_TS452_2601, C_S4CFI_2504, C_THR12_2411, etc.
const CODE_RE = /\bC_(?:TS4[A-Z]{0,2}|S4C[A-Z]{2,3}|TS\d{3}|THR\d{2,3})_\d{4}\b/g;

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36 hanaflow-cert-watch/1.0";

async function fetchText(url, { timeout = 15000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": USER_AGENT, "Accept": "text/html" },
    });
    if (!res.ok) return { ok: false, status: res.status, body: "" };
    const body = await res.text();
    return { ok: true, status: res.status, body };
  } catch (e) {
    return { ok: false, status: 0, body: "", error: String(e) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Pour un module donné, scrape plusieurs sources et tente d'extraire
 * les codes de certif qui matchent son préfixe attendu.
 */
async function discoverCodesForModule(mod) {
  const expectedPrefix = mod.cert.split("_")[0] + "_" + mod.cert.split("_")[1]; // "C_TS4FI"
  const sources = [
    mod.certSourceUrl,
    // erpprep.com : page catégorie qui liste les codes par famille (S/4HANA)
    "https://www.erpprep.com/sap-s-4hana",
    // community.sap.com : recherche blog posts récents qui mentionnent le module
    `https://community.sap.com/t5/forums/searchpage/tab/message?q=${encodeURIComponent(expectedPrefix)}`,
  ].filter(Boolean);

  const detected = new Set();
  const details = [];

  for (const src of sources) {
    const { ok, status, body, error } = await fetchText(src);
    if (!ok) {
      details.push({ src, status, error: error ?? `HTTP ${status}` });
      continue;
    }
    const matches = body.match(CODE_RE) ?? [];
    const codesForThisModule = matches.filter((c) => c.startsWith(expectedPrefix));
    codesForThisModule.forEach((c) => detected.add(c));
    details.push({ src, status, matches: codesForThisModule.slice(0, 5) });
  }

  return { detected: [...detected].sort(), details };
}

function pickMostRecentCode(codes) {
  if (codes.length === 0) return null;
  // Tri par "version" décroissante (le suffixe _YYYY ou _YYMM) — le plus récent en premier
  const sorted = [...codes].sort((a, b) => {
    const va = parseInt(a.split("_").pop(), 10);
    const vb = parseInt(b.split("_").pop(), 10);
    return vb - va;
  });
  return sorted[0];
}

async function main() {
  const apply = process.argv.includes("--apply");

  const catalogRaw = await fs.readFile(CATALOG_PATH, "utf8");
  const catalog = JSON.parse(catalogRaw);

  console.log(`→ Vérification des certifs SAP (${catalog.modules.length} modules)\n`);

  const report = {
    runAt: new Date().toISOString(),
    catalogVerifiedAt: catalog.lastVerified,
    changes: [],
    unchanged: [],
    errors: [],
  };

  for (const mod of catalog.modules) {
    process.stdout.write(`  ${mod.code.padEnd(3)} — ${mod.cert.padEnd(16)} → `);
    try {
      const { detected, details } = await discoverCodesForModule(mod);
      const mostRecent = pickMostRecentCode(detected);

      if (detected.length === 0) {
        process.stdout.write("⚠ aucun code détecté (sources HS ou format inconnu)\n");
        report.errors.push({ module: mod.code, reason: "no_codes_detected", details });
        continue;
      }

      if (mostRecent && mostRecent !== mod.cert) {
        process.stdout.write(`⚡ changement → ${mostRecent}\n`);
        report.changes.push({
          module: mod.code,
          currentCert: mod.cert,
          detectedCert: mostRecent,
          allDetected: detected,
          sources: details.map((d) => ({ src: d.src, matches: d.matches })),
        });
      } else {
        process.stdout.write("✓ à jour\n");
        report.unchanged.push({ module: mod.code, cert: mod.cert });
      }
    } catch (e) {
      process.stdout.write(`✗ erreur (${e.message})\n`);
      report.errors.push({ module: mod.code, reason: "exception", error: String(e) });
    }
  }

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`\n→ Rapport écrit dans ${path.relative(process.cwd(), REPORT_PATH)}`);
  console.log(`   ${report.changes.length} changement(s), ${report.unchanged.length} OK, ${report.errors.length} erreur(s)`);

  if (report.changes.length > 0 && apply) {
    // Met à jour le catalogue avec les codes détectés
    for (const ch of report.changes) {
      const m = catalog.modules.find((x) => x.code === ch.module);
      if (m) m.cert = ch.detectedCert;
    }
    catalog.lastVerified = new Date().toISOString().slice(0, 10);
    await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
    console.log(`\n→ Catalogue mis à jour : ${path.relative(process.cwd(), CATALOG_PATH)}`);
  }

  if (report.changes.length > 0) {
    console.log("\nCHANGEMENTS DÉTECTÉS — exit 1 pour signaler à la CI.");
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(2);
});
