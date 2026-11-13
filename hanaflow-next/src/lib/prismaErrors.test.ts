import { describe, it, expect } from "vitest";
import { isSerializationConflict } from "./prismaErrors";

describe("isSerializationConflict", () => {
  it("détecte le code Prisma classique P2034", () => {
    const err = new Error("conflict") as Error & { code: string };
    err.code = "P2034";
    expect(isSerializationConflict(err)).toBe(true);
  });

  it("détecte la forme DriverAdapterError (Prisma 7 + adapter-pg, conflit au commit)", () => {
    const err = new Error("could not serialize access") as Error & { name: string; cause: { kind: string } };
    err.name = "DriverAdapterError";
    err.cause = { kind: "TransactionWriteConflict" };
    expect(isSerializationConflict(err)).toBe(true);
  });

  it("ignore une DriverAdapterError d'une autre nature", () => {
    const err = new Error("connection closed") as Error & { name: string; cause: { kind: string } };
    err.name = "DriverAdapterError";
    err.cause = { kind: "ConnectionClosed" };
    expect(isSerializationConflict(err)).toBe(false);
  });

  it("renvoie false pour une erreur quelconque", () => {
    expect(isSerializationConflict(new Error("boom"))).toBe(false);
    expect(isSerializationConflict(null)).toBe(false);
    expect(isSerializationConflict(undefined)).toBe(false);
    expect(isSerializationConflict("string error")).toBe(false);
  });
});
