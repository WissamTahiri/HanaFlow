import { describe, it, expect } from "vitest";
import { generateTotpSecret, buildOtpAuthUrl, verifyTotp, verifyTotpWithStep, generateCurrentCode } from "./totp";

describe("totp", () => {
  it("generates a base32 secret", () => {
    const secret = generateTotpSecret();
    expect(secret).toBeTypeOf("string");
    expect(secret.length).toBeGreaterThanOrEqual(16);
    expect(secret).toMatch(/^[A-Z2-7]+$/);
  });

  it("builds a valid otpauth URL with issuer and account", () => {
    const url = buildOtpAuthUrl("user@example.com", "JBSWY3DPEHPK3PXP");
    expect(url).toMatch(/^otpauth:\/\/totp\//);
    expect(url).toContain("user%40example.com");
    expect(url).toContain("HanaFlow");
    expect(url).toContain("secret=JBSWY3DPEHPK3PXP");
  });

  it("verifies a current TOTP code", () => {
    const secret = generateTotpSecret();
    const validCode = generateCurrentCode(secret);
    expect(verifyTotp(validCode, secret)).toBe(true);
  });

  it("rejects an invalid TOTP code", () => {
    const secret = generateTotpSecret();
    expect(verifyTotp("000000", secret)).toBe(false);
  });

  it("rejects malformed input (non-6-digit)", () => {
    const secret = generateTotpSecret();
    expect(verifyTotp("12345", secret)).toBe(false);
    expect(verifyTotp("1234567", secret)).toBe(false);
    expect(verifyTotp("abcdef", secret)).toBe(false);
    expect(verifyTotp("", secret)).toBe(false);
  });

  it("rejects when secret is empty", () => {
    expect(verifyTotp("123456", "")).toBe(false);
  });

  it("strips whitespace from token before verifying", () => {
    const secret = generateTotpSecret();
    const validCode = generateCurrentCode(secret);
    const codeWithSpaces = validCode.slice(0, 3) + " " + validCode.slice(3);
    expect(verifyTotp(codeWithSpaces, secret)).toBe(true);
  });
});

describe("verifyTotpWithStep", () => {
  // Fonction réellement utilisée par login/enroll/disable (contrairement à
  // verifyTotp ci-dessus, qui n'a aucun appelant réel) — a eu un bug critique
  // (epoch passé en ms au lieu de secondes à otplib, cf. node_modules/otplib
  // /dist/*.d.ts : « Current Unix epoch timestamp in seconds ») qui faisait
  // échouer TOUT code TOTP valide en prod depuis le 20/05/2026. Zéro code de
  // test n'appelait cette fonction avant — ce fichier ne couvrait que la
  // fonction jumelle correcte et inutilisée.
  it("accepte le code TOTP courant et renvoie le numéro de step", () => {
    const secret = generateTotpSecret();
    const code = generateCurrentCode(secret);
    const step = verifyTotpWithStep(code, secret);
    expect(step).not.toBeNull();
    expect(step).toBe(Math.floor(Date.now() / 1000 / 30));
  });

  it("rejette un code invalide", () => {
    const secret = generateTotpSecret();
    expect(verifyTotpWithStep("000000", secret)).toBeNull();
  });

  it("rejette une entrée malformée", () => {
    const secret = generateTotpSecret();
    expect(verifyTotpWithStep("12345", secret)).toBeNull();
    expect(verifyTotpWithStep("", secret)).toBeNull();
  });

  it("rejette quand le secret est vide", () => {
    expect(verifyTotpWithStep("123456", "")).toBeNull();
  });
});
