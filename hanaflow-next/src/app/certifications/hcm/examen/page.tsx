import { redirect } from "next/navigation";
import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function HCMExamPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/hcm/examen");
  if (!user.isPro) return <ProPaywall certPath="/certifications/hcm" />;

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("hcm")}
      certInfo={getCertMeta("hcm")}
      moduleId="hcm"
      certPath="/certifications/hcm"
    />
  );
}
