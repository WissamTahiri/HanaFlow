"use client";

import CertificationTemplate from "@/components/CertificationTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { coCertification } from "@/data/certifications/co.js";

function COCertificationContent() {
  return (
    <CertificationTemplate
      certification={coCertification}
      moduleId="co"
      examPath="/certifications/co/examen"
      heroGradient="from-indigo-900 via-indigo-700 to-indigo-500"
    />
  );
}

export default function CertificationCOPage() {
  return (
    <ProtectedRoute>
      <COCertificationContent />
    </ProtectedRoute>
  );
}
