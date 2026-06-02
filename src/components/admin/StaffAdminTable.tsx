"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Pencil, Eye, EyeOff, UserRound, X } from "lucide-react";
import { toggleDoctor } from "@/app/actions/staff";
import DeleteDoctorButton from "@/components/admin/DeleteDoctorButton";

type Especialidad = { id: number; nombre: string };
type Sede = { id: number; nombre: string };
type Doctor = {
  id: number;
  nombre: string;
  foto: string | null;
  orden: number;
  activo: boolean;
  especialidades: { especialidad: Especialidad }[];
  sedes: { sede: Sede }[];
};

export default function StaffAdminTable({
  doctors,
  allSedes,
  allEsps,
}: {
  doctors: Doctor[];
  allSedes: Sede[];
  allEsps: Especialidad[];
}) {
  const [query, setQuery] = useState("");
  const [sedeFilter, setSedeFilter] = useState("");
  const [espFilter, setEspFilter] = useState("");

  const filtered = useMemo(() => {
    return doctors.filter((doc) => {
      if (query && !doc.nombre.toLowerCase().includes(query.toLowerCase())) return false;
      if (sedeFilter && !doc.sedes.some((s) => s.sede.id === parseInt(sedeFilter))) return false;
      if (espFilter && !doc.especialidades.some((e) => e.especialidad.id === parseInt(espFilter))) return false;
      return true;
    });
  }, [doctors, query, sedeFilter, espFilter]);

  const hasFilter = query || sedeFilter || espFilter;

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Buscador */}
        <div className="relative flex-1 min-w-48">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar médico..."
            className="w-full pl-8 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-mit-teal/40 transition-all font-light"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50">
              <X size={12} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Sede */}
        <select
          value={sedeFilter}
          onChange={(e) => setSedeFilter(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/50 focus:outline-none focus:border-mit-teal/40 transition-all font-light"
        >
          <option value="">Todas las sedes</option>
          {allSedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>

        {/* Especialidad */}
        <select
          value={espFilter}
          onChange={(e) => setEspFilter(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/50 focus:outline-none focus:border-mit-teal/40 transition-all font-light"
        >
          <option value="">Todas las especialidades</option>
          {allEsps.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>

        {hasFilter && (
          <button
            onClick={() => { setQuery(""); setSedeFilter(""); setEspFilter(""); }}
            className="text-xs text-white/25 hover:text-white/50 transition-colors font-light"
          >
            Limpiar
          </button>
        )}

        <span className="text-xs text-white/20 font-light ml-auto">
          {filtered.length} de {doctors.length}
        </span>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-12 text-center">
          <UserRound size={36} strokeWidth={1} className="text-white/15 mx-auto mb-3" />
          <p className="text-white/25 text-sm font-light">Sin resultados.</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-[10px] font-medium tracking-[0.15em] uppercase text-white/30">Médico</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium tracking-[0.15em] uppercase text-white/30 hidden md:table-cell">Especialidades</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium tracking-[0.15em] uppercase text-white/30 hidden lg:table-cell">Sedes</th>
                <th className="text-left px-5 py-3 text-[10px] font-medium tracking-[0.15em] uppercase text-white/30">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr
                  key={doc.id}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {doc.foto ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                          <Image src={doc.foto} alt={doc.nombre} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/[0.07] flex items-center justify-center flex-shrink-0">
                          <UserRound size={16} strokeWidth={1.5} className="text-white/30" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-white/80 font-light">{doc.nombre}</p>
                        {doc.orden > 0 && <p className="text-[10px] text-white/25">orden {doc.orden}</p>}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {doc.especialidades.slice(0, 2).map(({ especialidad }) => (
                        <span key={especialidad.id} className="text-[10px] bg-[#5f2c82]/25 text-[#c084fc] px-2 py-0.5 rounded-full">
                          {especialidad.nombre}
                        </span>
                      ))}
                      {doc.especialidades.length > 2 && (
                        <span className="text-[10px] text-white/25">+{doc.especialidades.length - 2}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {doc.sedes.slice(0, 2).map(({ sede }) => (
                        <span key={sede.id} className="text-[10px] bg-mit-teal/10 text-mit-teal px-2 py-0.5 rounded-full">
                          {sede.nombre}
                        </span>
                      ))}
                      {doc.sedes.length > 2 && (
                        <span className="text-[10px] text-white/25">+{doc.sedes.length - 2}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <form action={toggleDoctor.bind(null, doc.id, !doc.activo)}>
                      <button
                        type="submit"
                        className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                          doc.activo
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-white/[0.05] text-white/25 hover:bg-white/[0.09]"
                        }`}
                      >
                        {doc.activo ? <Eye size={11} strokeWidth={1.5} /> : <EyeOff size={11} strokeWidth={1.5} />}
                        {doc.activo ? "Activo" : "Oculto"}
                      </button>
                    </form>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/staff/${doc.id}`}
                        className="p-1.5 text-white/25 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-all"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </Link>
                      <DeleteDoctorButton id={doc.id} nombre={doc.nombre} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
