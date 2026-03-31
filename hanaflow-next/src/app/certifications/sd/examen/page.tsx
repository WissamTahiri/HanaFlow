"use client";

import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { sdMockExamQuestions, sdCertification } from "@/data/certifications/sd.js";

function SDExamContent() {
  return (
    <ExamSimulatorTemplate
      questions={sdMockExamQuestions}
      certInfo={{ code: sdCertification.code, shortName: sdCertification.shortName }}
      moduleId="sd"
      certPath="/certifications/sd"
    />
  );
}

export default function SDExamPage() {
  return (
    <ProtectedRoute>
      <SDExamContent />
    </ProtectedRoute>
  );
}
