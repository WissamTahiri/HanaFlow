import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa");

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  // Sécurité : ne JAMAIS cacher /api/* (sinon le SW pourrait servir une réponse
  // d'auth d'un autre user, ou continuer à répondre 200 sur des routes invalidées).
  // On bypasse aussi /_next/data (server actions) et la home admin.
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /\/api\/.*$/,
      handler: "NetworkOnly",
    },
    {
      urlPattern: /\/_next\/data\/.*$/,
      handler: "NetworkOnly",
    },
    {
      urlPattern: /\/admin(\/.*)?$/,
      handler: "NetworkOnly",
    },
    // Cache les assets statiques (images, fonts, JS chunks)
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
  ],
});

const isProd = process.env.NODE_ENV === "production";

// CSP est désormais posé par `src/proxy.ts` avec un nonce généré par requête
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

export default pwaConfig(nextConfig);
