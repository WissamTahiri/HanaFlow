import { redirect } from "next/navigation";
import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

export default async function CertificationMMPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/mm");

  return (
    <CertificationTemplate
      certification={getCertForPlan("mm", user.isPro)}
      moduleId="mm"
      examPath="/certifications/mm/examen"
      heroGradient="from-emerald-900 via-emerald-700 to-emerald-500"
    />
  );
}
