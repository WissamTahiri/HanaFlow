import crypto from "crypto";

/**
 * Vérifie qu'un mot de passe n'est pas dans la base HaveIBeenPwned via le mécanisme
 * de k-anonymity : on n'envoie que les 5 premiers caractères du hash SHA-1, et on
 * compare la réponse localement. Le service ne voit jamais le mot de passe.
 *
 * Spec : https://haveibeenpwned.com/API/v3#PwnedPasswords
 *
 * Retourne :
 *  - { breached: false } si le mot de passe n'apparaît pas dans une fuite connue
 *  - { breached: true, count } sinon
 *  - { breached: false, skipped: true } en cas d'erreur réseau (on ne bloque pas
 *    l'inscription si HIBP est down)
 */
export async function checkPasswordBreached(
  password: string,
  opts: { timeoutMs?: number } = {},
): Promise<{ breached: boolean; count?: number; skipped?: boolean }> {
  const timeoutMs = opts.timeoutMs ?? 1500;

  const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      signal: ctrl.signal,
      headers: { "Add-Padding": "true", "User-Agent": "HanaFlow-Security-Check" },
    });
    if (!res.ok) return { breached: false, skipped: true };

    const text = await res.text();
    // Chaque ligne : <SUFFIX>:<COUNT>
    for (const line of text.split("\n")) {
      const [lineSuffix, countStr] = line.trim().split(":");
      if (lineSuffix === suffix) {
        const count = parseInt(countStr, 10);
        // count > 0 = mot de passe vu dans au moins une fuite connue
        // (Add-Padding ajoute des entrées avec count=0 pour brouiller le timing)
        if (count > 0) return { breached: true, count };
        return { breached: false };
      }
    }
    return { breached: false };
  } catch {
    return { breached: false, skipped: true };
  } finally {
    clearTimeout(timer);
  }
}
