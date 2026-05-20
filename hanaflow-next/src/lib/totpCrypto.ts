import crypto from "crypto";

/**
 * Chiffrement AES-256-GCM du secret TOTP.
 *
 * Format stocké : `v1:<iv_hex>:<ciphertext_hex>:<tag_hex>`
 * Si TOTP_ENCRYPTION_KEY est absent, l'API se rabat sur du clair (utile en dev,
 * mais journalise un warning au boot). Un secret historique non préfixé est
 * traité comme du clair : decryptTotpSecret() le retourne tel quel, et l'appel
 * suivant à encryptTotpSecret() au prochain enroll/save le passera en chiffré.
 */

const KEY_HEX = process.env.TOTP_ENCRYPTION_KEY ?? "";
let cachedKey: Buffer | null = null;
let warned = false;

function getKey(): Buffer | null {
  if (!KEY_HEX) {
    if (!warned) {
      console.warn(
        "[totpCrypto] TOTP_ENCRYPTION_KEY non défini — secrets TOTP stockés en clair. " +
          "Définir une clé hex 32 bytes : `node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"`",
      );
      warned = true;
    }
    return null;
  }
  if (cachedKey) return cachedKey;
  if (!/^[0-9a-fA-F]{64}$/.test(KEY_HEX)) {
    throw new Error("TOTP_ENCRYPTION_KEY doit être 32 bytes hex (64 chars)");
  }
  cachedKey = Buffer.from(KEY_HEX, "hex");
  return cachedKey;
}

export function encryptTotpSecret(plaintext: string): string {
  const key = getKey();
  if (!key) return plaintext; // fallback clair
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("hex")}:${ct.toString("hex")}:${tag.toString("hex")}`;
}

export function decryptTotpSecret(stored: string): string {
  // Format chiffré
  if (stored.startsWith("v1:")) {
    const key = getKey();
    if (!key) throw new Error("Secret chiffré mais TOTP_ENCRYPTION_KEY manquant");
    const [, ivHex, ctHex, tagHex] = stored.split(":");
    if (!ivHex || !ctHex || !tagHex) throw new Error("Format secret TOTP invalide");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const pt = Buffer.concat([
      decipher.update(Buffer.from(ctHex, "hex")),
      decipher.final(),
    ]);
    return pt.toString("utf8");
  }
  // Legacy : secret historique stocké en clair → on le retourne tel quel.
  // Le caller doit le ré-encrypter au prochain update s'il veut migrer.
  return stored;
}

export function isEncrypted(stored: string): boolean {
  return stored.startsWith("v1:");
}

/* ─── Backup codes ──────────────────────────────────────────────────── */

const BACKUP_CODE_COUNT = 10;
const BACKUP_CODE_BYTES = 5; // 10 chars hex

function hashBackupCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export function generateBackupCodes(): { plain: string[]; hashed: string[] } {
  const plain: string[] = [];
  const hashed: string[] = [];
  for (let i = 0; i < BACKUP_CODE_COUNT; i++) {
    const raw = crypto.randomBytes(BACKUP_CODE_BYTES).toString("hex");
    // Format lisible : xxxxx-xxxxx
    const code = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    plain.push(code);
    hashed.push(hashBackupCode(code));
  }
  return { plain, hashed };
}

/**
 * Vérifie qu'un code de récupération est dans la liste, et renvoie la liste
 * mise à jour (code consommé retiré). Renvoie null si le code n'existe pas.
 */
export function consumeBackupCode(
  code: string,
  hashed: string[],
): string[] | null {
  const cleaned = code.trim().toLowerCase();
  const target = hashBackupCode(cleaned);
  let found = false;
  const remaining: string[] = [];
  for (const h of hashed) {
    if (!found && crypto.timingSafeEqual(Buffer.from(h, "hex"), Buffer.from(target, "hex"))) {
      found = true;
      continue;
    }
    remaining.push(h);
  }
  return found ? remaining : null;
}
