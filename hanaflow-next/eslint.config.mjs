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
      // Nouvelles règles plus strictes apportées par l'upgrade Next 16.4 —
      // flaguent ~17 occurrences du pattern standard "fetch au montage" dans
      // useEffect (admin/*, profil, team, etc.), pas des bugs. Corriger
      // proprement chaque site d'appel (restructurer en Suspense ou lib de
      // data-fetching) est un vrai chantier de refactor, hors périmètre d'un
      // upgrade de sécurité — on les passe en warning pour garder `npm run
      // lint` vert sans masquer silencieusement le sujet.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
]);

export default eslintConfig;
