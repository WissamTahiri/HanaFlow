import { redirect } from "next/navigation";
import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

export default async function CertificationCOPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/co");

  return (
    <CertificationTemplate
      certification={getCertForPlan("co", user.isPro)}
      moduleId="co"
      examPath="/certifications/co/examen"
      heroGradient="from-indigo-900 via-indigo-700 to-indigo-500"
    />
  );
}
