import { redirect } from "next/navigation";
import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

export default async function CertificationFIPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/fi");

  return (
    <CertificationTemplate
      certification={getCertForPlan("fi", user.isPro)}
      moduleId="fi"
      examPath="/certifications/fi/examen"
      heroGradient="from-blue-900 via-blue-700 to-blue-500"
    />
  );
}
