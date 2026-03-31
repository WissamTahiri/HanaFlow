"use client";

import CertificationTemplate from "@/components/CertificationTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { fiCertification } from "@/data/certifications/fi.js";

function FICertificationContent() {
  return (
    <CertificationTemplate
      certification={fiCertification}
      moduleId="fi"
      examPath="/certifications/fi/examen"
      heroGradient="from-blue-900 via-blue-700 to-blue-500"
    />
  );
}

export default function CertificationFIPage() {
  return (
    <ProtectedRoute>
      <FICertificationContent />
    </ProtectedRoute>
  );
}
