import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
const IMPERSONATION_EXPIRES_IN = "15m";

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  /** Si présent, ce token est issu d'une impersonation par cet admin */
  impersonatedBy?: { id: number; email: string };
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signImpersonationToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: IMPERSONATION_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Parse une durée style "7d", "12h", "45m", "30s" en millisecondes.
 * Sans unité → traite comme jours (pour compat avec l'ancien comportement).
 */
export function parseDurationMs(value: string): number {
  const m = value.trim().match(/^(\d+)\s*(ms|s|m|h|d)?$/i);
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = parseInt(m[1], 10);
  const unit = (m[2] ?? "d").toLowerCase();
  const mult: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return n * (mult[unit] ?? mult.d);
}

export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + parseDurationMs(JWT_REFRESH_EXPIRES_IN));
}
