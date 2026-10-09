import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export function Card({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] ${className}`}>
      <header className="mb-4">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

export function Kpi({ label, value, prev, format = (v) => v.toLocaleString("es-AR"), invert = false, hint }: {
  label: string; value: number; prev?: number; format?: (v: number) => string; invert?: boolean; hint?: string;
}) {
  const hasPrev = prev !== undefined;
  const delta = hasPrev && prev > 0 ? ((value - prev) / prev) * 100 : null;
  const good = delta === null ? null : invert ? delta < 0 : delta > 0;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <p className="text-3xl font-light text-gray-900 tabular-nums">{format(value)}</p>
      <p className="text-xs mt-2 h-4 flex items-center gap-1 text-gray-400">
        {delta === null ? (
          hint ?? (hasPrev ? "Sin datos previos" : "")
        ) : delta === 0 ? (
          <><Minus size={12} /> igual que el período anterior</>
        ) : (
          <span className={`flex items-center gap-1 ${good ? "text-emerald-600" : "text-red-500"}`}>
            {delta > 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(delta).toFixed(0)}% <span className="text-gray-400">vs. período anterior</span>
          </span>
        )}
      </p>
    </div>
  );
}

export function BarList({ rows, total, empty = "Sin datos en este período.", format }: {
  rows: { label: string; value: number; sub?: string }[];
  total?: number;
  empty?: string;
  format?: (l: string) => string;
}) {
  if (!rows.length) return <p className="text-sm text-gray-400 py-6 text-center">{empty}</p>;
  const sum = total ?? rows.reduce((a, r) => a + r.value, 0);
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="group">
          <div className="flex items-baseline justify-between gap-3 text-sm mb-1">
            <span className="truncate text-gray-700" title={r.label}>
              {format ? format(r.label) : r.label}
              {r.sub && <span className="block text-[11px] text-gray-400 truncate">{r.sub}</span>}
            </span>
            <span className="tabular-nums text-gray-800 flex-shrink-0">
              {r.value.toLocaleString("es-AR")}
              {sum > 0 && <span className="text-gray-400 text-xs ml-1.5">{Math.round((r.value / sum) * 100)}%</span>}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-[#009688] group-hover:bg-[#00796b] transition-colors" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function Heatmap({ matrix }: { matrix: number[][] }) {
  const max = Math.max(1, ...matrix.flat());
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[520px]">
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: "32px repeat(24, minmax(0, 1fr))" }}>
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} className="text-[10px] text-gray-400 text-center">{h % 3 === 0 ? h : ""}</span>
          ))}
          {ORDER.map((d) => (
            <div key={d} className="contents">
              <span className="text-[11px] text-gray-500 flex items-center">{DAYS[d]}</span>
              {matrix[d].map((v, h) => (
                <span
                  key={h}
                  title={`${DAYS[d]} ${h}:00 — ${v} visitas`}
                  className="aspect-square rounded-[3px] bg-[#009688]"
                  style={{ opacity: v === 0 ? 0.06 : 0.15 + 0.85 * (v / max) }}
                />
              ))}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Horas en horario de Argentina · más oscuro = más visitas</p>
      </div>
    </div>
  );
}
