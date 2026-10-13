import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/JsonLd";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

const GENERIC_METADATA: Metadata = {
  title: "Offre d'emploi SAP | HanaFlow",
  description:
    "Découvre cette offre d'emploi SAP sur HanaFlow et postule en un clic avec ton CV optimisé par IA.",
};

const CONTRACT_TYPE_MAP: Record<string, string> = { cdi: "FULL_TIME", cdd: "TEMPORARY", freelance: "CONTRACTOR" };

async function getJob(id: string) {
  const jobId = parseInt(id, 10);
  if (!Number.isFinite(jobId)) return null;
  // Même filtre que GET /api/jobs/[id] : seules les offres publiées et non expirées
  // sont indexables.
  return prisma.jobListing.findFirst({
    where: {
      id: jobId,
      isPublished: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: {
      id: true, title: true, companyName: true, description: true, location: true,
      workMode: true, contractType: true, createdAt: true, expiresAt: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return GENERIC_METADATA;

  const title = `${job.title} chez ${job.companyName ?? "une entreprise partenaire"} — Emplois SAP | HanaFlow`;
  const description = job.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/emplois/${job.id}`,
    },
  };
}

export default async function JobDetailLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const job = await getJob(id);

  return (
    <>
      {job && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.description,
            datePosted: job.createdAt.toISOString(),
            ...(job.expiresAt ? { validThrough: job.expiresAt.toISOString() } : {}),
            employmentType: job.contractType ? CONTRACT_TYPE_MAP[job.contractType] : undefined,
            hiringOrganization: {
              "@type": "Organization",
              name: job.companyName ?? "Entreprise confidentielle",
            },
            jobLocationType: job.workMode === "remote" ? "TELECOMMUTE" : undefined,
            ...(job.workMode !== "remote" && job.location
              ? {
                  jobLocation: {
                    "@type": "Place",
                    address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "FR" },
                  },
                }
              : {}),
            url: `${BASE}/emplois/${job.id}`,
          }}
        />
      )}
      {children}
    </>
  );
}
