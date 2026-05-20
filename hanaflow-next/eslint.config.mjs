import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // PWA / Workbox runtime généré au build : du JS minifié qu'on ne lint pas
    "public/sw.js",
    "public/sw.js.map",
    "public/workbox-*.js",
    "public/workbox-*.js.map",
    "public/worker-*.js",
    "public/fallback-*.js",
  ]),
  {
    rules: {
      // L'app est en français → l'UI contient des dizaines d'apostrophes
      // typographiques légitimes. La règle visait à éviter d'oublier d'échapper
      // une entité HTML, ce qui est sans risque ici (React les rend en texte).
      // On la désactive plutôt que de polluer le code avec des `&apos;`.
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
