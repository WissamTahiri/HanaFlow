import { redirect } from "next/navigation";
import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

export default async function CertificationHCMPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/hcm");

  return (
    <CertificationTemplate
      certification={getCertForPlan("hcm", user.isPro)}
      moduleId="hcm"
      examPath="/certifications/hcm/examen"
      heroGradient="from-purple-900 via-purple-700 to-violet-500"
    />
  );
}
