import Link from "next/link";
import { Download, Activity } from "lucide-react";
import { getStats, resolveRange, PERIODS } from "@/lib/stats";
import TimeChart from "@/components/admin/stats/TimeChart";
import { BarList, Card, Heatmap, Kpi } from "@/components/admin/stats/parts";

const FUENTES: Record<string, string> = {
  DIRECTO: "Directo (escribió la dirección o app)",
  BUSCADOR: "Buscadores (Google, Bing…)",
  SOCIAL: "Redes sociales",
  REFERIDO: "Otros sitios web",
  CAMPANIA: "Campañas (con UTM)",
};
const DISPOSITIVOS: Record<string, string> = { MOBILE: "Celular", TABLET: "Tablet", DESKTOP: "Computadora" };

const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
const langNames = new Intl.DisplayNames(["es"], { type: "language" });
const safe = (fn: () => string | undefined, fallback: string) => { try { return fn() ?? fallback; } catch { return fallback; } };

const dur = (v: number) => v.toFixed(1).replace(".", ",");

export default async function EstadisticasPage({ searchParams }: { searchParams: Promise<{ p?: string; desde?: string; hasta?: string }> }) {
  const sp = await searchParams;
  const range = resolveRange(sp.p, sp.desde, sp.hasta);
  const s = await getStats(range);
  const { current: c, previous: pv } = s;
  const exportHref = `/admin/estadisticas/export?p=${range.key}&desde=${range.desde}&hasta=${range.hasta}`;
  const sinGeo = s.paises.length === 0 || (s.paises.length === 1 && s.paises[0].label === "Sin datos");

  return (
    <div className="p-4 sm:p-8 max-w-6xl w-full">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-xs font-medium tracking-[0.2em] uppercase mb-1">Sitio web</p>
          <h1 className="text-gray-900 text-2xl font-light">Estadísticas de visitas</h1>
          <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
            {range.label}
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
              <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" /></span>
              {s.activos} {s.activos === 1 ? "persona" : "personas"} en el sitio ahora
            </span>
          </p>
        </div>
        <a href={exportHref} className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-900 px-3.5 py-2 rounded-lg transition-colors">
          <Download size={14} strokeWidth={1.5} /> Exportar CSV
        </a>
      </div>

      {/* Selector de período */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="inline-flex flex-wrap bg-white border border-gray-200 rounded-xl p-1 gap-0.5">
          {PERIODS.map((p) => (
            <Link
              key={p.key}
              href={`/admin/estadisticas?p=${p.key}`}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${range.key === p.key ? "bg-mit-teal text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {p.label}
            </Link>
          ))}
        </div>
        <form action="/admin/estadisticas" className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 pl-3">
          <input type="hidden" name="p" value="custom" />
          <span className="text-xs text-gray-500">Personalizado</span>
          <input type="date" name="desde" defaultValue={range.desde} max={range.hasta} required className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-mit-teal" />
          <span className="text-gray-400 text-xs">a</span>
          <input type="date" name="hasta" defaultValue={range.hasta} required className="text-sm text-gray-700 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-mit-teal" />
          <button className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${range.key === "custom" ? "bg-mit-teal text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Aplicar</button>
        </form>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <Kpi label="Páginas vistas" value={c.views} prev={pv.views} />
        <Kpi label="Visitantes únicos" value={c.visitors} prev={pv.visitors} />
        <Kpi label="Sesiones" value={c.sessions} prev={pv.sessions} />
        <Kpi label="Páginas por sesión" value={c.pagesPerSession} prev={pv.pagesPerSession} format={dur} />
        <Kpi label="Rebote" value={c.bounce * 100} prev={pv.bounce * 100} format={(v) => `${v.toFixed(0)}%`} invert hint="Se fueron tras 1 página" />
        <Kpi label="Visitantes nuevos" value={c.newVisitors} prev={undefined} hint={`${c.returningVisitors} recurrentes`} />
      </div>

      {/* Evolución */}
      <Card title="Evolución de visitas" subtitle={s.gran === "hour" ? "Por hora" : s.gran === "day" ? "Por día" : "Por mes"} className="mb-6">
        <TimeChart points={s.points} gran={s.gran} />
      </Card>

      {/* Origen */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card title="¿Cómo llegan?" subtitle="Sesiones según el origen de la visita">
          <BarList rows={s.fuentes} format={(l) => FUENTES[l] ?? l} />
        </Card>
        <Card title="Sitios que nos envían visitas" subtitle="Páginas desde las que hicieron clic para llegar">
          <BarList rows={s.refs} empty="Todavía no hay visitas que vengan de otros sitios." />
        </Card>
      </div>

      {s.campanias.length > 0 && (
        <Card title="Campañas" subtitle="Enlaces con parámetros utm_source · utm_medium · utm_campaign" className="mb-6">
          <BarList rows={s.campanias} />
        </Card>
      )}

      {/* Ubicación */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card title="Países" subtitle="Visitantes únicos">
          <BarList rows={s.paises} format={(l) => l === "Sin datos" ? "Sin datos" : safe(() => regionNames.of(l), l)} />
        </Card>
        <Card title="Provincias / regiones">
          <BarList rows={s.regiones} empty="Sin datos de región." format={(l) => l} />
        </Card>
        <Card title="Ciudades">
          <BarList rows={s.ciudades} empty="Sin datos de ciudad." />
        </Card>
      </div>
      {sinGeo && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mb-6">
          Todavía no hay datos de ubicación. Se resuelven en el servidor contra la base local GeoLite2 (<code className="px-1 bg-white/70 rounded">data/GeoLite2-City.mmdb</code>); si falta ese archivo, bajalo con <code className="px-1 bg-white/70 rounded">bash scripts/update-geolite2.sh</code>.
        </p>
      )}

      {/* Páginas */}
      <Card title="Páginas más vistas" className="mb-6">
        <BarList
          rows={s.pages.map((p) => ({ label: p.title ?? (p.label === "/" ? "Inicio" : p.label), value: p.value, sub: p.title || p.label !== "/" ? p.label : undefined }))}
          total={c.views}
        />
      </Card>

      {/* Dispositivos */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card title="Dispositivos"><BarList rows={s.dispositivos} format={(l) => DISPOSITIVOS[l] ?? l} /></Card>
        <Card title="Navegadores"><BarList rows={s.navegadores} /></Card>
        <Card title="Sistemas operativos"><BarList rows={s.sistemas} /></Card>
        <Card title="Idioma del navegador"><BarList rows={s.idiomas} format={(l) => safe(() => langNames.of(l), l)} /></Card>
      </div>

      {/* Horarios */}
      <Card title="¿Cuándo nos visitan?" subtitle="Páginas vistas por día de la semana y hora">
        <Heatmap matrix={s.matrix} />
      </Card>

      <p className="text-[11px] text-gray-400 mt-6 flex items-center gap-1.5">
        <Activity size={11} /> No se cuentan bots ni las visitas hechas con una sesión de administrador. Las IP no se guardan, solo un hash irreversible.
      </p>
    </div>
  );
}
