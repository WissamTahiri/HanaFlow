import { describe, it, expect, beforeEach, vi } from "vitest";

const createMock = vi.fn();
vi.mock("./prisma", () => ({
  prisma: {
    adminAuditLog: {
      create: (...args: unknown[]) => createMock(...args),
    },
  },
}));

import { logAudit } from "./audit";

beforeEach(() => {
  createMock.mockReset().mockResolvedValue({});
});

const actor = { userId: 1, email: "admin@hanaflow.test", role: "admin" } as never;

// `sanitizeMetadata` (dans audit.ts) n'est pas exporté — on vérifie son
// comportement via `logAudit`, en inspectant le payload passé à
// prisma.adminAuditLog.create. MAX_METADATA_BYTES = 8 * 1024 dans audit.ts :
// si cette constante change, ce test doit être ajusté en conséquence.
const MAX_METADATA_BYTES = 8 * 1024;

/**
 * Construit un objet de metadata dont le `JSON.stringify(...).length` vaut
 * exactement `targetBytes`, en restant sous les seuils par-champ
 * (MAX_STRING_LEN=2000, MAX_ARRAY_LEN=100) pour que `sanitizeMetadata` ne
 * modifie aucune valeur individuelle — seule la taille globale doit décider
 * du passage en stub `_truncated`.
 */
function buildMetadataOfExactSize(targetBytes: number): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  let n = 0;
  while (JSON.stringify({ ...base, pad: "" }).length < targetBytes - 2000) {
    base["k" + n] = "v";
    n++;
  }
  const remainder = targetBytes - JSON.stringify(base).length;
  // Taille avec le champ `pad` vide, pour calculer l'overhead exact de la clé.
  const overhead = JSON.stringify({ ...base, pad: "" }).length - JSON.stringify(base).length;
  const padLen = remainder - overhead;
  if (padLen < 0 || padLen > 2000) {
    throw new Error(`buildMetadataOfExactSize: padLen hors limites (${padLen})`);
  }
  base.pad = "x".repeat(padLen);
  const actualSize = JSON.stringify(base).length;
  if (actualSize !== targetBytes) {
    throw new Error(`buildMetadataOfExactSize: taille obtenue ${actualSize} !== ${targetBytes}`);
  }
  return base;
}

describe("logAudit → sanitizeMetadata (boundary MAX_METADATA_BYTES)", () => {
  it("laisse passer les metadata dont la taille sérialisée vaut EXACTEMENT MAX_METADATA_BYTES", async () => {
    const metadata = buildMetadataOfExactSize(MAX_METADATA_BYTES);
    expect(JSON.stringify(metadata).length).toBe(MAX_METADATA_BYTES);

    await logAudit({ actor, action: "user.update", metadata });

    const { data } = createMock.mock.calls[0][0];
    expect(data.metadata).toEqual(metadata);
    expect(data.metadata._truncated).toBeUndefined();
  });

  it("remplace par un stub _truncated dès que la taille dépasse MAX_METADATA_BYTES d'un seul octet", async () => {
    const metadata = buildMetadataOfExactSize(MAX_METADATA_BYTES + 1);
    expect(JSON.stringify(metadata).length).toBe(MAX_METADATA_BYTES + 1);

    await logAudit({ actor, action: "user.update", metadata });

    const { data } = createMock.mock.calls[0][0];
    expect(data.metadata).toEqual({
      _truncated: true,
      _originalKeys: Object.keys(metadata),
      _sizeBytes: MAX_METADATA_BYTES + 1,
      _note: expect.stringContaining(`${MAX_METADATA_BYTES} bytes`),
    });
  });
});
