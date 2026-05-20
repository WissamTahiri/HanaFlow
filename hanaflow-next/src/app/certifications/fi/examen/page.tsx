import { redirect } from "next/navigation";
import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

// Server Component : aucune question d'examen n'arrive dans le bundle client tant
// que le serveur n'a pas vérifié que l'utilisateur est connecté ET Pro.
export default async function FIExamPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/fi/examen");
  if (!user.isPro) return <ProPaywall certPath="/certifications/fi" />;

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("fi")}
      certInfo={getCertMeta("fi")}
      moduleId="fi"
      certPath="/certifications/fi"
    />
  );
}
