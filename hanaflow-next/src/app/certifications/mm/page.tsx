"use client";

import CertificationTemplate from "@/components/CertificationTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { mmCertification } from "@/data/certifications/mm.js";

function MMCertificationContent() {
  return (
    <CertificationTemplate
      certification={mmCertification}
      moduleId="mm"
      examPath="/certifications/mm/examen"
      heroGradient="from-emerald-900 via-emerald-700 to-emerald-500"
    />
  );
}

export default function CertificationMMPage() {
  return (
    <ProtectedRoute>
      <MMCertificationContent />
    </ProtectedRoute>
  );
}
