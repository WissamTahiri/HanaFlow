import { describe, expect, it } from "vitest";
import { HANAFLOW_STATS } from "./stats";
import { fiCertification, fiMockExamQuestions } from "@/data/certifications/fi.js";
import { coCertification, coMockExamQuestions } from "@/data/certifications/co.js";
import { mmCertification, mmMockExamQuestions } from "@/data/certifications/mm.js";
import { sdCertification, sdMockExamQuestions } from "@/data/certifications/sd.js";
import { ppCertification, ppMockExamQuestions } from "@/data/certifications/pp.js";
import { aiCertification, aiMockExamQuestions } from "@/data/certifications/ai.js";

type Chapter = { lessons?: unknown[]; quiz?: unknown[] };
type Cert = { chapters: Chapter[] };

const CERTS: Cert[] = [
  fiCertification,
  coCertification,
  mmCertification,
  sdCertification,
  ppCertification,
  aiCertification,
];

const MOCK_EXAMS: unknown[][] = [
  fiMockExamQuestions,
  coMockExamQuestions,
  mmMockExamQuestions,
  sdMockExamQuestions,
  ppMockExamQuestions,
  aiMockExamQuestions,
];

// Garde-fou anti-désynchronisation : les chiffres marketing de
// src/config/stats.ts doivent refléter le contenu réel. Si un de ces tests
// échoue, mettre à jour HANAFLOW_STATS (et non l'inverse).
describe("HANAFLOW_STATS reflète le contenu réel", () => {
  it("compte les modules", () => {
    expect(CERTS.length).toBe(HANAFLOW_STATS.modules);
    expect(MOCK_EXAMS.length).toBe(HANAFLOW_STATS.simulateurs);
  });

  it("compte les chapitres", () => {
    const chapitres = CERTS.reduce((n, c) => n + c.chapters.length, 0);
    expect(chapitres).toBe(HANAFLOW_STATS.chapitres);
  });

  it("compte les leçons", () => {
    const lecons = CERTS.reduce(
      (n, c) => n + c.chapters.reduce((m, ch) => m + (ch.lessons?.length ?? 0), 0),
      0,
    );
    expect(lecons).toBe(HANAFLOW_STATS.lecons);
  });

  it("compte les questions des simulateurs d'examen", () => {
    const questions = MOCK_EXAMS.reduce((n, q) => n + q.length, 0);
    expect(questions).toBe(HANAFLOW_STATS.questionsExamen);
  });

  it("compte les questions des quiz de chapitre", () => {
    const questions = CERTS.reduce(
      (n, c) => n + c.chapters.reduce((m, ch) => m + (ch.quiz?.length ?? 0), 0),
      0,
    );
    expect(questions).toBe(HANAFLOW_STATS.questionsQuiz);
  });
});
