import { isDriverAdapterError } from "@prisma/driver-adapter-utils";

/**
 * Conflit d'écriture / deadlock sérialisable sur une transaction `Serializable`.
 *
 * Deux formes à détecter depuis Prisma 7 + @prisma/adapter-pg (plus de moteur
 * Rust) : le classique `P2034` (conflit détecté PENDANT la transaction), et
 * `DriverAdapterError` avec `cause.kind === "TransactionWriteConflict"` (conflit
 * détecté au COMMIT, bug connu — prisma/orm#30580 — qui ne se mappe plus en
 * P2034). Sans ce second cas, toute logique de retry-sur-P2034 (anti-farming
 * XP, acceptation d'invitation d'équipe) arrêterait silencieusement de rejouer
 * sous charge concurrente.
 */
export function isSerializationConflict(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  if ((e as { code?: string }).code === "P2034") return true;
  // isDriverAdapterError() lit `error["name"]` sans garde — lui passer un
  // objet est sûr désormais grâce au early return ci-dessus, mais jamais
  // null/undefined/une primitive (elle lèverait sinon).
  if (isDriverAdapterError(e)) {
    const cause = (e as { cause?: { kind?: string } }).cause;
    if (cause?.kind === "TransactionWriteConflict") return true;
  }
  return false;
}
