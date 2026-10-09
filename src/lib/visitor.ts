import { createHash } from "crypto";

const SALT = process.env.SESSION_SECRET ?? "mit-admin-secret-change-in-production";

export function getIp(headers: Headers): string {
  // x-real-ip lo fija nginx; el primer valor de x-forwarded-for puede venir falseado por el cliente.
  const fwd = headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  return headers.get("cf-connecting-ip") || headers.get("x-real-ip") || fwd || "0.0.0.0";
}

// Nunca se guarda la IP en crudo: solo este hash.
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex").slice(0, 32);
}

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless|curl|wget|python-requests|monitor|uptime|pingdom/i;
export const isBot = (ua: string) => !ua || BOT.test(ua);

export function parseUserAgent(ua: string) {
  const dispositivo = /ipad|tablet|(android(?!.*mobile))/i.test(ua)
    ? "TABLET"
    : /mobi|iphone|ipod|android/i.test(ua)
      ? "MOBILE"
      : "DESKTOP";

  const navegador =
    /edg(e|a|ios)?\//i.test(ua) ? "Edge"
    : /opr\/|opera/i.test(ua) ? "Opera"
    : /samsungbrowser/i.test(ua) ? "Samsung Internet"
    : /firefox|fxios/i.test(ua) ? "Firefox"
    : /chrome|crios/i.test(ua) ? "Chrome"
    : /safari/i.test(ua) ? "Safari"
    : "Otro";

  const sistema =
    /windows/i.test(ua) ? "Windows"
    : /iphone|ipad|ipod/i.test(ua) ? "iOS"
    : /android/i.test(ua) ? "Android"
    : /mac os x|macintosh/i.test(ua) ? "macOS"
    : /cros/i.test(ua) ? "ChromeOS"
    : /linux/i.test(ua) ? "Linux"
    : "Otro";

  return { dispositivo, navegador, sistema };
}

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|baidu|yandex|brave|startpage)\./i;
const SOCIAL = /(^|\.)(facebook|instagram|twitter|x|t|linkedin|lnkd|youtube|youtu|tiktok|whatsapp|wa|pinterest|reddit|telegram)\.(com|co|be|me|in|org)$/i;

export function classifySource(opts: { refHost: string | null; utmSource?: string | null; utmMedium?: string | null }) {
  const { refHost, utmSource, utmMedium } = opts;
  if (utmSource || utmMedium) return "CAMPANIA";
  if (!refHost) return "DIRECTO";
  if (SEARCH.test(refHost)) return "BUSCADOR";
  if (SOCIAL.test(refHost) || /^l\.facebook|^lm\.facebook|^m\.facebook/.test(refHost)) return "SOCIAL";
  return "REFERIDO";
}

type Geo = { pais: string | null; region: string | null; ciudad: string | null };

const dec = (v: string | null) => {
  if (!v) return null;
  try { return decodeURIComponent(v); } catch { return v; }
};

export function geoFromHeaders(h: Headers): Geo {
  const pais = h.get("cf-ipcountry") || h.get("x-vercel-ip-country") || h.get("x-country-code");
  return {
    pais: pais && pais !== "XX" && pais !== "T1" ? pais.toUpperCase() : null,
    region: dec(h.get("x-vercel-ip-country-region") || h.get("cf-region")),
    ciudad: dec(h.get("x-vercel-ip-city") || h.get("cf-ipcity")),
  };
}

const isPrivateIp = (ip: string) =>
  ip === "0.0.0.0" || ip === "::1" || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fc|fd|fe80)/i.test(ip);

const geoCache = new Map<string, Geo>();

// Opcional: consulta un servicio externo (ipwho.is) enviándole la IP del visitante.
// Está apagado por defecto; se activa con GEOIP_LOOKUP=on.
export async function lookupGeo(ip: string): Promise<Geo | null> {
  if (process.env.GEOIP_LOOKUP !== "on" || isPrivateIp(ip)) return null;
  const hit = geoCache.get(ip);
  if (hit) return hit;
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code,region,city`, {
      signal: AbortSignal.timeout(1500),
    });
    const d = await res.json();
    if (!d.success) return null;
    const geo: Geo = { pais: d.country_code ?? null, region: d.region ?? null, ciudad: d.city ?? null };
    if (geoCache.size > 5000) geoCache.clear();
    geoCache.set(ip, geo);
    return geo;
  } catch {
    return null;
  }
}
