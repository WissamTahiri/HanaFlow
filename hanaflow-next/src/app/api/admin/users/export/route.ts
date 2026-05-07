import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err } from "@/lib/apiHelpers";

const escapeCsv = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isPro: true,
        isSuspended: true,
        createdAt: true,
        _count: { select: { progress: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = ["ID", "Nom", "Email", "Rôle", "Pro", "Suspendu", "Modules visités", "Inscrit le"];
    const rows = users.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.isPro ? "oui" : "non",
      u.isSuspended ? "oui" : "non",
      u._count.progress,
      u.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
    const bom = "﻿"; // pour Excel UTF-8

    const filename = `hanaflow-users-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(bom + csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return err("Erreur serveur", 500);
  }
}
