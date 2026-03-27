// generate-sitemap.cjs — Génère public/sitemap.xml
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://hanaflow.vercel.app";
const TODAY = new Date().toISOString().split("T")[0];

// Toutes les routes publiques (pas les routes auth/dashboard)
const routes = [
  { path: "/",                    priority: "1.0", changefreq: "weekly"  },
  { path: "/a-propos",            priority: "0.7", changefreq: "monthly" },
  { path: "/modules-sap",         priority: "0.9", changefreq: "weekly"  },
  { path: "/modules-sap/fi",      priority: "0.8", changefreq: "monthly" },
  { path: "/modules-sap/co",      priority: "0.8", changefreq: "monthly" },
  { path: "/modules-sap/mm",      priority: "0.8", changefreq: "monthly" },
  { path: "/modules-sap/sd",      priority: "0.8", changefreq: "monthly" },
  { path: "/modules-sap/hcm",     priority: "0.8", changefreq: "monthly" },
  { path: "/modules-sap/pp",      priority: "0.8", changefreq: "monthly" },
  { path: "/s4hana",              priority: "0.8", changefreq: "monthly" },
  { path: "/ai-joule",            priority: "0.7", changefreq: "monthly" },
  { path: "/processus-metier",    priority: "0.7", changefreq: "monthly" },
  { path: "/roadmap",             priority: "0.8", changefreq: "monthly" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ path: p, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

const outputPath = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, xml, "utf-8");
console.log(`✓ Sitemap généré : ${outputPath} (${routes.length} URLs)`);
