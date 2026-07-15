import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireProUser, err, ok, validateBody, rateLimit, getClientIp } from "@/lib/apiHelpers";
import { sendEmail, templates, getAdminEmail } from "@/lib/email";

/** Miroir de CvData (src/types/cv.ts) — validation stricte du snapshot envoyé par le client. */
const cvDataSchema = z.object({
  identity: z.object({
    name: z.string().min(1).max(120),
    title: z.string().max(150),
    email: z.string().email().max(255),
    phone: z.string().max(40).optional(),
    location: z.string().max(120).optional(),
    linkedin: z.string().max(255).optional(),
  }),
  summary: z.string().max(2000),
  experiences: z.array(z.object({
    title: z.string().max(150),
    company: z.string().max(150),
    location: z.string().max(120).optional(),
    startDate: z.string().max(20),
    endDate: z.string().max(20).optional(),
    current: z.boolean().optional(),
    bullets: z.array(z.string().max(500)).max(20),
  })).max(20),
  education: z.array(z.object({
    degree: z.string().max(150),
    school: z.string().max(150),
    location: z.string().max(120).optional(),
    startDate: z.string().max(20).optional(),
    endDate: z.string().max(20).optional(),
  })).max(10),
  skills: z.object({
    sap: z.array(z.string().max(80)).max(50).optional(),
    technical: z.array(z.string().max(80)).max(50).optional(),
    methods: z.array(z.string().max(80)).max(50).optional(),
    soft: z.array(z.string().max(80)).max(50).optional(),
  }),
  certifications: z.array(z.object({
    name: z.string().max(150),
    code: z.string().max(60).optional(),
    year: z.string().max(10).optional(),
    issuer: z.string().max(120).optional(),
  })).max(20),
  languages: z.array(z.object({ name: z.string().max(60), level: z.string().max(60) })).max(10),
});

const applySchema = z.object({
  cv: cvDataSchema,
  message: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireProUser(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const jobId = parseInt(id, 10);
  if (!Number.isFinite(jobId)) return err("ID invalide", 400);

  const ip = getClientIp(req);
  if (!(await rateLimit(`job-apply:ip:${ip}`, 20, 60 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie plus tard.", 429);
  }
  if (!(await rateLimit(`job-apply:user:${auth.user.userId}`, 10, 60 * 60 * 1000))) {
    return err("Trop de candidatures envoyées, réessaie dans 1 heure.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(applySchema, body);
  if (!validated.success) return err(validated.error, 400);

  const job = await prisma.jobListing.findFirst({
    where: { id: jobId, isPublished: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    select: { id: true, title: true },
  });
  if (!job) return err("Annonce introuvable ou expirée", 404);

  const existing = await prisma.jobApplication.findUnique({
    where: { jobListingId_userId: { jobListingId: jobId, userId: auth.user.userId } },
  });
  if (existing) return err("Tu as déjà postulé à cette offre.", 400);

  const user = await prisma.user.findUnique({ where: { id: auth.user.userId }, select: { name: true, email: true } });
  if (!user) return err("Utilisateur introuvable", 404);

  await prisma.jobApplication.create({
    data: {
      jobListingId: jobId,
      userId: auth.user.userId,
      cvSnapshot: validated.data.cv,
      message: validated.data.message,
    },
  });

  void sendEmail({ to: user.email, ...templates.jobApplicationReceived(user.name, job.title) });
  const adminEmail = getAdminEmail();
  if (adminEmail) {
    void sendEmail({ to: adminEmail, ...templates.adminNewApplication({ candidateName: user.name, jobTitle: job.title }) });
  }

  return ok({ message: "Candidature envoyée !" }, 201);
}
