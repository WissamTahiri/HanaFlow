"use client";

import CertificationTemplate from "@/components/CertificationTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ppCertification } from "@/data/certifications/pp.js";

function PPCertificationContent() {
  return (
    <CertificationTemplate
      certification={ppCertification}
      moduleId="pp"
      examPath="/certifications/pp/examen"
      heroGradient="from-rose-900 via-rose-700 to-pink-500"
    />
  );
}

export default function CertificationPPPage() {
  return (
    <ProtectedRoute>
      <PPCertificationContent />
    </ProtectedRoute>
  );
}
