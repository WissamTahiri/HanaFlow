"use client";

import CertificationTemplate from "@/components/CertificationTemplate";
import ProtectedRoute from "@/components/ProtectedRoute";
import { sdCertification } from "@/data/certifications/sd.js";

function SDCertificationContent() {
  return (
    <CertificationTemplate
      certification={sdCertification}
      moduleId="sd"
      examPath="/certifications/sd/examen"
      heroGradient="from-purple-900 via-purple-700 to-purple-500"
    />
  );
}

export default function CertificationSDPage() {
  return (
    <ProtectedRoute>
      <SDCertificationContent />
    </ProtectedRoute>
  );
}
