import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { resolveRange } from "@/lib/stats";

const esc = (v: unknown) => {
  const s = v instanceof Date ? v.toISOString() : String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(req: NextRequest) {
  if (!(await getSession())) return new Response("No autorizado", { status: 401 });
  const q = req.nextUrl.searchParams;
  const r = resolveRange(q.get("p") ?? undefined, q.get("desde") ?? undefined, q.get("hasta") ?? undefined);

  const visitas = await prisma.visita.findMany({
    where: { createdAt: { gte: r.from, lt: r.to } },
    orderBy: { createdAt: "asc" },
    take: 200_000,
  });

  const cols = ["createdAt", "path", "fuente", "refHost", "utmSource", "utmMedium", "utmCampaign", "pais", "region", "ciudad", "dispositivo", "navegador", "sistema", "idioma", "sessionId", "visitorId"] as const;
  const csv = [cols.join(","), ...visitas.map((v) => cols.map((c) => esc(v[c])).join(","))].join("\n");

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="visitas-${r.desde}_${r.hasta}.csv"`,
    },
  });
}
