import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "crypto";
import {
  generateBackupCodes,
  consumeBackupCode,
} from "./totpCrypto";

const FIXED_KEY = crypto.randomBytes(32).toString("hex");

describe("totpCrypto — avec TOTP_ENCRYPTION_KEY définie", () => {
  let mod: typeof import("./totpCrypto");
  const originalKey = process.env.TOTP_ENCRYPTION_KEY;

  beforeEach(async () => {
    vi.resetModules();
    process.env.TOTP_ENCRYPTION_KEY = FIXED_KEY;
    mod = await import("./totpCrypto");
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.TOTP_ENCRYPTION_KEY;
    else process.env.TOTP_ENCRYPTION_KEY = originalKey;
  });

  it("round-trip : chiffrer puis déchiffrer redonne le texte original", () => {
    const secret = "JBSWY3DPEHPK3PXP";
    const encrypted = mod.encryptTotpSecret(secret);
    expect(encrypted.startsWith("v1:")).toBe(true);
    expect(mod.decryptTotpSecret(encrypted)).toBe(secret);
  });

  it("produit un format v1:<iv>:<ciphertext>:<tag> en hex", () => {
    const encrypted = mod.encryptTotpSecret("un-secret-quelconque");
    const parts = encrypted.split(":");
    expect(parts).toHaveLength(4);
    expect(parts[0]).toBe("v1");
    expect(parts[1]).toMatch(/^[0-9a-f]{24}$/); // iv 12 bytes
    expect(parts[2]).toMatch(/^[0-9a-f]+$/);
    expect(parts[3]).toMatch(/^[0-9a-f]{32}$/); // tag GCM 16 bytes
  });

  it("isEncrypted : true pour un secret préfixé v1:, false sinon", () => {
    const encrypted = mod.encryptTotpSecret("secret");
    expect(mod.isEncrypted(encrypted)).toBe(true);
    expect(mod.isEncrypted("JBSWY3DPEHPK3PXP")).toBe(false);
    expect(mod.isEncrypted("")).toBe(false);
  });

  it("format legacy : une chaîne non préfixée v1: est retournée telle quelle", () => {
    const legacyPlain = "JBSWY3DPEHPK3PXP";
    expect(mod.decryptTotpSecret(legacyPlain)).toBe(legacyPlain);
  });

  it("tampering du ciphertext fait échouer le déchiffrement (AES-GCM rejette)", () => {
    const encrypted = mod.encryptTotpSecret("mon-secret-totp");
    const [prefix, iv, ct, tag] = encrypted.split(":");
    // Flip le dernier caractère hex du ciphertext
    const lastChar = ct.at(-1)!;
    const flipped = lastChar === "0" ? "1" : "0";
    const tamperedCt = ct.slice(0, -1) + flipped;
    const tampered = [prefix, iv, tamperedCt, tag].join(":");
    expect(() => mod.decryptTotpSecret(tampered)).toThrow();
  });

  it("tampering du tag d'authentification fait échouer le déchiffrement", () => {
    const encrypted = mod.encryptTotpSecret("mon-secret-totp");
    const [prefix, iv, ct, tag] = encrypted.split(":");
    const lastChar = tag.at(-1)!;
    const flipped = lastChar === "0" ? "1" : "0";
    const tamperedTag = tag.slice(0, -1) + flipped;
    const tampered = [prefix, iv, ct, tamperedTag].join(":");
    expect(() => mod.decryptTotpSecret(tampered)).toThrow();
  });

  it("rejette un format chiffré incomplet (segments manquants)", () => {
    expect(() => mod.decryptTotpSecret("v1:onlyiv")).toThrow();
  });
});

describe("totpCrypto — sans TOTP_ENCRYPTION_KEY (hors production)", () => {
  let mod: typeof import("./totpCrypto");
  const originalKey = process.env.TOTP_ENCRYPTION_KEY;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    vi.resetModules();
    delete process.env.TOTP_ENCRYPTION_KEY;
    process.env.NODE_ENV = "test";
    mod = await import("./totpCrypto");
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.TOTP_ENCRYPTION_KEY;
    else process.env.TOTP_ENCRYPTION_KEY = originalKey;
    process.env.NODE_ENV = originalEnv;
  });

  it("encryptTotpSecret retombe sur le clair au lieu de throw", () => {
    const secret = "JBSWY3DPEHPK3PXP";
    expect(() => mod.encryptTotpSecret(secret)).not.toThrow();
    expect(mod.encryptTotpSecret(secret)).toBe(secret);
  });

  it("decryptTotpSecret sur du clair (non préfixé) le retourne tel quel", () => {
    const secret = "JBSWY3DPEHPK3PXP";
    expect(mod.decryptTotpSecret(secret)).toBe(secret);
  });

  it("isEncrypted reste cohérent sans clé configurée", () => {
    expect(mod.isEncrypted("v1:a:b:c")).toBe(true);
    expect(mod.isEncrypted("JBSWY3DPEHPK3PXP")).toBe(false);
  });
});

describe("generateBackupCodes", () => {
  it("génère 10 codes au format xxxxxxxx-xxxxxxxx, tous différents", async () => {
    const { plain, hashed } = await generateBackupCodes();
    expect(plain).toHaveLength(10);
    expect(hashed).toHaveLength(10);
    for (const code of plain) {
      expect(code).toMatch(/^[0-9a-f]{8}-[0-9a-f]{8}$/);
    }
    expect(new Set(plain).size).toBe(10);
    expect(new Set(hashed).size).toBe(10);
  });

  it("les hashes générés sont vérifiables via consumeBackupCode", async () => {
    const { plain, hashed } = await generateBackupCodes();
    for (const code of plain) {
      const remaining = await consumeBackupCode(code, hashed);
      expect(remaining).not.toBeNull();
    }
  });
});

describe("consumeBackupCode", () => {
  it("retire le code consommé de la liste retournée (longueur -1)", async () => {
    const { plain, hashed } = await generateBackupCodes();
    const target = plain[3];
    const remaining = await consumeBackupCode(target, hashed);
    expect(remaining).not.toBeNull();
    expect(remaining).toHaveLength(hashed.length - 1);
  });

  it("un code invalide retourne null et ne modifie rien", async () => {
    const { hashed } = await generateBackupCodes();
    const result = await consumeBackupCode("ffffffff-ffffffff", hashed);
    expect(result).toBeNull();
  });

  it("est insensible à la casse et aux espaces superflus", async () => {
    const { plain, hashed } = await generateBackupCodes();
    const target = plain[0];
    const withSpacesAndCase = `  ${target.toUpperCase()}  `;
    const remaining = await consumeBackupCode(withSpacesAndCase, hashed);
    expect(remaining).not.toBeNull();
    expect(remaining).toHaveLength(hashed.length - 1);
  });

  it("ne consomme qu'une seule occurrence même en cas de collision théorique", async () => {
    const { plain, hashed } = await generateBackupCodes();
    const first = await consumeBackupCode(plain[0], hashed);
    expect(first).not.toBeNull();
    // Le même code ne doit plus être consommable sur la liste mise à jour
    const second = await consumeBackupCode(plain[0], first!);
    expect(second).toBeNull();
  });
});
