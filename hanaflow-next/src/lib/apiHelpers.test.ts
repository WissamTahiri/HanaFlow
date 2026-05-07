import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { z } from "zod";
import { NextRequest } from "next/server";
import {
  validateBody,
  rateLimit,
  getAuthUser,
  requireAuth,
  requireAdmin,
} from "./apiHelpers";
import { signAccessToken, signImpersonationToken } from "./auth";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-32chars-minimum-please";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret-32chars-minimum";
});

const buildReq = (headers: Record<string, string> = {}) =>
  new NextRequest("https://example.com/api/test", { headers });

describe("validateBody", () => {
  const schema = z.object({ name: z.string().min(1), age: z.number().int() });

  it("returns success with parsed data on valid input", () => {
    const result = validateBody(schema, { name: "Wissam", age: 28 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Wissam");
    }
  });

  it("returns error with first issue message on invalid input", () => {
    const result = validateBody(schema, { name: "", age: 28 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTypeOf("string");
      expect(result.error.length).toBeGreaterThan(0);
    }
  });

  it("returns error on null body", () => {
    const result = validateBody(schema, null);
    expect(result.success).toBe(false);
  });
});

describe("rateLimit", () => {
  beforeEach(() => {
    // Use unique keys to avoid cross-test pollution
  });

  it("allows the first request and increments counter", () => {
    const key = `test:rl:${Date.now()}:1`;
    expect(rateLimit(key, 3, 1000)).toBe(true);
    expect(rateLimit(key, 3, 1000)).toBe(true);
    expect(rateLimit(key, 3, 1000)).toBe(true);
    expect(rateLimit(key, 3, 1000)).toBe(false);
  });

  it("treats different keys independently", () => {
    const a = `test:rl:${Date.now()}:a`;
    const b = `test:rl:${Date.now()}:b`;
    rateLimit(a, 1, 1000);
    expect(rateLimit(a, 1, 1000)).toBe(false);
    expect(rateLimit(b, 1, 1000)).toBe(true);
  });
});

describe("getAuthUser", () => {
  it("returns null without Authorization header", () => {
    const req = buildReq();
    expect(getAuthUser(req)).toBeNull();
  });

  it("returns null on malformed token", () => {
    const req = buildReq({ authorization: "Bearer not.a.jwt" });
    expect(getAuthUser(req)).toBeNull();
  });

  it("returns the payload on valid Bearer token", () => {
    const token = signAccessToken({ userId: 1, email: "a@a.com", role: "student" });
    const req = buildReq({ authorization: `Bearer ${token}` });
    const user = getAuthUser(req);
    expect(user?.email).toBe("a@a.com");
  });
});

describe("requireAuth", () => {
  it("returns 401 NextResponse when unauthenticated", () => {
    const result = requireAuth(buildReq());
    expect("status" in result).toBe(true);
    if ("status" in result) expect(result.status).toBe(401);
  });

  it("returns user on valid token", () => {
    const token = signAccessToken({ userId: 7, email: "u@u.com", role: "student" });
    const req = buildReq({ authorization: `Bearer ${token}` });
    const result = requireAuth(req);
    expect("user" in result).toBe(true);
    if ("user" in result) expect(result.user.userId).toBe(7);
  });
});

describe("requireAdmin", () => {
  it("returns 403 for a non-admin user", () => {
    const token = signAccessToken({ userId: 1, email: "u@u.com", role: "student" });
    const req = buildReq({ authorization: `Bearer ${token}` });
    const result = requireAdmin(req);
    if ("status" in result) expect(result.status).toBe(403);
    else throw new Error("Expected 403");
  });

  it("returns 403 for an impersonated admin (privilege escalation guard)", () => {
    const token = signImpersonationToken({
      userId: 99,
      email: "target@example.com",
      role: "admin",
      impersonatedBy: { id: 1, email: "admin@example.com" },
    });
    const req = buildReq({ authorization: `Bearer ${token}` });
    const result = requireAdmin(req);
    if ("status" in result) expect(result.status).toBe(403);
    else throw new Error("Expected 403");
  });

  it("returns user for a real admin", () => {
    const token = signAccessToken({ userId: 1, email: "admin@example.com", role: "admin" });
    const req = buildReq({ authorization: `Bearer ${token}` });
    const result = requireAdmin(req);
    expect("user" in result).toBe(true);
    if ("user" in result) {
      expect(result.user.role).toBe("admin");
      expect(result.user.impersonatedBy).toBeUndefined();
    }
  });
});
