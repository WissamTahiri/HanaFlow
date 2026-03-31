"use client";

import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { hcmMockExamQuestions, hcmCertification } from "@/data/certifications/hcm.js";

function HCMExamContent() {
  return (
    <ExamSimulatorTemplate
      questions={hcmMockExamQuestions}
      certInfo={{ code: "C_THR81_2311", shortName: "SAP HCM" }}
      moduleId="hcm"
      certPath="/certifications/hcm"
    />
  );
}

export default function HCMExamPage() {
  return (
    <ProtectedRoute>
      <HCMExamContent />
    </ProtectedRoute>
  );
}
