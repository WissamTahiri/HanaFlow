import { redirect } from "next/navigation";
import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function COExamPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/co/examen");
  if (!user.isPro) return <ProPaywall certPath="/certifications/co" />;

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("co")}
      certInfo={getCertMeta("co")}
      moduleId="co"
      certPath="/certifications/co"
    />
  );
}
