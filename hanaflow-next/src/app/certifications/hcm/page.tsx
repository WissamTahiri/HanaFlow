"use client";

import CertificationTemplate from "@/components/CertificationTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { hcmCertification } from "@/data/certifications/hcm.js";

function HCMCertificationContent() {
  return (
    <CertificationTemplate
      certification={hcmCertification}
      moduleId="hcm"
      examPath="/certifications/hcm/examen"
      heroGradient="from-purple-900 via-purple-700 to-violet-500"
    />
  );
}

export default function CertificationHCMPage() {
  return (
    <ProtectedRoute>
      <HCMCertificationContent />
    </ProtectedRoute>
  );
}
