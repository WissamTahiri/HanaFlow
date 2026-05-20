import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const isProd = process.env.NODE_ENV === "production";

// @serwist/next : successeur maintenu de next-pwa (auteur originel d'ailleurs).
// TS-first, basé sur Workbox v7. Le SW est défini dans src/app/sw.ts.
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: !isProd, // dev : pas de PWA, évite le HMR foireux
  cacheOnNavigation: true,
  reloadOnOnline: true,
});

// CSP est posé par `src/proxy.ts` avec un nonce généré par requête
// (cf. Next.js 16 nonce-based CSP). On garde ici uniquement les headers
// statiques qui n'ont pas besoin d'être par-requête.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // HSTS en prod uniquement (l'envoyer en dev empoisonne localhost)
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSerwist(nextConfig);
