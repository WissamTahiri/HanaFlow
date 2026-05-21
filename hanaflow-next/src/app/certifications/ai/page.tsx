import { redirect } from "next/navigation";
import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

export default async function CertificationAIPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/ai");

  return (
    <CertificationTemplate
      certification={getCertForPlan("ai", user.isPro)}
      moduleId="ai"
      examPath="/certifications/ai/examen"
      heroGradient="from-violet-900 via-purple-700 to-fuchsia-500"
    />
  );
}
