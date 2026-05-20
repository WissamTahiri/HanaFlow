import { redirect } from "next/navigation";
import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

export default async function CertificationSDPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/sd");

  return (
    <CertificationTemplate
      certification={getCertForPlan("sd", user.isPro)}
      moduleId="sd"
      examPath="/certifications/sd/examen"
      heroGradient="from-purple-900 via-purple-700 to-purple-500"
    />
  );
}
