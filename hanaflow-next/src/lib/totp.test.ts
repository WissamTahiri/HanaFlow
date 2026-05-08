import { describe, it, expect } from "vitest";
import { generateTotpSecret, buildOtpAuthUrl, verifyTotp, generateCurrentCode } from "./totp";

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
