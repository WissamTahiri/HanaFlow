import { describe, it, expect, beforeEach, vi } from "vitest";

// emailVerification.ts importe "server-only", un marqueur Next.js qui n'est
// pas un package npm installable tel quel (Next le fournit via son propre
// bundler webpack). Hors du bundler Next (ici, Vitest/Vite), la résolution
// échoue — c'est un problème d'environnement de test pré-existant (le même
// `import "server-only"` casse déjà src/lib/certAccess.test.ts sur ce repo).
// On neutralise uniquement l'import dans ce fichier de test, sans toucher à
// la config Vitest globale ni à aucun autre fichier.
vi.mock("server-only", () => ({}));

const deleteManyMock = vi.fn();
const createMock = vi.fn();
vi.mock("./prisma", () => ({
  prisma: {
    emailVerificationToken: {
      deleteMany: (...args: unknown[]) => deleteManyMock(...args),
      create: (...args: unknown[]) => createMock(...args),
    },
  },
}));

const sendEmailMock = vi.fn();
const emailVerificationTemplateMock = vi.fn((name: string, url: string) => ({
  subject: "Confirme ton email HanaFlow",
  html: `<a href="${url}">confirm ${name}</a>`,
  text: `confirm ${url}`,
}));
vi.mock("./email", () => ({
  sendEmail: (...args: unknown[]) => sendEmailMock(...args),
  templates: {
    emailVerification: (name: string, url: string) => emailVerificationTemplateMock(name, url),
  },
}));

import { issueEmailVerification } from "./emailVerification";
import { hashToken } from "./auth";

const user = { id: 42, name: "Wissam", email: "wissam@example.com" };

beforeEach(() => {
  deleteManyMock.mockReset().mockResolvedValue({ count: 0 });
  createMock.mockReset().mockResolvedValue({});
  sendEmailMock.mockReset().mockResolvedValue({ ok: true, id: "email_1" });
  emailVerificationTemplateMock.mockClear();
});

describe("issueEmailVerification", () => {
  it("supprime les tokens précédents de l'utilisateur avant d'en créer un nouveau", async () => {
    await issueEmailVerification(user);

    expect(deleteManyMock).toHaveBeenCalledWith({ where: { userId: user.id } });
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(deleteManyMock.mock.invocationCallOrder[0]).toBeLessThan(
      createMock.mock.invocationCallOrder[0],
    );
  });

  it("crée un token haché (sha256) expirant dans ~48h", async () => {
    const before = Date.now();
    await issueEmailVerification(user);

    const { data } = createMock.mock.calls[0][0];
    expect(data.userId).toBe(user.id);
    expect(data.tokenHash).toMatch(/^[0-9a-f]{64}$/); // sha256 hex

    const expiresAt: Date = data.expiresAt;
    const deltaMs = expiresAt.getTime() - before;
    const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
    expect(deltaMs).toBeGreaterThan(FORTY_EIGHT_HOURS - 5000);
    expect(deltaMs).toBeLessThanOrEqual(FORTY_EIGHT_HOURS + 5000);
  });

  it("envoie un email dont l'URL contient le token EN CLAIR, dont le hash correspond au tokenHash stocké", async () => {
    await issueEmailVerification(user);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const emailArg = sendEmailMock.mock.calls[0][0];
    expect(emailArg.to).toBe(user.email);
    expect(emailArg.subject).toBe("Confirme ton email HanaFlow");

    expect(emailVerificationTemplateMock).toHaveBeenCalledTimes(1);
    const [nameArg, urlArg] = emailVerificationTemplateMock.mock.calls[0];
    expect(nameArg).toBe(user.name);
    expect(urlArg).toMatch(/\/verify-email\?token=/);

    const rawToken = new URL(urlArg).searchParams.get("token");
    expect(rawToken).toBeTruthy();

    const { data } = createMock.mock.calls[0][0];
    expect(hashToken(rawToken!)).toBe(data.tokenHash);
  });

  it("génère un token différent à chaque appel (pas de réutilisation)", async () => {
    await issueEmailVerification(user);
    const firstUrl = emailVerificationTemplateMock.mock.calls[0][1];
    const firstToken = new URL(firstUrl).searchParams.get("token");

    await issueEmailVerification(user);
    const secondUrl = emailVerificationTemplateMock.mock.calls[1][1];
    const secondToken = new URL(secondUrl).searchParams.get("token");

    expect(firstToken).not.toBe(secondToken);
  });

  it("ne lève pas d'exception si l'envoi d'email échoue (best-effort, fire-and-forget)", async () => {
    sendEmailMock.mockResolvedValue({ ok: false, reason: "no_resend_key" });
    await expect(issueEmailVerification(user)).resolves.toBeUndefined();
  });
});
