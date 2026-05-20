/**
 * Constantes Gemini partagées par toutes les routes IA.
 *
 * GEMINI_MODEL : nom du modèle Gemini utilisé en prod. On centralise pour
 * pouvoir switcher d'un seul endroit si Google bouge ses quotas free tier
 * (ce qu'ils font régulièrement).
 *
 * Pourquoi `gemini-2.0-flash-lite` plutôt que `gemini-2.0-flash` ou `2.5` :
 *  - free tier le plus large (30 RPM / 1500 RPD vs 200 RPD sur 2.0-flash)
 *  - qualité largement suffisante pour du structured-JSON
 *  - latence plus basse → meilleure UX sur le mock interview + tuteur
 *
 * Permet override via env `GEMINI_MODEL` si on veut tester un modèle plus
 * récent sans redéploiement du code.
 */
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash-lite";
