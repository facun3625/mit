import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const TZ = "America/Argentina/Buenos_Aires";
const OFFSET = "-03:00"; // Argentina no tiene horario de verano
const DAY = 86_400_000;

export type PeriodKey = "hoy" | "ayer" | "7d" | "30d" | "90d" | "12m" | "custom";

export const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "ayer", label: "Ayer" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "90d", label: "90 días" },
  { key: "12m", label: "12 meses" },
];

const ymd = (d: Date) => new Date(d.getTime() - 3 * 3600_000).toISOString().slice(0, 10);
const startOfDay = (s: string) => new Date(`${s}T00:00:00${OFFSET}`);

export type Range = { key: PeriodKey; from: Date; to: Date; label: string; desde: string; hasta: string };

// `to` es exclusivo. Todos los días se cuentan en hora de Argentina.
export function resolveRange(p?: string, desde?: string, hasta?: string): Range {
  const today = startOfDay(ymd(new Date()));
  const tomorrow = new Date(today.getTime() + DAY);
  const mk = (key: PeriodKey, from: Date, to: Date, label: string): Range => ({
    key, from, to, label, desde: ymd(from), hasta: ymd(new Date(to.getTime() - 1)),
  });

  const valid = (s?: string) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(startOfDay(s).getTime());
  if (p === "custom" && valid(desde) && valid(hasta)) {
    let from = startOfDay(desde!);
    let to = new Date(startOfDay(hasta!).getTime() + DAY);
    if (to <= from) [from, to] = [startOfDay(hasta!), new Date(startOfDay(desde!).getTime() + DAY)];
    return mk("custom", from, to, `${desde} → ${hasta}`);
  }
  switch (p) {
    case "hoy": return mk("hoy", today, tomorrow, "Hoy");
    case "ayer": return mk("ayer", new Date(today.getTime() - DAY), today, "Ayer");
    case "7d": return mk("7d", new Date(tomorrow.getTime() - 7 * DAY), tomorrow, "Últimos 7 días");
    case "90d": return mk("90d", new Date(tomorrow.getTime() - 90 * DAY), tomorrow, "Últimos 90 días");
    case "12m": return mk("12m", new Date(tomorrow.getTime() - 365 * DAY), tomorrow, "Últimos 12 meses");
    default: return mk("30d", new Date(tomorrow.getTime() - 30 * DAY), tomorrow, "Últimos 30 días");
  }
}

type Granularity = "hour" | "day" | "month";
const granularityFor = (r: Range): Granularity => {
  const days = (r.to.getTime() - r.from.getTime()) / DAY;
  return days <= 2 ? "hour" : days <= 125 ? "day" : "month";
};

const n = (v: unknown) => Number(v ?? 0);

async function totals(from: Date, to: Date) {
  const [t] = await prisma.$queryRaw<{ views: bigint; visitors: bigint; sessions: bigint }[]>`
    SELECT count(*) AS views, count(DISTINCT "visitorId") AS visitors, count(DISTINCT "sessionId") AS sessions
    FROM "Visita" WHERE "createdAt" >= ${from} AND "createdAt" < ${to}`;
  const [b] = await prisma.$queryRaw<{ single: bigint; total: bigint }[]>`
    SELECT count(*) FILTER (WHERE c = 1) AS single, count(*) AS total FROM (
      SELECT "sessionId", count(*) AS c FROM "Visita"
      WHERE "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY "sessionId") s`;
  const [r] = await prisma.$queryRaw<{ nuevos: bigint; total: bigint }[]>`
    SELECT count(*) FILTER (WHERE f.first >= ${from}) AS nuevos, count(*) AS total FROM (
      SELECT "visitorId", min("createdAt") AS first FROM "Visita" GROUP BY "visitorId") f
    WHERE f."visitorId" IN (SELECT "visitorId" FROM "Visita" WHERE "createdAt" >= ${from} AND "createdAt" < ${to})`;
  const views = n(t.views), sessions = n(t.sessions);
  return {
    views,
    visitors: n(t.visitors),
    sessions,
    pagesPerSession: sessions ? views / sessions : 0,
    bounce: n(b.total) ? n(b.single) / n(b.total) : 0,
    newVisitors: n(r.nuevos),
    returningVisitors: n(r.total) - n(r.nuevos),
  };
}

type Row = { label: string; value: number; extra?: number };
const rows = (r: { label: string | null; value: bigint; extra?: bigint }[]): Row[] =>
  r.map((x) => ({ label: x.label ?? "Sin datos", value: n(x.value), extra: x.extra === undefined ? undefined : n(x.extra) }));

export async function getStats(range: Range) {
  const { from, to } = range;
  const span = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - span);
  const gran = granularityFor(range);
  const W = Prisma.sql`"createdAt" >= ${from} AND "createdAt" < ${to}`;

  const series = await prisma.$queryRaw<{ t: Date; views: bigint; visitors: bigint }[]>`
    SELECT date_trunc(${gran}, ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ}) AS t,
           count(*) AS views, count(DISTINCT "visitorId") AS visitors
    FROM "Visita" WHERE ${W} GROUP BY 1 ORDER BY 1`;

  const [
    current, previous, pages, fuentes, refs, campanias, paises, regiones, ciudades,
    dispositivos, navegadores, sistemas, idiomas, heat, activos,
  ] = await Promise.all([
    totals(from, to),
    totals(prevFrom, from),
    prisma.$queryRaw<{ label: string; value: bigint; extra: bigint }[]>`
      SELECT path AS label, count(*) AS value, count(DISTINCT "visitorId") AS extra
      FROM "Visita" WHERE ${W} GROUP BY path ORDER BY value DESC LIMIT 15`,
    prisma.$queryRaw<{ label: string; value: bigint }[]>`
      SELECT fuente AS label, count(DISTINCT "sessionId") AS value
      FROM "Visita" WHERE ${W} GROUP BY fuente ORDER BY value DESC`,
    prisma.$queryRaw<{ label: string; value: bigint }[]>`
      SELECT "refHost" AS label, count(DISTINCT "sessionId") AS value
      FROM "Visita" WHERE ${W} AND "refHost" IS NOT NULL GROUP BY "refHost" ORDER BY value DESC LIMIT 12`,
    prisma.$queryRaw<{ label: string; value: bigint }[]>`
      SELECT concat_ws(' · ', "utmSource", "utmMedium", "utmCampaign") AS label, count(DISTINCT "sessionId") AS value
      FROM "Visita" WHERE ${W} AND ("utmSource" IS NOT NULL OR "utmMedium" IS NOT NULL OR "utmCampaign" IS NOT NULL)
      GROUP BY 1 ORDER BY value DESC LIMIT 10`,
    prisma.$queryRaw<{ label: string | null; value: bigint }[]>`
      SELECT pais AS label, count(DISTINCT "visitorId") AS value
      FROM "Visita" WHERE ${W} GROUP BY pais ORDER BY value DESC LIMIT 12`,
    prisma.$queryRaw<{ label: string | null; value: bigint }[]>`
      SELECT concat_ws(', ', region, pais) AS label, count(DISTINCT "visitorId") AS value
      FROM "Visita" WHERE ${W} AND region IS NOT NULL GROUP BY 1 ORDER BY value DESC LIMIT 12`,
    prisma.$queryRaw<{ label: string | null; value: bigint }[]>`
      SELECT concat_ws(', ', ciudad, region) AS label, count(DISTINCT "visitorId") AS value
      FROM "Visita" WHERE ${W} AND ciudad IS NOT NULL GROUP BY 1 ORDER BY value DESC LIMIT 12`,
    prisma.$queryRaw<{ label: string; value: bigint }[]>`
      SELECT dispositivo AS label, count(DISTINCT "sessionId") AS value FROM "Visita" WHERE ${W} GROUP BY 1 ORDER BY value DESC`,
    prisma.$queryRaw<{ label: string; value: bigint }[]>`
      SELECT navegador AS label, count(DISTINCT "sessionId") AS value FROM "Visita" WHERE ${W} GROUP BY 1 ORDER BY value DESC LIMIT 8`,
    prisma.$queryRaw<{ label: string; value: bigint }[]>`
      SELECT sistema AS label, count(DISTINCT "sessionId") AS value FROM "Visita" WHERE ${W} GROUP BY 1 ORDER BY value DESC LIMIT 8`,
    prisma.$queryRaw<{ label: string | null; value: bigint }[]>`
      SELECT lower(split_part(idioma, '-', 1)) AS label, count(DISTINCT "visitorId") AS value
      FROM "Visita" WHERE ${W} AND idioma IS NOT NULL GROUP BY 1 ORDER BY value DESC LIMIT 6`,
    prisma.$queryRaw<{ dow: number; hour: number; value: bigint }[]>`
      SELECT extract(dow FROM ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ})::int AS dow,
             extract(hour FROM ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ})::int AS hour, count(*) AS value
      FROM "Visita" WHERE ${W} GROUP BY 1, 2`,
    prisma.$queryRaw<{ value: bigint }[]>`
      SELECT count(DISTINCT "sessionId") AS value FROM "Visita" WHERE "createdAt" >= ${new Date(Date.now() - 5 * 60_000)}`,
  ]);

  // Novedades: traducir /novedades/<slug> al título
  const slugs = pages.map((p) => p.label.match(/^\/novedades\/([^/]+)$/)?.[1]).filter(Boolean) as string[];
  const titulos = slugs.length
    ? Object.fromEntries((await prisma.novedad.findMany({ where: { slug: { in: slugs } }, select: { slug: true, titulo: true } })).map((x) => [x.slug, x.titulo]))
    : {};

  // Completar huecos de la serie con ceros
  const step = gran === "hour" ? 3600_000 : DAY;
  const byKey = new Map(series.map((s) => [s.t.toISOString(), s]));
  const points: { t: string; views: number; visitors: number }[] = [];
  const startLocal = new Date(from.getTime() - 3 * 3600_000); // "reloj de pared" argentino expresado en UTC
  if (gran === "month") {
    for (const s of series) points.push({ t: s.t.toISOString(), views: n(s.views), visitors: n(s.visitors) });
  } else {
    for (let t = startLocal.getTime(); t < to.getTime() - 3 * 3600_000; t += step) {
      const k = new Date(t).toISOString();
      const s = byKey.get(k);
      points.push({ t: k, views: n(s?.views), visitors: n(s?.visitors) });
    }
  }

  const matrix = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]);
  for (const h of heat) matrix[h.dow][h.hour] = n(h.value);

  return {
    range, gran, current, previous, points, matrix,
    activos: n(activos[0]?.value),
    pages: rows(pages).map((p) => {
      const slug = p.label.match(/^\/novedades\/([^/]+)$/)?.[1];
      return { ...p, title: slug ? titulos[slug] : undefined };
    }),
    fuentes: rows(fuentes), refs: rows(refs), campanias: rows(campanias),
    paises: rows(paises), regiones: rows(regiones), ciudades: rows(ciudades),
    dispositivos: rows(dispositivos), navegadores: rows(navegadores), sistemas: rows(sistemas), idiomas: rows(idiomas),
  };
}

export type Stats = Awaited<ReturnType<typeof getStats>>;
