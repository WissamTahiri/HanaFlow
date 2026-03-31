import { NextRequest } from "next/server";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, validateBody, ok, err } from "@/lib/apiHelpers";

const profileSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/[a-zA-Z]/)
      .regex(/[0-9]/)
      .optional(),
  })
  .refine((d) => d.name || d.password, { message: "Rien à mettre à jour" });

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(profileSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;

  const updates: { name?: string; passwordHash?: string } = {};
  if (data.name) updates.name = data.name;
  if (data.password) {
    updates.passwordHash = await argon2.hash(data.password, { type: argon2.argon2id });
  }

  const user = await prisma.user.update({
    where: { id: auth.user.userId },
    data: updates,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return ok({ user });
}
