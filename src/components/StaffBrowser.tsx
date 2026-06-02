"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, UserRound, MapPin, X, Stethoscope, ChevronRight, SlidersHorizontal, ChevronLeft } from "lucide-react";

type Especialidad = { id: number; nombre: string };
type Sede = { id: number; nombre: string };
type Doctor = {
  id: number;
  nombre: string;
  foto: string | null;
  texto: string | null;
  especialidades: { especialidad: Especialidad }[];
  sedes: { sede: Sede }[];
};

const PAGE_SIZE = 30;

// ── Modal ─────────────────────────────────────────────────────────────────────

function DoctorModal({ doc, onClose }: { doc: Doctor; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center" style={{ height: doc.foto ? 220 : 120 }}>
          {doc.foto
            ? <Image src={doc.foto} alt={doc.nombre} fill className="object-cover object-top rounded-t-2xl" />
            : <UserRound size={64} strokeWidth={0.6} className="text-gray-200" />
          }
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-500 rounded-full shadow-sm transition-all">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="px-7 pb-7 pt-5">
          <h2 className="text-xl font-medium text-gray-800 mb-2">{doc.nombre}</h2>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {doc.especialidades.map(({ especialidad }) => (
              <span key={especialidad.id} className="text-[10px] font-medium bg-mit-teal/10 text-mit-teal px-2.5 py-0.5 rounded-full">{especialidad.nombre}</span>
            ))}
          </div>
          {doc.texto && (
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-5 border-l-2 border-mit-teal/30 pl-3">{doc.texto}</p>
          )}
          <div className="pt-4 border-t border-gray-100 space-y-1.5">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-300 mb-2 flex items-center gap-1.5">
              <Stethoscope size={10} strokeWidth={1.5} /> Atiende en
            </p>
            {doc.sedes.map(({ sede }) => (
              <div key={sede.id} className="flex items-center gap-2 text-xs text-gray-500 font-light">
                <MapPin size={11} strokeWidth={1.5} className="text-mit-teal flex-shrink-0" />
                {sede.nombre}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Checkbox item ─────────────────────────────────────────────────────────────

function CheckItem({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
        checked ? "bg-mit-teal border-mit-teal" : "border-gray-200 group-hover:border-mit-teal/50"
      }`} onClick={onChange}>
        {checked && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`text-xs font-light transition-colors flex-1 ${checked ? "text-gray-700" : "text-gray-400 group-hover:text-gray-600"}`}>{label}</span>
      {count !== undefined && <span className="text-[10px] text-gray-300 font-light">{count}</span>}
    </label>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-mit-teal/40 hover:text-mit-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-300">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-light transition-all ${
              p === page
                ? "bg-mit-teal text-white border border-mit-teal"
                : "border border-gray-200 text-gray-500 hover:border-mit-teal/40 hover:text-mit-teal"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-mit-teal/40 hover:text-mit-teal disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StaffBrowser({ doctors, sedes }: { doctors: Doctor[]; sedes: Sede[] }) {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [query, setQuery] = useState("");
  const [sedesChecked, setSedesChecked] = useState<Set<number>>(new Set(sedes.map((s) => s.id)));
  const [espsChecked, setEspsChecked] = useState<Set<number>>(new Set());
  const [espsInitialized, setEspsInitialized] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Especialidades disponibles según sedes seleccionadas
  const availableEsps = useMemo<Especialidad[]>(() => {
    const map = new Map<number, Especialidad>();
    for (const doc of doctors) {
      const inSede = doc.sedes.some((s) => sedesChecked.has(s.sede.id));
      if (inSede) {
        for (const { especialidad } of doc.especialidades) {
          if (!map.has(especialidad.id)) map.set(especialidad.id, especialidad);
        }
      }
    }
    return [...map.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [doctors, sedesChecked]);

  // Al cambiar sedes, resetear especialidades al nuevo available set
  const allEspIds = useMemo(() => new Set(availableEsps.map((e) => e.id)), [availableEsps]);

  // Inicializar esps cuando estén disponibles
  if (!espsInitialized && availableEsps.length > 0) {
    setEspsChecked(new Set(availableEsps.map((e) => e.id)));
    setEspsInitialized(true);
  }

  function resetPage() { setPage(1); }

  function toggleSede(id: number) {
    const next = new Set(sedesChecked);
    next.has(id) ? next.delete(id) : next.add(id);
    setSedesChecked(next);
    // Reset especialidades al nuevo available set
    setEspsInitialized(false);
    resetPage();
  }

  function toggleAllSedes() {
    if (sedesChecked.size === sedes.length) {
      setSedesChecked(new Set([sedes[0].id])); // al menos 1
    } else {
      setSedesChecked(new Set(sedes.map((s) => s.id)));
    }
    setEspsInitialized(false);
    resetPage();
  }

  function toggleEsp(id: number) {
    const next = new Set(espsChecked);
    next.has(id) ? next.delete(id) : next.add(id);
    setEspsChecked(next);
    resetPage();
  }

  function toggleAllEsps() {
    setEspsChecked(espsChecked.size === allEspIds.size ? new Set() : new Set(allEspIds));
    resetPage();
  }

  function handleQuery(val: string) {
    setQuery(val);
    resetPage();
  }

  // Doctores filtrados
  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      if (query && !doc.nombre.toLowerCase().includes(query.toLowerCase())) return false;
      if (!doc.sedes.some((s) => sedesChecked.has(s.sede.id))) return false;
      if (espsChecked.size > 0 && !doc.especialidades.some((e) => espsChecked.has(e.especialidad.id))) return false;
      return true;
    });
  }, [doctors, query, sedesChecked, espsChecked]);

  // Paginación: solo afecta la grilla
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Conteo por sede
  const countBySede = useMemo(() => {
    const m = new Map<number, number>();
    for (const doc of doctors) {
      for (const { sede } of doc.sedes) {
        m.set(sede.id, (m.get(sede.id) ?? 0) + 1);
      }
    }
    return m;
  }, [doctors]);

  // Conteo por especialidad (dentro de sedes seleccionadas)
  const countByEsp = useMemo(() => {
    const m = new Map<number, number>();
    for (const doc of doctors) {
      if (!doc.sedes.some((s) => sedesChecked.has(s.sede.id))) continue;
      for (const { especialidad } of doc.especialidades) {
        m.set(especialidad.id, (m.get(especialidad.id) ?? 0) + 1);
      }
    }
    return m;
  }, [doctors, sedesChecked]);

  const activeFilters = (sedesChecked.size < sedes.length ? 1 : 0) + (espsChecked.size < allEspIds.size ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

      {/* Mobile: buscador + toggle filtros */}
      <div className="md:hidden w-full flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Buscar médico..."
            className="w-full pl-8 pr-3 py-2.5 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mit-teal/50 transition-colors placeholder-gray-300"
          />
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-light transition-all flex-shrink-0 ${
            filtersOpen || activeFilters > 0 ? "bg-mit-teal/10 border-mit-teal/30 text-mit-teal" : "border-gray-200 text-gray-500"
          }`}
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} />
          Filtros
          {activeFilters > 0 && <span className="w-4 h-4 rounded-full bg-mit-teal text-white text-[9px] flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside className={`w-full md:w-60 flex-shrink-0 md:sticky md:top-24 space-y-6 ${filtersOpen ? "block" : "hidden md:block"}`}>

        {/* Buscador (desktop only — mobile está arriba) */}
        <div className="relative hidden md:block">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQuery(e.target.value)}
            placeholder="Buscar médico..."
            className="w-full pl-8 pr-3 py-2.5 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-mit-teal/50 transition-colors placeholder-gray-300"
          />
          {query && (
            <button onClick={() => handleQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <X size={12} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Sedes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-400">Sedes</p>
            <button onClick={toggleAllSedes} className="text-[10px] text-mit-teal hover:underline font-light">
              {sedesChecked.size === sedes.length ? "Ninguna" : "Todas"}
            </button>
          </div>
          <div className="space-y-0.5">
            {sedes.map((s) => (
              <CheckItem
                key={s.id}
                label={s.nombre}
                checked={sedesChecked.has(s.id)}
                onChange={() => toggleSede(s.id)}
                count={countBySede.get(s.id) ?? 0}
              />
            ))}
          </div>
        </div>

        {/* Especialidades */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-400">Especialidades</p>
            <button onClick={toggleAllEsps} className="text-[10px] text-mit-teal hover:underline font-light">
              {espsChecked.size === allEspIds.size ? "Ninguna" : "Todas"}
            </button>
          </div>
          <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
            {availableEsps.map((e) => (
              <CheckItem
                key={e.id}
                label={e.nombre}
                checked={espsChecked.has(e.id)}
                onChange={() => toggleEsp(e.id)}
                count={countByEsp.get(e.id) ?? 0}
              />
            ))}
          </div>
        </div>

      </aside>

      {/* ── Lista ── */}
      <div className="flex-1 min-w-0">
        {/* Contador + info de página */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400 font-light">
            {filtered.length} médico{filtered.length !== 1 ? "s" : ""}
            {query && <span> para &ldquo;<span className="text-gray-600">{query}</span>&rdquo;</span>}
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-gray-300 font-light">
              Página {safePage} de {totalPages}
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <UserRound size={40} strokeWidth={1} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-light">Sin resultados.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
              {paginated.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelected(doc)}
                  className="group bg-white hover:bg-gray-50/80 transition-colors text-left px-5 py-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {doc.foto
                      ? <Image src={doc.foto} alt={doc.nombre} width={36} height={36} className="object-cover object-top w-full h-full" />
                      : <UserRound size={15} strokeWidth={1} className="text-gray-300" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{doc.nombre}</p>
                    <p className="text-[10px] text-mit-teal font-light truncate mt-0.5">
                      {doc.especialidades[0]?.especialidad.nombre ?? ""}
                      {doc.especialidades.length > 1 && ` · +${doc.especialidades.length - 1}`}
                    </p>
                    {doc.texto && <p className="text-[10px] text-gray-400 font-light truncate mt-0.5">{doc.texto}</p>}
                  </div>
                  <ChevronRight size={12} strokeWidth={1.5} className="text-gray-200 group-hover:text-mit-teal transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>

            <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>

      {selected && <DoctorModal doc={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
