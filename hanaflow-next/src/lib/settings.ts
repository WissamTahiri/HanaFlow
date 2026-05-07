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

const SETTINGS_CACHE_TAG = "site-settings";

export const getPublicSettings = unstable_cache(
  async (): Promise<PublicSettings> => {
    try {
      const rows = await prisma.siteSetting.findMany({
        where: { key: { in: [...PUBLIC_KEYS] } },
      });
      const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      return {
        bannerEnabled: map.banner_enabled === "true",
        bannerMessage: map.banner_message ?? "",
        bannerLink: map.banner_link ?? "",
        maintenanceEnabled: map.maintenance_enabled === "true",
        maintenanceMessage: map.maintenance_message ?? "Maintenance en cours, retour rapide.",
        registrationEnabled: map.registration_enabled !== "false",
        promoCodesEnabled: map.promo_codes_enabled !== "false",
      };
    } catch {
      // Si la BDD est inaccessible (build time, table inexistante), on retourne les defaults
      return {
        bannerEnabled: false,
        bannerMessage: "",
        bannerLink: "",
        maintenanceEnabled: false,
        maintenanceMessage: "Maintenance en cours, retour rapide.",
        registrationEnabled: true,
        promoCodesEnabled: true,
      };
    }
  },
  ["public-settings"],
  { revalidate: 60, tags: [SETTINGS_CACHE_TAG] },
);

/**
 * Invalidation explicite désactivée — Next.js 16 a changé l'API revalidateTag.
 * Le cache se rafraîchit automatiquement toutes les 60 secondes.
 */
export function invalidateSettingsCache() {
  // No-op : laisser le cache (revalidate: 60s) gérer la fraîcheur.
}
