import { describe, it, expect, vi } from "vitest";

// "server-only" n'est un no-op que dans le bundler Next.js (webpack/turbopack
// l'alias en interne) ; ce n'est pas un package npm installé en node_modules.
// Vitest tourne bien côté Node (donc l'import est légitime), mais il faut lui
// fournir un mock vide pour résoudre l'import dans cet environnement de test.
vi.mock("server-only", () => ({}));

import {
  isValidModule,
  getCertForPlan,
  getExamQuestions,
  getExamQuestionsForClient,
  getCertMeta,
  getChapterQuiz,
  type ModuleId,
} from "./certAccess";

const MODULES: ModuleId[] = ["fi", "co", "mm", "sd", "ai", "pp"];

describe("isValidModule", () => {
  it("accepts the 6 official module ids", () => {
    for (const m of MODULES) {
      expect(isValidModule(m)).toBe(true);
    }
  });

  it("rejects unknown module ids", () => {
    expect(isValidModule("xx")).toBe(false);
    expect(isValidModule("")).toBe(false);
    expect(isValidModule("FI")).toBe(false); // sensible à la casse
    expect(isValidModule("hr")).toBe(false);
  });
});

describe("getCertForPlan — Pro", () => {
  it("returns chapters fully populated (lessons + quiz) for every premium chapter", () => {
    for (const moduleId of MODULES) {
      const cert = getCertForPlan(moduleId, true);
      const premiumChapters = cert.chapters.filter((c: { isPremium: boolean }) => c.isPremium);
      // Chaque module de certif a au moins un chapitre premium dans le catalogue.
      expect(premiumChapters.length).toBeGreaterThan(0);
      for (const ch of premiumChapters) {
        expect(ch.lessons.length).toBeGreaterThan(0);
        expect(ch.quiz.length).toBeGreaterThan(0);
        expect(ch.locked).toBeUndefined();
      }
    }
  });

  it("includes the official exam code", () => {
    const cert = getCertForPlan("fi", true);
    expect(cert.code).toBeTypeOf("string");
    expect(cert.code.length).toBeGreaterThan(0);
  });
});

describe("getCertForPlan — Free (contenu payant jamais exposé)", () => {
  it("empties lessons and quiz for every premium chapter, but keeps the title/id", () => {
    for (const moduleId of MODULES) {
      const certPro = getCertForPlan(moduleId, true);
      const certFree = getCertForPlan(moduleId, false);

      for (let i = 0; i < certFree.chapters.length; i++) {
        const chPro = certPro.chapters[i];
        const chFree = certFree.chapters[i];
        expect(chFree.id).toBe(chPro.id);
        expect(chFree.title ?? chFree.name).toEqual(chPro.title ?? chPro.name);

        if (chPro.isPremium) {
          expect(chFree.lessons).toEqual([]);
          expect(chFree.quiz).toEqual([]);
          expect(chFree.locked).toBe(true);
          // Jamais de fuite de contenu payant (sérialisation stricte).
          expect(JSON.stringify(chFree)).not.toContain(JSON.stringify(chPro.lessons[0]));
        } else {
          // Chapitre gratuit : contenu intact, pas de verrou.
          expect(chFree.lessons).toEqual(chPro.lessons);
          expect(chFree.quiz).toEqual(chPro.quiz);
          expect(chFree.locked).toBeUndefined();
        }
      }
    }
  });

  it("free plan still gets the exam code (catalogue metadata, not premium content)", () => {
    const cert = getCertForPlan("fi", false);
    expect(cert.code).toBeTypeOf("string");
  });
});

describe("getExamQuestions (banque complète, server-only)", () => {
  it("returns questions with correctIndex for every module", () => {
    for (const moduleId of MODULES) {
      const questions = getExamQuestions(moduleId);
      expect(questions.length).toBeGreaterThan(0);
      for (const q of questions) {
        expect(typeof q.correctIndex).toBe("number");
      }
    }
  });
});

describe("getExamQuestionsForClient (sûr pour le client)", () => {
  it("strips correctIndex from every question", () => {
    for (const moduleId of MODULES) {
      const clientQuestions = getExamQuestionsForClient(moduleId);
      expect(clientQuestions.length).toBeGreaterThan(0);
      for (const q of clientQuestions) {
        expect(q).not.toHaveProperty("correctIndex");
        expect(q.question).toBeTypeOf("string");
        expect(Array.isArray(q.options)).toBe(true);
      }
    }
  });

  it("preserves question count and content other than correctIndex", () => {
    const full = getExamQuestions("fi");
    const client = getExamQuestionsForClient("fi");
    expect(client.length).toBe(full.length);
    expect(client[0].question).toBe(full[0].question);
    expect(client[0].options).toEqual(full[0].options);
  });
});

describe("getCertMeta", () => {
  it("returns code + shortName for each module", () => {
    for (const moduleId of MODULES) {
      const meta = getCertMeta(moduleId);
      expect(meta.code).toBeTypeOf("string");
      expect(meta.shortName).toBeTypeOf("string");
    }
  });
});

describe("getChapterQuiz", () => {
  it("returns the canonical quiz (with correctIndex) for a valid chapter", () => {
    const cert = getCertForPlan("fi", true);
    const firstChapterId = cert.chapters[0].id;
    const quiz = getChapterQuiz("fi", firstChapterId);
    expect(quiz).not.toBeNull();
    expect(quiz!.length).toBeGreaterThan(0);
    for (const q of quiz!) {
      expect(typeof q.correctIndex).toBe("number");
    }
  });

  it("returns the quiz for a premium chapter too (server-side grading needs the full bank)", () => {
    const cert = getCertForPlan("fi", true);
    const premiumChapter = cert.chapters.find((c: { isPremium: boolean }) => c.isPremium);
    expect(premiumChapter).toBeDefined();
    const quiz = getChapterQuiz("fi", premiumChapter.id);
    expect(quiz).not.toBeNull();
    expect(quiz!.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown chapter id", () => {
    expect(getChapterQuiz("fi", "does-not-exist")).toBeNull();
  });
});
