import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiHelpers";

/**
 * GET /api/testimonials
 *
 * Endpoint PUBLIC. Renvoie les témoignages publiés, triés par sortOrder
 * puis date. Featured d'abord. Pas d'auth requise — c'est du social proof
 * affiché sur la home et la pricing page.
 */
export async function GET() {
  const items = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      authorName: true,
      authorRole: true,
      authorCompany: true,
      authorPhotoUrl: true,
      authorLinkedInUrl: true,
      quote: true,
      rating: true,
      isFeatured: true,
    },
  });
  return ok({ testimonials: items });
}
