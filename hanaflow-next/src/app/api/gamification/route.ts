import { NextRequest } from "next/server";
import { requireAuth, ok } from "@/lib/apiHelpers";
import { getGamification } from "@/lib/gamificationServer";

/** GET /api/gamification — état XP / badges / streak du user connecté. */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("status" in auth) return auth;

  const state = await getGamification(auth.user.userId);
  return ok({ gamification: state });
}
