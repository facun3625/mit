import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIp, hashIp } from "@/lib/visitor";

const noStore = { headers: { "Cache-Control": "no-store" } };

// Devuelve el pop-up si está activo y le corresponde mostrarse a este visitante.
export async function GET(req: NextRequest) {
  const popup = await prisma.popup.findFirst({ where: { activo: true } });
  if (!popup || (!popup.titulo.trim() && !popup.contenido.replace(/<[^>]*>/g, "").trim() && !popup.contenido.includes("<img"))) {
    return NextResponse.json({ popup: null }, noStore);
  }

  if (popup.frecuencia === "UNA_VEZ") {
    const visto = await prisma.popupVista.findUnique({
      where: { popupId_version_ipHash: { popupId: popup.id, version: popup.version, ipHash: hashIp(getIp(req.headers)) } },
      select: { id: true },
    });
    if (visto) return NextResponse.json({ popup: null }, noStore);
  }

  return NextResponse.json(
    { popup: { id: popup.id, version: popup.version, titulo: popup.titulo, contenido: popup.contenido, frecuencia: popup.frecuencia } },
    noStore
  );
}

// Marca el pop-up como visto por esta IP (se llama al mostrarlo).
export async function POST(req: NextRequest) {
  const { id, version } = await req.json().catch(() => ({}));
  if (!Number.isInteger(id) || !Number.isInteger(version)) return new NextResponse(null, { status: 400 });

  await prisma.popupVista.upsert({
    where: { popupId_version_ipHash: { popupId: id, version, ipHash: hashIp(getIp(req.headers)) } },
    create: { popupId: id, version, ipHash: hashIp(getIp(req.headers)) },
    update: {},
  }).catch(() => {});

  return new NextResponse(null, { status: 204 });
}
