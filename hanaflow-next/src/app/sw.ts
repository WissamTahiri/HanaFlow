/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@serwist/next/typings" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkOnly, CacheFirst, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // ── Sécurité d'abord : on ne cache JAMAIS les routes auth-sensibles ───
    // Sinon le SW pourrait servir la réponse d'un autre user, ou continuer à
    // répondre 200 sur des endpoints invalidés (logout, suspension, etc.).
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/admin"),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }) => url.pathname.startsWith("/_next/data"),
      handler: new NetworkOnly(),
    },

    // ── Assets statiques : cache-first agressif ──────────────────────────
    {
      matcher: ({ url }) =>
        /\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf)$/.test(url.pathname),
      handler: new CacheFirst({
        cacheName: "static-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
          }),
        ],
      }),
    },

    // ── Reste : stratégies par défaut de @serwist/next ───────────────────
    // (NetworkFirst sur HTML, StaleWhileRevalidate sur JS/CSS, etc.)
    ...defaultCache,
  ],
});

serwist.addEventListeners();
