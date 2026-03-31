"use client";

import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { mmMockExamQuestions, mmCertification } from "@/data/certifications/mm.js";

function MMExamContent() {
  return (
    <ExamSimulatorTemplate
      questions={mmMockExamQuestions}
      certInfo={{ code: mmCertification.code, shortName: mmCertification.shortName }}
      moduleId="mm"
      certPath="/certifications/mm"
    />
  );
}

export default function MMExamPage() {
  return (
    <ProtectedRoute>
      <MMExamContent />
    </ProtectedRoute>
  );
}
