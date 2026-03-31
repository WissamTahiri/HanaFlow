"use client";

import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { coMockExamQuestions, coCertification } from "@/data/certifications/co.js";

function COExamContent() {
  return (
    <ExamSimulatorTemplate
      questions={coMockExamQuestions}
      certInfo={{ code: coCertification.code, shortName: coCertification.shortName }}
      moduleId="co"
      certPath="/certifications/co"
    />
  );
}

export default function COExamPage() {
  return (
    <ProtectedRoute>
      <COExamContent />
    </ProtectedRoute>
  );
}
