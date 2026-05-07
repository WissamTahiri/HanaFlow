import { describe, it, expect, beforeAll } from "vitest";
import {
  signAccessToken,
  signImpersonationToken,
  verifyAccessToken,
  hashToken,
  getRefreshTokenExpiry,
  type JwtPayload,
} from "./auth";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-32chars-minimum-please";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-32chars-minimum";
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.JWT_REFRESH_EXPIRES_IN = "7d";
});

describe("auth — JWT signing & verification", () => {
  const payload: JwtPayload = {
    userId: 42,
    email: "wissam@example.com",
    role: "admin",
  };

  it("signs and verifies an access token roundtrip", () => {
    const token = signAccessToken(payload);
    expect(token).toBeTypeOf("string");
    expect(token.split(".")).toHaveLength(3);

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it("rejects a tampered token", () => {
    const token = signAccessToken(payload);
    const tampered = token.slice(0, -3) + "AAA";
    expect(() => verifyAccessToken(tampered)).toThrow();
  });

  it("includes impersonatedBy claim on impersonation tokens", () => {
    const impToken = signImpersonationToken({
      userId: 99,
      email: "user@example.com",
      role: "student",
      impersonatedBy: { id: 1, email: "admin@example.com" },
    });
    const decoded = verifyAccessToken(impToken);
    expect(decoded.impersonatedBy).toEqual({ id: 1, email: "admin@example.com" });
  });

  it("issues impersonation tokens with shorter TTL than access tokens", () => {
    const access = signAccessToken(payload);
    const imp = signImpersonationToken(payload);
    const accessExp = JSON.parse(Buffer.from(access.split(".")[1], "base64").toString()).exp;
    const impExp = JSON.parse(Buffer.from(imp.split(".")[1], "base64").toString()).exp;
    expect(impExp).toBeLessThan(accessExp);
  });
});

describe("auth — refresh token helpers", () => {
  it("hashToken is deterministic and outputs 64 hex chars (sha256)", () => {
    const a = hashToken("hello");
    const b = hashToken("hello");
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it("hashToken differs for different inputs", () => {
    expect(hashToken("a")).not.toBe(hashToken("b"));
  });

  it("getRefreshTokenExpiry returns a date in the future", () => {
    const exp = getRefreshTokenExpiry();
    expect(exp.getTime()).toBeGreaterThan(Date.now());
  });
});
