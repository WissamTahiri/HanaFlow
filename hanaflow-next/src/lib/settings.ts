import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

const PUBLIC_KEYS = [
  "banner_enabled",
  "banner_message",
  "banner_link",
  "maintenance_enabled",
  "maintenance_message",
  "registration_enabled",
  "promo_codes_enabled",
] as const;

export interface PublicSettings {
  bannerEnabled: boolean;
  bannerMessage: string;
  bannerLink: string;
  maintenanceEnabled: boolean;
  maintenanceMessage: string;
  registrationEnabled: boolean;
  promoCodesEnabled: boolean;
}

const DEFAULTS: PublicSettings = {
  bannerEnabled: false,
  bannerMessage: "",
  bannerLink: "",
  maintenanceEnabled: false,
  maintenanceMessage: "Maintenance en cours, retour rapide.",
  registrationEnabled: true,
  promoCodesEnabled: true,
};

/**
 * Charge les settings publics depuis la DB sans aucun cache.
 * Utilisé pour le mode maintenance et le toggle d'inscriptions, qui doivent prendre
 * effet immédiatement (sinon un admin pourrait croire avoir bloqué le site alors
 * que le cache de 60s laisse encore passer du monde).
 */
async function fetchPublicSettings(): Promise<PublicSettings> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...PUBLIC_KEYS] } },
    });
    const map = Object.fromEntries((rows as Array<{ key: string; value: string }>).map((r) => [r.key, r.value]));
    return {
      bannerEnabled: map.banner_enabled === "true",
      bannerMessage: map.banner_message ?? "",
      bannerLink: map.banner_link ?? "",
      maintenanceEnabled: map.maintenance_enabled === "true",
      maintenanceMessage: map.maintenance_message ?? DEFAULTS.maintenanceMessage,
      registrationEnabled: map.registration_enabled !== "false",
      promoCodesEnabled: map.promo_codes_enabled !== "false",
    };
  } catch {
    // Si la BDD est inaccessible (build time, table inexistante), on retourne les defaults
    return DEFAULTS;
  }
}

/**
 * Settings publics avec un cache court (10s) pour limiter la charge DB sans
 * masquer un changement admin trop longtemps. Plus court que les 60s d'avant.
 */
export const getPublicSettings = unstable_cache(
  fetchPublicSettings,
  ["public-settings-v2"],
  { revalidate: 10 },
);

/**
 * Settings critiques (maintenance, registration) — sans cache.
 * À utiliser dans les check serveur qui doivent prendre effet immédiatement.
 */
export async function getCriticalSettings(): Promise<Pick<PublicSettings, "maintenanceEnabled" | "maintenanceMessage" | "registrationEnabled">> {
  const all = await fetchPublicSettings();
  return {
    maintenanceEnabled: all.maintenanceEnabled,
    maintenanceMessage: all.maintenanceMessage,
    registrationEnabled: all.registrationEnabled,
  };
}

/**
 * Invalidation explicite désactivée — Next.js 16 a changé l'API revalidateTag.
 * Le cache (10s) se rafraîchit automatiquement.
 */
export function invalidateSettingsCache() {
  // No-op : laisser le cache (revalidate: 10s) gérer la fraîcheur.
}
