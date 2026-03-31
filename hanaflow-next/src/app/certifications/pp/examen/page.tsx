"use client";

import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ppMockExamQuestions, ppCertification } from "@/data/certifications/pp.js";

function PPExamContent() {
  return (
    <ExamSimulatorTemplate
      questions={ppMockExamQuestions}
      certInfo={{ code: ppCertification.code, shortName: ppCertification.shortName }}
      moduleId="pp"
      certPath="/certifications/pp"
    />
  );
}

export default function PPExamPage() {
  return (
    <ProtectedRoute>
      <PPExamContent />
    </ProtectedRoute>
  );
}
