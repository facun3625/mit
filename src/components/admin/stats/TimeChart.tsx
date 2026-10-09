"use client";

import { useState } from "react";

type Point = { t: string; views: number; visitors: number };

const VIEWS = "#009688";
const VISITORS = "#9b6dd0";
const W = 860, H = 280, ML = 40, MR = 12, MT = 12, MB = 28;

function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

function label(t: string, gran: string, long = false) {
  const d = new Date(t);
  const tz = { timeZone: "UTC" } as const;
  if (gran === "hour") return d.toLocaleTimeString("es-AR", { ...tz, hour: "2-digit", minute: "2-digit", hour12: false });
  if (gran === "month") return d.toLocaleDateString("es-AR", { ...tz, month: "short", year: "2-digit" });
  return d.toLocaleDateString("es-AR", { ...tz, day: "numeric", month: "short", ...(long ? { weekday: "short" } : {}) });
}

export default function TimeChart({ points, gran }: { points: Point[]; gran: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = points.reduce((a, p) => a + p.views, 0);
  if (!points.length || total === 0) {
    return <div className="h-48 flex items-center justify-center text-sm text-gray-400">Todavía no hay visitas en este período.</div>;
  }

  const max = niceMax(Math.max(...points.map((p) => p.views)));
  const iw = W - ML - MR, ih = H - MT - MB;
  const x = (i: number) => ML + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => MT + ih - (v / max) * ih;
  const line = (k: "views" | "visitors") => points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
  const area = `${line("views")} L${x(points.length - 1)},${MT + ih} L${x(0)},${MT + ih} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const every = Math.max(1, Math.ceil(points.length / 7));
  const hp = hover !== null ? points[hover] : null;

  function onMove(e: React.MouseEvent<SVGRectElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * iw;
    setHover(Math.max(0, Math.min(points.length - 1, Math.round((px / iw) * (points.length - 1)))));
  }

  return (
    <div>
      <div className="flex items-center gap-5 text-xs text-gray-600 mb-3">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: VIEWS }} />Páginas vistas</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded" style={{ background: VISITORS }} />Visitantes únicos</span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Visitas en el tiempo">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={ML} x2={W - MR} y1={y(t)} y2={y(t)} stroke="#eef0f2" strokeWidth={1} />
              <text x={ML - 8} y={y(t) + 3.5} textAnchor="end" fontSize={10.5} fill="#9ca3af">{t}</text>
            </g>
          ))}
          {points.map((p, i) => i % every === 0 && (
            <text key={p.t} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10.5} fill="#9ca3af">{label(p.t, gran)}</text>
          ))}

          <path d={area} fill={VIEWS} opacity={0.1} />
          <path d={line("views")} fill="none" stroke={VIEWS} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={line("visitors")} fill="none" stroke={VISITORS} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {hp && hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={MT} y2={MT + ih} stroke="#cbd5e1" strokeWidth={1} />
              <circle cx={x(hover)} cy={y(hp.views)} r={4} fill={VIEWS} stroke="#fff" strokeWidth={2} />
              <circle cx={x(hover)} cy={y(hp.visitors)} r={4} fill={VISITORS} stroke="#fff" strokeWidth={2} />
            </g>
          )}
          <rect x={ML} y={MT} width={iw} height={ih} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
        </svg>

        {hp && hover !== null && (
          <div
            className="absolute pointer-events-none -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap z-10"
            style={{ left: `${(x(hover) / W) * 100}%`, top: 0, transform: `translateX(${hover > points.length * 0.8 ? "-100%" : hover < points.length * 0.2 ? "0%" : "-50%"})` }}
          >
            <p className="text-gray-500 mb-1">{label(hp.t, gran, true)}</p>
            <p className="flex items-center gap-1.5 text-gray-800"><span className="w-2 h-2 rounded-full" style={{ background: VIEWS }} />{hp.views.toLocaleString("es-AR")} páginas vistas</p>
            <p className="flex items-center gap-1.5 text-gray-800"><span className="w-2 h-2 rounded-full" style={{ background: VISITORS }} />{hp.visitors.toLocaleString("es-AR")} visitantes</p>
          </div>
        )}
      </div>

      <details className="mt-3 text-xs text-gray-500">
        <summary className="cursor-pointer hover:text-gray-700 select-none">Ver como tabla</summary>
        <div className="max-h-56 overflow-auto mt-2 border border-gray-100 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 sticky top-0"><tr><th className="px-3 py-1.5 font-medium">Fecha</th><th className="px-3 py-1.5 font-medium text-right">Páginas vistas</th><th className="px-3 py-1.5 font-medium text-right">Visitantes</th></tr></thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.t} className="border-t border-gray-100"><td className="px-3 py-1.5">{label(p.t, gran, true)}</td><td className="px-3 py-1.5 text-right tabular-nums">{p.views}</td><td className="px-3 py-1.5 text-right tabular-nums">{p.visitors}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
