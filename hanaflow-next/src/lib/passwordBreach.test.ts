import { describe, it, expect, afterEach, vi } from "vitest";
import crypto from "crypto";
import { checkPasswordBreached } from "./passwordBreach";

function sha1Upper(password: string): string {
  return crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
}

function mockFetchResolved(body: { ok: boolean; text?: string }) {
  return vi.spyOn(global, "fetch").mockResolvedValue({
    ok: body.ok,
    text: async () => body.text ?? "",
  } as Response);
}

describe("checkPasswordBreached", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retourne breached: true avec le count quand le suffixe est présent (count > 0)", async () => {
    const password = "password123";
    const hash = sha1Upper(password);
    const suffix = hash.slice(5);
    mockFetchResolved({
      ok: true,
      text: `${suffix}:42\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:0`,
    });

    const result = await checkPasswordBreached(password);
    expect(result).toEqual({ breached: true, count: 42 });
  });

  it("retourne breached: false quand le suffixe est présent avec count = 0 (padding HIBP)", async () => {
    const password = "un-mot-de-passe-unique";
    const hash = sha1Upper(password);
    const suffix = hash.slice(5);
    mockFetchResolved({ ok: true, text: `${suffix}:0` });

    const result = await checkPasswordBreached(password);
    expect(result.breached).toBe(false);
  });

  it("retourne breached: false quand le suffixe est absent de la réponse", async () => {
    mockFetchResolved({
      ok: true,
      text: "0000000000000000000000000000000000:3\n1111111111111111111111111111111111:7",
    });

    const result = await checkPasswordBreached("un-autre-mot-de-passe");
    expect(result.breached).toBe(false);
    expect(result.skipped).toBeUndefined();
  });

  it("fail-open : réponse HTTP non-ok → breached: false, skipped: true (ne bloque pas l'inscription)", async () => {
    mockFetchResolved({ ok: false });

    const result = await checkPasswordBreached("whatever");
    expect(result).toEqual({ breached: false, skipped: true });
  });

  it("fail-open : fetch qui throw (panne réseau / timeout) → breached: false, skipped: true", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network timeout"));

    const result = await checkPasswordBreached("whatever");
    expect(result).toEqual({ breached: false, skipped: true });
  });

  it("n'envoie jamais le mot de passe en clair ni le suffixe complet du hash (k-anonymity)", async () => {
    const password = "correct horse battery staple";
    const hash = sha1Upper(password);
    const fetchSpy = mockFetchResolved({ ok: true, text: "" });

    await checkPasswordBreached(password);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = String(fetchSpy.mock.calls[0][0]);
    expect(calledUrl).not.toContain(password);
    expect(calledUrl).not.toContain(hash); // hash complet jamais envoyé
    expect(calledUrl).not.toContain(hash.slice(5)); // suffixe jamais envoyé
    expect(calledUrl).toContain(hash.slice(0, 5)); // seul le préfixe part
  });

  it("respecte le timeout configurable sans planter (abort déclenché -> fail-open)", async () => {
    vi.spyOn(global, "fetch").mockImplementation(
      (_url, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          signal?.addEventListener("abort", () => reject(new Error("aborted")));
        }),
    );

    const result = await checkPasswordBreached("whatever", { timeoutMs: 10 });
    expect(result).toEqual({ breached: false, skipped: true });
  });
});
