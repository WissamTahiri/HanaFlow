import { redirect } from "next/navigation";
import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function SDExamPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/sd/examen");
  if (!user.isPro) return <ProPaywall certPath="/certifications/sd" />;

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("sd")}
      certInfo={getCertMeta("sd")}
      moduleId="sd"
      certPath="/certifications/sd"
    />
  );
}
