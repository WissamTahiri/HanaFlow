"use client";

import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { fiMockExamQuestions, fiCertification } from "@/data/certifications/fi.js";

function FIExamContent() {
  return (
    <ExamSimulatorTemplate
      questions={fiMockExamQuestions}
      certInfo={{ code: fiCertification.code, shortName: fiCertification.shortName }}
      moduleId="fi"
      certPath="/certifications/fi"
    />
  );
}

export default function FIExamPage() {
  return (
    <ProtectedRoute>
      <FIExamContent />
    </ProtectedRoute>
  );
}
