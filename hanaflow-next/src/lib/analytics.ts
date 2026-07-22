"use client";

import posthog from "posthog-js";

/**
 * Wrapper analytics centralisé (PostHog) — toute la config vit ici pour que
 * le comportement reste cohérent partout où c'est appelé.
 *
 * Config volontairement minimale, alignée avec la politique de
 * confidentialité (voir src/app/confidentialite/page.tsx) :
 *  - Pas d'autocapture (aucun clic/scroll capturé automatiquement) : on ne
 *    trace QUE les événements produit explicites listés ci-dessous.
 *  - Pas de session recording, pas de heatmaps.
 *  - `person_profiles: "identified_only"` : aucun profil créé pour un
 *    visiteur anonyme tant qu'il n'a pas d'action identifiable (inscription).
 *  - `persistence: "memory"` : pas de cookie ni de localStorage posé par
 *    PostHog — l'identifiant ne survit pas au rechargement de page pour un
 *    visiteur anonyme, cohérent avec "aucun cookie de tracking".
 *
 * Si NEXT_PUBLIC_POSTHOG_KEY est absent (dev local sans clé), toutes les
 * fonctions sont des no-op silencieux.
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.posthog.com";

let initialized = false;

/** Respecte l'en-tête "Ne pas me suivre" (Do Not Track) du navigateur. */
function hasDoNotTrack(): boolean {
  const nav = navigator as Navigator & { msDoNotTrack?: string };
  return nav.doNotTrack === "1" || nav.msDoNotTrack === "1" || (window as unknown as { doNotTrack?: string }).doNotTrack === "1";
}

export function initAnalytics(): void {
  if (initialized || !POSTHOG_KEY || typeof window === "undefined") return;
  if (hasDoNotTrack()) return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    autocapture: false,
    capture_pageview: false, // on envoie les pageviews nous-mêmes (App Router)
    capture_pageleave: false,
    capture_dead_clicks: false,
    capture_performance: false,
    disable_surveys: true,
    disable_session_recording: true,
    disable_scroll_properties: true,
    persistence: "memory",
  });
  initialized = true;
}

export function trackPageview(path: string): void {
  if (!initialized) return;
  posthog.capture("$pageview", { $current_url: path });
}

/** Événements produit suivis — liste fermée, pas de tracking ad-hoc ailleurs. */
export type AnalyticsEvent =
  | "signup_completed"
  | "module_started"
  | "exam_started"
  | "certificate_issued"
  | "job_application_started"
  | "pro_cta_clicked";

export function trackEvent(event: AnalyticsEvent, props?: Record<string, string | number | boolean>): void {
  if (!initialized) return;
  posthog.capture(event, props);
}

/** À appeler après une inscription/connexion réussie — relie les événements
 * anonymes précédents à l'utilisateur, sans créer de profil avant ce moment. */
export function identifyUser(userId: number): void {
  if (!initialized) return;
  posthog.identify(String(userId));
}
