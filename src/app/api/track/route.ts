import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { classifySource, geoFromHeaders, getIp, hashIp, isBot, lookupGeo, parseUserAgent } from "@/lib/visitor";

const str = (v: unknown, max: number) => (typeof v === "string" && v ? v.slice(0, max) : null);

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  // No se cuentan bots ni las visitas de quien está logueado como admin.
  if (isBot(ua) || req.cookies.get("mit_session")) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return new NextResponse(null, { status: 400 }); }

  const path = str(body.path, 300);
  const visitorId = str(body.visitorId, 64);
  const sessionId = str(body.sessionId, 64);
  if (!path || !path.startsWith("/") || path.startsWith("/admin") || !visitorId || !sessionId) {
    return new NextResponse(null, { status: 400 });
  }

  const referrer = str(body.referrer, 500);
  let refHost: string | null = null;
  if (referrer) {
    try { refHost = new URL(referrer).hostname.replace(/^www\./, ""); } catch {}
  }
  // Navegación interna o desde el propio sitio = no es una fuente externa.
  if (refHost && refHost === req.nextUrl.hostname.replace(/^www\./, "")) refHost = null;

  const utmSource = str(body.utmSource, 100);
  const utmMedium = str(body.utmMedium, 100);
  const ip = getIp(req.headers);
  const geo = geoFromHeaders(req.headers);

  const data = {
    path,
    visitorId,
    sessionId,
    ipHash: hashIp(ip),
    referrer,
    refHost,
    fuente: classifySource({ refHost, utmSource, utmMedium }),
    utmSource,
    utmMedium,
    utmCampaign: str(body.utmCampaign, 150),
    ...parseUserAgent(ua),
    idioma: str(body.idioma, 20),
    ...geo,
  };

  const created = await prisma.visita.create({ data, select: { id: true } });

  if (!geo.pais) {
    after(async () => {
      const found = await lookupGeo(ip);
      if (found) await prisma.visita.update({ where: { id: created.id }, data: found });
    });
  }

  return new NextResponse(null, { status: 204 });
}
