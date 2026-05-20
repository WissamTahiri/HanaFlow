import { redirect } from "next/navigation";
import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

export default async function CertificationPPPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/pp");

  return (
    <CertificationTemplate
      certification={getCertForPlan("pp", user.isPro)}
      moduleId="pp"
      examPath="/certifications/pp/examen"
      heroGradient="from-rose-900 via-rose-700 to-pink-500"
    />
  );
}
