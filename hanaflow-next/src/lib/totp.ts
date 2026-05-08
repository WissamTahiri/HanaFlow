import { generateSecret, generateSync, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

const APP_NAME = "HanaFlow";
const PERIOD_SECONDS = 30;
// ±30s = 1 step avant/après pour absorber drift réseau et horloge user
const EPOCH_TOLERANCE_SECONDS = 30;

export function generateTotpSecret(): string {
  return generateSecret({ length: 20 });
}

export function buildOtpAuthUrl(email: string, secret: string): string {
  return generateURI({
    issuer: APP_NAME,
    label: email,
    secret,
    period: PERIOD_SECONDS,
  });
}

export async function buildOtpAuthQrDataUrl(email: string, secret: string): Promise<string> {
  const url = buildOtpAuthUrl(email, secret);
  return QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 1, width: 240 });
}

export function verifyTotp(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  const cleaned = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(cleaned)) return false;
  try {
    const result = verifySync({
      token: cleaned,
      secret,
      strategy: "totp",
      period: PERIOD_SECONDS,
      epochTolerance: EPOCH_TOLERANCE_SECONDS,
    });
    return result.valid === true;
  } catch {
    return false;
  }
}

// Helper test only
export function generateCurrentCode(secret: string): string {
  return generateSync({ secret, strategy: "totp", period: PERIOD_SECONDS });
}
