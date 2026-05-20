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

/**
 * Vérifie un code TOTP. Renvoie le "step" (epoch / period) consommé si valide,
 * sinon null. Le caller doit persister le step et refuser tout step ≤ celui-ci
 * pour empêcher la réutilisation d'un code encore dans sa fenêtre de validité.
 */
export function verifyTotpWithStep(token: string, secret: string): number | null {
  if (!token || !secret) return null;
  const cleaned = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(cleaned)) return null;
  const nowStep = Math.floor(Date.now() / 1000 / PERIOD_SECONDS);
  const tolerance = Math.floor(EPOCH_TOLERANCE_SECONDS / PERIOD_SECONDS) || 1;
  // On essaie chaque step dans la fenêtre [now-tol, now+tol] pour identifier
  // précisément lequel a été consommé (otplib ne l'expose pas).
  for (let delta = -tolerance; delta <= tolerance; delta++) {
    const step = nowStep + delta;
    const expected = generateSync({
      secret,
      strategy: "totp",
      period: PERIOD_SECONDS,
      epoch: step * PERIOD_SECONDS * 1000,
    });
    // Comparaison timing-safe
    if (expected.length === cleaned.length) {
      let diff = 0;
      for (let i = 0; i < expected.length; i++) {
        diff |= expected.charCodeAt(i) ^ cleaned.charCodeAt(i);
      }
      if (diff === 0) return step;
    }
  }
  return null;
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
